import { DataTypes, Model } from "sequelize";
import { sequelizeConn } from "../../core/config/database.js";

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    type: {
      type: DataTypes.ENUM("driver", "passenger"),
      allowNull: false,
    },
    workAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    workEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    workID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    profession: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      defaultValue: "+2340000000000",
    },
    companyName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email_verified: {
      type: DataTypes.BOOLEAN,
      default: false,
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      default: false,
    },
    verificationToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize: sequelizeConn,
    modelName: "User",
    tableName: "users",
    timestamps: true,
  }
);

export default User;
