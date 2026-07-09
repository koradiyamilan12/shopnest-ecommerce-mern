const { body } = require("express-validator");
const { VALIDATION_MESSAGES } = require("../constants/messages");
const { validateId } = require("./common.validation");
const validateRequest = require("./validateRequest");

const productIdValidation = [validateId("id"), validateRequest];

const createProductValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage(VALIDATION_MESSAGES.PRODUCT_NAME_REQUIRED),
  body("description")
    .trim()
    .notEmpty()
    .withMessage(VALIDATION_MESSAGES.DESCRIPTION_REQUIRED),
  body("price")
    .notEmpty()
    .withMessage(VALIDATION_MESSAGES.PRICE_REQUIRED)
    .bail()
    .isFloat({ gt: 0 })
    .withMessage(VALIDATION_MESSAGES.PRICE_INVALID)
    .toFloat(),
  body("category")
    .trim()
    .notEmpty()
    .withMessage(VALIDATION_MESSAGES.CATEGORY_REQUIRED),
  body("stock")
    .notEmpty()
    .withMessage(VALIDATION_MESSAGES.STOCK_REQUIRED)
    .bail()
    .isInt({ min: 0 })
    .withMessage(VALIDATION_MESSAGES.STOCK_INVALID)
    .toInt(),
  validateRequest,
];

const updateProductValidation = [
  body("name")
    .optional({ values: "falsy" })
    .trim()
    .notEmpty()
    .withMessage(VALIDATION_MESSAGES.PRODUCT_NAME_REQUIRED),
  body("description")
    .optional({ values: "falsy" })
    .trim()
    .notEmpty()
    .withMessage(VALIDATION_MESSAGES.DESCRIPTION_REQUIRED),
  body("price")
    .optional({ values: "falsy" })
    .isFloat({ gt: 0 })
    .withMessage(VALIDATION_MESSAGES.PRICE_INVALID)
    .toFloat(),
  body("category")
    .optional({ values: "falsy" })
    .trim()
    .notEmpty()
    .withMessage(VALIDATION_MESSAGES.CATEGORY_REQUIRED),
  body("stock")
    .optional({ values: "falsy" })
    .isInt({ min: 0 })
    .withMessage(VALIDATION_MESSAGES.STOCK_INVALID)
    .toInt(),
  validateRequest,
];

module.exports = {
  productIdValidation,
  createProductValidation,
  updateProductValidation,
};
