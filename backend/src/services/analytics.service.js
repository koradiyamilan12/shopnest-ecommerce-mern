const { countOrders, getOrdersForRevenue } = require("../repository/order.repository");
const { countProducts } = require("../repository/product.repository");
const { countUsers } = require("../repository/user.repository");
const { USER_ROLES } = require("../enums");
const { getCache, setCache } = require("../utils/redisCache");

const getAdminStatsService = async () => {
  const cacheKey = "analytics:stats";
  const cachedStats = await getCache(cacheKey);
  if (cachedStats) {
    return cachedStats;
  }

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

  const stats = { totalOrders, totalProducts, totalUsers, totalRevenue };
  await setCache(cacheKey, stats, 300);
  return stats;
};

module.exports = {
  getAdminStatsService,
};
