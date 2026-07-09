const { User } = require("../models");

const withoutPrivateFields = { exclude: ["password", "googleId"] };

const findUserByEmail = (email) => User.findOne({ where: { email } });

const findUserByGoogleId = (googleId) => User.findOne({ where: { googleId } });

const findUserById = (id) => User.findByPk(id);

const findUserByIdWithoutPassword = (id) =>
  User.findByPk(id, { attributes: withoutPrivateFields });

const createUser = (data) => User.create(data);

const updateUser = (user, data) => user.update(data);

const getAllUsers = () => User.findAll({ attributes: withoutPrivateFields });

const countUsers = (filter = {}) => User.count({ where: filter });

module.exports = {
  findUserByEmail,
  findUserByGoogleId,
  findUserById,
  findUserByIdWithoutPassword,
  createUser,
  updateUser,
  getAllUsers,
  countUsers,
};
