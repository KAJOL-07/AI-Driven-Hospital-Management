import React from "react";
import { EMERGENCY_PATIENTS } from "../data/mockData";
import { AlertTriangle, HeartPulse, Activity, Zap, Clock, User } from "lucide-react";

const triageColors = {
  1: { bg: "bg-rose-50 border-rose-300", badge: "badge-critical", label: "Level 1 — Resuscitation" },
  2: { bg: "bg-orange-50 border-orange-300", badge: "badge-cleaning", label: "Level 2 — Emergent" },
  3: { bg: "bg-amber-50 border-amber-300", badge: "badge-cleaning", label: "Level 3 — Urgent" },
};

const EmergencyManagement = () => {
  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="badge badge-critical">
            <AlertTriangle size={12} /> Active Emergency
          </span>
          <span className="text-xs text-muted font-mono">{EMERGENCY_PATIENTS.length} Active Cases</span>
        </div>
        <h1 className="text-2xl font-extrabold text-main">Emergency Management</h1>
        <p className="text-sm text-muted mt-1">Monitor all active emergency and trauma patients, triage levels, assigned teams, and real-time vitals.</p>
      </div>

      {/* Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: "Level 1 (Resuscitation)", value: EMERGENCY_PATIENTS.filter(e => e.triageLevel === 1).length, color: "text-rose-600", bg: "bg-rose-50 border-rose-200" },
          { label: "Level 2 (Emergent)", value: EMERGENCY_PATIENTS.filter(e => e.triageLevel === 2).length, color: "text-orange-600", bg: "bg-orange-50 border-orange-200" },
          { label: "Emergency Beds Used", value: 24, color: "text-sky-600", bg: "bg-sky-50 border-sky-200" },
          { label: "Emergency Beds Free", value: 6, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
        ].map(s => (
          <div key={s.label} className={`card p-4 border ${s.bg}`}>
            <div className="text-xs text-muted font-semibold">{s.label}</div>
            <div className={`text-2xl font-extrabold mt-1 ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Emergency Patient Cards */}
      <div className="space-y-4">
        {EMERGENCY_PATIENTS.map(ep => {
          const tc = triageColors[ep.triageLevel] || triageColors[3];
          return (
            <div key={ep.id} className={`card p-5 border-l-4 ${ep.triageLevel === 1 ? "border-l-rose-500" : ep.triageLevel === 2 ? "border-l-orange-500" : "border-l-amber-500"}`}>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shrink-0 ${ep.triageLevel === 1 ? "bg-rose-600" : ep.triageLevel === 2 ? "bg-orange-500" : "bg-amber-500"}`}>
                    {ep.triageLevel}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-main">{ep.name}</h3>
                      <span className="text-xs text-muted">{ep.age}y ({ep.gender})</span>
                      <span className={`badge text-xs ${tc.badge}`}>{ep.triageLabel}</span>
                    </div>
                    <div className="text-xs text-slate-700 mt-0.5">{ep.chiefComplaint}</div>
                    <div className="text-[11px] text-muted mt-1">Arrived: {ep.arrivalTime} • Bed: <strong className="text-primary font-mono">{ep.bedId}</strong></div>
                    <div className="text-[11px] text-slate-700 mt-0.5">{ep.ecgNote}</div>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <span className={`badge text-xs font-bold ${ep.status.includes("Critical") ? "badge-critical" : "badge-cleaning"}`}>{ep.status}</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                {[
                  { label: "BP", value: ep.vitals.bp },
                  { label: "Heart Rate", value: `${ep.vitals.hr} bpm` },
                  { label: "SpO₂", value: ep.vitals.spo2 },
                  { label: "Temperature", value: ep.vitals.temp },
                ].map(v => (
                  <div key={v.label} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="text-muted">{v.label}</div>
                    <div className="font-bold text-main font-mono">{v.value}</div>
                  </div>
                ))}
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
                <span>Doctor: <strong className="text-main">{ep.assignedDoctor}</strong></span>
                <span>Nurse: <strong className="text-main">{ep.assignedNurse}</strong></span>
                <div className="flex gap-2">
                  <button className="btn btn-secondary btn-sm">View Chart</button>
                  <button className="btn btn-primary btn-sm">Transfer to ICU</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EmergencyManagement;
