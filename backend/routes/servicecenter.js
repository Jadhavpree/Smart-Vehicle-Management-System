const express = require('express');
const Booking = require('../models/Booking');
const User = require('../models/User');
const auth = require('../middleware/auth');
const notificationService = require('../services/notificationService');

const router = express.Router();

// Get list of all service centers
router.get('/list', auth, async (req, res) => {
  try {
    const serviceCenters = await User.find({ role: 'mechanic', isActive: true })
      .select('name email phone address')
      .sort({ name: 1 });
    res.json({ success: true, data: serviceCenters });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all bookings for service center
router.get('/bookings', auth, async (req, res) => {
  try {
    const query = { serviceCenter: req.user.id };
    const bookings = await Booking.find(query)
      .populate('customer', 'name email phone')
      .populate('vehicle', 'make model year licensePlate');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update booking status
router.patch('/bookings/:id', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('customer', 'name email').populate('vehicle', 'make model');
    
    // Create notification for status change
    if (['approved', 'rejected', 'in_progress', 'completed'].includes(status)) {
      await notificationService.createBookingNotification(booking, status);
    }
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get service center stats
router.get('/stats', auth, async (req, res) => {
  try {
    const query = { serviceCenter: req.user.id };
    const totalBookings = await Booking.countDocuments(query);
    const pendingBookings = await Booking.countDocuments({ ...query, status: 'pending' });
    const inProgressBookings = await Booking.countDocuments({ 
      ...query,
      status: { $in: ['confirmed', 'job_card_created', 'in_service'] } 
    });
    const completedBookings = await Booking.countDocuments({ 
      ...query,
      status: { $in: ['ready_for_billing', 'paid'] } 
    });

    res.json({
      total: totalBookings,
      pending: pendingBookings,
      inProgress: inProgressBookings,
      completed: completedBookings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;