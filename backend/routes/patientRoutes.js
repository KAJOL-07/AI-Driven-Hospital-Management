const express = require("express");
const router = express.Router();
const { getAllPatients, getPatientById, createPatient, updatePatient, deletePatient, getPatientStats } = require("../controllers/patientController");
const { requireAuth } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

router.use(requireAuth);
router.get("/", getAllPatients);
router.get("/stats", getPatientStats);
router.get("/:id", getPatientById);
router.post("/", requireRole("admin", "doctor", "receptionist"), createPatient);
router.put("/:id", requireRole("admin", "doctor", "receptionist"), updatePatient);
router.delete("/:id", requireRole("admin"), deletePatient);

module.exports = router;
