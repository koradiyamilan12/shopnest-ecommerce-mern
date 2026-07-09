const { body } = require("express-validator");
const { VALIDATION_MESSAGES } = require("../constants/messages");
const validateRequest = require("./validateRequest");

const createPaymentOrderValidation = [
  body("amount")
    .isFloat({ gt: 0 })
    .withMessage(VALIDATION_MESSAGES.PAYMENT_AMOUNT_INVALID)
    .toFloat(),
  validateRequest,
];

const verifyPaymentValidation = [
  body("razorpay_order_id")
    .trim()
    .notEmpty()
    .withMessage(VALIDATION_MESSAGES.PAYMENT_FIELD_REQUIRED),
  body("razorpay_payment_id")
    .trim()
    .notEmpty()
    .withMessage(VALIDATION_MESSAGES.PAYMENT_FIELD_REQUIRED),
  body("razorpay_signature")
    .trim()
    .notEmpty()
    .withMessage(VALIDATION_MESSAGES.PAYMENT_FIELD_REQUIRED),
  validateRequest,
];

module.exports = {
  createPaymentOrderValidation,
  verifyPaymentValidation,
};
