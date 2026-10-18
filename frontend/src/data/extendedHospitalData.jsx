// Extended Hospital Management System Dataset
// Comprehensive mock data for all 22 operational sections + Complete People & Staff Information

// ============================================================
// 1. PATIENT STATISTICS & DIRECTORY
// ============================================================

export const HOSPITAL_PATIENT_STATS = {
  totalPatients: 1248,
  currentlyAdmitted: 186,
  todaysAdmissions: 24,
  todaysDischarges: 18,
  emergencyPatients: 7,
  criticalPatients: 4,
  underObservation: 16,
  awaitingAdmission: 5,
  awaitingDischarge: 8,
  outpatientsAvailable: 420
};

export const ADMITTED_PATIENTS_LIST = [
  {
    id: "PT-1001",
    name: "Arthur Pendelton",
    age: 68,
    gender: "Male",
    phone: "+1 (555) 234-9011",
    email: "a.pendelton@patient.care",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=160",
    department: "Critical Care (ICU)",
    ward: "Medical ICU (MICU)",
    bedNumber: "MICU-01",
    doctor: "Dr. Robert Vance, MD",
    admitDate: "2026-08-14",
    admitTime: "04:30 AM",
    condition: "Critical",
    priority: "Emergency",
    status: "Admitted",
    diagnosis: "Severe Acute Sepsis & Septic Shock",
    vitals: { hr: 118, bp: "88/54", spo2: "92%", temp: "38.9°C" }
  },
  {
    id: "PT-1002",
    name: "Eleanor Crawford",
    age: 74,
    gender: "Female",
    phone: "+1 (555) 234-9012",
    email: "e.crawford@patient.care",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=160",
    department: "Pulmonology & ICU",
    ward: "Medical ICU (MICU)",
    bedNumber: "MICU-02",
    doctor: "Dr. Robert Vance, MD",
    admitDate: "2026-08-15",
    admitTime: "11:15 AM",
    condition: "Critical",
    priority: "High",
    status: "Admitted",
    diagnosis: "ARDS secondary to Viral Pneumonia",
    vitals: { hr: 94, bp: "112/68", spo2: "94%", temp: "37.8°C" }
  },
  {
    id: "PT-1003",
    name: "Derrick Henderson",
    age: 59,
    gender: "Male",
    phone: "+1 (555) 234-9013",
    email: "d.henderson@patient.care",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=160",
    department: "Cardiothoracic Surgery",
    ward: "Surgical ICU (SICU)",
    bedNumber: "SICU-01",
    doctor: "Dr. Anita Desai, MD",
    admitDate: "2026-08-16",
    admitTime: "01:10 AM",
    condition: "Serious",
    priority: "High",
    status: "Admitted",
    diagnosis: "Post-Emergency CABG x 4",
    vitals: { hr: 84, bp: "118/72", spo2: "99%", temp: "36.8°C" }
  },
  {
    id: "PT-1004",
    name: "Victor Stone",
    age: 61,
    gender: "Male",
    phone: "+1 (555) 234-9014",
    email: "v.stone@patient.care",
    photo: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=160",
    department: "Cardiology",
    ward: "Coronary Care Unit (CCU)",
    bedNumber: "CCU-01",
    doctor: "Dr. Vikram Seth, MD",
    admitDate: "2026-08-15",
    admitTime: "06:40 PM",
    condition: "Serious",
    priority: "High",
    status: "Admitted",
    diagnosis: "Acute Anterior STEMI post-Primary PCI",
    vitals: { hr: 78, bp: "106/70", spo2: "97%", temp: "37.1°C" }
  },
  {
    id: "PT-1005",
    name: "Harold Jensen",
    age: 63,
    gender: "Male",
    phone: "+1 (555) 234-9015",
    email: "h.jensen@patient.care",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=160",
    department: "General Medicine",
    ward: "General Medicine - Male",
    bedNumber: "GMW-M01",
    doctor: "Dr. Kevin Zhang, MD",
    admitDate: "2026-08-15",
    admitTime: "04:20 PM",
    condition: "Improving",
    priority: "Medium",
    status: "Admitted",
    diagnosis: "Severe COPD Exacerbation",
    vitals: { hr: 88, bp: "135/82", spo2: "91%", temp: "36.9°C" }
  },
  {
    id: "PT-1006",
    name: "George Wilson",
    age: 72,
    gender: "Male",
    phone: "+1 (555) 234-9016",
    email: "g.wilson@patient.care",
    photo: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=160",
    department: "General Medicine",
    ward: "General Medicine - Male",
    bedNumber: "GMW-M02",
    doctor: "Dr. Kevin Zhang, MD",
    admitDate: "2026-08-12",
    admitTime: "09:10 AM",
    condition: "Stable",
    priority: "Low",
    status: "Awaiting Discharge",
    diagnosis: "Community Acquired Pneumonia",
    vitals: { hr: 86, bp: "128/82", spo2: "95%", temp: "37.4°C" }
  },
  {
    id: "PT-1007",
    name: "Margaret Fletcher",
    age: 58,
    gender: "Female",
    phone: "+1 (555) 234-9017",
    email: "m.fletcher@patient.care",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=160",
    department: "Internal Medicine",
    ward: "General Medicine - Female",
    bedNumber: "GMW-F01",
    doctor: "Dr. Linda Morales, MD",
    admitDate: "2026-08-16",
    admitTime: "08:30 AM",
    condition: "Under Observation",
    priority: "Medium",
    status: "Admitted",
    diagnosis: "Hypertensive Crisis & Renal Bruit",
    vitals: { hr: 92, bp: "155/96", spo2: "98%", temp: "36.7°C" }
  },
  {
    id: "PT-1008",
    name: "Clara Oswald",
    age: 44,
    gender: "Female",
    phone: "+1 (555) 234-9018",
    email: "c.oswald@patient.care",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=160",
    department: "Neurosurgery",
    ward: "Surgical ICU (SICU)",
    bedNumber: "SICU-03",
    doctor: "Dr. Anita Desai, MD",
    admitDate: "2026-08-15",
    admitTime: "07:45 PM",
    condition: "Serious",
    priority: "High",
    status: "Admitted",
    diagnosis: "Post-Craniotomy Subdural Evacuation",
    vitals: { hr: 76, bp: "122/78", spo2: "98%", temp: "37.0°C" }
  },
  {
    id: "PT-1009",
    name: "Henry Forsythe",
    age: 55,
    gender: "Male",
    phone: "+1 (555) 234-9019",
    email: "h.forsythe@patient.care",
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=160",
    department: "Emergency Medicine",
    ward: "Emergency & Trauma",
    bedNumber: "EMG-01",
    doctor: "Dr. Marcus Reed, MD",
    admitDate: "2026-08-18",
    admitTime: "08:14 AM",
    condition: "Critical",
    priority: "Emergency",
    status: "Admitted",
    diagnosis: "Acute Coronary Syndrome / STEMI",
    vitals: { hr: 124, bp: "82/54", spo2: "88%", temp: "37.0°C" }
  },
  {
    id: "PT-1010",
    name: "Sandra Kowalski",
    age: 38,
    gender: "Female",
    phone: "+1 (555) 234-9020",
    email: "s.kowalski@patient.care",
    photo: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=160",
    department: "Emergency Medicine",
    ward: "Emergency & Trauma",
    bedNumber: "EMG-04",
    doctor: "Dr. Marcus Reed, MD",
    admitDate: "2026-08-18",
    admitTime: "09:47 AM",
    condition: "Serious",
    priority: "High",
    status: "Admitted",
    diagnosis: "Polytrauma / Fractured Ribs",
    vitals: { hr: 102, bp: "100/70", spo2: "94%", temp: "36.8°C" }
  },
  {
    id: "PT-1011",
    name: "Liu Chang",
    age: 8,
    gender: "Male",
    phone: "+1 (555) 234-9021",
    email: "parent.chang@patient.care",
    photo: "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?auto=format&fit=crop&q=80&w=160",
    department: "Pediatrics",
    ward: "Pediatric Care",
    bedNumber: "PED-01",
    doctor: "Dr. Priscilla Osei, MD",
    admitDate: "2026-08-18",
    admitTime: "10:22 AM",
    condition: "Critical",
    priority: "Emergency",
    status: "Admitted",
    diagnosis: "Suspected Acute Meningitis",
    vitals: { hr: 148, bp: "90/60", spo2: "96%", temp: "40.1°C" }
  },
  {
    id: "PT-1012",
    name: "Cynthia Moore",
    age: 32,
    gender: "Female",
    phone: "+1 (555) 234-9022",
    email: "c.moore@patient.care",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=160",
    department: "Gynecology & Obstetrics",
    ward: "Maternity Ward",
    bedNumber: "MAT-01",
    doctor: "Dr. Beatrice Vance, OB",
    admitDate: "2026-08-17",
    admitTime: "02:15 PM",
    condition: "Stable",
    priority: "Medium",
    status: "Admitted",
    diagnosis: "Labor Stage 1 & Gestational Diabetes",
    vitals: { hr: 82, bp: "118/74", spo2: "99%", temp: "36.9°C" }
  }
];

