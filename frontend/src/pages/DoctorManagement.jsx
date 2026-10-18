import React, { useState } from "react";
import { useHospital } from "../context/HospitalContext";
import { UserCheck, Phone, Mail, Clock, Search, Stethoscope, User, Building2, ChevronRight } from "lucide-react";

const DoctorManagement = () => {
  const { doctorsList, doctorManagementStats, viewStaffProfile } = useHospital();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [deptFilter, setDeptFilter] = useState("ALL");

  const filtered = doctorsList.filter(d => {
    const matchSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      (d.specialization && d.specialization.toLowerCase().includes(search.toLowerCase())) ||
      (d.department && d.department.toLowerCase().includes(search.toLowerCase()));
    const matchFilter = filter === "ALL" || d.currentStatus === filter || d.status === filter || d.availability === filter;
    const matchDept = deptFilter === "ALL" || d.department === deptFilter;
    return matchSearch && matchFilter && matchDept;
  });

  return (
    <div className="space-y-6">
      {/* 1. PAGE TITLE & SHORT DESCRIPTION */}
      <div className="card p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge badge-ai">Medical Staff Directory</span>
              <span className="text-xs text-muted font-mono">{doctorManagementStats.totalDoctors} Board Certified Physicians</span>
            </div>
            <h1 className="text-2xl font-bold text-main">Doctor Management</h1>
            <p className="text-sm text-muted mt-1 max-w-2xl">
              Manage attending physicians, consultants, emergency specialists and clinical inpatient assignments.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="p-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 font-bold">
              ● {doctorManagementStats.presentToday} Present Today (85.4%)
            </span>
          </div>
        </div>

        {/* 2. IMPORTANT STATISTICS (5 Balanced Cards) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 mt-6 pt-5 border-t border-slate-100 text-center">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-xs text-muted font-medium block mb-0.5">Total Doctors</span>
            <span className="text-2xl font-bold font-mono text-main">{doctorManagementStats.totalDoctors}</span>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
            <span className="text-xs text-emerald-800 font-semibold block mb-0.5">Present Today</span>
            <span className="text-2xl font-bold font-mono text-emerald-700">{doctorManagementStats.presentToday}</span>
          </div>
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
            <span className="text-xs text-blue-800 font-semibold block mb-0.5">Available Now</span>
            <span className="text-2xl font-bold font-mono text-blue-700">{doctorManagementStats.availableNow}</span>
          </div>
          <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
            <span className="text-xs text-purple-800 font-semibold block mb-0.5">With Patients</span>
            <span className="text-2xl font-bold font-mono text-purple-700">{doctorManagementStats.withPatients}</span>
          </div>
          <div className="p-3 bg-red-50 rounded-xl border border-red-200">
            <span className="text-xs text-red-800 font-semibold block mb-0.5">Emergency Duty</span>
            <span className="text-2xl font-bold font-mono text-red-700">{doctorManagementStats.emergencyDuty}</span>
          </div>
        </div>
      </div>

      {/* 3. SEARCH & FILTERS TOOLBAR */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative flex-1 w-full max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              className="form-control pl-9 text-xs"
              placeholder="Search by name, specialty, department..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-muted font-medium">Department:</span>
              <select
                className="form-control text-xs py-1 px-2.5 h-auto w-auto"
                value={deptFilter}
                onChange={e => setDeptFilter(e.target.value)}
              >
                <option value="ALL">All Departments (15)</option>
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

            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-muted font-medium">Status:</span>
              <select
                className="form-control text-xs py-1 px-2.5 h-auto w-auto"
                value={filter}
                onChange={e => setFilter(e.target.value)}
              >
                <option value="ALL">All Statuses</option>
                <option value="Present">Present</option>
                <option value="Available">Available</option>
                <option value="With Patients">With Patients</option>
                <option value="Emergency Duty">Emergency Duty</option>
                <option value="On Leave">On Leave</option>
                <option value="Absent">Absent</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 4. DOCTOR CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(doc => (
          <div key={doc.id} className="card p-5 flex flex-col justify-between hover:border-sky-300 transition-all">
            <div>
              <div className="flex items-start gap-3.5">
                <img
                  src={doc.photo}
                  alt={doc.name}
                  className="w-13 h-13 rounded-2xl object-cover border border-slate-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-main truncate text-sm">{doc.name}</div>
                  <div className="text-xs text-muted truncate">{doc.specialization}</div>
                  <div className="flex flex-wrap items-center gap-1 mt-1.5">
                    <span className={`badge text-[11px] ${doc.currentStatus === "Present" ? "badge-available" : doc.currentStatus === "On Leave" ? "badge-cleaning" : "badge-secondary"}`}>
                      {doc.currentStatus || doc.status}
                    </span>
                    <span className="badge badge-ai text-[10px]">{doc.department}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 mt-4 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-muted block text-[11px]">Experience</span>
                  <span className="font-bold text-main">{doc.experience}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-muted block text-[11px]">Assigned Ward</span>
                  <span className="font-bold text-main truncate block">{doc.assignedWard || "Inpatient"}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-muted block text-[11px]">Patients</span>
                  <span className="font-bold text-primary font-mono">{doc.assignedPatients} Inpatients</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-muted block text-[11px]">Appointments</span>
                  <span className="font-bold text-emerald-700 font-mono">{doc.todaysAppointments || 4} Slots</span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-muted">
                <div className="flex items-center gap-2"><Clock size={13} className="text-slate-400" /> <span>{doc.shift}</span></div>
                <div className="flex items-center gap-2"><Phone size={13} className="text-slate-400" /> <span>{doc.phone}</span></div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex gap-2">
              <button
                className="btn btn-secondary btn-sm flex-1"
                onClick={() => viewStaffProfile({ ...doc, category: "Doctors", role: doc.specialization })}
              >
                <User size={13} />
                <span>View Full Profile</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorManagement;
