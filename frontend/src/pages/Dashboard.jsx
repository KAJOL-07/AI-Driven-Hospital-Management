import React, { useState } from "react";
import { useHospital } from "../context/HospitalContext";
import { CapacityTimelineChart, WardOccupancyMeter, DonutOccupancyMeter } from "../components/common/ChartVisualizer";
import {
  BedDouble,
  Users,
  HeartPulse,
  Activity,
  Sparkles,
  ArrowRightLeft,
  Clock,
  TrendingUp,
  PlusCircle,
  Eye,
  LogOut,
  ChevronRight,
  Layers,
  Search,
  UserCheck,
  Calendar,
  Stethoscope,
  Building2,
  Briefcase,
  ArrowUpRight,
  ArrowDownRight,
  UserPlus,
  ShieldCheck,
  Zap,
  CheckCircle2
} from "lucide-react";

const Dashboard = () => {
  const {
    currentRole,
    currentRoleKey,
    metrics,
    beds,
    forecastTimeline,
    setIsSmartAllocateModalOpen,
    setIsAdmitModalOpen,
    setIsTransferModalOpen,
    setSelectedBed,
    setIsBedDetailsModalOpen,
    dischargePatient,
    setCurrentPage,
    emergencySurgeActive,
    // Extended states
    dashboardFilter,
    setDashboardFilter,
    dashboardDeptFilter,
    setDashboardDeptFilter,
    dashboardWardFilter,
    setDashboardWardFilter,
    hospitalPatientStats,
    hospitalWorkforceSummary,
    admittedPatientsList,
    todaysAdmissionsList,
    todaysDischargesList,
    doctorManagementStats,
    nurseManagementStats,
    otherStaff,
    departmentsStatus,
    emergencyStats,
    recentHospitalActivities,
    viewStaffProfile
  } = useHospital();

  // Active workforce tab in the workforce section
  const [activeStaffTab, setActiveStaffTab] = useState("all");

  // Inpatient search & filter
  const [patientSearch, setPatientSearch] = useState("");
  const [patientConditionFilter, setPatientConditionFilter] = useState("All");

  const handleBedClick = (bedId) => {
    const bed = beds.find((b) => b.id === bedId);
    if (bed) {
      setSelectedBed(bed);
      setIsBedDetailsModalOpen(true);
    }
  };

  // Helper for condition badge styling
  const getConditionBadgeClass = (condition) => {
    switch (condition?.toLowerCase()) {
      case "critical": return "badge-condition-critical";
      case "serious": return "badge-condition-serious";
      case "stable": return "badge-condition-stable";
      case "improving": return "badge-condition-improving";
      case "under observation":
      case "observation": return "badge-condition-observation";
      default: return "badge-secondary";
    }
  };

  // Helper for priority badge styling
  const getPriorityBadgeClass = (priority) => {
    switch (priority?.toLowerCase()) {
      case "emergency": return "badge-priority-emergency";
      case "high": return "badge-priority-high";
      case "medium": return "badge-priority-medium";
      case "low": return "badge-priority-low";
      default: return "badge-secondary";
    }
  };

  // Helper for staff status badge styling
  const getStaffStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case "present":
      case "on duty": return "badge-staff-present";
      case "absent": return "badge-staff-absent";
      case "on leave": return "badge-staff-leave";
      case "available": return "badge-staff-available";
      case "busy":
      case "with patients": return "badge-staff-busy";
      case "emergency duty": return "badge-staff-emergency";
      case "off duty": return "badge-secondary";
      default: return "badge-secondary";
    }
  };

  // Helper for ward status badge styling
  const getWardStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case "normal":
      case "optimal": return "badge-status-available";
      case "high load":
      case "high occupancy": return "badge-status-cleaning";
      case "critical occupancy":
      case "surge alert": return "badge-status-critical";
      case "maintenance": return "badge-status-maintenance";
      default: return "badge-secondary";
    }
  };

  // Filtered Admitted Patients
  const filteredAdmittedPatients = admittedPatientsList.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
      p.id.toLowerCase().includes(patientSearch.toLowerCase()) ||
      p.ward.toLowerCase().includes(patientSearch.toLowerCase()) ||
      p.doctor.toLowerCase().includes(patientSearch.toLowerCase());
    const matchCondition = patientConditionFilter === "All" || p.condition === patientConditionFilter;
    return matchSearch && matchCondition;
  });

  return (
    <div className="space-y-8">
      {/* 1. WELCOME & QUICK ACTIONS HEADER */}
      <div className="card p-6 border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="badge badge-ai font-semibold">
                {currentRole.roleName} Command Center
              </span>
              <span className="text-xs text-muted font-mono">{currentRole.dept}</span>
            </div>
            <h1 className="text-2xl font-bold text-main">
              Hospital Operations Overview
            </h1>
            <p className="text-sm text-muted max-w-2xl">
              Live hospital status across 10 inpatient wards, emergency bays, clinical staffing, and AI capacity forecasting.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              className="btn btn-primary btn-md"
              onClick={() => setIsSmartAllocateModalOpen(true)}
            >
              <Sparkles size={16} />
              <span>Smart Bed Allocation</span>
            </button>
            <button
              className="btn btn-secondary btn-md"
              onClick={() => setIsTransferModalOpen(true)}
            >
              <ArrowRightLeft size={16} />
              <span>Request Transfer</span>
            </button>
            <button
              className="btn btn-secondary btn-md"
              onClick={() => setIsAdmitModalOpen(true)}
            >
              <PlusCircle size={16} />
              <span>Admit Patient</span>
            </button>
          </div>
        </div>

        {/* Global Filter Bar */}
        <div className="mt-5 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Calendar size={15} className="text-primary shrink-0" />
            <span className="text-xs font-bold text-main uppercase tracking-wider">Time Horizon:</span>
            <div className="filter-pill-group">
              {[
                { id: "today", label: "Today" },
                { id: "yesterday", label: "Yesterday" },
                { id: "this_week", label: "This Week" },
                { id: "this_month", label: "This Month" }
              ].map((f) => (
                <button
                  key={f.id}
                  className={`filter-pill-btn ${dashboardFilter === f.id ? "active" : ""}`}
                  onClick={() => setDashboardFilter(f.id)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <Building2 size={14} className="text-muted" />
              <span className="text-muted font-medium">Department:</span>
              <select
                className="form-control text-xs py-1 px-2.5 h-auto w-auto"
                value={dashboardDeptFilter}
                onChange={(e) => setDashboardDeptFilter(e.target.value)}
              >
                <option value="All">All Departments (15)</option>
                <option value="General Medicine">General Medicine</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Neurology">Neurology</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Gynecology">Gynecology</option>
                <option value="Pulmonology">Pulmonology</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="General Surgery">General Surgery</option>
                <option value="Emergency Medicine">Emergency Medicine</option>
                <option value="Oncology">Oncology</option>
                <option value="Dermatology">Dermatology</option>
                <option value="ENT">ENT</option>
                <option value="Ophthalmology">Ophthalmology</option>
                <option value="Urology">Urology</option>
                <option value="Nephrology">Nephrology</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <Layers size={14} className="text-muted" />
              <span className="text-muted font-medium">Ward:</span>
              <select
                className="form-control text-xs py-1 px-2.5 h-auto w-auto"
                value={dashboardWardFilter}
                onChange={(e) => setDashboardWardFilter(e.target.value)}
              >
                <option value="All">All Wards (10)</option>
                <option value="EMG">Emergency Center (EMG)</option>
                <option value="MICU">Medical ICU (MICU)</option>
                <option value="SICU">Surgical ICU (SICU)</option>
                <option value="CCU">Coronary Care (CCU)</option>
                <option value="GMW-M">General Med Male (GMW-M)</option>
                <option value="GMW-F">General Med Female (GMW-F)</option>
                <option value="PED">Pediatrics (PED)</option>
                <option value="IDI">Isolation (IDI)</option>
                <option value="PSR">Post-Surgical (PSR)</option>
                <option value="MAT">Maternity (MAT)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ROW 1: FOUR PRIMARY OVERVIEW CARDS */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted">1. Vital Hospital Statistics</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Total Patients */}
          <div
            className="card p-5 cursor-pointer hover:border-sky-300 transition-all"
            onClick={() => setCurrentPage("patient-management")}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-muted block mb-1">Total Patient Registry</span>
                <div className="text-2xl font-bold font-mono text-main">{hospitalPatientStats.totalPatients.toLocaleString()}</div>
              </div>
              <div className="p-2.5 bg-sky-50 text-primary rounded-xl border border-sky-100">
                <Users size={20} />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-muted">
              <span>Currently Admitted: <strong className="text-main font-mono">{hospitalPatientStats.currentlyAdmitted}</strong></span>
              <span className="text-primary font-semibold flex items-center gap-0.5">View <ChevronRight size={12} /></span>
            </div>
          </div>

          {/* Card 2: Bed Capacity */}
          <div
            className="card p-5 cursor-pointer hover:border-sky-300 transition-all"
            onClick={() => setCurrentPage("bed-management")}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-muted block mb-1">Bed Occupancy Rate</span>
                <div className="text-2xl font-bold font-mono text-main">{metrics.occupancyPercentage}%</div>
              </div>
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
                <BedDouble size={20} />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-muted">
              <span>Free Beds: <strong className="text-emerald-700 font-mono">{metrics.availableBeds} Available</strong></span>
              <span className="text-primary font-semibold flex items-center gap-0.5">Manage <ChevronRight size={12} /></span>
            </div>
          </div>

          {/* Card 3: Medical Workforce */}
          <div
            className="card p-5 cursor-pointer hover:border-sky-300 transition-all"
            onClick={() => setCurrentPage("doctor-management")}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-muted block mb-1">Hospital Staff Presence</span>
                <div className="text-2xl font-bold font-mono text-main">{hospitalWorkforceSummary.totalPresent} <span className="text-sm font-normal text-muted">/ {hospitalWorkforceSummary.totalStaff}</span></div>
              </div>
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
                <Stethoscope size={20} />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-muted">
              <span>{doctorManagementStats.presentToday} Doctors • {nurseManagementStats.presentToday} Nurses</span>
              <span className="text-primary font-semibold flex items-center gap-0.5">Roster <ChevronRight size={12} /></span>
            </div>
          </div>

          {/* Card 4: Emergency Center */}
          <div
            className="card p-5 cursor-pointer hover:border-rose-300 transition-all"
            onClick={() => setCurrentPage("emergency-management")}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-muted block mb-1">Emergency Active</span>
                <div className="text-2xl font-bold font-mono text-rose-700">{emergencyStats.totalEmergencyPatientsToday} Patients</div>
              </div>
              <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
                <Activity size={20} />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-muted">
              <span>Critical: <strong className="text-rose-700 font-mono">{emergencyStats.criticalPatients} Resuscitation</strong></span>
              <span className="text-rose-700 font-semibold flex items-center gap-0.5">Triage <ChevronRight size={12} /></span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ROW 2: PATIENTS & CAPACITY SUMMARY (SIDE BY SIDE) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted">2. Patient & Bed Dynamics</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Patient Overview Card */}
          <div className="card p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-primary" />
                  <h3 className="font-bold text-main text-base">Patient Status Overview</h3>
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setCurrentPage("patient-management")}
                >
                  <span>View All ({hospitalPatientStats.totalPatients})</span>
                  <ChevronRight size={14} />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-muted block">Admitted</span>
                  <span className="text-xl font-bold text-main font-mono">{hospitalPatientStats.currentlyAdmitted}</span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                  <span className="text-[11px] text-emerald-800 font-semibold block">Today's Intake</span>
                  <span className="text-xl font-bold text-emerald-700 font-mono">+{hospitalPatientStats.todaysAdmissions}</span>
                </div>
                <div className="p-3 bg-teal-50 rounded-xl border border-teal-200">
                  <span className="text-[11px] text-teal-800 font-semibold block">Discharges</span>
                  <span className="text-xl font-bold text-teal-700 font-mono">-{hospitalPatientStats.todaysDischarges}</span>
                </div>
                <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
                  <span className="text-[11px] text-rose-800 font-semibold block">Emergency</span>
                  <span className="text-xl font-bold text-rose-700 font-mono">{hospitalPatientStats.emergencyPatients}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100 text-center text-xs">
              <div>
                <span className="text-muted block text-[11px]">Observation</span>
                <span className="font-bold font-mono text-amber-700">{hospitalPatientStats.underObservation} Pts</span>
              </div>
              <div>
                <span className="text-muted block text-[11px]">Awaiting Bed</span>
                <span className="font-bold font-mono text-orange-700">{hospitalPatientStats.awaitingAdmission} Pts</span>
              </div>
              <div>
                <span className="text-muted block text-[11px]">Outpatients</span>
                <span className="font-bold font-mono text-purple-700">{hospitalPatientStats.outpatientsAvailable} Pts</span>
              </div>
            </div>
          </div>

          {/* Bed Capacity Overview Card */}
          <div className="card p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BedDouble size={18} className="text-emerald-600" />
                  <h3 className="font-bold text-main text-base">Bed Capacity Distribution</h3>
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setCurrentPage("bed-management")}
                >
                  <span>Bed Grid</span>
                  <ChevronRight size={14} />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted">Total Hospital Capacity</span>
                  <span className="font-bold text-main font-mono">286 / 350 Beds Occupied</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-sky-600 h-full rounded-full transition-all"
                    style={{ width: `${metrics.occupancyPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-slate-100 text-center text-xs">
              <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-100">
                <span className="text-[10px] text-emerald-800 block">Available</span>
                <span className="font-bold font-mono text-emerald-700">{metrics.availableBeds}</span>
              </div>
              <div className="p-2 bg-sky-50 rounded-lg border border-sky-100">
                <span className="text-[10px] text-sky-800 block">Occupied</span>
                <span className="font-bold font-mono text-sky-700">{metrics.occupiedBeds}</span>
              </div>
              <div className="p-2 bg-amber-50 rounded-lg border border-amber-100">
                <span className="text-[10px] text-amber-800 block">Cleaning</span>
                <span className="font-bold font-mono text-amber-700">{metrics.cleaningBeds}</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-700 block">Reserved</span>
                <span className="font-bold font-mono text-slate-800">{metrics.reservedBeds}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ROW 3: AI INTELLIGENCE SECTION (3 CLEAN CARDS) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-primary" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted">3. AI Operational Intelligence</h2>
          </div>
          <span className="badge badge-ai">Real-Time Machine Learning Optimization</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* AI Feature 1: Capacity Forecast */}
          <div className="card p-5 flex flex-col justify-between border-sky-100">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="badge badge-ai text-[11px]">Predictive Analytics</span>
                <span className="text-xs font-mono text-muted">Next 12 Hours</span>
              </div>
              <h3 className="text-base font-bold text-main">Bed Capacity Forecast</h3>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                Afternoon surge alert: +14 admissions expected between 14:00 - 18:00. General Medicine occupancy will peak at 92%.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-amber-700">Surge Warning (80% cap)</span>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setCurrentPage("capacity-forecasting")}
              >
                <span>Forecast Graph</span>
                <ChevronRight size={13} />
              </button>
            </div>
          </div>

          {/* AI Feature 2: Smart Bed Allocation */}
          <div className="card p-5 flex flex-col justify-between border-sky-100">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="badge badge-ai text-[11px]">Multi-Criteria Optimization</span>
                <span className="text-xs font-mono text-emerald-700 font-bold">98% Match Score</span>
              </div>
              <h3 className="text-base font-bold text-main">Smart Bed Allocation</h3>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                Autonomous algorithm matches clinical urgency, nurse workload, oxygen/telemetry needs, and infection isolation protocols.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-muted font-medium">Ready to allocate</span>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setIsSmartAllocateModalOpen(true)}
              >
                <Sparkles size={13} />
                <span>Run Allocation</span>
              </button>
            </div>
          </div>

          {/* AI Feature 3: Inter-Ward Transfer Recommendations */}
          <div className="card p-5 flex flex-col justify-between border-sky-100">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="badge badge-ai text-[11px]">Step-Down Protocol</span>
                <span className="text-xs font-mono text-primary font-bold">3 Approved Transfers</span>
              </div>
              <h3 className="text-base font-bold text-main">Inter-Ward Transfer AI</h3>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                Proactive recommendation to step down 3 stabilized CCU/ICU patients to Post-Surgical Step-Down to free up critical beds.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-700">Prevents ICU Bottleneck</span>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setCurrentPage("inter-ward-transfer")}
              >
                <span>Review Transfers</span>
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ROW 4: ADMITTED INPATIENTS DIRECTORY (CLEAN TABLE) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted">4. Admitted Inpatients Directory</h2>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setCurrentPage("patient-management")}
          >
            <span>Full Patient Database</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="card p-0 overflow-hidden">
          {/* Table Search & Filter Bar */}
          <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
            <div className="relative max-w-sm flex-1 min-w-[220px]">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                className="form-control pl-9 text-xs"
                placeholder="Search patient name, ID, ward..."
                value={patientSearch}
                onChange={(e) => setPatientSearch(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted font-medium">Condition:</span>
              <select
                className="form-control text-xs py-1 px-2.5 h-auto w-auto"
                value={patientConditionFilter}
                onChange={(e) => setPatientConditionFilter(e.target.value)}
              >
                <option value="All">All Conditions</option>
                <option value="Critical">Critical</option>
                <option value="Serious">Serious</option>
                <option value="Stable">Stable</option>
                <option value="Improving">Improving</option>
                <option value="Under Observation">Under Observation</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="table-container border-0 rounded-none">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Patient Name & ID</th>
                  <th>Age/Gender</th>
                  <th>Ward & Bed</th>
                  <th>Attending Doctor</th>
                  <th>Condition</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAdmittedPatients.slice(0, 6).map((patient) => (
                  <tr key={patient.id}>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <img
                          src={patient.photo}
                          alt={patient.name}
                          className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-200"
                        />
                        <div>
                          <div className="font-bold text-main text-xs">{patient.name}</div>
                          <div className="text-[11px] text-muted font-mono">{patient.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="text-xs text-slate-800 font-medium">{patient.age} yrs • {patient.gender}</div>
                    </td>
                    <td>
                      <span
                        className="font-bold font-mono text-primary cursor-pointer hover:underline text-xs"
                        onClick={() => handleBedClick(patient.bedNumber)}
                      >
                        {patient.bedNumber}
                      </span>
                      <div className="text-[11px] text-muted">{patient.ward}</div>
                    </td>
                    <td>
                      <div className="text-xs text-slate-800">{patient.doctor}</div>
                    </td>
                    <td>
                      <span className={`badge ${getConditionBadgeClass(patient.condition)}`}>
                        {patient.condition}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${getPriorityBadgeClass(patient.priority)}`}>
                        {patient.priority}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-available">
                        {patient.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <button
                          className="btn btn-secondary btn-sm text-[11px] py-1 px-2.5"
                          onClick={() => setCurrentPage("patient-management")}
                          title="View Patient Record"
                        >
                          <Eye size={12} />
                          <span>View</span>
                        </button>
                        <button
                          className="btn btn-danger btn-sm text-[11px] py-1 px-2"
                          onClick={() => dischargePatient(patient.id)}
                          title="Discharge Patient"
                        >
                          <LogOut size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 6. ROW 5: HOSPITAL WORKFORCE OVERVIEW (CLEAN & SPACIOUS) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-primary" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted">5. Hospital Personnel & Workforce</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setCurrentPage("doctor-management")}
            >
              <span>Doctors Directory</span>
              <ChevronRight size={13} />
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setCurrentPage("staff-management")}
            >
              <span>Allied Staff</span>
              <ChevronRight size={13} />
            </button>
          </div>
        </div>

        {/* 4 Clean Category Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Doctors */}
          <div
            className="card p-5 cursor-pointer hover:border-sky-300 transition-all flex flex-col justify-between"
            onClick={() => setCurrentPage("doctor-management")}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-muted uppercase">Doctors</span>
                <span className="badge badge-available text-[11px]">41 Present</span>
              </div>
              <div className="text-2xl font-bold font-mono text-main">{doctorManagementStats.totalDoctors} Total</div>
              <p className="text-xs text-muted mt-1">18 Available • 20 With Patients • 3 Emergency Duty</p>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-primary font-semibold">
              <span>View Physicians</span>
              <ChevronRight size={13} />
            </div>
          </div>

          {/* Nurses */}
          <div
            className="card p-5 cursor-pointer hover:border-teal-300 transition-all flex flex-col justify-between"
            onClick={() => setCurrentPage("staff-management")}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-muted uppercase">Nurses</span>
                <span className="badge badge-available text-[11px]">74 Present</span>
              </div>
              <div className="text-2xl font-bold font-mono text-main">{nurseManagementStats.totalNurses} Total</div>
              <p className="text-xs text-muted mt-1">61 On Duty • 13 Float Pool Available</p>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-primary font-semibold">
              <span>View Roster</span>
              <ChevronRight size={13} />
            </div>
          </div>

          {/* Diagnostic & Pharmacy Staff */}
          <div
            className="card p-5 cursor-pointer hover:border-purple-300 transition-all flex flex-col justify-between"
            onClick={() => setCurrentPage("staff-management")}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-muted uppercase">Lab & Pharmacy</span>
                <span className="badge badge-available text-[11px]">16 Present</span>
              </div>
              <div className="text-2xl font-bold font-mono text-main">18 Technicians</div>
              <p className="text-xs text-muted mt-1">8 Pharmacists • 10 Lab Techs Active</p>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-primary font-semibold">
              <span>Inspect Team</span>
              <ChevronRight size={13} />
            </div>
          </div>

          {/* Admin, Billing & Support Staff */}
          <div
            className="card p-5 cursor-pointer hover:border-slate-400 transition-all flex flex-col justify-between"
            onClick={() => setCurrentPage("staff-management")}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-muted uppercase">Admin & Support</span>
                <span className="badge badge-available text-[11px]">47 Present</span>
              </div>
              <div className="text-2xl font-bold font-mono text-main">51 Personnel</div>
              <p className="text-xs text-muted mt-1">Reception, Billing, porters, sanitization & drivers</p>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-primary font-semibold">
              <span>View All Staff</span>
              <ChevronRight size={13} />
            </div>
          </div>
        </div>
      </section>

      {/* 7. ROW 6: DEPARTMENT LOAD & RECENT ACTIVITIES (SIDE BY SIDE) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted">6. Hospital Operations Stream</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Department Capacity Table */}
          <div className="card p-0 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Building2 size={16} className="text-primary" />
                <h3 className="font-bold text-main text-sm">Department Bed Load</h3>
              </div>
              <span className="text-xs text-muted font-mono">9 Specialties</span>
            </div>

            <div className="table-container border-0 rounded-none max-h-[320px] overflow-y-auto">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Department</th>
                    <th>Doctors</th>
                    <th>Bed Load</th>
                    <th>Occupancy</th>
                  </tr>
                </thead>
                <tbody>
                  {departmentsStatus.slice(0, 6).map((dept) => (
                    <tr key={dept.name}>
                      <td>
                        <div className="font-bold text-main text-xs">{dept.name}</div>
                        <div className="text-[11px] text-muted">{dept.head}</div>
                      </td>
                      <td>
                        <div className="text-xs font-mono">{dept.presentDoctors}/{dept.totalDoctors} Pres</div>
                      </td>
                      <td>
                        <div className="text-xs font-mono">{dept.occupiedBeds}/{dept.totalBeds} beds</div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-200 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${dept.occupancyPct >= 88 ? "bg-red-600" : dept.occupancyPct >= 80 ? "bg-amber-500" : "bg-emerald-600"}`}
                              style={{ width: `${dept.occupancyPct}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold font-mono">{dept.occupancyPct}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Hospital Activities Log */}
          <div className="card p-0 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-primary" />
                <h3 className="font-bold text-main text-sm">Live Hospital Event Log</h3>
              </div>
              <span className="badge badge-sm badge-secondary font-mono">Live Sync</span>
            </div>

            <div className="p-4 max-h-[320px] overflow-y-auto">
              <div className="activity-feed-timeline">
                {recentHospitalActivities.slice(0, 6).map((act) => (
                  <div key={act.id} className="activity-feed-item">
                    <div className={`activity-feed-dot ${act.type}`} />
                    <div className="flex items-center justify-between text-xs mb-0.5">
                      <span className="font-bold text-main">{act.event}</span>
                      <span className="font-mono text-[11px] text-muted">{act.time}</span>
                    </div>
                    <div className="text-xs text-slate-700">{act.person}</div>
                    <div className="text-[11px] text-muted mt-0.5">{act.dept} • <span className="font-semibold text-slate-700">{act.status}</span></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
