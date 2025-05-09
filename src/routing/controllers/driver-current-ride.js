import { RideService } from "../services/ride.service.js";
import { InternalServerError } from "../../core/errors/internalServerError.js";
import { ApiError } from "../../core/errors/apiErrors.js";
import { ForbiddenError } from "../../core/errors/forbiddenError.js";
import { HttpStatus } from "../../core/utils/statuscodes.js";
import { BadRequestError } from "../../core/errors/BadRequestError.js";
import { logger } from "../../core/loggers/logger.js";

export const ongoingRide = async (req, res, next) => {

  try {
    const currUser = req.user;

    if (currUser.type !== "driver") {
      return next(new ForbiddenError("Only Drivers can access this route!!"));
    }

    const ride = await RideService.driverOngoingRide(currUser.id);

    if (!ride) return next(new BadRequestError("You dont have any ongoing ride"));

    logger.info("Ride successfully retrived!!");

    return res.status(HttpStatus.OK).json({
      message: "Ride successfully retrived",
      ride
    });
  } catch (error) {
    return next(
      error instanceof ApiError ? error : new InternalServerError(error.message)
    );
  }
}


export const pendingRide = async (req, res, next) => {

  try {

    const currUser = req.user;

    if (currUser.type !== "driver") {
      return next(new ForbiddenError("Only Drivers can access this route!!"));
    }

    const ride = await RideService.getPendingRide(currUser.id);

    if (!ride) return next(new BadRequestError("You dont have any pending ride"));

    logger.info("Ride successfully retrived!!");

    return res.status(HttpStatus.OK).json({
      message: "Ride successfully retrived",
      ride
    });

  } catch (error) {

    return next(error instanceof ApiError ? error : new InternalServerError(error.message))

  }
}
