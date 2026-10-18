// MediFlow AI - Realistic Hospital & Bed Simulation Dataset

export const ROLES = {
  ADMIN: {
    id: "admin",
    name: "Dr. Sarah Jenkins",
    title: "Chief Medical Operations Director",
    roleName: "Hospital Admin",
    badgeColor: "#3b82f6",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=160",
    dept: "Hospital Administration & Command Center",
    shift: "Day Shift (08:00 - 18:00)"
  },
  DOCTOR: {
    id: "doctor",
    name: "Dr. Robert Vance, MD",
    title: "Senior Intensivist & Chief Physician",
    roleName: "Attending Doctor",
    badgeColor: "#10b981",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=160",
    dept: "Intensive & Critical Care Unit",
    shift: "On-Call Trauma & ICU"
  },
  NURSE: {
    id: "nurse",
    name: "Priya Patel, RN, BSN",
    title: "Lead Charge Nurse",
    roleName: "Head Nurse",
    badgeColor: "#f59e0b",
    avatar: "https://images.unsplash.com/photo-1594824813689-f5298816c527?auto=format&fit=crop&q=80&w=160",
    dept: "Emergency & Inpatient Bed Coordination",
    shift: "Morning Shift (07:00 - 15:30)"
  },
  RECEPTIONIST: {
    id: "receptionist",
    name: "Alex Morgan",
    title: "Emergency Triage & Patient Admission Officer",
    roleName: "Admission Desk",
    badgeColor: "#8b5cf6",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=160",
    dept: "Central Patient Intake & Dispatch Desk",
    shift: "Rotational Day (06:00 - 14:00)"
  }
};

export const INITIAL_WARDS = [
  {
    id: "EMG",
    name: "Emergency & Trauma Center",
    code: "EMG",
    totalBeds: 30,
    occupiedBeds: 24,
    availableBeds: 4,
    cleaningBeds: 2,
    maintenanceBeds: 0,
    floor: "Ground Floor - Wing A",
    headDoctor: "Dr. Marcus Reed",
    chargeNurse: "Elena Gomez, RN",
    nurseToPatientRatio: "1:3",
    ventilatorCount: 6,
    specialty: "Critical Resuscitation & Acute Trauma",
    acuityLevel: "High (Level 1-2)",
    status: "Surge Warning (80% Cap)"
  },
  {
    id: "MICU",
    name: "Medical ICU (MICU)",
    code: "MICU",
    totalBeds: 20,
    occupiedBeds: 18,
    availableBeds: 1,
    cleaningBeds: 1,
    maintenanceBeds: 0,
    floor: "2nd Floor - Critical Wing",
    headDoctor: "Dr. Robert Vance",
    chargeNurse: "Priya Patel, RN",
    nurseToPatientRatio: "1:1",
    ventilatorCount: 16,
    specialty: "Severe Sepsis, ARDS, Multi-organ Failure",
    acuityLevel: "Critical (Level 1)",
    status: "Near Capacity (90%)"
  },
  {
    id: "SICU",
    name: "Surgical ICU (SICU)",
    code: "SICU",
    totalBeds: 20,
    occupiedBeds: 15,
    availableBeds: 4,
    cleaningBeds: 1,
    maintenanceBeds: 0,
    floor: "2nd Floor - Perioperative Wing",
    headDoctor: "Dr. Anita Desai",
    chargeNurse: "James Taylor, RN",
    nurseToPatientRatio: "1:1",
    ventilatorCount: 14,
    specialty: "Post-Cardiothoracic & Neurosurgery",
    acuityLevel: "Critical (Level 1)",
    status: "Optimal"
  },
  {
    id: "CCU",
    name: "Coronary Care Unit (CCU)",
    code: "CCU",
    totalBeds: 20,
    occupiedBeds: 17,
    availableBeds: 2,
    cleaningBeds: 1,
    maintenanceBeds: 0,
    floor: "3rd Floor - Cardiovascular Center",
    headDoctor: "Dr. Vikram Seth",
    chargeNurse: "Samantha Bell, RN",
    nurseToPatientRatio: "1:2",
    ventilatorCount: 8,
    specialty: "Acute MI, Arrhythmia, Heart Failure",
    acuityLevel: "High (Level 2)",
    status: "High Demand (85%)"
  },
  {
    id: "GMW-M",
    name: "General Medicine - Male",
    code: "GMW-M",
    totalBeds: 50,
    occupiedBeds: 44,
    availableBeds: 5,
    cleaningBeds: 1,
    maintenanceBeds: 0,
    floor: "4th Floor - East Wing",
    headDoctor: "Dr. Kevin Zhang",
    chargeNurse: "Rachel Green, RN",
    nurseToPatientRatio: "1:5",
    ventilatorCount: 0,
    specialty: "Subacute Internal Medicine & Observation",
    acuityLevel: "Moderate (Level 3-4)",
    status: "Stable (88%)"
  },
  {
    id: "GMW-F",
    name: "General Medicine - Female",
    code: "GMW-F",
    totalBeds: 50,
    occupiedBeds: 42,
    availableBeds: 6,
    cleaningBeds: 2,
    maintenanceBeds: 0,
    floor: "4th Floor - West Wing",
    headDoctor: "Dr. Linda Morales",
    chargeNurse: "Chloe Bennett, RN",
    nurseToPatientRatio: "1:5",
    ventilatorCount: 0,
    specialty: "Subacute Internal Medicine & Geriatrics",
    acuityLevel: "Moderate (Level 3-4)",
    status: "Stable (84%)"
  },
  {
    id: "PED",
    name: "Pediatric & Neonatal Care",
    code: "PED",
    totalBeds: 40,
    occupiedBeds: 28,
    availableBeds: 10,
    cleaningBeds: 2,
    maintenanceBeds: 0,
    floor: "3rd Floor - South Wing",
    headDoctor: "Dr. Maria Santos",
    chargeNurse: "David Kim, RN",
    nurseToPatientRatio: "1:3",
    ventilatorCount: 6,
    specialty: "Pediatric Inpatient & PICU Transition",
    acuityLevel: "Moderate (Level 2-4)",
    status: "Available (70%)"
  },
  {
    id: "IDI",
    name: "Infectious & Isolation Ward",
    code: "IDI",
    totalBeds: 30,
    occupiedBeds: 22,
    availableBeds: 6,
    cleaningBeds: 1,
    maintenanceBeds: 1,
    floor: "1st Floor - Negative Pressure Wing",
    headDoctor: "Dr. Jonathan Hayes",
    chargeNurse: "Angela Rossi, RN",
    nurseToPatientRatio: "1:3",
    ventilatorCount: 8,
    specialty: "Negative Pressure / Airborne Pathogens",
    acuityLevel: "High (Level 2-3)",
    status: "Controlled (73%)"
  },
  {
    id: "PSR",
    name: "Post-Surgical Step-Down",
    code: "PSR",
    totalBeds: 40,
    occupiedBeds: 34,
    availableBeds: 4,
    cleaningBeds: 2,
    maintenanceBeds: 0,
    floor: "5th Floor - Surgical Wing",
    headDoctor: "Dr. Douglas Cox",
    chargeNurse: "Lisa Wang, RN",
    nurseToPatientRatio: "1:4",
    ventilatorCount: 2,
    specialty: "Post-Op Recovery & Rehabilitation",
    acuityLevel: "Moderate (Level 3)",
    status: "Optimal (85%)"
  },
  {
    id: "MAT",
    name: "Maternity & Obstetric Ward",
    code: "MAT",
    totalBeds: 50,
    occupiedBeds: 42,
    availableBeds: 6,
    cleaningBeds: 2,
    maintenanceBeds: 0,
    floor: "6th Floor - Mother & Baby Pavilion",
    headDoctor: "Dr. Beatrice Vance",
    chargeNurse: "Hannah Abbott, RN",
    nurseToPatientRatio: "1:4",
    ventilatorCount: 2,
    specialty: "Labor, Delivery & Postnatal Care",
    acuityLevel: "Stable (Level 3-4)",
    status: "Stable (84%)"
  }
];

