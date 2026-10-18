const mongoose = require("mongoose");

const medicalRecordSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", default: null },
  diagnosis: { type: String, required: true },
  symptoms: { type: String, default: null },
  notes: { type: String, default: null },
  treatment: { type: String, default: null },
  vitalSigns: { type: mongoose.Schema.Types.Mixed, default: null },
  followUpDate: { type: Date, default: null },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

medicalRecordSchema.index({ patientId: 1 });
medicalRecordSchema.index({ doctorId: 1 });

module.exports = mongoose.model("MedicalRecord", medicalRecordSchema);
