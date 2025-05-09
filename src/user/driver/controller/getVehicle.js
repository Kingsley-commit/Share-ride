import { VehicleService } from "../services/vehicle.services.js";
import { InternalServerError } from "../../../core/errors/internalServerError.js";
import { HttpStatus } from "../../../core/utils/statuscodes.js";
import { ApiError } from "../../../core/errors/apiErrors.js";

export const getVehicle = async (req, res, next) => {
  try {
    const currUser = req.user;

    if (currUser.type !== "driver" || currUser.type !== "admin") {
      return next(
        new ForbiddenError("You are not authorized to perform this action")
      );
    }

    const vehicleId = req.body.vehicleId;

    const vehicle = VehicleService.getVehicleById(vehicleId);

    return res.status(HttpStatus.OK).json({
      message: "vehicle sucessfully retrived!!",
      vehicle,
    });
  } catch (error) {
    return next(
      error instanceof ApiError ? error : new InternalServerError(error.message)
    );
  }
};
