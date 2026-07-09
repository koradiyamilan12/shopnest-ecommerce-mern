const { body, param } = require("express-validator");
const { VALIDATION_MESSAGES } = require("../constants/messages");
const validateRequest = require("./validateRequest");

const addToWishlistValidation = [
  body("productId")
    .notEmpty()
    .withMessage(VALIDATION_MESSAGES.PRODUCT_ID_REQUIRED)
    .bail()
    .isInt({ min: 1 })
    .withMessage(VALIDATION_MESSAGES.INVALID_ID)
    .toInt(),
  validateRequest,
];

const removeFromWishlistValidation = [
  param("productId")
    .isInt({ min: 1 })
    .withMessage(VALIDATION_MESSAGES.INVALID_ID)
    .toInt(),
  validateRequest,
];

module.exports = {
  addToWishlistValidation,
  removeFromWishlistValidation,
};
