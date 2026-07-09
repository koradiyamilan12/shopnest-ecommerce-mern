const asyncHandler = require("express-async-handler");
const {
  getAllUsersService,
  loginUserService,
  registerUserService,
  getCurrentUserService,
} = require("../services/auth.service");
const generalResponse = require("../utils/generalResponse");
const {
  getCreatedResponse,
  getOkResponse,
} = require("../utils/response");
const { SUCCESS_MESSAGES } = require("../constants/messages");
const { clearAuthCookie, setAuthCookie } = require("../utils/cookies");

const registerUser = asyncHandler(async (req, res) => {
  const user = await registerUserService(req.body);
  setAuthCookie(res, user.token);

  return generalResponse(
    res,
    user,
    getCreatedResponse(SUCCESS_MESSAGES.USER_REGISTERED),
  );
});

const loginUser = asyncHandler(async (req, res) => {
  const user = await loginUserService(req.body);
  setAuthCookie(res, user.token);

  return generalResponse(
    res,
    user,
    getOkResponse(SUCCESS_MESSAGES.USER_LOGGED_IN),
  );
});

const logoutUser = asyncHandler(async (req, res) => {
  clearAuthCookie(res);

  return generalResponse(
    res,
    null,
    getOkResponse(SUCCESS_MESSAGES.USER_LOGGED_OUT),
  );
});

const getUsers = asyncHandler(async (req, res) => {
  const users = await getAllUsersService();
  return generalResponse(
    res,
    users,
    getOkResponse(SUCCESS_MESSAGES.USERS_FETCHED),
  );
});

const getMe = asyncHandler(async (req, res) => {
  const user = getCurrentUserService(req.user);
  return generalResponse(
    res,
    user,
    getOkResponse(SUCCESS_MESSAGES.USER_PROFILE_FETCHED),
  );
});

module.exports = { registerUser, loginUser, logoutUser, getUsers, getMe };
