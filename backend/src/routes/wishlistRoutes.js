const express = require("express");
const {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} = require("../controllers/wishlistController");
const { protect } = require("../middleware/authMiddleware");
const {
  addToWishlistValidation,
  removeFromWishlistValidation,
} = require("../validation/wishlist.validation");

const router = express.Router();

router
  .route("/")
  .get(protect, getWishlist)
  .post(protect, addToWishlistValidation, addToWishlist);

router
  .route("/:productId")
  .delete(protect, removeFromWishlistValidation, removeFromWishlist);

module.exports = router;
