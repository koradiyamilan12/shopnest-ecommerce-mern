const express = require("express");
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");
const multer = require("multer");
const {
  createProductValidation,
  productIdValidation,
  updateProductValidation,
} = require("../validation/product.validation");
const upload = multer({ dest: "uploads/" });

const router = express.Router();

router
  .route("/")
  .get(getProducts)
  .post(
    protect,
    admin,
    upload.single("image"),
    createProductValidation,
    createProduct,
  );
router
  .route("/:id")
  .get(productIdValidation, getProductById)
  .put(
    protect,
    admin,
    upload.single("image"),
    productIdValidation,
    updateProductValidation,
    updateProduct,
  )
  .delete(protect, admin, productIdValidation, deleteProduct);

module.exports = router;
