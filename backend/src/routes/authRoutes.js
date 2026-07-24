const express = require("express");
const passport = require("passport");
const asyncHandler = require("express-async-handler");
const config = require("../config/config");
const {
  registerUser,
  loginUser,
  logoutUser,
  getUsers,
  getMe,
  updateMe,
  deleteMe,
  adminDeleteUser,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { setAuthCookie } = require("../utils/cookies");
const { admin } = require("../middleware/adminMiddleware");
const {
  loginUserValidation,
  registerUserValidation,
  updateUserProfileValidation,
} = require("../validation/auth.validation");
const router = express.Router();

const frontendUrl = config.frontendUrl;

router.post("/register", registerUserValidation, registerUser);
router.post("/login", loginUserValidation, loginUser);
router.post("/logout", logoutUser);
router.get("/users", protect, admin, getUsers);
router.delete("/users/:id", protect, admin, adminDeleteUser);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: `${frontendUrl}/login`, session: false }),
  asyncHandler(async (req, res) => {
    setAuthCookie(res, req.user.token);
    res.redirect(`${frontendUrl}/google-success?token=${req.user.token}`);
  })
);

router.get("/me", protect, getMe);
router.put("/me", protect, updateUserProfileValidation, updateMe);
router.delete("/me", protect, deleteMe);

module.exports = router;
