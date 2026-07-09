const { param } = require("express-validator");
const { VALIDATION_MESSAGES } = require("../constants/messages");

const validateId = (field = "id") =>
  param(field)
    .isInt({ min: 1 })
    .withMessage(VALIDATION_MESSAGES.INVALID_ID)
    .toInt();

module.exports = {
  validateId,
};
