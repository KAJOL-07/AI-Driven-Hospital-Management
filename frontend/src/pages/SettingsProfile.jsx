import React, { useState } from "react";
import { useHospital } from "../context/HospitalContext";
import {
  UserCheck,
  Settings,
  Brain,
  Sliders,
  ShieldCheck,
  Save,
  CheckCircle2,
  Bell,
  Lock,
  Sparkles,
  AlertTriangle
} from "lucide-react";

const SettingsProfile = () => {
  const {
    currentRole,
    currentRoleKey,
    setRole,
    aiSettings,
    setAiSettings,
    addToast
  } = useHospital();

  const [activeTab, setActiveTab] = useState("ai"); // "ai" or "profile"

  const [weights, setWeights] = useState({
    urgencyWeight: aiSettings.urgencyWeight,
    resourceMatchWeight: aiSettings.resourceMatchWeight,
    infectionControlWeight: aiSettings.infectionControlWeight,
    losForecastWeight: aiSettings.losForecastWeight
  });

  const [autoBuffer, setAutoBuffer] = useState(aiSettings.autoReserveBuffer);
  const [preventBottlenecks, setPreventBottlenecks] = useState(aiSettings.preventWardBottlenecks);

  const handleSaveAiConfig = (e) => {
    e.preventDefault();
    setAiSettings({
      ...aiSettings,
      ...weights,
      autoReserveBuffer: autoBuffer,
      preventWardBottlenecks: preventBottlenecks
    });
    addToast("Configuration Saved", "AI Multi-Criteria Weights & Thresholds updated.", "success");
  };

  return (
    <div className="settings-profile-page space-y-6">
      {/* Header */}
      <div className="card p-6 bg-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge badge-ai">System Preferences</span>
              <span className="text-xs text-muted font-mono">Algorithm v3.2 & User Profile</span>
            </div>
            <h1 className="text-2xl font-extrabold text-main">
              AI System Configuration & Staff Profile
            </h1>
            <p className="text-sm text-muted mt-1 max-w-2xl">
              Calibrate multi-criteria decision weights for the AI Smart Bed Allocation engine and view clinical credentialing details.
            </p>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              className={`btn btn-sm ${activeTab === "ai" ? "btn-primary" : "btn-secondary bg-transparent border-0"}`}
              onClick={() => setActiveTab("ai")}
            >
              <Brain size={15} />
              <span>AI Algorithm Config</span>
            </button>
            <button
              className={`btn btn-sm ${activeTab === "profile" ? "btn-primary" : "btn-secondary bg-transparent border-0"}`}
              onClick={() => setActiveTab("profile")}
            >
              <UserCheck size={15} />
              <span>Staff Profile</span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === "ai" ? (
        /* AI Settings Form */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="card lg:col-span-8">
            <div className="card-header">
              <div className="card-title">
                <Sliders size={18} className="text-primary" />
                <span>Multi-Criteria Decision Analysis (MCDA) Scoring Weights</span>
              </div>
              <span className="text-xs font-mono text-muted">Total: 100%</span>
            </div>

            <form onSubmit={handleSaveAiConfig} className="space-y-6">
              {/* Urgency Weight Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-main">1. Clinical Triage Urgency & Acuity Score Weight</span>
                  <span className="font-mono font-bold text-primary">{weights.urgencyWeight}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  value={weights.urgencyWeight}
                  onChange={(e) => setWeights({ ...weights, urgencyWeight: Number(e.target.value) })}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
                />
                <p className="text-xs text-muted">
                  Prioritizes Level 1 (Resuscitation) and Level 2 (Emergent) patients over elective admissions.
                </p>
              </div>

              {/* Resource Match Weight Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-main">2. Medical Equipment & Ward Specialty Compatibility</span>
                  <span className="font-mono font-bold text-sky-600">{weights.resourceMatchWeight}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  value={weights.resourceMatchWeight}
                  onChange={(e) => setWeights({ ...weights, resourceMatchWeight: Number(e.target.value) })}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
                />
                <p className="text-xs text-muted">
                  Matches specific ventilator requirements, continuous cardiac monitoring, and nurse-to-patient staffing.
                </p>
              </div>

              {/* Infection Control Weight */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-main">3. Infection Control & Negative Pressure Isolation</span>
                  <span className="font-mono font-bold text-purple-600">{weights.infectionControlWeight}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="40"
                  value={weights.infectionControlWeight}
                  onChange={(e) => setWeights({ ...weights, infectionControlWeight: Number(e.target.value) })}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <p className="text-xs text-muted">
                  Routes airborne and droplet infection cases strictly to certified isolation suites.
                </p>
              </div>

              {/* LOS Weight */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-main">4. Length of Stay (LOS) Forecast & Turnover Efficiency</span>
                  <span className="font-mono font-bold text-amber-600">{weights.losForecastWeight}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="40"
                  value={weights.losForecastWeight}
                  onChange={(e) => setWeights({ ...weights, losForecastWeight: Number(e.target.value) })}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                />
                <p className="text-xs text-muted">
                  Prevents bed locking by patients with long projected recovery timelines in high-demand units.
                </p>
              </div>

              {/* Toggles */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoBuffer}
                    onChange={(e) => setAutoBuffer(e.target.checked)}
                    className="w-4 h-4 text-primary rounded"
                  />
                  <div>
                    <span className="text-sm font-bold text-main block">
                      Auto-Reserve Emergency Trauma Buffer Beds
                    </span>
                    <span className="text-xs text-muted">
                      Keeps 2 ICU beds and 3 Emergency bays reserved during high-demand hours.
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preventBottlenecks}
                    onChange={(e) => setPreventBottlenecks(e.target.checked)}
                    className="w-4 h-4 text-primary rounded"
                  />
                  <div>
                    <span className="text-sm font-bold text-main block">
                      Enable Proactive Step-Down Transfer Suggestions
                    </span>
                    <span className="text-xs text-muted">
                      Triggers automated step-down recommendations when ICU exceeds 85% occupancy.
                    </span>
                  </div>
                </label>
              </div>

              <div className="pt-3 flex justify-end">
                <button type="submit" className="btn btn-primary btn-lg">
                  <Save size={18} />
                  <span>Save AI Configuration</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Info Box */}
          <div className="space-y-5 lg:col-span-4">
            <div className="card p-5 bg-gradient-to-br from-slate-900 to-sky-950 text-white">
              <div className="flex items-center gap-2 text-sky-400 mb-3">
                <Sparkles size={20} />
                <span className="font-bold text-xs uppercase tracking-wider">
                  Algorithm Architecture
                </span>
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                Hybrid MCDA + ARIMA Pipeline
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed space-y-2">
                The MediFlow allocation engine pairs Analytical Hierarchy Process (AHP) multi-criteria ranking with time-series capacity forecasting to maximize bed utilization and patient safety.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between text-xs font-mono">
                <span className="text-slate-400">Inference Latency:</span>
                <span className="text-emerald-400 font-bold">&lt; 120ms</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Staff Profile View */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="card lg:col-span-4 p-6 text-center">
            <img
              src={currentRole.avatar}
              alt={currentRole.name}
              className="w-28 h-28 rounded-2xl mx-auto mb-4 object-cover border-4 border-slate-100 shadow-md"
            />
            <h2 className="text-xl font-bold text-main">{currentRole.name}</h2>
            <span className="badge badge-ai mt-1">{currentRole.roleName}</span>
            <p className="text-xs text-muted mt-2">{currentRole.title}</p>
            <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-700 space-y-1.5">
              <div>Department: <strong>{currentRole.dept}</strong></div>
              <div>Active Shift: <strong>{currentRole.shift}</strong></div>
            </div>
          </div>

          <div className="card lg:col-span-8 p-6 space-y-4">
            <div className="card-header">
              <div className="card-title">
                <ShieldCheck size={18} className="text-primary" />
                <span>Clinical Privileges & Hospital Credentials</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-muted block">Medical License ID</span>
                <span className="font-mono font-bold text-main text-sm">MD-NY-2026-88192</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-muted block">Bed Allocation Authority</span>
                <span className="font-bold text-emerald-600 text-sm">Full Critical & General Override</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-muted block">Assigned Primary Unit</span>
                <span className="font-bold text-main text-sm">Critical Care & Operations</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-muted block">Security Clearance</span>
                <span className="font-bold text-primary text-sm">Level 4: Administrative Command</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsProfile;
