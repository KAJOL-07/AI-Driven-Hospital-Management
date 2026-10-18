const express = require("express");
const router = express.Router();
const { getAllMedicines, getMedicineById, createMedicine, updateMedicine, deleteMedicine, updateStock, getLowStockMedicines, getMedicineStats } = require("../controllers/pharmacyController");
const { requireAuth } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

router.use(requireAuth);
router.get("/", getAllMedicines);
router.get("/stats", getMedicineStats);
router.get("/low-stock", getLowStockMedicines);
router.get("/:id", getMedicineById);
router.post("/", requireRole("admin", "pharmacist"), createMedicine);
router.put("/:id", requireRole("admin", "pharmacist"), updateMedicine);
router.patch("/:id/stock", requireRole("admin", "pharmacist"), updateStock);
router.delete("/:id", requireRole("admin"), deleteMedicine);

module.exports = router;
