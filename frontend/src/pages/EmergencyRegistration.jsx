import React, { useState } from "react";
import { EMERGENCY_PATIENTS } from "../data/mockData";
import { AlertTriangle, PlusCircle, Activity, User } from "lucide-react";

const EmergencyRegistration = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "", age: "", gender: "Male", chiefComplaint: "", triageLevel: "2", contactName: "", contactPhone: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowForm(false);
    setFormData({ name: "", age: "", gender: "Male", chiefComplaint: "", triageLevel: "2", contactName: "", contactPhone: "" });
  };

  const triageLevels = [
    { value: "1", label: "Level 1 — Resuscitation (Immediate life threat)", color: "bg-rose-100 border-rose-300 text-rose-800" },
    { value: "2", label: "Level 2 — Emergent (< 15 minutes)", color: "bg-orange-100 border-orange-300 text-orange-800" },
    { value: "3", label: "Level 3 — Urgent (< 30 minutes)", color: "bg-amber-100 border-amber-300 text-amber-800" },
    { value: "4", label: "Level 4 — Less Urgent (< 1 hour)", color: "bg-yellow-100 border-yellow-300 text-yellow-800" },
    { value: "5", label: "Level 5 — Non-Urgent (Elective)", color: "bg-slate-100 border-slate-300 text-slate-700" },
  ];

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge badge-critical"><AlertTriangle size={12} /> Emergency Intake</span>
            </div>
            <h1 className="text-2xl font-extrabold text-main">Emergency Registration</h1>
            <p className="text-sm text-muted mt-1">Rapidly register emergency patients, assign triage level, and dispatch to the nearest available emergency bed.</p>
          </div>
          <button className="btn btn-danger btn-md" onClick={() => setShowForm(true)}>
            <PlusCircle size={16} />
            <span>Register Emergency Patient</span>
          </button>
        </div>
      </div>

      {showForm && (
        <div className="card p-6 border-rose-200">
          <h3 className="text-base font-bold text-main mb-4 flex items-center gap-2">
            <Activity size={18} className="text-rose-600" /> Emergency Patient Intake Form
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="form-group sm:col-span-2">
                <label className="form-label">Patient Full Name</label>
                <input className="form-control" placeholder="Full name or 'Unknown' if unconscious" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="form-group">
                  <label className="form-label">Approximate Age</label>
                  <input type="number" className="form-control" placeholder="45" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select className="form-select" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Unknown</option>
                  </select>
                </div>
              </div>
              <div className="form-group sm:col-span-3">
                <label className="form-label">Chief Complaint / Reason for Emergency</label>
                <input className="form-control" placeholder="e.g. Severe chest pain, unconscious, road traffic accident..." value={formData.chiefComplaint} onChange={e => setFormData({...formData, chiefComplaint: e.target.value})} required />
              </div>
              <div className="form-group sm:col-span-3">
                <label className="form-label">Triage Level</label>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                  {triageLevels.map(t => (
                    <label key={t.value} className={`flex flex-col items-center p-3 rounded-xl border-2 cursor-pointer text-xs font-bold text-center transition-all ${formData.triageLevel === t.value ? "border-sky-500 bg-sky-50 shadow-md" : `${t.color} border`}`}>
                      <input type="radio" name="triage" value={t.value} className="sr-only" checked={formData.triageLevel === t.value} onChange={() => setFormData({...formData, triageLevel: t.value})} />
                      <span className="text-xl font-extrabold">{t.value}</span>
                      <span className="mt-1 leading-tight">{t.label.split("—")[1]?.trim()}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Emergency Contact Name</label>
                <input className="form-control" placeholder="Family / Guardian" value={formData.contactName} onChange={e => setFormData({...formData, contactName: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Contact Phone</label>
                <input className="form-control" placeholder="+1 (555) 000-0000" value={formData.contactPhone} onChange={e => setFormData({...formData, contactPhone: e.target.value})} />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" className="btn btn-danger btn-lg">Register & Dispatch to Emergency Bay</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Active Emergency Patients Overview */}
      <div className="card">
        <div className="card-header">
          <div className="card-title"><AlertTriangle size={18} className="text-rose-600" /> Active Emergency Bay Patients</div>
        </div>
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Triage Level</th>
                <th>Chief Complaint</th>
                <th>Arrival Time</th>
                <th>Bed</th>
                <th>Doctor</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {EMERGENCY_PATIENTS.map(ep => (
                <tr key={ep.id}>
                  <td>
                    <div className="font-bold text-main">{ep.name}</div>
                    <div className="text-xs text-muted">{ep.age}y ({ep.gender})</div>
                  </td>
                  <td>
                    <span className={`badge text-xs font-bold ${ep.triageLevel === 1 ? "badge-critical" : "badge-cleaning"}`}>
                      Level {ep.triageLevel} — {ep.triageLabel}
                    </span>
                  </td>
                  <td><div className="text-xs text-slate-700 max-w-xs truncate" title={ep.chiefComplaint}>{ep.chiefComplaint}</div></td>
                  <td><div className="text-xs text-primary font-mono">{ep.arrivalTime}</div></td>
                  <td><div className="text-xs font-mono font-bold text-primary">{ep.bedId}</div></td>
                  <td><div className="text-xs text-slate-700">{ep.assignedDoctor}</div></td>
                  <td>
                    <span className={`badge text-xs ${ep.status.includes("Critical") ? "badge-critical" : "badge-cleaning"}`}>{ep.status}</span>
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

export default EmergencyRegistration;
