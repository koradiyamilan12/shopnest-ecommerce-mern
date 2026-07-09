const { StatusCodes } = require("http-status-codes");

class CustomError extends Error {
  constructor(
    message,
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR,
    details = null,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = CustomError;
