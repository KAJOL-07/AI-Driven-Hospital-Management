const express = require("express");
const router = express.Router();
const { getAllWards, getWardById, createWard, updateWard, deleteWard, getWardBeds } = require("../controllers/wardController");
const { requireAuth } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

router.use(requireAuth);
router.get("/", getAllWards);
router.get("/:id", getWardById);
router.get("/:id/beds", getWardBeds);
router.post("/", requireRole("admin"), createWard);
router.put("/:id", requireRole("admin"), updateWard);
router.delete("/:id", requireRole("admin"), deleteWard);

module.exports = router;
