const express = require('express');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const Booking = require('../models/Booking');
const JobCard = require('../models/JobCard');
const Invoice = require('../models/Invoice');
const auth = require('../middleware/auth');

const router = express.Router();

// Get admin dashboard stats
router.get('/stats', auth, async (req, res) => {
  try {
    // Get counts - Admin sees ALL data across all service centers
    const totalUsers = await User.countDocuments();
    const totalVehicles = await Vehicle.countDocuments();
    const totalBookings = await Booking.countDocuments();
    
    // Count completed services from both job cards AND bookings
    const completedJobCards = await JobCard.countDocuments({ status: 'completed' });
    const completedBookings = await Booking.countDocuments({ 
      status: { $in: ['ready_for_billing', 'paid'] } 
    });
    const completedServices = completedJobCards + completedBookings; // Total completed services
    
    // Get revenue data
    const invoices = await Invoice.find({ status: 'paid' });
    const totalRevenue = invoices.reduce((sum, invoice) => sum + (invoice.totalAmount || 0), 0);
    
    // Get monthly data for charts
    const monthlyData = await getMonthlyData();
    
    // Get service type distribution
    const serviceTypes = await getServiceTypeDistribution();
    
    // Get top vehicle makes
    const topVehicles = await getTopVehicleMakes();
    
    res.json({
      success: true,
      data: {
        overview: {
          totalRevenue: totalRevenue.toFixed(2),
          activeUsers: totalUsers,
          servicesCompleted: completedServices, // Includes both job cards and bookings
          vehiclesServiced: totalVehicles
        },
        monthlyData,
        serviceTypes,
        topVehicles
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get monthly revenue and service data
const getMonthlyData = async () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const data = [];
  
  for (let i = 0; i < 6; i++) {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - (5 - i));
    startDate.setDate(1);
    
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);
    
    const monthlyInvoices = await Invoice.find({
      createdAt: { $gte: startDate, $lt: endDate },
      status: 'paid'
    });
    
    const monthlyServices = await JobCard.countDocuments({
      createdAt: { $gte: startDate, $lt: endDate }
    });
    
    const revenue = monthlyInvoices.reduce((sum, invoice) => sum + (invoice.totalAmount || 0), 0);
    
    data.push({
      month: months[i],
      revenue: Math.round(revenue),
      services: monthlyServices
    });
  }
  
  return data;
};

// Get service type distribution
const getServiceTypeDistribution = async () => {
  const bookings = await Booking.find();
  const serviceTypes = {};
  
  bookings.forEach(booking => {
    const type = booking.serviceType || 'Other';
    serviceTypes[type] = (serviceTypes[type] || 0) + 1;
  });
  
  const colors = [
    'hsl(210, 85%, 28%)',
    'hsl(185, 70%, 45%)',
    'hsl(25, 95%, 53%)',
    'hsl(145, 65%, 45%)',
    'hsl(215, 15%, 65%)'
  ];
  
  return Object.entries(serviceTypes)
    .map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length]
    }))
    .slice(0, 5);
};

// Get top vehicle makes by count
const getTopVehicleMakes = async () => {
  const vehicles = await Vehicle.find();
  const makes = {};
  
  vehicles.forEach(vehicle => {
    const make = vehicle.make || 'Unknown';
    makes[make] = (makes[make] || 0) + 1;
  });
  
  // Get revenue for each make
  const topMakes = await Promise.all(
    Object.entries(makes)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(async ([make, count]) => {
        const vehicleIds = vehicles
          .filter(v => v.make === make)
          .map(v => v._id);
        
        const invoices = await Invoice.find({
          vehicle: { $in: vehicleIds },
          status: 'paid'
        });
        
        const revenue = invoices.reduce((sum, invoice) => sum + (invoice.totalAmount || 0), 0);
        
        return {
          make,
          count,
          revenue: `$${revenue.toLocaleString()}`
        };
      })
  );
  
  return topMakes;
};

// Get all users with role details
router.get('/users', auth, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    
    const usersWithDetails = await Promise.all(
      users.map(async (user) => {
        let additionalData = {};
        
        if (user.role === 'customer') {
          const vehicleCount = await Vehicle.countDocuments({ owner: user._id });
          const bookingCount = await Booking.countDocuments({ customer: user._id });
          additionalData = { vehicleCount, bookingCount };
        } else if (user.role === 'mechanic') {
          const jobCardCount = await JobCard.countDocuments({ assignedTo: user._id });
          const completedJobs = await JobCard.countDocuments({ assignedTo: user._id, status: 'completed' });
          additionalData = { jobCardCount, completedJobs };
        }
        
        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          address: user.address,
          createdAt: user.createdAt,
          ...additionalData
        };
      })
    );
    
    res.json({ success: true, data: usersWithDetails });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get mechanic performance data
