const express = require("express");
const router = express.Router();
const {
  getAdminDashboard,
  getDoctorDashboard,
  getNurseDashboard,
  getReceptionistDashboard
} = require("../controllers/dashboardController");
const { requireAuth } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

router.use(requireAuth);

router.get("/admin", requireRole("admin"), getAdminDashboard);
router.get("/doctor", requireRole("doctor", "admin"), getDoctorDashboard);
router.get("/nurse", requireRole("nurse", "admin"), getNurseDashboard);
router.get("/receptionist", requireRole("receptionist", "admin"), getReceptionistDashboard);

module.exports = router;
