import Rating from "../models/rate-ride.js";

export class RatingService {
  static async rateDriver(rating, raterId, ride) {
    const newRating = await Rating.create({
      rating,
      rideId: ride.id,
      raterId,
      ratedId: ride.driverId,
      type: "driver-rating",
    });

    return newRating;
  }

  static async uniqueRating(raterId, rideId) {
    const rating = await Rating.findOne({
      where: {
        raterId,
        rideId,
      },
    });

    return rating;
  }

  static async uniquePassengerRating(raterId, ratedId, rideId) {
    const rating = await Rating.findOne({
      where: {
        raterId,
        ratedId,
        rideId,
      },
    });

    return rating;
  }

  static async ratePassenger(rating, passengerId, ride) {
    const newRating = await Rating.create({
      rating,
      rideId: ride.id,
      raterId: ride.driverId,
      ratedId: passengerId,
      type: "passenger-rating",
    });

    return newRating;
  }

  static async getRatings(ratedId) {
    const ratings = await Rating.findAll({
      where: {
        ratedId,
      },
    });

    return ratings;
  }

  static async getRating(ratedId) {
    const ratings = await Rating.findAll({
      where: {
        ratedId,
      },
    });

    if (ratings.length === 0) {
      return 0;
    }

    const total = ratings.reduce((acc, curr) => acc + curr.rating, 0);

    return total / ratings.length;
  }
}
