const { AUTH_COOKIE, COOKIE_SAME_SITE } = require("../constants/cookies");

const getCookieSecret = () =>
  process.env.COOKIE_SECRET || process.env.JWT_SECRET || "your-secret-key";

const getAuthCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite:
    process.env.COOKIE_SAME_SITE ||
    (process.env.NODE_ENV === "production"
      ? COOKIE_SAME_SITE.NONE
      : COOKIE_SAME_SITE.LAX),
  maxAge: Number(process.env.AUTH_COOKIE_MAX_AGE_MS) || AUTH_COOKIE.MAX_AGE_MS,
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
