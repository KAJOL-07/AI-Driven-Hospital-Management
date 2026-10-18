const express = require("express");
const router = express.Router();
const {
  getAllEmergencies, getEmergencyById, createEmergency, updateEmergency,
  assignDoctor, assignBed, resolveEmergency, getEmergencyStats
} = require("../controllers/emergencyController");
const { requireAuth } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

router.use(requireAuth);
router.get("/", getAllEmergencies);
router.get("/stats", getEmergencyStats);
router.get("/:id", getEmergencyById);
router.post("/", requireRole("admin", "doctor", "nurse", "receptionist"), createEmergency);
router.put("/:id", requireRole("admin", "doctor", "nurse"), updateEmergency);
router.patch("/:id/assign-doctor", requireRole("admin", "doctor", "nurse"), assignDoctor);
router.patch("/:id/assign-bed", requireRole("admin", "doctor", "nurse"), assignBed);
router.patch("/:id/resolve", requireRole("admin", "doctor", "nurse"), resolveEmergency);

module.exports = router;
