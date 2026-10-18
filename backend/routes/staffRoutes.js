const express = require("express");
const router = express.Router();
const { getAllStaff, getStaffById, createStaff, updateStaff, deleteStaff, getStaffStats } = require("../controllers/staffController");
const { requireAuth } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

router.use(requireAuth);
router.get("/", getAllStaff);
router.get("/stats", getStaffStats);
router.get("/:id", getStaffById);
router.post("/", requireRole("admin"), createStaff);
router.put("/:id", requireRole("admin"), updateStaff);
router.delete("/:id", requireRole("admin"), deleteStaff);

module.exports = router;
