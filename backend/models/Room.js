const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true, unique: true, trim: true },
  floor: {
    type: String,
    enum: ["Ground Floor", "First Floor", "Second Floor"],
    required: true
  },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Department", required: true },
  wardId: { type: mongoose.Schema.Types.ObjectId, ref: "Ward", required: true },
  bedId: { type: mongoose.Schema.Types.ObjectId, ref: "Bed", default: null },
  specialization: { type: String, required: true, trim: true },
  roomType: { type: String, default: "single" }, // single, private, isolation
  status: {
    type: String,
    enum: ["active", "inactive", "maintenance"],
    default: "active"
  },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

roomSchema.index({ floor: 1 });
roomSchema.index({ departmentId: 1 });
roomSchema.index({ wardId: 1 });
roomSchema.index({ specialization: 1 });

module.exports = mongoose.model("Room", roomSchema);
