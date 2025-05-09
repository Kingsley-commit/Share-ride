import { DataTypes, Model } from "sequelize";
import { sequelizeConn } from "../../core/config/database.js";
import User from "../../user/model/user.js";

class Auth extends Model {}

Auth.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    refreshToken: {
      type: DataTypes.STRING(600),
      allowNull: true,
    },
    refreshTokenExp: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
        onDelete: "CASCADE",
      },
    },
  },
  {
    scopes: {
      withRefreshToken: {
        attributes: {
          include: ["refreshToken", "refreshTokenExp"],
        },
      },
    },
    indexes: [
      {
        unique: true,
        fields: ["email"],
        name: "auth_email_unique_index",
      },
      {
        unique: true,
        fields: ["id"],
      },
    ],
    modelName: "Auth",
    tableName: "auth",
    sequelize: sequelizeConn,
    timestamps: true,
    freezeTableName: true,
  }
);

Auth.belongsTo(User, { foreignKey: "userId" });

export default Auth;
