import { HttpStatus } from "../../core/utils/statuscodes.js";
import { UnAuthorizedError } from "../../core/errors/unAuthorizedError.js";
import { ForbiddenError } from "../../core/errors/forbiddenError.js";
import { config } from "../../core/config/env.js";
import { AppMessages } from "../../core/common/appmessages.js";
import { extractTokenDetails } from "../services/token.js";

class AuthGuard {
  async guard(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        code: HttpStatus.UNAUTHORIZED,
        message: "Authorization header is required",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        code: HttpStatus.UNAUTHORIZED,
        message: "Token is required",
      });
    }

    const { accessTokenSecret } = config.auth;

    try {
      const user = await extractTokenDetails(token, accessTokenSecret);

      if (!user.is_verified) {
        return res.status(HttpStatus.FORBIDDEN).json({
          code: HttpStatus.FORBIDDEN,
          message:
            "You cannot access this endpoint until your email is verified by Admin, After verification login again.",
        });
      }

      req.user = user;
      next();
    } catch (error) {
      if (error instanceof UnAuthorizedError) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          code: HttpStatus.UNAUTHORIZED,
          message: error.message,
        });
      } else {
        return res.status(HttpStatus.FORBIDDEN).json({
          code: HttpStatus.FORBIDDEN,
          message: AppMessages.FAILURE.FORBIDDEN_RESOURCE,
        });
      }
    }
  }
}

const authGuard = new AuthGuard();
export { authGuard };