export const TODAYS_ADMISSIONS = [
  { id: "ADM-201", patientId: "PT-1009", patientName: "Henry Forsythe", age: 55, department: "Emergency Medicine", doctor: "Dr. Marcus Reed", ward: "Emergency & Trauma", bed: "EMG-01", admissionTime: "08:14 AM", reason: "Acute STEMI with cardiogenic shock", priority: "Emergency", status: "Admitted" },
  { id: "ADM-202", patientId: "PT-1010", patientName: "Sandra Kowalski", age: 38, department: "Emergency Medicine", doctor: "Dr. Marcus Reed", ward: "Emergency & Trauma", bed: "EMG-04", admissionTime: "09:47 AM", reason: "MVA Polytrauma & hemothorax", priority: "High", status: "Admitted" },
  { id: "ADM-203", patientId: "PT-1011", patientName: "Liu Chang", age: 8, department: "Pediatrics", doctor: "Dr. Priscilla Osei", ward: "Pediatric Care", bed: "PED-01", admissionTime: "10:22 AM", reason: "Acute bacterial meningitis", priority: "Emergency", status: "Admitted" },
  { id: "ADM-204", patientId: "PT-1016", patientName: "Emily Watson", age: 29, department: "Gynecology & Obstetrics", doctor: "Dr. Beatrice Vance", ward: "Maternity Ward", bed: "MAT-03", admissionTime: "06:15 AM", reason: "Active Labor, 39 weeks gestation", priority: "Medium", status: "Admitted" },
  { id: "ADM-205", patientId: "PT-1017", patientName: "James O'Connor", age: 70, department: "Cardiology", doctor: "Dr. Vikram Seth", ward: "Coronary Care Unit", bed: "CCU-04", admissionTime: "07:30 AM", reason: "Decompensated Congestive Heart Failure", priority: "High", status: "Admitted" },
  { id: "ADM-206", patientId: "PT-1018", patientName: "Samantha Reed", age: 41, department: "General Surgery", doctor: "Dr. Anita Desai", ward: "Post-Surgical Step-Down", bed: "PSR-02", admissionTime: "08:50 AM", reason: "Laparoscopic Cholecystectomy post-op", priority: "Medium", status: "Admitted" }
];

export const TODAYS_DISCHARGES = [
  { id: "DIS-101", patientId: "PT-0980", patientName: "George Wilson", age: 72, ward: "General Medicine - Male", bed: "GMW-M02", doctor: "Dr. Kevin Zhang", admitDate: "2026-08-12", dischargeTime: "09:30 AM", dischargeReason: "Pneumonia fully resolved, stable vitals on oral therapy", status: "Discharged" },
  { id: "DIS-102", patientId: "PT-0981", patientName: "Maria Garcia", age: 48, ward: "General Medicine - Female", bed: "GMW-F02", doctor: "Dr. Linda Morales", admitDate: "2026-08-13", dischargeTime: "10:00 AM", dischargeReason: "Uncomplicated UTI successfully treated with IV Rocephin", status: "Discharged" },
  { id: "DIS-103", patientId: "PT-0982", patientName: "David Miller", age: 54, ward: "Post-Surgical Step-Down", bed: "PSR-01", doctor: "Dr. Douglas Cox", admitDate: "2026-08-14", dischargeTime: "10:45 AM", dischargeReason: "Post-Appendectomy Day 3, surgical site clean", status: "Discharged" },
  { id: "DIS-104", patientId: "PT-0983", patientName: "Hannah Abbott", age: 30, ward: "Maternity Ward", bed: "MAT-02", doctor: "Dr. Beatrice Vance", admitDate: "2026-08-15", dischargeTime: "11:15 AM", dischargeReason: "Normal spontaneous vaginal delivery, mother & infant stable", status: "Discharged" }
];

// ============================================================
// 2. DOCTORS (Complete information & list)
// ============================================================

export const DOCTOR_MANAGEMENT_STATS = {
  totalDoctors: 48,
  presentToday: 41,
  absentToday: 4,
  onLeave: 3,
  availableNow: 18,
  withPatients: 20,
  emergencyDuty: 3,
  offDuty: 7
};