export const INITIAL_BEDS = [
  // Emergency Beds
  { id: "EMG-01", wardId: "EMG", wardName: "Emergency & Trauma", bedNumber: "01", status: "occupied", patientId: "PT-901", equipment: ["Cardiac Monitor", "O2 Line", "Defibrillator Ready"], floor: "Ground Floor", nurse: "Elena Gomez", lastCleaned: "Today, 06:30 AM" },
  { id: "EMG-02", wardId: "EMG", wardName: "Emergency & Trauma", bedNumber: "02", status: "occupied", patientId: "PT-902", equipment: ["Cardiac Monitor", "O2 Line"], floor: "Ground Floor", nurse: "Elena Gomez", lastCleaned: "Today, 07:15 AM" },
  { id: "EMG-03", wardId: "EMG", wardName: "Emergency & Trauma", bedNumber: "03", status: "available", patientId: null, equipment: ["Ventilator Ready", "Cardiac Monitor", "Crash Cart"], floor: "Ground Floor", nurse: "Mark Adams", lastCleaned: "Today, 10:00 AM" },
  { id: "EMG-04", wardId: "EMG", wardName: "Emergency & Trauma", bedNumber: "04", status: "occupied", patientId: "PT-903", equipment: ["Cardiac Monitor", "IV Pump"], floor: "Ground Floor", nurse: "Mark Adams", lastCleaned: "Yesterday, 11:00 PM" },
  { id: "EMG-05", wardId: "EMG", wardName: "Emergency & Trauma", bedNumber: "05", status: "cleaning", patientId: null, equipment: ["Standard O2", "Cardiac Monitor"], floor: "Ground Floor", nurse: "Elena Gomez", lastCleaned: "In Progress (30m ETA)" },
  { id: "EMG-06", wardId: "EMG", wardName: "Emergency & Trauma", bedNumber: "06", status: "available", patientId: null, equipment: ["Trauma Bay", "Ventilator Ready", "Monitor"], floor: "Ground Floor", nurse: "Mark Adams", lastCleaned: "Today, 08:30 AM" },
  { id: "EMG-07", wardId: "EMG", wardName: "Emergency & Trauma", bedNumber: "07", status: "occupied", patientId: "PT-904", equipment: ["Cardiac Monitor", "High-flow O2"], floor: "Ground Floor", nurse: "Sarah Miller", lastCleaned: "Today, 04:00 AM" },
  { id: "EMG-08", wardId: "EMG", wardName: "Emergency & Trauma", bedNumber: "08", status: "available", patientId: null, equipment: ["Cardiac Monitor"], floor: "Ground Floor", nurse: "Sarah Miller", lastCleaned: "Today, 09:15 AM" },

  // MICU Beds
  { id: "MICU-01", wardId: "MICU", wardName: "Medical ICU", bedNumber: "01", status: "occupied", patientId: "PT-101", equipment: ["Invasive Ventilator", "Arterial Line Monitor", "Dialysis Ready", "Infusion Pumps"], floor: "2nd Floor", nurse: "Priya Patel", lastCleaned: "Today, 05:00 AM" },
  { id: "MICU-02", wardId: "MICU", wardName: "Medical ICU", bedNumber: "02", status: "occupied", patientId: "PT-102", equipment: ["Invasive Ventilator", "Cardiac Monitor", "ECMO Port"], floor: "2nd Floor", nurse: "Priya Patel", lastCleaned: "Today, 06:00 AM" },
  { id: "MICU-03", wardId: "MICU", wardName: "Medical ICU", bedNumber: "03", status: "occupied", patientId: "PT-103", equipment: ["Invasive Ventilator", "Cardiac Monitor", "Infusion Pumps"], floor: "2nd Floor", nurse: "Lucas Roy", lastCleaned: "Yesterday, 08:00 PM" },
  { id: "MICU-04", wardId: "MICU", wardName: "Medical ICU", bedNumber: "04", status: "available", patientId: null, equipment: ["Invasive Ventilator", "Multipara Monitor", "Dialysis Ready"], floor: "2nd Floor", nurse: "Lucas Roy", lastCleaned: "Today, 09:00 AM" },
  { id: "MICU-05", wardId: "MICU", wardName: "Medical ICU", bedNumber: "05", status: "cleaning", patientId: null, equipment: ["Invasive Ventilator", "Cardiac Monitor"], floor: "2nd Floor", nurse: "Priya Patel", lastCleaned: "Disinfected (UV Curing)" },
  { id: "MICU-06", wardId: "MICU", wardName: "Medical ICU", bedNumber: "06", status: "occupied", patientId: "PT-104", equipment: ["BiPAP", "Arterial Line Monitor"], floor: "2nd Floor", nurse: "Lucas Roy", lastCleaned: "Yesterday, 10:00 PM" },

  // SICU Beds
  { id: "SICU-01", wardId: "SICU", wardName: "Surgical ICU", bedNumber: "01", status: "occupied", patientId: "PT-201", equipment: ["Post-Op Ventilator", "ICP Monitor", "Infusion Arrays"], floor: "2nd Floor", nurse: "James Taylor", lastCleaned: "Today, 07:00 AM" },
  { id: "SICU-02", wardId: "SICU", wardName: "Surgical ICU", bedNumber: "02", status: "available", patientId: null, equipment: ["Ventilator", "Cardiac Monitor", "Warm Air Blower"], floor: "2nd Floor", nurse: "James Taylor", lastCleaned: "Today, 08:45 AM" },
  { id: "SICU-03", wardId: "SICU", wardName: "Surgical ICU", bedNumber: "03", status: "occupied", patientId: "PT-202", equipment: ["Ventilator", "Cardio-respiratory Monitor"], floor: "2nd Floor", nurse: "Jessica Wong", lastCleaned: "Today, 06:15 AM" },
  { id: "SICU-04", wardId: "SICU", wardName: "Surgical ICU", bedNumber: "04", status: "available", patientId: null, equipment: ["Ventilator Ready", "Telemetry"], floor: "2nd Floor", nurse: "Jessica Wong", lastCleaned: "Today, 10:15 AM" },

  // CCU Beds
  { id: "CCU-01", wardId: "CCU", wardName: "Coronary Care Unit", bedNumber: "01", status: "occupied", patientId: "PT-301", equipment: ["12-Lead Continuous Telemetry", "IABP Port", "O2 Line"], floor: "3rd Floor", nurse: "Samantha Bell", lastCleaned: "Today, 07:30 AM" },
  { id: "CCU-02", wardId: "CCU", wardName: "Coronary Care Unit", bedNumber: "02", status: "occupied", patientId: "PT-302", equipment: ["Continuous Cardiac Telemetry", "Defibrillator Sync"], floor: "3rd Floor", nurse: "Samantha Bell", lastCleaned: "Today, 08:00 AM" },
  { id: "CCU-03", wardId: "CCU", wardName: "Coronary Care Unit", bedNumber: "03", status: "available", patientId: null, equipment: ["Cardiac Telemetry", "High-Flow O2", "Pacemaker Interface"], floor: "3rd Floor", nurse: "Samantha Bell", lastCleaned: "Today, 09:40 AM" },
  { id: "CCU-04", wardId: "CCU", wardName: "Coronary Care Unit", bedNumber: "04", status: "occupied", patientId: "PT-303", equipment: ["Telemetry", "IV Infusion Pump"], floor: "3rd Floor", nurse: "Brian Scott", lastCleaned: "Yesterday, 09:00 PM" },

  // General Medicine Male
  { id: "GMW-M01", wardId: "GMW-M", wardName: "General Medicine - Male", bedNumber: "01", status: "occupied", patientId: "PT-401", equipment: ["Standard Oxygen", "Nurse Call System", "Vital Sign Cart"], floor: "4th Floor", nurse: "Rachel Green", lastCleaned: "Today, 08:00 AM" },
  { id: "GMW-M02", wardId: "GMW-M", wardName: "General Medicine - Male", bedNumber: "02", status: "occupied", patientId: "PT-402", equipment: ["Standard Oxygen", "IV Pole"], floor: "4th Floor", nurse: "Rachel Green", lastCleaned: "Today, 08:15 AM" },
  { id: "GMW-M03", wardId: "GMW-M", wardName: "General Medicine - Male", bedNumber: "03", status: "available", patientId: null, equipment: ["Standard Oxygen", "Electric Recliner"], floor: "4th Floor", nurse: "Rachel Green", lastCleaned: "Today, 10:30 AM" },
  { id: "GMW-M04", wardId: "GMW-M", wardName: "General Medicine - Male", bedNumber: "04", status: "available", patientId: null, equipment: ["Standard Oxygen", "Nurse Call"], floor: "4th Floor", nurse: "Daniel Cho", lastCleaned: "Today, 09:00 AM" },
  { id: "GMW-M05", wardId: "GMW-M", wardName: "General Medicine - Male", bedNumber: "05", status: "occupied", patientId: "PT-403", equipment: ["Oxygen Concentrator", "IV Pump"], floor: "4th Floor", nurse: "Daniel Cho", lastCleaned: "Yesterday, 07:00 PM" },
  { id: "GMW-M06", wardId: "GMW-M", wardName: "General Medicine - Male", bedNumber: "06", status: "maintenance", patientId: null, equipment: ["Bed Motor Repair Required"], floor: "4th Floor", nurse: "Facility Eng.", lastCleaned: "Service Ticket #M-882" },

  // General Medicine Female
  { id: "GMW-F01", wardId: "GMW-F", wardName: "General Medicine - Female", bedNumber: "01", status: "occupied", patientId: "PT-501", equipment: ["Standard Oxygen", "IV Pole", "Cardiac Telemetry"], floor: "4th Floor", nurse: "Chloe Bennett", lastCleaned: "Today, 08:00 AM" },
  { id: "GMW-F02", wardId: "GMW-F", wardName: "General Medicine - Female", bedNumber: "02", status: "available", patientId: null, equipment: ["Standard Oxygen", "Nurse Call"], floor: "4th Floor", nurse: "Chloe Bennett", lastCleaned: "Today, 10:00 AM" },
  { id: "GMW-F03", wardId: "GMW-F", wardName: "General Medicine - Female", bedNumber: "03", status: "occupied", patientId: "PT-502", equipment: ["Standard Oxygen", "IV Pump"], floor: "4th Floor", nurse: "Chloe Bennett", lastCleaned: "Today, 07:00 AM" },
  { id: "GMW-F04", wardId: "GMW-F", wardName: "General Medicine - Female", bedNumber: "04", status: "available", patientId: null, equipment: ["Standard Oxygen", "Nurse Call"], floor: "4th Floor", nurse: "Chloe Bennett", lastCleaned: "Today, 09:30 AM" },

  // Isolation & Infectious
  { id: "IDI-01", wardId: "IDI", wardName: "Isolation & Infectious", bedNumber: "01", status: "occupied", patientId: "PT-601", equipment: ["HEPA Filtration", "Negative Pressure Gauge", "Dedicated Ventilator"], floor: "1st Floor", nurse: "Angela Rossi", lastCleaned: "Today, 06:00 AM" },
  { id: "IDI-02", wardId: "IDI", wardName: "Isolation & Infectious", bedNumber: "02", status: "isolation", patientId: "PT-602", equipment: ["Negative Pressure Suite", "Airborne Protocol"], floor: "1st Floor", nurse: "Angela Rossi", lastCleaned: "Today, 06:45 AM" },
  { id: "IDI-03", wardId: "IDI", wardName: "Isolation & Infectious", bedNumber: "03", status: "available", patientId: null, equipment: ["Negative Pressure Unit", "BiPAP Ready", "Touchless Intercom"], floor: "1st Floor", nurse: "Angela Rossi", lastCleaned: "Today, 10:00 AM" },
  { id: "IDI-04", wardId: "IDI", wardName: "Isolation & Infectious", bedNumber: "04", status: "cleaning", patientId: null, equipment: ["Negative Pressure Unit", "O2 Port"], floor: "1st Floor", nurse: "Angela Rossi", lastCleaned: "Chemical Vapor Decon" },

  // Pediatrics
  { id: "PED-01", wardId: "PED", wardName: "Pediatric Care", bedNumber: "01", status: "occupied", patientId: "PT-701", equipment: ["Pediatric Pulse Oximeter", "Child Friendly Enclosure", "Parent Sleeper"], floor: "3rd Floor", nurse: "David Kim", lastCleaned: "Today, 08:30 AM" },
  { id: "PED-02", wardId: "PED", wardName: "Pediatric Care", bedNumber: "02", status: "available", patientId: null, equipment: ["Pediatric Monitor", "Infant Warmer Ready"], floor: "3rd Floor", nurse: "David Kim", lastCleaned: "Today, 09:00 AM" },
  { id: "PED-03", wardId: "PED", wardName: "Pediatric Care", bedNumber: "03", status: "occupied", patientId: "PT-702", equipment: ["Oxygen Tent Ready", "IV Infusion"], floor: "3rd Floor", nurse: "David Kim", lastCleaned: "Today, 07:00 AM" },

  // Post-Surgical Step-Down
  { id: "PSR-01", wardId: "PSR", wardName: "Post-Surgical Step-Down", bedNumber: "01", status: "occupied", patientId: "PT-801", equipment: ["Surgical Drain Suction", "PCA Pump", "Telemetry"], floor: "5th Floor", nurse: "Lisa Wang", lastCleaned: "Today, 08:00 AM" },
  { id: "PSR-02", wardId: "PSR", wardName: "Post-Surgical Step-Down", bedNumber: "02", status: "available", patientId: null, equipment: ["Standard O2", "PCA Pump Port", "Recliner"], floor: "5th Floor", nurse: "Lisa Wang", lastCleaned: "Today, 10:15 AM" }
];

