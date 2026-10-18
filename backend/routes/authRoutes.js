const express = require("express");
const router = express.Router();
const { signup, login, getMe, updateProfile } = require("../controllers/authController");
const { requireAuth } = require("../middleware/authMiddleware");

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", requireAuth, getMe);
router.put("/profile", requireAuth, updateProfile);

module.exports = router;
