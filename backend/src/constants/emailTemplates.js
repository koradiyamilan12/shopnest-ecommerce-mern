const getWelcomeOtpEmail = ({ name, otp }) => `
  <h2>Welcome to ShopNest, ${name}!</h2>
  <p>Thank you for registering on our platform.</p>
  <p>Your one-time verification/discount OTP is: <strong>${otp}</strong></p>
`;

const getOrderConfirmationEmail = ({ name, orderId, totalAmount, address }) => `
  <h2>Order Confirmation</h2>
  <p>Hello ${name},</p>
  <p>Your order has been successfully placed! Order ID: <strong>${orderId}</strong></p>
  <p>Total Amount Paid: $${Number(totalAmount).toFixed(2)}</p>
  <p>It will be shipped to: ${address.street}, ${address.city}</p>
  <p>Thank you for shopping with ShopNest!</p>
`;

module.exports = {
  getWelcomeOtpEmail,
  getOrderConfirmationEmail,
};
