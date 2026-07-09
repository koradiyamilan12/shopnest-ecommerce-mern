const { Review, User } = require("../models");

const createReview = (data) => Review.create(data);

const findReviewByUserAndProduct = (userId, productId) =>
  Review.findOne({
    where: { userId, productId },
  });

const getReviewsByProduct = (productId) =>
  Review.findAll({
    where: { productId },
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "name", "avatar"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

module.exports = {
  createReview,
  findReviewByUserAndProduct,
  getReviewsByProduct,
};
