const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { getOrCreateGoogleUserService } = require("../services/auth.service");
const logger = require("./logger");
const config = require("./config");

const getCallbackUrl = () => {
  if (config.google.callbackUrl) {
    return config.google.callbackUrl;
  }
  return `${config.apiUrl.replace(/\/$/, "")}/api/v1/auth/google/callback`;
};

passport.use(
  new GoogleStrategy(
    {
      clientID: config.google.clientId || "google-client-id-placeholder",
      clientSecret:
        config.google.clientSecret || "google-client-secret-placeholder",
      callbackURL: getCallbackUrl(),
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await getOrCreateGoogleUserService(profile);
        return done(null, user);
      } catch (error) {
        logger.error("Google OAuth strategy failed: %o", error);
        return done(error, null);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;
