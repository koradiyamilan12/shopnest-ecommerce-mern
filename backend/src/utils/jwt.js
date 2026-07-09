const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";
const EXPIRES_IN = process.env.EXPIRES_IN || "1h";

function generateToken(payload, options = {}) {
  const signOptions = { expiresIn: EXPIRES_IN, ...options };
  return jwt.sign(payload, SECRET_KEY, signOptions);
}

function verifyToken(token) {
  return jwt.verify(token, SECRET_KEY);
}

module.exports = { generateToken, verifyToken };
