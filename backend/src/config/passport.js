const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { getOrCreateGoogleUserService } = require("../services/auth.service");

const getCallbackUrl = () => {
  if (process.env.GOOGLE_CALLBACK_URL) {
    return process.env.GOOGLE_CALLBACK_URL;
  }
  const apiUrl =
    process.env.API_URL || `http://localhost:${process.env.PORT || 5000}`;
  return `${apiUrl.replace(/\/$/, "")}/api/v1/auth/google/callback`;
};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "google-client-id-placeholder",
      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET || "google-client-secret-placeholder",
      callbackURL: getCallbackUrl(),
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await getOrCreateGoogleUserService(profile);
        return done(null, user);
      } catch (error) {
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
