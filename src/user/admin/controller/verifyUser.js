import User from "../../model/user.js";
import { InternalServerError } from "../../../core/errors/internalServerError.js";
import { RouteNotFoundError } from "../../../core/errors/notFoundError.js";
import { BadRequestError } from "../../../core/errors/BadRequestError.js";
import { ForbiddenError } from "../../../core/errors/forbiddenError.js"
import { ApiError } from "../../../core/errors/apiErrors.js";
import { logger } from "../../../core/loggers/logger.js";
import { notifyUser } from "../../../core/utils/mailsender.js";
import { decode } from "../../../core/utils/jwt.js";


export const verifyUser = async (req, res, next) => {

  // const curruser = req.user;

  // if (curruser.type !== "admin") {
  //   return next(
  //     new ForbiddenError("You are not authorized to perform this action")
  //   );
  // }
  const { token } = req.query;

  try {

    const decoded = decode(token)

    const user = await User.findOne({ where: { id: decoded.userid } });


    if (!user) {
      return next( new RouteNotFoundError("User not found"));
    }

    if (user.is_verified) {
      return res.status(400).json({ message: "User is already verified" });
    }

    user.is_verified = true;

    await user.save();

    await notifyUser(user.email);

    logger.info(`User with email ${user.email} verified successfully`);

    res.status(200).json({ message: "User verified successfully"});
  } catch (error) {
    return next(error instanceof ApiError ? error : new InternalServerError(error.message));
  }
};
