const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  itemName: { type: String, required: true, trim: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true, default: 0 },
  unit: { type: String, required: true },
  price: { type: Number, default: 0 },
  supplier: { type: String, default: null },
  expiryDate: { type: Date, default: null },
  minStockLevel: { type: Number, default: 10 },
  location: { type: String, default: null },
  description: { type: String, default: null },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

inventorySchema.index({ itemName: "text", supplier: "text" });
inventorySchema.index({ category: 1 });

module.exports = mongoose.model("Inventory", inventorySchema);
