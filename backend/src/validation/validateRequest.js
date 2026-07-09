const { validationResult } = require("express-validator");
const { ERROR_MESSAGES } = require("../constants/messages");
const { BadRequestError } = require("../utils/errors");

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new BadRequestError(
        ERROR_MESSAGES.VALIDATION_ERROR,
        errors.array().map((error) => ({
          field: error.path,
          message: error.msg,
        })),
      ),
    );
  }

  return next();
};

module.exports = validateRequest;
