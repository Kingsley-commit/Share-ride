import { RideService } from "../services/ride.service.js";
import { InternalServerError } from "../../core/errors/internalServerError.js";
import { ApiError } from "../../core/errors/apiErrors.js";
import { ForbiddenError } from "../../core/errors/forbiddenError.js";
import { HttpStatus } from "../../core/utils/statuscodes.js";
import { BadRequestError } from "../../core/errors/BadRequestError.js";
import { ConflictError } from "../../core/errors/conflictError.js";
import { logger } from "../../core/loggers/logger.js";

export const joinRide = async (req, res, next) => {
  const { routeId } = req.body;

  try {
    const currUser = req.user;

    if (currUser.type !== "passenger") {
      return next(
        new ForbiddenError("Only passengers can access this route!!")
      );
    }

    const lastRides = await RideService.noncompletedLastRide(currUser.id);

    if (lastRides)
      return next(
        new ForbiddenError(
          "You can't join another ride until you finish the current one you are in!!"
        )
      );

    const ride = await RideService.getRideByRouteId(routeId);

    if (!ride) {
      return next(new BadRequestError("No routes found"));
    }

    if (ride.status !== "pending")
      return next(
        new ConflictError(
          "You can only join rides that are pending not started!!"
        )
      );

    const joinedRide = await RideService.joinRide(ride, currUser.id);

    if (!joinedRide)
      return next(new ForbiddenError("you can't join this ride!!"));

    logger.info("Passenger successfully joined ride!!");
    return res.status(HttpStatus.OK).json({
      message: "Passenger successfully joined ride!!",
      joinedRide,
    });
  } catch (error) {
    next(
      error instanceof ApiError ? error : new InternalServerError(error)
    );
  }
};

export const lastJoinedCompletedRide = async (req, res, next) => {
  try {
    const currUser = req.user;

    if (currUser.type !== "passenger") {
      return next(
        new ForbiddenError("Only passengers can access this route!!")
      );
    }

    const ride = await RideService.getCompletedUnratedRidesByPassenger(currUser.id);

    if (ride.length === 0)
      return next(new BadRequestError("You dont have any completed and non rated ride"));

    logger.info("Ride successfully retrived!!");

    return res.status(HttpStatus.OK).json({
      message: "Ride successfully retrived",
      ride,
    });
  } catch (error) {
    return next(
      error instanceof ApiError ? error : new InternalServerError(error.message)
    );
  }
};


export const lastJoinedNonCompletedRide = async (req, res, next) => {
  try {
    const currUser = req.user;

    if (currUser.type !== "passenger") {
      return next(
        new ForbiddenError("Only passengers can access this route!!")
      );
    }

    const ride = await RideService.noncompletedLastRide(currUser.id);

    if (!ride)
      return next(new BadRequestError("You dont have any pending or ongoing previously completed ride"));

    logger.info("Rides successfully retrived!!");

    return res.status(HttpStatus.OK).json({
      message: "Ride successfully retrived",
      ride,
    });
  } catch (error) {
    return next(
      error instanceof ApiError ? error : new InternalServerError(error.message)
    );
  }
};
