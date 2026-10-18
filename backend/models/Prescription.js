const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
  medicineName: { type: String, required: true, trim: true },
  dosage: { type: String, required: true },
  frequency: { type: String, default: null },
  duration: { type: String, default: null },
  instructions: { type: String, default: null },
  status: { type: String, enum: ["active", "completed", "discontinued"], default: "active" },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

prescriptionSchema.index({ patientId: 1 });
prescriptionSchema.index({ doctorId: 1 });

module.exports = mongoose.model("Prescription", prescriptionSchema);
