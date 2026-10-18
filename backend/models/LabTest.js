const mongoose = require("mongoose");

const labTestSchema = new mongoose.Schema({
  testId: { type: String, unique: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  testType: { type: String, required: true, trim: true },
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
  result: { type: String, default: null },
  remarks: { type: String, default: null },
  priority: { type: String, default: "routine" },
  status: { type: String, enum: ["requested", "in_progress", "completed", "cancelled"], default: "requested" },
  completedAt: { type: Date, default: null },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

labTestSchema.index({ patientId: 1 });
labTestSchema.index({ requestedBy: 1 });
labTestSchema.index({ status: 1 });

module.exports = mongoose.model("LabTest", labTestSchema);
