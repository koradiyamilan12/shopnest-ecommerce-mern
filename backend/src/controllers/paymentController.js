const asyncHandler = require("express-async-handler");
const {
  createPaymentOrderService,
  verifyPaymentService,
} = require("../services/payment.service");
const generalResponse = require("../utils/generalResponse");
const { getCreatedResponse, getOkResponse } = require("../utils/response");
const { SUCCESS_MESSAGES } = require("../constants/messages");

const createOrder = asyncHandler(async (req, res) => {
  const order = await createPaymentOrderService(req.body);
  return generalResponse(
    res,
    order,
    getCreatedResponse(SUCCESS_MESSAGES.PAYMENT_ORDER_CREATED),
  );
});

const verifyPayment = asyncHandler(async (req, res) => {
  const result = verifyPaymentService(req.body);
  return generalResponse(
    res,
    result,
    getOkResponse(SUCCESS_MESSAGES.PAYMENT_VERIFIED),
  );
});

module.exports = { createOrder, verifyPayment };
