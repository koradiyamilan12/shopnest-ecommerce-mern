const asyncHandler = require("express-async-handler");
const {
  addOrderItemsService,
  getMyOrdersService,
  getOrdersService,
  updateOrderStatusService,
} = require("../services/order.service");
const generalResponse = require("../utils/generalResponse");
const {
  getCreatedResponse,
  getOkResponse,
  getUpdatedResponse,
} = require("../utils/response");
const { SUCCESS_MESSAGES } = require("../constants/messages");

const addOrderItems = asyncHandler(async (req, res) => {
  const order = await addOrderItemsService(req.user, req.body);
  return generalResponse(
    res,
    order,
    getCreatedResponse(SUCCESS_MESSAGES.ORDER_CREATED),
  );
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await getMyOrdersService(req.user.id);
  return generalResponse(
    res,
    orders,
    getOkResponse(SUCCESS_MESSAGES.ORDERS_FETCHED),
  );
});

const getOrders = asyncHandler(async (req, res) => {
  const orders = await getOrdersService();
  return generalResponse(
    res,
    orders,
    getOkResponse(SUCCESS_MESSAGES.ORDERS_FETCHED),
  );
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await updateOrderStatusService(req.params.id, req.body.status);
  return generalResponse(
    res,
    order,
    getUpdatedResponse(SUCCESS_MESSAGES.ORDER_UPDATED),
  );
});

module.exports = { addOrderItems, getMyOrders, getOrders, updateOrderStatus };
