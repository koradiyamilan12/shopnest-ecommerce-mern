const { Order, User } = require("../models");

const createOrder = (data) => Order.create(data);

const getOrdersByUser = (userId) =>
  Order.findAll({
    where: { userId },
    order: [["createdAt", "DESC"]],
  });

const serializeOrderWithUser = (order) => {
  const data = order.toJSON();
  data.userId = data.user
    ? {
        id: data.user.id,
        name: data.user.name,
      }
    : null;
  delete data.user;

  return data;
};

const getAllOrders = async () => {
  const orders = await Order.findAll({
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "name"],
        required: false,
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  return orders.map(serializeOrderWithUser);
};

const getOrderById = (id) => Order.findByPk(id);

const getOrdersForRevenue = () => Order.findAll({ attributes: ["totalAmount", "createdAt"] });

const saveOrder = (order) => order.save();

const countOrders = (filter = {}) => Order.count({ where: filter });

module.exports = {
  createOrder,
  getOrdersByUser,
  getAllOrders,
  getOrderById,
  getOrdersForRevenue,
  saveOrder,
  countOrders,
};
