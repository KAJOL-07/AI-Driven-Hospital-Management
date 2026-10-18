const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  appointmentId: { type: String, unique: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Department", default: null },
  appointmentDate: { type: Date, required: true },
  appointmentTime: { type: String, required: true },
  reason: { type: String, default: null },
  notes: { type: String, default: null },
  status: {
    type: String,
    enum: ["scheduled", "confirmed", "completed", "cancelled", "pending"],
    default: "scheduled"
  },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

appointmentSchema.index({ patientId: 1 });
appointmentSchema.index({ doctorId: 1 });
appointmentSchema.index({ appointmentDate: 1 });
appointmentSchema.index({ status: 1 });

module.exports = mongoose.model("Appointment", appointmentSchema);
