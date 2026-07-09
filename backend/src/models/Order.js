const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { ORDER_STATUS } = require("../enums");

const Order = sequelize.define(
  "Order",
  {
    _id: {
      type: DataTypes.VIRTUAL,
      get() {
        const id = this.getDataValue("id");
        return id === null || id === undefined ? undefined : String(id);
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    items: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    address: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    paymentId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(ORDER_STATUS)),
      allowNull: false,
      defaultValue: ORDER_STATUS.PENDING,
    },
  },
  {
    tableName: "orders",
    timestamps: true,
  },
);

module.exports = Order;
