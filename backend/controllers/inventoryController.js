const Inventory = require("../models/Inventory");

const getInventoryStatus = (quantity, min_stock, expiry_date) => {
  if (expiry_date && new Date(expiry_date) < new Date()) return "expired";
  if (quantity === 0) return "out_of_stock";
  if (quantity <= min_stock) return "low_stock";
  return "available";
};

// GET /api/inventory
const getAllInventoryItems = async (req, res) => {
  try {
    const { category, status, search } = req.query;
    const filter = { isDeleted: false };
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { itemName: new RegExp(search, "i") },
        { supplier: new RegExp(search, "i") }
      ];
    }

    let items = await Inventory.find(filter).sort({ itemName: 1 }).lean();

    items = items.map(item => ({
      ...item,
      id: item._id,
      item_name: item.itemName,
      min_stock_level: item.minStockLevel,
      expiry_date: item.expiryDate,
      computed_status: getInventoryStatus(item.quantity, item.minStockLevel, item.expiryDate)
    }));

    if (status) {
      items = items.filter(item => item.computed_status === status);
    }

    res.json({ success: true, message: "Inventory items retrieved.", data: items, count: items.length });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve inventory items.", error: error.message });
  }
};

// GET /api/inventory/stats
const getInventoryStats = async (req, res) => {
  try {
    const items = await Inventory.find({ isDeleted: false }).lean();
    const stats = { total: items.length, available: 0, low_stock: 0, out_of_stock: 0, expired: 0 };
    items.forEach(item => {
      const s = getInventoryStatus(item.quantity, item.minStockLevel, item.expiryDate);
      stats[s] = (stats[s] || 0) + 1;
    });
    res.json({ success: true, message: "Inventory stats retrieved.", data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to get inventory stats.", error: error.message });
  }
};

// GET /api/inventory/low-stock
const getLowStockItems = async (req, res) => {
  try {
    const items = await Inventory.find({ isDeleted: false }).lean();
    const alerts = items
      .map(item => ({
        ...item,
        id: item._id,
        item_name: item.itemName,
        min_stock_level: item.minStockLevel,
        expiry_date: item.expiryDate,
        computed_status: getInventoryStatus(item.quantity, item.minStockLevel, item.expiryDate)
      }))
      .filter(item => ["low_stock", "out_of_stock", "expired"].includes(item.computed_status));

    res.json({ success: true, message: "Low stock items retrieved.", data: alerts, count: alerts.length });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to get low stock items.", error: error.message });
  }
};

// GET /api/inventory/:id
const getInventoryItemById = async (req, res) => {
  try {
    const item = await Inventory.findOne({ _id: req.params.id, isDeleted: false }).lean();
    if (!item) return res.status(404).json({ success: false, message: "Inventory item not found." });

    res.json({
      success: true,
      message: "Inventory item retrieved.",
      data: {
        ...item,
        id: item._id,
        item_name: item.itemName,
        min_stock_level: item.minStockLevel,
        expiry_date: item.expiryDate,
        computed_status: getInventoryStatus(item.quantity, item.minStockLevel, item.expiryDate)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve inventory item.", error: error.message });
  }
};

// POST /api/inventory
const createInventoryItem = async (req, res) => {
  try {
    const { item_name, category, quantity, unit, price, supplier, expiry_date, min_stock_level, location, description } = req.body;
    if (!item_name || !category || quantity === undefined || !unit) {
      return res.status(400).json({ success: false, message: "item_name, category, quantity, and unit are required." });
    }

    const newItem = await Inventory.create({
      itemName: item_name.trim(),
      category,
      quantity: parseInt(quantity),
      unit,
      price: parseFloat(price) || 0,
      supplier: supplier || null,
      expiryDate: expiry_date ? new Date(expiry_date) : null,
      minStockLevel: parseInt(min_stock_level) || 10,
      location: location || null,
      description: description || null,
      isDeleted: false
    });

    res.status(201).json({ success: true, message: "Inventory item created.", data: newItem });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create inventory item.", error: error.message });
  }
};

// PUT /api/inventory/:id
const updateInventoryItem = async (req, res) => {
  try {
    const { item_name, category, quantity, unit, price, supplier, expiry_date, min_stock_level, location, description } = req.body;
    const updates = {};
    if (item_name) updates.itemName = item_name.trim();
    if (category) updates.category = category;
    if (quantity !== undefined) updates.quantity = parseInt(quantity);
    if (unit) updates.unit = unit;
    if (price !== undefined) updates.price = parseFloat(price);
    if (supplier !== undefined) updates.supplier = supplier;
    if (expiry_date !== undefined) updates.expiryDate = expiry_date ? new Date(expiry_date) : null;
    if (min_stock_level !== undefined) updates.minStockLevel = parseInt(min_stock_level);
    if (location !== undefined) updates.location = location;
    if (description !== undefined) updates.description = description;

    const updated = await Inventory.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, updates, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Inventory item not found." });

    res.json({ success: true, message: "Inventory item updated.", data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update inventory item.", error: error.message });
  }
};

// PATCH /api/inventory/:id/stock
const updateInventoryStock = async (req, res) => {
  try {
    const { adjustment, operation } = req.body;
    if (adjustment === undefined) return res.status(400).json({ success: false, message: "adjustment is required." });

    const item = await Inventory.findOne({ _id: req.params.id, isDeleted: false });
    if (!item) return res.status(404).json({ success: false, message: "Inventory item not found." });

    const adj = Math.abs(parseInt(adjustment));
    item.quantity = operation === "subtract" ? Math.max(0, item.quantity - adj) : item.quantity + adj;
    await item.save();

    res.json({ success: true, message: "Inventory stock updated.", data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update inventory stock.", error: error.message });
  }
};

// DELETE /api/inventory/:id
const deleteInventoryItem = async (req, res) => {
  try {
    const updated = await Inventory.findOneAndUpdate({ _id: req.params.id }, { isDeleted: true }, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Inventory item not found." });
    res.json({ success: true, message: "Inventory item deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete inventory item.", error: error.message });
  }
};

module.exports = {
  getAllInventoryItems,
  getInventoryItemById,
  createInventoryItem,
  updateInventoryItem,
  updateInventoryStock,
  deleteInventoryItem,
  getLowStockItems,
  getInventoryStats
};
