const express = require('express');
const Review = require('../models/Review');
const Booking = require('../models/Booking');
const JobCard = require('../models/JobCard');
const TeamMember = require('../models/TeamMember');
const auth = require('../middleware/auth');

const router = express.Router();

// Submit review
router.post('/', auth, async (req, res) => {
  try {
    const { bookingId, rating, comment, mechanicId } = req.body;
    
    // Handle general reviews (without specific booking)
    if (bookingId === 'general') {
      const review = new Review({
        customer: req.userId,
        rating,
        comment,
        mechanic: mechanicId,
        serviceType: 'General Service Review'
      });

      await review.save();
      
      return res.status(201).json({ 
        success: true, 
        data: review,
        message: 'Review submitted successfully'
      });
    }
    
    const booking = await Booking.findById(bookingId).populate('vehicle');
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Find the job card to get the assigned mechanic
    const jobCard = await JobCard.findOne({ booking: bookingId });

    // Get mechanic from job card or booking
    let assignedMechanic = mechanicId || 
                          (jobCard ? jobCard.assignedMechanic : null) || 
                          booking.assignedMechanic;

    // If still no mechanic, get the first available mechanic from service center
    if (!assignedMechanic && booking.serviceCenter) {
      const firstMechanic = await TeamMember.findOne({ 
        serviceCenter: booking.serviceCenter,
        role: 'mechanic',
        status: 'active'
      });
      
      if (firstMechanic) {
        assignedMechanic = firstMechanic._id;
        // Update booking with this mechanic for future reference
        booking.assignedMechanic = assignedMechanic;
        await booking.save();
      }
    }

    if (!assignedMechanic) {
      return res.status(400).json({ 
        success: false, 
        message: 'No mechanic assigned to this service. Please contact the service center.' 
      });
    }

    const review = new Review({
      booking: bookingId,
      customer: req.userId,
      serviceCenter: booking.serviceCenter || (jobCard ? jobCard.serviceCenter : null),
      vehicle: booking.vehicle._id,
      mechanic: assignedMechanic,
      rating,
      comment,
      serviceType: booking.serviceType
    });

    await review.save();
    
    res.status(201).json({ 
      success: true, 
      data: review,
      message: 'Review submitted successfully'
    });
  } catch (error) {
    console.error('Review submission error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all reviews (admin)
router.get('/all', auth, async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('customer', 'name email')
      .populate('serviceCenter', 'name email')
      .populate('vehicle', 'make model year')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get customer's reviews
router.get('/my-reviews', auth, async (req, res) => {
  try {
    const reviews = await Review.find({ customer: req.userId })
      .populate('serviceCenter', 'name')
      .populate('vehicle', 'make model year')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
