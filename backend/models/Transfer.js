const mongoose = require("mongoose");

const transferSchema = new mongoose.Schema({
  transferId: { type: String, unique: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  sourceWardId: { type: mongoose.Schema.Types.ObjectId, ref: "Ward", required: true },
  sourceBedId: { type: mongoose.Schema.Types.ObjectId, ref: "Bed", default: null },
  destinationWardId: { type: mongoose.Schema.Types.ObjectId, ref: "Ward", required: true },
  destinationBedId: { type: mongoose.Schema.Types.ObjectId, ref: "Bed", default: null },
  priority: { type: String, default: "urgent" },
  clinicalReason: { type: String, required: true },
  requestedById: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  approvedById: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  rejectionReason: { type: String, default: null },
  status: {
    type: String,
    enum: ["requested", "pending_approval", "approved", "in_progress", "completed", "rejected"],
    default: "requested"
  },
  completedAt: { type: Date, default: null },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

transferSchema.index({ patientId: 1 });
transferSchema.index({ status: 1 });
transferSchema.index({ sourceWardId: 1 });
transferSchema.index({ destinationWardId: 1 });

module.exports = mongoose.model("Transfer", transferSchema);
