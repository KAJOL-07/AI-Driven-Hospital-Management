const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({
  staffId: { type: String, unique: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, default: null },
  gender: { type: String, enum: ["male", "female", "other", null], default: null },
  age: { type: Number, default: null },
  category: {
    type: String,
    enum: ["receptionist", "pharmacist", "lab_technician", "radiology", "admin", "billing", "housekeeping", "security", "maintenance", "attendant", "driver", "other"],
    required: true
  },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Department", default: null },
  shift: { type: String, default: "morning" },
  qualification: { type: String, default: null },
  joiningDate: { type: Date, default: Date.now },
  availabilityStatus: {
    type: String,
    enum: ["present", "absent", "on_leave", "on_duty", "available", "busy", "off_duty"],
    default: "available"
  },
  status: { type: String, enum: ["active", "inactive", "deleted"], default: "active" }
}, { timestamps: true });

staffSchema.index({ category: 1 });
staffSchema.index({ departmentId: 1 });

module.exports = mongoose.model("Staff", staffSchema);
