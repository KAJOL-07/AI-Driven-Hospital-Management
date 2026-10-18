const express = require("express");
const router = express.Router();
const {
  getAllMedicalRecords, getMedicalRecordById, createMedicalRecord, updateMedicalRecord,
  deleteMedicalRecord, getPatientMedicalHistory,
  getPrescriptions, getPrescriptionById, createPrescription, updatePrescription
} = require("../controllers/medicalRecordController");
const { requireAuth } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

router.use(requireAuth);

// Medical Records
router.get("/", getAllMedicalRecords);
router.get("/patient/:patientId", getPatientMedicalHistory);
router.get("/:id", getMedicalRecordById);
router.post("/", requireRole("admin", "doctor"), createMedicalRecord);
router.put("/:id", requireRole("admin", "doctor"), updateMedicalRecord);
router.delete("/:id", requireRole("admin", "doctor"), deleteMedicalRecord);

// Prescriptions
router.get("/prescriptions/all", getPrescriptions);
router.get("/prescriptions/:id", getPrescriptionById);
router.post("/prescriptions", requireRole("admin", "doctor"), createPrescription);
router.put("/prescriptions/:id", requireRole("admin", "doctor"), updatePrescription);

module.exports = router;
