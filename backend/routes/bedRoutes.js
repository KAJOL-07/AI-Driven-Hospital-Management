const express = require("express");
const router = express.Router();
const {
  getAllBeds,
  getFloorStats,
  getBedStats,
  getAvailableBeds,
  getBedById,
  configureGroundFloorBeds,
  createBed,
  updateBed,
  updateBedStatus,
  deleteBed
} = require("../controllers/bedController");
const { requireAuth } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

router.use(requireAuth);

router.get("/", getAllBeds);
router.get("/floor-stats", getFloorStats);
router.get("/stats", getBedStats);
router.get("/available", getAvailableBeds);
router.post("/ground-floor/configure", requireRole("admin"), configureGroundFloorBeds);
router.get("/:id", getBedById);

router.post("/", requireRole("admin"), createBed);
router.put("/:id", requireRole("admin"), updateBed);
router.patch("/:id/status", requireRole("admin", "nurse", "doctor", "receptionist"), updateBedStatus);
router.delete("/:id", requireRole("admin"), deleteBed);

module.exports = router;
