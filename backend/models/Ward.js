const mongoose = require("mongoose");

const wardSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  wardType: { type: String, required: true }, // icu, emergency, general, pediatric, oncology, etc.
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Department", required: true },
  floor: {
    type: String,
    enum: ["Ground Floor", "First Floor", "Second Floor"],
    default: "Ground Floor"
  },
  capacity: { type: Number, default: 20 },
  location: { type: String, default: null },
  description: { type: String, default: null },
  wardStatus: {
    type: String,
    enum: ["normal", "high_occupancy", "critical_occupancy", "full", "maintenance"],
    default: "normal"
  },
  status: { type: String, enum: ["active", "inactive", "deleted"], default: "active" }
}, { timestamps: true });

wardSchema.index({ departmentId: 1 });
wardSchema.index({ wardType: 1 });
wardSchema.index({ floor: 1 });

module.exports = mongoose.model("Ward", wardSchema);
