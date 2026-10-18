const mongoose = require("mongoose");

const bedSchema = new mongoose.Schema({
  bedNumber: { type: String, required: true },
  roomNumber: { type: String, default: null }, // e.g. "101", "102", "201" or null for General Ward
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", default: null },
  floor: {
    type: String,
    enum: ["Ground Floor", "First Floor", "Second Floor"],
    default: "Ground Floor"
  },
  specialty: { type: String, default: "General Ward" },
  wardId: { type: mongoose.Schema.Types.ObjectId, ref: "Ward", required: true },
  bedType: { type: String, default: "standard" }, // standard, icu, emergency, isolation, specialty
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", default: null },
  features: { type: String, default: null },
  status: {
    type: String,
    enum: [
      "available",
      "occupied",
      "cleaning_required",
      "cleaning_in_progress",
      "reserved",
      "maintenance",
      "cleaning"
    ],
    default: "available"
  },
  lastCleaned: { type: String, default: "Recently Sterilized" },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

bedSchema.index({ floor: 1 });
bedSchema.index({ specialty: 1 });
bedSchema.index({ roomNumber: 1 });
bedSchema.index({ roomId: 1 });
bedSchema.index({ wardId: 1 });
bedSchema.index({ status: 1 });
bedSchema.index({ bedNumber: 1 });

module.exports = mongoose.model("Bed", bedSchema);