export const INITIAL_PATIENTS = [
  {
    id: "PT-101",
    mrn: "MRN-2026-9041",
    name: "Arthur Pendelton",
    age: 68,
    gender: "Male",
    wardId: "MICU",
    bedId: "MICU-01",
    acuity: "Critical (Level 1)",
    acuityScore: 1,
    diagnosis: "Severe Acute Sepsis & Refractory Septic Shock",
    admitDate: "2026-08-14 04:30",
    estimatedDischarge: "2026-08-22",
    doctor: "Dr. Robert Vance",
    oxygenReq: "Invasive Mechanical Ventilation (FiO2 65%)",
    infectionRisk: "Contact Precautions (MRSA Positive)",
    vitals: { hr: 118, bp: "88/54", spo2: "92%", temp: "38.9°C", rr: 28 },
    notes: "Vasopressor support ongoing. Arterial line in right radial. Step-down forecast in 72 hours."
  },
  {
    id: "PT-102",
    mrn: "MRN-2026-8812",
    name: "Eleanor Crawford",
    age: 74,
    gender: "Female",
    wardId: "MICU",
    bedId: "MICU-02",
    acuity: "Critical (Level 1)",
    acuityScore: 1,
    diagnosis: "ARDS secondary to Viral Pneumonia",
    admitDate: "2026-08-15 11:15",
    estimatedDischarge: "2026-08-20",
    doctor: "Dr. Robert Vance",
    oxygenReq: "Mechanical Ventilation (Prone Protocol)",
    infectionRisk: "Droplet & Contact Precautions",
    vitals: { hr: 94, bp: "112/68", spo2: "94%", temp: "37.8°C", rr: 22 },
    notes: "Patient responds well to prone positioning. Paralytic weaned."
  },
  {
    id: "PT-103",
    mrn: "MRN-2026-7734",
    name: "Marcus Vance Jr.",
    age: 52,
    gender: "Male",
    wardId: "MICU",
    bedId: "MICU-03",
    acuity: "Critical (Level 1)",
    acuityScore: 1,
    diagnosis: "Diabetic Ketoacidosis with Acute Kidney Injury",
    admitDate: "2026-08-16 02:40",
    estimatedDischarge: "2026-08-19",
    doctor: "Dr. Robert Vance",
    oxygenReq: "High-Flow Nasal Cannula (30L/min)",
    infectionRisk: "Standard Precautions",
    vitals: { hr: 106, bp: "102/64", spo2: "96%", temp: "37.1°C", rr: 24 },
    notes: "Continuous insulin infusion. Anion gap closing. Renal parameters improving."
  },
  {
    id: "PT-104",
    mrn: "MRN-2026-6521",
    name: "Harold Jensen",
    age: 63,
    gender: "Male",
    wardId: "MICU",
    bedId: "MICU-06",
    acuity: "Severe (Level 2)",
    acuityScore: 2,
    diagnosis: "Acute Exacerbation of Severe COPD",
    admitDate: "2026-08-15 16:20",
    estimatedDischarge: "2026-08-18",
    doctor: "Dr. Robert Vance",
    oxygenReq: "Non-Invasive BiPAP (IPAP 14 / EPAP 6)",
    infectionRisk: "Standard Precautions",
    vitals: { hr: 88, bp: "135/82", spo2: "91%", temp: "36.9°C", rr: 20 },
    notes: "Ready for transition to General Ward once ABG stabilizes."
  },
  {
    id: "PT-201",
    mrn: "MRN-2026-5590",
    name: "Derrick Henderson",
    age: 59,
    gender: "Male",
    wardId: "SICU",
    bedId: "SICU-01",
    acuity: "Critical (Level 1)",
    acuityScore: 1,
    diagnosis: "Post-Emergency CABG x 4 (Coronary Bypass)",
    admitDate: "2026-08-16 01:10",
    estimatedDischarge: "2026-08-21",
    doctor: "Dr. Anita Desai",
    oxygenReq: "Post-Op Ventilator (FiO2 45%)",
    infectionRisk: "Strict Aseptic Surgical Protocol",
    vitals: { hr: 84, bp: "118/72", spo2: "99%", temp: "36.8°C", rr: 16 },
    notes: "Hemodynamically stable on low dose norepinephrine. Extubation planned for 14:00."
  },
  {
    id: "PT-202",
    mrn: "MRN-2026-4431",
    name: "Clara Oswald",
    age: 44,
    gender: "Female",
    wardId: "SICU",
    bedId: "SICU-03",
    acuity: "Severe (Level 2)",
    acuityScore: 2,
    diagnosis: "Post-Craniotomy for Subdural Hematoma Evacuation",
    admitDate: "2026-08-15 19:45",
    estimatedDischarge: "2026-08-22",
    doctor: "Dr. Anita Desai",
    oxygenReq: "Nasal Cannula 3 L/min",
    infectionRisk: "Standard Precautions",
    vitals: { hr: 76, bp: "128/78", spo2: "98%", temp: "37.0°C", rr: 16 },
    notes: "GCS 14. Pupils equal and reactive. ICP < 12 mmHg."
  },
  {
    id: "PT-301",
    mrn: "MRN-2026-3399",
    name: "Victor Stone",
    age: 61,
    gender: "Male",
    wardId: "CCU",
    bedId: "CCU-01",
    acuity: "Severe (Level 2)",
    acuityScore: 2,
    diagnosis: "Acute Anterior STEMI post-Primary PCI (Stent)",
    admitDate: "2026-08-16 03:15",
    estimatedDischarge: "2026-08-19",
    doctor: "Dr. Vikram Seth",
    oxygenReq: "Nasal Cannula 2 L/min",
    infectionRisk: "Standard Precautions",
    vitals: { hr: 72, bp: "116/74", spo2: "97%", temp: "36.7°C", rr: 18 },
    notes: "TIMI 3 flow restored. Monitored for reperfusion arrhythmias."
  },
  {
    id: "PT-302",
    mrn: "MRN-2026-2281",
    name: "Grace Hopper",
    age: 79,
    gender: "Female",
    wardId: "CCU",
    bedId: "CCU-02",
    acuity: "Severe (Level 2)",
    acuityScore: 2,
    diagnosis: "Acute Decompensated Heart Failure (NYHA IV)",
    admitDate: "2026-08-15 08:20",
    estimatedDischarge: "2026-08-18",
    doctor: "Dr. Vikram Seth",
    oxygenReq: "High-flow O2 6 L/min",
    infectionRisk: "Standard Precautions",
    vitals: { hr: 86, bp: "138/88", spo2: "95%", temp: "36.6°C", rr: 20 },
    notes: "IV furosemide diuresis responding well. Transfer to GMW-F planned for tomorrow."
  },
  {
    id: "PT-303",
    mrn: "MRN-2026-1144",
    name: "Samuel Brody",
    age: 56,
    gender: "Male",
    wardId: "CCU",
    bedId: "CCU-04",
    acuity: "Moderate (Level 3)",
    acuityScore: 3,
    diagnosis: "Atrial Fibrillation with Rapid Ventricular Response",
    admitDate: "2026-08-16 06:10",
    estimatedDischarge: "2026-08-18",
    doctor: "Dr. Vikram Seth",
    oxygenReq: "Room Air",
    infectionRisk: "Standard Precautions",
    vitals: { hr: 98, bp: "124/80", spo2: "98%", temp: "36.8°C", rr: 16 },
    notes: "Rate controlled on Diltiazem drip. Anticoagulation initiated."
  },
  {
    id: "PT-401",
    mrn: "MRN-2026-1002",
    name: "George Wilson",
    age: 72,
    gender: "Male",
    wardId: "GMW-M",
    bedId: "GMW-M01",
    acuity: "Moderate (Level 3)",
    acuityScore: 3,
    diagnosis: "Community Acquired Pneumonia & Dehydration",
    admitDate: "2026-08-14 14:00",
    estimatedDischarge: "2026-08-17",
    doctor: "Dr. Kevin Zhang",
    oxygenReq: "Nasal Cannula 2 L/min",
    infectionRisk: "Standard Precautions",
    vitals: { hr: 78, bp: "122/76", spo2: "96%", temp: "37.2°C", rr: 18 },
    notes: "IV antibiotics Day 3. Afebrile for 24 hours. Discharge planned tomorrow."
  },
  {
    id: "PT-402",
    mrn: "MRN-2026-1005",
    name: "Benjamin Hayes",
    age: 50,
    gender: "Male",
    wardId: "GMW-M",
    bedId: "GMW-M02",
    acuity: "Moderate (Level 3)",
    acuityScore: 3,
    diagnosis: "Acute Pancreatitis (Mild)",
    admitDate: "2026-08-15 17:30",
    estimatedDischarge: "2026-08-19",
    doctor: "Dr. Kevin Zhang",
    oxygenReq: "Room Air",
    infectionRisk: "Standard Precautions",
    vitals: { hr: 82, bp: "128/84", spo2: "98%", temp: "37.0°C", rr: 16 },
    notes: "Pain controlled. Oral liquids tolerated. Lipase trending down."
  },
  {
    id: "PT-501",
    mrn: "MRN-2026-2001",
    name: "Margaret Thatcher",
    age: 81,
    gender: "Female",
    wardId: "GMW-F",
    bedId: "GMW-F01",
    acuity: "Moderate (Level 3)",
    acuityScore: 3,
    diagnosis: "Complicated Urinary Tract Infection & Mild Delirium",
    admitDate: "2026-08-14 18:20",
    estimatedDischarge: "2026-08-18",
    doctor: "Dr. Linda Morales",
    oxygenReq: "Room Air",
    infectionRisk: "Standard Precautions",
    vitals: { hr: 74, bp: "130/80", spo2: "97%", temp: "36.8°C", rr: 16 },
    notes: "Mentation restored. Ambulating with physical therapist."
  },
  {
    id: "PT-601",
    mrn: "MRN-2026-6001",
    name: "Lucas Thorne",
    age: 38,
    gender: "Male",
    wardId: "IDI",
    bedId: "IDI-01",
    acuity: "Severe (Level 2)",
    acuityScore: 2,
    diagnosis: "Cavitary Pulmonary Tuberculosis",
    admitDate: "2026-08-13 12:00",
    estimatedDischarge: "2026-08-25",
    doctor: "Dr. Jonathan Hayes",
    oxygenReq: "Nasal Cannula 3 L/min",
    infectionRisk: "Airborne Isolation (Negative Pressure Required)",
    vitals: { hr: 88, bp: "118/76", spo2: "95%", temp: "37.6°C", rr: 20 },
    notes: "Quadruple therapy initiated. Sputum AFB positive. Strictly negative pressure."
  },
  {
    id: "PT-701",
    mrn: "MRN-2026-7001",
    name: "Liam O'Connor",
    age: 6,
    gender: "Male",
    wardId: "PED",
    bedId: "PED-01",
    acuity: "Moderate (Level 3)",
    acuityScore: 3,
    diagnosis: "Acute Bronchiolitis with Mild Respiratory Distress",
    admitDate: "2026-08-15 20:10",
    estimatedDischarge: "2026-08-18",
    doctor: "Dr. Maria Santos",
    oxygenReq: "Low-Flow Oxygen 1 L/min",
    infectionRisk: "RSV Positive (Contact Isolation)",
    vitals: { hr: 110, bp: "95/60", spo2: "96%", temp: "37.9°C", rr: 30 },
    notes: "Hydration maintained. Retractions reduced. Mother rooming-in."
  },
  {
    id: "PT-901",
    mrn: "MRN-2026-9001",
    name: "Raymond Sterling",
    age: 49,
    gender: "Male",
    wardId: "EMG",
    bedId: "EMG-01",
    acuity: "Critical (Level 1)",
    acuityScore: 1,
    diagnosis: "Multiple Blunt Trauma (MVA) with Hemothorax",
    admitDate: "2026-08-16 07:15",
    estimatedDischarge: "Transfer Pending",
    doctor: "Dr. Marcus Reed",
    oxygenReq: "Non-Rebreather Mask (15 L/min)",
    infectionRisk: "Standard Precautions",
    vitals: { hr: 122, bp: "92/58", spo2: "93%", temp: "36.4°C", rr: 26 },
    notes: "Chest tube placed. Fast CT completed. Pending immediate SICU bed transfer."
  }
];

