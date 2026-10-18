import React, { useState } from "react";
import { PRESCRIPTIONS } from "../data/mockData";
import { Pill, PlusCircle, Clock, CheckCircle2, AlertCircle, Search } from "lucide-react";

const Prescriptions = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [showForm, setShowForm] = useState(false);
  const [newRx, setNewRx] = useState({ patientName: "", drug: "", route: "Oral", frequency: "", duration: "", priority: "Routine" });

  const filtered = PRESCRIPTIONS.filter(rx => {
    const matchSearch = rx.patientName.toLowerCase().includes(search.toLowerCase()) || rx.drug.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "ALL" || rx.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge badge-ai">Medication Orders</span>
              <span className="text-xs text-muted font-mono">{PRESCRIPTIONS.length} Active Prescriptions</span>
            </div>
            <h1 className="text-2xl font-extrabold text-main">Prescriptions</h1>
            <p className="text-sm text-muted mt-1">Write, review and manage all patient medication orders and pharmacy dispatches.</p>
          </div>
          <button className="btn btn-primary btn-md" onClick={() => setShowForm(!showForm)}>
            <PlusCircle size={16} />
            <span>New Prescription</span>
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-100">
          <div className="relative max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input className="form-control pl-9 text-sm" placeholder="Search patient or drug..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          {["ALL","Dispensed","Active","Pending"].map(f => (
            <button key={f} className={`btn btn-sm ${filter === f ? "btn-primary" : "btn-secondary"}`} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
      </div>

      {/* New Prescription Form */}
      {showForm && (
        <div className="card p-6">
          <h3 className="text-base font-bold text-main mb-4 flex items-center gap-2"><Pill size={18} className="text-primary" /> Write New Prescription</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="form-group sm:col-span-2">
              <label className="form-label">Patient Name / MRN</label>
              <input className="form-control" placeholder="e.g. Arthur Pendelton" value={newRx.patientName} onChange={e => setNewRx({...newRx, patientName: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select className="form-select" value={newRx.priority} onChange={e => setNewRx({...newRx, priority: e.target.value})}>
                <option value="STAT">STAT (Immediate)</option>
                <option value="Urgent">Urgent</option>
                <option value="Routine">Routine</option>
              </select>
            </div>
            <div className="form-group sm:col-span-2">
              <label className="form-label">Drug Name & Dose</label>
              <input className="form-control" placeholder="e.g. Vancomycin 1g IV" value={newRx.drug} onChange={e => setNewRx({...newRx, drug: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Route</label>
              <select className="form-select" value={newRx.route} onChange={e => setNewRx({...newRx, route: e.target.value})}>
                <option>Oral</option>
                <option>Intravenous</option>
                <option>IV Infusion</option>
                <option>Subcutaneous</option>
                <option>Intramuscular</option>
                <option>Topical</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Frequency</label>
              <input className="form-control" placeholder="e.g. Twice daily" value={newRx.frequency} onChange={e => setNewRx({...newRx, frequency: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Duration</label>
              <input className="form-control" placeholder="e.g. 7 days" value={newRx.duration} onChange={e => setNewRx({...newRx, duration: e.target.value})} />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button className="btn btn-primary" onClick={() => setShowForm(false)}>Submit Prescription</button>
            <button className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="card">
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Rx ID</th>
                <th>Patient</th>
                <th>Drug & Dose</th>
                <th>Route</th>
                <th>Frequency</th>
                <th>Duration</th>
                <th>Priority</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(rx => (
                <tr key={rx.id}>
                  <td><span className="font-mono text-xs font-bold text-slate-700">{rx.id}</span></td>
                  <td>
                    <div className="font-bold text-main text-sm">{rx.patientName}</div>
                    <div className="text-xs text-muted font-mono">{rx.patientMRN}</div>
                  </td>
                  <td><div className="text-xs font-semibold text-main max-w-[180px] truncate" title={rx.drug}>{rx.drug}</div></td>
                  <td><div className="text-xs text-slate-700">{rx.route}</div></td>
                  <td><div className="text-xs text-slate-700">{rx.frequency}</div></td>
                  <td><div className="text-xs text-muted">{rx.duration}</div></td>
                  <td>
                    <span className={`badge text-xs ${rx.priority === "STAT" ? "badge-critical" : "badge-secondary"}`}>{rx.priority}</span>
                  </td>
                  <td>
                    <span className={`badge text-xs ${rx.status === "Dispensed" ? "badge-available" : rx.status === "Active" ? "badge-occupied" : "badge-cleaning"}`}>{rx.status}</span>
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

export default Prescriptions;
