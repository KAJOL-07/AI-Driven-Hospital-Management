const Department = require("../models/Department");
const Doctor = require("../models/Doctor");
const Nurse = require("../models/Nurse");
const Patient = require("../models/Patient");

const getAllDepartments = async (req, res) => {
  try {
    const depts = await Department.find({ status: { $ne: "deleted" } }).populate("headDoctorId", "name specialization").sort({ name: 1 }).lean();
    const result = await Promise.all(depts.map(async (d) => {
      const [doctorCount, nurseCount, patientCount] = await Promise.all([
        Doctor.countDocuments({ departmentId: d._id, status: { $ne: "deleted" } }),
        Nurse.countDocuments({ departmentId: d._id, status: { $ne: "deleted" } }),
        Patient.countDocuments({ departmentId: d._id, status: { $ne: "deleted" } })
      ]);
      return { ...d, id: d._id, head_doctor_name: d.headDoctorId?.name || null, doctor_count: doctorCount, nurse_count: nurseCount, patient_count: patientCount };
    }));
    res.json({ success: true, message: "Departments retrieved.", data: result, count: result.length });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve departments.", error: error.message });
  }
};

const getDepartmentById = async (req, res) => {
  try {
    const d = await Department.findOne({ _id: req.params.id, status: { $ne: "deleted" } }).populate("headDoctorId", "name specialization").lean();
    if (!d) return res.status(404).json({ success: false, message: "Department not found." });
    res.json({ success: true, message: "Department retrieved.", data: { ...d, id: d._id } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve department.", error: error.message });
  }
};

const createDepartment = async (req, res) => {
  try {
    const { name, description, head_doctor_id, location, phone } = req.body;
    if (!name) return res.status(400).json({ success: false, message: "Department name is required." });
    const dept = await Department.create({ name: name.trim(), description: description || null, headDoctorId: head_doctor_id || null, location: location || null, phone: phone || null });
    res.status(201).json({ success: true, message: "Department created.", data: dept });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ success: false, message: "Department name already exists." });
    res.status(500).json({ success: false, message: "Failed to create department.", error: error.message });
  }
};

const updateDepartment = async (req, res) => {
  try {
    const { name, description, head_doctor_id, location, phone, status } = req.body;
    const updates = {};
    if (name) updates.name = name; if (description !== undefined) updates.description = description;
    if (head_doctor_id !== undefined) updates.headDoctorId = head_doctor_id;
    if (location !== undefined) updates.location = location; if (phone !== undefined) updates.phone = phone;
    if (status) updates.status = status;
    const updated = await Department.findOneAndUpdate({ _id: req.params.id, status: { $ne: "deleted" } }, updates, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Department not found." });
    res.json({ success: true, message: "Department updated.", data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update department.", error: error.message });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const d = await Department.findOneAndUpdate({ _id: req.params.id, status: { $ne: "deleted" } }, { status: "deleted" }, { new: true });
    if (!d) return res.status(404).json({ success: false, message: "Department not found." });
    res.json({ success: true, message: "Department deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete department.", error: error.message });
  }
};

module.exports = { getAllDepartments, getDepartmentById, createDepartment, updateDepartment, deleteDepartment };
