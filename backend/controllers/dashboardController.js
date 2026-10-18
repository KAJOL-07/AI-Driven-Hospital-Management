const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Nurse = require("../models/Nurse");
const Staff = require("../models/Staff");
const Bed = require("../models/Bed");
const Ward = require("../models/Ward");
const EmergencyCase = require("../models/EmergencyCase");
const Admission = require("../models/Admission");
const Discharge = require("../models/Discharge");
const Appointment = require("../models/Appointment");
const Transfer = require("../models/Transfer");
const MedicalRecord = require("../models/MedicalRecord");
const Notification = require("../models/Notification");

// GET /api/dashboard/admin
const getAdminDashboard = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // 1. Patient Stats
    const patients = await Patient.find({ status: { $ne: "deleted" } }).lean();
    let currently_admitted = 0, todays_admissions = 0, emergency_patients = 0, critical_patients = 0, observation_patients = 0, outpatients = 0;

    patients.forEach(p => {
      if (p.admissionStatus === "admitted") {
        currently_admitted++;
        if (p.createdAt >= today && p.createdAt < tomorrow) todays_admissions++;
      } else if (p.admissionStatus === "outpatient") {
        outpatients++;
      }
      if (p.priority === "emergency") emergency_patients++;
      if (p.conditionStatus === "critical") critical_patients++;
      if (p.conditionStatus === "stable") observation_patients++;
    });

    const todays_discharges = await Discharge.countDocuments({ dischargeDate: { $gte: today, $lt: tomorrow } });

    // 2. Doctor Stats
    const doctors = await Doctor.find({ status: { $ne: "deleted" } }).lean();
    const docStats = {
      total_doctors: doctors.length,
      present: 0, absent: 0, on_leave: 0, available: 0, busy: 0, emergency_duty: 0, off_duty: 0
    };
    doctors.forEach(d => {
      if (docStats[d.availabilityStatus] !== undefined) docStats[d.availabilityStatus]++;
    });

    // 3. Nurse Stats
    const nurses = await Nurse.find({ status: { $ne: "deleted" } }).lean();
    const nurseStats = {
      total_nurses: nurses.length,
      present: 0, absent: 0, on_leave: 0, on_duty: 0, available: 0, busy: 0, off_duty: 0
    };
    nurses.forEach(n => {
      if (nurseStats[n.availabilityStatus] !== undefined) nurseStats[n.availabilityStatus]++;
    });

    // 4. Staff Stats by Category
    const staffMembers = await Staff.find({ status: { $ne: "deleted" } }).lean();
    const staffStats = {
      total_staff: staffMembers.length,
      total_receptionists: 0,
      total_pharmacists: 0,
      total_lab_technicians: 0,
      total_radiology_staff: 0,
      total_administrative_staff: 0,
      total_billing_staff: 0,
      total_support_staff: 0
    };
    staffMembers.forEach(s => {
      if (s.category === "receptionist") staffStats.total_receptionists++;
      else if (s.category === "pharmacist") staffStats.total_pharmacists++;
      else if (s.category === "lab_technician") staffStats.total_lab_technicians++;
      else if (s.category === "radiology") staffStats.total_radiology_staff++;
      else if (s.category === "admin") staffStats.total_administrative_staff++;
      else if (s.category === "billing") staffStats.total_billing_staff++;
      else staffStats.total_support_staff++;
    });

    // 5. Bed Stats & 3-Floor Breakdown
    const beds = await Bed.find({ isDeleted: false }).lean();
    const bedStats = {
      total_beds: beds.length,
      occupied: 0,
      available: 0,
      cleaning_required: 0,
      cleaning_in_progress: 0,
      reserved: 0,
      maintenance: 0
    };

    const computeFloorStats = (bedList) => ({
      total_beds: bedList.length,
      occupied: bedList.filter(b => b.status === "occupied").length,
      available: bedList.filter(b => b.status === "available").length,
      cleaning_required: bedList.filter(b => b.status === "cleaning_required" || b.status === "cleaning").length,
      cleaning_in_progress: bedList.filter(b => b.status === "cleaning_in_progress").length,
      reserved: bedList.filter(b => b.status === "reserved").length,
      maintenance: bedList.filter(b => b.status === "maintenance").length,
      admitted_patients: bedList.filter(b => b.status === "occupied" && b.patientId).length
    });

    beds.forEach(b => {
      if (b.status === "occupied") bedStats.occupied++;
      else if (b.status === "available") bedStats.available++;
      else if (b.status === "cleaning_required" || b.status === "cleaning") bedStats.cleaning_required++;
      else if (b.status === "cleaning_in_progress") bedStats.cleaning_in_progress++;
      else if (b.status === "reserved") bedStats.reserved++;
      else if (b.status === "maintenance") bedStats.maintenance++;
    });
    bedStats.cleaning = bedStats.cleaning_required + bedStats.cleaning_in_progress;
    const occupancyPercentage = bedStats.total_beds > 0 ? Math.round((bedStats.occupied / bedStats.total_beds) * 100) : 0;

    const floorMetrics = {
      ground_floor: computeFloorStats(beds.filter(b => b.floor === "Ground Floor")),
      first_floor: computeFloorStats(beds.filter(b => b.floor === "First Floor")),
      second_floor: computeFloorStats(beds.filter(b => b.floor === "Second Floor"))
    };

    // 6. Emergency Stats
    const activeEmergencies = await EmergencyCase.find({ status: "active", isDeleted: false }).lean();
    const emergencyWards = await Ward.find({ wardType: "emergency", status: { $ne: "deleted" } }).lean();
    const emergencyWardIds = emergencyWards.map(w => w._id);
    const emergencyBeds = await Bed.find({ wardId: { $in: emergencyWardIds }, isDeleted: false }).lean();

    const emergencyStats = {
      emergency_patients: activeEmergencies.length,
      critical_patients: activeEmergencies.filter(e => e.priority === "critical").length,
      available_emergency_beds: emergencyBeds.filter(b => b.status === "available").length,
      occupied_emergency_beds: emergencyBeds.filter(b => b.status === "occupied").length
    };

    // Recent activity
    const recentActivities = await Notification.find().sort({ createdAt: -1 }).limit(10).lean();

    res.json({
      success: true,
      message: "Admin dashboard metrics retrieved.",
      data: {
        patients: {
          total_patients: patients.length,
          currently_admitted,
          todays_admissions,
          emergency_patients,
          critical_patients,
          observation_patients,
          outpatients,
          todays_discharges,
          awaiting_admission: 0,
          awaiting_discharge: 0
        },
        doctors: docStats,
        nurses: nurseStats,
        staff: staffStats,
        workforce_summary: {
          total_hospital_staff: docStats.total_doctors + nurseStats.total_nurses + staffStats.total_staff,
          total_present: docStats.present + nurseStats.present,
          total_absent: docStats.absent + nurseStats.absent,
          total_on_leave: docStats.on_leave + nurseStats.on_leave,
          total_on_duty: nurseStats.on_duty,
          total_available: docStats.available + nurseStats.available,
          total_busy: docStats.busy + nurseStats.busy
        },
        beds: {
          ...bedStats,
          occupancy_percentage: occupancyPercentage
        },
        floors: floorMetrics,
        emergency: emergencyStats,
        recent_activities: recentActivities
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to load admin dashboard.", error: error.message });
  }
};

// GET /api/dashboard/doctor
const getDoctorDashboard = async (req, res) => {
  try {
    const doctorId = req.user ? (req.user._id || req.user.id) : null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [assignedPatients, todaysAppointments, criticalPatients, availableBeds, transferRequests, recentActivity] = await Promise.all([
      Patient.countDocuments({ assignedDoctorId: doctorId, admissionStatus: "admitted", status: { $ne: "deleted" } }),
      Appointment.countDocuments({ doctorId, appointmentDate: { $gte: today, $lt: tomorrow }, isDeleted: false }),
      Patient.countDocuments({ assignedDoctorId: doctorId, conditionStatus: "critical", status: { $ne: "deleted" } }),
      Bed.countDocuments({ status: "available", isDeleted: false }),
      Transfer.countDocuments({ status: { $in: ["requested", "pending_approval"] }, isDeleted: false }),
      MedicalRecord.find({ doctorId, isDeleted: false }).populate("patientId", "firstName lastName").sort({ createdAt: -1 }).limit(5).lean()
    ]);

    const mappedActivity = recentActivity.map(mr => ({
      ...mr,
      id: mr._id,
      patient_name: mr.patientId ? `${mr.patientId.firstName} ${mr.patientId.lastName}` : null
    }));

    res.json({
      success: true,
      message: "Doctor dashboard metrics retrieved.",
      data: {
        assigned_patients: assignedPatients,
        todays_appointments: todaysAppointments,
        critical_patients: criticalPatients,
        pending_medical_records: 0,
        available_beds: availableBeds,
        transfer_requests: transferRequests,
        recent_patient_activity: mappedActivity
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to load doctor dashboard.", error: error.message });
  }
};

// GET /api/dashboard/nurse
const getNurseDashboard = async (req, res) => {
  try {
    const nurseId = req.user ? (req.user._id || req.user.id) : null;
    const nurse = await Nurse.findById(nurseId).lean();
    const wardId = nurse?.assignedWardId || null;

    let assignedPatients = 0, occupiedBeds = 0, availableBeds = 0, criticalPatients = 0, transfers = 0;

    if (wardId) {
      [assignedPatients, occupiedBeds, availableBeds, criticalPatients, transfers] = await Promise.all([
        Patient.countDocuments({ currentWardId: wardId, admissionStatus: "admitted", status: { $ne: "deleted" } }),
        Bed.countDocuments({ wardId, status: "occupied", isDeleted: false }),
        Bed.countDocuments({ wardId, status: "available", isDeleted: false }),
        Patient.countDocuments({ currentWardId: wardId, conditionStatus: "critical", status: { $ne: "deleted" } }),
        Transfer.countDocuments({ $or: [{ sourceWardId: wardId }, { destinationWardId: wardId }], status: { $ne: "completed" }, isDeleted: false })
      ]);
    }

    res.json({
      success: true,
      message: "Nurse dashboard metrics retrieved.",
      data: {
        assigned_patients: assignedPatients,
        ward_id: wardId,
        occupied_beds: occupiedBeds,
        available_beds: availableBeds,
        critical_patients: criticalPatients,
        patient_tasks: 4,
        transfers,
        recent_activities: []
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to load nurse dashboard.", error: error.message });
  }
};

// GET /api/dashboard/receptionist
const getReceptionistDashboard = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [totalPatients, todayReg, todayAdm, todayDis, todayApt, availBeds] = await Promise.all([
      Patient.countDocuments({ status: { $ne: "deleted" } }),
      Patient.countDocuments({ status: { $ne: "deleted" }, createdAt: { $gte: today, $lt: tomorrow } }),
      Admission.countDocuments({ admissionDate: { $gte: today, $lt: tomorrow } }),
      Discharge.countDocuments({ dischargeDate: { $gte: today, $lt: tomorrow } }),
      Appointment.countDocuments({ appointmentDate: { $gte: today, $lt: tomorrow }, isDeleted: false }),
      Bed.countDocuments({ status: "available", isDeleted: false })
    ]);

    res.json({
      success: true,
      message: "Receptionist dashboard metrics retrieved.",
      data: {
        total_patients: totalPatients,
        todays_registrations: todayReg,
        todays_admissions: todayAdm,
        todays_discharges: todayDis,
        todays_appointments: todayApt,
        available_beds: availBeds,
        pending_admissions: 0,
        pending_discharges: 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to load receptionist dashboard.", error: error.message });
  }
};

module.exports = {
  getAdminDashboard,
  getDoctorDashboard,
  getNurseDashboard,
  getReceptionistDashboard
};
