const { StatusCodes } = require("http-status-codes");
const { STATUS } = require("../constants/messages");

function Response(statusCode, status, message) {
  this.statusCode = statusCode;
  this.status = status;
  this.message = message;
}

function getOkResponse(message) {
  return new Response(StatusCodes.OK, STATUS.OK, message);
}

function getCreatedResponse(message) {
  return new Response(StatusCodes.CREATED, STATUS.CREATED, message);
}

function getUpdatedResponse(message) {
  return new Response(StatusCodes.OK, STATUS.OK, message);
}

function getDeletedResponse(message) {
  return new Response(StatusCodes.OK, STATUS.OK, message);
}

function getUpsertedResponse(created, createdMessage, updatedMessage) {
  return new Response(
    created ? StatusCodes.CREATED : StatusCodes.OK,
    created ? STATUS.CREATED : STATUS.OK,
    created ? createdMessage : updatedMessage,
  );
}

function getInvalidRequestResponse(message) {
  return new Response(StatusCodes.BAD_REQUEST, STATUS.BAD_REQUEST, message);
}

function unauthorizedResponse(message) {
  return new Response(StatusCodes.UNAUTHORIZED, STATUS.UNAUTHORIZED, message);
}

function forbiddenResponse(message) {
  return new Response(StatusCodes.FORBIDDEN, STATUS.FORBIDDEN, message);
}

function mailErrorResponse(message) {
  return new Response(StatusCodes.BAD_REQUEST, STATUS.MAIL_ERROR, message);
}

function thirdpartyErrorResponse(message) {
  return new Response(
    StatusCodes.BAD_GATEWAY,
    STATUS.THIRDPARTY_ERROR,
    message,
  );
}

function notFoundResponse(message) {
  return new Response(StatusCodes.NOT_FOUND, STATUS.NOT_FOUND, message);
}

function getInternalServerErrorResponse(message) {
  return new Response(StatusCodes.INTERNAL_SERVER_ERROR, STATUS.ERROR, message);
}

function getPaginatedUsers(message) {
  return new Response(StatusCodes.OK, STATUS.OK, message);
}

function getFilterMenus(message) {
  return new Response(StatusCodes.OK, STATUS.OK, message);
}

module.exports = {
  getOkResponse,
  getCreatedResponse,
  getUpdatedResponse,
  getDeletedResponse,
  getUpsertedResponse,
  getInvalidRequestResponse,
  unauthorizedResponse,
  forbiddenResponse,
  mailErrorResponse,
  thirdpartyErrorResponse,
  getInternalServerErrorResponse,
  notFoundResponse,
  getPaginatedUsers,
  getFilterMenus,
};
