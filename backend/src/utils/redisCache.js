const redisConnection = require("../config/redis");
const logger = require("../config/logger");

/**
 * Check if Redis connection is active and ready.
 */
const isRedisConnected = () => {
  return redisConnection && redisConnection.status === "ready";
};

/**
 * Retrieve JSON data from Redis cache.
 * @param {string} key 
 * @returns {Promise<any|null>}
 */
const getCache = async (key) => {
  if (!isRedisConnected()) return null;
  try {
    const data = await redisConnection.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    logger.error("Redis get error for key %s: %o", key, error);
    return null;
  }
};

/**
 * Store data as JSON in Redis cache with an optional TTL (in seconds).
 * @param {string} key 
 * @param {any} value 
 * @param {number} ttl Defaults to 3600 seconds (1 hour).
 */
const setCache = async (key, value, ttl = 3600) => {
  if (!isRedisConnected()) return;
  try {
    await redisConnection.set(key, JSON.stringify(value), "EX", ttl);
  } catch (error) {
    logger.error("Redis set error for key %s: %o", key, error);
  }
};

/**
 * Delete a specific key from Redis cache.
 * @param {string} key 
 */
const delCache = async (key) => {
  if (!isRedisConnected()) return;
  try {
    await redisConnection.del(key);
  } catch (error) {
    logger.error("Redis del error for key %s: %o", key, error);
  }
};

/**
 * Delete keys matching a pattern using SCAN to avoid blocking the Redis server.
 * @param {string} pattern E.g. "orders:user:*"
 */
const delCachePattern = async (pattern) => {
  if (!isRedisConnected()) return;
  try {
    let cursor = "0";
    do {
      const reply = await redisConnection.scan(cursor, "MATCH", pattern, "COUNT", 100);
      cursor = reply[0];
      const keys = reply[1];
      if (keys && keys.length > 0) {
        await redisConnection.del(...keys);
      }
    } while (cursor !== "0");
  } catch (error) {
    logger.error("Redis delCachePattern error for pattern %s: %o", pattern, error);
  }
};

module.exports = {
  isRedisConnected,
  getCache,
  setCache,
  delCache,
  delCachePattern,
};
