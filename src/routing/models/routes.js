import { DataTypes, Model } from "sequelize";
import { sequelizeConn } from "../../core/config/database.js";
import User from "../../user/model/user.js";
import Ride from "./ride.js";

class Route extends Model {}

Route.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    startPoint: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    destination: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    driverId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User, // Name of the related model
        key: "id", // Key in the related model
        onDelete: "CASCADE",
      },
    },
    rideId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: Ride,
        key: "id",
      },
    },
    publishedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    busstops: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
  },
  {
    sequelize: sequelizeConn,
    modelName: "route",
    tableName: "routes",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  }
);

export default Route;
