const express = require("express");
const {
  createOrder,
  verifyPayment,
} = require("../controllers/paymentController");
const {
  createPaymentOrderValidation,
  verifyPaymentValidation,
} = require("../validation/payment.validation");

const router = express.Router();

router.post("/order", createPaymentOrderValidation, createOrder);
router.post("/verify", verifyPaymentValidation, verifyPayment);

module.exports = router;
