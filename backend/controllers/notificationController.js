const Notification = require("../models/Notification");

// GET /api/notifications
const getAllNotifications = async (req, res) => {
  try {
    const { unread_only, limit = 50 } = req.query;
    const filter = { isDeleted: false };
    if (unread_only === "true") {
      filter.isRead = false;
    }

    const rows = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .lean();

    const mapped = rows.map(n => ({
      ...n,
      id: n._id,
      is_read: n.isRead ? 1 : 0,
      created_at: n.createdAt
    }));

    const unreadCount = await Notification.countDocuments({ isDeleted: false, isRead: false });

    res.json({ success: true, message: "Notifications retrieved.", data: mapped, unread_count: unreadCount });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve notifications.", error: error.message });
  }
};

// PATCH /api/notifications/:id/read
const markAsRead = async (req, res) => {
  try {
    const updated = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Notification not found." });
    res.json({ success: true, message: "Notification marked as read." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update notification.", error: error.message });
  }
};

// PATCH /api/notifications/read-all
const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ isRead: false }, { isRead: true });
    res.json({ success: true, message: "All notifications marked as read." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to mark notifications as read.", error: error.message });
  }
};

// POST /api/notifications
const createNotification = async (req, res) => {
  try {
    const { title, message, type, related_id, related_type } = req.body;
    if (!title || !message) {
      return res.status(400).json({ success: false, message: "Title and message are required." });
    }

    const newNotif = await Notification.create({
      title: title.trim(),
      message: message.trim(),
      type: type || "general",
      relatedId: related_id || null,
      relatedType: related_type || null,
      isRead: false,
      isDeleted: false
    });

    res.status(201).json({ success: true, message: "Notification created.", data: newNotif });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create notification.", error: error.message });
  }
};

module.exports = { getAllNotifications, markAsRead, markAllAsRead, createNotification };
