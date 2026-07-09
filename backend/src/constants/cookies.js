const AUTH_COOKIE = Object.freeze({
  NAME: "authToken",
  MAX_AGE_MS: 30 * 24 * 60 * 60 * 1000,
});

const COOKIE_SAME_SITE = Object.freeze({
  LAX: "lax",
  STRICT: "strict",
  NONE: "none",
});

module.exports = {
  AUTH_COOKIE,
  COOKIE_SAME_SITE,
};
