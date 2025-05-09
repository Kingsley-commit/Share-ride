import User from "../../model/user.js";
import { InternalServerError } from "../../../core/errors/internalServerError.js";
import { RouteNotFoundError } from "../../../core/errors/notFoundError.js";
import { ApiError } from "../../../core/errors/apiErrors.js";
import { logger } from "../../../core/loggers/logger.js";

export const verifyEmail = async (req, res, next) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).send("Invalid token");
  }

  try {
    const user = await User.findOne({ where: { verificationToken: token } });

    if (!user) {
      return next(new RouteNotFoundError("Invalid Token!!"));
    }

    if (user.is_verified) {
      return res.status(400).json({ message: "User is already verified" });
    }

    user.email_verified = true;

    user.verificationToken = null;

    await user.save();

    res.send("Email verified successfully!");

    logger.info(`User with email ${user.email} verified successfully`);

  } catch (error) {
    return next(
      error instanceof ApiError ? error : new InternalServerError(error.message)
    );
  }
};
