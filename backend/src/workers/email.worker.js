const { Worker } = require("bullmq");
const redisConnection = require("../config/redis");
const sendEmail = require("../utils/sendEmail");
const logger = require("../config/logger");

const emailWorker = new Worker(
  "emailQueue",
  async (job) => {
    if (job.name === "send-email") {
      const { email, subject, message } = job.data;
      await sendEmail({ email, subject, message });
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
