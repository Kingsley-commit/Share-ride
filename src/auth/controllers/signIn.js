import { config } from "../../core/config/env.js";
import { sanitizeUser } from "../../core/utils/sanitize.js";
import { comparePassword } from "../../core/utils/bcrypt.js";
import { logger } from "../../core/loggers/logger.js";
import { AppMessages } from "../../core/common/appmessages.js";
import { ApiError } from "../../core/errors/apiErrors.js";
import { InternalServerError } from "../../core/errors/internalServerError.js";
import Auth from "../model/auth.model.js";
import User from "../../user/model/user.js";
import { getTokens } from "../services/token.js";
import { HttpStatus } from "../../core/utils/statuscodes.js";
import Admin from "../../user/model/admin.js";
import { VehicleService } from "../../user/driver/services/vehicle.services.js";
// Constructor replacement for SignInService
const refreshTokenExpTime = config.auth.refreshTokenExpTime;

/**
 * Handles user login, performs necessary validations, and generates tokens for authentication.
 *
 * @param {Request} req - The input request object.
 * @param {Response} res - The response object.
 * @returns {Promise<any>} The API response containing authentication tokens and user data.
 * @throws {UnAuthorizedError} Thrown if login credentials are invalid or user email is not verified.
 */
async function signIn(req, res, next) {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ where: { email } });

    let userType;
    [];

    if (user) {
      userType = user.type;
    }

    if (!user) {
      user = await Admin.findOne({ where: { email } });
      if (user) {
        userType = "admin";
      }
    }

    if (!user) {
      logger.error(AppMessages.FAILURE.INVALID_CREDENTIALS);
      return res.status(400).json({
        code: HttpStatus.BAD_REQUEST,
        message: AppMessages.FAILURE.INVALID_CREDENTIALS,
      });
    }

    if (!user.email_verified) {
      logger.error(AppMessages.FAILURE.EMAIL_NOT_VERIFIED);
      return res.json({
        code: HttpStatus.BAD_REQUEST,
        message: AppMessages.FAILURE.EMAIL_NOT_VERIFIED,
      });
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      logger.error(AppMessages.FAILURE.INVALID_CREDENTIALS);
      return res.json({
        code: HttpStatus.UNAUTHORIZED,
        message: AppMessages.FAILURE.INVALID_CREDENTIALS,
      });
    }

    const [accessToken, refreshToken] = await getTokens({
      id: user.id,
      email: user.email,
      type: userType,
      is_verified: user.is_verified,
    });

    let expireAt = new Date();
    expireAt.setSeconds(
      expireAt.getSeconds() + parseInt(refreshTokenExpTime.slice(0, -1)) * 60
    );

    await Auth.update(
      {
        refreshToken: refreshToken,
        refreshTokenExp: expireAt,
      },
      { where: { userId: user.id } }
    );

    const vechile = await VehicleService.getVehicleByOwnerId(user.id);

    logger.info(AppMessages.SUCCESS.LOGIN);

    return res.json({
      code: HttpStatus.OK,
      message: AppMessages.SUCCESS.LOGIN,
      data: {
        accessToken,
        refreshToken,
        user: sanitizeUser(user),
        vechile: vechile,
      },
    });
  } catch (error) {
    logger.error(error.message);
    next(
      error instanceof ApiError ? error : new InternalServerError(error.message)
    );
  }
}

export { signIn };
