const router = require("express").Router();
const auth = require("../middleware/auth");
const {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getMe,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.get("/verify-email/:token", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/me", auth, getMe);

module.exports = router;
