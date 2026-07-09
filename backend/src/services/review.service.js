const { getProductById, saveProduct } = require("../repository/product.repository");
const {
  createReview,
  findReviewByUserAndProduct,
  getReviewsByProduct,
} = require("../repository/review.repository");
const { ERROR_MESSAGES } = require("../constants/messages");
const { BadRequestError, NotFoundError } = require("../utils/errors");
const { delCache } = require("../utils/redisCache");

const addReviewService = async (user, productId, { rating, comment }) => {
  const product = await getProductById(productId);
  if (!product) {
    throw new NotFoundError(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
  }

  const alreadyReviewed = await findReviewByUserAndProduct(user.id, productId);
  if (alreadyReviewed) {
    throw new BadRequestError(ERROR_MESSAGES.PRODUCT_ALREADY_REVIEWED);
  }

  const review = await createReview({
    productId,
    userId: user.id,
    name: user.name,
    rating,
    comment,
  });

  const reviews = await getReviewsByProduct(productId);
  const numReviews = reviews.length;
  const ratings =
    reviews.reduce((acc, item) => item.rating + acc, 0) / numReviews;

  product.numReviews = numReviews;
  product.ratings = parseFloat(ratings.toFixed(1));
  await saveProduct(product);

  await delCache("products:all");
  await delCache(`products:${productId}`);

  return review;
};

module.exports = {
  addReviewService,
};
