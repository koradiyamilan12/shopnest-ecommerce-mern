const { Product } = require("../models");

const getAllProducts = () => Product.findAll();

const getProductById = (id) => Product.findByPk(id);

const createProduct = (data) => Product.create(data);

const saveProduct = (product) => product.save();

const deleteProduct = (product) => product.destroy();

const countProducts = (filter = {}) => Product.count({ where: filter });

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  saveProduct,
  deleteProduct,
  countProducts,
};
