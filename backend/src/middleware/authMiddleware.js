const { ERROR_MESSAGES } = require("../constants/messages");
const { findUserByIdWithoutPassword } = require("../repository/user.repository");
const { UnauthorizedError } = require("../utils/errors");
const { getAuthTokenFromCookies } = require("../utils/cookies");
const { verifyToken } = require("../utils/jwt");

const protect = async (req, res, next) => {
  const token =
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
      ? req.headers.authorization.split(" ")[1]
      : getAuthTokenFromCookies(req);

  if (!token) {
    return next(new UnauthorizedError(ERROR_MESSAGES.TOKEN_MISSING));
  }

  try {
    const decoded = verifyToken(token);
    req.user = await findUserByIdWithoutPassword(decoded.id);

    if (!req.user) {
      return next(new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED));
    }

    return next();
  } catch (error) {
    return next(new UnauthorizedError(ERROR_MESSAGES.TOKEN_FAILED));
  }
};

module.exports = { protect };
