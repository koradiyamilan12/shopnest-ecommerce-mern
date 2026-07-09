const generalResponse = require("../utils/generalResponse");
const {
  getInvalidRequestResponse,
  getInternalServerErrorResponse,
  notFoundResponse,
  unauthorizedResponse,
  forbiddenResponse,
  mailErrorResponse,
  thirdpartyErrorResponse,
} = require("../utils/response");
const { ERROR_MESSAGES } = require("../constants/messages");
const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  MailError,
  ThirdpartyError,
  AwsUploadError,
} = require("../utils/errors");
const logger = require("../config/logger");

const errorResponseMap = new Map([
  [BadRequestError, getInvalidRequestResponse],
  [NotFoundError, notFoundResponse],
  [UnauthorizedError, unauthorizedResponse],
  [ForbiddenError, forbiddenResponse],
  [MailError, mailErrorResponse],
  [ThirdpartyError, thirdpartyErrorResponse],
  [AwsUploadError, getInternalServerErrorResponse],
]);

function errorHandler(err, req, res, next) {
  logger.error(
    `${req.method} ${req.originalUrl} - ${err.message}`,
    {
      stack: err.stack,
      details: err.details || null,
    },
  );

  for (const [ErrorClass, responseFn] of errorResponseMap.entries()) {
    if (err instanceof ErrorClass) {
      return generalResponse(res, err.details || null, responseFn(err.message));
    }
  }

  return generalResponse(
    res,
    null,
    getInternalServerErrorResponse(err?.message || ERROR_MESSAGES.SERVER_ERROR),
  );
}

module.exports = errorHandler;
