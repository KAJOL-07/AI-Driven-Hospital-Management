const mongoose = require("mongoose");

const admissionSchema = new mongoose.Schema({
  admissionId: { type: String, unique: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
  wardId: { type: mongoose.Schema.Types.ObjectId, ref: "Ward", required: true },
  bedId: { type: mongoose.Schema.Types.ObjectId, ref: "Bed", required: true },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Department", default: null },
  admissionDate: { type: Date, default: Date.now },
  admissionReason: { type: String, required: true },
  priority: { type: String, enum: ["emergency", "high", "medium", "low"], default: "medium" },
  notes: { type: String, default: null },
  status: {
    type: String,
    enum: ["active", "discharged", "transferred", "cancelled"],
    default: "active"
  },
  dischargeDate: { type: Date, default: null }
}, { timestamps: true });

admissionSchema.index({ patientId: 1 });
admissionSchema.index({ doctorId: 1 });
admissionSchema.index({ wardId: 1 });
admissionSchema.index({ status: 1 });
admissionSchema.index({ admissionDate: -1 });

module.exports = mongoose.model("Admission", admissionSchema);
