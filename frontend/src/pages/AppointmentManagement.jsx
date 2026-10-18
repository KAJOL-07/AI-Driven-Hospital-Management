import React, { useState } from "react";
import { APPOINTMENTS } from "../data/mockData";
import { CalendarDays, Clock, User, Stethoscope, Search, CheckCircle2, Circle, AlertCircle } from "lucide-react";

const statusColor = {
  "Confirmed": "badge-available",
  "In Progress": "badge-occupied",
  "Completed": "badge-secondary",
  "Pending": "badge-cleaning",
  "Scheduled": "badge-ai"
};

const typeColor = {
  "Follow-Up": "bg-sky-50 text-sky-800 border-sky-200",
  "Consultation": "bg-indigo-50 text-indigo-800 border-indigo-200",
  "Emergency": "bg-rose-50 text-rose-800 border-rose-200",
  "Prenatal": "bg-pink-50 text-pink-800 border-pink-200",
  "Vaccination": "bg-emerald-50 text-emerald-800 border-emerald-200",
  "Discharge Planning": "bg-amber-50 text-amber-800 border-amber-200",
};

const AppointmentManagement = ({ forDoctor = false, doctorName = null }) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  const filtered = APPOINTMENTS.filter(a => {
    const matchSearch =
      a.patientName.toLowerCase().includes(search.toLowerCase()) ||
      a.doctor.toLowerCase().includes(search.toLowerCase()) ||
      a.type.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "ALL" || a.status === filter;
    const matchDoctor = !forDoctor || !doctorName || a.doctor.includes(doctorName);
    return matchSearch && matchFilter && matchDoctor;
  });

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge badge-ai">Appointment Registry</span>
              <span className="text-xs text-muted font-mono">{filtered.length} appointments today</span>
            </div>
            <h1 className="text-2xl font-extrabold text-main">Appointment Management</h1>
            <p className="text-sm text-muted mt-1">Track all scheduled consultations, follow-ups, emergency consultations, and OPD appointments.</p>
          </div>
          <button className="btn btn-primary btn-md">
            <CalendarDays size={16} />
            <span>Book New Appointment</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-100">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input className="form-control pl-9 text-sm" placeholder="Search patient, doctor, type..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["ALL","Confirmed","In Progress","Pending","Completed"].map(f => (
              <button key={f} className={`btn btn-sm ${filter === f ? "btn-primary" : "btn-secondary"}`} onClick={() => setFilter(f)}>{f}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Today", value: APPOINTMENTS.length, color: "text-main" },
          { label: "In Progress", value: APPOINTMENTS.filter(a => a.status === "In Progress").length, color: "text-sky-600" },
          { label: "Pending", value: APPOINTMENTS.filter(a => a.status === "Pending").length, color: "text-amber-600" },
          { label: "Completed", value: APPOINTMENTS.filter(a => a.status === "Completed").length, color: "text-emerald-600" },
        ].map(s => (
          <div key={s.label} className="card p-4">
            <div className="text-xs text-muted font-semibold">{s.label}</div>
            <div className={`text-2xl font-extrabold mt-1 ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date & Time</th>
                <th>Type</th>
                <th>Reason</th>
                <th>Room</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id}>
                  <td>
                    <div className="font-bold text-main">{a.patientName}</div>
                    <div className="text-xs text-muted font-mono">{a.patientMRN} • {a.age}y</div>
                  </td>
                  <td>
                    <div className="text-xs font-semibold text-main">{a.doctor}</div>
                    <div className="text-xs text-muted">{a.dept}</div>
                  </td>
                  <td>
                    <div className="text-xs font-bold text-main">{a.date}</div>
                    <div className="text-xs text-primary font-mono">{a.time}</div>
                  </td>
                  <td>
                    <span className={`badge text-xs border ${typeColor[a.type] || "badge-secondary"}`}>{a.type}</span>
                  </td>
                  <td>
                    <div className="text-xs text-slate-700 max-w-xs truncate" title={a.reason}>{a.reason}</div>
                  </td>
                  <td><div className="text-xs text-muted">{a.room}</div></td>
                  <td>
                    <span className={`badge ${statusColor[a.status] || "badge-secondary"}`}>{a.status}</span>
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

export default AppointmentManagement;
