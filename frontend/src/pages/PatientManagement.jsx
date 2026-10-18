import React, { useState } from "react";
import { useHospital } from "../context/HospitalContext";
import { PatientAcuityBadge } from "../components/common/StatusBadge";
import {
  Users,
  Search,
  PlusCircle,
  ArrowRightLeft,
  LogOut,
  Eye,
  Heart,
  Activity,
  Wind,
  Thermometer,
  FileText,
  Filter,
  CheckCircle2,
  Calendar,
  X,
  Phone,
  Mail,
  Building2,
  BedDouble
} from "lucide-react";

const PatientManagement = () => {
  const {
    patients,
    wards,
    beds,
    dischargePatient,
    setIsAdmitModalOpen,
    setIsTransferModalOpen,
    setSelectedPatient,
    setSelectedBed,
    setIsBedDetailsModalOpen,
    hospitalPatientStats
  } = useHospital();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAcuity, setSelectedAcuity] = useState("ALL");
  const [selectedWard, setSelectedWard] = useState("ALL");
  const [selectedPatientModal, setSelectedPatientModal] = useState(null);

  const filteredPatients = patients.filter((p) => {
    if (selectedAcuity !== "ALL") {
      if (selectedAcuity === "1" && p.acuityScore !== 1) return false;
      if (selectedAcuity === "2" && p.acuityScore !== 2) return false;
      if (selectedAcuity === "3" && p.acuityScore !== 3) return false;
      if (selectedAcuity === "4" && p.acuityScore >= 4 === false) return false;
    }

    if (selectedWard !== "ALL" && p.wardId !== selectedWard) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchMrn = p.mrn.toLowerCase().includes(q);
      const matchDiag = p.diagnosis.toLowerCase().includes(q);
      const matchDoc = p.doctor.toLowerCase().includes(q);
      const matchBed = p.bedId.toLowerCase().includes(q);
      if (!matchName && !matchMrn && !matchDiag && !matchDoc && !matchBed) return false;
    }

    return true;
  });

  const handleInspectBed = (bedId) => {
    const bed = beds.find((b) => b.id === bedId);
    if (bed) {
      setSelectedBed(bed);
      setIsBedDetailsModalOpen(true);
    }
  };

  const handleInitiateTransfer = (patient) => {
    setSelectedPatient(patient);
    setIsTransferModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* 1. PAGE TITLE & SHORT DESCRIPTION */}
      <div className="card p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge badge-ai">Inpatient Registry</span>
              <span className="text-xs text-muted font-mono">{patients.length} Active Patients</span>
            </div>
            <h1 className="text-2xl font-bold text-main">
              Patient Management
            </h1>
            <p className="text-sm text-muted mt-1 max-w-2xl">
              Manage patient registration, admissions, medical records and patient status across all hospital wards.
            </p>
          </div>

          <button
            className="btn btn-primary btn-md"
            onClick={() => setIsAdmitModalOpen(true)}
          >
            <PlusCircle size={16} />
            <span>Admit New Patient</span>
          </button>
        </div>

        {/* 2. IMPORTANT STATISTICS CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-slate-100 text-center">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-xs text-muted font-medium block mb-0.5">Total Registered</span>
            <span className="text-2xl font-bold font-mono text-main">
              {hospitalPatientStats.totalPatients.toLocaleString()}
            </span>
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
            <span className="text-xs text-emerald-800 font-semibold block mb-0.5">Currently Admitted</span>
            <span className="text-2xl font-bold font-mono text-emerald-700">
              {hospitalPatientStats.currentlyAdmitted}
            </span>
          </div>

          <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
            <span className="text-xs text-blue-800 font-semibold block mb-0.5">Today's Admissions</span>
            <span className="text-2xl font-bold font-mono text-blue-700">
              +{hospitalPatientStats.todaysAdmissions}
            </span>
          </div>

          <div className="p-3 bg-teal-50 rounded-xl border border-teal-200">
            <span className="text-xs text-teal-800 font-semibold block mb-0.5">Today's Discharges</span>
            <span className="text-2xl font-bold font-mono text-teal-700">
              -{hospitalPatientStats.todaysDischarges}
            </span>
          </div>
        </div>
      </div>

      {/* 3. SEARCH & FILTERS TOOLBAR */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative flex-1 w-full max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search by Patient Name, MRN, Diagnosis, or Bed ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control pl-9 text-xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-muted font-medium">Ward:</span>
              <select
                className="form-control text-xs py-1 px-2.5 h-auto w-auto"
                value={selectedWard}
                onChange={(e) => setSelectedWard(e.target.value)}
              >
                <option value="ALL">All Clinical Wards</option>
                {wards.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-muted font-medium">Acuity:</span>
              <select
                className="form-control text-xs py-1 px-2.5 h-auto w-auto"
                value={selectedAcuity}
                onChange={(e) => setSelectedAcuity(e.target.value)}
              >
                <option value="ALL">All Acuities</option>
                <option value="1">Level 1 - Critical</option>
                <option value="2">Level 2 - Severe</option>
                <option value="3">Level 3 - Moderate</option>
                <option value="4">Level 4 - Stable</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 4. MAIN CONTENT PATIENT TABLE */}
      <div className="card p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-primary" />
            <h2 className="font-bold text-main text-sm">Active Inpatient Roster ({filteredPatients.length})</h2>
          </div>
          <span className="text-xs text-muted font-mono">Showing filtered results</span>
        </div>

        <div className="table-container border-0 rounded-none">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Patient Details</th>
                <th>Bed & Ward</th>
                <th>Triage Acuity</th>
                <th>Diagnosis & Care</th>
                <th>Vitals Snapshot</th>
                <th>Attending Doctor</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <tr key={patient.id}>
                  <td>
                    <div className="font-bold text-main text-xs">{patient.name}</div>
                    <div className="text-[11px] text-muted font-mono">
                      {patient.mrn} • {patient.age}y ({patient.gender})
                    </div>
                  </td>
                  <td>
                    <span
                      className="font-bold font-mono text-primary cursor-pointer hover:underline text-xs"
                      onClick={() => handleInspectBed(patient.bedId)}
                    >
                      Bed #{patient.bedId}
                    </span>
                    <div className="text-[11px] text-muted">{patient.wardId}</div>
                  </td>
                  <td>
                    <PatientAcuityBadge acuity={patient.acuity} score={patient.acuityScore} />
                  </td>
                  <td>
                    <div className="text-xs font-semibold text-main max-w-xs truncate" title={patient.diagnosis}>
                      {patient.diagnosis}
                    </div>
                    <div className="text-[11px] text-muted truncate">{patient.oxygenReq}</div>
                  </td>
                  <td>
                    {patient.vitals ? (
                      <div className="flex items-center gap-2 text-xs font-mono">
                        <span className="text-rose-600 font-semibold" title="Heart Rate">HR: {patient.vitals.hr}</span>
                        <span className="text-blue-600 font-semibold" title="Blood Pressure">BP: {patient.vitals.bp}</span>
                        <span className="text-emerald-600 font-semibold" title="SpO2">O2: {patient.vitals.spo2}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted">Stable</span>
                    )}
                  </td>
                  <td className="text-xs text-slate-700 font-medium">
                    {patient.doctor}
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <button
                        className="btn btn-secondary btn-sm text-[11px] py-1 px-2"
                        onClick={() => setSelectedPatientModal(patient)}
                        title="View Patient Record"
                      >
                        <Eye size={12} />
                        <span>View</span>
                      </button>
                      <button
                        className="btn btn-secondary btn-sm text-[11px] py-1 px-2"
                        onClick={() => handleInitiateTransfer(patient)}
                        title="Request Transfer"
                      >
                        <ArrowRightLeft size={12} />
                      </button>
                      <button
                        className="btn btn-danger btn-sm text-[11px] py-1 px-2"
                        onClick={() => dischargePatient(patient.id)}
                        title="Discharge Patient"
                      >
                        <LogOut size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. PATIENT DETAILS MODAL */}
      {selectedPatientModal && (
        <div className="modal-backdrop" onClick={() => setSelectedPatientModal(null)}>
          <div className="modal-container max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="text-xs font-mono text-muted">{selectedPatientModal.mrn}</span>
                <h3 className="text-lg font-bold text-main">{selectedPatientModal.name}</h3>
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setSelectedPatientModal(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-muted block text-[11px]">Age / Gender</span>
                  <span className="font-bold text-main">{selectedPatientModal.age} years • {selectedPatientModal.gender}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-muted block text-[11px]">Ward & Bed</span>
                  <span className="font-bold text-primary font-mono">{selectedPatientModal.wardId} • Bed #{selectedPatientModal.bedId}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-muted block text-[11px]">Attending Physician</span>
                  <span className="font-bold text-main">{selectedPatientModal.doctor}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-muted block text-[11px]">Admission Date</span>
                  <span className="font-bold text-main font-mono">{selectedPatientModal.admitDate}</span>
                </div>
              </div>

              <div className="p-3.5 bg-sky-50 rounded-xl border border-sky-200 space-y-1">
                <span className="text-sky-800 font-bold block text-[11px]">Diagnosis & Oxygen Needs</span>
                <p className="font-semibold text-main text-xs">{selectedPatientModal.diagnosis}</p>
                <p className="text-muted text-[11px]">{selectedPatientModal.oxygenReq}</p>
              </div>

              {selectedPatientModal.vitals && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-muted font-bold block text-[11px] mb-1.5">Current Vital Telemetry</span>
                  <div className="grid grid-cols-3 gap-2 text-center font-mono">
                    <div className="p-1.5 bg-white rounded border border-slate-200">
                      <span className="text-[10px] text-muted block">Heart Rate</span>
                      <strong className="text-rose-600">{selectedPatientModal.vitals.hr} bpm</strong>
                    </div>
                    <div className="p-1.5 bg-white rounded border border-slate-200">
                      <span className="text-[10px] text-muted block">Blood Pressure</span>
                      <strong className="text-blue-600">{selectedPatientModal.vitals.bp}</strong>
                    </div>
                    <div className="p-1.5 bg-white rounded border border-slate-200">
                      <span className="text-[10px] text-muted block">Oxygen SpO2</span>
                      <strong className="text-emerald-600">{selectedPatientModal.vitals.spo2}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-end gap-2">
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setSelectedPatientModal(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientManagement;
