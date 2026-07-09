const { getProductById } = require("../repository/product.repository");
const {
  addToWishlist,
  findWishlistItem,
  getWishlistByUser,
  removeFromWishlist,
} = require("../repository/wishlist.repository");
const { ERROR_MESSAGES } = require("../constants/messages");
const { NotFoundError } = require("../utils/errors");
const { getCache, setCache, delCache } = require("../utils/redisCache");

const addToWishlistService = async (userId, productId) => {
  const product = await getProductById(productId);
  if (!product) {
    throw new NotFoundError(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
  }

  const existingItem = await findWishlistItem(userId, productId);
  if (existingItem) {
    return existingItem;
  }

  const newItem = await addToWishlist(userId, productId);
  await delCache(`wishlist:user:${userId}`);
  return newItem;
};

const removeFromWishlistService = async (userId, productId) => {
  const item = await findWishlistItem(userId, productId);
  if (!item) {
    throw new NotFoundError(ERROR_MESSAGES.WISHLIST_ITEM_NOT_FOUND);
  }

  await removeFromWishlist(item);
  await delCache(`wishlist:user:${userId}`);
  return { productId };
};

const getWishlistService = async (userId) => {
  const cacheKey = `wishlist:user:${userId}`;
  const cachedWishlist = await getCache(cacheKey);
  if (cachedWishlist) {
    return cachedWishlist;
  }
  const wishlist = await getWishlistByUser(userId);
  await setCache(cacheKey, wishlist, 3600);
  return wishlist;
};

module.exports = {
  addToWishlistService,
  removeFromWishlistService,
  getWishlistService,
};
