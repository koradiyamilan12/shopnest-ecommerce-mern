const jwt = require("jsonwebtoken");
const config = require("../config/config");

const SECRET_KEY = config.jwt.secret;
const EXPIRES_IN = config.jwt.expiresIn;

function generateToken(payload, options = {}) {
  const signOptions = { expiresIn: EXPIRES_IN, ...options };
  return jwt.sign(payload, SECRET_KEY, signOptions);
}

function verifyToken(token) {
  return jwt.verify(token, SECRET_KEY);
}

module.exports = { generateToken, verifyToken };
