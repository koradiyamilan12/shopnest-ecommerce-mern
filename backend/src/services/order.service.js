const {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByUser,
  saveOrder,
} = require("../repository/order.repository");
const { getOrderConfirmationEmail } = require("../constants/emailTemplates");
const {
  EMAIL_SUBJECTS,
  ERROR_MESSAGES,
} = require("../constants/messages");
const { queueEmail, queueOrderInvoiceEmail } = require("../queues/email.queue");
const { BadRequestError, NotFoundError } = require("../utils/errors");
const { getCache, setCache, delCache } = require("../utils/redisCache");

const addOrderItemsService = async (user, data) => {
  const { items, totalAmount, address, paymentId } = data;

  if (!items || items.length === 0) {
    throw new BadRequestError(ERROR_MESSAGES.ORDER_ITEMS_REQUIRED);
  }

  const createdOrder = await createOrder({
    userId: user.id,
    items,
    totalAmount,
    address,
    paymentId,
  });

  await queueOrderInvoiceEmail({
    email: user.email,
    subject: EMAIL_SUBJECTS.ORDER_CONFIRMATION,
    message: getOrderConfirmationEmail({
      name: user.name,
      orderId: createdOrder.id,
      totalAmount,
      address,
    }),
    orderId: createdOrder.id,
    user,
  });

  await delCache("orders:all");
  await delCache(`orders:user:${user.id}`);
  await delCache("analytics:stats");

  return createdOrder;
};

const getMyOrdersService = async (userId) => {
  const cacheKey = `orders:user:${userId}`;
  const cachedOrders = await getCache(cacheKey);
  if (cachedOrders) {
    return cachedOrders;
  }
  const orders = await getOrdersByUser(userId);
  await setCache(cacheKey, orders, 3600);
  return orders;
};

const getOrdersService = async () => {
  const cacheKey = "orders:all";
  const cachedOrders = await getCache(cacheKey);
  if (cachedOrders) {
    return cachedOrders;
  }
  const orders = await getAllOrders();
  await setCache(cacheKey, orders, 3600);
  return orders;
};

const updateOrderStatusService = async (id, status) => {
  const order = await getOrderById(id);
  if (!order) {
    throw new NotFoundError(ERROR_MESSAGES.ORDER_NOT_FOUND);
  }

  order.status = status || order.status;
  const updatedOrder = await saveOrder(order);

  await delCache("orders:all");
  await delCache(`orders:user:${order.userId}`);
  await delCache("analytics:stats");

  return updatedOrder;
};

module.exports = {
  addOrderItemsService,
  getMyOrdersService,
  getOrdersService,
  updateOrderStatusService,
};
