const fs = require("fs");
const path = require("path");

const welcomeTemplate = fs.readFileSync(
  path.join(__dirname, "../view/welcome.html"),
  "utf8"
);
const orderConfirmationTemplate = fs.readFileSync(
  path.join(__dirname, "../view/orderConfirmation.html"),
  "utf8"
);

const getWelcomeEmail = ({ name }) => {
  return welcomeTemplate
    .replace(/{{name}}/g, name);
};

const getOrderConfirmationEmail = ({ name, orderId, totalAmount, address }) => {
  const shippingAddress = `${address.street}, ${address.city}`;
  const totalAmountFormatted = Number(totalAmount).toFixed(2);
  return orderConfirmationTemplate
    .replace(/{{name}}/g, name)
    .replace(/{{orderId}}/g, orderId)
    .replace(/{{totalAmount}}/g, totalAmountFormatted)
    .replace(/{{shippingAddress}}/g, shippingAddress);
};

module.exports = {
  getWelcomeEmail,
  getOrderConfirmationEmail,
};

