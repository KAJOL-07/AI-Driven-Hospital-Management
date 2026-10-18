const Nurse = require("../models/Nurse");

const generateNurseId = () => `NR-${Math.floor(1000 + Math.random() * 9000)}`;

const getAllNurses = async (req, res) => {
  try {
    const { department_id, availability_status, search } = req.query;
    const filter = { status: { $ne: "deleted" } };
    if (department_id) filter.departmentId = department_id;
    if (availability_status) filter.availabilityStatus = availability_status;
    if (search) filter.$or = [{ name: new RegExp(search, "i") }, { nurseId: new RegExp(search, "i") }];
    const rows = await Nurse.find(filter).populate("departmentId", "name").populate("assignedWardId", "name").sort({ createdAt: -1 }).lean();
    const mapped = rows.map(n => ({ ...n, id: n._id, nurse_id: n.nurseId, department_name: n.departmentId?.name, ward_name: n.assignedWardId?.name }));
    res.json({ success: true, message: "Nurses retrieved.", data: mapped, count: mapped.length });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve nurses.", error: error.message });
  }
};

const getNurseById = async (req, res) => {
  try {
    const n = await Nurse.findOne({ _id: req.params.id, status: { $ne: "deleted" } }).populate("departmentId", "name").populate("assignedWardId", "name").lean();
    if (!n) return res.status(404).json({ success: false, message: "Nurse not found." });
    res.json({ success: true, message: "Nurse retrieved.", data: { ...n, id: n._id, department_name: n.departmentId?.name } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve nurse.", error: error.message });
  }
};

const getNurseStats = async (req, res) => {
  try {
    const stats = await Nurse.aggregate([
      { $match: { status: { $ne: "deleted" } } },
      { $group: { _id: null, total: { $sum: 1 }, present: { $sum: { $cond: [{ $eq: ["$availabilityStatus", "present"] }, 1, 0] } }, absent: { $sum: { $cond: [{ $eq: ["$availabilityStatus", "absent"] }, 1, 0] } }, on_duty: { $sum: { $cond: [{ $eq: ["$availabilityStatus", "on_duty"] }, 1, 0] } } } }
    ]);
    res.json({ success: true, message: "Nurse stats retrieved.", data: stats[0] || {} });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to get nurse stats.", error: error.message });
  }
};

const createNurse = async (req, res) => {
  try {
    const { name, email, phone, gender, age, qualification, department_id, assigned_ward_id, shift, joining_date } = req.body;
    if (!name || !email) return res.status(400).json({ success: false, message: "Name and email are required." });
    const nurse = await Nurse.create({
      nurseId: generateNurseId(), name: name.trim(), email: email.toLowerCase().trim(),
      phone: phone || null, gender: gender || null, age: age || null, qualification: qualification || null,
      departmentId: department_id || null, assignedWardId: assigned_ward_id || null,
      shift: shift || "morning", joiningDate: joining_date || new Date(), status: "active"
    });
    res.status(201).json({ success: true, message: "Nurse added successfully.", data: nurse });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create nurse.", error: error.message });
  }
};

const updateNurse = async (req, res) => {
  try {
    const { name, email, phone, gender, age, qualification, department_id, assigned_ward_id, shift, joining_date, availability_status } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email.toLowerCase();
    if (phone !== undefined) updates.phone = phone;
    if (gender) updates.gender = gender;
    if (age !== undefined) updates.age = age;
    if (qualification !== undefined) updates.qualification = qualification;
    if (department_id !== undefined) updates.departmentId = department_id;
    if (assigned_ward_id !== undefined) updates.assignedWardId = assigned_ward_id;
    if (shift) updates.shift = shift;
    if (joining_date) updates.joiningDate = joining_date;
    if (availability_status) updates.availabilityStatus = availability_status;
    const updated = await Nurse.findOneAndUpdate({ _id: req.params.id, status: { $ne: "deleted" } }, updates, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Nurse not found." });
    res.json({ success: true, message: "Nurse updated.", data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update nurse.", error: error.message });
  }
};

const deleteNurse = async (req, res) => {
  try {
    const n = await Nurse.findOneAndUpdate({ _id: req.params.id, status: { $ne: "deleted" } }, { status: "deleted" }, { new: true });
    if (!n) return res.status(404).json({ success: false, message: "Nurse not found." });
    res.json({ success: true, message: "Nurse removed." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete nurse.", error: error.message });
  }
};

module.exports = { getAllNurses, getNurseById, getNurseStats, createNurse, updateNurse, deleteNurse };
