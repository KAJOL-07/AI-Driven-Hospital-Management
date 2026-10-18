import React, { useState } from "react";
import { useHospital } from "../context/HospitalContext";
import {
  UserPlus,
  Sparkles,
  CheckCircle2,
  BedDouble,
  Activity,
  HeartPulse,
  Building2,
  ArrowRight
} from "lucide-react";

const PatientRegistration = () => {
  const { wards, beds, allocateBed, setCurrentPage, addToast } = useHospital();

  const [formData, setFormData] = useState({
    name: "",
    age: 45,
    gender: "Male",
    wardId: "EMG",
    bedId: "",
    acuity: "Severe (Level 2)",
    acuityScore: 2,
    diagnosis: "",
    oxygenReq: "Standard Oxygen",
    infectionRisk: false,
    doctor: "Dr. Marcus Reed",
    contactPhone: "+1 (555) 349-1029",
    emergencyContact: "Family Contact (Spouse)",
    insuranceProvider: "BlueCross Health Plus"
  });

  const availableBedsInWard = beds.filter(
    (b) => b.wardId === formData.wardId && b.status === "available"
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const bedToAssign = formData.bedId || availableBedsInWard[0]?.id;

    if (!bedToAssign) {
      addToast(
        "No Available Beds",
        "Selected ward has no free beds. Please select another ward or use Smart Allocation.",
        "danger"
      );
      return;
    }

    const success = allocateBed(formData, bedToAssign, "Reception Patient Registration");
    if (success) {
      setCurrentPage("patient-management");
    }
  };

  return (
    <div className="patient-registration-page space-y-6">
      {/* Header */}
      <div className="card p-6 bg-white">
        <div className="flex items-center gap-2 mb-1">
          <span className="badge badge-ai">Patient Intake Desk</span>
          <span className="text-xs text-muted font-mono">Admission Protocol</span>
        </div>
        <h1 className="text-2xl font-extrabold text-main">
          Inpatient Registration & Intake Form
        </h1>
        <p className="text-sm text-muted mt-1 max-w-2xl">
          Register new incoming patients, log demographic data, perform clinical triage assessment, and assign available ward beds.
        </p>
      </div>

      {/* Registration Form Card */}
      <div className="card p-6 max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Demographics */}
          <div>
            <h3 className="text-sm font-bold text-main uppercase tracking-wider mb-3 pb-2 border-b border-slate-100 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-sky-100 text-primary text-xs flex items-center justify-center font-bold">1</span>
              <span>Patient Demographics</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="form-group sm:col-span-2">
                <label className="form-label">Full Legal Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Robert Michael Smith"
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
                <label className="form-label">Contact Phone</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Emergency Contact Relation</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Insurance Carrier</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.insuranceProvider}
                  onChange={(e) => setFormData({ ...formData, insuranceProvider: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Clinical Assessment */}
          <div>
            <h3 className="text-sm font-bold text-main uppercase tracking-wider mb-3 pb-2 border-b border-slate-100 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-sky-100 text-primary text-xs flex items-center justify-center font-bold">2</span>
              <span>Clinical Triage & Diagnosis</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-group sm:col-span-2">
                <label className="form-label">Chief Complaint / Primary Diagnosis</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Acute Coronary Syndrome, Sepsis, Trauma"
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Clinical Triage / Acuity Level</label>
                <select
                  className="form-select"
                  value={formData.acuity}
                  onChange={(e) => setFormData({ ...formData, acuity: e.target.value })}
                >
                  <option value="Critical (Level 1)">Level 1: Critical (Resuscitation)</option>
                  <option value="Severe (Level 2)">Level 2: Severe (Emergent)</option>
                  <option value="Moderate (Level 3)">Level 3: Moderate (Urgent)</option>
                  <option value="Stable (Level 4)">Level 4: Stable (Observation)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Oxygen / Respiratory Support</label>
                <select
                  className="form-select"
                  value={formData.oxygenReq}
                  onChange={(e) => setFormData({ ...formData, oxygenReq: e.target.value })}
                >
                  <option value="Standard Oxygen">Room Air / Low Flow Cannula</option>
                  <option value="High-Flow Oxygen (15L/min)">High-Flow Nasal Oxygen</option>
                  <option value="Non-Invasive BiPAP">Non-Invasive BiPAP / CPAP</option>
                  <option value="Invasive Mechanical Ventilation">Invasive Ventilator</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Bed Placement */}
          <div>
            <h3 className="text-sm font-bold text-main uppercase tracking-wider mb-3 pb-2 border-b border-slate-100 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-sky-100 text-primary text-xs flex items-center justify-center font-bold">3</span>
              <span>Ward Placement & Bed Assignment</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Target Ward</label>
                <select
                  className="form-select"
                  value={formData.wardId}
                  onChange={(e) => setFormData({ ...formData, wardId: e.target.value, bedId: "" })}
                >
                  {wards.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name} ({w.availableBeds} Free Beds)
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Select Available Bed</label>
                <select
                  className="form-select"
                  value={formData.bedId}
                  onChange={(e) => setFormData({ ...formData, bedId: e.target.value })}
                >
                  <option value="">-- Auto-Assign First Available Bed --</option>
                  {availableBedsInWard.map((b) => (
                    <option key={b.id} value={b.id}>
                      Bed #{b.id} ({b.floor})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setCurrentPage("dashboard")}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-lg">
              <CheckCircle2 size={18} />
              <span>Complete Registration & Assign Bed</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientRegistration;
