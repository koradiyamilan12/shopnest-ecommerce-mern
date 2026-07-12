const { Queue } = require("bullmq");
const redisConnection = require("../config/redis");
const logger = require("../config/logger");

const emailQueue = new Queue("emailQueue", {
  connection: redisConnection,
});

const queueEmail = async ({ email, subject, message }) => {
  try {
    await emailQueue.add("send-email", { email, subject, message }, {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 1000,
      },
    });
    logger.info(`Email job successfully queued for ${email}`);
  } catch (error) {
    logger.error(`Failed to queue email for ${email}: ${error.message}`);
    throw error;
  }
};

const queueOrderInvoiceEmail = async ({ email, subject, message, orderId, user }) => {
  try {
    await emailQueue.add("send-order-invoice", { email, subject, message, orderId, user }, {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 1000,
      },
    });
    logger.info(`Order invoice email job successfully queued for order ${orderId} and email ${email}`);
  } catch (error) {
    logger.error(`Failed to queue order invoice email for order ${orderId}: ${error.message}`);
    throw error;
  }
};

module.exports = {
  emailQueue,
  queueEmail,
  queueOrderInvoiceEmail,
};
