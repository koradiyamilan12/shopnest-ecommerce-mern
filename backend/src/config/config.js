const dotenv = require("dotenv");
const path = require("path");

// Load .env file from the backend root directory
dotenv.config({ path: path.join(__dirname, "../../.env") });

const requiredEnv = [
  "DB_HOST",
  "DB_PORT",
  "DB_NAME",
  "DB_USER",
  "DB_PASS",
  "JWT_SECRET",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "RAZORPAY_KEY_ID",
  "RAZORPAY_KEY_SECRET",
  "GMAIL_USER",
  "GMAIL_PASS",
  "FRONTEND_URL"
];

const missingEnv = requiredEnv.filter((envName) => {
  const value = process.env[envName];
  if (!value) return true;
  
  // Detect placeholder values from template .env
  const lowerValue = value.toLowerCase();
  if (
    lowerValue.startsWith("your_") ||
    lowerValue.startsWith("your-") ||
    lowerValue.includes("placeholder")
  ) {
    return true;
  }
  return false;
});

if (missingEnv.length > 0) {
  throw new Error(
    `Configuration Error: Missing or placeholder environment variables: ${missingEnv.join(", ")}. Please configure them in your .env file.`
  );
}

const config = {
  env: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,
  apiUrl: process.env.API_URL || `http://localhost:${process.env.PORT || 5000}`,
  frontendUrl: (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, ""),
  
  db: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    ssl: process.env.DB_SSL === "true",
  },
  
  redis: {
    hasConfig: Boolean(process.env.REDIS_HOST && process.env.REDIS_PORT),
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT) || 6379,
    username: process.env.REDIS_USERNAME || "default",
    password: process.env.REDIS_PASSWORD || undefined,
  },
  
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || process.env.EXPIRES_IN || "30d",
  },
  
  cookie: {
    secret: process.env.COOKIE_SECRET || process.env.JWT_SECRET,
    sameSite: process.env.COOKIE_SAME_SITE,
    maxAgeMs: Number(process.env.AUTH_COOKIE_MAX_AGE_MS),
  },
  
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID,
    keySecret: process.env.RAZORPAY_KEY_SECRET,
  },
  
  gmail: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
  
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackUrl: process.env.GOOGLE_CALLBACK_URL,
  }
};

module.exports = config;
