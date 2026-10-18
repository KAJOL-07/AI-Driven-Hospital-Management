const EmergencyCase = require("../models/EmergencyCase");
const Doctor = require("../models/Doctor");
const Department = require("../models/Department");
const Bed = require("../models/Bed");
const Ward = require("../models/Ward");
const Patient = require("../models/Patient");
const Notification = require("../models/Notification");

const generateCaseId = () => `EMG-${Math.floor(1000 + Math.random() * 9000)}`;

// GET /api/emergency
const getAllEmergencies = async (req, res) => {
  try {
    const { status, priority, department_id } = req.query;
    const filter = { isDeleted: false };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (department_id) filter.requiredDepartmentId = department_id;

    const cases = await EmergencyCase.find(filter)
      .populate("patientId", "firstName lastName patientId")
      .populate("assignedDoctorId", "name")
      .populate("requiredDepartmentId", "name")
      .populate({ path: "assignedBedId", select: "bedNumber wardId", populate: { path: "wardId", select: "name" } })
      .sort({ arrivalTime: -1 })
      .lean();

    const mapped = cases.map(e => ({
      ...e,
      id: e._id,
      case_id: e.caseId,
      patient_name: e.patientName,
      patient_name_registered: e.patientId ? `${e.patientId.firstName} ${e.patientId.lastName}` : null,
      doctor_name: e.assignedDoctorId?.name || null,
      department_name: e.requiredDepartmentId?.name || null,
      ward_name: e.assignedBedId?.wardId?.name || null,
      bed_number: e.assignedBedId?.bedNumber || null,
      arrival_time: e.arrivalTime
    }));

    res.json({ success: true, message: "Emergency cases retrieved.", data: mapped, count: mapped.length });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve emergency cases.", error: error.message });
  }
};

