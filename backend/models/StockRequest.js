const mongoose = require('mongoose');

const stockRequestSchema = new mongoose.Schema({
  inventoryItem: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Inventory', 
    required: true 
  },
  requestedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  requestedQuantity: { 
    type: Number, 
    required: true 
  },
  currentStock: { 
    type: Number, 
    required: true 
  },
  reason: { 
    type: String, 
    required: true 
  },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'critical'], 
    default: 'medium' 
  },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'fulfilled'], 
    default: 'pending' 
  },
  adminNotes: String,
  approvedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  approvedAt: Date,
  fulfilledAt: Date
}, { timestamps: true });

module.exports = mongoose.model('StockRequest', stockRequestSchema);