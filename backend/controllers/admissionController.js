const Admission = require("../models/Admission");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Ward = require("../models/Ward");
const Bed = require("../models/Bed");
const Department = require("../models/Department");
const Notification = require("../models/Notification");

const generateAdmissionId = () => `ADM-${Math.floor(1000 + Math.random() * 9000)}`;

// GET /api/admissions
const getAllAdmissions = async (req, res) => {
  try {
    const { patient_id, doctor_id, ward_id, status, date } = req.query;
    const filter = {};
    if (patient_id) filter.patientId = patient_id;
    if (doctor_id) filter.doctorId = doctor_id;
    if (ward_id) filter.wardId = ward_id;
    if (status) filter.status = status;
    if (date) {
      const d = new Date(date);
      const nextDay = new Date(d);
      nextDay.setDate(nextDay.getDate() + 1);
      filter.admissionDate = { $gte: d, $lt: nextDay };
    }

    const admissions = await Admission.find(filter)
      .populate("patientId", "firstName lastName patientId")
      .populate("doctorId", "name specialization")
      .populate("wardId", "name")
      .populate("bedId", "bedNumber")
      .populate("departmentId", "name")
      .sort({ admissionDate: -1 })
      .lean();

    const mapped = admissions.map(adm => ({
      ...adm,
      id: adm._id,
      admission_id: adm.admissionId,
      patient_id: adm.patientId?._id,
      patient_name: adm.patientId ? `${adm.patientId.firstName} ${adm.patientId.lastName}` : null,
      patient_code: adm.patientId?.patientId || null,
      doctor_id: adm.doctorId?._id,
      doctor_name: adm.doctorId?.name || null,
      ward_id: adm.wardId?._id,
      ward_name: adm.wardId?.name || null,
      bed_id: adm.bedId?._id,
      bed_number: adm.bedId?.bedNumber || null,
      department_name: adm.departmentId?.name || null,
      admission_date: adm.admissionDate,
      admission_reason: adm.admissionReason
    }));

    res.json({ success: true, message: "Admissions retrieved.", data: mapped, count: mapped.length });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve admissions.", error: error.message });
  }
};

// GET /api/admissions/active
const getActiveAdmissions = async (req, res) => {
  try {
    const admissions = await Admission.find({ status: "active" })
      .populate("patientId", "firstName lastName patientId")
      .populate("doctorId", "name")
      .populate("wardId", "name")
      .populate("bedId", "bedNumber")
      .sort({ admissionDate: -1 })
      .lean();

    const mapped = admissions.map(adm => ({
      ...adm,
      id: adm._id,
      admission_id: adm.admissionId,
      patient_name: adm.patientId ? `${adm.patientId.firstName} ${adm.patientId.lastName}` : null,
      doctor_name: adm.doctorId?.name || null,
      ward_name: adm.wardId?.name || null,
      bed_number: adm.bedId?.bedNumber || null
    }));

    res.json({ success: true, message: "Active admissions retrieved.", data: mapped, count: mapped.length });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve active admissions.", error: error.message });
  }
};

