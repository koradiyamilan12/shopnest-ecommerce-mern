const express = require("express");
const {
  addOrderItems,
  getMyOrders,
  getOrders,
  updateOrderStatus,
} = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");
const {
  createOrderValidation,
  orderIdValidation,
  updateOrderStatusValidation,
} = require("../validation/order.validation");

const router = express.Router();

router
  .route("/")
  .post(protect, createOrderValidation, addOrderItems)
  .get(protect, admin, getOrders);
router.route("/myorders").get(protect, getMyOrders);
router
  .route("/:id/status")
  .put(
    protect,
    admin,
    orderIdValidation,
    updateOrderStatusValidation,
    updateOrderStatus,
  );

module.exports = router;
