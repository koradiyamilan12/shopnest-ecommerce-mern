const { hashPassword } = require("../utils/hashPassword");

const beforeCreateHook = async (user) => {
  if (user.password) {
    user.password = await hashPassword(user.password);
  }
};

const beforeUpdateHook = async (user) => {
  if (user.changed("password")) {
    user.password = await hashPassword(user.password);
  }
};

module.exports = {
  beforeCreateHook,
  beforeUpdateHook,
};
