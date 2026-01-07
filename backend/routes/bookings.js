const express = require('express');
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');
const notificationService = require('../services/notificationService');

const router = express.Router();

// Get bookings
router.get('/', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: req.userId })
      .populate('vehicle')
      .populate('assignedMechanic', 'name');
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create booking
router.post('/', auth, async (req, res) => {
  try {
    const { vehicle, serviceType, description, scheduledDate, timeSlot, serviceCenter } = req.body;
    
    // Validate required fields
    if (!vehicle) {
      return res.status(400).json({ success: false, message: 'Vehicle is required' });
    }
    if (!serviceType || serviceType.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Valid service type is required' });
    }
    if (!scheduledDate) {
      return res.status(400).json({ success: false, message: 'Scheduled date is required' });
    }
    
    // Combine date and time
    const preferredDate = new Date(scheduledDate);
    if (timeSlot) {
      const [hours, minutes] = timeSlot.split(':');
      preferredDate.setHours(parseInt(hours), parseInt(minutes || '0'));
    }
    
    // Validate date is not in the past
    if (preferredDate < new Date(new Date().setHours(0, 0, 0, 0))) {
      return res.status(400).json({ success: false, message: 'Booking date cannot be in the past' });
    }
    
    const booking = new Booking({
      customer: req.userId,
      vehicle,
      serviceCenter,
      serviceType,
      description: description || '',
      notes: description || '',
      preferredDate,
      status: 'pending'
    });
    
    await booking.save();
    
    // Populate the booking before sending response
    await booking.populate('vehicle');
    await booking.populate('customer', 'name email phone');
    
    // Create notification
    await notificationService.createBookingNotification(booking, 'pending');
    
    res.status(201).json({ 
      success: true, 
      data: booking,
      message: 'Booking created successfully'
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: 'Validation failed', errors });
    }
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to create booking'
    });
  }
});

module.exports = router;