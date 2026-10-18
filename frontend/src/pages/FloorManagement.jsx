import React, { useState, useEffect, useMemo } from "react";
import { useHospital } from "../context/HospitalContext";
import {
  apiGetFloorStats,
  apiGetBeds,
  apiUpdateBedStatus,
  apiConfigureGroundFloorBeds
} from "../services/api";
import {
  Building2,
  BedDouble,
  Users,
  Search,
  Filter,
  RefreshCw,
  Sparkles,
  Stethoscope,
  HeartPulse,
  Brain,
  Bone,
  Baby,
  Wind,
  CheckCircle2,
  Clock,
  Wrench,
  Sparkle,
  Bookmark,
  DoorOpen,
  ArrowRight,
  PlusCircle,
  Activity,
  AlertTriangle,
  Settings,
  Eye,
  ShieldCheck
} from "lucide-react";

const FloorManagement = () => {
  const {
    authUser,
    currentRoleKey,
    setSelectedBed,
    setIsBedDetailsModalOpen,
    setIsAdmitModalOpen,
    addToast
  } = useHospital();

  const [activeFloor, setActiveFloor] = useState("ground"); // "ground" | "first" | "second"
  const [selectedSpecialty, setSelectedSpecialty] = useState("Cardiology");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Live floor data from backend
  const [floorStats, setFloorStats] = useState({
    ground_floor: {
      total_beds: 50,
      occupied: 0,
      available: 0,
      cleaning_required: 0,
      cleaning_in_progress: 0,
      reserved: 0,
      maintenance: 0,
      admitted_patients: 0
    },
    first_floor: {
      total_rooms: 50,
      total_beds: 50,
      occupied: 0,
      available: 0,
      cleaning_required: 0,
      cleaning_in_progress: 0,
      reserved: 0,
      maintenance: 0,
      admitted_patients: 0,
      specialties: {}
    },
    second_floor: {
      total_rooms: 50,
      total_beds: 50,
      occupied: 0,
      available: 0,
      cleaning_required: 0,
      cleaning_in_progress: 0,
      reserved: 0,
      maintenance: 0,
      admitted_patients: 0,
      specialties: {}
    }
  });

  const [bedsList, setBedsList] = useState([]);

  // Ground Floor Bed Configuration Modal State (Admin)
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [newBedCount, setNewBedCount] = useState(50);
  const [isConfiguring, setIsConfiguring] = useState(false);

  const specialties = [
    { key: "Cardiology", label: "Cardiology", rooms: "Rooms 101–110", prefix: "FF-CAR", icon: HeartPulse, color: "text-rose-500", bg: "bg-rose-50 border-rose-200" },
    { key: "Neurology", label: "Neurology", rooms: "Rooms 111–120", prefix: "FF-NEU", icon: Brain, color: "text-purple-500", bg: "bg-purple-50 border-purple-200" },
    { key: "Orthopedics", label: "Orthopedics", rooms: "Rooms 121–130", prefix: "FF-ORT", icon: Bone, color: "text-amber-500", bg: "bg-amber-50 border-amber-200" },
    { key: "Gynecology", label: "Gynecology", rooms: "Rooms 131–140", prefix: "FF-GYN", icon: Baby, color: "text-pink-500", bg: "bg-pink-50 border-pink-200" },
    { key: "Pulmonology", label: "Pulmonology", rooms: "Rooms 141–150", prefix: "FF-PUL", icon: Wind, color: "text-sky-500", bg: "bg-sky-50 border-sky-200" }
  ];

  const secondFloorSpecialties = [
    { key: "Pediatrics", label: "Pediatrics", rooms: "Rooms 201–210", prefix: "SF-PED", icon: Baby, color: "text-indigo-500", bg: "bg-indigo-50 border-indigo-200", count: 10 },
    { key: "Oncology", label: "Oncology", rooms: "Rooms 211–220", prefix: "SF-ONC", icon: Activity, color: "text-rose-600", bg: "bg-rose-50 border-rose-200", count: 10 },
    { key: "Nephrology", label: "Nephrology", rooms: "Rooms 221–226", prefix: "SF-NEP", icon: HeartPulse, color: "text-teal-600", bg: "bg-teal-50 border-teal-200", count: 6 },
    { key: "Urology", label: "Urology", rooms: "Rooms 227–232", prefix: "SF-URO", icon: Stethoscope, color: "text-blue-600", bg: "bg-blue-50 border-blue-200", count: 6 },
    { key: "ENT", label: "ENT", rooms: "Rooms 233–238", prefix: "SF-ENT", icon: Wind, color: "text-amber-600", bg: "bg-amber-50 border-amber-200", count: 6 },
    { key: "Ophthalmology", label: "Ophthalmology", rooms: "Rooms 239–244", prefix: "SF-OPH", icon: Eye, color: "text-purple-600", bg: "bg-purple-50 border-purple-200", count: 6 },
    { key: "Dermatology", label: "Dermatology", rooms: "Rooms 245–250", prefix: "SF-DER", icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200", count: 6 }
  ];

  // Fetch live stats & beds from backend
  const fetchFloorData = async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    try {
      const [statsRes, bedsRes] = await Promise.all([
        apiGetFloorStats().catch(() => null),
        apiGetBeds().catch(() => null)
      ]);

      if (statsRes && statsRes.data) {
        setFloorStats(statsRes.data);
        if (statsRes.data.ground_floor?.total_beds) {
          setNewBedCount(statsRes.data.ground_floor.total_beds);
        }
      }

      if (bedsRes && bedsRes.data) {
        setBedsList(bedsRes.data);
      }
    } catch (err) {
      console.error("Failed to load floor data:", err);
      addToast("Connection Alert", "Using cached floor telemetry data.", "info");
    } finally {
      setIsLoading(false);
      if (isManual) setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFloorData();
    const interval = setInterval(() => fetchFloorData(), 12000);
    return () => clearInterval(interval);
  }, []);

  // Filtered beds based on active floor & tab
  const displayedBeds = useMemo(() => {
    return bedsList.filter((b) => {
      // 1. Floor Filter
      if (activeFloor === "ground") {
        if (b.floor !== "Ground Floor" && b.room_number) return false;
      } else if (activeFloor === "first") {
        if (b.floor !== "First Floor") return false;
        // First Floor specialty tab
        if (b.specialty?.toLowerCase() !== selectedSpecialty.toLowerCase()) return false;
      } else if (activeFloor === "second") {
        if (b.floor !== "Second Floor") return false;
        // Second Floor specialty tab
        if (b.specialty?.toLowerCase() !== selectedSpecialty.toLowerCase()) return false;
      }

      // 2. Status Filter
      if (statusFilter !== "ALL") {
        if (statusFilter === "cleaning") {
          if (b.status !== "cleaning" && b.status !== "cleaning_required" && b.status !== "cleaning_in_progress") {
            return false;
          }
        } else if (b.status !== statusFilter) {
          return false;
        }
      }

      // 3. Search Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchBed = b.bed_number?.toLowerCase().includes(q);
        const matchRoom = b.room_number?.toLowerCase().includes(q);
        const matchPatient = b.patient_name?.toLowerCase().includes(q) || b.patient_code?.toLowerCase().includes(q);
        const matchDoc = b.doctor_name?.toLowerCase().includes(q);
        if (!matchBed && !matchRoom && !matchPatient && !matchDoc) return false;
      }

      return true;
    });
  }, [bedsList, activeFloor, selectedSpecialty, statusFilter, searchQuery]);

  // Quick Bed Status Update (e.g. mark cleaned)
  const handleQuickStatusChange = async (bedId, newStatus) => {
    try {
      await apiUpdateBedStatus(bedId, newStatus);
      addToast("Status Updated", `Bed status changed to ${newStatus.replace("_", " ").toUpperCase()}`, "success");
      fetchFloorData();
    } catch (err) {
      addToast("Update Failed", err.message, "danger");
    }
  };

  // Admin Configure Ground Floor Beds
  const handleSaveBedConfig = async (e) => {
    e.preventDefault();
    setIsConfiguring(true);
    try {
      const res = await apiConfigureGroundFloorBeds(newBedCount);
      if (res.success) {
        addToast("Configuration Saved", res.message, "success");
        setShowConfigModal(false);
        fetchFloorData();
      }
    } catch (err) {
      addToast("Configuration Error", err.message, "danger");
    } finally {
      setIsConfiguring(false);
    }
  };

  // Helper for Status Badge Styling
  const renderStatusBadge = (status) => {
    switch (status) {
      case "occupied":
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-700 border border-rose-200"><Users size={12} /> Occupied</span>;
      case "available":
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200"><CheckCircle2 size={12} /> Available</span>;
      case "cleaning_required":
      case "cleaning":
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200"><Sparkle size={12} /> Cleaning Required</span>;
      case "cleaning_in_progress":
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200"><Clock size={12} /> Cleaning In Progress</span>;
      case "reserved":
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-200"><Bookmark size={12} /> Reserved</span>;
      case "maintenance":
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-200 text-slate-700 border border-slate-300"><Wrench size={12} /> Maintenance</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  const currentGf = floorStats.ground_floor || {};
  const currentFf = floorStats.first_floor || {};
  const currentSf = floorStats.second_floor || {};
  const currentSpecStats = (activeFloor === "second" ? currentSf.specialties : currentFf.specialties)?.[selectedSpecialty] || {
    total_rooms: 10,
    total_beds: 10,
    occupied: 0,
    available: 0,
    cleaning_required: 0,
    cleaning_in_progress: 0,
    reserved: 0,
    maintenance: 0,
    admitted_patients: 0
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ── Page Header ───────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-primary uppercase tracking-wide">
                <Building2 size={13} /> Architectural Floor Navigation
              </span>
              <span className="text-xs text-muted font-medium">Real-time MongoDB Telemetry</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Hospital Floor & Bed Management
            </h1>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl">
              Strictly segregated multi-floor view: Dedicated Ground Floor General Ward Hall and First Floor Private Specialty Inpatient Rooms.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {activeFloor === "ground" && (currentRoleKey === "ADMIN" || authUser?.role === "admin") && (
              <button
                className="btn btn-secondary btn-sm flex items-center gap-1.5 font-medium"
                onClick={() => setShowConfigModal(true)}
              >
                <Settings size={15} />
                <span>Configure Total Beds</span>
              </button>
            )}
            <button
              className="btn btn-secondary btn-sm flex items-center gap-1.5"
              onClick={() => fetchFloorData(true)}
              disabled={isRefreshing}
            >
              <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
              <span>Refresh Telemetry</span>
            </button>
            <button
              className="btn btn-primary btn-sm flex items-center gap-1.5 font-medium"
              onClick={() => setIsAdmitModalOpen(true)}
            >
              <PlusCircle size={15} />
              <span>Admit Patient</span>
            </button>
          </div>
        </div>

        {/* ── Floor Selection Navigation Bar ────────────────────────── */}
        <div className="flex flex-wrap items-center gap-3 mt-6 pt-5 border-t border-slate-100">
          <button
            type="button"
            className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-bold text-sm transition-all duration-150 cursor-pointer ${
              activeFloor === "ground"
                ? "bg-primary text-white shadow-md shadow-primary/25 scale-[1.01]"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200/80"
            }`}
            onClick={() => {
              setActiveFloor("ground");
              setStatusFilter("ALL");
            }}
          >
            <Building2 size={18} />
            <span>Ground Floor — General Ward</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
              activeFloor === "ground" ? "bg-white/20 text-white" : "bg-white text-slate-700"
            }`}>
              {currentGf.total_beds || 50} Beds
            </span>
          </button>

          <button
            type="button"
            className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-bold text-sm transition-all duration-150 cursor-pointer ${
              activeFloor === "first"
                ? "bg-primary text-white shadow-md shadow-primary/25 scale-[1.01]"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200/80"
            }`}
            onClick={() => {
              setActiveFloor("first");
              setSelectedSpecialty("Cardiology");
              setStatusFilter("ALL");
            }}
          >
            <DoorOpen size={18} />
            <span>First Floor — Specialty Rooms</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
              activeFloor === "first" ? "bg-white/20 text-white" : "bg-white text-slate-700"
            }`}>
              50 Rooms (50 Beds)
            </span>
          </button>

          <button
            type="button"
            className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-bold text-sm transition-all duration-150 cursor-pointer ${
              activeFloor === "second"
                ? "bg-primary text-white shadow-md shadow-primary/25 scale-[1.01]"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200/80"
            }`}
            onClick={() => {
              setActiveFloor("second");
              setSelectedSpecialty("Pediatrics");
              setStatusFilter("ALL");
            }}
          >
            <DoorOpen size={18} />
            <span>Second Floor — Specialty Rooms</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
              activeFloor === "second" ? "bg-white/20 text-white" : "bg-white text-slate-700"
            }`}>
              50 Rooms (50 Beds)
            </span>
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          GROUND FLOOR SECTION
          ══════════════════════════════════════════════════════════════ */}
      {activeFloor === "ground" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Ground Floor Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            <div className="card p-3.5 bg-white border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Beds</span>
              <div className="text-2xl font-black text-slate-900 mt-1">{currentGf.total_beds || 0}</div>
              <span className="text-[11px] text-muted">Configured Hall</span>
            </div>

            <div className="card p-3.5 bg-rose-50/50 border-rose-200">
              <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">Occupied</span>
              <div className="text-2xl font-black text-rose-700 mt-1">{currentGf.occupied || 0}</div>
              <span className="text-[11px] text-rose-600 font-medium">In Use</span>
            </div>

            <div className="card p-3.5 bg-emerald-50/60 border-emerald-200">
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Available</span>
              <div className="text-2xl font-black text-emerald-700 mt-1">{currentGf.available || 0}</div>
              <span className="text-[11px] text-emerald-600 font-medium">Ready For Intake</span>
            </div>

            <div className="card p-3.5 bg-amber-50/50 border-amber-200">
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Cleaning Req.</span>
              <div className="text-2xl font-black text-amber-800 mt-1">{currentGf.cleaning_required || 0}</div>
              <span className="text-[11px] text-amber-700 font-medium">Turnover Needed</span>
            </div>

            <div className="card p-3.5 bg-blue-50/50 border-blue-200">
              <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">Cleaning Active</span>
              <div className="text-2xl font-black text-blue-700 mt-1">{currentGf.cleaning_in_progress || 0}</div>
              <span className="text-[11px] text-blue-600 font-medium">Sanitizing</span>
            </div>

            <div className="card p-3.5 bg-purple-50/50 border-purple-200">
              <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">Reserved</span>
              <div className="text-2xl font-black text-purple-700 mt-1">{currentGf.reserved || 0}</div>
              <span className="text-[11px] text-purple-600 font-medium">Hold for Arrival</span>
            </div>

            <div className="card p-3.5 bg-slate-100 border-slate-300">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Maintenance</span>
              <div className="text-2xl font-black text-slate-800 mt-1">{currentGf.maintenance || 0}</div>
              <span className="text-[11px] text-slate-500 font-medium">Equipment Fix</span>
            </div>

            <div className="card p-3.5 bg-sky-50/60 border-sky-200">
              <span className="text-[11px] font-bold text-primary uppercase tracking-wider">Admitted</span>
              <div className="text-2xl font-black text-primary mt-1">{currentGf.admitted_patients || currentGf.occupied || 0}</div>
              <span className="text-[11px] text-sky-600 font-medium">Active Inpatients</span>
            </div>
          </div>

          {/* General Ward Banner & Filter Controls */}
          <div className="card p-4 bg-white border-slate-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-100 text-primary flex items-center justify-center font-bold">
                  <BedDouble size={20} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Ground Floor → General Ward Hall</h2>
                  <p className="text-xs text-muted">
                    Large communal inpatient hall containing {currentGf.total_beds || 30} individual beds. No private room partitions.
                  </p>
                </div>
              </div>

              {/* Search & Status Filter */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="relative">
                  <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    className="form-control text-xs pl-8 pr-3 py-1.5 w-52"
                    placeholder="Search bed, patient, doctor..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <select
                  className="form-select text-xs py-1.5"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="ALL">All Bed Statuses</option>
                  <option value="available">Available ({currentGf.available || 0})</option>
                  <option value="occupied">Occupied ({currentGf.occupied || 0})</option>
                  <option value="cleaning_required">Cleaning Required ({currentGf.cleaning_required || 0})</option>
                  <option value="cleaning_in_progress">Cleaning In Progress ({currentGf.cleaning_in_progress || 0})</option>
                  <option value="reserved">Reserved ({currentGf.reserved || 0})</option>
                  <option value="maintenance">Maintenance ({currentGf.maintenance || 0})</option>
                </select>
              </div>
            </div>
          </div>

          {/* ── General Ward Shared Hall Grid ────────────────────────── */}
          <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-wider">
                <span>General Ward Bed Matrix</span>
                <span className="text-slate-400">•</span>
                <span>{displayedBeds.length} Beds Shown</span>
              </div>
              <span className="text-xs text-muted">Click any bed card for telemetry & actions</span>
            </div>

            {displayedBeds.length === 0 ? (
              <div className="card p-12 text-center bg-white border-dashed border-slate-300">
                <BedDouble size={36} className="text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">No beds match the current filter</p>
                <p className="text-xs text-muted mt-1">Try resetting the status filter or search query</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
                {displayedBeds.map((bed) => {
                  const isOccupied = bed.status === "occupied" && bed.patient_name;
                  const isCleaningReq = bed.status === "cleaning_required" || bed.status === "cleaning";
                  const isCleaningActive = bed.status === "cleaning_in_progress";

                  return (
                    <div
                      key={bed.id}
                      className={`card p-4 transition-all duration-150 hover:shadow-md cursor-pointer border ${
                        isOccupied
                          ? "bg-white border-rose-200 hover:border-rose-300"
                          : bed.status === "available"
                          ? "bg-white border-emerald-200 hover:border-emerald-300"
                          : isCleaningReq
                          ? "bg-white border-amber-200 hover:border-amber-300"
                          : isCleaningActive
                          ? "bg-white border-blue-200 hover:border-blue-300"
                          : "bg-white border-slate-200"
                      }`}
                      onClick={() => {
                        setSelectedBed({
                          id: bed.bed_number,
                          bedNumber: bed.bed_number,
                          wardId: bed.ward_id,
                          wardName: bed.ward_name || "General Ward Hall",
                          floor: "Ground Floor",
                          status: bed.status,
                          patientId: bed.patient_id,
                          patientName: bed.patient_name,
                          doctor: bed.doctor_name,
                          nurse: "Nurse Sarah Jenkins",
                          lastCleaned: bed.last_cleaned,
                          equipment: ["Wall Oxygen", "Telemetry Monitor", "Call Button"]
                        });
                        setIsBedDetailsModalOpen(true);
                      }}
                    >
                      {/* Bed Number Header & Status */}
                      <div className="flex items-center justify-between gap-1 mb-2.5">
                        <span className="text-sm font-black text-slate-900 font-mono tracking-wide">
                          {bed.bed_number}
                        </span>
                        {renderStatusBadge(bed.status)}
                      </div>

                      {/* Bed State Content */}
                      {isOccupied ? (
                        <div className="space-y-1.5 pt-1 border-t border-slate-100">
                          <div>
                            <div className="text-xs font-bold text-slate-900 truncate">
                              {bed.patient_name}
                            </div>
                            <div className="text-[11px] text-muted font-mono">
                              {bed.patient_code || "Inpatient"}
                            </div>
                          </div>
                          <div className="text-[11px] text-slate-600 flex items-center gap-1">
                            <Stethoscope size={11} className="text-primary shrink-0" />
                            <span className="truncate">{bed.doctor_name || "Dr. Kevin Zhang"}</span>
                          </div>
                          {bed.admission_reason && (
                            <div className="text-[10px] text-slate-500 bg-slate-50 p-1.5 rounded truncate">
                              {bed.admission_reason}
                            </div>
                          )}
                        </div>
                      ) : isCleaningReq ? (
                        <div className="space-y-2 pt-1 border-t border-slate-100">
                          <p className="text-[11px] text-amber-800 font-medium">Turnover sanitization required</p>
                          <button
                            type="button"
                            className="btn btn-xs w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuickStatusChange(bed.id, "cleaning_in_progress");
                            }}
                          >
                            <Sparkle size={11} />
                            <span>Start Cleaning</span>
                          </button>
                        </div>
                      ) : isCleaningActive ? (
                        <div className="space-y-2 pt-1 border-t border-slate-100">
                          <p className="text-[11px] text-blue-700 font-medium">Sanitization in progress</p>
                          <button
                            type="button"
                            className="btn btn-xs w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuickStatusChange(bed.id, "available");
                            }}
                          >
                            <CheckCircle2 size={11} />
                            <span>Confirm Cleaned</span>
                          </button>
                        </div>
                      ) : bed.status === "available" ? (
                        <div className="space-y-2 pt-1 border-t border-slate-100 text-center">
                          <p className="text-[11px] text-emerald-700 font-medium">Ready for intake</p>
                          <button
                            type="button"
                            className="btn btn-xs w-full btn-primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsAdmitModalOpen(true);
                            }}
                          >
                            <span>Admit Patient</span>
                          </button>
                        </div>
                      ) : (
                        <div className="pt-1 border-t border-slate-100">
                          <p className="text-[11px] text-slate-500 italic capitalize">{bed.status}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          FIRST FLOOR SECTION (SPECIALTY-WISE ROOMS)
          ══════════════════════════════════════════════════════════════ */}
      {activeFloor === "first" && (
        <div className="space-y-6 animate-fadeIn">
          {/* First Floor Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-9 gap-2.5">
            <div className="card p-3 bg-white border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Rooms</span>
              <div className="text-xl font-black text-slate-900 mt-1">{currentFf.total_rooms || 50}</div>
              <span className="text-[10px] text-muted">1 Bed / Room</span>
            </div>

            <div className="card p-3 bg-white border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Beds</span>
              <div className="text-xl font-black text-slate-900 mt-1">{currentFf.total_beds || 50}</div>
              <span className="text-[10px] text-muted">5 Specialties</span>
            </div>

            <div className="card p-3 bg-rose-50/50 border-rose-200">
              <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider">Occupied</span>
              <div className="text-xl font-black text-rose-700 mt-1">{currentFf.occupied || 0}</div>
              <span className="text-[10px] text-rose-600 font-medium">Inpatients</span>
            </div>

            <div className="card p-3 bg-emerald-50/60 border-emerald-200">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Available</span>
              <div className="text-xl font-black text-emerald-700 mt-1">{currentFf.available || 0}</div>
              <span className="text-[10px] text-emerald-600 font-medium">Ready Rooms</span>
            </div>

            <div className="card p-3 bg-amber-50/50 border-amber-200">
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Cleaning Req.</span>
              <div className="text-xl font-black text-amber-800 mt-1">{currentFf.cleaning_required || 0}</div>
              <span className="text-[10px] text-amber-700 font-medium">Turnover</span>
            </div>

            <div className="card p-3 bg-blue-50/50 border-blue-200">
              <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Cleaning Active</span>
              <div className="text-xl font-black text-blue-700 mt-1">{currentFf.cleaning_in_progress || 0}</div>
              <span className="text-[10px] text-blue-600 font-medium">In Progress</span>
            </div>

            <div className="card p-3 bg-purple-50/50 border-purple-200">
              <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">Reserved</span>
              <div className="text-xl font-black text-purple-700 mt-1">{currentFf.reserved || 0}</div>
              <span className="text-[10px] text-purple-600 font-medium">Booked</span>
            </div>

            <div className="card p-3 bg-slate-100 border-slate-300">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Maintenance</span>
              <div className="text-xl font-black text-slate-800 mt-1">{currentFf.maintenance || 0}</div>
              <span className="text-[10px] text-slate-500 font-medium">Repairs</span>
            </div>

            <div className="card p-3 bg-sky-50/60 border-sky-200">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Admitted</span>
              <div className="text-xl font-black text-primary mt-1">{currentFf.admitted_patients || currentFf.occupied || 0}</div>
              <span className="text-[10px] text-sky-600 font-medium">Inpatients</span>
            </div>
          </div>

          {/* ── First Floor Specialty Navigation Tabs ─────────────────── */}
          <div className="card p-4 bg-white border-slate-200">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Select Medical Specialty Department (10 Rooms Each)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {specialties.map((spec) => {
                const IconComp = spec.icon;
                const isSelected = selectedSpecialty === spec.key;
                const specData = currentFf.specialties?.[spec.key] || {};

                return (
                  <button
                    key={spec.key}
                    type="button"
                    className={`p-3.5 rounded-xl border text-left transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? "bg-sky-50 border-primary ring-2 ring-primary/20 shadow-xs"
                        : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60"
                    }`}
                    onClick={() => {
                      setSelectedSpecialty(spec.key);
                      setStatusFilter("ALL");
                    }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className={`p-1.5 rounded-lg ${spec.bg}`}>
                        <IconComp size={18} className={spec.color} />
                      </div>
                      <span className="text-xs font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200 font-mono">
                        {spec.rooms}
                      </span>
                    </div>
                    <div className="font-bold text-sm text-slate-900">{spec.label}</div>
                    <div className="flex items-center justify-between text-xs text-muted mt-1">
                      <span>10 Rooms</span>
                      <span className="text-emerald-700 font-semibold">{specData.available ?? 0} Free</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Specialty Detail Bar & Search */}
          <div className="card p-4 bg-white border-slate-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900">
                    First Floor → {selectedSpecialty} Wing
                  </h2>
                  <span className="badge badge-secondary text-xs font-mono">
                    {specialties.find((s) => s.key === selectedSpecialty)?.rooms}
                  </span>
                </div>
                <p className="text-xs text-muted mt-0.5">
                  10 Private Specialty Inpatient Rooms • Exactly 1 Bed Per Room • Separate Room & Bed Identifiers
                </p>
              </div>

              {/* Status Filter for Selected Specialty */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="relative">
                  <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    className="form-control text-xs pl-8 pr-3 py-1.5 w-48"
                    placeholder="Search room, bed, patient..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <select
                  className="form-select text-xs py-1.5"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="ALL">All Statuses ({displayedBeds.length})</option>
                  <option value="available">Available ({currentSpecStats.available || 0})</option>
                  <option value="occupied">Occupied ({currentSpecStats.occupied || 0})</option>
                  <option value="cleaning_required">Cleaning Required ({currentSpecStats.cleaning_required || 0})</option>
                  <option value="cleaning_in_progress">Cleaning In Progress ({currentSpecStats.cleaning_in_progress || 0})</option>
                  <option value="reserved">Reserved ({currentSpecStats.reserved || 0})</option>
                  <option value="maintenance">Maintenance ({currentSpecStats.maintenance || 0})</option>
                </select>
              </div>
            </div>
          </div>

          {/* ── Specialty Room-by-Room Card Grid ──────────────────────── */}
          <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-wider">
                <span>{selectedSpecialty} Individual Inpatient Rooms</span>
                <span className="text-slate-400">•</span>
                <span>{displayedBeds.length} Rooms Displayed</span>
              </div>
              <span className="text-xs text-muted">Each room contains exactly one bed with separate identifiers</span>
            </div>

            {displayedBeds.length === 0 ? (
              <div className="card p-12 text-center bg-white border-dashed border-slate-300">
                <DoorOpen size={36} className="text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">No rooms match the current search / filter</p>
                <p className="text-xs text-muted mt-1">Try resetting the status filter above</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {displayedBeds.map((bed) => {
                  const isOccupied = bed.status === "occupied" && bed.patient_name;
                  const isCleaningReq = bed.status === "cleaning_required" || bed.status === "cleaning";
                  const isCleaningActive = bed.status === "cleaning_in_progress";

                  return (
                    <div
                      key={bed.id}
                      className={`card p-4 transition-all duration-150 hover:shadow-md cursor-pointer border ${
                        isOccupied
                          ? "bg-white border-rose-200 hover:border-rose-300"
                          : bed.status === "available"
                          ? "bg-white border-emerald-200 hover:border-emerald-300"
                          : isCleaningReq
                          ? "bg-white border-amber-200 hover:border-amber-300"
                          : isCleaningActive
                          ? "bg-white border-blue-200 hover:border-blue-300"
                          : "bg-white border-slate-200"
                      }`}
                      onClick={() => {
                        setSelectedBed({
                          id: bed.bed_number,
                          bedNumber: bed.bed_number,
                          roomNumber: bed.room_number,
                          wardId: bed.ward_id,
                          wardName: bed.ward_name || `${bed.specialty} Specialty Ward`,
                          floor: "First Floor",
                          specialty: bed.specialty,
                          status: bed.status,
                          patientId: bed.patient_id,
                          patientName: bed.patient_name,
                          doctor: bed.doctor_name,
                          nurse: "Nurse Michael Scott",
                          lastCleaned: bed.last_cleaned,
                          equipment: ["Dedicated Oxygen Supply", "Private Telemetry Monitor", "IV Infusion Pump", "Private En-Suite"]
                        });
                        setIsBedDetailsModalOpen(true);
                      }}
                    >
                      {/* CRITICAL REQUIREMENT: ROOM NUMBER & BED NUMBER SHOWN SEPARATELY */}
                      <div className="pb-2.5 mb-2.5 border-b border-slate-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <DoorOpen size={16} className="text-primary" />
                            <span className="text-base font-black text-slate-900 tracking-tight">
                              Room No: {bed.room_number || "—"}
                            </span>
                          </div>
                          {renderStatusBadge(bed.status)}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-500 font-mono mt-1 font-semibold">
                          <BedDouble size={13} className="text-slate-400" />
                          <span>Bed No: <strong className="text-slate-800">{bed.bed_number}</strong></span>
                        </div>
                      </div>

                      {/* Room Occupancy Content */}
                      {isOccupied ? (
                        <div className="space-y-1.5">
                          <div>
                            <div className="text-xs font-bold text-slate-900 truncate">
                              {bed.patient_name}
                            </div>
                            <div className="text-[11px] text-muted font-mono">
                              {bed.patient_code || "Admitted"}
                            </div>
                          </div>
                          <div className="text-[11px] text-slate-600 flex items-center gap-1">
                            <Stethoscope size={11} className="text-primary shrink-0" />
                            <span className="truncate">{bed.doctor_name || "Specialist Physician"}</span>
                          </div>
                          {bed.admission_reason && (
                            <div className="text-[10px] text-slate-500 bg-slate-50 p-1.5 rounded truncate">
                              {bed.admission_reason}
                            </div>
                          )}
                        </div>
                      ) : isCleaningReq ? (
                        <div className="space-y-2 text-center">
                          <p className="text-[11px] text-amber-800 font-medium">Turnover sanitization required</p>
                          <button
                            type="button"
                            className="btn btn-xs w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuickStatusChange(bed.id, "cleaning_in_progress");
                            }}
                          >
                            <Sparkle size={11} />
                            <span>Start Cleaning</span>
                          </button>
                        </div>
                      ) : isCleaningActive ? (
                        <div className="space-y-2 text-center">
                          <p className="text-[11px] text-blue-700 font-medium">Sanitization in progress</p>
                          <button
                            type="button"
                            className="btn btn-xs w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuickStatusChange(bed.id, "available");
                            }}
                          >
                            <CheckCircle2 size={11} />
                            <span>Confirm Cleaned</span>
                          </button>
                        </div>
                      ) : bed.status === "available" ? (
                        <div className="space-y-2 text-center">
                          <p className="text-[11px] text-emerald-700 font-medium">Room ready for patient</p>
                          <button
                            type="button"
                            className="btn btn-xs w-full btn-primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsAdmitModalOpen(true);
                            }}
                          >
                            <span>Admit to Room</span>
                          </button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <p className="text-[11px] text-slate-500 italic capitalize">{bed.status}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          SECOND FLOOR SECTION (EXTENDED SPECIALTY ROOMS: 201–250)
          ══════════════════════════════════════════════════════════════ */}
      {activeFloor === "second" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Second Floor Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-9 gap-2.5">
            <div className="card p-3 bg-white border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Rooms</span>
              <div className="text-xl font-black text-slate-900 mt-1">{currentSf.total_rooms || 50}</div>
              <span className="text-[10px] text-muted">1 Bed / Room</span>
            </div>

            <div className="card p-3 bg-white border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Beds</span>
              <div className="text-xl font-black text-slate-900 mt-1">{currentSf.total_beds || 50}</div>
              <span className="text-[10px] text-muted">7 Specialties</span>
            </div>

            <div className="card p-3 bg-rose-50/50 border-rose-200">
              <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider">Occupied</span>
              <div className="text-xl font-black text-rose-700 mt-1">{currentSf.occupied || 0}</div>
              <span className="text-[10px] text-rose-600 font-medium">Inpatients</span>
            </div>

            <div className="card p-3 bg-emerald-50/60 border-emerald-200">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Available</span>
              <div className="text-xl font-black text-emerald-700 mt-1">{currentSf.available || 0}</div>
              <span className="text-[10px] text-emerald-600 font-medium">Ready Rooms</span>
            </div>

            <div className="card p-3 bg-amber-50/50 border-amber-200">
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Cleaning Req.</span>
              <div className="text-xl font-black text-amber-800 mt-1">{currentSf.cleaning_required || 0}</div>
              <span className="text-[10px] text-amber-700 font-medium">Turnover</span>
            </div>

            <div className="card p-3 bg-blue-50/50 border-blue-200">
              <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Cleaning Active</span>
              <div className="text-xl font-black text-blue-700 mt-1">{currentSf.cleaning_in_progress || 0}</div>
              <span className="text-[10px] text-blue-600 font-medium">In Progress</span>
            </div>

            <div className="card p-3 bg-purple-50/50 border-purple-200">
              <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">Reserved</span>
              <div className="text-xl font-black text-purple-700 mt-1">{currentSf.reserved || 0}</div>
              <span className="text-[10px] text-purple-600 font-medium">Booked</span>
            </div>

            <div className="card p-3 bg-slate-100 border-slate-300">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Maintenance</span>
              <div className="text-xl font-black text-slate-800 mt-1">{currentSf.maintenance || 0}</div>
              <span className="text-[10px] text-slate-500 font-medium">Repairs</span>
            </div>

            <div className="card p-3 bg-sky-50/60 border-sky-200">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Admitted</span>
              <div className="text-xl font-black text-primary mt-1">{currentSf.admitted_patients || currentSf.occupied || 0}</div>
              <span className="text-[10px] text-sky-600 font-medium">Inpatients</span>
            </div>
          </div>

          {/* ── Second Floor Specialty Navigation Tabs ─────────────────── */}
          <div className="card p-4 bg-white border-slate-200">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Select Second Floor Medical Specialty Department (Rooms 201–250)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {secondFloorSpecialties.map((spec) => {
                const IconComp = spec.icon;
                const isSelected = selectedSpecialty === spec.key;
                const specData = currentSf.specialties?.[spec.key] || {};

                return (
                  <button
                    key={spec.key}
                    type="button"
                    className={`p-3 rounded-xl border text-left transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? "bg-sky-50 border-primary ring-2 ring-primary/20 shadow-xs"
                        : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60"
                    }`}
                    onClick={() => {
                      setSelectedSpecialty(spec.key);
                      setStatusFilter("ALL");
                    }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className={`p-1.5 rounded-lg ${spec.bg}`}>
                        <IconComp size={16} className={spec.color} />
                      </div>
                      <span className="text-[11px] font-bold text-slate-700 bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono">
                        {spec.rooms}
                      </span>
                    </div>
                    <div className="font-bold text-xs text-slate-900 truncate">{spec.label}</div>
                    <div className="flex items-center justify-between text-[11px] text-muted mt-1">
                      <span>{spec.count} Rms</span>
                      <span className="text-emerald-700 font-semibold">{specData.available ?? 0} Free</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Specialty Detail Bar & Search */}
          <div className="card p-4 bg-white border-slate-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900">
                    Second Floor → {selectedSpecialty} Wing
                  </h2>
                  <span className="badge badge-secondary text-xs font-mono">
                    {secondFloorSpecialties.find((s) => s.key === selectedSpecialty)?.rooms}
                  </span>
                </div>
                <p className="text-xs text-muted mt-0.5">
                  Private Specialty Inpatient Rooms • Exactly 1 Bed Per Room • Separate Room & Bed Identifiers
                </p>
              </div>

              {/* Status Filter for Selected Specialty */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="relative">
                  <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    className="form-control text-xs pl-8 pr-3 py-1.5 w-48"
                    placeholder="Search room, bed, patient..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <select
                  className="form-select text-xs py-1.5"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="ALL">All Statuses ({displayedBeds.length})</option>
                  <option value="available">Available ({currentSpecStats.available || 0})</option>
                  <option value="occupied">Occupied ({currentSpecStats.occupied || 0})</option>
                  <option value="cleaning_required">Cleaning Required ({currentSpecStats.cleaning_required || 0})</option>
                  <option value="cleaning_in_progress">Cleaning In Progress ({currentSpecStats.cleaning_in_progress || 0})</option>
                  <option value="reserved">Reserved ({currentSpecStats.reserved || 0})</option>
                  <option value="maintenance">Maintenance ({currentSpecStats.maintenance || 0})</option>
                </select>
              </div>
            </div>
          </div>

          {/* ── Specialty Room-by-Room Card Grid ──────────────────────── */}
          <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-wider">
                <span>{selectedSpecialty} Individual Inpatient Rooms</span>
                <span className="text-slate-400">•</span>
                <span>{displayedBeds.length} Rooms Displayed</span>
              </div>
              <span className="text-xs text-muted">Each room contains exactly one bed with separate identifiers</span>
            </div>

            {displayedBeds.length === 0 ? (
              <div className="card p-12 text-center bg-white border-dashed border-slate-300">
                <DoorOpen size={36} className="text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">No rooms match the current search / filter</p>
                <p className="text-xs text-muted mt-1">Try resetting the status filter above</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {displayedBeds.map((bed) => {
                  const isOccupied = bed.status === "occupied" && bed.patient_name;
                  const isCleaningReq = bed.status === "cleaning_required" || bed.status === "cleaning";
                  const isCleaningActive = bed.status === "cleaning_in_progress";

                  return (
                    <div
                      key={bed.id}
                      className={`card p-4 transition-all duration-150 hover:shadow-md cursor-pointer border ${
                        isOccupied
                          ? "bg-white border-rose-200 hover:border-rose-300"
                          : bed.status === "available"
                          ? "bg-white border-emerald-200 hover:border-emerald-300"
                          : isCleaningReq
                          ? "bg-white border-amber-200 hover:border-amber-300"
                          : isCleaningActive
                          ? "bg-white border-blue-200 hover:border-blue-300"
                          : "bg-white border-slate-200"
                      }`}
                      onClick={() => {
                        setSelectedBed({
                          id: bed.bed_number,
                          bedNumber: bed.bed_number,
                          roomNumber: bed.room_number,
                          wardId: bed.ward_id,
                          wardName: bed.ward_name || `${bed.specialty} Specialty Ward`,
                          floor: "Second Floor",
                          specialty: bed.specialty,
                          status: bed.status,
                          patientId: bed.patient_id,
                          patientName: bed.patient_name,
                          doctor: bed.doctor_name,
                          nurse: "Charge Nurse",
                          lastCleaned: bed.last_cleaned,
                          equipment: ["Specialized Bed Monitoring", "Wall Oxygen", "IV Infusion Pump", "Private En-Suite"]
                        });
                        setIsBedDetailsModalOpen(true);
                      }}
                    >
                      {/* CRITICAL REQUIREMENT: ROOM NUMBER & BED NUMBER SHOWN SEPARATELY */}
                      <div className="pb-2.5 mb-2.5 border-b border-slate-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <DoorOpen size={16} className="text-primary" />
                            <span className="text-base font-black text-slate-900 tracking-tight">
                              Room No: {bed.room_number || "—"}
                            </span>
                          </div>
                          {renderStatusBadge(bed.status)}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-500 font-mono mt-1 font-semibold">
                          <BedDouble size={13} className="text-slate-400" />
                          <span>Bed No: <strong className="text-slate-800">{bed.bed_number}</strong></span>
                        </div>
                      </div>

                      {/* Room Occupancy Content */}
                      {isOccupied ? (
                        <div className="space-y-1.5">
                          <div>
                            <div className="text-xs font-bold text-slate-900 truncate">
                              {bed.patient_name}
                            </div>
                            <div className="text-[11px] text-muted font-mono">
                              {bed.patient_code || "Admitted"}
                            </div>
                          </div>
                          <div className="text-[11px] text-slate-600 flex items-center gap-1">
                            <Stethoscope size={11} className="text-primary shrink-0" />
                            <span className="truncate">{bed.doctor_name || "Specialist Physician"}</span>
                          </div>
                          {bed.admission_reason && (
                            <div className="text-[10px] text-slate-500 bg-slate-50 p-1.5 rounded truncate">
                              {bed.admission_reason}
                            </div>
                          )}
                        </div>
                      ) : isCleaningReq ? (
                        <div className="space-y-2 text-center">
                          <p className="text-[11px] text-amber-800 font-medium">Turnover sanitization required</p>
                          <button
                            type="button"
                            className="btn btn-xs w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuickStatusChange(bed.id, "cleaning_in_progress");
                            }}
                          >
                            <Sparkle size={11} />
                            <span>Start Cleaning</span>
                          </button>
                        </div>
                      ) : isCleaningActive ? (
                        <div className="space-y-2 text-center">
                          <p className="text-[11px] text-blue-700 font-medium">Sanitization in progress</p>
                          <button
                            type="button"
                            className="btn btn-xs w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuickStatusChange(bed.id, "available");
                            }}
                          >
                            <CheckCircle2 size={11} />
                            <span>Confirm Cleaned</span>
                          </button>
                        </div>
                      ) : bed.status === "available" ? (
                        <div className="space-y-2 text-center">
                          <p className="text-[11px] text-emerald-700 font-medium">Room ready for patient</p>
                          <button
                            type="button"
                            className="btn btn-xs w-full btn-primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsAdmitModalOpen(true);
                            }}
                          >
                            <span>Admit to Room</span>
                          </button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <p className="text-[11px] text-slate-500 italic capitalize">{bed.status}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Admin Configure Ground Floor Beds Modal ───────────────── */}
      {showConfigModal && (
        <div className="modal-overlay" onClick={() => setShowConfigModal(false)}>
          <div className="modal-content max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-sky-100 rounded-lg text-primary">
                  <Settings size={20} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Configure General Ward Beds</h2>
                  <p className="text-xs text-muted">Ground Floor Capacity Management</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSaveBedConfig}>
              <div className="modal-body space-y-4">
                <p className="text-xs text-slate-600">
                  As Hospital Admin, configure the total number of physical beds in the Ground Floor General Ward Hall.
                  Beds will be automatically provisioned with IDs (e.g. <code>GW-B001</code> to <code>GW-B{newBedCount.toString().padStart(3, "0")}</code>).
                </p>

                <div className="form-group">
                  <label className="form-label">Total Bed Count (1 - 100)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    className="form-control"
                    value={newBedCount}
                    onChange={(e) => setNewBedCount(Number(e.target.value))}
                    required
                  />
                  <span className="text-[11px] text-muted mt-1 block">
                    Current beds in database: {currentGf.total_beds || 30}
                  </span>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowConfigModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={isConfiguring}
                >
                  {isConfiguring ? "Updating..." : "Save Configuration"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloorManagement;
