const { Worker } = require("bullmq");
const redisConnection = require("../config/redis");
const sendEmail = require("../utils/sendEmail");
const logger = require("../config/logger");
const { getOrderWithUserById } = require("../repository/order.repository");
const { generateInvoicePdf } = require("../utils/pdfGenerator");

const emailWorker = new Worker(
  "emailQueue",
  async (job) => {
    if (job.name === "send-email") {
      const { email, subject, message } = job.data;
      await sendEmail({ email, subject, message });
    } else if (job.name === "send-order-invoice") {
      const { email, subject, message, orderId, user } = job.data;
      try {
        const order = await getOrderWithUserById(orderId);
        if (!order) {
          throw new Error(`Order ${orderId} not found in database.`);
        }

        // Generate invoice PDF
        const pdfBuffer = await generateInvoicePdf(order, order.user || user);

        // Send email with PDF attachment
        await sendEmail({
          email,
          subject,
          message,
          attachments: [
            {
              filename: `invoice_${orderId}.pdf`,
              content: pdfBuffer,
            },
          ],
        });
      } catch (error) {
        logger.error(`Error processing send-order-invoice for order ${orderId}: ${error.message}`);
        throw error;
      }
    }
  },
  {
    connection: redisConnection,
  }
);

emailWorker.on("completed", (job) => {
  logger.info(`Email job ${job.id} completed successfully.`);
});

emailWorker.on("failed", (job, err) => {
  logger.error(`Email job ${job.id} failed: ${err.message}`);
});

module.exports = emailWorker;
