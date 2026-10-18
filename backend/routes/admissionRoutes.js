const express = require("express");
const router = express.Router();
const { getAllAdmissions, getAdmissionById, createAdmission, updateAdmission, getActiveAdmissions, getPatientAdmissions } = require("../controllers/admissionController");
const { requireAuth } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

router.use(requireAuth);
router.get("/", getAllAdmissions);
router.get("/active", getActiveAdmissions);
router.get("/patient/:patientId", getPatientAdmissions);
router.get("/:id", getAdmissionById);
router.post("/", requireRole("admin", "doctor", "receptionist"), createAdmission);
router.put("/:id", requireRole("admin", "doctor"), updateAdmission);

module.exports = router;