// GET /api/admissions/:id
const getAdmissionById = async (req, res) => {
  try {
    const adm = await Admission.findById(req.params.id)
      .populate("patientId", "firstName lastName patientId")
      .populate("doctorId", "name")
      .populate("wardId", "name")
      .populate("bedId", "bedNumber")
      .populate("departmentId", "name")
      .lean();

    if (!adm) return res.status(404).json({ success: false, message: "Admission not found." });

    res.json({
      success: true,
      message: "Admission retrieved.",
      data: {
        ...adm,
        id: adm._id,
        admission_id: adm.admissionId,
        patient_name: adm.patientId ? `${adm.patientId.firstName} ${adm.patientId.lastName}` : null,
        doctor_name: adm.doctorId?.name || null,
        ward_name: adm.wardId?.name || null,
        bed_number: adm.bedId?.bedNumber || null,
        department_name: adm.departmentId?.name || null
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve admission.", error: error.message });
  }
};

// GET /api/admissions/patient/:patientId
const getPatientAdmissions = async (req, res) => {
  try {
    const admissions = await Admission.find({ patientId: req.params.patientId })
      .populate("doctorId", "name")
      .populate("wardId", "name")
      .populate("bedId", "bedNumber")
      .sort({ admissionDate: -1 })
      .lean();

    const mapped = admissions.map(adm => ({
      ...adm,
      id: adm._id,
      admission_id: adm.admissionId,
      doctor_name: adm.doctorId?.name || null,
      ward_name: adm.wardId?.name || null,
      bed_number: adm.bedId?.bedNumber || null
    }));

    res.json({ success: true, message: "Patient admissions retrieved.", data: mapped, count: mapped.length });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve patient admissions.", error: error.message });
  }
};

// POST /api/admissions
const createAdmission = async (req, res) => {
  try {
    const { patient_id, doctor_id, ward_id, bed_id, department_id, admission_reason, priority, notes } = req.body;
    if (!patient_id || !doctor_id || !ward_id || !bed_id || !admission_reason) {
      return res.status(400).json({ success: false, message: "patient_id, doctor_id, ward_id, bed_id, and admission_reason are required." });
    }

    const patient = await Patient.findOne({ _id: patient_id, status: { $ne: "deleted" } });
    if (!patient) return res.status(404).json({ success: false, message: "Patient not found." });
    if (patient.admissionStatus === "admitted") return res.status(409).json({ success: false, message: "Patient is already admitted." });

    const doctor = await Doctor.findOne({ _id: doctor_id, status: { $ne: "deleted" } });
    if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found." });

    const ward = await Ward.findOne({ _id: ward_id, status: { $ne: "deleted" } });
    if (!ward) return res.status(404).json({ success: false, message: "Ward not found." });

    const bed = await Bed.findOne({ _id: bed_id, isDeleted: false });
    if (!bed) return res.status(404).json({ success: false, message: "Bed not found." });
    if (bed.status !== "available") return res.status(409).json({ success: false, message: `Bed is not available. Current status: ${bed.status}` });

    const adm_id = generateAdmissionId();

    const newAdm = await Admission.create({
      admissionId: adm_id,
      patientId: patient_id,
      doctorId: doctor_id,
      wardId: ward_id,
      bedId: bed_id,
      departmentId: department_id || null,
      admissionDate: new Date(),
      admissionReason: admission_reason,
      priority: priority || "medium",
      notes: notes || null,
      status: "active"
    });

    await Bed.findByIdAndUpdate(bed_id, { status: "occupied", patientId: patient_id });
    await Patient.findByIdAndUpdate(patient_id, {
      admissionStatus: "admitted",
      currentWardId: ward_id,
      currentBedId: bed_id,
      assignedDoctorId: doctor_id
    });

    await Notification.create({
      title: "New Patient Admitted",
      message: `Admission ${adm_id} created. Bed assigned.`,
      type: "admission",
      relatedId: newAdm._id,
      relatedType: "admission"
    });

    res.status(201).json({ success: true, message: "Patient admitted successfully.", data: newAdm });
  } catch (error) {
    console.error("createAdmission error:", error);
    res.status(500).json({ success: false, message: "Admission failed.", error: error.message });
  }
};

// PUT /api/admissions/:id
const updateAdmission = async (req, res) => {
  try {
    const { admission_reason, priority, notes, status } = req.body;
    const updates = {};
    if (admission_reason) updates.admissionReason = admission_reason;
    if (priority) updates.priority = priority;
    if (notes !== undefined) updates.notes = notes;
    if (status) updates.status = status;

    const updated = await Admission.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Admission not found." });
    res.json({ success: true, message: "Admission updated.", data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update admission.", error: error.message });
  }
};

module.exports = { getAllAdmissions, getAdmissionById, createAdmission, updateAdmission, getActiveAdmissions, getPatientAdmissions };
