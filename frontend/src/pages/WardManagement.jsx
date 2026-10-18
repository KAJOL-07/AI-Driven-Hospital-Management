import React, { useState, useEffect } from "react";
import { useHospital } from "../context/HospitalContext";
import { apiGetWards } from "../services/api";
import {
  Building2,
  BedDouble,
  Users,
  ChevronRight,
  Filter,
  RefreshCw,
  Sparkle
} from "lucide-react";

const WardManagement = () => {
  const { wards: contextWards, setCurrentPage } = useHospital();
  const [wardsList, setWardsList] = useState([]);
  const [selectedFloor, setSelectedFloor] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const fetchWards = async () => {
    try {
      const res = await apiGetWards().catch(() => null);
      if (res && res.data && res.data.length > 0) {
        const mapped = res.data.map((w) => ({
          id: w.id || w._id,
          name: w.name,
          code: w.name.split(" ")[0].toUpperCase().slice(0, 5),
          totalBeds: w.total_beds || w.capacity || 10,
          occupiedBeds: w.occupied_beds || 0,
          availableBeds: w.available_beds || 0,
          cleaningBeds: (w.cleaning_required_beds || 0) + (w.cleaning_in_progress_beds || 0),
          maintenanceBeds: w.maintenance_beds || 0,
          floor: w.floor || "Ground Floor",
          specialty: w.department_name || w.name,
          status: w.occupancy_percentage >= 90 ? "Near Capacity" : w.occupancy_percentage >= 80 ? "High Load" : "Optimal",
          headDoctor: "Specialist Physician",
          chargeNurse: "Lead Ward Nurse",
          nurseToPatientRatio: "1:2",
          ventilatorCount: w.floor === "Ground Floor" ? 6 : 2
        }));
        setWardsList(mapped);
      } else {
        setWardsList(contextWards);
      }
    } catch {
      setWardsList(contextWards);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWards();
  }, [contextWards]);

  const displayedWards = wardsList.filter((w) => {
    if (selectedFloor !== "all" && w.floor !== selectedFloor) return false;
    return true;
  });

  return (
    <div className="ward-management-page space-y-6">
      {/* Header */}
      <div className="card p-6 bg-white border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge badge-ai">15 Authoritative Clinical Wards</span>
              <span className="text-xs text-muted font-mono">{displayedWards.length} Active Wards Listed</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Clinical Ward Directory & Architectural Floor Hierarchy
            </h1>
            <p className="text-sm text-muted mt-1 max-w-2xl">
              Centralized view across all 3 floors: Ground Floor General Ward, First Floor Specialty Inpatient Rooms (101–150), and Second Floor Extended Specialties (201–250).
            </p>
          </div>

          <button
            className="btn btn-secondary btn-sm flex items-center gap-1.5 self-start md:self-auto"
            onClick={fetchWards}
          >
            <RefreshCw size={14} />
            <span>Refresh Wards</span>
          </button>
        </div>

        {/* Floor Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2 flex items-center gap-1">
            <Filter size={13} /> Filter Floor:
          </span>
          {[
            { id: "all", label: "All Floors (15 Wards)" },
            { id: "Ground Floor", label: "Ground Floor (3 Wards)" },
            { id: "First Floor", label: "First Floor (5 Wards)" },
            { id: "Second Floor", label: "Second Floor (7 Wards)" }
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedFloor === f.id
                  ? "bg-primary text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
              onClick={() => setSelectedFloor(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ward Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {displayedWards.map((ward) => {
          const total = ward.totalBeds || 1;
          const occupied = ward.occupiedBeds || 0;
          const occupancyRate = Math.min(100, Math.round((occupied / total) * 100));
          const isNearCapacity = occupancyRate >= 90;
          const isHighDemand = occupancyRate >= 80 && occupancyRate < 90;

          return (
            <div
              key={ward.id}
              className={`card hover:shadow-md transition duration-200 bg-white border border-slate-200 ${
                isNearCapacity ? "border-rose-300 bg-rose-50/20" : ""
              }`}
            >
              {/* Ward Header */}
              <div className="flex justify-between items-start mb-3 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-primary bg-sky-100 px-2 py-0.5 rounded">
                      {ward.code}
                    </span>
                    <h3 className="text-base font-bold text-slate-900">{ward.name}</h3>
                  </div>
                  <span className="text-xs text-muted font-medium block mt-0.5">{ward.floor}</span>
                </div>

                <span
                  className={`badge ${isNearCapacity ? "badge-critical" : isHighDemand ? "badge-cleaning" : "badge-available"}`}
                >
                  {ward.status}
                </span>
              </div>

              {/* Specialty & Acuity */}
              <div className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200 mb-3">
                <strong>Department Focus:</strong> {ward.specialty}
              </div>

              {/* Occupancy Progress Meter */}
              <div className="space-y-1.5 mb-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-muted">Ward Bed Occupancy</span>
                  <span className="font-mono font-bold text-slate-900">
                    {occupied} / {total} ({occupancyRate}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${occupancyRate}%`,
                      backgroundColor: isNearCapacity ? "#ef4444" : isHighDemand ? "#f59e0b" : "#10b981"
                    }}
                  />
                </div>
              </div>

              {/* Departmental Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs py-2 border-y border-slate-100 mb-3">
                <div className="p-1.5 bg-slate-50 rounded">
                  <span className="text-[10px] text-muted uppercase block">Available</span>
                  <span className="text-sm font-bold font-mono text-emerald-600">
                    {ward.availableBeds} Free
                  </span>
                </div>

                <div className="p-1.5 bg-slate-50 rounded">
                  <span className="text-[10px] text-muted uppercase block">Cleaning</span>
                  <span className="text-sm font-bold font-mono text-amber-600">
                    {ward.cleaningBeds || 0}
                  </span>
                </div>

                <div className="p-1.5 bg-slate-50 rounded">
                  <span className="text-[10px] text-muted uppercase block">Total Beds</span>
                  <span className="text-sm font-bold font-mono text-slate-800">
                    {ward.totalBeds} Beds
                  </span>
                </div>
              </div>

              {/* Staff In-Charge */}
              <div className="flex justify-between items-center text-xs text-muted mb-4">
                <span>Physician: <strong className="text-slate-700">{ward.headDoctor}</strong></span>
                <span>Nurse: <strong className="text-slate-700">{ward.chargeNurse}</strong></span>
              </div>

              {/* Quick Action Button */}
              <button
                className="btn btn-secondary btn-sm w-full justify-between font-medium"
                onClick={() => setCurrentPage("floor-management")}
              >
                <span>Navigate to Floor Bed View</span>
                <ChevronRight size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WardManagement;
