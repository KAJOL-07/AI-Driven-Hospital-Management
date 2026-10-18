import React, { useState } from "react";
import { useHospital } from "../context/HospitalContext";
import { Users, Phone, Clock, Search, Shield, User, HeartPulse, Briefcase, Filter, ChevronRight } from "lucide-react";

const StaffManagement = () => {
  const {
    nursesList,
    nurseManagementStats,
    doctorManagementStats,
    otherStaff,
    hospitalWorkforceSummary,
    viewStaffProfile
  } = useHospital();


  const [activeCategory, setActiveCategory] = useState("nurses");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Get active list depending on selected category
  const getActiveStaffList = () => {
    switch (activeCategory) {
      case "nurses":
        return nursesList.map(n => ({ ...n, category: "Nurses", roleTitle: "Registered Nurse", station: n.assignedWard }));
      case "receptionists":
        return otherStaff.receptionists.list.map(r => ({ ...r, category: "Receptionists", roleTitle: "Intake Officer", station: r.assignedCounter }));
      case "pharmacists":
        return otherStaff.pharmacists.list.map(p => ({ ...p, category: "Pharmacists", roleTitle: "Pharmacist", station: p.department }));
      case "labTechs":
        return otherStaff.labTechs.list.map(l => ({ ...l, category: "Lab Technicians", roleTitle: l.specialization, station: l.laboratorySection }));
      case "radiology":
        return otherStaff.radiology.list.map(rad => ({ ...rad, category: "Radiology Staff", roleTitle: rad.specialization, station: rad.radiologySection }));
      case "admin":
        return otherStaff.admin.list.map(adm => ({ ...adm, category: "Administrative", roleTitle: adm.designation, station: adm.department }));
      case "billing":
        return otherStaff.billing.list.map(b => ({ ...b, category: "Billing Staff", roleTitle: b.designation, station: b.department }));
      case "supportStaff":
        return otherStaff.supportStaff.list.map(s => ({ ...s, category: "Support Staff", roleTitle: s.role, station: s.assignedArea }));
      default:
        return nursesList.map(n => ({ ...n, category: "Nurses", roleTitle: "Registered Nurse", station: n.assignedWard }));
    }
  };

  const activeList = getActiveStaffList();

  const filtered = activeList.filter(s => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase()) ||
      (s.roleTitle && s.roleTitle.toLowerCase().includes(search.toLowerCase())) ||
      (s.station && s.station.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === "ALL" || s.currentStatus === statusFilter || s.status === statusFilter || s.availability === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* 1. PAGE TITLE & SHORT DESCRIPTION */}
      <div className="card p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge badge-ai">Hospital Workforce & Allied Health</span>
              <span className="text-xs text-muted font-mono">{hospitalWorkforceSummary.totalStaff - hospitalWorkforceSummary.categories.doctors} Allied Staff Registered</span>
            </div>
            <h1 className="text-2xl font-bold text-main">Nurse & Staff Management</h1>
            <p className="text-sm text-muted mt-1 max-w-2xl">
              Manage nursing staff, clinical technicians, front desk officers, finance personnel, and facilities teams.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="p-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 font-bold">
              ● {hospitalWorkforceSummary.totalPresent - doctorManagementStats.presentToday} Allied Staff Present Today
            </span>
          </div>
        </div>

        {/* 2. IMPORTANT OVERVIEW STATS (5 Balanced Cards) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 mt-6 pt-5 border-t border-slate-100 text-center">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-xs text-muted font-medium block mb-0.5">Total Allied Staff</span>
            <span className="text-2xl font-bold font-mono text-main">
              {hospitalWorkforceSummary.totalStaff - hospitalWorkforceSummary.categories.doctors}
            </span>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
            <span className="text-xs text-emerald-800 font-semibold block mb-0.5">Present Today</span>
            <span className="text-2xl font-bold font-mono text-emerald-700">
              {hospitalWorkforceSummary.totalPresent - doctorManagementStats.presentToday}
            </span>
          </div>
          <div className="p-3 bg-sky-50 rounded-xl border border-sky-200">
            <span className="text-xs text-sky-800 font-semibold block mb-0.5">On Duty</span>
            <span className="text-2xl font-bold font-mono text-sky-700">
              {hospitalWorkforceSummary.totalOnDuty - 23}
            </span>
          </div>
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
            <span className="text-xs text-blue-800 font-semibold block mb-0.5">Available Float</span>
            <span className="text-2xl font-bold font-mono text-blue-700">
              {hospitalWorkforceSummary.totalAvailable - doctorManagementStats.availableNow}
            </span>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
            <span className="text-xs text-amber-800 font-semibold block mb-0.5">On Leave</span>
            <span className="text-2xl font-bold font-mono text-amber-700">
              {hospitalWorkforceSummary.totalOnLeave - doctorManagementStats.onLeave}
            </span>
          </div>
        </div>

        {/* 3. CATEGORY SWITCHER TABS */}
        <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-slate-100">
          {[
            { id: "nurses", label: "Nurses", count: nurseManagementStats.totalNurses },
            { id: "receptionists", label: "Receptionists", count: otherStaff.receptionists.stats.total },
            { id: "pharmacists", label: "Pharmacists", count: otherStaff.pharmacists.stats.total },
            { id: "labTechs", label: "Lab Techs", count: otherStaff.labTechs.stats.total },
            { id: "radiology", label: "Radiology", count: otherStaff.radiology.stats.total },
            { id: "admin", label: "Admin Staff", count: otherStaff.admin.stats.total },
            { id: "billing", label: "Billing & Accounts", count: otherStaff.billing.stats.total },
            { id: "supportStaff", label: "Support & Drivers", count: otherStaff.supportStaff.stats.total }
          ].map(c => (
            <button
              key={c.id}
              className={`btn btn-sm ${activeCategory === c.id ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setActiveCategory(c.id)}
            >
              <span>{c.label}</span>
              <span className="font-mono text-[11px] opacity-80">({c.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. SEARCH & FILTER TOOLBAR */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative flex-1 w-full max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              className="form-control pl-9 text-xs"
              placeholder="Search staff by name, ID, department..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted font-medium">Status:</span>
            <div className="flex gap-1.5">
              {["ALL", "Present", "On Duty", "Available", "On Leave", "Absent"].map(f => (
                <button
                  key={f}
                  className={`btn btn-sm text-xs py-1 px-2.5 ${statusFilter === f ? "btn-primary" : "btn-secondary"}`}
                  onClick={() => setStatusFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 5. STAFF DIRECTORY TABLE */}
      <div className="card p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-primary" />
            <h2 className="font-bold text-main text-sm">Active Staff Roster ({filtered.length})</h2>
          </div>
          <span className="text-xs text-muted font-mono">{activeCategory.toUpperCase()} Unit</span>
        </div>

        <div className="table-container border-0 rounded-none">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Staff Member</th>
                <th>Category</th>
                <th>Role / Designation</th>
                <th>Assigned Station / Ward</th>
                <th>Shift Schedule</th>
                <th>Contact Phone</th>
                <th>Status</th>
                <th>Availability</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <img
                        src={s.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=160"}
                        alt={s.name}
                        className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-200"
                      />
                      <div>
                        <div className="font-bold text-main text-xs">{s.name}</div>
                        <div className="text-[11px] text-muted font-mono">{s.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-sm badge-ai">{s.category}</span>
                  </td>
                  <td>
                    <div className="text-xs font-semibold text-slate-800">{s.roleTitle || s.role || s.designation}</div>
                    <div className="text-[11px] text-muted">{s.qualification || ""}</div>
                  </td>
                  <td>
                    <div className="text-xs text-slate-700">{s.station || s.assignedWard || s.department || "Central Unit"}</div>
                  </td>
                  <td>
                    <div className="text-xs text-slate-700 font-mono">{s.shift}</div>
                  </td>
                  <td>
                    <div className="text-xs font-mono text-muted">{s.phone || "+1 (555) 400-0000"}</div>
                  </td>
                  <td>
                    <span className={`badge ${s.currentStatus === "Present" || s.status === "Present" || s.status === "On Duty" ? "badge-available" : "badge-secondary"}`}>
                      {s.currentStatus || s.status}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${s.availability === "Available" ? "badge-staff-available" : s.availability === "On Duty" ? "badge-staff-present" : "badge-secondary"}`}>
                      {s.availability || "Standard"}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-secondary btn-sm text-[11px] py-1 px-2.5"
                      onClick={() => viewStaffProfile(s)}
                    >
                      <User size={12} />
                      <span>Profile</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StaffManagement;
