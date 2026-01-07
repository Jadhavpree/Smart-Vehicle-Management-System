const express = require('express');
const router = express.Router();
const analyticsService = require('../services/analyticsService');
const auth = require('../middleware/auth');

// Get overview analytics
router.get('/overview', auth, async (req, res) => {
  try {
    const { role, serviceCenterId } = req.user;
    
    // Only admin and service center can access analytics
    if (role !== 'admin' && role !== 'serviceCenter') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const scId = role === 'admin' ? null : serviceCenterId;
    const analytics = await analyticsService.getOverviewAnalytics(scId);
    
    res.json({ success: true, data: analytics });
  } catch (error) {
    console.error('Analytics overview error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch analytics' });
  }
});

// Get revenue analytics
router.get('/revenue', auth, async (req, res) => {
  try {
    const { role, serviceCenterId } = req.user;
    
    if (role !== 'admin' && role !== 'serviceCenter') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const scId = role === 'admin' ? null : serviceCenterId;
    const revenue = await analyticsService.getRevenueAnalytics(scId);
    
    res.json({ success: true, data: revenue });
  } catch (error) {
    console.error('Revenue analytics error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch revenue analytics' });
  }
});

// Get booking analytics
router.get('/bookings', auth, async (req, res) => {
  try {
    const { role, serviceCenterId } = req.user;
    
    if (role !== 'admin' && role !== 'serviceCenter') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const scId = role === 'admin' ? null : serviceCenterId;
    const bookings = await analyticsService.getBookingAnalytics(scId);
    
    res.json({ success: true, data: bookings });
  } catch (error) {
    console.error('Booking analytics error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch booking analytics' });
  }
});

// Get customer analytics
router.get('/customers', auth, async (req, res) => {
  try {
    const { role } = req.user;
    
    if (role !== 'admin' && role !== 'serviceCenter') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const customers = await analyticsService.getCustomerAnalytics();
    
    res.json({ success: true, data: customers });
  } catch (error) {
    console.error('Customer analytics error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch customer analytics' });
  }
});

module.exports = router;