export const DOCTORS_FULL_LIST = [
  {
    id: "DR-001",
    name: "Dr. Robert Vance, MD",
    photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=160",
    gender: "Male",
    age: 52,
    phone: "+1 (555) 301-1120",
    email: "r.vance@mediflow.hospital",
    specialization: "Intensive Care & Critical Medicine",
    department: "ICU & Critical Care",
    qualification: "MD, FCCP, FACP (Harvard Medical)",
    experience: "18 years",
    shift: "Day (08:00 - 18:00)",
    joiningDate: "2015-04-12",
    assignedWard: "Medical ICU (MICU)",
    assignedPatients: 8,
    todaysAppointments: 4,
    currentStatus: "Present",
    availability: "With Patients",
    emergencyDutyStatus: "On Standby",
    room: "ICU Suite 201"
  },
  {
    id: "DR-002",
    name: "Dr. Marcus Reed, MD",
    photo: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=160",
    gender: "Male",
    age: 46,
    phone: "+1 (555) 301-2240",
    email: "m.reed@mediflow.hospital",
    specialization: "Emergency Medicine & Acute Trauma",
    department: "Emergency Medicine",
    qualification: "MD, FAAEM (Johns Hopkins)",
    experience: "14 years",
    shift: "Rotational (08:00 - 20:00)",
    joiningDate: "2018-09-01",
    assignedWard: "Emergency & Trauma (EMG)",
    assignedPatients: 6,
    todaysAppointments: 12,
    currentStatus: "Present",
    availability: "Emergency Duty",
    emergencyDutyStatus: "Active Emergency Duty",
    room: "Trauma Bay A-1"
  },
  {
    id: "DR-003",
    name: "Dr. Anita Desai, MD",
    photo: "https://images.unsplash.com/photo-1594824813689-f5298816c527?auto=format&fit=crop&q=80&w=160",
    gender: "Female",
    age: 54,
    phone: "+1 (555) 301-3360",
    email: "a.desai@mediflow.hospital",
    specialization: "Surgical ICU & Cardiothoracic",
    department: "General Surgery",
    qualification: "MD, FRCS, FACS (Oxford / Stanford)",
    experience: "22 years",
    shift: "Day (07:00 - 19:00)",
    joiningDate: "2012-01-15",
    assignedWard: "Surgical ICU (SICU)",
    assignedPatients: 5,
    todaysAppointments: 3,
    currentStatus: "Present",
    availability: "Busy",
    emergencyDutyStatus: "On-Call Surgery",
    room: "Surgical Suite 310"
  },
  {
    id: "DR-004",
    name: "Dr. Beatrice Vance, OB",
    photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=160",
    gender: "Female",
    age: 48,
    phone: "+1 (555) 301-4480",
    email: "b.vance@mediflow.hospital",
    specialization: "Obstetrics & Maternal Fetal Medicine",
    department: "Gynecology & Obstetrics",
    qualification: "MD, FACOG (Columbia University)",
    experience: "16 years",
    shift: "Day (08:00 - 16:00)",
    joiningDate: "2016-07-20",
    assignedWard: "Maternity Ward (MAT)",
    assignedPatients: 4,
    todaysAppointments: 6,
    currentStatus: "Present",
    availability: "Available",
    emergencyDutyStatus: "Available for C-Section",
    room: "Maternity Suite 402"
  },
  {
    id: "DR-005",
    name: "Dr. Kevin Zhang, MD",
    photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=160",
    gender: "Male",
    age: 42,
    phone: "+1 (555) 301-5500",
    email: "k.zhang@mediflow.hospital",
    specialization: "Internal Medicine & Pulmonology",
    department: "General Medicine",
    qualification: "MD, FCCP (Yale School of Medicine)",
    experience: "12 years",
    shift: "Day (09:00 - 17:00)",
    joiningDate: "2019-03-10",
    assignedWard: "General Medicine - Male",
    assignedPatients: 11,
    todaysAppointments: 8,
    currentStatus: "Present",
    availability: "With Patients",
    emergencyDutyStatus: "No",
    room: "Med OPD 118"
  },
  {
    id: "DR-006",
    name: "Dr. Priscilla Osei, MD",
    photo: "https://images.unsplash.com/photo-1594824813689-f5298816c527?auto=format&fit=crop&q=80&w=160",
    gender: "Female",
    age: 39,
    phone: "+1 (555) 301-6620",
    email: "p.osei@mediflow.hospital",
    specialization: "Pediatrics & Neonatology",
    department: "Pediatrics",
    qualification: "MD, FAAP (McGill University)",
    experience: "10 years",
    shift: "Day (08:00 - 16:00)",
    joiningDate: "2020-08-01",
    assignedWard: "Pediatric Care Ward",
    assignedPatients: 7,
    todaysAppointments: 5,
    currentStatus: "Present",
    availability: "With Patients",
    emergencyDutyStatus: "Pediatric Trauma Ready",
    room: "Peds Wing 501"
  },
  {
    id: "DR-007",
    name: "Dr. Vikram Seth, MD",
    photo: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=160",
    gender: "Male",
    age: 51,
    phone: "+1 (555) 301-8810",
    email: "v.seth@mediflow.hospital",
    specialization: "Interventional Cardiology",
    department: "Cardiology",
    qualification: "MD, FACC, FSCAI",
    experience: "19 years",
    shift: "Day (08:00 - 18:00)",
    joiningDate: "2014-06-11",
    assignedWard: "Coronary Care Unit (CCU)",
    assignedPatients: 9,
    todaysAppointments: 4,
    currentStatus: "Present",
    availability: "With Patients",
    emergencyDutyStatus: "Cath Lab Primary",
    room: "Cath Lab Suite 305"
  },
  {
    id: "DR-008",
    name: "Dr. Alan Turing, MD",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=160",
    gender: "Male",
    age: 36,
    phone: "+1 (555) 301-1250",
    email: "a.turing@mediflow.hospital",
    specialization: "Emergency Traumatology",
    department: "Emergency Medicine",
    qualification: "MD, FAAEM",
    experience: "8 years",
    shift: "Night (20:00 - 08:00)",
    joiningDate: "2022-02-14",
    assignedWard: "Emergency & Trauma",
    assignedPatients: 0,
    todaysAppointments: 0,
    currentStatus: "Absent",
    availability: "Off Duty",
    emergencyDutyStatus: "Off Duty",
    room: "Trauma Bay A-2"
  },
  {
    id: "DR-009",
    name: "Dr. Rosalind Franklin, MD",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=160",
    gender: "Female",
    age: 47,
    phone: "+1 (555) 301-1360",
    email: "r.franklin@mediflow.hospital",
    specialization: "Clinical Oncology & Hematology",
    department: "General Medicine",
    qualification: "MD, PhD, FASCO",
    experience: "14 years",
    shift: "Day (09:00 - 17:00)",
    joiningDate: "2017-11-01",
    assignedWard: "General Medicine - Female",
    assignedPatients: 0,
    todaysAppointments: 0,
    currentStatus: "On Leave",
    availability: "On Leave",
    emergencyDutyStatus: "Not Available",
    room: "Oncology OPD 301"
  }
];

// ============================================================
// 3. NURSES (Complete information & list)
// ============================================================

export const NURSE_MANAGEMENT_STATS = {
  totalNurses: 82,
  presentToday: 74,
  absentToday: 5,
  onLeave: 3,
  onDuty: 61,
  available: 13,
  busy: 61,
  offDuty: 8
};

