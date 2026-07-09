const express = require("express");

const router = express.Router();

router.use("/auth", require("../authRoutes"));
router.use("/products", require("../productRoutes"));
router.use("/orders", require("../orderRoutes"));
router.use("/payment", require("../paymentRoutes"));
router.use("/analytics", require("../analyticsRoutes"));

module.exports = router;
