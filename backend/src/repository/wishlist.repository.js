const { Wishlist, Product } = require("../models");

const addToWishlist = (userId, productId) =>
  Wishlist.create({ userId, productId });

const removeFromWishlist = (item) => item.destroy();

const findWishlistItem = (userId, productId) =>
  Wishlist.findOne({
    where: { userId, productId },
  });

const getWishlistByUser = (userId) =>
  Wishlist.findAll({
    where: { userId },
    include: [
      {
        model: Product,
        as: "product",
      },
    ],
    order: [["createdAt", "DESC"]],
  });

module.exports = {
  addToWishlist,
  removeFromWishlist,
  findWishlistItem,
  getWishlistByUser,
};
