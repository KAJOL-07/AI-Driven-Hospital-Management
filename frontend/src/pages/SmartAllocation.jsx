import React, { useState } from "react";
import { useHospital } from "../context/HospitalContext";
import { BedStatusBadge, PatientAcuityBadge } from "../components/common/StatusBadge";
import {
  Brain,
  Sparkles,
  BedDouble,
  CheckCircle2,
  AlertTriangle,
  HeartPulse,
  Wind,
  ShieldAlert,
  ArrowRight,
  Layers,
  Sliders,
  Check,
  Zap,
  Info
} from "lucide-react";

const SAMPLE_CLINICAL_CASES = [
  {
    title: "Case A: Severe Sepsis with ARDS",
    name: "Arthur Pendelton",
    age: 68,
    gender: "Male",
    acuityScore: 1,
    requiredWard: "MICU",
    bedType: "Invasive Ventilator ICU Suite",
    oxygenReq: "Invasive Mechanical Ventilation",
    infectionRisk: false,
    diagnosis: "Severe Sepsis & Refractory Hypotension"
  },
  {
    title: "Case B: Acute Anterior STEMI Cardiac",
    name: "Victor Stone",
    age: 61,
    gender: "Male",
    acuityScore: 2,
    requiredWard: "CCU",
    bedType: "12-Lead Continuous Telemetry Bed",
    oxygenReq: "Standard Oxygen",
    infectionRisk: false,
    diagnosis: "Acute Coronary Syndrome post-Primary PCI"
  },
  {
    title: "Case C: Airborne Tuberculosis",
    name: "Lucas Thorne",
    age: 38,
    gender: "Male",
    acuityScore: 2,
    requiredWard: "IDI",
    bedType: "Negative Pressure Isolation Suite",
    oxygenReq: "High-Flow Oxygen (15L/min)",
    infectionRisk: true,
    diagnosis: "Cavitary Pulmonary TB (AFB Positive)"
  },
  {
    title: "Case D: Pediatric Bronchiolitis",
    name: "Liam O'Connor",
    age: 6,
    gender: "Male",
    acuityScore: 3,
    requiredWard: "PED",
    bedType: "Pediatric Inpatient Unit",
    oxygenReq: "Standard Oxygen",
    infectionRisk: false,
    diagnosis: "Acute Viral Bronchiolitis"
  },
  {
    title: "Case E: Subacute Internal Medicine",
    name: "George Wilson",
    age: 72,
    gender: "Male",
    acuityScore: 4,
    requiredWard: "GMW-M",
    bedType: "Standard Inpatient Medical Bed",
    oxygenReq: "Standard Oxygen",
    infectionRisk: false,
    diagnosis: "Community Acquired Pneumonia & Dehydration"
  }
];

