const asyncHandler = require("express-async-handler");
const {
  addToWishlistService,
  removeFromWishlistService,
  getWishlistService,
} = require("../services/wishlist.service");
const generalResponse = require("../utils/generalResponse");
const { getCreatedResponse, getOkResponse, getDeletedResponse } = require("../utils/response");
const { SUCCESS_MESSAGES } = require("../constants/messages");

const addToWishlist = asyncHandler(async (req, res) => {
  const item = await addToWishlistService(req.user.id, req.body.productId);
  return generalResponse(
    res,
    item,
    getCreatedResponse(SUCCESS_MESSAGES.WISHLIST_ADDED),
  );
});

const removeFromWishlist = asyncHandler(async (req, res) => {
  const result = await removeFromWishlistService(req.user.id, req.params.productId);
  return generalResponse(
    res,
    result,
    getDeletedResponse(SUCCESS_MESSAGES.WISHLIST_REMOVED),
  );
});

const getWishlist = asyncHandler(async (req, res) => {
  const items = await getWishlistService(req.user.id);
  return generalResponse(
    res,
    items,
    getOkResponse(SUCCESS_MESSAGES.WISHLIST_FETCHED),
  );
});

module.exports = {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
};
