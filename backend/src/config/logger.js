const winston = require("winston");
const path = require("path");

// Custom log levels and colors
const customLevels = {
  levels: { error: 0, warn: 1, info: 2, http: 3, debug: 4 },
  colors: {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "magenta",
    debug: "blue",
  },
};
winston.addColors(customLevels.colors);

// Base logger
const baseLogger = winston.createLogger({
  levels: customLevels.levels,
  level: "debug",
  format: winston.format.combine(
    winston.format.splat(),
    winston.format.simple(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.timestamp(),
        winston.format.splat(),
        winston.format.json(),
        winston.format.printf((info) => {
          const { timestamp, level, message, stack, details } = info;
          let logMsg = `${timestamp} - ${level}: ${message}`;
          if (details) {
            logMsg += ` | Details: ${JSON.stringify(details)}`;
          }
          if (stack) {
            logMsg += `\n${stack}`;
          }
          return logMsg;
        }),
      ),
    }),
    new winston.transports.File({
      filename: "logs/app.log",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.splat(),
        winston.format.json(),
        winston.format.printf((info) => {
          const { timestamp, level, message, stack, details } = info;
          let logMsg = `${timestamp} - ${level}: ${message}`;
          if (details) {
            logMsg += ` | Details: ${JSON.stringify(details)}`;
          }
          if (stack) {
            logMsg += `\n${stack}`;
          }
          return logMsg;
        }),
      ),
    }),
  ],
});

// Helper to get caller info
const getCaller = () => {
  const stack = new Error().stack.split("\n").slice(3);
  for (const line of stack) {
    if (
      !line.includes("node_modules") &&
      !line.includes("internal/") &&
      !line.includes("events.js")
    ) {
      const match =
        line.match(/\((.*):(\d+):(\d+)\)$/) ||
        line.match(/at (.*):(\d+):(\d+)/);
      if (match) return `${path.basename(match[1])}:${match[2]}`;
    }
  }
  return "unknown";
};

// Logger wrapper to add file:line info
const logger = {};
for (const level of Object.keys(customLevels.levels)) {
  logger[level] = (message, ...args) => {
    const caller = getCaller();
    baseLogger[level](`[${caller}] ${message}`, ...args);
  };
}

module.exports = logger;
