import { RatingService } from "../services/rating.service.js";
import { InternalServerError } from "../../core/errors/internalServerError.js";
import { ApiError } from "../../core/errors/apiErrors.js";
import { ForbiddenError } from "../../core/errors/forbiddenError.js";
import { HttpStatus } from "../../core/utils/statuscodes.js";
import { BadRequestError } from "../../core/errors/BadRequestError.js";
import { ConflictError } from "../../core/errors/conflictError.js";
import { logger } from "../../core/loggers/logger.js";
import { UserService } from "../../user/driver/services/driver.services.js";
import { RideService } from "../../routing/services/ride.service.js";



// export const rateRide = async (req, res, next) => {

//   const { rating, rideId, ratedId } = req.body;

//   try {
//     const currUser = req.user;

//     const raterId = currUser.id;

//     const ratedUser = await UserService.getUserById(ratedId);

//     if (currUser.type == ratedUser.type) {
//       return next(
//         new ForbiddenError("Same type can't rate each other!!")
//       );
//     }



//     const ride = await RatingService.rateRide(rating, rideId, currUser.id, ratedId);

//     if (!ride) {
//       return next(new BadRequestError("No rides found"));
//     }

//     logger.info("Passenger successfully rated ride!!");
//     return res.status(HttpStatus.OK).json({
//       message: "Passenger successfully rated ride!!",
//       ride,
//     });

//   }catch (error) {

//     next( error instanceof ApiError ? error : new InternalServerError(error.message))

//   }

// }

export const rateDriver = async (req, res, next) => {

  const { rating, rideId } = req.body;

  try {
    const currUser = req.user;

    const raterId = currUser.id;

    const ride = await RideService.getRide(rideId);

    if (!ride) {
      return next(new BadRequestError("No rides found"));
    }

    const ratingExists = await RatingService.uniqueRating(raterId, rideId);

    if (ratingExists) {
      return next(new ConflictError("You have already rated this ride!!"));
    }

    if (ride.status !== "completed") {
      return next(new ConflictError("You can only rate drivers in completed rides!!"));
    }

    if (currUser.type !== "passenger") {
      return next(new ForbiddenError("Only passengers can rate drivers!!"));
    }

    const ridePassengers = ride.passengers;

    if (!ridePassengers.includes(raterId)) {
      return next(
        new ForbiddenError("Only passengers in the ride can rate drivers!!")
      );
    }

    const rate = await RatingService.rateDriver(rating, raterId, ride);

    logger.info("Passenger successfully rated ride!!");
    return res.status(HttpStatus.OK).json({
      message: "Passenger successfully rated driver!!",
      rate,
    });
  } catch (error) {

    next( error instanceof ApiError ? error : new InternalServerError(error.message))

  }

}

export const ratePassenger = async (req, res, next) => {

  const { rating, rideId, passengerId } = req.body;

  try {
    const currUser = req.user;

    // const raterId = currUser.id;

    if (currUser.type !== "driver") {
      return next(new ForbiddenError("Only drivers can rate passengers!!"));
    }

    const ride = await RideService.getRide(rideId);

    if (!ride) {
      return next(new BadRequestError("No rides found"));
    }

    const ratingExists = await RatingService.uniquePassengerRating(currUser.id, passengerId, rideId);

    if (ratingExists) {
      return next(new ConflictError("You have already rated this passenger!!"));
    }

    if (ride.driverId !== currUser.id) {
      return next(new ForbiddenError("You are not the driver of this ride!!"));
    }

    if (ride.status !== "completed") {
      return next(new ConflictError("You can only rate passengers in completed rides!!"));
    }

    const ridePassengers = ride.passengers;

    if (!ridePassengers.includes(passengerId)) {
      return next(
        new ForbiddenError("Only passengers in the ride can be rated by drivers!!")
      );
    }

    const rate = await RatingService.ratePassenger(rating, passengerId, ride);

    logger.info("Passenger successfully rated ride!!");
    return res.status(HttpStatus.OK).json({
      message: "Passenger successfully rated by driver!!",
      rate,
    });
  } catch (error) {
    next(
      error instanceof ApiError ? error : new InternalServerError(error.message)
    );
  }

}

  export const getRatings = async (req, res, next) => {
    const { ratedId } = req.params;

    try {
      const ratings = await RatingService.getRating(ratedId);

      if (!ratings) {
        return next(new BadRequestError("No ratings found"));
      }

      logger.info("Rating successfully fetched!!");
      return res.status(HttpStatus.OK).json({
        message: "Overall Rating successfully fetched!!",
        ratings,
      });
    } catch (error) {
      next(
        error instanceof ApiError
          ? error
          : new InternalServerError(error.message)
      );
    }
  };