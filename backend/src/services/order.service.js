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
const sendEmail = require("../utils/sendEmail");
const { BadRequestError, NotFoundError } = require("../utils/errors");

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

  await sendEmail({
    email: user.email,
    subject: EMAIL_SUBJECTS.ORDER_CONFIRMATION,
    message: getOrderConfirmationEmail({
      name: user.name,
      orderId: createdOrder._id,
      totalAmount,
      address,
    }),
  });

  return createdOrder;
};

const getMyOrdersService = (userId) => getOrdersByUser(userId);

const getOrdersService = () => getAllOrders();

const updateOrderStatusService = async (id, status) => {
  const order = await getOrderById(id);
  if (!order) {
    throw new NotFoundError(ERROR_MESSAGES.ORDER_NOT_FOUND);
  }

  order.status = status || order.status;
  return saveOrder(order);
};

module.exports = {
  addOrderItemsService,
  getMyOrdersService,
  getOrdersService,
  updateOrderStatusService,
};
