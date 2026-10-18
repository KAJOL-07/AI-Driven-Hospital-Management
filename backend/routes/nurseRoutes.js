const express = require("express");
const router = express.Router();
const { getAllNurses, getNurseById, createNurse, updateNurse, deleteNurse, getNurseStats } = require("../controllers/nurseController");
const { requireAuth } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

router.use(requireAuth);
router.get("/", getAllNurses);
router.get("/stats", getNurseStats);
router.get("/:id", getNurseById);
router.post("/", requireRole("admin"), createNurse);
router.put("/:id", requireRole("admin", "nurse"), updateNurse);
router.delete("/:id", requireRole("admin"), deleteNurse);

module.exports = router;
