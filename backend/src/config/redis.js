const Redis = require("ioredis");
const logger = require("./logger");

const hasRedisConfig = Boolean(process.env.REDIS_HOST && process.env.REDIS_PORT);

const redisConnection = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT) || 6379,
  username: process.env.REDIS_USERNAME || "default",
  password: process.env.REDIS_PASSWORD || undefined,
  connectTimeout: 2000,
  lazyConnect: true,
  maxRetriesPerRequest: null,
  retryStrategy: (retries) => Math.min(retries * 100, 3000),
});

redisConnection.on("error", (err) => {
  logger.error("Redis Client Error %o", err);
});

redisConnection.on("connect", () => {
  logger.info("Connected to Redis");
});

redisConnection.on("reconnecting", () => {
  logger.warn("Reconnecting to Redis...");
});

const connectRedis = async () => {
  if (!hasRedisConfig) {
    logger.warn("Redis configuration missing; skipping Redis connection");
    return redisConnection;
  }

  if (
    redisConnection.status === "ready" ||
    redisConnection.status === "connecting"
  ) {
    return redisConnection;
  }

  try {
    await redisConnection.connect();
  } catch (err) {
    logger.error("Failed to connect Redis: %o", err);
  }

  return redisConnection;
};

module.exports = redisConnection;
module.exports.redisConnection = redisConnection;
module.exports.connectRedis = connectRedis;
