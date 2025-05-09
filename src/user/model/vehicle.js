import { DataTypes, Model } from "sequelize";
import { sequelizeConn } from "../../core/config/database.js";
import User from "./user.js";

class Vehicle extends Model {}

Vehicle.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    plateNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    ownerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
        onDelete: "CASCADE",
      },
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    seatNumber: {
      type: DataTypes.SMALLINT,
      allowNull: false,
    },
  },
  {
    sequelize: sequelizeConn,
    modelName: "Vehicle",
    tableName: "Vehicles",
    timestamps: true,
  }
);

export default Vehicle;