export const NURSES_FULL_LIST = [
  {
    id: "NRS-001",
    name: "Priya Patel, RN, BSN",
    photo: "https://images.unsplash.com/photo-1594824813689-f5298816c527?auto=format&fit=crop&q=80&w=160",
    gender: "Female",
    age: 34,
    phone: "+1 (555) 401-1100",
    email: "p.patel@mediflow.hospital",
    qualification: "BSN, CCRN (Critical Care Registered Nurse)",
    assignedDepartment: "ICU & Critical Care",
    assignedWard: "Medical ICU (MICU)",
    shift: "Morning (07:00 - 15:30)",
    assignedPatients: 2,
    joiningDate: "2017-05-18",
    currentStatus: "Present",
    availability: "On Duty",
    yearsExp: 9
  },
  {
    id: "NRS-002",
    name: "Elena Gomez, RN",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=160",
    gender: "Female",
    age: 31,
    phone: "+1 (555) 401-2200",
    email: "e.gomez@mediflow.hospital",
    qualification: "BSN, CEN (Certified Emergency Nurse)",
    assignedDepartment: "Emergency Medicine",
    assignedWard: "Emergency & Trauma",
    shift: "Day (08:00 - 16:00)",
    assignedPatients: 4,
    joiningDate: "2019-02-11",
    currentStatus: "Present",
    availability: "On Duty",
    yearsExp: 7
  },
  {
    id: "NRS-003",
    name: "James Taylor, RN",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=160",
    gender: "Male",
    age: 38,
    phone: "+1 (555) 401-3300",
    email: "j.taylor@mediflow.hospital",
    qualification: "MSN, RN, CNOR (Perioperative Nurse)",
    assignedDepartment: "General Surgery",
    assignedWard: "Surgical ICU (SICU)",
    shift: "Day (08:00 - 20:00)",
    assignedPatients: 2,
    joiningDate: "2015-08-25",
    currentStatus: "Present",
    availability: "On Duty",
    yearsExp: 11
  },
  {
    id: "NRS-004",
    name: "Samantha Bell, RN",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=160",
    gender: "Female",
    age: 32,
    phone: "+1 (555) 401-4410",
    email: "s.bell@mediflow.hospital",
    qualification: "BSN, PCCN (Progressive Care Certified)",
    assignedDepartment: "Cardiology",
    assignedWard: "Coronary Care Unit (CCU)",
    shift: "Morning (07:00 - 15:30)",
    assignedPatients: 3,
    joiningDate: "2018-10-05",
    currentStatus: "Present",
    availability: "On Duty",
    yearsExp: 8
  },
  {
    id: "NRS-005",
    name: "Mark Adams, RN",
    photo: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=160",
    gender: "Male",
    age: 28,
    phone: "+1 (555) 401-1180",
    email: "m.adams@mediflow.hospital",
    qualification: "BSN, RN",
    assignedDepartment: "Emergency Medicine",
    assignedWard: "Emergency & Trauma",
    shift: "Day (08:00 - 16:00)",
    assignedPatients: 0,
    joiningDate: "2022-01-10",
    currentStatus: "Present",
    availability: "Available",
    yearsExp: 4
  },
  {
    id: "NRS-006",
    name: "Sarah Miller, RN",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=160",
    gender: "Female",
    age: 33,
    phone: "+1 (555) 401-1410",
    email: "s.miller@mediflow.hospital",
    qualification: "BSN, RN",
    assignedDepartment: "Emergency Medicine",
    assignedWard: "Emergency & Trauma",
    shift: "Day (08:00 - 16:00)",
    assignedPatients: 0,
    joiningDate: "2020-04-15",
    currentStatus: "On Leave",
    availability: "On Leave",
    yearsExp: 6
  }
];

// ============================================================
// 4. RECEPTIONISTS
// ============================================================

export const RECEPTIONIST_STATS = {
  total: 12,
  present: 10,
  absent: 1,
  onLeave: 1,
  available: 4,
  onDuty: 6,
  offDuty: 2
};

export const RECEPTIONISTS_FULL_LIST = [
  {
    id: "REC-001",
    name: "Alex Morgan",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=160",
    gender: "Female",
    age: 29,
    phone: "+1 (555) 501-1100",
    email: "a.morgan@mediflow.hospital",
    assignedCounter: "Main Emergency Intake Desk",
    shift: "Morning (06:00 - 14:00)",
    joiningDate: "2021-06-15",
    currentStatus: "Present",
    availability: "On Duty"
  },
  {
    id: "REC-002",
    name: "Kelly Clarkson",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=160",
    gender: "Female",
    age: 34,
    phone: "+1 (555) 501-2200",
    email: "k.clarkson@mediflow.hospital",
    assignedCounter: "OPD Central Reception Counter 1",
    shift: "Day (08:00 - 16:00)",
    joiningDate: "2019-11-20",
    currentStatus: "Present",
    availability: "On Duty"
  },
  {
    id: "REC-003",
    name: "Darren Criss",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=160",
    gender: "Male",
    age: 27,
    phone: "+1 (555) 501-3300",
    email: "d.criss@mediflow.hospital",
    assignedCounter: "Inpatient Admission Counter 3",
    shift: "Day (08:00 - 16:00)",
    joiningDate: "2023-02-01",
    currentStatus: "Present",
    availability: "Available"
  },
  {
    id: "REC-004",
    name: "Zendaya Coleman",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=160",
    gender: "Female",
    age: 26,
    phone: "+1 (555) 501-4400",
    email: "z.coleman@mediflow.hospital",
    assignedCounter: "Maternity & Pediatric Registration",
    shift: "Day (08:00 - 16:00)",
    joiningDate: "2022-09-10",
    currentStatus: "Present",
    availability: "On Duty"
  },
  {
    id: "REC-005",
    name: "Trevor Noah",
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=160",
    gender: "Male",
    age: 35,
    phone: "+1 (555) 501-5500",
    email: "t.noah@mediflow.hospital",
    assignedCounter: "Discharge & Billing Helpdesk",
    shift: "Day (09:00 - 17:00)",
    joiningDate: "2020-03-12",
    currentStatus: "Present",
    availability: "Available"
  },
  {
    id: "REC-006",
    name: "Emma Watson",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=160",
    gender: "Female",
    age: 30,
    phone: "+1 (555) 501-6600",
    email: "e.watson@mediflow.hospital",
    assignedCounter: "Trauma Registration Desk 2",
    shift: "Night (22:00 - 06:00)",
    joiningDate: "2021-08-19",
    currentStatus: "On Leave",
    availability: "On Leave"
  }
];

// ============================================================
// 5. PHARMACISTS
// ============================================================

export const PHARMACIST_STATS = {
  total: 8,
  present: 7,
  absent: 0,
  onLeave: 1,
  available: 3,
  onDuty: 4,
  offDuty: 1
};

export const PHARMACISTS_FULL_LIST = [
  {
    id: "PHM-001",
    name: "Clara Johnson, PharmD",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=160",
    qualification: "PharmD, BCPS (Board Certified Pharmacotherapy)",
    phone: "+1 (555) 601-1100",
    email: "c.johnson@mediflow.hospital",
    department: "Central Inpatient Pharmacy",
    shift: "Day (08:00 - 18:00)",
    joiningDate: "2018-03-22",
    currentStatus: "Present",
    availability: "On Duty"
  },
  {
    id: "PHM-002",
    name: "Aaron Burr, RPh",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=160",
    qualification: "B.Pharm, Registered Pharmacist",
    phone: "+1 (555) 601-2200",
    email: "a.burr@mediflow.hospital",
    department: "Emergency Stat Dispensary",
    shift: "Day (08:00 - 16:00)",
    joiningDate: "2020-07-15",
    currentStatus: "Present",
    availability: "On Duty"
  },
  {
    id: "PHM-003",
    name: "Lin Manuel, RPh",
    photo: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=160",
    qualification: "PharmD, Sterile Compounding Specialist",
    phone: "+1 (555) 601-3300",
    email: "l.manuel@mediflow.hospital",
    department: "Chemotherapy & Compounding Lab",
    shift: "Day (09:00 - 17:00)",
    joiningDate: "2021-10-01",
    currentStatus: "Present",
    availability: "Available"
  },
  {
    id: "PHM-004",
    name: "Phillipa Soo, PharmD",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=160",
    qualification: "PharmD, BCCCP (Critical Care Pharmacist)",
    phone: "+1 (555) 601-4400",
    email: "p.soo@mediflow.hospital",
    department: "ICU Clinical Pharmacotherapy",
    shift: "Day (08:00 - 16:00)",
    joiningDate: "2019-05-11",
    currentStatus: "Present",
    availability: "On Duty"
  },
  {
    id: "PHM-005",
    name: "Leslie Odom, RPh",
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=160",
    qualification: "B.Pharm, RPh",
    phone: "+1 (555) 601-5500",
    email: "l.odom@mediflow.hospital",
    department: "Outpatient Dispensary Counter",
    shift: "Night (20:00 - 08:00)",
    joiningDate: "2022-04-05",
    currentStatus: "On Leave",
    availability: "On Leave"
  }
];

// ============================================================
// 6. LABORATORY TECHNICIANS
// ============================================================

