const express = require("express");
const router = express.Router();
const { getAllDischarges, getDischargeById, createDischarge, getTodaysDischarges } = require("../controllers/dischargeController");
const { requireAuth } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

router.use(requireAuth);
router.get("/", getAllDischarges);
router.get("/today", getTodaysDischarges);
router.get("/:id", getDischargeById);
router.post("/", requireRole("admin", "doctor", "receptionist"), createDischarge);

module.exports = router;
