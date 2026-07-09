const crypto = require("crypto");
const Razorpay = require("razorpay");
const { PAYMENT } = require("../enums");

const createRazorpayInstance = () =>
  new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

const createRazorpayOrder = ({ amount, currency = PAYMENT.CURRENCY.INR }) => {
  const instance = createRazorpayInstance();

  return instance.orders.create({
    amount: amount * 100,
    currency,
  });
};

const verifyRazorpaySignature = ({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
}) => {
  const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(sign)
    .digest("hex");

  return razorpay_signature === expectedSign;
};

module.exports = {
  createRazorpayOrder,
  verifyRazorpaySignature,
};
