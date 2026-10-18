const Discharge = require("../models/Discharge");
const Admission = require("../models/Admission");
const Patient = require("../models/Patient");
const Bed = require("../models/Bed");
const Notification = require("../models/Notification");

const generateDischargeId = () => `DCH-${Math.floor(1000 + Math.random() * 9000)}`;

// GET /api/discharges
const getAllDischarges = async (req, res) => {
  try {
    const { patient_id, date, status } = req.query;
    const filter = {};
    if (patient_id) filter.patientId = patient_id;
    if (status) filter.dischargeType = status;
    if (date) {
      const d = new Date(date);
      const nextDay = new Date(d);
      nextDay.setDate(nextDay.getDate() + 1);
      filter.dischargeDate = { $gte: d, $lt: nextDay };
    }

    const discharges = await Discharge.find(filter)
      .populate("patientId", "firstName lastName patientId")
      .populate("doctorId", "name")
      .populate("wardId", "name")
      .populate("bedId", "bedNumber")
      .sort({ dischargeDate: -1 })
      .lean();

    const mapped = discharges.map(dis => ({
      ...dis,
      id: dis._id,
      discharge_id: dis.dischargeId,
      patient_id: dis.patientId?._id,
      patient_name: dis.patientId ? `${dis.patientId.firstName} ${dis.patientId.lastName}` : null,
      patient_code: dis.patientId?.patientId || null,
      doctor_id: dis.doctorId?._id,
      doctor_name: dis.doctorId?.name || null,
      ward_name: dis.wardId?.name || null,
      bed_number: dis.bedId?.bedNumber || null,
      discharge_reason: dis.dischargeReason,
      discharge_date: dis.dischargeDate
    }));

    res.json({ success: true, message: "Discharges retrieved.", data: mapped, count: mapped.length });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve discharges.", error: error.message });
  }
};

// GET /api/discharges/today
const getTodaysDischarges = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const discharges = await Discharge.find({
      dischargeDate: { $gte: today, $lt: tomorrow }
    })
      .populate("patientId", "firstName lastName")
      .populate("doctorId", "name")
      .sort({ dischargeDate: -1 })
      .lean();

    const mapped = discharges.map(dis => ({
      ...dis,
      id: dis._id,
      discharge_id: dis.dischargeId,
      patient_name: dis.patientId ? `${dis.patientId.firstName} ${dis.patientId.lastName}` : null,
      doctor_name: dis.doctorId?.name || null
    }));

    res.json({ success: true, message: "Today's discharges retrieved.", data: mapped });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve today's discharges.", error: error.message });
  }
};

// GET /api/discharges/:id
const getDischargeById = async (req, res) => {
  try {
    const dis = await Discharge.findById(req.params.id)
      .populate("patientId", "firstName lastName")
      .populate("doctorId", "name")
      .populate("wardId", "name")
      .populate("bedId", "bedNumber")
      .lean();

    if (!dis) return res.status(404).json({ success: false, message: "Discharge record not found." });

    res.json({
      success: true,
      message: "Discharge retrieved.",
      data: {
        ...dis,
        id: dis._id,
        discharge_id: dis.dischargeId,
        patient_name: dis.patientId ? `${dis.patientId.firstName} ${dis.patientId.lastName}` : null,
        doctor_name: dis.doctorId?.name || null,
        ward_name: dis.wardId?.name || null,
        bed_number: dis.bedId?.bedNumber || null
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve discharge.", error: error.message });
  }
};

// POST /api/discharges
const createDischarge = async (req, res) => {
  try {
    const { patient_id, discharge_reason, doctor_id, notes, discharge_type } = req.body;
    if (!patient_id || !discharge_reason) {
      return res.status(400).json({ success: false, message: "patient_id and discharge_reason are required." });
    }

    // Find active admission
    const admission = await Admission.findOne({ patientId: patient_id, status: "active" }).sort({ admissionDate: -1 });
    if (!admission) {
      return res.status(404).json({ success: false, message: "No active admission found for this patient." });
    }

    const dis_id = generateDischargeId();
    const now = new Date();

    const newDis = await Discharge.create({
      dischargeId: dis_id,
      patientId: patient_id,
      admissionId: admission._id,
      doctorId: doctor_id || admission.doctorId,
      wardId: admission.wardId,
      bedId: admission.bedId,
      dischargeReason: discharge_reason,
      notes: notes || null,
      dischargeType: discharge_type || "regular",
      dischargeDate: now,
      status: "completed"
    });

    await Admission.findByIdAndUpdate(admission._id, { status: "discharged", dischargeDate: now });
    await Bed.findByIdAndUpdate(admission.bedId, {
      status: "cleaning_required",
      patientId: null,
      lastCleaned: "Turnover Required"
    });
    await Patient.findByIdAndUpdate(patient_id, {
      admissionStatus: "outpatient",
      currentWardId: null,
      currentBedId: null
    });

    await Notification.create({
      title: "Patient Discharged",
      message: `Discharge ${dis_id} processed. Bed released.`,
      type: "discharge",
      relatedId: newDis._id,
      relatedType: "discharge"
    });

    res.status(201).json({ success: true, message: "Patient discharged successfully. Bed released.", data: newDis });
  } catch (error) {
    console.error("createDischarge error:", error);
    res.status(500).json({ success: false, message: "Discharge failed.", error: error.message });
  }
};

module.exports = { getAllDischarges, getDischargeById, createDischarge, getTodaysDischarges };
