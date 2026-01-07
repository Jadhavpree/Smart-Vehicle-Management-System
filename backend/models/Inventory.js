const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  partName: { type: String, required: true },
  sku: { type: String, required: true },
  category: { type: String, required: true },
  currentStock: { type: Number, required: true, default: 0 },
  reorderLevel: { type: Number, required: true, default: 10 },
  unitPrice: { type: Number, required: true },
  supplier: String,
  description: String,
  serviceCenter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Inventory', inventorySchema);