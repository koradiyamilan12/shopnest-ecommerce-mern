const {
  createRazorpayOrder,
  verifyRazorpaySignature,
} = require("../repository/payment.repository");
const { ERROR_MESSAGES } = require("../constants/messages");
const { BadRequestError, ThirdpartyError } = require("../utils/errors");

const createPaymentOrderService = async ({ amount }) => {
  try {
    const order = await createRazorpayOrder({ amount });

    if (!order) {
      throw new ThirdpartyError(ERROR_MESSAGES.PAYMENT_ORDER_CREATE_FAILED);
    }

    return order;
  } catch (error) {
    if (error instanceof ThirdpartyError) {
      throw error;
    }

    throw new ThirdpartyError(error.message);
  }
};

const verifyPaymentService = (payload) => {
  const isValid = verifyRazorpaySignature(payload);

  if (!isValid) {
    throw new BadRequestError(ERROR_MESSAGES.INVALID_PAYMENT_SIGNATURE);
  }

  return { verified: true };
};

module.exports = {
  createPaymentOrderService,
  verifyPaymentService,
};
