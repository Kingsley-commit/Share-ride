import { DataTypes, Model } from "sequelize";
import { sequelizeConn } from "../../core/config/database.js";
import Route from "./routes.js";
import Vehicle from "../../user/model/vehicle.js";
import User from "../../user/model/user.js";

class Ride extends Model {}

Ride.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    seatAvailable: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    vehicleId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Vehicle,
        key: "id",
      },
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    passengers: {
      type: DataTypes.ARRAY(DataTypes.UUID),
      allowNull: true,
      defaultValue: [],
    },
    instruction: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    routeId: {
      type: DataTypes.UUID,
      allowNull: false,

    },
    driverId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
        onDelete: "CASCADE",
      },
    },
    status: {
      type: DataTypes.ENUM,
      values: ["pending", "completed", "ongoing", "cancelled"],
      allowNull: false,
      defaultValue: "pending",
      validate: {
        isIn: {
          args: [["pending", "completed", "ongoing", "cancelled"]],
          msg: "Status must ne one of the following: completed, ongoing, cancelled",
        },
      },
    },
  },
  {
    sequelize: sequelizeConn,
    modelName: "Ride",
    tableName: "Rides",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  }
);

export default Ride;