export const LAB_TECH_STATS = {
  total: 10,
  present: 9,
  absent: 1,
  onLeave: 0,
  available: 3,
  onDuty: 6,
  offDuty: 1
};

export const LAB_TECHS_FULL_LIST = [
  {
    id: "LAB-001",
    name: "Gillian Anderson, MT",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=160",
    qualification: "BS Medical Technology, ASCP Certified",
    specialization: "Hematology & Blood Bank Transfusions",
    phone: "+1 (555) 701-1100",
    email: "g.anderson@mediflow.hospital",
    laboratorySection: "Hematology & Immunohematology",
    shift: "Day (07:00 - 15:30)",
    joiningDate: "2016-09-12",
    currentStatus: "Present",
    availability: "On Duty"
  },
  {
    id: "LAB-002",
    name: "David Duchovny, MT",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=160",
    qualification: "BS Clinical Biochemistry, ASCP",
    specialization: "Clinical Biochemistry & Toxicology",
    phone: "+1 (555) 701-2200",
    email: "d.duchovny@mediflow.hospital",
    laboratorySection: "Clinical Chemistry Lab",
    shift: "Day (08:00 - 16:00)",
    joiningDate: "2018-04-01",
    currentStatus: "Present",
    availability: "On Duty"
  },
  {
    id: "LAB-003",
    name: "Mitch Pileggi, MT",
    photo: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=160",
    qualification: "MS Microbiology, SM(ASCP)",
    specialization: "Microbiology & Infectious Serology",
    phone: "+1 (555) 701-3300",
    email: "m.pileggi@mediflow.hospital",
    laboratorySection: "Microbiology & Culture",
    shift: "Day (08:00 - 16:00)",
    joiningDate: "2015-11-20",
    currentStatus: "Present",
    availability: "Available"
  },
  {
    id: "LAB-004",
    name: "William B. Davis, MD",
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=160",
    qualification: "MD, Pathologist, FCAP",
    specialization: "Anatomic & Surgical Pathology",
    phone: "+1 (555) 701-4400",
    email: "w.davis@mediflow.hospital",
    laboratorySection: "Histopathology & Biopsy",
    shift: "Day (09:00 - 17:00)",
    joiningDate: "2012-08-15",
    currentStatus: "Present",
    availability: "On Duty"
  },
  {
    id: "LAB-005",
    name: "Nicholas Lea, MT",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=160",
    qualification: "BS Medical Technology",
    specialization: "Point-of-Care & Blood Gas Telemetry",
    phone: "+1 (555) 701-5500",
    email: "n.lea@mediflow.hospital",
    laboratorySection: "Emergency Stat Lab",
    shift: "Night (20:00 - 08:00)",
    joiningDate: "2023-01-10",
    currentStatus: "Absent",
    availability: "Off Duty"
  }
];

// ============================================================
// 7. RADIOLOGY STAFF
// ============================================================

export const RADIOLOGY_STAFF_STATS = {
  total: 8,
  present: 7,
  absent: 1,
  onLeave: 0,
  available: 2,
  onDuty: 5,
  offDuty: 1
};

export const RADIOLOGY_STAFF_FULL_LIST = [
  {
    id: "RAD-001",
    name: "Dr. Walter Bishop, MD",
    photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=160",
    qualification: "MD, Diagnostic Radiologist, ABR",
    specialization: "Neuro-radiology & 3T MRI",
    phone: "+1 (555) 801-1100",
    email: "w.bishop@mediflow.hospital",
    radiologySection: "MRI Suite 1 & CT Scan",
    shift: "Day (08:00 - 17:00)",
    currentStatus: "Present",
    availability: "On Duty"
  },
  {
    id: "RAD-002",
    name: "Olivia Dunham, RT(R)",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=160",
    qualification: "BSRT, ARRT (CT & MRI Certified)",
    specialization: "Multi-Slice CT & Angiography",
    phone: "+1 (555) 801-2200",
    email: "o.dunham@mediflow.hospital",
    radiologySection: "Emergency CT Trauma Suite",
    shift: "Day (08:00 - 16:00)",
    currentStatus: "Present",
    availability: "On Duty"
  },
  {
    id: "RAD-003",
    name: "Peter Bishop, RT(R)",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=160",
    qualification: "AAS Radiologic Tech, ARRT",
    specialization: "General Diagnostic Radiography & Fluoroscopy",
    phone: "+1 (555) 801-3300",
    email: "p.bishop@mediflow.hospital",
    radiologySection: "Main X-Ray & Orthopedic Imaging",
    shift: "Day (08:00 - 16:00)",
    currentStatus: "Present",
    availability: "Available"
  },
  {
    id: "RAD-004",
    name: "Astrid Farnsworth, RDMS",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=160",
    qualification: "RDMS (OB/GYN & Abdomen), ARDMS",
    specialization: "Vascular & Fetal Ultrasound",
    phone: "+1 (555) 801-4400",
    email: "a.farnsworth@mediflow.hospital",
    radiologySection: "Ultrasound & Sonography Suite",
    shift: "Day (08:30 - 16:30)",
    currentStatus: "Present",
    availability: "On Duty"
  },
  {
    id: "RAD-005",
    name: "Phillip Broyles, RT",
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=160",
    qualification: "RT(R)(MR), ARRT",
    specialization: "Emergency Night Imaging",
    phone: "+1 (555) 801-5500",
    email: "p.broyles@mediflow.hospital",
    radiologySection: "Emergency X-Ray / CT",
    shift: "Night (20:00 - 08:00)",
    currentStatus: "Absent",
    availability: "Off Duty"
  }
];

// ============================================================
// 8. ADMINISTRATIVE STAFF
// ============================================================

export const ADMIN_STAFF_STATS = {
  total: 9,
  present: 8,
  absent: 0,
  onLeave: 1,
  available: 3,
  onDuty: 5,
  offDuty: 1
};

export const ADMIN_STAFF_FULL_LIST = [
  {
    id: "ADM-101",
    name: "Dr. Sarah Jenkins",
    photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=160",
    designation: "Chief Medical Operations Director",
    department: "Hospital Administration & Command Center",
    phone: "+1 (555) 101-1100",
    email: "s.jenkins@mediflow.hospital",
    shift: "Day (08:00 - 18:00)",
    joiningDate: "2013-03-01",
    currentStatus: "Present",
    availability: "On Duty"
  },
  {
    id: "ADM-102",
    name: "Victoria Newman, MBA",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=160",
    designation: "Director of Clinical Quality & Safety",
    department: "Quality Assurance & Compliance",
    phone: "+1 (555) 101-2200",
    email: "v.newman@mediflow.hospital",
    shift: "Day (08:30 - 17:00)",
    joiningDate: "2017-09-15",
    currentStatus: "Present",
    availability: "Available"
  },
  {
    id: "ADM-103",
    name: "Michael Baldwin, JD",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=160",
    designation: "Hospital Legal Counsel & Risk Manager",
    department: "Legal & Regulatory Affairs",
    phone: "+1 (555) 101-3300",
    email: "m.baldwin@mediflow.hospital",
    shift: "Day (09:00 - 17:00)",
    joiningDate: "2016-04-10",
    currentStatus: "Present",
    availability: "On Duty"
  },
  {
    id: "ADM-104",
    name: "Phyllis Summers",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=160",
    designation: "Head of Human Resources & Credentialing",
    department: "Human Resources",
    phone: "+1 (555) 101-4400",
    email: "p.summers@mediflow.hospital",
    shift: "Day (08:00 - 16:30)",
    joiningDate: "2018-01-20",
    currentStatus: "On Leave",
    availability: "On Leave"
  }
];

