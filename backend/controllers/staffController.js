const Staff = require("../models/Staff");

const generateStaffId = () => `ST-${Math.floor(1000 + Math.random() * 9000)}`;

const getAllStaff = async (req, res) => {
  try {
    const { category, department_id, availability_status, search } = req.query;
    const filter = { status: { $ne: "deleted" } };
    if (category) filter.category = category;
    if (department_id) filter.departmentId = department_id;
    if (availability_status) filter.availabilityStatus = availability_status;
    if (search) filter.$or = [{ name: new RegExp(search, "i") }, { staffId: new RegExp(search, "i") }];
    const rows = await Staff.find(filter).populate("departmentId", "name").sort({ createdAt: -1 }).lean();
    const mapped = rows.map(s => ({ ...s, id: s._id, staff_id: s.staffId, department_name: s.departmentId?.name }));
    res.json({ success: true, message: "Staff retrieved.", data: mapped, count: mapped.length });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve staff.", error: error.message });
  }
};

const getStaffById = async (req, res) => {
  try {
    const s = await Staff.findOne({ _id: req.params.id, status: { $ne: "deleted" } }).populate("departmentId", "name").lean();
    if (!s) return res.status(404).json({ success: false, message: "Staff member not found." });
    res.json({ success: true, message: "Staff member retrieved.", data: { ...s, id: s._id, department_name: s.departmentId?.name } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve staff member.", error: error.message });
  }
};

const getStaffStats = async (req, res) => {
  try {
    const stats = await Staff.aggregate([
      { $match: { status: { $ne: "deleted" } } },
      { $group: { _id: null, total: { $sum: 1 }, total_receptionists: { $sum: { $cond: [{ $eq: ["$category", "receptionist"] }, 1, 0] } }, total_pharmacists: { $sum: { $cond: [{ $eq: ["$category", "pharmacist"] }, 1, 0] } }, total_lab_technicians: { $sum: { $cond: [{ $eq: ["$category", "lab_technician"] }, 1, 0] } }, total_billing_staff: { $sum: { $cond: [{ $eq: ["$category", "billing"] }, 1, 0] } } } }
    ]);
    res.json({ success: true, message: "Staff stats retrieved.", data: stats[0] || {} });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to get staff stats.", error: error.message });
  }
};

const createStaff = async (req, res) => {
  try {
    const { name, email, phone, gender, age, category, department_id, shift, qualification, joining_date } = req.body;
    if (!name || !email || !category) return res.status(400).json({ success: false, message: "Name, email, and category are required." });
    const member = await Staff.create({
      staffId: generateStaffId(), name: name.trim(), email: email.toLowerCase().trim(),
      phone: phone || null, gender: gender || null, age: age || null, category,
      departmentId: department_id || null, shift: shift || "morning",
      qualification: qualification || null, joiningDate: joining_date || new Date(), status: "active"
    });
    res.status(201).json({ success: true, message: "Staff member added.", data: member });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create staff member.", error: error.message });
  }
};

const updateStaff = async (req, res) => {
  try {
    const { name, email, phone, gender, age, category, department_id, shift, qualification, joining_date, availability_status } = req.body;
    const updates = {};
    if (name) updates.name = name; if (email) updates.email = email.toLowerCase();
    if (phone !== undefined) updates.phone = phone; if (gender) updates.gender = gender;
    if (age !== undefined) updates.age = age; if (category) updates.category = category;
    if (department_id !== undefined) updates.departmentId = department_id;
    if (shift) updates.shift = shift; if (qualification !== undefined) updates.qualification = qualification;
    if (joining_date) updates.joiningDate = joining_date;
    if (availability_status) updates.availabilityStatus = availability_status;
    const updated = await Staff.findOneAndUpdate({ _id: req.params.id, status: { $ne: "deleted" } }, updates, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Staff member not found." });
    res.json({ success: true, message: "Staff member updated.", data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update staff member.", error: error.message });
  }
};

const deleteStaff = async (req, res) => {
  try {
    const s = await Staff.findOneAndUpdate({ _id: req.params.id, status: { $ne: "deleted" } }, { status: "deleted" }, { new: true });
    if (!s) return res.status(404).json({ success: false, message: "Staff member not found." });
    res.json({ success: true, message: "Staff member removed." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete staff member.", error: error.message });
  }
};

module.exports = { getAllStaff, getStaffById, getStaffStats, createStaff, updateStaff, deleteStaff };