const SmartAllocation = () => {
  const {
    wards,
    beds,
    evaluateSmartBedAllocation,
    allocateBed,
    metrics
  } = useHospital();

  const [formData, setFormData] = useState({
    name: "Arthur Pendelton",
    age: 68,
    gender: "Male",
    acuityScore: 1,
    requiredWard: "MICU",
    bedType: "Invasive Ventilator ICU Suite",
    oxygenReq: "Invasive Mechanical Ventilation",
    infectionRisk: false,
    diagnosis: "Severe Sepsis & Refractory Hypotension",
    doctor: "Dr. Robert Vance"
  });

  const [simulationResult, setSimulationResult] = useState(() =>
    evaluateSmartBedAllocation({
      name: "Arthur Pendelton",
      age: 68,
      gender: "Male",
      acuityScore: 1,
      requiredWard: "MICU",
      oxygenReq: "Invasive Mechanical Ventilation",
      infectionRisk: false
    })
  );

  const [isProcessing, setIsProcessing] = useState(false);
  const [allocationDone, setAllocationDone] = useState(false);

  const targetWardObj = wards.find((w) => w.id === formData.requiredWard) || wards[0];
  const availableBedsInTarget = beds.filter((b) => b.wardId === formData.requiredWard && b.status === "available").length;

  const handleSelectPresetCase = (clinicalCase) => {
    setFormData({
      ...clinicalCase,
      doctor: "Dr. Robert Vance"
    });
    setAllocationDone(false);
    const res = evaluateSmartBedAllocation(clinicalCase);
    setSimulationResult(res);
  };

  const handleRecalculate = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setAllocationDone(false);
    setTimeout(() => {
      const res = evaluateSmartBedAllocation(formData);
      setSimulationResult(res);
      setIsProcessing(false);
    }, 400);
  };

  const handleConfirm = () => {
    if (!simulationResult || !simulationResult.recommendedBed) return;
    const success = allocateBed(formData, simulationResult.recommendedBed.id, simulationResult.reasoning);
    if (success) {
      setAllocationDone(true);
    }
  };

  return (
    <div className="smart-allocation-page space-y-6">
      {/* Header */}
      <div className="card p-6 bg-white border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge badge-ai">
                <Brain size={14} />
                Multi-Criteria Decision Engine
              </span>
              <span className="text-xs text-muted font-mono">Real-Time Bed Optimization</span>
            </div>
            <h1 className="text-2xl font-extrabold text-main">
              Smart Bed Allocation System
            </h1>
            <p className="text-sm text-muted mt-1 max-w-2xl">
              Intelligently evaluates clinical emergency level, required ward specialty, infrastructure match, and infection isolation to recommend and allocate the optimal bed.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200 shrink-0">
            <div className="text-center px-2">
              <span className="text-[11px] text-muted block uppercase font-bold">Accuracy</span>
              <span className="text-lg font-bold font-mono text-emerald-600">99.4%</span>
            </div>
            <div className="h-7 w-px bg-slate-200" />
            <div className="text-center px-2">
              <span className="text-[11px] text-muted block uppercase font-bold">Free Beds</span>
              <span className="text-lg font-bold font-mono text-sky-600">{metrics.availableBeds}</span>
            </div>
          </div>
        </div>

        {/* Preset Quick Case Bar */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
            <Zap size={14} className="text-amber-500" />
            Load Preset Clinical Case:
          </span>
          {SAMPLE_CLINICAL_CASES.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              className="text-xs px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-medium transition"
              onClick={() => handleSelectPresetCase(sample)}
            >
              {sample.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Left Form & Right AI Demo Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Triage & Intake (5 Cols) */}
        <div className="card lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="card-header">
              <div className="card-title">
                <Sliders size={18} className="text-primary" />
                <span>Patient Triage & Admission Parameters</span>
              </div>
            </div>

            <form onSubmit={handleRecalculate} className="space-y-4">
              <div className="form-group">
                <label className="form-label">Patient Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                <label className="form-label">Emergency / Priority Level</label>
                <select
                  className="form-select"
                  value={formData.acuityScore}
                  onChange={(e) => setFormData({ ...formData, acuityScore: Number(e.target.value) })}
                >
                  <option value={1}>Level 1: Critical (Resuscitation / Immediate)</option>
                  <option value={2}>Level 2: Severe (Emergent &lt; 15 mins)</option>
                  <option value={3}>Level 3: Moderate (Urgent &lt; 30 mins)</option>
                  <option value={4}>Level 4: Less Urgent (&lt; 60 mins)</option>
                  <option value={5}>Level 5: Non-Urgent (Elective)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Required Ward</label>
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

              <div className="form-group">
                <label className="form-label">Primary Diagnosis</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Bed Type & Oxygen Support</label>
                <select
                  className="form-select"
                  value={formData.oxygenReq}
                  onChange={(e) => setFormData({ ...formData, oxygenReq: e.target.value })}
                >
                  <option value="Standard Oxygen">Standard Room Air / Low Flow</option>
                  <option value="High-Flow Oxygen (15L/min)">High-Flow Nasal Cannula</option>
                  <option value="Non-Invasive BiPAP">Non-Invasive BiPAP / CPAP</option>
                  <option value="Invasive Mechanical Ventilation">Invasive Mechanical Ventilator</option>
                </select>
              </div>

              <div className="form-group">
                <label className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.infectionRisk}
                    onChange={(e) => setFormData({ ...formData, infectionRisk: e.target.checked })}
                  />
                  <div>
                    <span className="text-xs font-bold text-main block">Infection Isolation Required</span>
                    <span className="text-[11px] text-muted">Negative Pressure Suite</span>
                  </div>
                </label>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg w-full"
                disabled={isProcessing}
              >
                <Brain size={18} />
                <span>{isProcessing ? "AI Evaluating Wards..." : "Re-Calculate AI Bed Match"}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Output: FRONTEND DEMO UI (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="card p-6 bg-white border-sky-200 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-sky-100 text-primary rounded-lg">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-main">Smart Bed Allocation Recommendation</h3>
                  <p className="text-xs text-muted">Real-time matching score & clinical placement reason</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="badge badge-ai font-mono font-bold text-sm px-3 py-1">
                  {simulationResult?.confidenceScore || 96}% MATCH
                </span>
              </div>
            </div>

            {simulationResult?.recommendedBed ? (
              <div className="pt-5 space-y-5">
                {/* 7 Required Spec Fields */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-muted block font-semibold">1. Patient Name</span>
                    <span className="text-sm font-bold text-main mt-0.5 block">{formData.name}</span>
                    <span className="text-[11px] text-muted">{formData.age}y • {formData.gender}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-muted block font-semibold">2. Emergency Level</span>
                    <div className="mt-1">
                      <PatientAcuityBadge acuity={`Level ${formData.acuityScore}`} score={formData.acuityScore} />
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-muted block font-semibold">3. Required Ward</span>
                    <span className="text-sm font-bold text-main mt-0.5 block">{targetWardObj.name}</span>
                    <span className="text-[11px] text-muted font-mono">{targetWardObj.code}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-muted block font-semibold">4. Bed Type</span>
                    <span className="text-xs font-bold text-slate-800 mt-0.5 block truncate" title={formData.bedType || formData.oxygenReq}>
                      {formData.oxygenReq}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-muted block font-semibold">5. Available Beds</span>
                    <span className="text-sm font-bold font-mono text-emerald-600 mt-0.5 block">
                      {availableBedsInTarget} Beds in Ward ({metrics.availableBeds} Total)
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-muted block font-semibold">6. Allocation Status</span>
                    <div className="mt-1">
                      <span className={`badge ${allocationDone ? "badge-available" : "badge-occupied"}`}>
                        {allocationDone ? "Allocated & Dispatched" : "Ready for Allocation"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 7. Recommended Bed Showcase */}
                <div className="p-5 bg-gradient-to-r from-sky-50 to-indigo-50/50 rounded-2xl border border-sky-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-primary text-white flex items-center justify-center shadow-sm">
                      <BedDouble size={28} />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                        Recommended Bed
                      </span>
                      <h2 className="text-3xl font-extrabold font-mono text-main">
                        Bed #{simulationResult.recommendedBed.id}
                      </h2>
                      <p className="text-xs font-semibold text-slate-700 mt-0.5">
                        {simulationResult.recommendedBed.wardName} • {simulationResult.recommendedBed.floor}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-start sm:items-end gap-1.5">
                    <BedStatusBadge status={allocationDone ? "occupied" : "available"} />
                    <span className="text-xs text-slate-600">
                      Charge Nurse: <strong>{simulationResult.recommendedBed.nurse}</strong>
                    </span>
                  </div>
                </div>

                {/* 8. Recommendation Reason */}
                <div className="p-4 bg-sky-50/70 rounded-xl border border-sky-200 text-xs text-slate-800 leading-relaxed">
                  <div className="flex items-center gap-1.5 font-bold text-sky-950 mb-1">
                    <Info size={15} className="text-primary" />
                    <span>Recommendation Reason:</span>
                  </div>
                  {simulationResult.reasoning}
                </div>

                {/* Multi-Criteria Matrix */}
                <div>
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                    Multi-Criteria Scoring Weights
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-muted block text-[11px]">Clinical Urgency</span>
                      <span className="font-bold font-mono text-emerald-600 text-sm">
                        {simulationResult.factors.clinicalUrgencyScore}%
                      </span>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-muted block text-[11px]">Resource Match</span>
                      <span className="font-bold font-mono text-sky-600 text-sm">
                        {simulationResult.factors.resourceMatchScore}%
                      </span>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-muted block text-[11px]">Infection Safety</span>
                      <span className="font-bold font-mono text-purple-600 text-sm">
                        {simulationResult.factors.infectionSafetyScore}%
                      </span>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-muted block text-[11px]">LOS Efficiency</span>
                      <span className="font-bold font-mono text-amber-600 text-sm">
                        {simulationResult.factors.losEfficiencyScore}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* 9. Action Button: Allocate Bed */}
                <div className="pt-3 flex items-center justify-between gap-4">
                  <div className="text-xs text-muted">
                    {allocationDone ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 size={16} /> Patient Assigned to Bed #{simulationResult.recommendedBed.id}
                      </span>
                    ) : (
                      "Click below to execute smart allocation and update bed registry."
                    )}
                  </div>

                  <button
                    type="button"
                    className={`btn btn-lg ${allocationDone ? "btn-secondary" : "btn-primary"}`}
                    onClick={handleConfirm}
                    disabled={allocationDone}
                  >
                    {allocationDone ? (
                      <>
                        <Check size={16} />
                        <span>Bed Allocated</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={17} />
                        <span>Allocate Bed</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500">
                <AlertTriangle size={36} className="text-amber-500 mx-auto mb-2" />
                <p className="font-bold text-sm">No Free Bed Matches Currently Available</p>
                <p className="text-xs text-muted mt-1">
                  Consider requesting an inter-ward step-down transfer to release an ICU bed.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartAllocation;
