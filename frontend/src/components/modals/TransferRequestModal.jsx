import React, { useState, useEffect } from "react";
import { useHospital } from "../../context/HospitalContext";
import {
  ArrowRightLeft,
  X,
  Sparkles,
  Building2,
  AlertTriangle,
  CheckCircle,
  User
} from "lucide-react";

const TransferRequestModal = () => {
  const {
    isTransferModalOpen,
    setIsTransferModalOpen,
    selectedPatient,
    patients,
    wards,
    requestTransfer
  } = useHospital();

  const [patientId, setPatientId] = useState("");
  const [targetWardId, setTargetWardId] = useState("GMW-M");
  const [priority, setPriority] = useState("URGENT");
  const [clinicalReason, setClinicalReason] = useState("");

  useEffect(() => {
    if (selectedPatient) {
      setPatientId(selectedPatient.id);
      if (selectedPatient.gender === "Female") {
        setTargetWardId("GMW-F");
      }
    } else if (patients.length > 0) {
      setPatientId(patients[0].id);
    }
  }, [selectedPatient, patients]);

  if (!isTransferModalOpen) return null;

  const currentPatient = patients.find((p) => p.id === patientId) || selectedPatient;
  const currentWard = wards.find((w) => w.id === currentPatient?.wardId);
  const targetWard = wards.find((w) => w.id === targetWardId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentPatient || !targetWardId) return;

    const success = requestTransfer({
      patientId: currentPatient.id,
      targetWardId,
      clinicalReason,
      priority
    });

    if (success) {
      setIsTransferModalOpen(false);
      setClinicalReason("");
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setIsTransferModalOpen(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
              <ArrowRightLeft size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold">Request Inter-Ward Transfer</h2>
              <p className="text-xs text-muted">
                Intelligent Step-Down / Step-Up Patient Movement
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={() => setIsTransferModalOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body space-y-4">
            {/* Patient Picker */}
            <div className="form-group">
              <label className="form-label">Select Admitted Patient</label>
              <select
                className="form-select"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                required
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.bedId} - {p.diagnosis})
                  </option>
                ))}
              </select>
            </div>

            {/* Current vs Destination Flow Card */}
            {currentPatient && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-muted uppercase block">Origin Ward & Bed</span>
                  <span className="text-sm font-bold text-main">{currentWard?.name || currentPatient.wardId}</span>
                  <span className="text-xs text-primary font-mono block">Bed #{currentPatient.bedId}</span>
                </div>
                <div className="p-2 rounded-full bg-white border border-slate-200 text-muted">
                  <ArrowRightLeft size={16} />
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-muted uppercase block">Target Destination</span>
                  <span className="text-sm font-bold text-main">{targetWard?.name || targetWardId}</span>
                  <span className="text-xs text-emerald-600 font-mono block">
                    {targetWard?.availableBeds || 0} Beds Free
                  </span>
                </div>
              </div>
            )}

            {/* Target Ward */}
            <div className="form-group">
              <label className="form-label">Destination Ward</label>
              <select
                className="form-select"
                value={targetWardId}
                onChange={(e) => setTargetWardId(e.target.value)}
                required
              >
                {wards.map((w) => (
                  <option key={w.id} value={w.id} disabled={w.id === currentPatient?.wardId}>
                    {w.name} ({w.availableBeds} beds available, {w.specialty})
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div className="form-group">
              <label className="form-label">Transfer Clinical Priority</label>
              <select
                className="form-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="CRITICAL">Critical (Immediate - Acute Deterioration)</option>
                <option value="URGENT">Urgent (&lt; 30 Mins - Capacity Decongestion)</option>
                <option value="ROUTINE">Routine (Scheduled Step-Down / Post-Op)</option>
              </select>
            </div>

            {/* Clinical Reason */}
            <div className="form-group">
              <label className="form-label">Clinical Rationale & Special Care Notes</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="e.g. Hemodynamically stable post-extubation; step down to medical floor to free ICU bed."
                value={clinicalReason}
                onChange={(e) => setClinicalReason(e.target.value)}
                required
              />
            </div>

            {/* AI Optimization Hint */}
            <div className="p-3 bg-sky-50 border border-sky-200 rounded-lg flex items-start gap-2 text-xs text-sky-900">
              <Sparkles size={16} className="text-sky-600 shrink-0 mt-0.5" />
              <div>
                <strong>AI Transfer Protocol:</strong> Approving this transfer frees high-acuity bed #{currentPatient?.bedId} and balances nurse workload in {targetWard?.name}.
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsTransferModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <CheckCircle size={16} />
              <span>Submit Transfer Request</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransferRequestModal;
