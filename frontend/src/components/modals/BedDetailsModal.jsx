import React from "react";
import { useHospital } from "../../context/HospitalContext";
import { BedStatusBadge, PatientAcuityBadge } from "../common/StatusBadge";
import {
  BedDouble,
  X,
  User,
  Heart,
  Activity,
  Thermometer,
  Wind,
  Clock,
  ArrowRightLeft,
  LogOut,
  Sparkle,
  Wrench,
  CheckCircle,
  FileText,
  DoorOpen,
  Bookmark,
  Stethoscope
} from "lucide-react";

const BedDetailsModal = () => {
  const {
    isBedDetailsModalOpen,
    setIsBedDetailsModalOpen,
    selectedBed,
    patients,
    updateBedStatus,
    dischargePatient,
    setIsTransferModalOpen,
    setSelectedPatient
  } = useHospital();

  if (!isBedDetailsModalOpen || !selectedBed) return null;

  const patient =
    patients.find((p) => p.id === selectedBed.patientId) ||
    (selectedBed.patientName
      ? {
          id: selectedBed.patientId || "PT-INP",
          mrn: selectedBed.patient_code || "Inpatient",
          name: selectedBed.patientName,
          age: 52,
          gender: "Admitted",
          doctor: selectedBed.doctor || "Attending Physician",
          diagnosis: selectedBed.admission_reason || "Clinical Inpatient Monitoring",
          acuity: "Level 2: Urgent",
          acuityScore: 2,
          vitals: { hr: 78, bp: "122/80", spo2: "98%", temp: "36.8°C" }
        }
      : null);

  const handleOpenTransfer = () => {
    if (patient) {
      setSelectedPatient(patient);
      setIsBedDetailsModalOpen(false);
      setIsTransferModalOpen(true);
    }
  };

  const handleDischarge = () => {
    if (patient) {
      dischargePatient(patient.id);
      // Requirement 6: Mark bed status to cleaning_required upon discharge
      updateBedStatus(selectedBed.id, "cleaning_required");
      setIsBedDetailsModalOpen(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setIsBedDetailsModalOpen(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sky-100 text-primary flex items-center justify-center">
              <BedDouble size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                {selectedBed.roomNumber ? (
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                    <DoorOpen size={17} className="text-primary" />
                    <span>Room {selectedBed.roomNumber}</span>
                    <span className="text-slate-300">•</span>
                    <span className="font-mono text-slate-700">Bed {selectedBed.bedNumber || selectedBed.id}</span>
                  </h2>
                ) : (
                  <h2 className="text-base font-bold text-slate-900 font-mono">
                    Bed {selectedBed.bedNumber || selectedBed.id}
                  </h2>
                )}
                <BedStatusBadge status={selectedBed.status} />
              </div>
              <p className="text-xs text-muted">
                {selectedBed.wardName || "Hospital Ward"} • {selectedBed.floor || "Ground Floor"} {selectedBed.specialty ? `• ${selectedBed.specialty}` : ""}
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={() => setIsBedDetailsModalOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body space-y-4">
          {/* Bed & Infrastructure Information */}
          <div className="card p-3 bg-slate-50 border-slate-200">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Architectural Room & Bed Details
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div>
                <span className="text-muted block text-[10px] uppercase">Floor</span>
                <strong className="text-slate-800">{selectedBed.floor || "Ground Floor"}</strong>
              </div>
              <div>
                <span className="text-muted block text-[10px] uppercase">Room Number</span>
                <strong className="text-slate-800">{selectedBed.roomNumber || "Open Hall (No Partition)"}</strong>
              </div>
              <div>
                <span className="text-muted block text-[10px] uppercase">Bed Identifier</span>
                <strong className="text-primary font-mono">{selectedBed.bedNumber || selectedBed.id}</strong>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs text-muted mt-3 pt-2 border-t border-slate-200">
              <span>Sanitization: <strong>{selectedBed.lastCleaned || "Recently Sterilized"}</strong></span>
              <span>Ward: <strong>{selectedBed.wardName || "General Ward"}</strong></span>
            </div>
          </div>

          {/* Patient Details (if occupied) */}
          {patient ? (
            <div className="patient-detail-section space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold text-main flex items-center gap-2">
                  <User size={16} className="text-primary" />
                  <span>Currently Admitted Patient</span>
                </div>
                {patient.acuity && <PatientAcuityBadge acuity={patient.acuity} score={patient.acuityScore} />}
              </div>

              <div className="card p-4 border-sky-100 bg-sky-50/40">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-base font-bold text-main">{patient.name}</h3>
                    <span className="text-xs text-muted font-mono">{patient.mrn} • {patient.age} yrs • {patient.gender}</span>
                  </div>
                  <span className="text-xs font-semibold text-primary bg-sky-100 px-2.5 py-1 rounded-md flex items-center gap-1">
                    <Stethoscope size={12} />
                    <span>{patient.doctor}</span>
                  </span>
                </div>

                <div className="text-xs text-slate-700 mb-3 bg-white p-2.5 rounded-lg border border-slate-200">
                  <strong>Diagnosis / Admission Reason:</strong> {patient.diagnosis}
                </div>

                {/* Patient Live Vitals */}
                {patient.vitals && (
                  <div className="grid grid-cols-4 gap-2 text-center pt-2 border-t border-sky-100">
                    <div className="p-2 bg-white rounded border border-slate-200">
                      <div className="flex items-center justify-center gap-1 text-rose-500 mb-0.5">
                        <Heart size={13} />
                        <span className="text-xs font-bold font-mono">{patient.vitals.hr}</span>
                      </div>
                      <span className="text-[10px] text-muted uppercase">Heart Rate</span>
                    </div>

                    <div className="p-2 bg-white rounded border border-slate-200">
                      <div className="flex items-center justify-center gap-1 text-blue-500 mb-0.5">
                        <Activity size={13} />
                        <span className="text-xs font-bold font-mono">{patient.vitals.bp}</span>
                      </div>
                      <span className="text-[10px] text-muted uppercase">Blood Pres.</span>
                    </div>

                    <div className="p-2 bg-white rounded border border-slate-200">
                      <div className="flex items-center justify-center gap-1 text-emerald-500 mb-0.5">
                        <Wind size={13} />
                        <span className="text-xs font-bold font-mono">{patient.vitals.spo2}</span>
                      </div>
                      <span className="text-[10px] text-muted uppercase">SpO2</span>
                    </div>

                    <div className="p-2 bg-white rounded border border-slate-200">
                      <div className="flex items-center justify-center gap-1 text-amber-500 mb-0.5">
                        <Thermometer size={13} />
                        <span className="text-xs font-bold font-mono">{patient.vitals.temp}</span>
                      </div>
                      <span className="text-[10px] text-muted uppercase">Temp</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="card p-6 text-center bg-slate-50 border-dashed border-slate-300">
              <BedDouble size={36} className="text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-600">No Patient Currently Occupying This Bed</p>
              <p className="text-xs text-muted mt-1">
                Status: <strong className="text-main uppercase font-mono">{selectedBed.status?.replace("_", " ")}</strong>
              </p>
            </div>
          )}

          {/* Quick Bed Status Actions */}
          <div className="bed-status-actions pt-2">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Operational Bed & Turnover Controls
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                className={`btn btn-sm ${selectedBed.status === "available" ? "btn-success" : "btn-secondary"}`}
                onClick={() => updateBedStatus(selectedBed.id, "available")}
              >
                <CheckCircle size={14} />
                <span>Available</span>
              </button>

              <button
                type="button"
                className={`btn btn-sm ${selectedBed.status === "cleaning_in_progress" ? "btn-accent" : "btn-secondary"}`}
                onClick={() => updateBedStatus(selectedBed.id, "cleaning_in_progress")}
              >
                <Clock size={14} />
                <span>Sanitizing</span>
              </button>

              <button
                type="button"
                className={`btn btn-sm ${selectedBed.status === "reserved" ? "btn-primary" : "btn-secondary"}`}
                onClick={() => updateBedStatus(selectedBed.id, "reserved")}
              >
                <Bookmark size={14} />
                <span>Reserved</span>
              </button>

              <button
                type="button"
                className={`btn btn-sm ${selectedBed.status === "maintenance" ? "btn-danger" : "btn-secondary"}`}
                onClick={() => updateBedStatus(selectedBed.id, "maintenance")}
              >
                <Wrench size={14} />
                <span>Maintenance</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          {patient && (
            <>
              <button
                type="button"
                className="btn btn-secondary btn-sm flex items-center gap-1.5"
                onClick={handleOpenTransfer}
              >
                <ArrowRightLeft size={14} />
                <span>Request Inter-Ward Transfer</span>
              </button>
              <button
                type="button"
                className="btn btn-danger btn-sm flex items-center gap-1.5"
                onClick={handleDischarge}
              >
                <LogOut size={14} />
                <span>Discharge Patient</span>
              </button>
            </>
          )}
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setIsBedDetailsModalOpen(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BedDetailsModal;
