import React, { useState } from "react";
import { LAB_TESTS } from "../data/mockData";
import { FlaskConical, PlusCircle, CheckCircle2, Clock, AlertCircle, Search } from "lucide-react";

const statusColor = {
  "Result Available": "badge-available",
  "Pending Report": "badge-cleaning",
  "Scheduled": "badge-occupied",
};

const LaboratoryTests = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [showForm, setShowForm] = useState(false);

  const filtered = LAB_TESTS.filter(t => {
    const matchSearch = t.patientName.toLowerCase().includes(search.toLowerCase()) ||
      t.test.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "ALL" || t.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge badge-ai">Diagnostics</span>
              <span className="text-xs text-muted font-mono">{LAB_TESTS.length} Tests Ordered</span>
            </div>
            <h1 className="text-2xl font-extrabold text-main">Laboratory Tests & Results</h1>
            <p className="text-sm text-muted mt-1">Order lab investigations, track specimen collection, and review diagnostic results.</p>
          </div>
          <button className="btn btn-primary btn-md" onClick={() => setShowForm(!showForm)}>
            <PlusCircle size={16} />
            <span>Request Lab Test</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-100">
          <div className="relative max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input className="form-control pl-9 text-sm" placeholder="Search patient or test..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          {["ALL","Result Available","Pending Report","Scheduled"].map(f => (
            <button key={f} className={`btn btn-sm ${filter === f ? "btn-primary" : "btn-secondary"}`} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
      </div>

      {showForm && (
        <div className="card p-6">
          <h3 className="text-base font-bold text-main mb-4 flex items-center gap-2"><FlaskConical size={18} className="text-primary" /> Request New Lab Test</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="form-group">
              <label className="form-label">Patient Name / MRN</label>
              <input className="form-control" placeholder="e.g. Arthur Pendelton" />
            </div>
            <div className="form-group sm:col-span-2">
              <label className="form-label">Test / Investigation Name</label>
              <input className="form-control" placeholder="e.g. Complete Blood Count (CBC)" />
            </div>
            <div className="form-group">
              <label className="form-label">Specimen Type</label>
              <select className="form-select">
                <option>Blood</option>
                <option>Urine</option>
                <option>Sputum</option>
                <option>Arterial Blood</option>
                <option>Cardiac</option>
                <option>Radiology</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select className="form-select">
                <option>STAT</option>
                <option>Urgent</option>
                <option>Routine</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button className="btn btn-primary" onClick={() => setShowForm(false)}>Submit Request</button>
            <button className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {filtered.map(t => (
          <div key={t.id} className={`card p-5 ${t.status === "Result Available" ? "border-emerald-200" : t.status === "Pending Report" ? "border-amber-200" : ""}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-sky-100 text-primary flex items-center justify-center shrink-0">
                  <FlaskConical size={20} />
                </div>
                <div>
                  <div className="font-bold text-main">{t.test}</div>
                  <div className="text-xs text-muted">{t.patientName} • <span className="font-mono">{t.patientMRN}</span></div>
                  <div className="text-xs text-slate-600 mt-0.5">Specimen: {t.specimen} • Ordered: {t.requestDate}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`badge ${t.priority === "STAT" ? "badge-critical" : t.priority === "Urgent" ? "badge-cleaning" : "badge-secondary"}`}>{t.priority}</span>
                <span className={`badge ${statusColor[t.status] || "badge-secondary"}`}>{t.status}</span>
              </div>
            </div>

            {t.result && (
              <div className="mt-3 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 leading-relaxed">
                <strong>Result ({t.resultDate}):</strong> {t.result}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LaboratoryTests;
