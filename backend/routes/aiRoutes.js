const express = require("express");
const router = express.Router();
const { getCapacityForecast, getSmartBedAllocation, getTransferRecommendation } = require("../controllers/aiController");
const { requireAuth } = require("../middleware/authMiddleware");

router.use(requireAuth);
router.get("/capacity-forecast", getCapacityForecast);
router.post("/smart-allocation", getSmartBedAllocation);
router.get("/transfer-recommendation/:patientId", getTransferRecommendation);

module.exports = router;
