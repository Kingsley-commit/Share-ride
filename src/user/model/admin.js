import { DataTypes, Model } from "sequelize";
import { sequelizeConn } from "../../core/config/database.js";

class Admin extends Model {}

Admin.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: sequelizeConn,
    modelName: "Admin",
    tableName: "admins",
    timestamps: true,
  }
);

export default Admin;
