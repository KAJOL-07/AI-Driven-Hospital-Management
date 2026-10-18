const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  doctorId: { type: String, unique: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, default: null },
  gender: { type: String, enum: ["male", "female", "other", null], default: null },
  age: { type: Number, default: null },
  specialization: { type: String, required: true, trim: true },
  qualification: { type: String, required: true, trim: true },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Department", default: null },
  experienceYears: { type: Number, default: 0 },
  shift: { type: String, default: "morning" },
  assignedWardId: { type: mongoose.Schema.Types.ObjectId, ref: "Ward", default: null },
  joiningDate: { type: Date, default: Date.now },
  availabilityStatus: {
    type: String,
    enum: ["present", "absent", "on_leave", "available", "busy", "emergency_duty", "off_duty"],
    default: "available"
  },
  status: { type: String, enum: ["active", "inactive", "deleted"], default: "active" }
}, { timestamps: true });

doctorSchema.index({ departmentId: 1 });
doctorSchema.index({ availabilityStatus: 1 });

module.exports = mongoose.model("Doctor", doctorSchema);
