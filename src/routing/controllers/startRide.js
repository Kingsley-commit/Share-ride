import { RideService } from "../services/ride.service.js";
import { InternalServerError } from "../../core/errors/internalServerError.js";
import { ApiError } from "../../core/errors/apiErrors.js";
import { ForbiddenError } from "../../core/errors/forbiddenError.js";
import { HttpStatus } from "../../core/utils/statuscodes.js";
import { BadRequestError } from "../../core/errors/BadRequestError.js";
import { logger } from "../../core/loggers/logger.js";

export const startRide = async (req, res, next) => {
  const { rideId } = req.body;

  try {
    const currUser = req.user;

    if (currUser.type !== "driver") {
      return next(
        new ForbiddenError("Only passengers can access this route!!")
      );
    }

    const ride = await RideService.getRide(rideId);

    // console.log(ride)

    if (!ride) {
      return next(new BadRequestError("No routes found"));
    }

    if (ride.driverId !== currUser.id)
      return next(new ForbiddenError("This ride wasn't created by you!!"));

    if (ride.status !== "pending")
        return next(new ForbiddenError("Only pending rides can start!!"));

      const startTime = new Date(ride.startTime)

      const curTime = new Date();

    // if (curTime < startTime) return next(new ForbiddenError(`We have not reached the proposed start time ${ride.startTime} of this ride`))

    ride.startTime = curTime;

    ride.status = "ongoing";

    ride.save();

    logger.info(`This ride with id ${rideId} has successfully started!!`);
    return res.status(HttpStatus.OK).json({
      message: "This ride has successfully started!!",
      ride,
    });
  } catch (error) {
    next(
      error instanceof ApiError ? error : new InternalServerError(error.message)
    );
  }
};
