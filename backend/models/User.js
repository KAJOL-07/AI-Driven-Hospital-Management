const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "doctor", "nurse", "receptionist"], required: true, default: "admin" },
  department: { type: String, default: null },
  phone: { type: String, default: null },
  avatar: { type: String, default: null },
  status: { type: String, enum: ["active", "inactive", "deleted"], default: "active" }
}, { timestamps: true });

userSchema.index({ status: 1 });

module.exports = mongoose.model("User", userSchema);
