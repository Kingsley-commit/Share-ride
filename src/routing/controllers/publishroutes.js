import Route from "../models/routes.js";
import Ride from "../models/ride.js";
// import { ConflictError } from "../../../core/errors/conflictError.js";
import { InternalServerError } from "../../core/errors/internalServerError.js";
import { BadRequestError } from "../../core/errors/BadRequestError.js";
import { ApiError } from "../../core/errors/apiErrors.js";
// import { getPlacesAlongRoute,getCoordinates, getDirections} from "../services/mapbox.service.js";
import { ForbiddenError } from "../../core/errors/forbiddenError.js";
import { logger } from "../../core/loggers/logger.js";
import { HttpStatus } from "../../core/utils/statuscodes.js";
import { VehicleService } from "../../user/driver/services/vehicle.services.js";
import { RideService } from "../services/ride.service.js";
import { ConflictError } from "../../core/errors/conflictError.js";
import { RouteNotFoundError } from "../../core/errors/notFoundError.js"
// import { }

export const publishRoutes = async (req, res, next) => {
  const currUser = req.user;

  if (currUser.type !== "driver") {
    return next(
      new ForbiddenError("You are not authorized to perform this action")
    );
  }

  const {
    startPoint,
    destination,
    routes,
    vehicleId,
    seatAvailable,
    instruction,
  } = req.body;

  try {
    // Validate required fields
    const requiredFields = {
      startPoint,
      destination,
      routes,
      vehicleId,
      seatAvailable,
      instruction,
    };

    for (const [field, value] of Object.entries(requiredFields)) {
      if (!value) {
        return next(new BadRequestError(`${field} is required`));
      }
    }

    // console.log(vehicleId)

    const vehicle = await VehicleService.getVehicleById(vehicleId);
    // console.log(vehicle)


    if (!vehicle) {
      return next(new BadRequestError("Invalid vehicle id"));
    }
    console.log(currUser.id, vehicle.ownerId)
    if(vehicle.ownerId !== currUser.id) return next(new ForbiddenError("The provided vehicle does not belogn to you!!"))

    if (seatAvailable > vehicle.seatNumber) {
      return next(
        new BadRequestError(
          "Seat available cannot be more than the vehicle seat number"
        )
      );
    }

    if ((await RideService.countRide()) > 0) {
      const rideEnded = await RideService.LastRideEnded(currUser.id);

      // if (rideEnded === "none") return next(new RouteNotFoundError("Ride not found!!"));

      if (!rideEnded) {
        return next(
          new ConflictError(
            "You can't start another ride until you have finished the current!!"
          )
        );
      }
    }

    // const startCoord = await getCoordinates(startPoint);
    // const destCoord = await getCoordinates(destination);
    // // console.log(startCoord);
    // console.log(destCoord);

    // const stops = await getPlacesAlongRoute(startCoord, destCoord);

    const route = await Route.create({
      startPoint: startPoint.toLowerCase(),
      destination: destination.toLowerCase(),
      driverId: currUser.id,
      busstops: routes.map((str) => str.toLowerCase()),
    });

    const ride = await Ride.create({
      startTime: new Date(route.publishedAt.getTime() + 1000 * 60 * 60 * 24),
      numberOfPassengers: 0,
      routeId: route.id,
      seatAvailable,
      vehicleId,
      instruction,
      driverId: currUser.id
    });

    route.rideId = ride.id;

    route.save();

    const data = {
      route,
      ride,
    };

    logger.info("Route successfully created!!");

    return res.status(HttpStatus.CREATED).json({
      message: "Route created successfully",
      data,
    });
  } catch (error) {
    return next(
      error instanceof ApiError ? error : new InternalServerError(error.message)
    );
  }
};
