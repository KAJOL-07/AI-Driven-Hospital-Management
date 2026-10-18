const express = require("express");
const router = express.Router();
const {
  getAllBills, getBillById, createBill, updateBill, processPayment, deleteBill, getBillingStats, getPatientBills
} = require("../controllers/billingController");
const { requireAuth } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

router.use(requireAuth);
router.get("/", getAllBills);
router.get("/stats", getBillingStats);
router.get("/patient/:patientId", getPatientBills);
router.get("/:id", getBillById);
router.post("/", requireRole("admin", "receptionist", "billing"), createBill);
router.put("/:id", requireRole("admin", "billing"), updateBill);
router.patch("/:id/payment", requireRole("admin", "receptionist", "billing"), processPayment);
router.delete("/:id", requireRole("admin"), deleteBill);

module.exports = router;
