const { forecastBedCapacity, recommendBedAllocation, recommendTransfer } = require("../services/aiService");

// GET /api/ai/capacity-forecast
const getCapacityForecast = async (req, res) => {
  try {
    const days = parseInt(req.query.days || "7");
    const forecastData = await forecastBedCapacity(days);
    res.json({
      success: true,
      message: "AI Capacity Forecast generated successfully.",
      data: forecastData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to generate AI capacity forecast.", error: error.message });
  }
};

// POST /api/ai/smart-allocation
const getSmartBedAllocation = async (req, res) => {
  try {
    const recommendation = await recommendBedAllocation(req.body);
    res.json({
      success: true,
      message: "Smart Bed Allocation recommendation generated.",
      data: recommendation
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to evaluate smart bed allocation.", error: error.message });
  }
};

// GET /api/ai/transfer-recommendation/:patientId
const getTransferRecommendation = async (req, res) => {
  try {
    const recommendation = await recommendTransfer(req.params.patientId);
    res.json({
      success: true,
      message: "AI Transfer Recommendation generated.",
      data: recommendation
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to generate transfer recommendation.", error: error.message });
  }
};

module.exports = {
  getCapacityForecast,
  getSmartBedAllocation,
  getTransferRecommendation
};
