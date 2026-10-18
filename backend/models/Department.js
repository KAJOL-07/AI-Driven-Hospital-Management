const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  code: { type: String, default: null, trim: true },
  description: { type: String, default: null },
  floor: {
    type: String,
    enum: ["Ground Floor", "First Floor", "Second Floor"],
    default: "Ground Floor"
  },
  headDoctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", default: null },
  location: { type: String, default: null },
  phone: { type: String, default: null },
  status: { type: String, enum: ["active", "inactive", "deleted"], default: "active" }
}, { timestamps: true });

departmentSchema.index({ status: 1 });
departmentSchema.index({ floor: 1 });

module.exports = mongoose.model("Department", departmentSchema);
