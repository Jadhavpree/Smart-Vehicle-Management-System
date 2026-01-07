const express = require('express');
const StockRequest = require('../models/StockRequest');
const Inventory = require('../models/Inventory');
const auth = require('../middleware/auth');

const router = express.Router();

// Create stock request
router.post('/', auth, async (req, res) => {
  try {
    const { inventoryItemId, requestedQuantity, reason, priority } = req.body;
    
    const inventoryItem = await Inventory.findById(inventoryItemId);
    if (!inventoryItem) {
      return res.status(404).json({ success: false, message: 'Inventory item not found' });
    }

    const stockRequest = new StockRequest({
      inventoryItem: inventoryItemId,
      requestedBy: req.userId,
      requestedQuantity,
      currentStock: inventoryItem.currentStock,
      reason,
      priority: priority || 'medium'
    });

    await stockRequest.save();
    await stockRequest.populate(['inventoryItem', 'requestedBy']);
    
    res.status(201).json({ success: true, data: stockRequest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all stock requests (admin)
router.get('/admin', auth, async (req, res) => {
  try {
    const requests = await StockRequest.find()
      .populate('inventoryItem')
      .populate('requestedBy', 'name email')
      .populate('approvedBy', 'name')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get stock requests by service center
router.get('/my-requests', auth, async (req, res) => {
  try {
    const requests = await StockRequest.find({ requestedBy: req.userId })
      .populate('inventoryItem')
      .populate('approvedBy', 'name')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update stock request status (admin)
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    
    const stockRequest = await StockRequest.findById(req.params.id)
      .populate('inventoryItem')
      .populate('requestedBy');
    
    if (!stockRequest) {
      return res.status(404).json({ success: false, message: 'Stock request not found' });
    }

    // Check admin inventory for availability
    if (status === 'approved') {
      const adminInventory = await Inventory.findOne({
        sku: stockRequest.inventoryItem.sku,
        serviceCenter: null // Admin inventory has no serviceCenter
      });
      
      if (!adminInventory || adminInventory.currentStock < stockRequest.requestedQuantity) {
        return res.status(400).json({ 
          success: false, 
          message: `Insufficient admin stock. Available: ${adminInventory?.currentStock || 0}, Requested: ${stockRequest.requestedQuantity}` 
        });
      }
      
      // Deduct from admin inventory
      adminInventory.currentStock -= stockRequest.requestedQuantity;
      await adminInventory.save();
      
      // Add to service center inventory
      const serviceCenterInventory = await Inventory.findById(stockRequest.inventoryItem._id);
      serviceCenterInventory.currentStock += stockRequest.requestedQuantity;
      await serviceCenterInventory.save();
      
      stockRequest.approvedBy = req.userId;
      stockRequest.approvedAt = new Date();
      stockRequest.fulfilledAt = new Date();
      status = 'fulfilled'; // Auto-fulfill when approved
    }

    stockRequest.status = status;
    if (adminNotes) stockRequest.adminNotes = adminNotes;
    
    await stockRequest.save();
    await stockRequest.populate(['inventoryItem', 'requestedBy', 'approvedBy']);
    
    res.json({ success: true, data: stockRequest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;