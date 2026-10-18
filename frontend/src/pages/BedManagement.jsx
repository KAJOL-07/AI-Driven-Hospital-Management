import React, { useState } from "react";
import { useHospital } from "../context/HospitalContext";
import BedCard from "../components/common/BedCard";
import {
  BedDouble,
  Search,
  Filter,
  Sparkles,
  PlusCircle,
  CheckCircle2,
  Users,
  Sparkle,
  Wrench,
  Wind,
  Activity,
  ShieldAlert,
  Layers
} from "lucide-react";

const BedManagement = () => {
  const {
    beds,
    wards,
    patients,
    setSelectedBed,
    setIsBedDetailsModalOpen,
    setIsSmartAllocateModalOpen,
    setIsAdmitModalOpen,
    dischargePatient,
    updateBedStatus,
    metrics
  } = useHospital();

  const [selectedWard, setSelectedWard] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [filterEquipment, setFilterEquipment] = useState("ALL");
  const [localSearch, setLocalSearch] = useState("");

  const filteredBeds = beds.filter((bed) => {
    // Ward filter
    if (selectedWard !== "ALL" && bed.wardId !== selectedWard) return false;

    // Status filter
    if (selectedStatus !== "ALL" && bed.status !== selectedStatus) return false;

    // Equipment filter
    if (filterEquipment === "VENTILATOR") {
      const hasVent = bed.equipment.some((e) => e.toLowerCase().includes("ventilator") || e.toLowerCase().includes("bipap"));
      if (!hasVent) return false;
    }
    if (filterEquipment === "MONITOR") {
      const hasMon = bed.equipment.some((e) => e.toLowerCase().includes("monitor") || e.toLowerCase().includes("telemetry"));
      if (!hasMon) return false;
    }
    if (filterEquipment === "ISOLATION") {
      const hasIso = bed.equipment.some((e) => e.toLowerCase().includes("negative pressure") || e.toLowerCase().includes("hepa"));
      if (!hasIso) return false;
    }

    // Search filter
    if (localSearch.trim()) {
      const q = localSearch.toLowerCase();
      const matchBedId = bed.id.toLowerCase().includes(q);
      const matchWard = bed.wardName.toLowerCase().includes(q);
      const patient = patients.find((p) => p.id === bed.patientId);
      const matchPatient = patient && (patient.name.toLowerCase().includes(q) || patient.mrn.toLowerCase().includes(q));
      if (!matchBedId && !matchWard && !matchPatient) return false;
    }

    return true;
  });

  const handleSelectBed = (bed) => {
    setSelectedBed(bed);
    setIsBedDetailsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* 1. PAGE TITLE & SHORT DESCRIPTION */}
      <div className="card p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge badge-ai">Bed Telemetry & Capacity</span>
              <span className="text-xs text-muted font-mono">{metrics.totalBeds} Registered Inpatient Beds</span>
            </div>
            <h1 className="text-2xl font-bold text-main">
              Bed Management
            </h1>
            <p className="text-sm text-muted mt-1 max-w-2xl">
              Monitor real-time bed occupancy, clinical equipment configurations, terminal cleaning status, and emergency reservations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              className="btn btn-primary btn-md"
              onClick={() => setIsSmartAllocateModalOpen(true)}
            >
              <Sparkles size={16} />
              <span>Smart Allocation</span>
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

        {/* 2. IMPORTANT STATISTICS CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 mt-6 pt-5 border-t border-slate-100 text-center">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-xs text-muted font-medium block mb-0.5">Total Hospital Beds</span>
            <span className="text-2xl font-bold font-mono text-main">{metrics.totalBeds}</span>
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
            <span className="text-xs text-emerald-800 font-semibold block mb-0.5">Available Free</span>
            <span className="text-2xl font-bold font-mono text-emerald-700">{metrics.availableBeds}</span>
          </div>

          <div className="p-3 bg-sky-50 rounded-xl border border-sky-200">
            <span className="text-xs text-sky-800 font-semibold block mb-0.5">Occupied Beds</span>
            <span className="text-2xl font-bold font-mono text-sky-700">{metrics.occupiedBeds}</span>
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
            <span className="text-xs text-amber-800 font-semibold block mb-0.5">Sanitizing / Cleaning</span>
            <span className="text-2xl font-bold font-mono text-amber-700">{metrics.cleaningBeds}</span>
          </div>

          <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
            <span className="text-xs text-purple-800 font-semibold block mb-0.5">Reserved / Buffer</span>
            <span className="text-2xl font-bold font-mono text-purple-700">{metrics.reservedBeds}</span>
          </div>
        </div>
      </div>

      {/* 3. SEARCH & FILTERS TOOLBAR */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative flex-1 w-full max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search Bed ID (e.g. MICU-01), Ward, or Patient Name..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="form-control pl-9 text-xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-muted font-medium">Ward:</span>
              <select
                className="form-control text-xs py-1 px-2.5 h-auto w-auto"
                value={selectedWard}
                onChange={(e) => setSelectedWard(e.target.value)}
              >
                <option value="ALL">All Wards (10)</option>
                {wards.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-muted font-medium">Status:</span>
              <select
                className="form-control text-xs py-1 px-2.5 h-auto w-auto"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="ALL">All Statuses</option>
                <option value="available">Available ({metrics.availableBeds})</option>
                <option value="occupied">Occupied ({metrics.occupiedBeds})</option>
                <option value="cleaning">Cleaning ({metrics.cleaningBeds})</option>
                <option value="maintenance">Maintenance</option>
                <option value="isolation">Isolation</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-muted font-medium">Equipment:</span>
              <select
                className="form-control text-xs py-1 px-2.5 h-auto w-auto"
                value={filterEquipment}
                onChange={(e) => setFilterEquipment(e.target.value)}
              >
                <option value="ALL">All Equipment</option>
                <option value="VENTILATOR">Ventilator / BiPAP</option>
                <option value="MONITOR">ICU Multi-Monitor</option>
                <option value="ISOLATION">Negative Pressure HEPA</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 4. BED TILES GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredBeds.map((bed) => {
          const patient = patients.find((p) => p.id === bed.patientId);
          return (
            <BedCard
              key={bed.id}
              bed={bed}
              patient={patient}
              onSelect={handleSelectBed}
              onAllocate={() => setIsSmartAllocateModalOpen(true)}
              onDischarge={(id) => dischargePatient(bed.patientId)}
              onStatusChange={(status) => updateBedStatus(bed.id, status)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default BedManagement;
