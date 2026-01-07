const mongoose = require('mongoose');

const jobPartsSchema = new mongoose.Schema({
  jobCard: { type: mongoose.Schema.Types.ObjectId, ref: 'JobCard', required: true },
  part: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory', required: true },
  quantityUsed: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('JobParts', jobPartsSchema);