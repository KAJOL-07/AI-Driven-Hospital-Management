require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { connectDB } = require("../config/db");

const User = require("../models/User");
const Department = require("../models/Department");
const Ward = require("../models/Ward");
const Room = require("../models/Room");
const Bed = require("../models/Bed");
const Doctor = require("../models/Doctor");
const Nurse = require("../models/Nurse");
const Staff = require("../models/Staff");
const Patient = require("../models/Patient");
const Admission = require("../models/Admission");
const Medicine = require("../models/Medicine");
const Notification = require("../models/Notification");
const EmergencyCase = require("../models/EmergencyCase");

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log("🌱 Starting Comprehensive Hospital Seeding (3 Floors, 15 Departments)...");

    // ─── 1. Seed Users ────────────────────────────────────────────────────────
    const defaultPassword = await bcrypt.hash("password123", 12);
    const users = [
      { name: "Admin User", email: "admin@mediflow.hospital", password: defaultPassword, role: "admin", department: "Administration" },
      { name: "Dr. Robert Vance", email: "doctor@mediflow.hospital", password: defaultPassword, role: "doctor", department: "Cardiology" },
      { name: "Nurse Sarah Jenkins", email: "nurse@mediflow.hospital", password: defaultPassword, role: "nurse", department: "General Medicine" },
      { name: "Receptionist Alice", email: "receptionist@mediflow.hospital", password: defaultPassword, role: "receptionist", department: "Central Patient Intake" }
    ];

    for (const u of users) {
      await User.findOneAndUpdate({ email: u.email }, u, { upsert: true, returnDocument: "after" });
    }
    console.log("✅ Users seeded (default password: password123)");

    // ─── 2. Seed EXACTLY 15 Unique Departments ────────────────────────────────
    const officialDepts = [
      { name: "General Medicine", code: "GEN", floor: "Ground Floor", location: "Ground Floor - East Wing", description: "Primary adult inpatient & outpatient care, General Ward Hall" },
      { name: "Cardiology", code: "CAR", floor: "First Floor", location: "First Floor - Wing A (Rooms 101–110)", description: "Cardiovascular intensive care, telemetry, interventional cardiology" },
      { name: "Neurology", code: "NEU", floor: "First Floor", location: "First Floor - Wing B (Rooms 111–120)", description: "Acute stroke, epilepsy monitoring, neurodegenerative disorders" },
      { name: "Orthopedics", code: "ORT", floor: "First Floor", location: "First Floor - Wing C (Rooms 121–130)", description: "Musculoskeletal surgery, joint reconstruction, trauma rehabilitation" },
      { name: "Gynecology", code: "GYN", floor: "First Floor", location: "First Floor - Wing D (Rooms 131–140)", description: "Maternal care, obstetrics, high-risk pregnancy, women's health" },
      { name: "Pulmonology", code: "PUL", floor: "First Floor", location: "First Floor - Wing E (Rooms 141–150)", description: "Respiratory failure, COPD, asthma, non-invasive ventilation" },
      { name: "Pediatrics", code: "PED", floor: "Second Floor", location: "Second Floor - Wing A (Rooms 201–210)", description: "Pediatric acute inpatient care, child health & development" },
      { name: "General Surgery", code: "SUR", floor: "Ground Floor", location: "Ground Floor - North Wing", description: "Pre- and post-operative surgical observation & wound management" },
      { name: "Emergency Medicine", code: "EMG", floor: "Ground Floor", location: "Ground Floor - Emergency & Triage Hall", description: "24/7 trauma response, acute triage, resuscitation" },
      { name: "Oncology", code: "ONC", floor: "Second Floor", location: "Second Floor - Wing B (Rooms 211–220)", description: "Medical oncology, chemotherapy infusion, cancer supportive care" },
      { name: "Dermatology", code: "DER", floor: "Second Floor", location: "Second Floor - Wing G (Rooms 245–250)", description: "Severe dermatological conditions, wound care, immunodermatology" },
      { name: "ENT", code: "ENT", floor: "Second Floor", location: "Second Floor - Wing E (Rooms 233–238)", description: "Ear, nose, throat, head and neck inpatient clinical care" },
      { name: "Ophthalmology", code: "OPH", floor: "Second Floor", location: "Second Floor - Wing F (Rooms 239–244)", description: "Ophthalmic surgery recovery and advanced eye trauma monitoring" },
      { name: "Urology", code: "URO", floor: "Second Floor", location: "Second Floor - Wing D (Rooms 227–232)", description: "Urological disorders, post-endourological procedure care" },
      { name: "Nephrology", code: "NEP", floor: "Second Floor", location: "Second Floor - Wing C (Rooms 221–226)", description: "Acute kidney injury, dialysis care, chronic renal management" }
    ];

    const officialDeptNames = officialDepts.map(d => d.name);

    // Save official 15 departments
    const savedDepts = {};
    for (const d of officialDepts) {
      const saved = await Department.findOneAndUpdate(
        { name: d.name },
        { ...d, status: "active" },
        { upsert: true, returnDocument: "after" }
      );
      savedDepts[d.name] = saved._id;
    }

    // Safely migrate any legacy departments (e.g. "Intensive Care Unit (ICU)", "Emergency & Trauma")
    const legacyDepts = await Department.find({ name: { $nin: officialDeptNames } });
    for (const leg of legacyDepts) {
      const targetDeptId = savedDepts["Emergency Medicine"] || savedDepts["General Medicine"];
      await Ward.updateMany({ departmentId: leg._id }, { departmentId: targetDeptId });
      await Doctor.updateMany({ departmentId: leg._id }, { departmentId: targetDeptId });
      await Patient.updateMany({ departmentId: leg._id }, { departmentId: targetDeptId });
      await Department.findByIdAndDelete(leg._id);
    }
    console.log(`✅ EXACTLY 15 Unique Departments Verified & Seeded in Database`);

    // ─── 3. Seed Wards Across 3 Floors ────────────────────────────────────────
    const wardsConfig = [
      // Ground Floor Wards
      {
        name: "General Ward Hall",
        wardType: "general",
        departmentId: savedDepts["General Medicine"],
        floor: "Ground Floor",
        capacity: 30,
        location: "Ground Floor - Main Hall",
        description: "Shared inpatient general ward with individual partitioned beds"
      },
      {
        name: "Emergency & Triage Ward",
        wardType: "emergency",
        departmentId: savedDepts["Emergency Medicine"],
        floor: "Ground Floor",
        capacity: 10,
        location: "Ground Floor - Emergency Wing",
        description: "Acute triage and trauma resuscitation bays"
      },
      {
        name: "General Surgery Ward",
        wardType: "general",
        departmentId: savedDepts["General Surgery"],
        floor: "Ground Floor",
        capacity: 10,
        location: "Ground Floor - North Wing",
        description: "Post-operative surgical inpatient unit"
      },

      // First Floor Specialty Wards (50 single rooms)
      {
        name: "Cardiology Specialty Ward",
        wardType: "cardiology",
        departmentId: savedDepts["Cardiology"],
        floor: "First Floor",
        capacity: 10,
        location: "First Floor - Rooms 101–110",
        description: "10 Private cardiology inpatient rooms with bedside telemetry"
      },
      {
        name: "Neurology Specialty Ward",
        wardType: "neurology",
        departmentId: savedDepts["Neurology"],
        floor: "First Floor",
        capacity: 10,
        location: "First Floor - Rooms 111–120",
        description: "10 Private neurology recovery rooms with neuro-vital monitors"
      },
      {
        name: "Orthopedics Specialty Ward",
        wardType: "orthopedic",
        departmentId: savedDepts["Orthopedics"],
        floor: "First Floor",
        capacity: 10,
        location: "First Floor - Rooms 121–130",
        description: "10 Orthopedic private suites with motorized traction frames"
      },
      {
        name: "Gynecology Specialty Ward",
        wardType: "maternity",
        departmentId: savedDepts["Gynecology"],
        floor: "First Floor",
        capacity: 10,
        location: "First Floor - Rooms 131–140",
        description: "10 Maternal & gynecology suites with fetal Doppler monitoring"
      },
      {
        name: "Pulmonology Specialty Ward",
        wardType: "general",
        departmentId: savedDepts["Pulmonology"],
        floor: "First Floor",
        capacity: 10,
        location: "First Floor - Rooms 141–150",
        description: "10 Pulmonary single rooms with central wall oxygen and suction"
      },

      // Second Floor Additional Specialty Wards (50 single rooms)
      {
        name: "Pediatrics Specialty Ward",
        wardType: "pediatric",
        departmentId: savedDepts["Pediatrics"],
        floor: "Second Floor",
        capacity: 10,
        location: "Second Floor - Rooms 201–210",
        description: "10 Child-friendly pediatric suites with parental monitoring amenities"
      },
      {
        name: "Oncology Specialty Ward",
        wardType: "general",
        departmentId: savedDepts["Oncology"],
        floor: "Second Floor",
        capacity: 10,
        location: "Second Floor - Rooms 211–220",
        description: "10 HEPA-filtered single rooms for immuno-compromised oncology patients"
      },
      {
        name: "Nephrology Specialty Ward",
        wardType: "general",
        departmentId: savedDepts["Nephrology"],
        floor: "Second Floor",
        capacity: 6,
        location: "Second Floor - Rooms 221–226",
        description: "6 Renal recovery rooms with integrated dialysate plumbing"
      },
      {
        name: "Urology Specialty Ward",
        wardType: "general",
        departmentId: savedDepts["Urology"],
        floor: "Second Floor",
        capacity: 6,
        location: "Second Floor - Rooms 227–232",
        description: "6 Private post-procedure urology inpatient suites"
      },
      {
        name: "ENT Specialty Ward",
        wardType: "general",
        departmentId: savedDepts["ENT"],
        floor: "Second Floor",
        capacity: 6,
        location: "Second Floor - Rooms 233–238",
        description: "6 Head & neck post-surgical recovery rooms"
      },
      {
        name: "Ophthalmology Specialty Ward",
        wardType: "general",
        departmentId: savedDepts["Ophthalmology"],
        floor: "Second Floor",
        capacity: 6,
        location: "Second Floor - Rooms 239–244",
        description: "6 Low-light ophthalmic post-operative observation rooms"
      },
      {
        name: "Dermatology Specialty Ward",
        wardType: "general",
        departmentId: savedDepts["Dermatology"],
        floor: "Second Floor",
        capacity: 6,
        location: "Second Floor - Rooms 245–250",
        description: "6 Specialized dermatologic sterile recovery suites"
      }
    ];

    const savedWards = {};
    for (const w of wardsConfig) {
      const saved = await Ward.findOneAndUpdate(
        { name: w.name },
        w,
        { upsert: true, returnDocument: "after" }
      );
      savedWards[w.name] = saved._id;
    }

    // Clean up obsolete legacy wards if any exist
    const officialWardNames = wardsConfig.map(w => w.name);
    await Ward.deleteMany({ name: { $nin: officialWardNames } });
    console.log(`✅ 15 Wards Seeded Across Ground, First, and Second Floors`);

    // ─── 4. Seed Doctors (One or more per department) ─────────────────────────
    const doctorsList = [
      { doctorId: "DR-101", name: "Dr. Robert Vance", email: "r.vance@mediflow.hospital", specialization: "Cardiology", qualification: "MD, FACC", departmentId: savedDepts["Cardiology"], assignedWardId: savedWards["Cardiology Specialty Ward"], experienceYears: 14, availabilityStatus: "available" },
      { doctorId: "DR-102", name: "Dr. Elena Rostova", email: "e.rostova@mediflow.hospital", specialization: "Neurology", qualification: "MD, FAAN", departmentId: savedDepts["Neurology"], assignedWardId: savedWards["Neurology Specialty Ward"], experienceYears: 12, availabilityStatus: "present" },
      { doctorId: "DR-103", name: "Dr. Marcus Brody", email: "m.brody@mediflow.hospital", specialization: "Orthopedics", qualification: "MS, FAAOS", departmentId: savedDepts["Orthopedics"], assignedWardId: savedWards["Orthopedics Specialty Ward"], experienceYears: 11, availabilityStatus: "available" },
      { doctorId: "DR-104", name: "Dr. Beatrice Vance", email: "b.vance@mediflow.hospital", specialization: "Gynecology", qualification: "MD, FACOG", departmentId: savedDepts["Gynecology"], assignedWardId: savedWards["Gynecology Specialty Ward"], experienceYears: 10, availabilityStatus: "available" },
      { doctorId: "DR-105", name: "Dr. Samuel Chen", email: "s.chen@mediflow.hospital", specialization: "Pulmonology", qualification: "MD, FCCP", departmentId: savedDepts["Pulmonology"], assignedWardId: savedWards["Pulmonology Specialty Ward"], experienceYears: 15, availabilityStatus: "busy" },
      { doctorId: "DR-106", name: "Dr. Kevin Zhang", email: "k.zhang@mediflow.hospital", specialization: "General Medicine", qualification: "MS, FACS", departmentId: savedDepts["General Medicine"], assignedWardId: savedWards["General Ward Hall"], experienceYears: 16, availabilityStatus: "present" },
      { doctorId: "DR-107", name: "Dr. Sarah Connor", email: "s.connor@mediflow.hospital", specialization: "Emergency Medicine", qualification: "MD, FACEP", departmentId: savedDepts["Emergency Medicine"], assignedWardId: savedWards["Emergency & Triage Ward"], experienceYears: 9, availabilityStatus: "emergency_duty" },
      { doctorId: "DR-108", name: "Dr. Arthur Pendelton", email: "a.pendelton@mediflow.hospital", specialization: "General Surgery", qualification: "MS, FRCS", departmentId: savedDepts["General Surgery"], assignedWardId: savedWards["General Surgery Ward"], experienceYears: 18, availabilityStatus: "available" },
      { doctorId: "DR-109", name: "Dr. Maya Lin", email: "m.lin@mediflow.hospital", specialization: "Pediatrics", qualification: "MD, FAAP", departmentId: savedDepts["Pediatrics"], assignedWardId: savedWards["Pediatrics Specialty Ward"], experienceYears: 13, availabilityStatus: "present" },
      { doctorId: "DR-110", name: "Dr. David Banner", email: "d.banner@mediflow.hospital", specialization: "Oncology", qualification: "MD, PhD", departmentId: savedDepts["Oncology"], assignedWardId: savedWards["Oncology Specialty Ward"], experienceYears: 17, availabilityStatus: "available" },
      { doctorId: "DR-111", name: "Dr. Rachel Green", email: "r.green@mediflow.hospital", specialization: "Dermatology", qualification: "MD, FAAD", departmentId: savedDepts["Dermatology"], assignedWardId: savedWards["Dermatology Specialty Ward"], experienceYears: 8, availabilityStatus: "available" },
      { doctorId: "DR-112", name: "Dr. Victor Stone", email: "v.stone@mediflow.hospital", specialization: "ENT", qualification: "MS, FICS", departmentId: savedDepts["ENT"], assignedWardId: savedWards["ENT Specialty Ward"], experienceYears: 11, availabilityStatus: "available" },
      { doctorId: "DR-113", name: "Dr. Iris West", email: "i.west@mediflow.hospital", specialization: "Ophthalmology", qualification: "MD, ABO", departmentId: savedDepts["Ophthalmology"], assignedWardId: savedWards["Ophthalmology Specialty Ward"], experienceYears: 10, availabilityStatus: "available" },
      { doctorId: "DR-114", name: "Dr. Stephen Strange", email: "s.strange@mediflow.hospital", specialization: "Urology", qualification: "MS, AUA", departmentId: savedDepts["Urology"], assignedWardId: savedWards["Urology Specialty Ward"], experienceYears: 14, availabilityStatus: "present" },
      { doctorId: "DR-115", name: "Dr. Natasha Romanoff", email: "n.romanoff@mediflow.hospital", specialization: "Nephrology", qualification: "MD, FASN", departmentId: savedDepts["Nephrology"], assignedWardId: savedWards["Nephrology Specialty Ward"], experienceYears: 12, availabilityStatus: "available" }
    ];

    const savedDoctors = {};
    for (const doc of doctorsList) {
      const saved = await Doctor.findOneAndUpdate(
        { doctorId: doc.doctorId },
        doc,
        { upsert: true, returnDocument: "after" }
      );
      savedDoctors[doc.specialization] = saved;
    }
    console.log(`✅ 15 Lead Physicians Seeded Across All 15 Departments`);

    // ─── 5. Seed Nurses ───────────────────────────────────────────────────────
    const nurses = [
      { nurseId: "NR-201", name: "Nurse Sarah Jenkins", email: "s.jenkins@mediflow.hospital", qualification: "BSN, RN", departmentId: savedDepts["General Medicine"], assignedWardId: savedWards["General Ward Hall"], availabilityStatus: "on_duty" },
      { nurseId: "NR-202", name: "Nurse Michael Scott", email: "m.scott@mediflow.hospital", qualification: "MSN, APRN", departmentId: savedDepts["Cardiology"], assignedWardId: savedWards["Cardiology Specialty Ward"], availabilityStatus: "present" },
      { nurseId: "NR-203", name: "Nurse Clara Oswald", email: "c.oswald@mediflow.hospital", qualification: "BSN, RN", departmentId: savedDepts["Neurology"], assignedWardId: savedWards["Neurology Specialty Ward"], availabilityStatus: "available" },
      { nurseId: "NR-204", name: "Nurse Donna Noble", email: "d.noble@mediflow.hospital", qualification: "BSN, RN", departmentId: savedDepts["Emergency Medicine"], assignedWardId: savedWards["Emergency & Triage Ward"], availabilityStatus: "on_duty" },
      { nurseId: "NR-205", name: "Nurse Amy Pond", email: "a.pond@mediflow.hospital", qualification: "BSN, RN", departmentId: savedDepts["Pediatrics"], assignedWardId: savedWards["Pediatrics Specialty Ward"], availabilityStatus: "present" },
      { nurseId: "NR-206", name: "Nurse Rory Williams", email: "r.williams@mediflow.hospital", qualification: "BSN, RN", departmentId: savedDepts["Oncology"], assignedWardId: savedWards["Oncology Specialty Ward"], availabilityStatus: "available" }
    ];

    for (const n of nurses) {
      await Nurse.findOneAndUpdate({ nurseId: n.nurseId }, n, { upsert: true, returnDocument: "after" });
    }
    console.log("✅ Nurses seeded across clinical floors");

    // ─── 6. Seed Ground Floor Beds (General Ward, Emergency, Surgery) ─────────
    // General Ward Hall: 30 beds (GW-B001 to GW-B030)
    const groundWardId = savedWards["General Ward Hall"];
    const groundBedStatuses = [
      "occupied", "available", "cleaning_required", "occupied", "available",
      "cleaning_in_progress", "occupied", "available", "reserved", "maintenance",
      "occupied", "available", "cleaning_required", "available", "occupied",
      "available", "available", "occupied", "cleaning_in_progress", "available",
      "occupied", "available", "reserved", "available", "occupied",
      "available", "cleaning_required", "available", "occupied", "available"
    ];

    const savedGroundBeds = [];
    for (let i = 1; i <= 30; i++) {
      const bedNumber = `GW-B${i.toString().padStart(3, "0")}`;
      const status = groundBedStatuses[i - 1] || "available";
      const bedObj = {
        bedNumber,
        roomNumber: null, // Shared Hall
        roomId: null,
        floor: "Ground Floor",
        specialty: "General Medicine",
        wardId: groundWardId,
        bedType: "standard",
        status,
        lastCleaned: status === "cleaning_required" ? "Turnover Required" : status === "cleaning_in_progress" ? "Cleaning In Progress" : "Recently Sterilized",
        isDeleted: false
      };
      const saved = await Bed.findOneAndUpdate(
        { bedNumber },
        bedObj,
        { upsert: true, returnDocument: "after" }
      );
      savedGroundBeds.push(saved);
    }

    // Emergency & Triage Ward: 10 beds (EMG-B001 to EMG-B010)
    const emgWardId = savedWards["Emergency & Triage Ward"];
    for (let i = 1; i <= 10; i++) {
      const bedNumber = `EMG-B${i.toString().padStart(3, "0")}`;
      const status = i <= 6 ? "occupied" : i === 7 ? "cleaning_required" : "available";
      const bedObj = {
        bedNumber,
        roomNumber: null,
        roomId: null,
        floor: "Ground Floor",
        specialty: "Emergency Medicine",
        wardId: emgWardId,
        bedType: "emergency",
        status,
        lastCleaned: "Recently Sterilized",
        isDeleted: false
      };
      const saved = await Bed.findOneAndUpdate({ bedNumber }, bedObj, { upsert: true, returnDocument: "after" });
      savedGroundBeds.push(saved);
    }

    // General Surgery Ward: 10 beds (GSW-B001 to GSW-B010)
    const surgWardId = savedWards["General Surgery Ward"];
    for (let i = 1; i <= 10; i++) {
      const bedNumber = `GSW-B${i.toString().padStart(3, "0")}`;
      const status = i <= 4 ? "occupied" : i === 5 ? "cleaning_in_progress" : "available";
      const bedObj = {
        bedNumber,
        roomNumber: null,
        roomId: null,
        floor: "Ground Floor",
        specialty: "General Surgery",
        wardId: surgWardId,
        bedType: "standard",
        status,
        lastCleaned: "Recently Sterilized",
        isDeleted: false
      };
      const saved = await Bed.findOneAndUpdate({ bedNumber }, bedObj, { upsert: true, returnDocument: "after" });
      savedGroundBeds.push(saved);
    }
    console.log(`✅ 50 Ground Floor Inpatient Beds Seeded (30 General Hall + 10 Emergency + 10 Surgery)`);

    // ─── 7. Seed First Floor (EXACTLY 50 Specialty Rooms & 50 Beds) ───────────
    const firstFloorSpecs = [
      { name: "Cardiology", prefix: "FF-CAR", startRoom: 101, deptName: "Cardiology", wardName: "Cardiology Specialty Ward" },
      { name: "Neurology", prefix: "FF-NEU", startRoom: 111, deptName: "Neurology", wardName: "Neurology Specialty Ward" },
      { name: "Orthopedics", prefix: "FF-ORT", startRoom: 121, deptName: "Orthopedics", wardName: "Orthopedics Specialty Ward" },
      { name: "Gynecology", prefix: "FF-GYN", startRoom: 131, deptName: "Gynecology", wardName: "Gynecology Specialty Ward" },
      { name: "Pulmonology", prefix: "FF-PUL", startRoom: 141, deptName: "Pulmonology", wardName: "Pulmonology Specialty Ward" }
    ];

    const specialtyStatusPatterns = [
      ["occupied", "available", "occupied", "cleaning_required", "available", "occupied", "available", "cleaning_in_progress", "reserved", "available"],
      ["occupied", "available", "occupied", "cleaning_required", "available", "available", "occupied", "maintenance", "available", "reserved"],
      ["occupied", "available", "available", "occupied", "cleaning_required", "available", "cleaning_in_progress", "occupied", "available", "available"],
      ["occupied", "available", "occupied", "available", "cleaning_required", "occupied", "available", "cleaning_in_progress", "reserved", "available"],
      ["occupied", "available", "occupied", "available", "cleaning_required", "cleaning_in_progress", "available", "occupied", "maintenance", "available"]
    ];

    const savedFirstFloorBeds = [];
    for (let sIdx = 0; sIdx < firstFloorSpecs.length; sIdx++) {
      const spec = firstFloorSpecs[sIdx];
      const wardId = savedWards[spec.wardName];
      const deptId = savedDepts[spec.deptName];
      const pattern = specialtyStatusPatterns[sIdx];

      for (let r = 0; r < 10; r++) {
        const roomNumber = (spec.startRoom + r).toString();
        const bedIndex = (r + 1).toString().padStart(3, "0");
        const bedNumber = `${spec.prefix}-B${bedIndex}`;
        const status = pattern[r];

        // 1. Upsert Room
        const savedRoom = await Room.findOneAndUpdate(
          { roomNumber },
          {
            roomNumber,
            floor: "First Floor",
            departmentId: deptId,
            wardId,
            specialization: spec.name,
            roomType: "single",
            status: "active",
            isDeleted: false
          },
          { upsert: true, returnDocument: "after" }
        );

        // 2. Upsert Bed
        const savedBed = await Bed.findOneAndUpdate(
          { bedNumber },
          {
            bedNumber,
            roomNumber,
            roomId: savedRoom._id,
            floor: "First Floor",
            specialty: spec.name,
            wardId,
            bedType: "specialty",
            status,
            lastCleaned: status === "cleaning_required" ? "Turnover Required" : status === "cleaning_in_progress" ? "Cleaning In Progress" : "Recently Sterilized",
            isDeleted: false
          },
          { upsert: true, returnDocument: "after" }
        );

        // Link bed back into room
        savedRoom.bedId = savedBed._id;
        await savedRoom.save();

        savedFirstFloorBeds.push(savedBed);
      }
    }
    console.log(`✅ EXACTLY 50 First Floor Specialty Rooms (101–150) & 50 Beds Seeded`);

    // ─── 8. Seed Second Floor (EXACTLY 50 Specialty Rooms & 50 Beds) ──────────
    const secondFloorSpecs = [
      { name: "Pediatrics", prefix: "SF-PED", startRoom: 201, count: 10, deptName: "Pediatrics", wardName: "Pediatrics Specialty Ward" },
      { name: "Oncology", prefix: "SF-ONC", startRoom: 211, count: 10, deptName: "Oncology", wardName: "Oncology Specialty Ward" },
      { name: "Nephrology", prefix: "SF-NEP", startRoom: 221, count: 6, deptName: "Nephrology", wardName: "Nephrology Specialty Ward" },
      { name: "Urology", prefix: "SF-URO", startRoom: 227, count: 6, deptName: "Urology", wardName: "Urology Specialty Ward" },
      { name: "ENT", prefix: "SF-ENT", startRoom: 233, count: 6, deptName: "ENT", wardName: "ENT Specialty Ward" },
      { name: "Ophthalmology", prefix: "SF-OPH", startRoom: 239, count: 6, deptName: "Ophthalmology", wardName: "Ophthalmology Specialty Ward" },
      { name: "Dermatology", prefix: "SF-DER", startRoom: 245, count: 6, deptName: "Dermatology", wardName: "Dermatology Specialty Ward" }
    ];

    const savedSecondFloorBeds = [];
    for (const spec of secondFloorSpecs) {
      const wardId = savedWards[spec.wardName];
      const deptId = savedDepts[spec.deptName];

      for (let r = 0; r < spec.count; r++) {
        const roomNumber = (spec.startRoom + r).toString();
        const bedIndex = (r + 1).toString().padStart(3, "0");
        const bedNumber = `${spec.prefix}-B${bedIndex}`;
        const status = r === 0 ? "occupied" : r === 1 ? "available" : r === 2 ? "occupied" : r === 3 ? "cleaning_required" : "available";

        // 1. Upsert Room
        const savedRoom = await Room.findOneAndUpdate(
          { roomNumber },
          {
            roomNumber,
            floor: "Second Floor",
            departmentId: deptId,
            wardId,
            specialization: spec.name,
            roomType: "single",
            status: "active",
            isDeleted: false
          },
          { upsert: true, returnDocument: "after" }
        );

        // 2. Upsert Bed
        const savedBed = await Bed.findOneAndUpdate(
          { bedNumber },
          {
            bedNumber,
            roomNumber,
            roomId: savedRoom._id,
            floor: "Second Floor",
            specialty: spec.name,
            wardId,
            bedType: "specialty",
            status,
            lastCleaned: status === "cleaning_required" ? "Turnover Required" : "Recently Sterilized",
            isDeleted: false
          },
          { upsert: true, returnDocument: "after" }
        );

        savedRoom.bedId = savedBed._id;
        await savedRoom.save();

        savedSecondFloorBeds.push(savedBed);
      }
    }
    console.log(`✅ EXACTLY 50 Second Floor Specialty Rooms (201–250) & 50 Beds Seeded Across 7 Departments`);

    // ─── 9. Seed Sample Inpatients & Active Admissions ────────────────────────
    const allOccupiedBeds = [
      ...savedGroundBeds.filter(b => b.status === "occupied"),
      ...savedFirstFloorBeds.filter(b => b.status === "occupied"),
      ...savedSecondFloorBeds.filter(b => b.status === "occupied")
    ];

    const sampleInpatients = [
      { name: "David Miller", age: 54, gender: "male", bloodGroup: "O+", condition: "critical", priority: "emergency", reason: "Acute Hypoxemic Respiratory Distress", spec: "General Medicine" },
      { name: "James Wilson", age: 62, gender: "male", bloodGroup: "A+", condition: "serious", priority: "high", reason: "Severe Bacterial Pneumonia", spec: "General Medicine" },
      { name: "Kenneth Robinson", age: 71, gender: "male", bloodGroup: "B+", condition: "stable", priority: "medium", reason: "Post-Operative Inpatient Recovery", spec: "General Medicine" },
      { name: "Maria Garcia", age: 46, gender: "female", bloodGroup: "AB+", condition: "under_observation", priority: "medium", reason: "Acute Abdominal Pain & Dehydration", spec: "General Surgery" },
      { name: "Robert Taylor", age: 58, gender: "male", bloodGroup: "O-", condition: "improving", priority: "low", reason: "Cellulitis with IV Antibiotic Therapy", spec: "General Medicine" },
      { name: "Arthur Pendelton", age: 65, gender: "male", bloodGroup: "A+", condition: "serious", priority: "high", reason: "Acute Coronary Syndrome & Unstable Angina", spec: "Cardiology" },
      { name: "Maria Santos", age: 58, gender: "female", bloodGroup: "O+", condition: "stable", priority: "medium", reason: "Atrial Fibrillation Rhythm Correction", spec: "Cardiology" },
      { name: "Evelyn Reed", age: 49, gender: "female", bloodGroup: "O-", condition: "serious", priority: "high", reason: "Acute Ischemic Stroke Post-TPA Monitoring", spec: "Neurology" },
      { name: "Alan Turing", age: 63, gender: "male", bloodGroup: "AB-", condition: "stable", priority: "medium", reason: "Intractable Seizure Disorder Titration", spec: "Neurology" },
      { name: "Liam Gallagher", age: 38, gender: "male", bloodGroup: "B+", condition: "stable", priority: "medium", reason: "Complex Tibial Fracture Post-ORIF", spec: "Orthopedics" },
      { name: "Sophia Martinez", age: 29, gender: "female", bloodGroup: "A+", condition: "stable", priority: "medium", reason: "Post-Cesarean Inpatient Maternal Recovery", spec: "Gynecology" },
      { name: "Raymond Holt", age: 61, gender: "male", bloodGroup: "O-", condition: "serious", priority: "high", reason: "Acute Exacerbation of COPD on Non-Invasive Ventilation", spec: "Pulmonology" },
      { name: "Leo Valdez", age: 9, gender: "male", bloodGroup: "O+", condition: "improving", priority: "medium", reason: "Severe Pediatric Bronchiolitis", spec: "Pediatrics" },
      { name: "Eleanor Vance", age: 55, gender: "female", bloodGroup: "A-", condition: "stable", priority: "medium", reason: "Chemotherapy Cycle 3 Inpatient Infusion", spec: "Oncology" },
      { name: "Charles Xavier", age: 68, gender: "male", bloodGroup: "B+", condition: "serious", priority: "high", reason: "Acute Tubular Necrosis Renal Support", spec: "Nephrology" }
    ];

    let pNum = 1001;
    for (let i = 0; i < allOccupiedBeds.length && i < sampleInpatients.length; i++) {
      const p = sampleInpatients[i];
      const bed = allOccupiedBeds[i];
      const doc = savedDoctors[p.spec] || savedDoctors["General Medicine"] || Object.values(savedDoctors)[0];
      const patientId = `PT-2026-${pNum++}`;
      const [first, ...rest] = p.name.split(" ");
      const last = rest.join(" ");

      const savedPat = await Patient.findOneAndUpdate(
        { patientId },
        {
          patientId,
          firstName: first,
          lastName: last,
          dateOfBirth: new Date("1982-05-14"),
          gender: p.gender,
          phone: `+1-555-${pNum}`,
          email: `${first.toLowerCase()}.${last.toLowerCase()}@mediflow.patient`,
          bloodGroup: p.bloodGroup,
          conditionStatus: p.condition,
          priority: p.priority,
          admissionStatus: "admitted",
          departmentId: bed.wardId?.departmentId || savedDepts[p.spec] || savedDepts["General Medicine"],
          currentWardId: bed.wardId,
          currentBedId: bed._id,
          assignedDoctorId: doc?._id,
          status: "active"
        },
        { upsert: true, returnDocument: "after" }
      );

      // Link bed to patient
      await Bed.findByIdAndUpdate(bed._id, { patientId: savedPat._id, status: "occupied" });

      // Create Active Admission
      await Admission.findOneAndUpdate(
        { bedId: bed._id, status: "active" },
        {
          admissionId: `ADM-${Math.floor(3000 + Math.random() * 7000)}`,
          patientId: savedPat._id,
          doctorId: doc?._id,
          wardId: bed.wardId,
          bedId: bed._id,
          departmentId: savedDepts[p.spec] || savedDepts["General Medicine"],
          admissionDate: new Date(Date.now() - (i + 1) * 3600000 * 6),
          admissionReason: p.reason,
          priority: p.priority,
          status: "active"
        },
        { upsert: true, returnDocument: "after" }
      );
    }
    console.log(`✅ Active Admissions Created & Linked for Occupied Beds`);

    // ─── 10. Seed Medicines ──────────────────────────────────────────────────
    const medicines = [
      { name: "Paracetamol 500mg", category: "Analgesics", quantity: 300, unit: "tablets", price: 0.50, minStockLevel: 50 },
      { name: "Amoxicillin 250mg", category: "Antibiotics", quantity: 120, unit: "capsules", price: 1.20, minStockLevel: 30 },
      { name: "Atorvastatin 20mg", category: "Cardiovascular", quantity: 180, unit: "tablets", price: 1.80, minStockLevel: 40 },
      { name: "Levetiracetam 500mg", category: "Neurology", quantity: 100, unit: "tablets", price: 2.10, minStockLevel: 25 },
      { name: "Salbutamol Inhaler 100mcg", category: "Pulmonary", quantity: 60, unit: "inhalers", price: 5.50, minStockLevel: 15 },
      { name: "Cisplatin 50mg Injection", category: "Oncology", quantity: 25, unit: "vials", price: 42.00, minStockLevel: 10 }
    ];

    for (const m of medicines) {
      await Medicine.findOneAndUpdate({ name: m.name }, m, { upsert: true, returnDocument: "after" });
    }
    console.log("✅ Pharmacy stock items seeded");

    // ─── 11. Notifications ───────────────────────────────────────────────────
    await Notification.create([
      { title: "Hospital Architecture Updated", message: "3 Physical Floors and exactly 15 Departments configured.", type: "system" },
      { title: "Capacity Operational", message: "Ground Floor (50 beds), First Floor (50 rooms), Second Floor (50 rooms) ready.", type: "alert" }
    ]);
    console.log("✅ Initial system notifications created");

    // Summary output
    const totalDepts = await Department.countDocuments({ status: "active" });
    const totalWards = await Ward.countDocuments();
    const totalRooms = await Room.countDocuments({ isDeleted: false });
    const totalBeds = await Bed.countDocuments({ isDeleted: false });
    const groundBeds = await Bed.countDocuments({ floor: "Ground Floor", isDeleted: false });
    const firstBeds = await Bed.countDocuments({ floor: "First Floor", isDeleted: false });
    const secondBeds = await Bed.countDocuments({ floor: "Second Floor", isDeleted: false });

    console.log("\n========================================================");
    console.log("🎉 HOSPITAL DATABASE SEEDING COMPLETED SUCCESSFULLY!");
    console.log("========================================================");
    console.log(`🏥 Active Floors: 3 (Ground Floor, First Floor, Second Floor)`);
    console.log(`🏛️ Active Departments: ${totalDepts} (Target: 15)`);
    console.log(`🏢 Clinical Wards: ${totalWards}`);
    console.log(`🚪 Specialty Single Rooms: ${totalRooms} (50 First Floor + 50 Second Floor)`);
    console.log(`🛏️ Total Hospital Beds: ${totalBeds}`);
    console.log(`   - Ground Floor Beds: ${groundBeds}`);
    console.log(`   - First Floor Beds:  ${firstBeds}`);
    console.log(`   - Second Floor Beds: ${secondBeds}`);
    console.log("========================================================\n");

  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    await mongoose.disconnect();
  }
};

if (require.main === module) {
  seedDatabase().then(() => process.exit(0));
}

module.exports = seedDatabase;
