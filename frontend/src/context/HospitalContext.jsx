import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import { apiLogin, apiSignup as apiSignupCall } from "../services/api";
import {
  ROLES,
  INITIAL_WARDS,
  INITIAL_BEDS,
  INITIAL_PATIENTS,
  INITIAL_TRANSFERS,
  AI_FORECAST_TIMELINE,
  SEVEN_DAY_FORECAST,
  INITIAL_NOTIFICATIONS,
  RECENT_ACTIVITIES
} from "../data/mockData";
import {
  HOSPITAL_PATIENT_STATS,
  ADMITTED_PATIENTS_LIST,
  TODAYS_ADMISSIONS,
  TODAYS_DISCHARGES,
  DOCTOR_MANAGEMENT_STATS,
  DOCTORS_FULL_LIST,
  NURSE_MANAGEMENT_STATS,
  NURSES_FULL_LIST,
  OTHER_STAFF_CATEGORIES,
  RECEPTIONISTS_FULL_LIST,
  PHARMACISTS_FULL_LIST,
  LAB_TECHS_FULL_LIST,
  RADIOLOGY_STAFF_FULL_LIST,
  ADMIN_STAFF_FULL_LIST,
  BILLING_STAFF_FULL_LIST,
  SUPPORT_STAFF_FULL_LIST,
  HOSPITAL_WORKFORCE_SUMMARY,
  DEPARTMENT_STATUS_LIST,
  WARD_STATUS_LIST,
  BED_STATUS_SUMMARY,
  EMERGENCY_DASHBOARD_STATS,
  EMERGENCY_PATIENTS_EXTENDED,
  ADMISSION_DISCHARGE_FLOW_SUMMARY,
  RECENT_HOSPITAL_ACTIVITIES,
  STAFF_ATTENDANCE_OVERVIEW
} from "../data/extendedHospitalData";


const HospitalContext = createContext(null);

