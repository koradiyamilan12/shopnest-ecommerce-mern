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

  const monthlySalesMap = {};
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = d.toLocaleString("en-US", { month: "short", year: "2-digit" });
    monthlySalesMap[monthKey] = 0;
  }

  orders.forEach((order) => {
    if (order.createdAt) {
      const date = new Date(order.createdAt);
      const monthKey = date.toLocaleString("en-US", { month: "short", year: "2-digit" });
      if (monthlySalesMap[monthKey] !== undefined) {
        monthlySalesMap[monthKey] += order.totalAmount;
      }
    }
  });

  const monthlySales = Object.entries(monthlySalesMap).map(([month, revenue]) => ({
    month,
    revenue: parseFloat(revenue.toFixed(2)),
  }));

  const stats = { totalOrders, totalProducts, totalUsers, totalRevenue, monthlySales };
  await setCache(cacheKey, stats, 300);
  return stats;
};

module.exports = {
  getAdminStatsService,
};
