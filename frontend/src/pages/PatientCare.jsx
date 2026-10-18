import React, { useState } from "react";
import { useHospital } from "../context/HospitalContext";
import { HeartPulse, PlusCircle, CheckCircle2, Clock, User, BedDouble } from "lucide-react";

const PatientCare = () => {
  const { patients, beds } = useHospital();

  const careTasksByPatient = patients.slice(0, 4).map(p => ({
    patient: p,
    tasks: [
      { id: 1, task: "Vital Signs Assessment", time: "08:00 AM", status: "Completed", nurse: "Priya Patel, RN" },
      { id: 2, task: `Administer Prescribed Medications`, time: "09:00 AM", status: "Completed", nurse: "Priya Patel, RN" },
      { id: 3, task: "Wound / IV Site Inspection", time: "11:00 AM", status: "Pending", nurse: "Priya Patel, RN" },
      { id: 4, task: "Turn & Reposition (Pressure Ulcer Prevention)", time: "12:00 PM", status: "Pending", nurse: "Priya Patel, RN" },
    ]
  }));

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="badge badge-ai">Nursing Care Plan</span>
        </div>
        <h1 className="text-2xl font-extrabold text-main">Patient Care & Medication Tasks</h1>
        <p className="text-sm text-muted mt-1">Track nursing care tasks, medication administration, vital signs monitoring, and patient-specific care plans for assigned patients.</p>
      </div>

      <div className="space-y-5">
        {careTasksByPatient.map(({ patient, tasks }) => (
          <div key={patient.id} className="card p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-100 text-primary flex items-center justify-center">
                  <User size={20} />
                </div>
                <div>
                  <div className="font-bold text-main">{patient.name}</div>
                  <div className="text-xs text-muted font-mono">{patient.mrn} • {patient.wardId} • Bed #{patient.bedId}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="badge badge-occupied text-xs">Acuity: {patient.acuityScore}</span>
                <span className="text-xs text-muted">{patient.diagnosis}</span>
              </div>
            </div>

            <div className="space-y-2">
              {tasks.map(task => (
                <div key={task.id} className={`flex items-center justify-between p-3 rounded-xl border text-xs ${task.status === "Completed" ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200"}`}>
                  <div className="flex items-center gap-2.5">
                    {task.status === "Completed" ? (
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    ) : (
                      <Clock size={16} className="text-amber-600 shrink-0" />
                    )}
                    <div>
                      <div className="font-semibold text-main">{task.task}</div>
                      <div className="text-[11px] text-muted">{task.time} • {task.nurse}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`badge ${task.status === "Completed" ? "badge-available" : "badge-cleaning"}`}>{task.status}</span>
                    {task.status !== "Completed" && (
                      <button className="btn btn-sm btn-primary text-[11px] py-1">Mark Done</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientCare;
