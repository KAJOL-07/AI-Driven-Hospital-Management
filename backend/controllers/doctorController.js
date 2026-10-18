const Doctor = require("../models/Doctor");

const generateDoctorId = () => `DR-${Math.floor(1000 + Math.random() * 9000)}`;

const getAllDoctors = async (req, res) => {
  try {
    const { status, department_id, availability_status, search } = req.query;
    const filter = { status: { $ne: "deleted" } };
    if (department_id) filter.departmentId = department_id;
    if (availability_status) filter.availabilityStatus = availability_status;
    if (search) filter.$or = [{ name: new RegExp(search, "i") }, { specialization: new RegExp(search, "i") }, { doctorId: new RegExp(search, "i") }];
    const rows = await Doctor.find(filter).populate("departmentId", "name").populate("assignedWardId", "name").sort({ createdAt: -1 }).lean();
    const mapped = rows.map(d => ({ ...d, id: d._id, doctor_id: d.doctorId, department_name: d.departmentId?.name, ward_name: d.assignedWardId?.name }));
    res.json({ success: true, message: "Doctors retrieved.", data: mapped, count: mapped.length });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve doctors.", error: error.message });
  }
};

const getDoctorById = async (req, res) => {
  try {
    const d = await Doctor.findOne({ _id: req.params.id, status: { $ne: "deleted" } }).populate("departmentId", "name").populate("assignedWardId", "name").lean();
    if (!d) return res.status(404).json({ success: false, message: "Doctor not found." });
    res.json({ success: true, message: "Doctor retrieved.", data: { ...d, id: d._id, department_name: d.departmentId?.name } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve doctor.", error: error.message });
  }
};

const getDoctorStats = async (req, res) => {
  try {
    const stats = await Doctor.aggregate([
      { $match: { status: { $ne: "deleted" } } },
      { $group: { _id: null, total: { $sum: 1 }, present: { $sum: { $cond: [{ $eq: ["$availabilityStatus", "present"] }, 1, 0] } }, absent: { $sum: { $cond: [{ $eq: ["$availabilityStatus", "absent"] }, 1, 0] } }, on_leave: { $sum: { $cond: [{ $eq: ["$availabilityStatus", "on_leave"] }, 1, 0] } }, available: { $sum: { $cond: [{ $eq: ["$availabilityStatus", "available"] }, 1, 0] } } } }
    ]);
    res.json({ success: true, message: "Doctor stats retrieved.", data: stats[0] || {} });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to get doctor stats.", error: error.message });
  }
};

const createDoctor = async (req, res) => {
  try {
    const { name, email, phone, gender, age, specialization, qualification, department_id, experience_years, shift, assigned_ward_id, joining_date } = req.body;
    if (!name || !email || !specialization || !qualification) {
      return res.status(400).json({ success: false, message: "Name, email, specialization, and qualification are required." });
    }
    const doctor = await Doctor.create({
      doctorId: generateDoctorId(), name: name.trim(), email: email.toLowerCase().trim(),
      phone: phone || null, gender: gender || null, age: age || null,
      specialization: specialization.trim(), qualification: qualification.trim(),
      departmentId: department_id || null, experienceYears: experience_years || 0,
      shift: shift || "morning", assignedWardId: assigned_ward_id || null,
      joiningDate: joining_date || new Date(), status: "active"
    });
    res.status(201).json({ success: true, message: "Doctor added successfully.", data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create doctor.", error: error.message });
  }
};

const updateDoctor = async (req, res) => {
  try {
    const { name, email, phone, gender, age, specialization, qualification, department_id, experience_years, shift, assigned_ward_id, joining_date, availability_status } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email.toLowerCase();
    if (phone !== undefined) updates.phone = phone;
    if (gender) updates.gender = gender;
    if (age !== undefined) updates.age = age;
    if (specialization) updates.specialization = specialization;
    if (qualification) updates.qualification = qualification;
    if (department_id !== undefined) updates.departmentId = department_id;
    if (experience_years !== undefined) updates.experienceYears = experience_years;
    if (shift) updates.shift = shift;
    if (assigned_ward_id !== undefined) updates.assignedWardId = assigned_ward_id;
    if (joining_date) updates.joiningDate = joining_date;
    if (availability_status) updates.availabilityStatus = availability_status;

    const updated = await Doctor.findOneAndUpdate({ _id: req.params.id, status: { $ne: "deleted" } }, updates, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Doctor not found." });
    res.json({ success: true, message: "Doctor updated.", data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update doctor.", error: error.message });
  }
};

const deleteDoctor = async (req, res) => {
  try {
    const d = await Doctor.findOneAndUpdate({ _id: req.params.id, status: { $ne: "deleted" } }, { status: "deleted" }, { new: true });
    if (!d) return res.status(404).json({ success: false, message: "Doctor not found." });
    res.json({ success: true, message: "Doctor removed." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete doctor.", error: error.message });
  }
};

const getDoctorPatients = async (req, res) => {
  try {
    const Patient = require("../models/Patient");
    const patients = await Patient.find({ assignedDoctorId: req.params.id, status: { $ne: "deleted" } }).lean();
    res.json({ success: true, message: "Doctor patients retrieved.", data: patients, count: patients.length });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to get doctor patients.", error: error.message });
  }
};

module.exports = { getAllDoctors, getDoctorById, getDoctorStats, getDoctorPatients, createDoctor, updateDoctor, deleteDoctor };
