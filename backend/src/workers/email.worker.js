import { Worker } from "bullmq";
import { redisConnection } from "../config/redis.js";
import { sendWelcomeEmail } from "../services/email.service.js";

new Worker(
  "emailQueue",
  async (job) => {
    if (job.name === "welcome-email") {
      await sendWelcomeEmail(job.data);
    }
  },
  {
    connection: redisConnection,
  }
);

console.log("📧 Email Worker Started");