export const INITIAL_TRANSFERS = [
  {
    id: "TRF-1001",
    patientId: "PT-901",
    patientName: "Raymond Sterling",
    age: 49,
    sourceWardId: "EMG",
    sourceWardName: "Emergency & Trauma",
    sourceBedId: "EMG-01",
    targetWardId: "SICU",
    targetWardName: "Surgical ICU",
    targetBedId: "SICU-02",
    priority: "CRITICAL",
    priorityColor: "#ef4444",
    clinicalReason: "Post-Trauma stabilization; requires surgical ICU continuous hemodynamic monitoring.",
    requestedBy: "Dr. Marcus Reed (Trauma)",
    approvedBy: "Dr. Anita Desai (SICU Chief)",
    requestTime: "Today, 08:20 AM",
    status: "Approved - Bed Reserved",
    etaMinutes: 15,
    aiCompatibilityScore: 98,
    aiRecommendationReason: "Direct match for Surgical Trauma protocol and high invasive monitoring requirement."
  },
  {
    id: "TRF-1002",
    patientId: "PT-302",
    patientName: "Grace Hopper",
    age: 79,
    sourceWardId: "CCU",
    sourceWardName: "Coronary Care Unit",
    sourceBedId: "CCU-02",
    targetWardId: "GMW-F",
    targetWardName: "General Medicine - Female",
    targetBedId: "GMW-F02",
    priority: "ROUTINE",
    priorityColor: "#10b981",
    clinicalReason: "Acute Heart Failure resolved, transitioning to step-down oral diuretic maintenance.",
    requestedBy: "Dr. Vikram Seth (Cardiology)",
    approvedBy: "Pending Ward Nurse Acknowledgment",
    requestTime: "Today, 09:10 AM",
    status: "Awaiting Transport Dispatch",
    etaMinutes: 45,
    aiCompatibilityScore: 95,
    aiRecommendationReason: "Frees high-demand CCU cardiac bed while ensuring female geriatric nursing supervision."
  },
  {
    id: "TRF-1003",
    patientId: "PT-104",
    patientName: "Harold Jensen",
    age: 63,
    sourceWardId: "MICU",
    sourceWardName: "Medical ICU",
    sourceBedId: "MICU-06",
    targetWardId: "GMW-M",
    targetWardName: "General Medicine - Male",
    targetBedId: "GMW-M03",
    priority: "URGENT",
    priorityColor: "#f59e0b",
    clinicalReason: "COPD exacerbation stabilized off BiPAP. Step-down to standard room air observation.",
    requestedBy: "Dr. Robert Vance (MICU)",
    approvedBy: "Dr. Kevin Zhang",
    requestTime: "Today, 07:45 AM",
    status: "In Transit",
    etaMinutes: 5,
    aiCompatibilityScore: 94,
    aiRecommendationReason: "Unlocks critical MICU bed #06 before anticipated afternoon emergency surge."
  }
];

