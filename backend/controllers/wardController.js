const Ward = require("../models/Ward");
const Bed = require("../models/Bed");
const Department = require("../models/Department");

// GET /api/wards
const getAllWards = async (req, res) => {
  try {
    const { department_id, floor, status, ward_type, search } = req.query;
    const filter = { status: { $ne: "deleted" } };
    if (department_id) filter.departmentId = department_id;
    if (floor) filter.floor = floor;
    if (status) filter.wardStatus = status;
    if (ward_type) filter.wardType = ward_type;
    if (search) filter.name = new RegExp(search, "i");

    const wards = await Ward.find(filter).populate("departmentId", "name code floor").sort({ floor: 1, name: 1 }).lean();

    const enriched = await Promise.all(
      wards.map(async (w) => {
        const beds = await Bed.find({ wardId: w._id, isDeleted: false }).lean();
        const totalBeds = beds.length;
        const occupiedBeds = beds.filter(b => b.status === "occupied").length;
        const availableBeds = beds.filter(b => b.status === "available").length;
        const reservedBeds = beds.filter(b => b.status === "reserved").length;
        const cleaningRequiredBeds = beds.filter(b => b.status === "cleaning_required" || b.status === "cleaning").length;
        const cleaningInProgressBeds = beds.filter(b => b.status === "cleaning_in_progress").length;
        const maintenanceBeds = beds.filter(b => b.status === "maintenance").length;

        return {
          ...w,
          id: w._id,
          name: w.name,
          ward_type: w.wardType,
          floor: w.floor || "Ground Floor",
          department_id: w.departmentId?._id || w.departmentId,
          department_name: w.departmentId?.name || null,
          ward_status: w.wardStatus,
          capacity: w.capacity,
          location: w.location,
          description: w.description,
          total_beds: totalBeds,
          occupied_beds: occupiedBeds,
          available_beds: availableBeds,
          reserved_beds: reservedBeds,
          cleaning_required_beds: cleaningRequiredBeds,
          cleaning_in_progress_beds: cleaningInProgressBeds,
          cleaning_beds: cleaningRequiredBeds + cleaningInProgressBeds,
          maintenance_beds: maintenanceBeds,
          occupancy_percentage: totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0
        };
      })
    );

    res.json({ success: true, message: "Wards retrieved.", data: enriched, count: enriched.length });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve wards.", error: error.message });
  }
};

// GET /api/wards/:id
const getWardById = async (req, res) => {
  try {
    const w = await Ward.findOne({ _id: req.params.id, status: { $ne: "deleted" } }).populate("departmentId", "name").lean();
    if (!w) return res.status(404).json({ success: false, message: "Ward not found." });

    const beds = await Bed.find({ wardId: w._id, isDeleted: false }).lean();
    const totalBeds = beds.length;
    const occupiedBeds = beds.filter(b => b.status === "occupied").length;
    const availableBeds = beds.filter(b => b.status === "available").length;

    res.json({
      success: true,
      message: "Ward retrieved.",
      data: {
        ...w,
        id: w._id,
        name: w.name,
        ward_type: w.wardType,
        department_name: w.departmentId?.name || null,
        total_beds: totalBeds,
        occupied_beds: occupiedBeds,
        available_beds: availableBeds,
        occupancy_percentage: totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve ward.", error: error.message });
  }
};

// GET /api/wards/:id/beds
const getWardBeds = async (req, res) => {
  try {
    const beds = await Bed.find({ wardId: req.params.id, isDeleted: false }).populate("patientId", "firstName lastName patientId").sort({ bedNumber: 1 }).lean();
    const mapped = beds.map(b => ({
      ...b,
      id: b._id,
      bed_number: b.bedNumber,
      bed_type: b.bedType,
      patient_id: b.patientId?._id || null,
      patient_name: b.patientId ? `${b.patientId.firstName} ${b.patientId.lastName}` : null
    }));
    res.json({ success: true, message: "Ward beds retrieved.", data: mapped, count: mapped.length });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve ward beds.", error: error.message });
  }
};

// POST /api/wards
const createWard = async (req, res) => {
  try {
    const { name, ward_type, department_id, capacity, location, description } = req.body;
    if (!name || !ward_type || !department_id) {
      return res.status(400).json({ success: false, message: "Name, ward_type, and department_id are required." });
    }
    const newWard = await Ward.create({
      name: name.trim(),
      wardType: ward_type,
      departmentId: department_id,
      capacity: capacity || 20,
      location: location || null,
      description: description || null,
      wardStatus: "normal",
      status: "active"
    });
    res.status(201).json({ success: true, message: "Ward created.", data: newWard });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create ward.", error: error.message });
  }
};

// PUT /api/wards/:id
const updateWard = async (req, res) => {
  try {
    const { name, ward_type, department_id, capacity, location, description, ward_status } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (ward_type) updates.wardType = ward_type;
    if (department_id) updates.departmentId = department_id;
    if (capacity !== undefined) updates.capacity = capacity;
    if (location !== undefined) updates.location = location;
    if (description !== undefined) updates.description = description;
    if (ward_status) updates.wardStatus = ward_status;

    const updated = await Ward.findOneAndUpdate({ _id: req.params.id, status: { $ne: "deleted" } }, updates, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Ward not found." });
    res.json({ success: true, message: "Ward updated.", data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update ward.", error: error.message });
  }
};

// DELETE /api/wards/:id
const deleteWard = async (req, res) => {
  try {
    const w = await Ward.findOneAndUpdate({ _id: req.params.id, status: { $ne: "deleted" } }, { status: "deleted" }, { new: true });
    if (!w) return res.status(404).json({ success: false, message: "Ward not found." });
    res.json({ success: true, message: "Ward deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete ward.", error: error.message });
  }
};

module.exports = { getAllWards, getWardById, createWard, updateWard, deleteWard, getWardBeds };
