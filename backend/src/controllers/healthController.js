const asyncHandler = require("express-async-handler");
const sequelize = require("../config/db");
const redisConnection = require("../config/redis");

const getHealth = asyncHandler(async (req, res) => {
  const healthDetails = {
    uptime: process.uptime(),
    timestamp: Date.now(),
    services: {
      database: "UNKNOWN",
      redis: "UNKNOWN",
    },
  };

  let isHealthy = true;

  // Check Database connection
  try {
    await sequelize.authenticate();
    healthDetails.services.database = "UP";
  } catch (err) {
    healthDetails.services.database = "DOWN";
    isHealthy = false;
  }

  // Check Redis connection
  try {
    const pingResult = await redisConnection.ping();
    if (pingResult === "PONG") {
      healthDetails.services.redis = "UP";
    } else {
      healthDetails.services.redis = "DOWN";
      isHealthy = false;
    }
  } catch (err) {
    healthDetails.services.redis = "DOWN";
    isHealthy = false;
  }

  const statusCode = isHealthy ? 200 : 503;

  return res.status(statusCode).json({
    status: isHealthy ? "UP" : "DOWN",
    ...healthDetails,
  });
});

module.exports = { getHealth };