export const AI_FORECAST_TIMELINE = [
  { time: "08:00", actualOccupancy: 86, predictedOccupancy: 86, upperCI: 88, lowerCI: 84, predictedAdmissions: 4, predictedDischarges: 2, surgeRisk: "Moderate" },
  { time: "10:00", actualOccupancy: 87, predictedOccupancy: 87, upperCI: 89, lowerCI: 85, predictedAdmissions: 6, predictedDischarges: 5, surgeRisk: "Moderate" },
  { time: "12:00", actualOccupancy: 88, predictedOccupancy: 88, upperCI: 91, lowerCI: 86, predictedAdmissions: 9, predictedDischarges: 4, surgeRisk: "High" },
  { time: "14:00", actualOccupancy: null, predictedOccupancy: 91, upperCI: 94, lowerCI: 88, predictedAdmissions: 11, predictedDischarges: 7, surgeRisk: "Critical" },
  { time: "16:00", actualOccupancy: null, predictedOccupancy: 93, upperCI: 96, lowerCI: 90, predictedAdmissions: 14, predictedDischarges: 6, surgeRisk: "Critical" },
  { time: "18:00", actualOccupancy: null, predictedOccupancy: 90, upperCI: 93, lowerCI: 87, predictedAdmissions: 8, predictedDischarges: 9, surgeRisk: "High" },
  { time: "20:00", actualOccupancy: null, predictedOccupancy: 88, upperCI: 91, lowerCI: 85, predictedAdmissions: 5, predictedDischarges: 3, surgeRisk: "Moderate" },
  { time: "22:00", actualOccupancy: null, predictedOccupancy: 87, upperCI: 90, lowerCI: 84, predictedAdmissions: 3, predictedDischarges: 1, surgeRisk: "Low" },
  { time: "02:00", actualOccupancy: null, predictedOccupancy: 86, upperCI: 89, lowerCI: 83, predictedAdmissions: 2, predictedDischarges: 0, surgeRisk: "Low" },
  { time: "06:00", actualOccupancy: null, predictedOccupancy: 85, upperCI: 88, lowerCI: 82, predictedAdmissions: 3, predictedDischarges: 1, surgeRisk: "Low" }
];

