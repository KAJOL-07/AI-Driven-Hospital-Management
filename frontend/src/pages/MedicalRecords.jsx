import React, { useState } from "react";
import { MEDICAL_RECORDS } from "../data/mockData";
import { FileText, HeartPulse, Pill, FlaskConical, AlertCircle, Search } from "lucide-react";

const MedicalRecords = () => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const filtered = MEDICAL_RECORDS.filter(r =>
    r.patientName.toLowerCase().includes(search.toLowerCase()) ||
    r.patientMRN.toLowerCase().includes(search.toLowerCase()) ||
    r.diagnosis.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="badge badge-ai">Clinical Documentation</span>
        </div>
        <h1 className="text-2xl font-extrabold text-main">Medical Records</h1>
        <p className="text-sm text-muted mt-1">View complete patient medical histories, current medications, vitals, and clinical notes.</p>
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="relative max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input className="form-control pl-9 text-sm" placeholder="Search patient name, MRN, or diagnosis..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Record List */}
        <div className="space-y-3">
          {filtered.map(r => (
            <div
              key={r.id}
              className={`card p-4 cursor-pointer transition-all ${selected?.id === r.id ? "border-sky-400 shadow-md" : "hover:border-sky-200"}`}
              onClick={() => setSelected(r)}
            >
              <div className="font-bold text-main">{r.patientName}</div>
              <div className="text-xs text-muted font-mono">{r.patientMRN} • {r.age}y ({r.gender})</div>
              <div className="text-xs text-slate-700 mt-1 truncate">{r.diagnosis}</div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[11px] text-muted">{r.wardId} • Admitted {r.admitDate}</span>
                {r.labPending > 0 && (
                  <span className="badge badge-cleaning text-[10px]">{r.labPending} Labs Pending</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Record Detail */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="card p-6 space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-main">{selected.patientName}</h2>
                  <div className="text-xs text-muted font-mono">{selected.patientMRN} • {selected.age}y ({selected.gender}) • Blood Group: <strong>{selected.bloodGroup}</strong></div>
                  <div className="mt-1 text-sm text-slate-700"><strong>Diagnosis:</strong> {selected.diagnosis}</div>
                </div>
                <span className="badge badge-ai">{selected.wardId}</span>
              </div>

              {/* Vitals */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-2 flex items-center gap-1"><HeartPulse size={14} className="text-primary" /> Current Vitals</h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                  {[
                    { label: "BP", value: selected.vitals.bp },
                    { label: "Heart Rate", value: `${selected.vitals.hr} bpm` },
                    { label: "SpO₂", value: selected.vitals.spo2 },
                    { label: "Temperature", value: selected.vitals.temp },
                    { label: "Resp. Rate", value: `${selected.vitals.rr} /min` },
                  ].map(v => (
                    <div key={v.label} className="p-2 bg-slate-50 border border-slate-200 rounded-lg">
                      <div className="text-muted">{v.label}</div>
                      <div className="font-bold text-main font-mono">{v.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Medications */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-2 flex items-center gap-1"><Pill size={14} className="text-primary" /> Active Medications</h3>
                <div className="space-y-1.5">
                  {selected.medications.map((med, i) => (
                    <div key={i} className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                      <span className="w-5 h-5 rounded-full bg-sky-100 text-primary flex items-center justify-center text-[10px] font-bold shrink-0">{i+1}</span>
                      <span className="text-main">{med}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Allergies */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-2 flex items-center gap-1"><AlertCircle size={14} className="text-rose-500" /> Known Allergies</h3>
                <div className="flex flex-wrap gap-2">
                  {selected.allergies.map((al, i) => (
                    <span key={i} className="badge badge-critical text-xs">{al}</span>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-2 flex items-center gap-1"><FileText size={14} className="text-primary" /> Clinical Notes</h3>
                <div className="p-3.5 bg-sky-50 border border-sky-200 rounded-xl text-xs text-slate-800 leading-relaxed">{selected.notes}</div>
              </div>

              <div className="flex gap-2 pt-2">
                <button className="btn btn-primary btn-sm">Write New Note</button>
                <button className="btn btn-secondary btn-sm">Request Lab Test</button>
                <button className="btn btn-secondary btn-sm">New Prescription</button>
              </div>
            </div>
          ) : (
            <div className="card p-12 text-center">
              <FileText size={40} className="text-slate-300 mx-auto mb-3" />
              <p className="font-bold text-slate-500">Select a patient record from the list</p>
              <p className="text-xs text-muted mt-1">Click any record to view full clinical details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalRecords;
