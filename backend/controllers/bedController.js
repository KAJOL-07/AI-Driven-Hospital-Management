const Bed = require("../models/Bed");
const Ward = require("../models/Ward");
const Room = require("../models/Room");
const Department = require("../models/Department");
const Patient = require("../models/Patient");
const Admission = require("../models/Admission");
const Doctor = require("../models/Doctor");

// Normalizes floor param if numeric or string
const normalizeFloor = (fl) => {
  if (!fl) return null;
  const str = fl.toString().toLowerCase().trim();
  if (str === "0" || str.includes("ground")) return "Ground Floor";
  if (str === "1" || str.includes("first")) return "First Floor";
  if (str === "2" || str.includes("second")) return "Second Floor";
  return fl;
};

// GET /api/beds
const getAllBeds = async (req, res) => {
  try {
    const { ward_id, department_id, floor, specialty, room_number, status, bed_type, search } = req.query;
    const filter = { isDeleted: false };
    if (ward_id) filter.wardId = ward_id;
    if (floor) {
      const normFloor = normalizeFloor(floor);
      filter.floor = normFloor;
    }
    if (specialty) filter.specialty = new RegExp(`^${specialty.trim()}$`, "i");
    if (room_number) filter.roomNumber = room_number;
    if (status && status !== "ALL") {
      if (status === "cleaning") {
        filter.status = { $in: ["cleaning", "cleaning_required", "cleaning_in_progress"] };
      } else {
        filter.status = status;
      }
    }
    if (bed_type) filter.bedType = bed_type;
    if (search) {
      filter.$or = [
        { bedNumber: new RegExp(search, "i") },
        { roomNumber: new RegExp(search, "i") },
        { specialty: new RegExp(search, "i") }
      ];
    }

    let beds = await Bed.find(filter)
      .populate({ path: "wardId", select: "name wardType floor departmentId", populate: { path: "departmentId", select: "name code floor" } })
      .populate("patientId", "firstName lastName patientId gender age phone conditionStatus bloodGroup")
      .sort({ floor: 1, roomNumber: 1, bedNumber: 1 })
      .lean();

    if (department_id) {
      beds = beds.filter(b => b.wardId?.departmentId?._id?.toString() === department_id || b.wardId?.departmentId === department_id);
    }

    // Retrieve active admissions for occupied beds to attach doctor, admission date & reason
    const occupiedBedIds = beds.filter(b => b.status === "occupied" || b.patientId).map(b => b._id);
    let activeAdmissionsMap = {};
    if (occupiedBedIds.length > 0) {
      const activeAdmissions = await Admission.find({
        bedId: { $in: occupiedBedIds },
        status: "active"
      })
        .populate("doctorId", "name specialization")
        .lean();

      activeAdmissions.forEach(adm => {
        if (adm.bedId) {
          activeAdmissionsMap[adm.bedId.toString()] = adm;
        }
      });
    }

    const mapped = beds.map(b => {
      const activeAdm = activeAdmissionsMap[b._id.toString()];
      return {
        ...b,
        id: b._id,
        bed_number: b.bedNumber,
        bedNumber: b.bedNumber,
        room_number: b.roomNumber,
        roomNumber: b.roomNumber,
        floor: b.floor || "Ground Floor",
        specialty: b.specialty || "General Medicine",
        bed_type: b.bedType,
        bedType: b.bedType,
        status: b.status,
        ward_id: b.wardId?._id,
        ward_name: b.wardId?.name,
        ward_type: b.wardId?.wardType,
        department_name: b.wardId?.departmentId?.name || null,
        patient_id: b.patientId?._id || null,
        patient_name: b.patientId ? `${b.patientId.firstName} ${b.patientId.lastName}` : (activeAdm?.patientId?.firstName ? `${activeAdm.patientId.firstName} ${activeAdm.patientId.lastName}` : null),
        patient_code: b.patientId?.patientId || null,
        doctor_id: activeAdm?.doctorId?._id || null,
        doctor_name: activeAdm?.doctorId?.name || null,
        doctor_specialization: activeAdm?.doctorId?.specialization || null,
        admission_date: activeAdm?.admissionDate || null,
        admission_reason: activeAdm?.admissionReason || null,
        admission_id: activeAdm?.admissionId || null,
        priority: activeAdm?.priority || null,
        last_cleaned: b.lastCleaned || "Recently Sterilized"
      };
    });

    res.json({ success: true, message: "Beds retrieved.", data: mapped, count: mapped.length });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve beds.", error: error.message });
  }
};