export const SEVEN_DAY_FORECAST = [
  { day: "Mon", projectedOccupancy: 88, icuLoad: 92, surgeIndex: "Elevated", weatherFactor: "Heatwave Alert (+15% Cardiac)", status: "Manageable" },
  { day: "Tue", projectedOccupancy: 91, icuLoad: 95, surgeIndex: "Critical Surge", weatherFactor: "High Humidity & AQI Spike", status: "ICU Buffer Required" },
  { day: "Wed", projectedOccupancy: 89, icuLoad: 90, surgeIndex: "Elevated", weatherFactor: "Normal", status: "Optimal" },
  { day: "Thu", projectedOccupancy: 86, icuLoad: 85, surgeIndex: "Normal", weatherFactor: "Normal", status: "Optimal" },
  { day: "Fri", projectedOccupancy: 93, icuLoad: 96, surgeIndex: "High Weekend Intake", weatherFactor: "Weekend Trauma Surge", status: "Activate Reserve Beds" },
  { day: "Sat", projectedOccupancy: 94, icuLoad: 97, surgeIndex: "Severe Weekend Load", weatherFactor: "Emergency Spike", status: "Code Amber" },
  { day: "Sun", projectedOccupancy: 90, icuLoad: 89, surgeIndex: "Declining", weatherFactor: "Normal", status: "Stabilizing" }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: "NOTIF-01",
    type: "critical",
    title: "Critical ICU Capacity Warning",
    message: "Medical ICU (MICU) is at 90% capacity (only 1 bed available). 3 incoming step-down transfers recommended to prevent bottleneck.",
    time: "4 mins ago",
    unread: true,
    actionUrl: "/smart-allocation",
    actionLabel: "Smart Allocate"
  },
  {
    id: "NOTIF-02",
    type: "transfer",
    title: "Inter-Ward Transfer Approved",
    message: "Patient Raymond Sterling approved for transfer from EMG-01 to SICU-02 by Dr. Anita Desai.",
    time: "12 mins ago",
    unread: true,
    actionUrl: "/inter-ward-transfer",
    actionLabel: "View Transfer"
  },
  {
    id: "NOTIF-03",
    type: "ai_insight",
    title: "AI Forecast Surge Alert (14:00 - 18:00)",
    message: "Predictive engine forecasts +14 admissions due to acute respiratory intake. Recommended action: Accelerate 4 pending discharges in GMW-M.",
    time: "25 mins ago",
    unread: true,
    actionUrl: "/capacity-forecasting",
    actionLabel: "View Forecast"
  },
  {
    id: "NOTIF-04",
    type: "cleaning",
    title: "Bed Turnover Complete",
    message: "Bed #MICU-04 has completed chemical terminal cleaning and UV sterilization. Status set to AVAILABLE.",
    time: "42 mins ago",
    unread: false,
    actionUrl: "/bed-management",
    actionLabel: "Bed Registry"
  },
  {
    id: "NOTIF-05",
    type: "system",
    title: "Hospital Bed Optimization Engine Active",
    message: "Real-time Multi-Criteria Decision Algorithm operating at 99.4% allocation precision.",
    time: "1 hour ago",
    unread: false,
    actionUrl: "/settings",
    actionLabel: "AI Settings"
  }
];

export const RECENT_ACTIVITIES = [
  { id: "ACT-1", user: "Dr. Marcus Reed", action: "Requested Critical Transfer", detail: "Pt. Raymond Sterling -> SICU-02", time: "10 mins ago", icon: "ArrowRightLeft" },
  { id: "ACT-2", user: "AI Engine", action: "Smart Bed Matched", detail: "Bed #MICU-04 matched for incoming trauma (Score: 97%)", time: "18 mins ago", icon: "Brain" },
  { id: "ACT-3", user: "Priya Patel, RN", action: "Bed Turnover Completed", detail: "Bed #MICU-04 marked Available", time: "30 mins ago", icon: "Sparkles" },
  { id: "ACT-4", user: "Dr. Robert Vance", action: "Discharge Authorization", detail: "Pt. George Wilson scheduled for tomorrow", time: "45 mins ago", icon: "CheckCircle2" },
  { id: "ACT-5", user: "Alex Morgan", action: "New Admission Intake", detail: "Pt. Arthur Pendelton assigned to MICU-01", time: "1 hour ago", icon: "UserPlus" }
];

// ============================================================
// EXTENDED HOSPITAL MANAGEMENT DATA
// ============================================================

export const DOCTORS = [
  { id: "DR-001", name: "Dr. Robert Vance, MD", specialty: "Intensive Care & Critical Medicine", dept: "MICU", qualification: "MD, FCCP, FACP", experience: "18 years", patientsAssigned: 12, status: "On Duty", shift: "Day (08:00-20:00)", phone: "+1 (555) 301-1120", email: "r.vance@mediflow.hospital", roomNo: "ICU Block C, Room 201", consultFee: "$350" },
  { id: "DR-002", name: "Dr. Marcus Reed, MD", specialty: "Emergency Medicine & Trauma", dept: "Emergency", qualification: "MD, FAAEM", experience: "14 years", patientsAssigned: 9, status: "On Duty", shift: "Day (08:00-20:00)", phone: "+1 (555) 301-2240", email: "m.reed@mediflow.hospital", roomNo: "Emergency Wing A, Room 105", consultFee: "$280" },
  { id: "DR-003", name: "Dr. Anita Desai, MD", specialty: "Surgical ICU & Cardiothoracic Surgery", dept: "SICU", qualification: "MD, FRCS", experience: "22 years", patientsAssigned: 7, status: "In Surgery", shift: "Day (07:00-19:00)", phone: "+1 (555) 301-3360", email: "a.desai@mediflow.hospital", roomNo: "Surgical Block B, Room 310", consultFee: "$450" },
  { id: "DR-004", name: "Dr. Beatrice Vance, OB", specialty: "Obstetrics & Maternal Fetal Medicine", dept: "Maternity", qualification: "MD, FACOG", experience: "16 years", patientsAssigned: 5, status: "On Duty", shift: "Day (08:00-18:00)", phone: "+1 (555) 301-4480", email: "b.vance@mediflow.hospital", roomNo: "Maternity Wing D, Room 402", consultFee: "$320" },
  { id: "DR-005", name: "Dr. Kevin Zhang, MD", specialty: "Internal Medicine & Pulmonology", dept: "General Medicine", qualification: "MD, FCCP", experience: "12 years", patientsAssigned: 14, status: "On Duty", shift: "Day (09:00-17:00)", phone: "+1 (555) 301-5500", email: "k.zhang@mediflow.hospital", roomNo: "Medical Block A, Room 118", consultFee: "$220" },
  { id: "DR-006", name: "Dr. Priscilla Osei, MD", specialty: "Pediatrics & Neonatology", dept: "Pediatrics", qualification: "MD, FAAP", experience: "10 years", patientsAssigned: 11, status: "Off Duty", shift: "Night (20:00-08:00)", phone: "+1 (555) 301-6620", email: "p.osei@mediflow.hospital", roomNo: "Pediatric Wing E, Room 501", consultFee: "$250" },
  { id: "DR-007", name: "Dr. Harold Stone, MD", specialty: "Infectious Disease & Epidemiology", dept: "Isolation Unit", qualification: "MD, FIDSA", experience: "20 years", patientsAssigned: 4, status: "On Duty", shift: "Day (08:00-16:00)", phone: "+1 (555) 301-7740", email: "h.stone@mediflow.hospital", roomNo: "Isolation Block F, Room 601", consultFee: "$380" }
];

export const STAFF = [
  { id: "NRS-001", name: "Priya Patel, RN, BSN", role: "Head Nurse", dept: "MICU", shift: "Morning (07:00-15:30)", phone: "+1 (555) 401-1100", status: "On Duty", patientsAssigned: 6, nurseToPatient: "1:2", yearsExp: 9 },
  { id: "NRS-002", name: "Elena Gomez, RN", role: "Senior Nurse", dept: "Emergency", shift: "Day (08:00-16:00)", phone: "+1 (555) 401-2200", status: "On Duty", patientsAssigned: 8, nurseToPatient: "1:3", yearsExp: 7 },
  { id: "NRS-003", name: "James Taylor, RN", role: "Charge Nurse", dept: "SICU", shift: "Day (08:00-20:00)", phone: "+1 (555) 401-3300", status: "On Duty", patientsAssigned: 5, nurseToPatient: "1:1", yearsExp: 11 },
  { id: "NRS-004", name: "Angela Kim, RN, MSN", role: "Clinical Nurse Specialist", dept: "General Medicine", shift: "Afternoon (14:00-22:00)", phone: "+1 (555) 401-4400", status: "On Duty", patientsAssigned: 9, nurseToPatient: "1:4", yearsExp: 13 },
  { id: "NRS-005", name: "Thomas Walsh, RN", role: "Staff Nurse", dept: "Pediatrics", shift: "Night (22:00-06:00)", phone: "+1 (555) 401-5500", status: "Off Duty", patientsAssigned: 0, nurseToPatient: "1:3", yearsExp: 5 },
  { id: "NRS-006", name: "Maria Santos, LPN", role: "Licensed Practical Nurse", dept: "Maternity", shift: "Morning (07:00-15:30)", phone: "+1 (555) 401-6600", status: "On Duty", patientsAssigned: 4, nurseToPatient: "1:2", yearsExp: 6 },
  { id: "ADM-001", name: "Alex Morgan", role: "Admission Officer", dept: "Front Desk", shift: "Rotational Day (06:00-14:00)", phone: "+1 (555) 501-1100", status: "On Duty", patientsAssigned: 0, nurseToPatient: "—", yearsExp: 4 },
  { id: "PHM-001", name: "Clara Johnson, PharmD", role: "Chief Pharmacist", dept: "Pharmacy", shift: "Day (08:00-18:00)", phone: "+1 (555) 601-1100", status: "On Duty", patientsAssigned: 0, nurseToPatient: "—", yearsExp: 8 }
];

