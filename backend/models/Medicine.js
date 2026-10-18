const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true, default: 0 },
  unit: { type: String, required: true },
  price: { type: Number, default: 0 },
  expiryDate: { type: Date, default: null },
  supplier: { type: String, default: null },
  minStockLevel: { type: Number, default: 10 },
  description: { type: String, default: null },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

medicineSchema.index({ name: "text", supplier: "text" });
medicineSchema.index({ category: 1 });

module.exports = mongoose.model("Medicine", medicineSchema);
