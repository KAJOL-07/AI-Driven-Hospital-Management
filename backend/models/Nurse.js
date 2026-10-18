const mongoose = require("mongoose");

const nurseSchema = new mongoose.Schema({
  nurseId: { type: String, unique: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, default: null },
  gender: { type: String, enum: ["male", "female", "other", null], default: null },
  age: { type: Number, default: null },
  qualification: { type: String, default: null },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Department", default: null },
  assignedWardId: { type: mongoose.Schema.Types.ObjectId, ref: "Ward", default: null },
  shift: { type: String, default: "morning" },
  joiningDate: { type: Date, default: Date.now },
  availabilityStatus: {
    type: String,
    enum: ["present", "absent", "on_leave", "on_duty", "available", "busy", "off_duty"],
    default: "available"
  },
  status: { type: String, enum: ["active", "inactive", "deleted"], default: "active" }
}, { timestamps: true });

nurseSchema.index({ departmentId: 1 });
nurseSchema.index({ assignedWardId: 1 });

module.exports = mongoose.model("Nurse", nurseSchema);