export const APPOINTMENTS = [
  { id: "APT-1001", patientName: "Margaret Fletcher", patientMRN: "MRN-2026-5521", age: 58, doctor: "Dr. Kevin Zhang, MD", dept: "Internal Medicine", date: "2026-08-18", time: "09:00 AM", type: "Follow-Up", status: "Confirmed", reason: "Chronic hypertension management & ECHO review", room: "OPD Room 112" },
  { id: "APT-1002", patientName: "Victor Harlow", patientMRN: "MRN-2026-3348", age: 44, doctor: "Dr. Robert Vance, MD", dept: "Critical Care", date: "2026-08-18", time: "10:30 AM", type: "Consultation", status: "In Progress", reason: "ICU step-down discharge planning & weaning assessment", room: "MICU Room 201" },
  { id: "APT-1003", patientName: "Cynthia Moore", patientMRN: "MRN-2026-7712", age: 32, doctor: "Dr. Beatrice Vance, OB", dept: "Obstetrics", date: "2026-08-18", time: "11:15 AM", type: "Prenatal", status: "Confirmed", reason: "Third trimester OB check & growth ultrasound", room: "OB Clinic Room 402" },
  { id: "APT-1004", patientName: "Raymond Sterling", patientMRN: "MRN-2026-1194", age: 71, doctor: "Dr. Marcus Reed, MD", dept: "Emergency", date: "2026-08-18", time: "12:00 PM", type: "Emergency", status: "Completed", reason: "Acute MI follow-up stabilization", room: "Emergency Bay 3" },
  { id: "APT-1005", patientName: "Elena Brightwood", patientMRN: "MRN-2026-8842", age: 26, doctor: "Dr. Priscilla Osei, MD", dept: "Pediatrics", date: "2026-08-18", time: "14:00 PM", type: "Vaccination", status: "Pending", reason: "Booster immunization follow-up & wellness exam", room: "Pediatric Clinic Room 504" },
  { id: "APT-1006", patientName: "George Wilson", patientMRN: "MRN-2026-2200", age: 72, doctor: "Dr. Kevin Zhang, MD", dept: "General Medicine", date: "2026-08-18", time: "15:30 PM", type: "Discharge Planning", status: "Confirmed", reason: "CAP recovery & pre-discharge assessment", room: "GMW Room 318" },
  { id: "APT-1007", patientName: "Diana Prince", patientMRN: "MRN-2026-9901", age: 38, doctor: "Dr. Harold Stone, MD", dept: "Infectious Disease", date: "2026-08-19", time: "09:00 AM", type: "Consultation", status: "Scheduled", reason: "TB treatment follow-up & sputum culture review", room: "IDI Clinic Room 601" }
];

export const MEDICAL_RECORDS = [
  {
    id: "MR-001", patientName: "Arthur Pendelton", patientMRN: "MRN-2026-1001", age: 68, gender: "Male",
    diagnosis: "Severe Sepsis with ARDS", admitDate: "2026-08-14", doctor: "Dr. Robert Vance, MD",
    vitals: { bp: "88/58 mmHg", hr: 112, spo2: "91%", temp: "38.7°C", rr: 28 },
    allergies: ["Penicillin", "Sulfa Drugs"], bloodGroup: "O+",
    medications: ["Norepinephrine 0.25mcg/kg/min IV", "Vancomycin 1g q12h IV", "Piperacillin-Tazobactam 4.5g q6h IV", "Methylprednisolone 60mg q8h IV"],
    notes: "Mechanically ventilated. Prone positioning initiated. Follow-up CT chest pending.",
    labPending: 3, wardId: "MICU"
  },
  {
    id: "MR-002", patientName: "Victor Stone", patientMRN: "MRN-2026-1002", age: 61, gender: "Male",
    diagnosis: "Acute Anterior STEMI post-Primary PCI", admitDate: "2026-08-15", doctor: "Dr. Marcus Reed, MD",
    vitals: { bp: "106/70 mmHg", hr: 78, spo2: "97%", temp: "37.1°C", rr: 18 },
    allergies: ["Contrast Dye (documented)"], bloodGroup: "A+",
    medications: ["Aspirin 81mg OD", "Clopidogrel 75mg OD", "Atorvastatin 80mg HS", "Metoprolol 25mg BID", "Heparin 5000 IU q8h SC"],
    notes: "Post-PCI day 3. Hemodynamically stable. Cardiac rehab consult initiated.",
    labPending: 1, wardId: "CCU"
  },
  {
    id: "MR-003", patientName: "George Wilson", patientMRN: "MRN-2026-2200", age: 72, gender: "Male",
    diagnosis: "Community Acquired Pneumonia & Moderate Dehydration", admitDate: "2026-08-12", doctor: "Dr. Kevin Zhang, MD",
    vitals: { bp: "128/82 mmHg", hr: 86, spo2: "95%", temp: "37.4°C", rr: 20 },
    allergies: ["None Known"], bloodGroup: "B+",
    medications: ["Amoxicillin-Clavulanate 875mg BID PO", "Azithromycin 500mg OD PO", "NS 100mL/hr IV"],
    notes: "Improving. Discharge planned for tomorrow pending final CXR clearance.",
    labPending: 0, wardId: "GMW-M"
  }
];

export const PRESCRIPTIONS = [
  { id: "RX-5001", patientName: "Arthur Pendelton", patientMRN: "MRN-2026-1001", doctor: "Dr. Robert Vance", date: "2026-08-18", drug: "Vancomycin 1g IV", route: "Intravenous", frequency: "Every 12 hours", duration: "7 days", status: "Dispensed", priority: "STAT" },
  { id: "RX-5002", patientName: "Arthur Pendelton", patientMRN: "MRN-2026-1001", doctor: "Dr. Robert Vance", date: "2026-08-18", drug: "Norepinephrine 4mg/250mL NS", route: "IV Infusion", frequency: "Continuous (titrate to MAP >65)", duration: "Ongoing", status: "Active", priority: "STAT" },
  { id: "RX-5003", patientName: "Victor Stone", patientMRN: "MRN-2026-1002", doctor: "Dr. Marcus Reed", date: "2026-08-17", drug: "Aspirin 81mg Tab", route: "Oral", frequency: "Once daily", duration: "Indefinite", status: "Dispensed", priority: "Routine" },
  { id: "RX-5004", patientName: "Victor Stone", patientMRN: "MRN-2026-1002", doctor: "Dr. Marcus Reed", date: "2026-08-17", drug: "Atorvastatin 80mg Cap", route: "Oral", frequency: "Once at bedtime", duration: "90 days", status: "Dispensed", priority: "Routine" },
  { id: "RX-5005", patientName: "George Wilson", patientMRN: "MRN-2026-2200", doctor: "Dr. Kevin Zhang", date: "2026-08-16", drug: "Amoxicillin-Clavulanate 875mg Tab", route: "Oral", frequency: "Twice daily", duration: "7 days", status: "Dispensed", priority: "Routine" },
  { id: "RX-5006", patientName: "Diana Prince", patientMRN: "MRN-2026-9901", doctor: "Dr. Harold Stone", date: "2026-08-17", drug: "Isoniazid 300mg Tab", route: "Oral", frequency: "Once daily", duration: "6 months", status: "Pending", priority: "Routine" }
];

