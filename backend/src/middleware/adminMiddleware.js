const { ERROR_MESSAGES } = require("../constants/messages");
const { USER_ROLES } = require("../enums");
const { ForbiddenError } = require("../utils/errors");

const admin = (req, res, next) => {
  if (req.user && req.user.role === USER_ROLES.ADMIN) {
    return next();
  } else {
    return next(new ForbiddenError(ERROR_MESSAGES.ADMIN_ONLY));
  }
};

module.exports = { admin };
