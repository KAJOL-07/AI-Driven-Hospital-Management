const mongoose = require("mongoose");

const dischargeSchema = new mongoose.Schema({
  dischargeId: { type: String, unique: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  admissionId: { type: mongoose.Schema.Types.ObjectId, ref: "Admission", required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
  wardId: { type: mongoose.Schema.Types.ObjectId, ref: "Ward", required: true },
  bedId: { type: mongoose.Schema.Types.ObjectId, ref: "Bed", required: true },
  dischargeDate: { type: Date, default: Date.now },
  dischargeReason: { type: String, required: true },
  notes: { type: String, default: null },
  dischargeType: {
    type: String,
    enum: ["regular", "against_medical_advice", "transfer", "expired"],
    default: "regular"
  },
  status: { type: String, enum: ["completed", "pending"], default: "completed" }
}, { timestamps: true });

dischargeSchema.index({ patientId: 1 });
dischargeSchema.index({ dischargeDate: -1 });

module.exports = mongoose.model("Discharge", dischargeSchema);
