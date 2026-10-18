const express = require("express");
const router = express.Router();
const { getAllNotifications, markAsRead, markAllAsRead, createNotification } = require("../controllers/notificationController");
const { requireAuth } = require("../middleware/authMiddleware");

router.use(requireAuth);
router.get("/", getAllNotifications);
router.patch("/read-all", markAllAsRead);
router.patch("/:id/read", markAsRead);
router.post("/", createNotification);

module.exports = router;
