const express = require("express");
const router = express.Router();
const { getAllLabTests, getLabTestById, createLabTest, updateLabTest, updateTestResult, updateTestStatus, deleteLabTest, getLabStats } = require("../controllers/laboratoryController");
const { requireAuth } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

router.use(requireAuth);
router.get("/", getAllLabTests);
router.get("/stats", getLabStats);
router.get("/:id", getLabTestById);
router.post("/", requireRole("admin", "doctor"), createLabTest);
router.put("/:id", requireRole("admin", "doctor", "lab_technician"), updateLabTest);
router.patch("/:id/result", requireRole("admin", "lab_technician"), updateTestResult);
router.patch("/:id/status", requireRole("admin", "lab_technician"), updateTestStatus);
router.delete("/:id", requireRole("admin", "doctor"), deleteLabTest);

module.exports = router;
