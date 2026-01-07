const express = require('express');
const Vehicle = require('../models/Vehicle');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

const router = express.Router();

// Get all vehicles for a user
router.get('/', auth, async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ owner: req.userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: vehicles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single vehicle
router.get('/:id', auth, async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({ _id: req.params.id, owner: req.userId });
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }
    res.json({ success: true, data: vehicle });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add new vehicle
router.post('/', auth, async (req, res) => {
  try {
    const vehicle = new Vehicle({ ...req.body, owner: req.userId });
    await vehicle.save();
    res.status(201).json({ success: true, data: vehicle, message: 'Vehicle registered successfully' });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ success: false, message: `${field.toUpperCase()} already exists` });
    }
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update vehicle
router.patch('/:id', auth, async (req, res) => {
  try {
    const vehicle = await Vehicle.findOneAndUpdate(
      { _id: req.params.id, owner: req.userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }
    res.json({ success: true, data: vehicle, message: 'Vehicle updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete vehicle
router.delete('/:id', auth, async (req, res) => {
  try {
    const vehicle = await Vehicle.findOneAndDelete({ _id: req.params.id, owner: req.userId });
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }
    res.json({ success: true, message: 'Vehicle deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get vehicle history (service records)
router.get('/:id/history', auth, async (req, res) => {
  try {
    const Booking = require('../models/Booking');
    const history = await Booking.find({ vehicle: req.params.id })
      .populate('assignedMechanic', 'name')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin: Get all vehicles
router.get('/admin/all', auth, authorize('admin'), async (req, res) => {
  try {
    const vehicles = await Vehicle.find()
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: vehicles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;