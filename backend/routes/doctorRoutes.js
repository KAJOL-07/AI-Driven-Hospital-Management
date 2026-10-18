const express = require("express");
const router = express.Router();
const { getAllDoctors, getDoctorById, createDoctor, updateDoctor, deleteDoctor, getDoctorStats, getDoctorPatients } = require("../controllers/doctorController");
const { requireAuth } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

router.use(requireAuth);
router.get("/", getAllDoctors);
router.get("/stats", getDoctorStats);
router.get("/:id", getDoctorById);
router.get("/:id/patients", getDoctorPatients);
router.post("/", requireRole("admin"), createDoctor);
router.put("/:id", requireRole("admin", "doctor"), updateDoctor);
router.delete("/:id", requireRole("admin"), deleteDoctor);

module.exports = router;