// ============================================================
// 9. ACCOUNTING & BILLING STAFF
// ============================================================

export const BILLING_STAFF_STATS = {
  total: 7,
  present: 6,
  absent: 1,
  onLeave: 0,
  available: 2,
  onDuty: 4,
  offDuty: 1
};

export const BILLING_STAFF_FULL_LIST = [
  {
    id: "BIL-001",
    name: "Nicholas Newman, CPA",
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=160",
    designation: "Chief Financial Officer & Billing Head",
    department: "Hospital Finance & Revenue Cycle",
    phone: "+1 (555) 201-1100",
    email: "n.newman@mediflow.hospital",
    shift: "Day (08:00 - 17:00)",
    joiningDate: "2015-10-01",
    currentStatus: "Present",
    availability: "On Duty"
  },
  {
    id: "BIL-002",
    name: "Lily Winters, CPC",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=160",
    designation: "Senior Medical Insurance Auditor",
    department: "Insurance Claims & Prior Authorization",
    phone: "+1 (555) 201-2200",
    email: "l.winters@mediflow.hospital",
    shift: "Day (08:30 - 16:30)",
    joiningDate: "2019-06-18",
    currentStatus: "Present",
    availability: "On Duty"
  },
  {
    id: "BIL-003",
    name: "Devon Hamilton",
    photo: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=160",
    designation: "Inpatient Accounts & Settlement Officer",
    department: "Patient Billing Counter",
    phone: "+1 (555) 201-3300",
    email: "d.hamilton@mediflow.hospital",
    shift: "Day (08:00 - 16:00)",
    joiningDate: "2021-04-12",
    currentStatus: "Present",
    availability: "Available"
  }
];

// ============================================================
// 10. SUPPORT STAFF (Housekeeping, Security, Maintenance, Attendants, Drivers)
// ============================================================

export const SUPPORT_STAFF_STATS = {
  total: 15,
  present: 14,
  absent: 1,
  onLeave: 0,
  available: 5,
  onDuty: 9,
  offDuty: 1
};

export const SUPPORT_STAFF_FULL_LIST = [
  {
    id: "SUP-001",
    name: "Gary Oldman",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=160",
    role: "Head of Biohazard & Ward Sanitization",
    department: "Housekeeping & Environmental Services",
    assignedArea: "ICU, Operation Theatres & Isolation Suites",
    shift: "Morning (06:00 - 14:00)",
    phone: "+1 (555) 901-1100",
    joiningDate: "2016-02-10",
    currentStatus: "Present",
    availability: "On Duty"
  },
  {
    id: "SUP-002",
    name: "Keanu Reeves",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=160",
    role: "Senior Patient Transport Lead (Porter)",
    department: "Patient Logistics & Transport",
    assignedArea: "Emergency Bay & Diagnostic Radiology",
    shift: "Day (08:00 - 16:00)",
    phone: "+1 (555) 901-2200",
    joiningDate: "2018-07-19",
    currentStatus: "Present",
    availability: "On Duty"
  },
  {
    id: "SUP-003",
    name: "Carrie-Anne Moss",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=160",
    role: "Biomedical Systems & Ventilator Technician",
    department: "Hospital Facilities & Biomedical Engineering",
    assignedArea: "All Critical Care Wards",
    shift: "Day (08:00 - 16:00)",
    phone: "+1 (555) 901-3300",
    joiningDate: "2017-10-05",
    currentStatus: "Present",
    availability: "Available"
  },
  {
    id: "SUP-004",
    name: "Hugo Weaving",
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=160",
    role: "Hospital Security & Safety Supervisor",
    department: "Security & Access Control",
    assignedArea: "Main Gate, Emergency Triage & ICU Perimeter",
    shift: "Rotational (07:00 - 19:00)",
    phone: "+1 (555) 901-4400",
    joiningDate: "2015-05-14",
    currentStatus: "Present",
    availability: "On Duty"
  },
  {
    id: "SUP-005",
    name: "Laurence Fishburne",
    photo: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=160",
    role: "Chief Inpatient Dietitian & Food Services",
    department: "Dietary & Nutrition Services",
    assignedArea: "Inpatient Kitchen & Enteral Nutrition Lab",
    shift: "Day (06:00 - 14:00)",
    phone: "+1 (555) 901-5500",
    joiningDate: "2019-01-20",
    currentStatus: "Present",
    availability: "Available"
  },
  {
    id: "SUP-006",
    name: "Tom Hardy",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=160",
    role: "Emergency Ambulance Driver & EMT Pilot",
    department: "Emergency Fleet & Transport",
    assignedArea: "Ambulance Bay A-1",
    shift: "Day (08:00 - 20:00)",
    phone: "+1 (555) 901-6600",
    joiningDate: "2020-08-11",
    currentStatus: "Present",
    availability: "On Duty"
  }
];

// ============================================================
// 11. COMPLETE HOSPITAL WORKFORCE SUMMARY
// ============================================================

export const HOSPITAL_WORKFORCE_SUMMARY = {
  totalStaff: 199,
  totalPresent: 178,
  totalAbsent: 13,
  totalOnLeave: 8,
  totalOnDuty: 147,
  totalAvailable: 48,
  totalBusy: 104,
  totalOffDuty: 21,
  categories: {
    doctors: 48,
    nurses: 82,
    receptionists: 12,
    pharmacists: 8,
    labTechs: 10,
    radiologyStaff: 8,
    adminStaff: 9,
    billingStaff: 7,
    supportStaff: 15
  }
};

// ============================================================
// 12. STAFF ATTENDANCE OVERVIEW MATRIX
// ============================================================

export const STAFF_ATTENDANCE_OVERVIEW = [
  { category: "Doctors", total: 48, present: 41, absent: 4, onLeave: 3, onDuty: 23, available: 18, busy: 20, offDuty: 7 },
  { category: "Nurses", total: 82, present: 74, absent: 5, onLeave: 3, onDuty: 61, available: 13, busy: 61, offDuty: 8 },
  { category: "Receptionists", total: 12, present: 10, absent: 1, onLeave: 1, onDuty: 6, available: 4, busy: 6, offDuty: 2 },
  { category: "Pharmacists", total: 8, present: 7, absent: 0, onLeave: 1, onDuty: 4, available: 3, busy: 4, offDuty: 1 },
  { category: "Lab Technicians", total: 10, present: 9, absent: 1, onLeave: 0, onDuty: 6, available: 3, busy: 6, offDuty: 1 },
  { category: "Radiology Staff", total: 8, present: 7, absent: 1, onLeave: 0, onDuty: 5, available: 2, busy: 5, offDuty: 1 },
  { category: "Administrative", total: 9, present: 8, absent: 0, onLeave: 1, onDuty: 5, available: 3, busy: 5, offDuty: 1 },
  { category: "Billing Staff", total: 7, present: 6, absent: 1, onLeave: 0, onDuty: 4, available: 2, busy: 4, offDuty: 1 },
  { category: "Support Staff", total: 15, present: 14, absent: 1, onLeave: 0, onDuty: 9, available: 5, busy: 9, offDuty: 1 }
];

