import React, { useState, useEffect } from "react";
import { useHospital } from "../../context/HospitalContext";
import {
  apiGetBeds,
  apiGetDoctors,
  apiCreatePatient,
  apiCreateAdmission
} from "../../services/api";
import {
  UserPlus,
  X,
  BedDouble,
  CheckCircle,
  Building2,
  DoorOpen,
  Stethoscope,
  HeartPulse,
  Brain,
  Bone,
  Baby,
  Wind
} from "lucide-react";

const AdmitPatientModal = () => {
  const {
    isAdmitModalOpen,
    setIsAdmitModalOpen,
    allocateBed,
    addToast
  } = useHospital();

  const [floor, setFloor] = useState("Ground Floor"); // "Ground Floor" | "First Floor" | "Second Floor"
  const [specialty, setSpecialty] = useState("Cardiology");
  const [availableBeds, setAvailableBeds] = useState([]);
  const [selectedBedId, setSelectedBedId] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    age: 45,
    gender: "Male",
    phone: "+1-555-0100",
    acuity: "Severe (Level 2)",
    acuityScore: 2,
    diagnosis: "",
    priority: "medium",
    oxygenReq: "Standard Oxygen",
    infectionRisk: false
  });

  // Fetch available beds and doctors when modal opens or floor/specialty changes
  useEffect(() => {
    if (!isAdmitModalOpen) return;

    const loadOptions = async () => {
      try {
        const queryParams = { status: "available" };
        if (floor === "Ground Floor") {
          queryParams.floor = "Ground Floor";
        } else if (floor === "First Floor") {
          queryParams.floor = "First Floor";
          queryParams.specialty = specialty;
        } else if (floor === "Second Floor") {
          queryParams.floor = "Second Floor";
          queryParams.specialty = specialty;
        }

        const [bedsRes, docsRes] = await Promise.all([
          apiGetBeds(queryParams).catch(() => null),
          apiGetDoctors().catch(() => null)
        ]);

        if (bedsRes && bedsRes.data) {
          setAvailableBeds(bedsRes.data);
          if (bedsRes.data.length > 0) {
            setSelectedBedId(bedsRes.data[0].id || bedsRes.data[0]._id);
          } else {
            setSelectedBedId("");
          }
        }

        if (docsRes && docsRes.data) {
          setDoctors(docsRes.data);
          if (docsRes.data.length > 0) {
            setSelectedDoctorId(docsRes.data[0].id || docsRes.data[0]._id);
          }
        }
      } catch (err) {
        console.error("Error loading admission choices:", err);
      }
    };

    loadOptions();
  }, [isAdmitModalOpen, floor, specialty]);

  if (!isAdmitModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBedId) {
      alert("No available beds in the selected floor / specialty. Please select another specialty or floor.");
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedBedObj = availableBeds.find(
        (b) => (b.id || b._id) === selectedBedId
      );
      const selectedDocObj = doctors.find(
        (d) => (d.id || d._id) === selectedDoctorId
      );

      // 1. Create Patient in database if backend is connected
      let newPatientId = null;
      try {
        const nameParts = formData.name.trim().split(" ");
        const firstName = nameParts[0] || "Patient";
        const lastName = nameParts.slice(1).join(" ") || "Doe";

        const patRes = await apiCreatePatient({
          first_name: firstName,
          last_name: lastName,
          gender: formData.gender.toLowerCase(),
          date_of_birth: new Date(Date.now() - formData.age * 365.25 * 24 * 3600 * 1000).toISOString().slice(0, 10),
          phone: formData.phone || "+1-555-0199",
          department_id: selectedBedObj?.ward_id?.departmentId || null
        });

        if (patRes && patRes.data) {
          newPatientId = patRes.data.id || patRes.data._id;
        }
      } catch (patErr) {
        console.warn("Backend patient creation fallback:", patErr.message);
      }

      // 2. Create Admission in database
      if (newPatientId && selectedBedObj) {
        try {
          await apiCreateAdmission({
            patient_id: newPatientId,
            doctor_id: selectedDoctorId || (selectedDocObj?.id || selectedDocObj?._id),
            ward_id: selectedBedObj.ward_id || selectedBedObj.wardId,
            bed_id: selectedBedId,
            admission_reason: formData.diagnosis || "Clinical Inpatient Admission",
            priority: formData.priority || "medium"
          });
        } catch (admErr) {
          console.warn("Backend admission API fallback:", admErr.message);
        }
      }

      // 3. Update local state
      allocateBed(
        {
          ...formData,
          doctor: selectedDocObj?.name || "Dr. Robert Vance",
          floor: floor,
          roomNumber: selectedBedObj?.room_number || null
        },
        selectedBedObj?.bed_number || selectedBedId,
        `Floor Intake: ${floor} - ${selectedBedObj?.specialty || "General Ward"}`
      );

      addToast(
        "Admission Confirmed",
        `${formData.name} admitted to ${floor} (${selectedBedObj?.room_number ? `Room ${selectedBedObj.room_number} • Bed ${selectedBedObj.bed_number}` : `Bed ${selectedBedObj?.bed_number}`})`,
        "success"
      );

      setIsAdmitModalOpen(false);
      setFormData({
        name: "",
        age: 45,
        gender: "Male",
        phone: "+1-555-0100",
        acuity: "Severe (Level 2)",
        acuityScore: 2,
        diagnosis: "",
        priority: "medium",
        oxygenReq: "Standard Oxygen",
        infectionRisk: false
      });
    } catch (err) {
      addToast("Admission Error", err.message, "danger");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setIsAdmitModalOpen(false)}>
      <div className="modal-content max-w-xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
              <UserPlus size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Floor-Wise Patient Admission</h2>
              <p className="text-xs text-muted">Intelligent Clinical Intake & Bed Allocation</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={() => setIsAdmitModalOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body space-y-4">
            {/* Step 1: Floor Selection */}
            <div className="form-group">
              <label className="form-label font-bold text-slate-800">
                1. Select Target Floor <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  className={`flex items-center gap-2 p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    floor === "Ground Floor"
                      ? "border-primary bg-sky-50 text-primary font-bold shadow-xs"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                  onClick={() => setFloor("Ground Floor")}
                >
                  <Building2 size={18} />
                  <div>
                    <div className="text-xs">Ground Floor</div>
                    <div className="text-[11px] font-normal text-muted">General Ward Hall</div>
                  </div>
                </button>

                <button
                  type="button"
                  className={`flex items-center gap-2 p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    floor === "First Floor"
                      ? "border-primary bg-sky-50 text-primary font-bold shadow-xs"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                  onClick={() => {
                    setFloor("First Floor");
                    setSpecialty("Cardiology");
                  }}
                >
                  <DoorOpen size={18} />
                  <div>
                    <div className="text-xs">First Floor</div>
                    <div className="text-[11px] font-normal text-muted">Specialty Rooms (101–150)</div>
                  </div>
                </button>

                <button
                  type="button"
                  className={`flex items-center gap-2 p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    floor === "Second Floor"
                      ? "border-primary bg-sky-50 text-primary font-bold shadow-xs"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                  onClick={() => {
                    setFloor("Second Floor");
                    setSpecialty("Pediatrics");
                  }}
                >
                  <DoorOpen size={18} />
                  <div>
                    <div className="text-xs">Second Floor</div>
                    <div className="text-[11px] font-normal text-muted">Specialty Rooms (201–250)</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Step 2: Specialty Selection (First Floor or Second Floor) */}
            {floor === "First Floor" && (
              <div className="form-group">
                <label className="form-label font-bold text-slate-800">
                  2. Select First Floor Specialty Wing <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                  {[
                    { name: "Cardiology", label: "Cardio (101-110)" },
                    { name: "Neurology", label: "Neuro (111-120)" },
                    { name: "Orthopedics", label: "Ortho (121-130)" },
                    { name: "Gynecology", label: "Gynec (131-140)" },
                    { name: "Pulmonology", label: "Pulmo (141-150)" }
                  ].map((s) => (
                    <button
                      key={s.name}
                      type="button"
                      className={`py-2 px-1 text-center rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                        specialty === s.name
                          ? "bg-primary text-white border-primary shadow-xs"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                      }`}
                      onClick={() => setSpecialty(s.name)}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {floor === "Second Floor" && (
              <div className="form-group">
                <label className="form-label font-bold text-slate-800">
                  2. Select Second Floor Specialty Wing <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5">
                  {[
                    { name: "Pediatrics", label: "Pediatrics (201-210)" },
                    { name: "Oncology", label: "Oncology (211-220)" },
                    { name: "Nephrology", label: "Nephro (221-226)" },
                    { name: "Urology", label: "Urology (227-232)" },
                    { name: "ENT", label: "ENT (233-238)" },
                    { name: "Ophthalmology", label: "Opthal (239-244)" },
                    { name: "Dermatology", label: "Derma (245-250)" }
                  ].map((s) => (
                    <button
                      key={s.name}
                      type="button"
                      className={`py-2 px-1 text-center rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                        specialty === s.name
                          ? "bg-primary text-white border-primary shadow-xs"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                      }`}
                      onClick={() => setSpecialty(s.name)}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Room & Bed Selection */}
            <div className="form-group">
              <label className="form-label font-bold text-slate-800">
                {floor !== "Ground Floor" ? "3. Select Available Room & Bed" : "2. Select Available Bed in General Ward"} <span className="text-rose-500">*</span>
              </label>
              {availableBeds.length === 0 ? (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 font-medium">
                  ⚠️ No beds currently available in this section. All beds are either occupied, under sanitization, or reserved.
                </div>
              ) : (
                <select
                  className="form-select text-xs"
                  value={selectedBedId}
                  onChange={(e) => setSelectedBedId(e.target.value)}
                  required
                >
                  {availableBeds.map((b) => {
                    const id = b.id || b._id;
                    const label = b.room_number
                      ? `Room No: ${b.room_number}  |  Bed No: ${b.bed_number} (${b.specialty})`
                      : `Bed No: ${b.bed_number}  (${floor})`;
                    return (
                      <option key={id} value={id}>
                        {label}
                      </option>
                    );
                  })}
                </select>
              )}
            </div>

            {/* Step 4: Doctor Assignment */}
            <div className="form-group">
              <label className="form-label font-bold text-slate-800">
                {floor !== "Ground Floor" ? "4. Assign Attending Specialist Doctor" : "3. Assign Attending Doctor"} <span className="text-rose-500">*</span>
              </label>
              <select
                className="form-select text-xs"
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                required
              >
                {doctors.map((d) => {
                  const id = d.id || d._id;
                  return (
                    <option key={id} value={id}>
                      {d.name} — {d.specialization} ({d.qualification || "Physician"})
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Step 5: Patient Details */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <div className="form-group">
                <label className="form-label">Patient Full Name <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  className="form-control text-xs"
                  placeholder="e.g. Eleanor Vance"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div className="form-group">
                  <label className="form-label">Age</label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    className="form-control text-xs"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select
                    className="form-select text-xs"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select
                    className="form-select text-xs"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option value="emergency">Emergency</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Diagnosis / Reason for Admission <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  className="form-control text-xs"
                  placeholder="e.g. Acute Coronary Syndrome, Unstable Angina"
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setIsAdmitModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-sm flex items-center gap-1.5"
              disabled={isSubmitting || availableBeds.length === 0}
            >
              <CheckCircle size={15} />
              <span>{isSubmitting ? "Processing..." : "Confirm & Admit Patient"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdmitPatientModal;
