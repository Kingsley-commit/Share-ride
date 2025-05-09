import { RideService } from "../services/ride.service.js";
import { InternalServerError } from "../../core/errors/internalServerError.js";
import { ApiError } from "../../core/errors/apiErrors.js";
import { ForbiddenError } from "../../core/errors/forbiddenError.js";
import { HttpStatus } from "../../core/utils/statuscodes.js";
import { BadRequestError } from "../../core/errors/BadRequestError.js";
import { logger } from "../../core/loggers/logger.js";

export const cancelRide = async (req, res, next) => {
  const { rideId } = req.body;

  try {
    const currUser = req.user;

    if (currUser.type !== "driver") {
      return next(
        new ForbiddenError("Only Drivers can access this route!!")
      );
    }

    const ride = await RideService.getRide(rideId);

    if (!ride) {
      return next(new BadRequestError("No routes found"));
    }

    if (ride.driverId !== currUser.id)
        return next(new ForbiddenError("This ride wasn't created by you!!"));

    if (ride.status !== "ongoing") return next(new ForbiddenError("you can't cancel a ride that is not ongoing!!"))

    ride.status = "cancelled";

    ride.save();

    logger.info(`This ride with id ${rideId} has successfully cancelled!!`);
    return res.status(HttpStatus.OK).json({
      message: "This ride has successfully cancelled!!"
    });
  } catch (error) {
    next(
      error instanceof ApiError ? error : new InternalServerError(error.message)
    );
  }
};