export const LAB_TESTS = [
  { id: "LAB-4001", patientName: "Arthur Pendelton", patientMRN: "MRN-2026-1001", doctor: "Dr. Robert Vance", test: "Blood Culture (Aerobic & Anaerobic)", specimen: "Blood", requestDate: "2026-08-17 06:00", status: "Pending Report", priority: "STAT", result: null, resultDate: null },
  { id: "LAB-4002", patientName: "Arthur Pendelton", patientMRN: "MRN-2026-1001", doctor: "Dr. Robert Vance", test: "ABG (Arterial Blood Gas)", specimen: "Arterial Blood", requestDate: "2026-08-18 07:30", status: "Result Available", priority: "STAT", result: "pH 7.28 / pO2 62 / pCO2 50 / HCO3 18 — Metabolic & Respiratory Acidosis", resultDate: "2026-08-18 08:00" },
  { id: "LAB-4003", patientName: "Victor Stone", patientMRN: "MRN-2026-1002", doctor: "Dr. Marcus Reed", test: "Troponin-I (High Sensitivity)", specimen: "Blood", requestDate: "2026-08-17 18:00", status: "Result Available", priority: "STAT", result: "Troponin-I: 12,800 ng/L (Markedly Elevated — Acute MI Pattern)", resultDate: "2026-08-17 18:45" },
  { id: "LAB-4004", patientName: "Victor Stone", patientMRN: "MRN-2026-1002", doctor: "Dr. Marcus Reed", test: "Echocardiogram (Bedside TTE)", specimen: "Cardiac", requestDate: "2026-08-18 10:00", status: "Scheduled", priority: "Urgent", result: null, resultDate: null },
  { id: "LAB-4005", patientName: "George Wilson", patientMRN: "MRN-2026-2200", doctor: "Dr. Kevin Zhang", test: "Chest X-Ray (PA View)", specimen: "Radiology", requestDate: "2026-08-18 07:00", status: "Result Available", priority: "Routine", result: "Bilateral lower zone infiltrates improving. No pleural effusion. Improvement from baseline.", resultDate: "2026-08-18 09:00" },
  { id: "LAB-4006", patientName: "Diana Prince", patientMRN: "MRN-2026-9901", doctor: "Dr. Harold Stone", test: "Sputum AFB Smear & Culture", specimen: "Sputum", requestDate: "2026-08-17 09:00", status: "Pending Report", priority: "Urgent", result: null, resultDate: null }
];

export const PHARMACY_INVENTORY = [
  { id: "PHM-001", name: "Vancomycin 1g Injection", category: "Antibiotic", stock: 42, unit: "Vials", minStock: 20, expiryDate: "2027-03-01", supplier: "MedLine Pharma", status: "In Stock", price: 85 },
  { id: "PHM-002", name: "Norepinephrine 4mg/4mL", category: "Vasopressor", stock: 28, unit: "Ampoules", minStock: 15, expiryDate: "2027-01-15", supplier: "CritCare Pharma", status: "In Stock", price: 45 },
  { id: "PHM-003", name: "Piperacillin-Tazobactam 4.5g", category: "Antibiotic", stock: 8, unit: "Vials", minStock: 20, expiryDate: "2026-12-01", supplier: "MedLine Pharma", status: "Low Stock", price: 110 },
  { id: "PHM-004", name: "Aspirin 81mg Tablet", category: "Antiplatelet", stock: 500, unit: "Tablets", minStock: 100, expiryDate: "2028-06-01", supplier: "Generic Rx", status: "In Stock", price: 0.5 },
  { id: "PHM-005", name: "Atorvastatin 80mg Capsule", category: "Statin", stock: 240, unit: "Capsules", minStock: 60, expiryDate: "2027-09-01", supplier: "CardioPharm", status: "In Stock", price: 2.8 },
  { id: "PHM-006", name: "Morphine Sulfate 10mg/mL", category: "Opioid Analgesic", stock: 3, unit: "Vials", minStock: 10, expiryDate: "2026-10-01", supplier: "NarcoMed", status: "Critical Low", price: 32 },
  { id: "PHM-007", name: "Amoxicillin-Clavulanate 875mg", category: "Antibiotic", stock: 180, unit: "Tablets", minStock: 50, expiryDate: "2027-04-01", supplier: "Generic Rx", status: "In Stock", price: 3.5 },
  { id: "PHM-008", name: "Isoniazid 300mg Tablet", category: "Antitubercular", stock: 120, unit: "Tablets", minStock: 60, expiryDate: "2027-08-01", supplier: "TB MedCo", status: "In Stock", price: 1.2 }
];

export const BILLING_RECORDS = [
  { id: "BILL-7001", patientName: "Arthur Pendelton", patientMRN: "MRN-2026-1001", admitDate: "2026-08-14", ward: "MICU", roomCharges: 4200, labCharges: 1850, pharmaCharges: 3400, consultCharges: 1750, totalAmount: 11200, amountPaid: 5000, balance: 6200, status: "Partial Payment", insurance: "Blue Cross Gold", insuranceCoverage: 80 },
  { id: "BILL-7002", patientName: "Victor Stone", patientMRN: "MRN-2026-1002", admitDate: "2026-08-15", ward: "CCU", roomCharges: 1800, labCharges: 920, pharmaCharges: 780, consultCharges: 900, totalAmount: 4400, amountPaid: 4400, balance: 0, status: "Paid in Full", insurance: "Aetna Premier", insuranceCoverage: 100 },
  { id: "BILL-7003", patientName: "George Wilson", patientMRN: "MRN-2026-2200", admitDate: "2026-08-12", ward: "GMW-M", roomCharges: 1080, labCharges: 340, pharmaCharges: 210, consultCharges: 440, totalAmount: 2070, amountPaid: 0, balance: 2070, status: "Pending Payment", insurance: "Medicare", insuranceCoverage: 75 },
  { id: "BILL-7004", patientName: "Diana Prince", patientMRN: "MRN-2026-9901", admitDate: "2026-08-17", ward: "IDI", roomCharges: 600, labCharges: 280, pharmaCharges: 150, consultCharges: 380, totalAmount: 1410, amountPaid: 700, balance: 710, status: "Partial Payment", insurance: "Self Pay", insuranceCoverage: 0 }
];

export const EMERGENCY_PATIENTS = [
  { id: "EMG-901", name: "Henry Forsythe", age: 55, gender: "Male", chiefComplaint: "Sudden onset severe chest pain, diaphoresis, radiating to left arm", arrivalTime: "08:14 AM", triageLevel: 1, triageLabel: "Resuscitation", assignedDoctor: "Dr. Marcus Reed", assignedNurse: "Elena Gomez, RN", bedId: "EMG-01", status: "Active - Critical", vitals: { bp: "82/54", hr: 124, spo2: "88%", temp: "37.0°C" }, ecgNote: "ST elevation V1-V4 (STEMI Pattern)" },
  { id: "EMG-902", name: "Sandra Kowalski", age: 38, gender: "Female", chiefComplaint: "Road traffic accident, multiple lacerations and suspected rib fractures", arrivalTime: "09:47 AM", triageLevel: 2, triageLabel: "Emergent", assignedDoctor: "Dr. Marcus Reed", assignedNurse: "Elena Gomez, RN", bedId: "EMG-04", status: "Active - Urgent", vitals: { bp: "100/70", hr: 102, spo2: "94%", temp: "36.8°C" }, ecgNote: "Normal sinus rhythm" },
  { id: "EMG-903", name: "Liu Chang", age: 8, gender: "Male", chiefComplaint: "High fever 40.1°C, severe headache, neck stiffness, photophobia", arrivalTime: "10:22 AM", triageLevel: 1, triageLabel: "Resuscitation", assignedDoctor: "Dr. Priscilla Osei", assignedNurse: "Thomas Walsh, RN", bedId: "EMG-06", status: "Active - Critical", vitals: { bp: "90/60", hr: 148, spo2: "96%", temp: "40.1°C" }, ecgNote: "Suspected bacterial meningitis — LP ordered" }
];

export * from "./extendedHospitalData";


