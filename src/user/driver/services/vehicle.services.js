import Vehicle from "../../model/vehicle.js";

export class VehicleService {
  static async createVehicle(vehicleData) {
    return await Vehicle.create(vehicleData);
  }

  static async getVehicleById(vehicleId) {
      const vehicle = await Vehicle.findByPk(vehicleId);
    //   console.log(vehicle)
    if (!vehicle) return null;
    return {
      plateNumber: vehicle.plateNumber,
      seatNumber: vehicle.seatNumber,
      color: vehicle.color,
      model: vehicle.model,
      ownerId: vehicle.ownerId,
    };
  }

  static async getVehicleByOwnerId(ownerId) {
    const vehicle = await Vehicle.findOne({
      where: { ownerId },
    });

    if (!vehicle) return null;
    return {
      id: vehicle.id,
      plateNumber: vehicle.plateNumber,
      seatNumber: vehicle.seatNumber,
      color: vehicle.color,
      model: vehicle.model,
    };
  }
}
