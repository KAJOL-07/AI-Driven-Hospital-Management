const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  patientId: { type: String, unique: true },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  dateOfBirth: { type: Date, default: null },
  gender: { type: String, enum: ["male", "female", "other"], required: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, default: null },
  address: { type: String, default: null },
  bloodGroup: { type: String, default: null },
  emergencyContactName: { type: String, default: null },
  emergencyContactPhone: { type: String, default: null },
  allergies: { type: String, default: null },
  medicalHistory: { type: String, default: null },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Department", default: null },
  currentWardId: { type: mongoose.Schema.Types.ObjectId, ref: "Ward", default: null },
  currentBedId: { type: mongoose.Schema.Types.ObjectId, ref: "Bed", default: null },
  assignedDoctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", default: null },
  conditionStatus: {
    type: String,
    enum: ["critical", "serious", "stable", "improving", "under_observation"],
    default: "stable"
  },
  priority: { type: String, enum: ["emergency", "high", "medium", "low"], default: "medium" },
  admissionStatus: {
    type: String,
    enum: ["admitted", "outpatient", "discharged", "awaiting_admission"],
    default: "outpatient"
  },
  status: { type: String, enum: ["active", "inactive", "deleted"], default: "active" }
}, { timestamps: true });

// Text search support
patientSchema.index({ firstName: "text", lastName: "text", phone: "text", patientId: "text" });
patientSchema.index({ admissionStatus: 1 });
patientSchema.index({ conditionStatus: 1 });
patientSchema.index({ departmentId: 1 });
patientSchema.index({ currentWardId: 1 });
patientSchema.index({ assignedDoctorId: 1 });

// Virtual for full name
patientSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model("Patient", patientSchema);
