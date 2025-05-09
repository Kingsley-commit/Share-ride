import { DataTypes, Model } from "sequelize";
import { sequelizeConn } from "../../core/config/database.js";
import Ride from "../../routing/models/ride.js";
import User from "../../user/model/user.js";

class Rating extends Model {}

Rating.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    raterId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    ratedId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    rideId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Ride,
        key: "id",
      },
    },

    type: {
      type: DataTypes.ENUM,
      values: ["driver-rating", "passenger-rating"],
      allowNull: false,
    }

  },
  {
    sequelize: sequelizeConn,
    modelName: "Rating",
    tableName: "Ratings",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  }
);

export default Rating;
