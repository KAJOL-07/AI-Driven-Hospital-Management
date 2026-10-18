const LabTest = require("../models/LabTest");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");

const generateTestId = () => `LAB-${Math.floor(1000 + Math.random() * 9000)}`;

const getAllLabTests = async (req, res) => {
  try {
    const { patient_id, doctor_id, status, test_type, date } = req.query;
    const filter = { isDeleted: false };
    if (patient_id) filter.patientId = patient_id;
    if (doctor_id) filter.requestedBy = doctor_id;
    if (status) filter.status = status;
    if (test_type) filter.testType = new RegExp(test_type, "i");
    if (date) {
      const d = new Date(date);
      const nextDay = new Date(d);
      nextDay.setDate(nextDay.getDate() + 1);
      filter.createdAt = { $gte: d, $lt: nextDay };
    }

    const tests = await LabTest.find(filter)
      .populate("patientId", "firstName lastName patientId")
      .populate("requestedBy", "name")
      .sort({ createdAt: -1 })
      .lean();

    const mapped = tests.map(lt => ({
      ...lt,
      id: lt._id,
      test_id: lt.testId,
      patient_id: lt.patientId?._id,
      patient_name: lt.patientId ? `${lt.patientId.firstName} ${lt.patientId.lastName}` : null,
      patient_code: lt.patientId?.patientId || null,
      doctor_name: lt.requestedBy?.name || null,
      test_type: lt.testType,
      created_at: lt.createdAt
    }));

    res.json({ success: true, message: "Lab tests retrieved.", data: mapped, count: mapped.length });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve lab tests.", error: error.message });
  }
};

const getLabTestById = async (req, res) => {
  try {
    const lt = await LabTest.findOne({ _id: req.params.id, isDeleted: false })
      .populate("patientId", "firstName lastName")
      .populate("requestedBy", "name")
      .lean();

    if (!lt) return res.status(404).json({ success: false, message: "Lab test not found." });

    res.json({
      success: true,
      message: "Lab test retrieved.",
      data: {
        ...lt,
        id: lt._id,
        test_id: lt.testId,
        patient_name: lt.patientId ? `${lt.patientId.firstName} ${lt.patientId.lastName}` : null,
        doctor_name: lt.requestedBy?.name || null
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve lab test.", error: error.message });
  }
};

const createLabTest = async (req, res) => {
  try {
    const { patient_id, test_type, requested_by, remarks, priority } = req.body;
    if (!patient_id || !test_type || !requested_by) {
      return res.status(400).json({ success: false, message: "patient_id, test_type, and requested_by are required." });
    }

    const newTest = await LabTest.create({
      testId: generateTestId(),
      patientId: patient_id,
      testType: test_type.trim(),
      requestedBy: requested_by,
      remarks: remarks || null,
      priority: priority || "routine",
      status: "requested",
      isDeleted: false
    });

    res.status(201).json({ success: true, message: "Lab test created.", data: newTest });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create lab test.", error: error.message });
  }
};

const updateLabTest = async (req, res) => {
  try {
    const { test_type, remarks, priority, status } = req.body;
    const updates = {};
    if (test_type) updates.testType = test_type;
    if (remarks !== undefined) updates.remarks = remarks;
    if (priority) updates.priority = priority;
    if (status) updates.status = status;

    const updated = await LabTest.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, updates, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Lab test not found." });

    res.json({ success: true, message: "Lab test updated.", data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update lab test.", error: error.message });
  }
};

const updateTestResult = async (req, res) => {
  try {
    const { result, remarks } = req.body;
    if (!result) return res.status(400).json({ success: false, message: "result is required." });

    const updates = { result, status: "completed", completedAt: new Date() };
    if (remarks !== undefined) updates.remarks = remarks;

    const updated = await LabTest.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, updates, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Lab test not found." });

    res.json({ success: true, message: "Test result updated.", data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update test result.", error: error.message });
  }
};

const updateTestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const valid = ["requested", "in_progress", "completed", "cancelled"];
    if (!valid.includes(status)) return res.status(400).json({ success: false, message: `Status must be: ${valid.join(", ")}` });

    const updated = await LabTest.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, { status }, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Lab test not found." });

    res.json({ success: true, message: `Test status updated to '${status}'.`, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update test status.", error: error.message });
  }
};

const getLabStats = async (req, res) => {
  try {
    const tests = await LabTest.find({ isDeleted: false }).lean();
    const stats = { total: tests.length, requested: 0, in_progress: 0, completed: 0, cancelled: 0 };
    tests.forEach(t => {
      if (stats[t.status] !== undefined) stats[t.status]++;
    });
    res.json({ success: true, message: "Lab stats retrieved.", data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to get lab stats.", error: error.message });
  }
};

const deleteLabTest = async (req, res) => {
  try {
    const updated = await LabTest.findOneAndUpdate({ _id: req.params.id }, { isDeleted: true }, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Lab test not found." });
    res.json({ success: true, message: "Lab test deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete lab test.", error: error.message });
  }
};

module.exports = {
  getAllLabTests,
  getLabTestById,
  createLabTest,
  updateLabTest,
  updateTestResult,
  updateTestStatus,
  deleteLabTest,
  getLabStats
};
