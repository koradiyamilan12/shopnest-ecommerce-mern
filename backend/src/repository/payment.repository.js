const crypto = require("crypto");
const Razorpay = require("razorpay");
const { PAYMENT } = require("../enums");

const createRazorpayInstance = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  console.log(process.env.RAZORPAY_KEY_ID);
console.log(process.env.RAZORPAY_KEY_SECRET ? "SECRET FOUND" : "SECRET MISSING");

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
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(sign)
    .digest("hex");

  return razorpay_signature === expectedSign;
};

module.exports = {
  createRazorpayOrder,
  verifyRazorpaySignature,
};
