const { countOrders, getOrdersForRevenue } = require("../repository/order.repository");
const { countProducts } = require("../repository/product.repository");
const { countUsers } = require("../repository/user.repository");
const { USER_ROLES } = require("../enums");

const getAdminStatsService = async () => {
  const [totalOrders, totalProducts, totalUsers, orders] = await Promise.all([
    countOrders({}),
    countProducts({}),
    countUsers({ role: USER_ROLES.USER }),
    getOrdersForRevenue(),
  ]);

  const totalRevenue = orders.reduce(
    (acc, item) => acc + item.totalAmount,
    0,
  );

  return { totalOrders, totalProducts, totalUsers, totalRevenue };
};

module.exports = {
  getAdminStatsService,
};