// GET /api/emergency/stats
const getEmergencyStats = async (req, res) => {
  try {
    const cases = await EmergencyCase.find({ isDeleted: false }).lean();
    let active_critical = 0, active_high = 0, active_medium = 0, active_low = 0;
    let total_active = 0, resolved = 0, admitted = 0;

    cases.forEach(c => {
      if (c.status === "active") {
        total_active++;
        if (c.priority === "critical") active_critical++;
        else if (c.priority === "high") active_high++;
        else if (c.priority === "medium") active_medium++;
        else if (c.priority === "low") active_low++;
      } else if (c.status === "resolved") {
        resolved++;
      } else if (c.status === "admitted") {
        admitted++;
      }
    });

    const emergencyWards = await Ward.find({ wardType: "emergency", status: { $ne: "deleted" } }).lean();
    const wardIds = emergencyWards.map(w => w._id);
    const emergencyBeds = await Bed.find({ wardId: { $in: wardIds }, isDeleted: false }).lean();

    const total_emergency_beds = emergencyBeds.length;
    const available_emergency_beds = emergencyBeds.filter(b => b.status === "available").length;
    const occupied_emergency_beds = emergencyBeds.filter(b => b.status === "occupied").length;

    res.json({
      success: true,
      message: "Emergency stats retrieved.",
      data: {
        active_critical,
        active_high,
        active_medium,
        active_low,
        total_active,
        resolved,
        admitted,
        emergency_beds: {
          total_emergency_beds,
          available_emergency_beds,
          occupied_emergency_beds
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to get emergency stats.", error: error.message });
  }
};

// GET /api/emergency/:id
const getEmergencyById = async (req, res) => {
  try {
    const e = await EmergencyCase.findOne({ _id: req.params.id, isDeleted: false })
      .populate("patientId", "firstName lastName")
      .populate("assignedDoctorId", "name")
      .populate("requiredDepartmentId", "name")
      .populate({ path: "assignedBedId", select: "bedNumber wardId", populate: { path: "wardId", select: "name" } })
      .lean();

    if (!e) return res.status(404).json({ success: false, message: "Emergency case not found." });

    res.json({
      success: true,
      message: "Emergency case retrieved.",
      data: {
        ...e,
        id: e._id,
        case_id: e.caseId,
        doctor_name: e.assignedDoctorId?.name || null,
        department_name: e.requiredDepartmentId?.name || null,
        bed_number: e.assignedBedId?.bedNumber || null,
        ward_name: e.assignedBedId?.wardId?.name || null
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve emergency case.", error: error.message });
  }
};

// POST /api/emergency
const createEmergency = async (req, res) => {
  try {
    const { patient_name, patient_id, priority, condition_description, required_department_id, required_bed_type, assigned_doctor_id } = req.body;
    if (!patient_name || !priority || !condition_description) {
      return res.status(400).json({ success: false, message: "patient_name, priority, and condition_description are required." });
    }

    const case_id = generateCaseId();
    const newCase = await EmergencyCase.create({
      caseId: case_id,
      patientName: patient_name.trim(),
      patientId: patient_id || null,
      priority,
      conditionDescription: condition_description.trim(),
      requiredDepartmentId: required_department_id || null,
      requiredBedType: required_bed_type || "emergency",
      assignedDoctorId: assigned_doctor_id || null,
      arrivalTime: new Date(),
      status: "active",
      isDeleted: false
    });

    await Notification.create({
      title: `CRITICAL EMERGENCY: ${patient_name}`,
      message: `Emergency case ${case_id} (${priority.toUpperCase()}) registered. Immediate triage required.`,
      type: "emergency",
      relatedId: newCase._id,
      relatedType: "emergency"
    });

    res.status(201).json({ success: true, message: "Emergency case registered.", data: newCase });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to register emergency case.", error: error.message });
  }
};

// PUT /api/emergency/:id
const updateEmergency = async (req, res) => {
  try {
    const { patient_name, priority, condition_description, required_department_id, required_bed_type, assigned_doctor_id, status } = req.body;
    const updates = {};
    if (patient_name) updates.patientName = patient_name.trim();
    if (priority) updates.priority = priority;
    if (condition_description) updates.conditionDescription = condition_description.trim();
    if (required_department_id !== undefined) updates.requiredDepartmentId = required_department_id;
    if (required_bed_type) updates.requiredBedType = required_bed_type;
    if (assigned_doctor_id !== undefined) updates.assignedDoctorId = assigned_doctor_id;
    if (status) updates.status = status;

    const updated = await EmergencyCase.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, updates, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Emergency case not found." });

    res.json({ success: true, message: "Emergency case updated.", data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update emergency case.", error: error.message });
  }
};

// PATCH /api/emergency/:id/assign-doctor
const assignDoctor = async (req, res) => {
  try {
    const { doctor_id } = req.body;
    if (!doctor_id) return res.status(400).json({ success: false, message: "doctor_id is required." });

    const updated = await EmergencyCase.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, { assignedDoctorId: doctor_id }, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Emergency case not found." });

    res.json({ success: true, message: "Doctor assigned to emergency case." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to assign doctor.", error: error.message });
  }
};

// PATCH /api/emergency/:id/assign-bed
const assignBed = async (req, res) => {
  try {
    const { bed_id } = req.body;
    if (!bed_id) return res.status(400).json({ success: false, message: "bed_id is required." });

    const bed = await Bed.findOne({ _id: bed_id, isDeleted: false });
    if (!bed) return res.status(404).json({ success: false, message: "Bed not found." });
    if (bed.status !== "available") return res.status(409).json({ success: false, message: `Bed is not available (${bed.status}).` });

    await EmergencyCase.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, { assignedBedId: bed_id, status: "admitted" });
    await Bed.findByIdAndUpdate(bed_id, { status: "occupied" });

    res.json({ success: true, message: "Bed assigned to emergency case and occupied." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to assign bed.", error: error.message });
  }
};

// PATCH /api/emergency/:id/resolve
const resolveEmergency = async (req, res) => {
  try {
    const updated = await EmergencyCase.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, { status: "resolved" }, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Emergency case not found." });

    res.json({ success: true, message: "Emergency case marked as resolved." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to resolve emergency case.", error: error.message });
  }
};

module.exports = {
  getAllEmergencies,
  getEmergencyById,
  createEmergency,
  updateEmergency,
  assignDoctor,
  assignBed,
  resolveEmergency,
  getEmergencyStats
};
