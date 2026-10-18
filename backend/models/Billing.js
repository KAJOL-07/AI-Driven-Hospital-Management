const mongoose = require("mongoose");

const billingSchema = new mongoose.Schema({
  billId: { type: String, unique: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  admissionId: { type: mongoose.Schema.Types.ObjectId, ref: "Admission", default: null },
  consultationFee: { type: Number, default: 0 },
  bedCharges: { type: Number, default: 0 },
  labCharges: { type: Number, default: 0 },
  pharmacyCharges: { type: Number, default: 0 },
  otherCharges: { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 },
  paidAmount: { type: Number, default: 0 },
  pendingAmount: { type: Number, default: 0 },
  paymentStatus: { type: String, enum: ["paid", "partially_paid", "pending"], default: "pending" },
  notes: { type: String, default: null },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

billingSchema.index({ patientId: 1 });
billingSchema.index({ paymentStatus: 1 });

module.exports = mongoose.model("Billing", billingSchema);
