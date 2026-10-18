const express = require("express");
const router = express.Router();
const { getAllAppointments, getAppointmentById, createAppointment, updateAppointment, deleteAppointment, getTodaysAppointments, updateAppointmentStatus } = require("../controllers/appointmentController");
const { requireAuth } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

router.use(requireAuth);
router.get("/", getAllAppointments);
router.get("/today", getTodaysAppointments);
router.get("/:id", getAppointmentById);
router.post("/", requireRole("admin", "doctor", "receptionist"), createAppointment);
router.put("/:id", requireRole("admin", "doctor", "receptionist"), updateAppointment);
router.patch("/:id/status", requireRole("admin", "doctor", "receptionist"), updateAppointmentStatus);
router.delete("/:id", requireRole("admin", "doctor"), deleteAppointment);

module.exports = router;
