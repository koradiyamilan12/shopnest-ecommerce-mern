const { body } = require("express-validator");
const { ORDER_STATUS } = require("../enums");
const { VALIDATION_MESSAGES } = require("../constants/messages");
const { validateId } = require("./common.validation");
const validateRequest = require("./validateRequest");

const orderIdValidation = [validateId("id"), validateRequest];

const createOrderValidation = [
  body("items")
    .isArray({ min: 1 })
    .withMessage(VALIDATION_MESSAGES.ITEMS_REQUIRED),
  body("items.*.productId")
    .notEmpty()
    .withMessage(VALIDATION_MESSAGES.PRODUCT_ID_REQUIRED)
    .bail()
    .isInt({ min: 1 })
    .withMessage(VALIDATION_MESSAGES.INVALID_ID)
    .toInt(),
  body("items.*.qty")
    .isInt({ min: 1 })
    .withMessage(VALIDATION_MESSAGES.QUANTITY_INVALID)
    .toInt(),
  body("items.*.price")
    .isFloat({ min: 0 })
    .withMessage(VALIDATION_MESSAGES.PRICE_INVALID)
    .toFloat(),
  body("totalAmount")
    .isFloat({ gt: 0 })
    .withMessage(VALIDATION_MESSAGES.TOTAL_AMOUNT_INVALID)
    .toFloat(),
  body("address.fullName")
    .trim()
    .notEmpty()
    .withMessage(VALIDATION_MESSAGES.ADDRESS_FIELD_REQUIRED),
  body("address.street")
    .trim()
    .notEmpty()
    .withMessage(VALIDATION_MESSAGES.ADDRESS_FIELD_REQUIRED),
  body("address.city")
    .trim()
    .notEmpty()
    .withMessage(VALIDATION_MESSAGES.ADDRESS_FIELD_REQUIRED),
  body("address.postalCode")
    .trim()
    .notEmpty()
    .withMessage(VALIDATION_MESSAGES.ADDRESS_FIELD_REQUIRED),
  body("address.country")
    .trim()
    .notEmpty()
    .withMessage(VALIDATION_MESSAGES.ADDRESS_FIELD_REQUIRED),
  body("paymentId").optional({ values: "falsy" }).trim(),
  validateRequest,
];

const updateOrderStatusValidation = [
  body("status")
    .isIn(Object.values(ORDER_STATUS))
    .withMessage(VALIDATION_MESSAGES.ORDER_STATUS_INVALID),
  validateRequest,
];

module.exports = {
  orderIdValidation,
  createOrderValidation,
  updateOrderStatusValidation,
};