// GET /api/beds/floor-stats (Calculates real live metrics across all 3 floors)
const getFloorStats = async (req, res) => {
  try {
    const beds = await Bed.find({ isDeleted: false }).lean();

    const computeMetrics = (bedArray) => {
      const occupied = bedArray.filter(b => b.status === "occupied").length;
      const available = bedArray.filter(b => b.status === "available").length;
      const cleaning_required = bedArray.filter(b => b.status === "cleaning_required" || b.status === "cleaning").length;
      const cleaning_in_progress = bedArray.filter(b => b.status === "cleaning_in_progress").length;
      const reserved = bedArray.filter(b => b.status === "reserved").length;
      const maintenance = bedArray.filter(b => b.status === "maintenance").length;
      const admitted_patients = bedArray.filter(b => b.status === "occupied" && b.patientId).length;
      return {
        total_beds: bedArray.length,
        occupied,
        available,
        cleaning_required,
        cleaning_in_progress,
        reserved,
        maintenance,
        admitted_patients
      };
    };

    // 1. Ground Floor Calculations
    const groundBeds = beds.filter(b => b.floor === "Ground Floor" || (!b.floor && !b.roomNumber));
    const gfStats = {
      ...computeMetrics(groundBeds),
      sections: {
        general_ward: computeMetrics(groundBeds.filter(b => !b.bedNumber.startsWith("EMG") && !b.bedNumber.startsWith("GSW"))),
        emergency: computeMetrics(groundBeds.filter(b => b.bedNumber.startsWith("EMG") || b.specialty === "Emergency Medicine")),
        general_surgery: computeMetrics(groundBeds.filter(b => b.bedNumber.startsWith("GSW") || b.specialty === "General Surgery"))
      }
    };

    // 2. First Floor Calculations (Cardiology, Neurology, Orthopedics, Gynecology, Pulmonology)
    const firstBeds = beds.filter(b => b.floor === "First Floor");
    const ffSpecialtyList = ["Cardiology", "Neurology", "Orthopedics", "Gynecology", "Pulmonology"];
    const ffSpecialties = {};

    ffSpecialtyList.forEach(spec => {
      const sBeds = firstBeds.filter(b => b.specialty?.toLowerCase() === spec.toLowerCase());
      ffSpecialties[spec] = {
        total_rooms: sBeds.length,
        ...computeMetrics(sBeds)
      };
    });

    const ffStats = {
      total_rooms: firstBeds.length,
      ...computeMetrics(firstBeds),
      specialties: ffSpecialties
    };

    // 3. Second Floor Calculations (Pediatrics, Oncology, Nephrology, Urology, ENT, Ophthalmology, Dermatology)
    const secondBeds = beds.filter(b => b.floor === "Second Floor");
    const sfSpecialtyList = ["Pediatrics", "Oncology", "Nephrology", "Urology", "ENT", "Ophthalmology", "Dermatology"];
    const sfSpecialties = {};

    sfSpecialtyList.forEach(spec => {
      const sBeds = secondBeds.filter(b => b.specialty?.toLowerCase() === spec.toLowerCase());
      sfSpecialties[spec] = {
        total_rooms: sBeds.length,
        ...computeMetrics(sBeds)
      };
    });

    const sfStats = {
      total_rooms: secondBeds.length,
      ...computeMetrics(secondBeds),
      specialties: sfSpecialties
    };

    // 4. Overall Hospital Stats
    const overall = {
      ...computeMetrics(beds),
      total_floors: 3,
      total_departments: 15,
      occupancy_percentage: beds.length > 0 ? Math.round((beds.filter(b => b.status === "occupied").length / beds.length) * 100) : 0
    };

    res.json({
      success: true,
      message: "3-Floor hospital statistics retrieved.",
      data: {
        ground_floor: gfStats,
        first_floor: ffStats,
        second_floor: sfStats,
        overall
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve floor stats.", error: error.message });
  }
};

// GET /api/beds/stats
const getBedStats = async (req, res) => {
  try {
    const beds = await Bed.find({ isDeleted: false }).populate("wardId", "name floor").lean();
    const total = beds.length;
    let occupied = 0, available = 0, reserved = 0, maintenance = 0, cleaning_required = 0, cleaning_in_progress = 0;
    const wardMap = {};

    beds.forEach(b => {
      if (b.status === "occupied") occupied++;
      else if (b.status === "available") available++;
      else if (b.status === "reserved") reserved++;
      else if (b.status === "maintenance") maintenance++;
      else if (b.status === "cleaning_required" || b.status === "cleaning") cleaning_required++;
      else if (b.status === "cleaning_in_progress") cleaning_in_progress++;

      const wId = b.wardId?._id?.toString() || "unknown";
      const wName = b.wardId?.name || "Unknown Ward";
      if (!wardMap[wId]) wardMap[wId] = { ward_id: wId, ward_name: wName, floor: b.floor, total: 0, occupied: 0, available: 0 };
      wardMap[wId].total++;
      if (b.status === "occupied") wardMap[wId].occupied++;
      if (b.status === "available") wardMap[wId].available++;
    });

    res.json({
      success: true,
      message: "Bed stats retrieved.",
      data: {
        total,
        occupied,
        available,
        reserved,
        maintenance,
        cleaning_required,
        cleaning_in_progress,
        cleaning: cleaning_required + cleaning_in_progress,
        occupancy_percentage: total > 0 ? Math.round((occupied / total) * 100) : 0,
        byWard: Object.values(wardMap)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to get bed stats.", error: error.message });
  }
};

// GET /api/beds/available
const getAvailableBeds = async (req, res) => {
  try {
    const { ward_id, bed_type, floor, specialty } = req.query;
    const filter = { status: "available", isDeleted: false };
    if (ward_id) filter.wardId = ward_id;
    if (bed_type) filter.bedType = bed_type;
    if (floor) {
      filter.floor = normalizeFloor(floor);
    }
    if (specialty) filter.specialty = new RegExp(`^${specialty.trim()}$`, "i");

    const beds = await Bed.find(filter)
      .populate({ path: "wardId", select: "name wardType floor departmentId", populate: { path: "departmentId", select: "name code" } })
      .sort({ floor: 1, roomNumber: 1, bedNumber: 1 })
      .lean();

    const mapped = beds.map(b => ({
      ...b,
      id: b._id,
      bed_number: b.bedNumber,
      room_number: b.roomNumber,
      floor: b.floor,
      specialty: b.specialty,
      bed_type: b.bedType,
      ward_name: b.wardId?.name,
      ward_type: b.wardId?.wardType,
      department_name: b.wardId?.departmentId?.name || null
    }));

    res.json({ success: true, message: "Available beds retrieved.", data: mapped, count: mapped.length });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve available beds.", error: error.message });
  }
};

// GET /api/beds/:id
const getBedById = async (req, res) => {
  try {
    const b = await Bed.findOne({ _id: req.params.id, isDeleted: false })
      .populate({ path: "wardId", select: "name floor departmentId", populate: { path: "departmentId", select: "name" } })
      .populate("patientId", "firstName lastName patientId phone bloodGroup conditionStatus")
      .lean();

    if (!b) return res.status(404).json({ success: false, message: "Bed not found." });

    const activeAdm = await Admission.findOne({ bedId: b._id, status: "active" })
      .populate("doctorId", "name specialization")
      .lean();

    res.json({
      success: true,
      message: "Bed retrieved.",
      data: {
        ...b,
        id: b._id,
        bed_number: b.bedNumber,
        room_number: b.roomNumber,
        floor: b.floor,
        specialty: b.specialty,
        bed_type: b.bedType,
        ward_name: b.wardId?.name,
        department_name: b.wardId?.departmentId?.name || null,
        patient_name: b.patientId ? `${b.patientId.firstName} ${b.patientId.lastName}` : null,
        patient_code: b.patientId?.patientId || null,
        doctor_name: activeAdm?.doctorId?.name || null,
        doctor_specialization: activeAdm?.doctorId?.specialization || null,
        admission_date: activeAdm?.admissionDate || null,
        admission_reason: activeAdm?.admissionReason || null,
        last_cleaned: b.lastCleaned || "Recently Sterilized"
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve bed.", error: error.message });
  }
};

// POST /api/beds/ground-floor/configure (Admin can configure total beds in General Ward)
const configureGroundFloorBeds = async (req, res) => {
  try {
    const { total_beds } = req.body;
    const targetCount = parseInt(total_beds, 10);
    if (!targetCount || targetCount < 1 || targetCount > 150) {
      return res.status(400).json({ success: false, message: "Please specify a valid total bed count between 1 and 150." });
    }

    let genWard = await Ward.findOne({ name: /General Ward Hall/i, isDeleted: false });
    if (!genWard) {
      let dept = await Department.findOne({ name: /General Medicine/i });
      if (!dept) dept = await Department.create({ name: "General Medicine", location: "Ground Floor" });
      genWard = await Ward.create({
        name: "General Ward Hall",
        wardType: "general",
        departmentId: dept._id,
        capacity: targetCount
      });
    }

    const currentBeds = await Bed.find({
      floor: "Ground Floor",
      bedNumber: { $regex: /^GW-/i },
      isDeleted: false
    }).sort({ bedNumber: 1 });

    const currentCount = currentBeds.length;

    if (targetCount > currentCount) {
      const newBedsToCreate = [];
      for (let i = currentCount + 1; i <= targetCount; i++) {
        const bedNumFormatted = `GW-B${i.toString().padStart(3, "0")}`;
        newBedsToCreate.push({
          bedNumber: bedNumFormatted,
          roomNumber: null,
          floor: "Ground Floor",
          specialty: "General Medicine",
          wardId: genWard._id,
          bedType: "standard",
          status: "available",
          lastCleaned: "Standard Preparation",
          isDeleted: false
        });
      }
      await Bed.insertMany(newBedsToCreate);
    } else if (targetCount < currentCount) {
      const excess = currentCount - targetCount;
      const removableBeds = currentBeds
        .filter(b => b.status === "available" && !b.patientId)
        .reverse()
        .slice(0, excess);

      if (removableBeds.length > 0) {
        const idsToRemove = removableBeds.map(b => b._id);
        await Bed.deleteMany({ _id: { $in: idsToRemove } });
      }
    }

    await Ward.findByIdAndUpdate(genWard._id, { capacity: targetCount });

    res.json({
      success: true,
      message: `Ground Floor General Ward successfully configured to ${targetCount} beds.`,
      targetCount
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to configure Ground Floor beds.", error: error.message });
  }
};

// POST /api/beds
const createBed = async (req, res) => {
  try {
    const { bed_number, room_number, ward_id, bed_type, features, floor, specialty } = req.body;
    if (!bed_number || !ward_id) {
      return res.status(400).json({ success: false, message: "bed_number and ward_id are required." });
    }
    const existing = await Bed.findOne({ bedNumber: bed_number.trim(), isDeleted: false });
    if (existing) return res.status(409).json({ success: false, message: "Bed identifier already exists." });

    const newBed = await Bed.create({
      bedNumber: bed_number.trim(),
      roomNumber: room_number || null,
      floor: normalizeFloor(floor) || (room_number ? "First Floor" : "Ground Floor"),
      specialty: specialty || "General Medicine",
      wardId: ward_id,
      bedType: bed_type || "standard",
      features: features || null,
      status: "available",
      isDeleted: false
    });
    res.status(201).json({ success: true, message: "Bed created.", data: newBed });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create bed.", error: error.message });
  }
};

// PUT /api/beds/:id
const updateBed = async (req, res) => {
  try {
    const { bed_number, ward_id, bed_type, features, floor, specialty, room_number } = req.body;
    const updates = {};
    if (bed_number) updates.bedNumber = bed_number.trim();
    if (ward_id) updates.wardId = ward_id;
    if (bed_type) updates.bedType = bed_type;
    if (features !== undefined) updates.features = features;
    if (floor) updates.floor = normalizeFloor(floor);
    if (specialty) updates.specialty = specialty;
    if (room_number !== undefined) updates.roomNumber = room_number;

    const updated = await Bed.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, updates, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Bed not found." });
    res.json({ success: true, message: "Bed updated.", data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update bed.", error: error.message });
  }
};

// PATCH /api/beds/:id/status
const updateBedStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = [
      "available",
      "occupied",
      "cleaning_required",
      "cleaning_in_progress",
      "reserved",
      "maintenance",
      "cleaning"
    ];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${allowedStatuses.join(", ")}`
      });
    }

    const updates = { status };
    if (status === "available") {
      updates.patientId = null;
      updates.lastCleaned = "Just Now (Sterilized)";
    } else if (status === "cleaning_in_progress") {
      updates.lastCleaned = "Cleaning In Progress";
    } else if (status === "cleaning_required" || status === "cleaning") {
      updates.patientId = null;
      updates.lastCleaned = "Turnover Required";
    }

    const updated = await Bed.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, updates, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Bed not found." });
    res.json({ success: true, message: `Bed status updated to '${status}'.`, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update bed status.", error: error.message });
  }
};

// DELETE /api/beds/:id
const deleteBed = async (req, res) => {
  try {
    const bed = await Bed.findById(req.params.id);
    if (!bed) return res.status(404).json({ success: false, message: "Bed not found." });
    if (bed.status === "occupied" && bed.patientId) {
      return res.status(400).json({ success: false, message: "Cannot delete an occupied bed. Discharge or transfer the patient first." });
    }

    const updated = await Bed.findOneAndUpdate(
      { _id: req.params.id },
      { isDeleted: true, status: "maintenance" },
      { new: true }
    );
    res.json({ success: true, message: "Bed removed safely." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete bed.", error: error.message });
  }
};

module.exports = {
  getAllBeds,
  getBedById,
  createBed,
  updateBed,
  updateBedStatus,
  deleteBed,
  getBedStats,
  getAvailableBeds,
  getFloorStats,
  configureGroundFloorBeds
};
