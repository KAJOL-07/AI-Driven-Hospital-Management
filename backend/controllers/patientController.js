const Patient = require("../models/Patient");
const mongoose = require("mongoose");

const generatePatientId = () => `PT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

const getAllPatients = async (req, res) => {
  try {
    const { status, department_id, ward_id, search, limit = 100, offset = 0 } = req.query;
    const filter = { status: { $ne: "deleted" } };
    if (status) filter.admissionStatus = status;
    if (department_id) filter.departmentId = department_id;
    if (ward_id) filter.currentWardId = ward_id;
    if (search) {
      filter.$or = [
        { firstName: new RegExp(search, "i") },
        { lastName: new RegExp(search, "i") },
        { patientId: new RegExp(search, "i") },
        { phone: new RegExp(search, "i") }
      ];
    }
    const rows = await Patient.find(filter)
      .populate("departmentId", "name")
      .populate("currentWardId", "name")
      .populate("currentBedId", "bedNumber")
      .populate("assignedDoctorId", "name")
      .sort({ createdAt: -1 })
      .skip(parseInt(offset))
      .limit(parseInt(limit))
      .lean();

    const mapped = rows.map(p => ({
      ...p,
      id: p._id,
      department_name: p.departmentId?.name || null,
      ward_name: p.currentWardId?.name || null,
      bed_number: p.currentBedId?.bedNumber || null,
      doctor_name: p.assignedDoctorId?.name || null,
      first_name: p.firstName,
      last_name: p.lastName,
      patient_id: p.patientId,
      blood_group: p.bloodGroup,
      date_of_birth: p.dateOfBirth,
      admission_status: p.admissionStatus,
      condition_status: p.conditionStatus
    }));

    res.json({ success: true, message: "Patients retrieved.", data: mapped, count: mapped.length });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve patients.", error: error.message });
  }
};

const getPatientStats = async (req, res) => {
  try {
    const stats = await Patient.aggregate([
      { $match: { status: { $ne: "deleted" } } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          admitted: { $sum: { $cond: [{ $eq: ["$admissionStatus", "admitted"] }, 1, 0] } },
          critical: { $sum: { $cond: [{ $eq: ["$conditionStatus", "critical"] }, 1, 0] } },
          emergency: { $sum: { $cond: [{ $eq: ["$priority", "emergency"] }, 1, 0] } },
          outpatient: { $sum: { $cond: [{ $eq: ["$admissionStatus", "outpatient"] }, 1, 0] } }
        }
      }
    ]);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const todayReg = await Patient.countDocuments({ status: { $ne: "deleted" }, createdAt: { $gte: today } });
    const s = stats[0] || {};
    res.json({ success: true, message: "Patient stats retrieved.", data: { total: s.total || 0, admitted: s.admitted || 0, critical: s.critical || 0, emergency: s.emergency || 0, outpatient: s.outpatient || 0, todayRegistrations: todayReg } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to get patient stats.", error: error.message });
  }
};

const getPatientById = async (req, res) => {
  try {
    const p = await Patient.findOne({ _id: req.params.id, status: { $ne: "deleted" } })
      .populate("departmentId", "name").populate("currentWardId", "name")
      .populate("currentBedId", "bedNumber").populate("assignedDoctorId", "name").lean();
    if (!p) return res.status(404).json({ success: false, message: "Patient not found." });
    res.json({ success: true, message: "Patient retrieved.", data: { ...p, id: p._id, department_name: p.departmentId?.name, ward_name: p.currentWardId?.name, bed_number: p.currentBedId?.bedNumber, doctor_name: p.assignedDoctorId?.name } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve patient.", error: error.message });
  }
};

const createPatient = async (req, res) => {
  try {
    const { first_name, last_name, date_of_birth, gender, phone, email, address, blood_group, emergency_contact_name, emergency_contact_phone, allergies, medical_history, department_id, assigned_doctor_id, condition_status, priority } = req.body;
    if (!first_name || !last_name || !gender || !phone) {
      return res.status(400).json({ success: false, message: "First name, last name, gender and phone are required." });
    }
    if (!["male", "female", "other"].includes(gender.toLowerCase())) {
      return res.status(400).json({ success: false, message: "Gender must be male, female, or other." });
    }
    const patient = await Patient.create({
      patientId: generatePatientId(), firstName: first_name.trim(), lastName: last_name.trim(),
      dateOfBirth: date_of_birth || null, gender: gender.toLowerCase(), phone: phone.trim(),
      email: email || null, address: address || null, bloodGroup: blood_group || null,
      emergencyContactName: emergency_contact_name || null, emergencyContactPhone: emergency_contact_phone || null,
      allergies: allergies || null, medicalHistory: medical_history || null,
      departmentId: department_id || null, assignedDoctorId: assigned_doctor_id || null,
      conditionStatus: condition_status || "stable", priority: priority || "medium",
      admissionStatus: "outpatient", status: "active"
    });
    res.status(201).json({ success: true, message: "Patient registered successfully.", data: patient });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create patient.", error: error.message });
  }
};

const updatePatient = async (req, res) => {
  try {
    const { first_name, last_name, date_of_birth, gender, phone, email, address, blood_group, emergency_contact_name, emergency_contact_phone, allergies, medical_history, department_id, assigned_doctor_id, condition_status, priority, admission_status } = req.body;
    const updates = {};
    if (first_name) updates.firstName = first_name;
    if (last_name) updates.lastName = last_name;
    if (date_of_birth) updates.dateOfBirth = date_of_birth;
    if (gender) updates.gender = gender;
    if (phone) updates.phone = phone;
    if (email !== undefined) updates.email = email;
    if (address !== undefined) updates.address = address;
    if (blood_group !== undefined) updates.bloodGroup = blood_group;
    if (emergency_contact_name !== undefined) updates.emergencyContactName = emergency_contact_name;
    if (emergency_contact_phone !== undefined) updates.emergencyContactPhone = emergency_contact_phone;
    if (allergies !== undefined) updates.allergies = allergies;
    if (medical_history !== undefined) updates.medicalHistory = medical_history;
    if (department_id !== undefined) updates.departmentId = department_id;
    if (assigned_doctor_id !== undefined) updates.assignedDoctorId = assigned_doctor_id;
    if (condition_status) updates.conditionStatus = condition_status;
    if (priority) updates.priority = priority;
    if (admission_status) updates.admissionStatus = admission_status;

    const updated = await Patient.findOneAndUpdate(
      { _id: req.params.id, status: { $ne: "deleted" } },
      updates, { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: "Patient not found." });
    res.json({ success: true, message: "Patient updated successfully.", data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update patient.", error: error.message });
  }
};

const deletePatient = async (req, res) => {
  try {
    const p = await Patient.findOneAndUpdate(
      { _id: req.params.id, status: { $ne: "deleted" } },
      { status: "deleted" }, { new: true }
    );
    if (!p) return res.status(404).json({ success: false, message: "Patient not found." });
    res.json({ success: true, message: "Patient record deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete patient.", error: error.message });
  }
};

module.exports = { getAllPatients, getPatientById, createPatient, updatePatient, deletePatient, getPatientStats };
