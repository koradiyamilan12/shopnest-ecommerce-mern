const express = require("express");
const passport = require("passport");
const asyncHandler = require("express-async-handler");
const {
  registerUser,
  loginUser,
  logoutUser,
  getUsers,
  getMe,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { setAuthCookie } = require("../utils/cookies");
const { admin } = require("../middleware/adminMiddleware");
const {
  loginUserValidation,
  registerUserValidation,
} = require("../validation/auth.validation");
const router = express.Router();

const frontendUrl = (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, "");

router.post("/register", registerUserValidation, registerUser);
router.post("/login", loginUserValidation, loginUser);
router.post("/logout", logoutUser);
router.get("/users", protect, admin, getUsers);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: `${frontendUrl}/login`, session: false }),
  asyncHandler(async (req, res) => {
    setAuthCookie(res, req.user.token);
    res.redirect(`${frontendUrl}/google-success`);
  })
);

router.get("/me", protect, getMe);

module.exports = router;