// Re-grouped other staff categories dictionary for dashboard tabs
export const OTHER_STAFF_CATEGORIES = {
  receptionists: {
    title: "Receptionists & Front Desk Staff",
    stats: RECEPTIONIST_STATS,
    list: RECEPTIONISTS_FULL_LIST
  },
  pharmacists: {
    title: "Hospital Pharmacists & Dispensary",
    stats: PHARMACIST_STATS,
    list: PHARMACISTS_FULL_LIST
  },
  labTechs: {
    title: "Laboratory Technicians & Pathologists",
    stats: LAB_TECH_STATS,
    list: LAB_TECHS_FULL_LIST
  },
  radiology: {
    title: "Radiology & Imaging Technologists",
    stats: RADIOLOGY_STAFF_STATS,
    list: RADIOLOGY_STAFF_FULL_LIST
  },
  admin: {
    title: "Administrative & Executive Staff",
    stats: ADMIN_STAFF_STATS,
    list: ADMIN_STAFF_FULL_LIST
  },
  billing: {
    title: "Accounting & Billing Staff",
    stats: BILLING_STAFF_STATS,
    list: BILLING_STAFF_FULL_LIST
  },
  supportStaff: {
    title: "Hospital Support & Facilities Staff",
    stats: SUPPORT_STAFF_STATS,
    list: SUPPORT_STAFF_FULL_LIST
  }
};

// ============================================================
// DEPARTMENTS, WARDS & OPERATIONS (Preserved from previous requirements)
// ============================================================

export const DEPARTMENT_STATUS_LIST = [
  { name: "General Medicine", floor: "Ground Floor", head: "Dr. Kevin Zhang", totalDoctors: 8, presentDoctors: 7, totalNurses: 16, presentNurses: 15, totalPatients: 380, admittedPatients: 24, totalBeds: 30, occupiedBeds: 24, availableBeds: 6, occupancyPct: 80, emergencyCases: 0, status: "Normal" },
  { name: "Cardiology", floor: "First Floor", head: "Dr. Robert Vance", totalDoctors: 6, presentDoctors: 5, totalNurses: 10, presentNurses: 9, totalPatients: 142, admittedPatients: 8, totalBeds: 10, occupiedBeds: 8, availableBeds: 2, occupancyPct: 80, emergencyCases: 2, status: "High Load" },
  { name: "Neurology", floor: "First Floor", head: "Dr. Sarah Connor", totalDoctors: 5, presentDoctors: 4, totalNurses: 8, presentNurses: 7, totalPatients: 98, admittedPatients: 7, totalBeds: 10, occupiedBeds: 7, availableBeds: 3, occupancyPct: 70, emergencyCases: 1, status: "Normal" },
  { name: "Orthopedics", floor: "First Floor", head: "Dr. James Wilson", totalDoctors: 5, presentDoctors: 5, totalNurses: 9, presentNurses: 8, totalPatients: 110, admittedPatients: 8, totalBeds: 10, occupiedBeds: 8, availableBeds: 2, occupancyPct: 80, emergencyCases: 1, status: "Normal" },
  { name: "Gynecology", floor: "First Floor", head: "Dr. Beatrice Vance", totalDoctors: 5, presentDoctors: 4, totalNurses: 10, presentNurses: 9, totalPatients: 125, admittedPatients: 7, totalBeds: 10, occupiedBeds: 7, availableBeds: 3, occupancyPct: 70, emergencyCases: 0, status: "Normal" },
  { name: "Pulmonology", floor: "First Floor", head: "Dr. Emily Chen", totalDoctors: 4, presentDoctors: 4, totalNurses: 8, presentNurses: 7, totalPatients: 85, admittedPatients: 6, totalBeds: 10, occupiedBeds: 6, availableBeds: 4, occupancyPct: 60, emergencyCases: 1, status: "Optimal" },
  { name: "Pediatrics", floor: "Second Floor", head: "Dr. Priscilla Osei", totalDoctors: 6, presentDoctors: 5, totalNurses: 11, presentNurses: 10, totalPatients: 135, admittedPatients: 7, totalBeds: 10, occupiedBeds: 7, availableBeds: 3, occupancyPct: 70, emergencyCases: 1, status: "Optimal" },
  { name: "General Surgery", floor: "Ground Floor", head: "Dr. Marcus Vance", totalDoctors: 7, presentDoctors: 6, totalNurses: 12, presentNurses: 11, totalPatients: 160, admittedPatients: 8, totalBeds: 10, occupiedBeds: 8, availableBeds: 2, occupancyPct: 80, emergencyCases: 2, status: "High Occupancy" },
  { name: "Emergency Medicine", floor: "Ground Floor", head: "Dr. Marcus Reed", totalDoctors: 6, presentDoctors: 5, totalNurses: 12, presentNurses: 11, totalPatients: 98, admittedPatients: 7, totalBeds: 10, occupiedBeds: 7, availableBeds: 3, occupancyPct: 70, emergencyCases: 7, status: "Surge Alert" },
  { name: "Oncology", floor: "Second Floor", head: "Dr. Arthur Pendelton", totalDoctors: 4, presentDoctors: 4, totalNurses: 8, presentNurses: 8, totalPatients: 90, admittedPatients: 8, totalBeds: 10, occupiedBeds: 8, availableBeds: 2, occupancyPct: 80, emergencyCases: 0, status: "Normal" },
  { name: "Dermatology", floor: "Second Floor", head: "Dr. Clara Oswald", totalDoctors: 3, presentDoctors: 3, totalNurses: 5, presentNurses: 5, totalPatients: 65, admittedPatients: 3, totalBeds: 6, occupiedBeds: 3, availableBeds: 3, occupancyPct: 50, emergencyCases: 0, status: "Optimal" },
  { name: "ENT", floor: "Second Floor", head: "Dr. Julian Bashir", totalDoctors: 4, presentDoctors: 3, totalNurses: 6, presentNurses: 5, totalPatients: 70, admittedPatients: 4, totalBeds: 6, occupiedBeds: 4, availableBeds: 2, occupancyPct: 67, emergencyCases: 0, status: "Normal" },
  { name: "Ophthalmology", floor: "Second Floor", head: "Dr. Beverly Crusher", totalDoctors: 3, presentDoctors: 3, totalNurses: 5, presentNurses: 5, totalPatients: 60, admittedPatients: 4, totalBeds: 6, occupiedBeds: 4, availableBeds: 2, occupancyPct: 67, emergencyCases: 0, status: "Normal" },
  { name: "Urology", floor: "Second Floor", head: "Dr. Leonard McCoy", totalDoctors: 4, presentDoctors: 4, totalNurses: 6, presentNurses: 6, totalPatients: 75, admittedPatients: 4, totalBeds: 6, occupiedBeds: 4, availableBeds: 2, occupancyPct: 67, emergencyCases: 0, status: "Normal" },
  { name: "Nephrology", floor: "Second Floor", head: "Dr. Phlox Denobulan", totalDoctors: 4, presentDoctors: 3, totalNurses: 7, presentNurses: 6, totalPatients: 80, admittedPatients: 4, totalBeds: 6, occupiedBeds: 4, availableBeds: 2, occupancyPct: 67, emergencyCases: 1, status: "Normal" }
];

