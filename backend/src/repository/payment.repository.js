const crypto = require("crypto");
const Razorpay = require("razorpay");
const { PAYMENT } = require("../enums");
const config = require("../config/config");

const createRazorpayInstance = () => {
  const keyId = config.razorpay.keyId;
  const keySecret = config.razorpay.keySecret;

  if (
    !keyId ||
    !keySecret ||
    keyId === "your_razorpay_key_id" ||
    keySecret === "your_razorpay_key_secret"
  ) {
    throw new Error("Razorpay payment gateway is not configured on this server.");
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
};

// const createRazorpayOrder = ({ amount, currency = PAYMENT.CURRENCY.INR }) => {
//   const instance = createRazorpayInstance();

//   return instance.orders.create({
//     amount: amount * 100,
//     currency,
//   });
// };

const createRazorpayOrder = ({ amount, currency = PAYMENT.CURRENCY.INR }) => {
  const instance = createRazorpayInstance();

  return instance.orders.create({
    amount: Math.round(Number(amount) * 100),
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
    .createHmac("sha256", config.razorpay.keySecret)
    .update(sign)
    .digest("hex");

  return razorpay_signature === expectedSign;
};

module.exports = {
  createRazorpayOrder,
  verifyRazorpaySignature,
};
