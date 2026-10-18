const Medicine = require("../models/Medicine");

const getStatus = (quantity, min_stock, expiry_date) => {
  if (expiry_date && new Date(expiry_date) < new Date()) return "expired";
  if (quantity === 0) return "out_of_stock";
  if (quantity <= min_stock) return "low_stock";
  return "available";
};

// GET /api/pharmacy
const getAllMedicines = async (req, res) => {
  try {
    const { category, status, search } = req.query;
    const filter = { isDeleted: false };
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { name: new RegExp(search, "i") },
        { supplier: new RegExp(search, "i") }
      ];
    }

    let medicines = await Medicine.find(filter).sort({ name: 1 }).lean();

    medicines = medicines.map(m => ({
      ...m,
      id: m._id,
      computed_status: getStatus(m.quantity, m.minStockLevel, m.expiryDate)
    }));

    if (status) {
      medicines = medicines.filter(m => m.computed_status === status);
    }

    res.json({ success: true, message: "Medicines retrieved.", data: medicines, count: medicines.length });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve medicines.", error: error.message });
  }
};

// GET /api/pharmacy/stats
const getMedicineStats = async (req, res) => {
  try {
    const medicines = await Medicine.find({ isDeleted: false }).lean();
    const stats = { total: medicines.length, available: 0, low_stock: 0, out_of_stock: 0, expired: 0 };
    medicines.forEach(m => {
      const s = getStatus(m.quantity, m.minStockLevel, m.expiryDate);
      stats[s] = (stats[s] || 0) + 1;
    });
    res.json({ success: true, message: "Medicine stats retrieved.", data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to get medicine stats.", error: error.message });
  }
};

// GET /api/pharmacy/low-stock
const getLowStockMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({ isDeleted: false }).lean();
    const alerts = medicines
      .map(m => ({
        ...m,
        id: m._id,
        computed_status: getStatus(m.quantity, m.minStockLevel, m.expiryDate)
      }))
      .filter(m => ["low_stock", "out_of_stock", "expired"].includes(m.computed_status));

    res.json({ success: true, message: "Stock alerts retrieved.", data: alerts, count: alerts.length });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to get stock alerts.", error: error.message });
  }
};

// GET /api/pharmacy/:id
const getMedicineById = async (req, res) => {
  try {
    const m = await Medicine.findOne({ _id: req.params.id, isDeleted: false }).lean();
    if (!m) return res.status(404).json({ success: false, message: "Medicine not found." });

    res.json({
      success: true,
      message: "Medicine retrieved.",
      data: {
        ...m,
        id: m._id,
        computed_status: getStatus(m.quantity, m.minStockLevel, m.expiryDate)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve medicine.", error: error.message });
  }
};

// POST /api/pharmacy
const createMedicine = async (req, res) => {
  try {
    const { name, category, quantity, unit, price, expiry_date, supplier, min_stock_level, description } = req.body;
    if (!name || !category || quantity === undefined || !unit) {
      return res.status(400).json({ success: false, message: "name, category, quantity, and unit are required." });
    }

    const newMed = await Medicine.create({
      name: name.trim(),
      category,
      quantity: parseInt(quantity),
      unit,
      price: parseFloat(price) || 0,
      expiryDate: expiry_date ? new Date(expiry_date) : null,
      supplier: supplier || null,
      minStockLevel: parseInt(min_stock_level) || 10,
      description: description || null,
      isDeleted: false
    });

    res.status(201).json({ success: true, message: "Medicine created.", data: newMed });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create medicine.", error: error.message });
  }
};

// PUT /api/pharmacy/:id
const updateMedicine = async (req, res) => {
  try {
    const { name, category, quantity, unit, price, expiry_date, supplier, min_stock_level, description } = req.body;
    const updates = {};
    if (name) updates.name = name.trim();
    if (category) updates.category = category;
    if (quantity !== undefined) updates.quantity = parseInt(quantity);
    if (unit) updates.unit = unit;
    if (price !== undefined) updates.price = parseFloat(price);
    if (expiry_date !== undefined) updates.expiryDate = expiry_date ? new Date(expiry_date) : null;
    if (supplier !== undefined) updates.supplier = supplier;
    if (min_stock_level !== undefined) updates.minStockLevel = parseInt(min_stock_level);
    if (description !== undefined) updates.description = description;

    const updated = await Medicine.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, updates, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Medicine not found." });

    res.json({ success: true, message: "Medicine updated.", data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update medicine.", error: error.message });
  }
};

// PATCH /api/pharmacy/:id/stock
const updateStock = async (req, res) => {
  try {
    const { adjustment, operation } = req.body; // operation: 'add' or 'subtract'
    if (adjustment === undefined) return res.status(400).json({ success: false, message: "adjustment is required." });

    const med = await Medicine.findOne({ _id: req.params.id, isDeleted: false });
    if (!med) return res.status(404).json({ success: false, message: "Medicine not found." });

    const adj = Math.abs(parseInt(adjustment));
    const newQty = operation === "subtract" ? Math.max(0, med.quantity - adj) : med.quantity + adj;
    med.quantity = newQty;
    await med.save();

    res.json({ success: true, message: "Stock updated.", data: med });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update stock.", error: error.message });
  }
};

// DELETE /api/pharmacy/:id
const deleteMedicine = async (req, res) => {
  try {
    const updated = await Medicine.findOneAndUpdate({ _id: req.params.id }, { isDeleted: true }, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Medicine not found." });
    res.json({ success: true, message: "Medicine deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete medicine.", error: error.message });
  }
};

module.exports = {
  getAllMedicines,
  getMedicineById,
  createMedicine,
  updateMedicine,
  deleteMedicine,
  updateStock,
  getLowStockMedicines,
  getMedicineStats
};
