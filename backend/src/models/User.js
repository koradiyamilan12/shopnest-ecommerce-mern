const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { USER_ROLES } = require("../enums");

const User = sequelize.define(
  "User",
  {
    _id: {
      type: DataTypes.VIRTUAL,
      get() {
        const id = this.getDataValue("id");
        return id === null || id === undefined ? undefined : String(id);
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    googleId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    authProvider: {
      type: DataTypes.ENUM("local", "google"),
      allowNull: false,
      defaultValue: "local",
    },
    role: {
      type: DataTypes.ENUM(...Object.values(USER_ROLES)),
      allowNull: false,
      defaultValue: USER_ROLES.USER,
    },
  },
  {
    tableName: "users",
    timestamps: true,
  },
);

module.exports = User;
