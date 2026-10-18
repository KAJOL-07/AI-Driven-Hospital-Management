const mongoose = require("mongoose");

const emergencyCaseSchema = new mongoose.Schema({
  caseId: { type: String, unique: true },
  patientName: { type: String, required: true, trim: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", default: null },
  priority: { type: String, enum: ["critical", "high", "medium", "low"], default: "critical" },
  conditionDescription: { type: String, required: true },
  requiredDepartmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Department", default: null },
  requiredBedType: { type: String, default: "emergency" },
  assignedDoctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", default: null },
  assignedBedId: { type: mongoose.Schema.Types.ObjectId, ref: "Bed", default: null },
  arrivalTime: { type: Date, default: Date.now },
  status: { type: String, enum: ["active", "admitted", "resolved", "cancelled"], default: "active" },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

emergencyCaseSchema.index({ status: 1 });
emergencyCaseSchema.index({ priority: 1 });

module.exports = mongoose.model("EmergencyCase", emergencyCaseSchema);
