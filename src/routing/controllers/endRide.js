import { RideService } from "../services/ride.service.js";
import { InternalServerError } from "../../core/errors/internalServerError.js";
import { ApiError } from "../../core/errors/apiErrors.js";
import { ForbiddenError } from "../../core/errors/forbiddenError.js";
import Ride from "../models/ride.js";
import { HttpStatus } from "../../core/utils/statuscodes.js";
import { BadRequestError } from "../../core/errors/BadRequestError.js";
import { logger } from "../../core/loggers/logger.js";

export const endRide = async (req, res, next) => {
  const { rideId } = req.body;

  try {
    const currUser = req.user;

    if (currUser.type !== "driver") {
      return next(new ForbiddenError("Only Drivers can access this route!!"));
    }

    const ride = await RideService.getRide(rideId);

    if (!ride) return next(new BadRequestError("Invalid rideId"));

    if (ride.driverId !== currUser.id)
      return next(new ForbiddenError("This is not your ride!!"));

    ride.endTime = new Date();
    ride.status = "completed"

    ride.save();

      const passengerCarried = ride.passengers.length;

      logger.info("The ride have successfully ended!!");

      return res.status(HttpStatus.OK).json({
          message: "ride ended successfully",
          passengerCarried: passengerCarried
      })
  } catch (error) {
    return next(
      error instanceof ApiError ? error : new InternalServerError(error.message)
    );
  }
};