export const HospitalProvider = ({ children }) => {
  // Authentication State (defaults to false so user sees Login first)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authView, setAuthView] = useState("login"); // "login" or "signup"
  const [authUser, setAuthUser] = useState(null);

  // Navigation & Role
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [currentRoleKey, setCurrentRoleKey] = useState("ADMIN"); // ADMIN, DOCTOR, NURSE, RECEPTIONIST
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Dashboard Filters
  const [dashboardFilter, setDashboardFilter] = useState("today"); // today, yesterday, this_week, this_month, custom
  const [dashboardDeptFilter, setDashboardDeptFilter] = useState("All");
  const [dashboardWardFilter, setDashboardWardFilter] = useState("All");

  // Extended Data States
  const [admittedPatientsList, setAdmittedPatientsList] = useState(ADMITTED_PATIENTS_LIST);
  const [todaysAdmissionsList, setTodaysAdmissionsList] = useState(TODAYS_ADMISSIONS);
  const [todaysDischargesList, setTodaysDischargesList] = useState(TODAYS_DISCHARGES);
  const [doctorsList, setDoctorsList] = useState(DOCTORS_FULL_LIST);
  const [nursesList, setNursesList] = useState(NURSES_FULL_LIST);
  const [otherStaff, setOtherStaff] = useState(OTHER_STAFF_CATEGORIES);
  const [departmentsStatus, setDepartmentsStatus] = useState(DEPARTMENT_STATUS_LIST);
  const [wardStatusList, setWardStatusList] = useState(WARD_STATUS_LIST);
  const [emergencyPatientsList, setEmergencyPatientsList] = useState(EMERGENCY_PATIENTS_EXTENDED);
  const [recentHospitalActivities, setRecentHospitalActivities] = useState(RECENT_HOSPITAL_ACTIVITIES);

  // Core Hospital Data States
  const [wards, setWards] = useState(INITIAL_WARDS);
  const [beds, setBeds] = useState(INITIAL_BEDS);
  const [patients, setPatients] = useState(INITIAL_PATIENTS);
  const [transfers, setTransfers] = useState(INITIAL_TRANSFERS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [activities, setActivities] = useState(RECENT_ACTIVITIES);


  // Bed Requests Queue (For Doctor / Nurse / Receptionist workflows)
  const [bedRequests, setBedRequests] = useState([
    {
      id: "REQ-301",
      patientName: "David Miller",
      age: 54,
      gender: "Male",
      requestedWard: "MICU",
      bedType: "Ventilator Equipped",
      priority: "CRITICAL",
      urgencyScore: 1,
      diagnosis: "Acute Hypoxemic Respiratory Failure",
      requestedBy: "Dr. Robert Vance",
      requestTime: "15 mins ago",
      status: "Pending Approval",
      notes: "Requires invasive mechanical ventilation and arterial line setup."
    },
    {
      id: "REQ-302",
      patientName: "Sophia Martinez",
      age: 29,
      gender: "Female",
      requestedWard: "MAT",
      bedType: "Standard Obstetric",
      priority: "URGENT",
      urgencyScore: 2,
      diagnosis: "Active Labor (Stage 2 Admission)",
      requestedBy: "Dr. Beatrice Vance",
      requestTime: "25 mins ago",
      status: "Approved - Bed Assigned",
      notes: "Direct transfer from triage room 3."
    },
    {
      id: "REQ-303",
      patientName: "Kenneth Robinson",
      age: 71,
      gender: "Male",
      requestedWard: "GMW-M",
      bedType: "Standard Oxygen",
      priority: "ROUTINE",
      urgencyScore: 3,
      diagnosis: "Post-Operative Observation Day 2",
      requestedBy: "Dr. Kevin Zhang",
      requestTime: "1 hour ago",
      status: "Pending Approval",
      notes: "Stable vitals. Step down to standard inpatient bed."
    }
  ]);

  // System & AI Configuration
  const [emergencySurgeActive, setEmergencySurgeActive] = useState(false);
  const [aiSettings, setAiSettings] = useState({
    urgencyWeight: 35,
    resourceMatchWeight: 25,
    infectionControlWeight: 20,
    losForecastWeight: 20,
    autoReserveBuffer: true,
    surgeSensitivity: "High (Threshold 85%)",
    preventWardBottlenecks: true
  });

  // Active Modals & Selected Objects
  const [selectedBed, setSelectedBed] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedStaffProfile, setSelectedStaffProfile] = useState(null);
  const [isStaffProfileModalOpen, setIsStaffProfileModalOpen] = useState(false);
  const [isAdmitModalOpen, setIsAdmitModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isSmartAllocateModalOpen, setIsSmartAllocateModalOpen] = useState(false);
  const [isBedDetailsModalOpen, setIsBedDetailsModalOpen] = useState(false);

  const viewStaffProfile = (staffMember) => {
    setSelectedStaffProfile(staffMember);
    setIsStaffProfileModalOpen(true);
  };


  // Toast System
  const [toasts, setToasts] = useState([]);

  const addToast = (title, message, type = "success") => {
    const id = Date.now() + Math.random().toString();
    const newToast = { id, title, message, type };
    setToasts((prev) => [newToast, ...prev]);

    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Auth Actions
  const login = async (roleKey, email, name = null, password = "password123") => {
    try {
      const res = await apiLogin(email, password);
      if (res && res.success && res.data) {
        const { token, user } = res.data;
        if (token) localStorage.setItem("mediflow_token", token);
        const resolvedRoleKey = user.role ? user.role.toUpperCase() : roleKey;
        const validRole = ROLES[resolvedRoleKey] || ROLES.ADMIN;
        setCurrentRoleKey(resolvedRoleKey);
        setAuthUser({
          name: user.name || name || validRole.name,
          email: user.email || email,
          role: validRole.roleName,
          roleKey: resolvedRoleKey,
          dept: user.department || validRole.dept,
          avatar: user.avatar || validRole.avatar,
        });
        setIsAuthenticated(true);
        setCurrentPage("dashboard");
        addToast(
          "Login Successful",
          `Welcome to MediFlow AI, ${user.name || name || validRole.name} (${validRole.roleName})`,
          "success"
        );
        return true;
      }
    } catch (err) {
      console.warn("Backend auth failed, falling back to local session:", err.message);
      const validRole = ROLES[roleKey] || ROLES.ADMIN;
      setCurrentRoleKey(roleKey);
      setAuthUser({
        name: name || validRole.name,
        email: email || `${roleKey.toLowerCase()}@mediflow.hospital`,
        role: validRole.roleName,
        roleKey: roleKey,
        dept: validRole.dept,
        avatar: validRole.avatar
      });
      setIsAuthenticated(true);
      setCurrentPage("dashboard");
      addToast(
        "Login Successful",
        `Welcome to MediFlow AI, ${name || validRole.name} (${validRole.roleName})`,
        "success"
      );
      return true;
    }
  };

  const signup = async (userData) => {
    try {
      const res = await apiSignupCall({
        name: userData.fullName,
        email: userData.email,
        password: userData.password,
        role: (userData.roleKey || "doctor").toLowerCase(),
      });
      if (res && res.success && res.data) {
        const { token, user } = res.data;
        if (token) localStorage.setItem("mediflow_token", token);
        const resolvedRoleKey = user.role ? user.role.toUpperCase() : (userData.roleKey || "DOCTOR");
        const validRole = ROLES[resolvedRoleKey] || ROLES.DOCTOR;
        setCurrentRoleKey(resolvedRoleKey);
        setAuthUser({
          name: user.name || userData.fullName,
          email: user.email || userData.email,
          role: validRole.roleName,
          roleKey: resolvedRoleKey,
          dept: validRole.dept,
          avatar: validRole.avatar,
        });
        setIsAuthenticated(true);
        setCurrentPage("dashboard");
        addToast("Account Created", "Your hospital staff account has been registered.", "success");
        return true;
      }
    } catch (err) {
      console.warn("Backend signup failed, falling back to local session:", err.message);
      const validRole = ROLES[userData.roleKey || "ADMIN"] || ROLES.ADMIN;
      setCurrentRoleKey(userData.roleKey || "ADMIN");
      setAuthUser({
        name: userData.fullName || validRole.name,
        email: userData.email,
        role: validRole.roleName,
        roleKey: userData.roleKey || "ADMIN",
        dept: validRole.dept,
        avatar: validRole.avatar
      });
      setIsAuthenticated(true);
      setCurrentPage("dashboard");
      addToast("Account Created", "Your hospital staff account has been registered.", "success");
    }
  };

  const logout = () => {
    localStorage.removeItem("mediflow_token");
    setIsAuthenticated(false);
    setAuthUser(null);
    setAuthView("login");
    addToast("Logged Out", "You have safely signed out of the hospital management system.", "info");
  };

  // Current Role Object
  const currentRole = ROLES[currentRoleKey] || ROLES.ADMIN;

  const setRole = (roleKey) => {
    if (ROLES[roleKey]) {
      setCurrentRoleKey(roleKey);
      if (authUser) {
        setAuthUser((prev) => ({
          ...prev,
          role: ROLES[roleKey].roleName,
          roleKey: roleKey,
          name: ROLES[roleKey].name,
          dept: ROLES[roleKey].dept,
          avatar: ROLES[roleKey].avatar
        }));
      }
      addToast(
        "Role Switched",
        `Switched perspective to ${ROLES[roleKey].roleName} (${ROLES[roleKey].name})`,
        "info"
      );
    }
  };

  // Hospital Bed Metrics Calculation
  const metrics = useMemo(() => {
    const totalBeds = 350;
    const occupiedBeds = 298;
    const availableBeds = 42;
    const cleaningBeds = 7;
    const maintenanceBeds = 3;
    const occupancyRate = Math.round((occupiedBeds / totalBeds) * 100);

    const icuTotal = 60;
    const icuOccupied = 54;
    const icuAvailable = 6;
    const icuOccupancyRate = 90;

    const emergencyTotal = 30;
    const emergencyOccupied = 24;
    const emergencyAvailable = 6;

    return {
      totalBeds,
      occupiedBeds,
      availableBeds,
      cleaningBeds,
      maintenanceBeds,
      occupancyRate,
      icuTotal,
      icuOccupied,
      icuAvailable,
      icuOccupancyRate,
      emergencyTotal,
      emergencyOccupied,
      emergencyAvailable,
      activeTransfersCount: transfers.filter((t) => !t.status.includes("Completed") && !t.status.includes("Rejected")).length,
      pendingRequestsCount: bedRequests.filter((r) => r.status.includes("Pending")).length,
      unreadNotificationsCount: notifications.filter((n) => n.unread).length
    };
  }, [beds, wards, transfers, bedRequests, notifications]);

  // AI Smart Bed Allocation Algorithm
  const evaluateSmartBedAllocation = (patientData) => {
    const {
      name,
      acuityScore = 2,
      requiredWard = "MICU",
      oxygenReq = "Standard",
      infectionRisk = false,
      gender = "Male"
    } = patientData;

    let candidates = beds.filter((b) => b.status === "available");
    let wardMatches = candidates.filter((b) => b.wardId === requiredWard);
    let chosenBed = null;
    let confidenceScore = 96;
    let reasoning = "";

    if (wardMatches.length > 0) {
      chosenBed = wardMatches[0];
      reasoning = `Direct clinical match in requested unit (${chosenBed.wardName}) with compatible infrastructure (${chosenBed.equipment.join(", ")}).`;
    } else {
      if (requiredWard === "MICU" || requiredWard === "SICU" || requiredWard === "CCU") {
        chosenBed = candidates.find((b) => b.wardId === "SICU" || b.wardId === "CCU" || b.wardId === "EMG") || candidates[0];
        confidenceScore = 89;
        reasoning = `Requested ICU at high capacity. AI allocated compatible critical care buffer in ${chosenBed?.wardName || "Emergency Trauma"}.`;
      } else if (requiredWard === "GMW-M" || requiredWard === "GMW-F") {
        const targetGmw = gender === "Female" ? "GMW-F" : "GMW-M";
        chosenBed = candidates.find((b) => b.wardId === targetGmw) || candidates.find((b) => b.wardId === "PSR") || candidates[0];
        confidenceScore = 93;
        reasoning = `Optimal gender-segregated inpatient placement in ${chosenBed?.wardName} with low nurse-to-patient staffing ratio.`;
      } else {
        chosenBed = candidates[0] || beds[0];
        confidenceScore = 86;
        reasoning = `Proximity-based placement with verified nursing bandwidth and telemetry interface.`;
      }
    }

    if (infectionRisk) {
      const isolationBed = candidates.find((b) => b.wardId === "IDI");
      if (isolationBed) {
        chosenBed = isolationBed;
        confidenceScore = 98;
        reasoning = `Infection risk detected. Patient safely routed to Negative Pressure Isolation Suite #${isolationBed.bedNumber} in Infectious Care.`;
      }
    }

    return {
      recommendedBed: chosenBed,
      confidenceScore,
      reasoning,
      factors: {
        clinicalUrgencyScore: Math.round(91 + Math.random() * 7),
        resourceMatchScore: Math.round(89 + Math.random() * 8),
        infectionSafetyScore: infectionRisk ? 99 : 95,
        losEfficiencyScore: Math.round(87 + Math.random() * 9)
      },
      alternatives: candidates.filter((b) => b.id !== chosenBed?.id).slice(0, 2)
    };
  };

  // Action: Allocate Bed
  const allocateBed = (patientData, bedId, reasoning = "Smart Bed Allocation") => {
    const targetBed = beds.find((b) => b.id === bedId);
    if (!targetBed) {
      addToast("Allocation Error", "Target bed was not found", "danger");
      return false;
    }

    const patientId = `PT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPatient = {
      id: patientId,
      mrn: `MRN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      name: patientData.name || "Unknown Patient",
      age: patientData.age || 48,
      gender: patientData.gender || "Male",
      wardId: targetBed.wardId,
      bedId: targetBed.id,
      acuity: patientData.acuity || "Severe (Level 2)",
      acuityScore: patientData.acuityScore || 2,
      diagnosis: patientData.diagnosis || "Acute Clinical Admission",
      admitDate: new Date().toISOString().slice(0, 16).replace("T", " "),
      estimatedDischarge: "In 4 Days",
      doctor: patientData.doctor || currentRole.name,
      oxygenReq: patientData.oxygenReq || "Standard Oxygen",
      infectionRisk: patientData.infectionRisk ? "Contact / Airborne Isolation" : "Standard Precautions",
      vitals: {
        hr: Math.floor(72 + Math.random() * 25),
        bp: "120/80",
        spo2: "98%",
        temp: "37.0°C",
        rr: 18
      },
      notes: reasoning
    };

    setBeds((prev) =>
      prev.map((b) =>
        b.id === bedId ? { ...b, status: "occupied", patientId: patientId } : b
      )
    );

    setPatients((prev) => [newPatient, ...prev]);

    setActivities((prev) => [
      {
        id: `ACT-${Date.now()}`,
        user: currentRole.name,
        action: "Bed Allocated",
        detail: `${newPatient.name} assigned to Bed #${targetBed.id} (${targetBed.wardName})`,
        time: "Just now",
        icon: "UserCheck"
      },
      ...prev
    ]);

    addToast(
      "Bed Allocated",
      `Bed #${targetBed.id} successfully assigned to ${newPatient.name}`,
      "success"
    );

    return true;
  };

  // Action: Update Bed Status
  const updateBedStatus = (bedId, newStatus) => {
    setBeds((prev) =>
      prev.map((b) =>
        b.id === bedId
          ? {
              ...b,
              status: newStatus,
              patientId: newStatus === "available" ? null : b.patientId,
              lastCleaned: newStatus === "available" ? "Just Now (Sterilized)" : b.lastCleaned
            }
          : b
      )
    );

    addToast(
      "Bed Status Updated",
      `Bed #${bedId} status changed to ${newStatus.toUpperCase()}`,
      "info"
    );
  };

  // Action: Discharge Patient
  const dischargePatient = (patientId) => {
    const patient = patients.find((p) => p.id === patientId);
    if (!patient) return;

    if (patient.bedId) {
      setBeds((prev) =>
        prev.map((b) =>
          b.id === patient.bedId
            ? { ...b, status: "cleaning", patientId: null, lastCleaned: "Turnover In Progress (ETA 20m)" }
            : b
        )
      );
    }

    setPatients((prev) => prev.filter((p) => p.id !== patientId));

    addToast(
      "Patient Discharged",
      `${patient.name} discharged. Bed #${patient.bedId} scheduled for sterilization.`,
      "success"
    );
  };

  // Action: Request Transfer
  const requestTransfer = (transferData) => {
    const { patientId, targetWardId, clinicalReason, priority = "URGENT" } = transferData;
    const patient = patients.find((p) => p.id === patientId);
    const targetWard = wards.find((w) => w.id === targetWardId);

    if (!patient || !targetWard) {
      addToast("Transfer Failed", "Invalid patient or destination ward", "danger");
      return false;
    }

    const targetBed = beds.find((b) => b.wardId === targetWardId && b.status === "available");

    const newTransfer = {
      id: `TRF-${Math.floor(1000 + Math.random() * 9000)}`,
      patientId: patient.id,
      patientName: patient.name,
      age: patient.age,
      sourceWardId: patient.wardId,
      sourceWardName: wards.find((w) => w.id === patient.wardId)?.name || patient.wardId,
      sourceBedId: patient.bedId,
      targetWardId: targetWard.id,
      targetWardName: targetWard.name,
      targetBedId: targetBed ? targetBed.id : "Auto-Assign on Transit",
      priority: priority.toUpperCase(),
      priorityColor: priority === "CRITICAL" ? "#dc2626" : priority === "URGENT" ? "#d97706" : "#059669",
      clinicalReason: clinicalReason || "Clinical step-down/step-up transfer protocol.",
      requestedBy: currentRole.name,
      approvedBy: "Pending Approval",
      requestTime: "Just now",
      status: "Pending Approval",
      etaMinutes: 25,
      aiCompatibilityScore: Math.floor(92 + Math.random() * 7),
      aiRecommendationReason: `Verified clinical match for ${targetWard.specialty}.`
    };

    setTransfers((prev) => [newTransfer, ...prev]);
    addToast("Transfer Requested", `Transfer request submitted for ${patient.name}`, "info");
    return true;
  };

  // Action: Approve Transfer
  const approveTransfer = (transferId) => {
    setTransfers((prev) =>
      prev.map((t) =>
        t.id === transferId
          ? { ...t, status: "Approved - Bed Reserved", approvedBy: currentRole.name }
          : t
      )
    );
    addToast("Transfer Approved", `Transfer #${transferId} authorized. Bed reserved.`, "success");
  };

  // Action: Reject Transfer
  const rejectTransfer = (transferId) => {
    setTransfers((prev) =>
      prev.map((t) =>
        t.id === transferId
          ? { ...t, status: "Rejected", approvedBy: `Rejected by ${currentRole.name}` }
          : t
      )
    );
    addToast("Transfer Rejected", `Transfer #${transferId} has been declined.`, "info");
  };

  // Action: Complete Transfer
  const executeTransfer = (transferId) => {
    const transfer = transfers.find((t) => t.id === transferId);
    if (!transfer) return;

    setPatients((prev) =>
      prev.map((p) =>
        p.id === transfer.patientId
          ? { ...p, wardId: transfer.targetWardId, bedId: transfer.targetBedId }
          : p
      )
    );

    setBeds((prev) =>
      prev.map((b) => {
        if (b.id === transfer.sourceBedId) {
          return { ...b, status: "cleaning", patientId: null, lastCleaned: "Turnover In Progress" };
        }
        if (b.id === transfer.targetBedId) {
          return { ...b, status: "occupied", patientId: transfer.patientId };
        }
        return b;
      })
    );

    setTransfers((prev) =>
      prev.map((t) =>
        t.id === transferId ? { ...t, status: "Completed - Transferred", etaMinutes: 0 } : t
      )
    );

    addToast(
      "Transfer Completed",
      `${transfer.patientName} safely moved into ${transfer.targetBedId} (${transfer.targetWardName})`,
      "success"
    );
  };

  // Action: Approve Bed Request
  const approveBedRequest = (requestId) => {
    setBedRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? { ...r, status: "Approved - Bed Assigned" }
          : r
      )
    );
    addToast("Bed Request Approved", `Request #${requestId} approved and bed reserved.`, "success");
  };

  // Action: Reject Bed Request
  const rejectBedRequest = (requestId) => {
    setBedRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? { ...r, status: "Declined" }
          : r
      )
    );
    addToast("Bed Request Declined", `Request #${requestId} declined.`, "info");
  };

  // Notifications
  const markNotificationRead = (notifId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, unread: false } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    addToast("Notifications Cleared", "All alerts marked as read.", "info");
  };

  // Toggle Emergency Surge Mode
  const toggleEmergencySurge = () => {
    setEmergencySurgeActive((prev) => {
      const nextState = !prev;
      if (nextState) {
        addToast(
          "Emergency Surge Mode Active",
          "Reserve trauma buffers enabled. Rapid step-down protocol initiated.",
          "warning"
        );
      } else {
        addToast(
          "Surge Mode Deactivated",
          "Standard baseline capacity allocation restored.",
          "info"
        );
      }
      return nextState;
    });
  };

  const value = {
    // Auth State
    isAuthenticated,
    setIsAuthenticated,
    authView,
    setAuthView,
    authUser,
    login,
    signup,
    logout,

    // Navigation & Role
    currentPage,
    setCurrentPage,
    currentRoleKey,
    currentRole,
    setRole,
    searchQuery,
    setSearchQuery,
    sidebarCollapsed,
    setSidebarCollapsed,

    // Dashboard Filters & States
    dashboardFilter,
    setDashboardFilter,
    dashboardDeptFilter,
    setDashboardDeptFilter,
    dashboardWardFilter,
    setDashboardWardFilter,

    // Extended Hospital Operations Data
    hospitalPatientStats: HOSPITAL_PATIENT_STATS,
    hospitalWorkforceSummary: HOSPITAL_WORKFORCE_SUMMARY,
    admittedPatientsList,
    setAdmittedPatientsList,
    todaysAdmissionsList,
    setTodaysAdmissionsList,
    todaysDischargesList,
    setTodaysDischargesList,
    doctorManagementStats: DOCTOR_MANAGEMENT_STATS,
    doctorsList,
    setDoctorsList,
    nurseManagementStats: NURSE_MANAGEMENT_STATS,
    nursesList,
    setNursesList,
    otherStaff,
    setOtherStaff,
    departmentsStatus,
    setDepartmentsStatus,
    wardStatusList,
    setWardStatusList,
    bedStatusSummary: BED_STATUS_SUMMARY,
    emergencyStats: EMERGENCY_DASHBOARD_STATS,
    emergencyPatientsList,
    setEmergencyPatientsList,
    admissionDischargeFlow: ADMISSION_DISCHARGE_FLOW_SUMMARY,
    recentHospitalActivities,
    setRecentHospitalActivities,
    staffAttendanceOverview: STAFF_ATTENDANCE_OVERVIEW,

    // Data States
    wards,
    beds,
    patients,
    transfers,
    bedRequests,
    notifications,
    activities,
    metrics,
    forecastTimeline: AI_FORECAST_TIMELINE,
    sevenDayForecast: SEVEN_DAY_FORECAST,

    // Settings
    emergencySurgeActive,
    toggleEmergencySurge,
    aiSettings,
    setAiSettings,

    // Modals
    selectedBed,
    setSelectedBed,
    selectedPatient,
    setSelectedPatient,
    selectedStaffProfile,
    setSelectedStaffProfile,
    isStaffProfileModalOpen,
    setIsStaffProfileModalOpen,
    viewStaffProfile,
    isAdmitModalOpen,
    setIsAdmitModalOpen,
    isTransferModalOpen,
    setIsTransferModalOpen,
    isSmartAllocateModalOpen,
    setIsSmartAllocateModalOpen,
    isBedDetailsModalOpen,
    setIsBedDetailsModalOpen,


    // Toasts
    toasts,
    addToast,
    removeToast,

    // Operations
    evaluateSmartBedAllocation,
    allocateBed,
    updateBedStatus,
    dischargePatient,
    requestTransfer,
    approveTransfer,
    rejectTransfer,
    executeTransfer,
    approveBedRequest,
    rejectBedRequest,
    markNotificationRead,
    markAllNotificationsRead
  };

  return (
    <HospitalContext.Provider value={value}>
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospital = () => {
  const context = useContext(HospitalContext);
  if (!context) {
    throw new Error("useHospital must be used within a HospitalProvider");
  }
  return context;
};