export const WARD_STATUS_LIST = [
  { name: "Emergency & Trauma Center", code: "EMG", type: "Emergency", totalBeds: 30, occupiedBeds: 24, availableBeds: 4, reservedBeds: 2, maintenanceBeds: 0, occupancyPct: 80, patients: 24, assignedNurses: 8, assignedDoctors: 3, status: "High Occupancy" },
  { name: "Medical ICU (MICU)", code: "MICU", type: "Critical Care", totalBeds: 20, occupiedBeds: 18, availableBeds: 1, reservedBeds: 1, maintenanceBeds: 0, occupancyPct: 90, patients: 18, assignedNurses: 9, assignedDoctors: 2, status: "Critical Occupancy" },
  { name: "Surgical ICU (SICU)", code: "SICU", type: "Critical Care", totalBeds: 20, occupiedBeds: 15, availableBeds: 4, reservedBeds: 1, maintenanceBeds: 0, occupancyPct: 75, patients: 15, assignedNurses: 8, assignedDoctors: 2, status: "Normal" },
  { name: "Coronary Care Unit (CCU)", code: "CCU", type: "Cardiac Care", totalBeds: 20, occupiedBeds: 17, availableBeds: 2, reservedBeds: 1, maintenanceBeds: 0, occupancyPct: 85, patients: 17, assignedNurses: 7, assignedDoctors: 2, status: "High Occupancy" },
  { name: "General Medicine - Male", code: "GMW-M", type: "General Inpatient", totalBeds: 50, occupiedBeds: 44, availableBeds: 5, reservedBeds: 0, maintenanceBeds: 1, occupancyPct: 88, patients: 44, assignedNurses: 10, assignedDoctors: 2, status: "High Occupancy" },
  { name: "General Medicine - Female", code: "GMW-F", type: "General Inpatient", totalBeds: 50, occupiedBeds: 42, availableBeds: 6, reservedBeds: 2, maintenanceBeds: 0, occupancyPct: 84, patients: 42, assignedNurses: 10, assignedDoctors: 2, status: "Normal" },
  { name: "Pediatric Care Ward", code: "PED", type: "Pediatrics", totalBeds: 40, occupiedBeds: 28, availableBeds: 10, reservedBeds: 2, maintenanceBeds: 0, occupancyPct: 70, patients: 28, assignedNurses: 8, assignedDoctors: 2, status: "Normal" },
  { name: "Infectious & Isolation Ward", code: "IDI", type: "Isolation / Airborne", totalBeds: 30, occupiedBeds: 22, availableBeds: 6, reservedBeds: 1, maintenanceBeds: 1, occupancyPct: 73, patients: 22, assignedNurses: 6, assignedDoctors: 1, status: "Normal" },
  { name: "Post-Surgical Step-Down", code: "PSR", type: "Surgical Recovery", totalBeds: 40, occupiedBeds: 34, availableBeds: 4, reservedBeds: 2, maintenanceBeds: 0, occupancyPct: 85, patients: 34, assignedNurses: 8, assignedDoctors: 2, status: "High Occupancy" },
  { name: "Maternity & Obstetric Ward", code: "MAT", type: "Maternity", totalBeds: 50, occupiedBeds: 42, availableBeds: 6, reservedBeds: 2, maintenanceBeds: 0, occupancyPct: 84, patients: 42, assignedNurses: 9, assignedDoctors: 2, status: "Normal" }
];

export const BED_STATUS_SUMMARY = {
  totalBeds: 350,
  occupiedBeds: 286,
  availableBeds: 48,
  reservedBeds: 12,
  maintenanceBeds: 4,
  icuBeds: 60,
  emergencyBeds: 30,
  generalWardBeds: 200,
  privateRoomBeds: 60,
  occupancyPercentage: 82,
  availabilityPercentage: 14
};

export const EMERGENCY_DASHBOARD_STATS = {
  totalEmergencyPatientsToday: 28,
  criticalPatients: 4,
  highPriorityPatients: 9,
  mediumPriorityPatients: 12,
  lowPriorityPatients: 3,
  availableEmergencyBeds: 6,
  emergencyBedsOccupied: 24,
  availableEmergencyDoctors: 4,
  pendingEmergencyAdmissions: 3
};

export const EMERGENCY_PATIENTS_EXTENDED = [
  {
    patient: "Henry Forsythe",
    patientId: "PT-1009",
    priority: "Critical",
    condition: "STEMI with Cardiogenic Shock",
    requiredDepartment: "Cardiology",
    requiredBedType: "ICU / CCU Bed",
    assignedDoctor: "Dr. Marcus Reed",
    assignedBed: "EMG-01 (Transferred to CCU-01)",
    status: "In Treatment",
    triageLevel: 1,
    arrivalTime: "08:14 AM"
  },
  {
    patient: "Sandra Kowalski",
    patientId: "PT-1010",
    priority: "High",
    condition: "Polytrauma, Multiple Fractures",
    requiredDepartment: "Orthopedics & Trauma",
    requiredBedType: "Trauma Bed",
    assignedDoctor: "Dr. Marcus Reed",
    assignedBed: "EMG-04",
    status: "Stabilizing",
    triageLevel: 2,
    arrivalTime: "09:47 AM"
  },
  {
    patient: "Liu Chang",
    patientId: "PT-1011",
    priority: "Critical",
    condition: "Suspected Bacterial Meningitis",
    requiredDepartment: "Pediatrics",
    requiredBedType: "Pediatric Isolation Bed",
    assignedDoctor: "Dr. Priscilla Osei",
    assignedBed: "EMG-06 (Pending PED-01)",
    status: "Under LP Procedure",
    triageLevel: 1,
    arrivalTime: "10:22 AM"
  }
];

export const ADMISSION_DISCHARGE_FLOW_SUMMARY = {
  todaysAdmissions: 24,
  todaysDischarges: 18,
  pendingAdmissions: 5,
  pendingDischarges: 8,
  emergencyAdmissions: 7,
  interWardTransfers: 4,
  netBedChange: "+6 beds"
};

export const RECENT_HOSPITAL_ACTIVITIES = [
  { id: "EVT-01", time: "11:45 AM", event: "Patient Admitted", person: "Carlos Santana (PT-1025)", dept: "Emergency & Trauma", status: "Completed", type: "admission" },
  { id: "EVT-02", time: "11:30 AM", event: "Bed Allocated", person: "Bed #MICU-04 -> Benjamin Clark", dept: "Medical ICU", status: "Allocated", type: "bed" },
  { id: "EVT-03", time: "11:15 AM", event: "Patient Discharged", person: "Hannah Abbott (PT-0983)", dept: "Maternity Ward", status: "Discharged", type: "discharge" },
  { id: "EVT-04", time: "11:00 AM", event: "Emergency Patient Registered", person: "Liam Hemsworth (Severe Anaphylaxis)", dept: "Emergency", status: "Triage L1", type: "emergency" },
  { id: "EVT-05", time: "10:45 AM", event: "Inter-Ward Transfer Approved", person: "Raymond Sterling (CCU-02 -> SICU-02)", dept: "Critical Care", status: "In Transit", type: "transfer" },
  { id: "EVT-06", time: "10:30 AM", event: "Doctor Checked In", person: "Dr. Gregory House, MD", dept: "Special Diagnostics", status: "On Duty", type: "staff" },
  { id: "EVT-07", time: "10:15 AM", event: "Lab Result Completed", person: "Troponin-I Stat for Arthur Pendelton", dept: "Biochemistry", status: "Critical Alert", type: "lab" },
  { id: "EVT-08", time: "10:00 AM", event: "Bed Released & Sanitized", person: "Bed #GMW-F02 Terminal Cleaned", dept: "General Medicine", status: "Available", type: "bed" },
  { id: "EVT-09", time: "09:45 AM", event: "Pharmacy Stock Alert", person: "Morphine Sulfate 10mg/mL low stock", dept: "Pharmacy", status: "Reorder Sent", type: "pharmacy" },
  { id: "EVT-10", time: "09:30 AM", event: "Patient Discharged", person: "George Wilson (PT-0980)", dept: "General Medicine - Male", status: "Discharged", type: "discharge" }
];
