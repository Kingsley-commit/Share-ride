import { ApiError } from "../errors/apiErrors.js";
import { logger } from "../loggers/logger.js";
import { HttpStatus } from "../utils/statuscodes.js";

export class ErrorHandler {
  handle = async (
    error,
    _,
    res,
    next
  ) => {
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = error?.message ?? "internal server error";

    if (error instanceof ApiError) {
      logger.error("Error in middleware", error);
      statusCode = error.statusCode;
      message = error.message;
    }

    if (statusCode == HttpStatus.INTERNAL_SERVER_ERROR) logger.error(error);

    const response = {
      status: false,
      code: statusCode,
      message,
    };

    return res.status(statusCode).send(response);
  };
}

export const errorHandler = new ErrorHandler();
