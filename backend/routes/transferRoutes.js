const express = require("express");
const router = express.Router();
const {
  getAllTransfers, getActiveTransfers, getTransferStats, getTransferById,
  createTransfer, approveTransfer, rejectTransfer, executeTransfer
} = require("../controllers/transferController");
const { requireAuth } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

router.use(requireAuth);
router.get("/", getAllTransfers);
router.get("/active", getActiveTransfers);
router.get("/stats", getTransferStats);
router.get("/:id", getTransferById);
router.post("/", requireRole("admin", "doctor", "nurse"), createTransfer);
router.patch("/:id/approve", requireRole("admin", "doctor"), approveTransfer);
router.patch("/:id/reject", requireRole("admin", "doctor"), rejectTransfer);
router.patch("/:id/execute", requireRole("admin", "doctor", "nurse"), executeTransfer);

module.exports = router;
