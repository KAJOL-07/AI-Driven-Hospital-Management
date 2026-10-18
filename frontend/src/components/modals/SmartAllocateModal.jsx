import React, { useState } from "react";
import { useHospital } from "../../context/HospitalContext";
import {
  Sparkles,
  X,
  CheckCircle2,
  AlertTriangle,
  Brain,
  BedDouble,
  ShieldAlert,
  ArrowRight,
  Activity,
  Wind
} from "lucide-react";

const SmartAllocateModal = () => {
  const {
    isSmartAllocateModalOpen,
    setIsSmartAllocateModalOpen,
    wards,
    evaluateSmartBedAllocation,
    allocateBed
  } = useHospital();

  const [formData, setFormData] = useState({
    name: "Eleanor Vance",
    age: 62,
    gender: "Female",
    acuityScore: 2,
    requiredWard: "MICU",
    oxygenReq: "High-Flow Oxygen (15L/min)",
    infectionRisk: false,
    diagnosis: "Severe Acute Hypoxemic Respiratory Failure",
    doctor: "Dr. Robert Vance"
  });

  const [simulationResult, setSimulationResult] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);

  if (!isSmartAllocateModalOpen) return null;

  const handleRunSimulation = (e) => {
    e.preventDefault();
    setIsSimulating(true);
    setTimeout(() => {
      const result = evaluateSmartBedAllocation(formData);
      setSimulationResult(result);
      setIsSimulating(false);
    }, 600);
  };

  const handleConfirmAllocation = () => {
    if (!simulationResult || !simulationResult.recommendedBed) return;
    const success = allocateBed(
      formData,
      simulationResult.recommendedBed.id,
      simulationResult.reasoning
    );
    if (success) {
      setIsSmartAllocateModalOpen(false);
      setSimulationResult(null);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setIsSmartAllocateModalOpen(false)}>
      <div className="modal-content modal-content-lg" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-sky-100 rounded-lg text-primary">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold">AI Smart Bed Allocation Engine</h2>
              <p className="text-xs text-muted">
                Multi-Criteria Decision Analysis & Clinical Resource Optimization
              </p>
            </div>
          </div>
          <button
            className="modal-close-btn"
            onClick={() => setIsSmartAllocateModalOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body space-y-5">
          {/* Form */}
          <form onSubmit={handleRunSimulation} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Patient Full Name</label>
              <input
                type="text"
                className="form-control"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="form-group">
                <label className="form-label">Age</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Gender</label>
                <select
                  className="form-select"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Clinical Emergency / Acuity Level</label>
              <select
                className="form-select"
                value={formData.acuityScore}
                onChange={(e) => setFormData({ ...formData, acuityScore: Number(e.target.value) })}
              >
                <option value={1}>Level 1: Critical (Resuscitation / Immediate)</option>
                <option value={2}>Level 2: Severe / Emergent (&lt; 15 mins)</option>
                <option value={3}>Level 3: Urgent (&lt; 30 mins)</option>
                <option value={4}>Level 4: Less Urgent (&lt; 60 mins)</option>
                <option value={5}>Level 5: Non-Urgent</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Target / Preferred Clinical Ward</label>
              <select
                className="form-select"
                value={formData.requiredWard}
                onChange={(e) => setFormData({ ...formData, requiredWard: e.target.value })}
              >
                {wards.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({w.availableBeds} beds available)
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group md:col-span-2">
              <label className="form-label">Primary Clinical Diagnosis / Chief Complaint</label>
              <input
                type="text"
                className="form-control"
                value={formData.diagnosis}
                onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Respiratory / Oxygen Requirement</label>
              <select
                className="form-select"
                value={formData.oxygenReq}
                onChange={(e) => setFormData({ ...formData, oxygenReq: e.target.value })}
              >
                <option value="Standard Oxygen">Standard Room Air / Low Flow</option>
                <option value="High-Flow Oxygen (15L/min)">High-Flow Nasal Cannula</option>
                <option value="Non-Invasive BiPAP">Non-Invasive Ventilation (BiPAP/CPAP)</option>
                <option value="Invasive Mechanical Ventilation">Invasive Mechanical Ventilator</option>
              </select>
            </div>

            <div className="form-group flex flex-col justify-end">
              <label className="checkbox-container flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.infectionRisk}
                  onChange={(e) => setFormData({ ...formData, infectionRisk: e.target.checked })}
                />
                <div>
                  <span className="text-sm font-semibold block text-main">Infection Control / Airborne Risk</span>
                  <span className="text-xs text-muted">Requires Negative Pressure / Strict Isolation</span>
                </div>
              </label>
            </div>

            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                className="btn btn-primary btn-lg w-full md:w-auto"
                disabled={isSimulating}
              >
                <Brain size={18} />
                <span>{isSimulating ? "AI Computing Optimal Match..." : "Run AI Bed Optimization"}</span>
              </button>
            </div>
          </form>

          {/* AI Result Card */}
          {simulationResult && (
            <div className="ai-recommendation-box card bg-slate-900 text-white border-blue-900/50">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-sky-500/20 text-sky-400 rounded-md">
                    <Brain size={18} />
                  </span>
                  <span className="font-bold text-sm text-sky-300">AI OPTIMAL ALLOCATION MATCH</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Match Confidence:</span>
                  <span className="badge badge-ai font-mono text-sm px-2.5 py-0.5">
                    {simulationResult.confidenceScore}% ACCURACY
                  </span>
                </div>
              </div>

              {simulationResult.recommendedBed ? (
                <div className="pt-4 space-y-4">
                  {/* Recommended Bed Headline */}
                  <div className="p-4 bg-slate-800/80 rounded-xl border border-sky-500/30 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-sky-600/30 border border-sky-400/30 flex items-center justify-center text-sky-300">
                        <BedDouble size={26} />
                      </div>
                      <div>
                        <div className="text-xs text-sky-300 font-semibold uppercase tracking-wider">
                          Recommended Placement
                        </div>
                        <div className="text-2xl font-extrabold text-white font-mono">
                          Bed #{simulationResult.recommendedBed.id}
                        </div>
                        <div className="text-xs text-slate-300">
                          {simulationResult.recommendedBed.wardName} • {simulationResult.recommendedBed.floor}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 max-w-xs">
                      {simulationResult.recommendedBed.equipment.map((eq, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 rounded bg-slate-700/80 text-sky-200 border border-slate-600">
                          {eq}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Clinical Rationale */}
                  <div className="p-3 bg-slate-800/50 rounded-lg text-xs text-slate-300 leading-relaxed border border-slate-700">
                    <strong className="text-sky-300 block mb-1">Clinical AI Rationale:</strong>
                    {simulationResult.reasoning}
                  </div>

                  {/* Multi-Criteria Weights Breakdown */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1 text-center">
                    <div className="p-2 bg-slate-800/40 rounded border border-slate-700">
                      <span className="text-xs text-slate-400 block">Clinical Urgency</span>
                      <span className="text-sm font-bold text-emerald-400 font-mono">
                        {simulationResult.factors.clinicalUrgencyScore}%
                      </span>
                    </div>
                    <div className="p-2 bg-slate-800/40 rounded border border-slate-700">
                      <span className="text-xs text-slate-400 block">Resource Match</span>
                      <span className="text-sm font-bold text-sky-400 font-mono">
                        {simulationResult.factors.resourceMatchScore}%
                      </span>
                    </div>
                    <div className="p-2 bg-slate-800/40 rounded border border-slate-700">
                      <span className="text-xs text-slate-400 block">Infection Safety</span>
                      <span className="text-sm font-bold text-purple-400 font-mono">
                        {simulationResult.factors.infectionSafetyScore}%
                      </span>
                    </div>
                    <div className="p-2 bg-slate-800/40 rounded border border-slate-700">
                      <span className="text-xs text-slate-400 block">LOS Optimization</span>
                      <span className="text-sm font-bold text-amber-400 font-mono">
                        {simulationResult.factors.losEfficiencyScore}%
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      className="btn btn-success btn-lg w-full md:w-auto"
                      onClick={handleConfirmAllocation}
                    >
                      <CheckCircle2 size={18} />
                      <span>Confirm & Execute Smart Bed Allocation</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 text-center text-rose-300">
                  No beds currently available matching the exact criteria. Please check emergency buffer beds or initiate an inter-ward step-down transfer.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SmartAllocateModal;