router.get('/mechanics', auth, async (req, res) => {
  try {
    const TeamMember = require('../models/TeamMember');
    const MechanicPerformance = require('../models/MechanicPerformance');
    const Review = require('../models/Review');
    
    // Get all mechanics from all service centers
    const mechanics = await TeamMember.find({ role: 'mechanic' })
      .populate('serviceCenter', 'name email')
      .select('-password');
    
    const mechanicsWithPerformance = await Promise.all(
      mechanics.map(async (mechanic) => {
        // Get performance data
        const performance = await MechanicPerformance.findOne({ mechanic: mechanic._id });
        
        // Get reviews for this mechanic
        const reviews = await Review.find({ mechanic: mechanic._id });
        const avgRating = reviews.length > 0 
          ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
          : '0.0';
        
        const satisfactionCount = reviews.filter(r => r.rating >= 4).length;
        const customerSatisfaction = reviews.length > 0
          ? Math.round((satisfactionCount / reviews.length) * 100)
          : 0;
        
        // Calculate average service time
        const avgServiceTime = performance && performance.completedJobs > 0
          ? (performance.totalHours / performance.completedJobs).toFixed(1)
          : '0.0';
        
        return {
          _id: mechanic._id,
          name: mechanic.name,
          email: mechanic.email,
          phone: mechanic.phone,
          role: mechanic.role,
          serviceCenter: mechanic.serviceCenter?.name || 'N/A',
          totalJobs: performance?.completedJobs || 0,
          completedJobs: performance?.completedJobs || 0,
          rating: parseFloat(avgRating),
          customerSatisfaction,
          avgServiceTime: `${avgServiceTime} hrs`,
          onTimeRate: performance && performance.completedJobs > 0
            ? Math.round((performance.onTimeJobs / performance.completedJobs) * 100)
            : 0,
          efficiency: performance && performance.totalJobs > 0
            ? Math.round((performance.completedJobs / performance.totalJobs) * 100)
            : 0,
          status: mechanic.status || 'active',
          createdAt: mechanic.createdAt
        };
      })
    );
    
    res.json({ success: true, data: mechanicsWithPerformance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all vehicles (admin)
router.get('/all-vehicles', auth, async (req, res) => {
  try {
    const vehicles = await Vehicle.find()
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, data: vehicles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all invoices (admin)
router.get('/all-invoices', auth, async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate('customer', 'name email phone')
      .populate('vehicle', 'make model year licensePlate')
      .populate('serviceCenter', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, data: invoices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all bookings with details
router.get('/bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('customer', 'name email phone')
      .populate('vehicle', 'make model year licensePlate')
      .populate('assignedMechanic', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all job cards (admin)
router.get('/jobcards', auth, async (req, res) => {
  try {
    const jobCards = await JobCard.find()
      .populate('customer', 'name email phone')
      .populate('vehicle', 'make model year licensePlate')
      .populate('assignedMechanic', 'name email')
      .populate('serviceCenter', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, data: jobCards });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all inventory (admin)
router.get('/inventory', auth, async (req, res) => {
  try {
    const Inventory = require('../models/Inventory');
    const inventory = await Inventory.find()
      .populate('serviceCenter', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, data: inventory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get admin inventory (items without serviceCenter)
router.get('/admin-inventory', auth, async (req, res) => {
  try {
    const Inventory = require('../models/Inventory');
    const inventory = await Inventory.find({ serviceCenter: null })
      .sort({ createdAt: -1 });
    
    res.json({ success: true, data: inventory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add admin inventory item
router.post('/admin-inventory', auth, async (req, res) => {
  try {
    const Inventory = require('../models/Inventory');
    const item = new Inventory({ ...req.body, serviceCenter: null });
    await item.save();
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update admin inventory item
router.patch('/admin-inventory/:id', auth, async (req, res) => {
  try {
    const Inventory = require('../models/Inventory');
    const item = await Inventory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all stock requests (admin)
router.get('/stock-requests', auth, async (req, res) => {
  try {
    const StockRequest = require('../models/StockRequest');
    const requests = await StockRequest.find()
      .populate('inventoryItem')
      .populate('requestedBy', 'name email')
      .populate('approvedBy', 'name')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get low stock alerts for admin
router.get('/low-stock-alerts', auth, async (req, res) => {
  try {
    const Inventory = require('../models/Inventory');
    const items = await Inventory.find({
      $expr: { $lte: ['$currentStock', '$reorderLevel'] }
    })
    .populate('serviceCenter', 'name email')
    .sort({ currentStock: 1 });
    
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete user (admin only)
router.delete('/users/:id', auth, async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Prevent deleting yourself
    if (userId === req.userId) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own account' });
    }
    
    // Delete user
    await User.findByIdAndDelete(userId);
    
    res.json({ 
      success: true, 
      message: `User ${user.name} has been deleted successfully` 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;