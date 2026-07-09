const { body } = require("express-validator");
const { VALIDATION_MESSAGES } = require("../constants/messages");
const validateRequest = require("./validateRequest");

const registerUserValidation = [
  body("name").trim().notEmpty().withMessage(VALIDATION_MESSAGES.NAME_REQUIRED),
  body("email")
    .trim()
    .notEmpty()
    .withMessage(VALIDATION_MESSAGES.EMAIL_REQUIRED)
    .bail()
    .isEmail()
    .withMessage(VALIDATION_MESSAGES.EMAIL_INVALID)
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage(VALIDATION_MESSAGES.PASSWORD_REQUIRED)
    .bail()
    .isLength({ min: 6 })
    .withMessage(VALIDATION_MESSAGES.PASSWORD_MIN),
  validateRequest,
];

const loginUserValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage(VALIDATION_MESSAGES.EMAIL_REQUIRED)
    .bail()
    .isEmail()
    .withMessage(VALIDATION_MESSAGES.EMAIL_INVALID)
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage(VALIDATION_MESSAGES.PASSWORD_REQUIRED),
  validateRequest,
];

module.exports = {
  registerUserValidation,
  loginUserValidation,
};
