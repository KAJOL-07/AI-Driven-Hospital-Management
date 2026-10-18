const express = require("express");
const router = express.Router();
const {
  getAllInventoryItems, getInventoryItemById, createInventoryItem, updateInventoryItem,
  updateInventoryStock, deleteInventoryItem, getLowStockItems, getInventoryStats
} = require("../controllers/inventoryController");
const { requireAuth } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

router.use(requireAuth);
router.get("/", getAllInventoryItems);
router.get("/stats", getInventoryStats);
router.get("/low-stock", getLowStockItems);
router.get("/:id", getInventoryItemById);
router.post("/", requireRole("admin"), createInventoryItem);
router.put("/:id", requireRole("admin"), updateInventoryItem);
router.patch("/:id/stock", requireRole("admin"), updateInventoryStock);
router.delete("/:id", requireRole("admin"), deleteInventoryItem);

module.exports = router;
