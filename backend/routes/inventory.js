const express = require('express');
const Inventory = require('../models/Inventory');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all inventory items
router.get('/', auth, async (req, res) => {
  try {
    const query = req.userRole === 'admin' ? {} : { serviceCenter: req.userId };
    const items = await Inventory.find(query);
    res.json({ success: true, data: items });
  } catch (error) {
    console.error('Inventory GET error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add inventory item
router.post('/', auth, async (req, res) => {
  try {
    const item = new Inventory({ ...req.body, serviceCenter: req.userId });
    await item.save();
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    console.error('Add inventory error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update inventory item
router.patch('/:id', auth, async (req, res) => {
  try {
    const item = await Inventory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add stock to inventory item
router.patch('/:id/add-stock', auth, async (req, res) => {
  try {
    const { quantity } = req.body;
    const item = await Inventory.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    item.currentStock += quantity;
    await item.save();
    
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get low stock items
router.get('/low-stock', auth, async (req, res) => {
  try {
    const query = req.userRole === 'admin' ? {} : { serviceCenter: req.userId };
    const items = await Inventory.find({
      ...query,
      $expr: { $lte: ['$currentStock', '$reorderLevel'] }
    });
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Decrement stock when parts are used
router.patch('/:id/use', auth, async (req, res) => {
  try {
    const { quantity } = req.body;
    const item = await Inventory.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    if (item.currentStock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }
    
    item.currentStock -= quantity;
    await item.save();
    
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;