import Route from "../models/routes.js";
import Ride from "../models/ride.js";
import Rating from "../../rating/models/rate-ride.js";
import { VehicleService } from "../../user/driver/services/vehicle.services.js";
import { UserService } from "../../user/driver/services/driver.services.js";
import { isBeforeStartTime } from "../../core/utils/compareTime.js";
import { sanitizePassenger } from "../../core/utils/sanitize.js";
import { RatingService } from "../../rating/services/rating.service.js";
import { Op } from "sequelize";
import { sequelizeConn } from "../../core/config/database.js";

export class RideService {
  static async getAllRoutes(source, destination) {
    const routes = await Route.findAll({
      // where: {
      //   status: "pending",
      // },
    });

    // const filteredRoutes = routes.filter(async (route) => {
    //   const busStops = route.busstops;
    //   const sourceIndex = busStops.indexOf(source);
    //   const destinationIndex = busStops.indexOf(destination);

    //   if (sourceIndex !== -1 && destinationIndex !== -1) {
    //     return (
    //       ((sourceIndex < destinationIndex ||
    //             (source == route.startPoint && destination == route.destination))
    //       && isBeforeStartTime((await this.getRideByRouteId(route.id))))
    //     );
    //   }
    //   return false;
    // });

    const currentTime = new Date();

    const Routes = await Promise.all(
      routes.map(async (route) => {
        const busStops = route.busstops;
        busStops.unshift(route.startPoint);
        busStops.push(route.destination);
        const sourceIndex = busStops.indexOf(source);
        const destinationIndex = busStops.indexOf(destination);
        if (sourceIndex !== -1 && destinationIndex !== -1) {
          if (
            sourceIndex < destinationIndex &&
            route.busstops.includes(source) &&
            route.busstops.includes(destination)
          ) {
            const ride = await this.getRideByRouteId(route.id);
            const rideStartTime = new Date(ride.startTime);
            // return route
            if (ride.status == "pending") {
              return route;
            }
          }
        }
        return null;
      })
    );

    const filteredRoutes = Routes.filter((route) => route !== null);

    const data = [];

    for (let i = 0; i < filteredRoutes.length; i++) {
      const route = {
        id: filteredRoutes[i].id,
        startPoint: filteredRoutes[i].startPoint,
        destination: filteredRoutes[i].destination,
        driver: await UserService.getDriverById(filteredRoutes[i].driverId),
        ride: await RideService.getRideById(filteredRoutes[i].rideId),
        publishedAt: filteredRoutes[i].publishedAt,
        busStops: filteredRoutes[i].busStops,
      };

      data.push(route);
    }

    return data;
  }

  static async getRouteById(id) {
    const route = await Route.findByPk(id);
    if (!route) return false;
    return route;
  }

  static async getRideById(id) {
    const ride = await Ride.findByPk(id);
    //   console.log(ride)

    if (!ride) return false;

    return {
      id: ride.id,
      startTime: ride.startTime,
      destination: ride.destination,
      vehicle: await VehicleService.getVehicleById(ride.vehicleId),
      seatAvailable: ride.seatAvailable,
      instruction: ride.instruction,
      status: ride.status,
    };
  }

  static async getRide(id) {
    const ride = await Ride.findByPk(id);

    if (!ride) return false;

    return ride;
  }

  static async getRideByRouteId(routeId) {
    const ride = await Ride.findOne({
      where: {
        routeId,
      },
    });

    return ride;
  }

  // static async joinRide(ride, passengerId) {
  //   if (ride.seatAvailable <= 0) {
  //     return false;
  //   }

  //   let passengers = ride.passengers;

  //   if (passengers.includes(passengerId)) {
  //     return false;
  //   }

  //   passengers.push(passengerId);
  //   console.log(passengers)

  //    try {
  //      await ride.update({ passengers, seatAvailable: ride.seatAvailable - 1 });
  //      return ride;
  //    } catch (error) {
  //      console.error("Error updating ride:", error);
  //      return false
  //    }
  // }

