const config = require("../config/config");
const { AUTH_COOKIE, COOKIE_SAME_SITE } = require("../constants/cookies");

const getCookieSecret = () => config.cookie.secret;

const getAuthCookieOptions = () => ({
  httpOnly: true,
  secure: config.env === "production",
  sameSite:
    config.cookie.sameSite ||
    (config.env === "production"
      ? COOKIE_SAME_SITE.NONE
      : COOKIE_SAME_SITE.LAX),
  maxAge: config.cookie.maxAgeMs || AUTH_COOKIE.MAX_AGE_MS,
  signed: true,
  path: "/",
});

const setAuthCookie = (res, token) => {
  res.cookie(AUTH_COOKIE.NAME, token, getAuthCookieOptions());
};

const clearAuthCookie = (res) => {
  const { maxAge, ...options } = getAuthCookieOptions();
  res.clearCookie(AUTH_COOKIE.NAME, options);
};

const getAuthTokenFromCookies = (req) =>
  req.signedCookies?.[AUTH_COOKIE.NAME] || req.cookies?.[AUTH_COOKIE.NAME];

module.exports = {
  clearAuthCookie,
  getAuthCookieOptions,
  getAuthTokenFromCookies,
  getCookieSecret,
  setAuthCookie,
};
