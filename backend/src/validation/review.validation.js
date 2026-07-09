const { body } = require("express-validator");
const { VALIDATION_MESSAGES } = require("../constants/messages");
const validateRequest = require("./validateRequest");

const addReviewValidation = [
  body("rating")
    .notEmpty()
    .withMessage(VALIDATION_MESSAGES.RATING_INVALID)
    .bail()
    .isFloat({ min: 1, max: 5 })
    .withMessage(VALIDATION_MESSAGES.RATING_INVALID)
    .toFloat(),
  body("comment")
    .trim()
    .notEmpty()
    .withMessage(VALIDATION_MESSAGES.COMMENT_REQUIRED),
  validateRequest,
];

module.exports = {
  addReviewValidation,
};
