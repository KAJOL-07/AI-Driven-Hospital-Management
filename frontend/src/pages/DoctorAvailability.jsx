import React, { useState } from "react";
import { DOCTORS, APPOINTMENTS } from "../data/mockData";
import { Stethoscope, Clock, User, CheckCircle2, Phone } from "lucide-react";

const DoctorAvailability = () => {
  const [filter, setFilter] = useState("ALL");

  const filtered = DOCTORS.filter(d => filter === "ALL" || d.status === filter);

  const getApptsForDoctor = (doctorName) =>
    APPOINTMENTS.filter(a => a.doctor.includes(doctorName.split(",")[0]));

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge badge-ai">Front Desk View</span>
            </div>
            <h1 className="text-2xl font-extrabold text-main">Doctor Availability</h1>
            <p className="text-sm text-muted mt-1">Check which doctors are currently on duty, their availability for new appointments, and consultation schedules.</p>
          </div>
          <div className="flex gap-2">
            {["ALL","On Duty","Off Duty","In Surgery"].map(f => (
              <button key={f} className={`btn btn-sm ${filter === f ? "btn-primary" : "btn-secondary"}`} onClick={() => setFilter(f)}>{f}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map(doc => {
          const docApts = getApptsForDoctor(doc.name);
          const isAvailable = doc.status === "On Duty";
          return (
            <div key={doc.id} className={`card p-5 flex flex-col gap-4 ${isAvailable ? "border-emerald-200" : "border-slate-200"}`}>
              <div className="flex items-start gap-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-extrabold text-lg shrink-0 ${isAvailable ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                  {doc.name.split(" ")[1]?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-main truncate">{doc.name}</div>
                  <div className="text-xs text-muted truncate">{doc.specialty}</div>
                  <div className="mt-1">
                    <span className={`badge text-xs ${isAvailable ? "badge-available" : doc.status === "In Surgery" ? "badge-cleaning" : "badge-secondary"}`}>{doc.status}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="text-muted">Department</div>
                  <div className="font-bold text-main">{doc.dept}</div>
                </div>
                <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="text-muted">Today's Appointments</div>
                  <div className="font-bold text-main">{docApts.length}</div>
                </div>
              </div>

              <div className="text-xs text-muted space-y-1">
                <div className="flex items-center gap-2"><Clock size={12}/> {doc.shift}</div>
                <div className="flex items-center gap-2"><Phone size={12}/> {doc.phone}</div>
                <div className="flex items-center gap-2"><User size={12}/> Room: {doc.roomNo}</div>
              </div>

              <button className={`btn btn-sm w-full ${isAvailable ? "btn-primary" : "btn-secondary"}`} disabled={!isAvailable}>
                {isAvailable ? "Book Appointment" : "Not Available"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DoctorAvailability;
