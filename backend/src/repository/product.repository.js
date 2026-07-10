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

const saveProduct = (product) => Product.update(product, { where: { id: product.id } });

const deleteProduct = (id) => Product.destroy({ where: { id } });

const countProducts = (filter = {}) => Product.count({ where: filter });

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  saveProduct,
  deleteProduct,
  countProducts,
};