  static async joinRide(ride, passengerId) {
    if (ride.seatAvailable <= 0) {
      return false;
    }

    let passengers = ride.passengers || [];

    if (passengers.includes(passengerId)) {
      return false;
    }

    passengers.push(passengerId);
    console.log(passengers);

    // Manually mark the passengers field as changed
    ride.set("passengers", passengers);
    ride.set("seatAvailable", ride.seatAvailable - 1);
    ride.changed("passengers", true);
    ride.changed("seatAvailable", true);

    try {
      await ride.save(); // Try using save instead of update
      return ride;
    } catch (error) {
      console.error("Error updating ride:", error);
      return false;
    }
  }

  static async countRide() {
    const count = await Ride.count();
    return count;
  }

  static async LastRideEnded(driverId) {
    const ride = await Ride.findOne({
      where: {
        driverId,
      },
      order: [["createdAt", "DESC"]],
    });

    if (!ride) return "none";

    return ride.endTime !== null;
  }

  static async driverOngoingRide(driverId) {
    const ride = await Ride.findOne({
      where: {
        driverId,
        status: "ongoing",
      },
    });

    const passengers = ride.passengers;

    for (let i = 0; i < passengers.length; i++) {
      passengers[i] = sanitizePassenger(
        await UserService.getUserById(passengers[i])
      );
    }

    ride.passengers = passengers;

    return ride;
  }

  static async getPendingRide(driverId) {
    const ride = await Ride.findOne({
      where: {
        driverId,
        status: "pending",
      },
    });

    const passengers = ride.passengers;

    for (let i = 0; i < passengers.length; i++) {
      passengers[i] = sanitizePassenger(
        await UserService.getUserById(passengers[i])
      );
    }

    ride.passengers = passengers;

    return ride;
  }

  static async noncompletedLastRide(passengerId) {
    const ride = await Ride.findOne({
      where: {
        passengers: {
          [Op.contains]: [passengerId],
        },
        status: {
          [Op.or]: ["pending", "ongoing"],
        },
      },
      order: [["startTime", "DESC"]],
    });

    return ride;
  }

  // static async getCompletedUnratedRidesByPassenger(passengerId) {
  //   const completedUnratedRides = await Ride.findAll({
  //     where: {
  //       status: "completed",
  //       passengers: {
  //         [Op.contains]: [passengerId],
  //       },
  //     },
  //     include: [
  //       {
  //         model: Rating,
  //         as: "ratings",
  //         required: false,
  //         where: {
  //           raterId: passengerId,
  //         },
  //       },
  //     ],
  //     group: ["Ride.id"],
  //     having: sequelizeConn.literal("COUNT(ratings.id) = 0"),
  //   });

  //   return completedUnratedRides;
  // }

  static async getCompletedUnratedRidesByPassenger(passengerId) {
    // Subquery to get ride IDs that have been rated by the passenger
    const ratedRideIds = await Rating.findAll({
      attributes: ["rideId"],
      where: {
        raterId: passengerId,
      },
      group: ["rideId"],
      raw: true,
    }).then((results) => results.map((result) => result.rideId));

    const completedUnratedRides = await Ride.findAll({
      where: {
        status: "completed",
        id: {
          [Op.notIn]: ratedRideIds,
        },
        passengers: {
          [Op.contains]: [passengerId], 
        },
      },
    });

    return completedUnratedRides;
  }

  static async getLastJoinedCompletedRide(passengerId) {
    const ride = await Ride.findOne({
      where: {
        passengers: {
          [Op.contains]: [passengerId],
        },
        status: "completed",
      },
      order: [["endTime", "DESC"]],
    });

    if (!ride) return false;

    const rating = await RatingService.uniqueRating(passengerId, ride.id);

    if (rating) return false;

    return ride;
  }
}
