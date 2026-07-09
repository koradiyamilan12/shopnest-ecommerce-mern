const { Product, Review, User } = require("../models");

const getAllProducts = () => Product.findAll();

const getProductById = (id) =>
  Product.findByPk(id, {
    include: [
      {
        model: Review,
        as: "reviews",
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "name", "avatar"],
          },
        ],
      },
    ],
  });

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
