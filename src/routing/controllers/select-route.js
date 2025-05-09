import { RideService } from "../services/ride.service.js";
import { InternalServerError } from "../../core/errors/internalServerError.js";
import { BadRequestError } from "../../core/errors/BadRequestError.js";
import { ApiError } from "../../core/errors/apiErrors.js";
import { ForbiddenError } from "../../core/errors/forbiddenError.js";
import { logger } from "../../core/loggers/logger.js";
import { HttpStatus } from "../../core/utils/statuscodes.js";

export const selectRoute = async (req, res, next) => {
  let { source, destination } = req.body;

  source = source.toLowerCase();
  destination = destination.toLowerCase();

  try {
    const currUser = req.user;

    if (currUser.type !== "passenger") {
      return next(
        new ForbiddenError("Only passengers can access this route!!")
      );
    }

    const routes = await RideService.getAllRoutes(source, destination);

    if (!routes) {
      return next(new BadRequestError("No routes found"));
    }

    logger.info("all valid routes have successfully been returned!!");
    return res.status(HttpStatus.OK).json({
      routes,
    });
  } catch (error) {
    next(
      error instanceof ApiError ? error : new InternalServerError(error.message)
    );
  }
};
