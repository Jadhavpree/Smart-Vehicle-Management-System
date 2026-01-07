const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const TeamMember = require('../models/TeamMember');

// Get all team members for service center
router.get('/', auth, async (req, res) => {
  try {
    const teamMembers = await TeamMember.find({ serviceCenter: req.user.id });
    res.json({ success: true, data: teamMembers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add new team member
router.post('/', auth, async (req, res) => {
  try {
    // Validate required fields
    const { name, email, phone } = req.body;
    
    if (!name || name.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Name must be at least 2 characters' });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'Valid email is required' });
    }
    if (!phone || !/^\+?[1-9]\d{9,14}$/.test(phone)) {
      return res.status(400).json({ success: false, message: 'Valid phone number is required (10-15 digits)' });
    }
    
    const teamMember = new TeamMember({
      ...req.body,
      serviceCenter: req.user.id
    });
    await teamMember.save();
    res.status(201).json({ success: true, data: teamMember });
  } catch (error) {
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: 'Validation failed', errors });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update team member
router.patch('/:id', auth, async (req, res) => {
  try {
    // Validate fields if provided
    const { name, email, phone } = req.body;
    
    if (name && name.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Name must be at least 2 characters' });
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }
    if (phone && !/^\+?[1-9]\d{9,14}$/.test(phone)) {
      return res.status(400).json({ success: false, message: 'Invalid phone number format (10-15 digits)' });
    }
    
    const teamMember = await TeamMember.findOneAndUpdate(
      { _id: req.params.id, serviceCenter: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!teamMember) {
      return res.status(404).json({ success: false, message: 'Team member not found' });
    }
    res.json({ success: true, data: teamMember });
  } catch (error) {
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: 'Validation failed', errors });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update team member status (real-time)
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const teamMember = await TeamMember.findOneAndUpdate(
      { _id: req.params.id, serviceCenter: req.user.id },
      { status, lastStatusUpdate: new Date() },
      { new: true }
    );
    if (!teamMember) {
      return res.status(404).json({ success: false, message: 'Team member not found' });
    }
    res.json({ success: true, data: teamMember });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete team member
router.delete('/:id', auth, async (req, res) => {
  try {
    const teamMember = await TeamMember.findOneAndDelete({
      _id: req.params.id,
      serviceCenter: req.user.id
    });
    if (!teamMember) {
      return res.status(404).json({ success: false, message: 'Team member not found' });
    }
    res.json({ success: true, message: 'Team member deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get team member performance
router.get('/:id/performance', auth, async (req, res) => {
  try {
    const JobCard = require('../models/JobCard');
    const Review = require('../models/Review');
    
    const jobCards = await JobCard.find({
      'laborTasks.technicianId': req.params.id
    });

    let totalHours = 0;
    let completedTasks = 0;
    let totalTasks = 0;
    let onTimeCount = 0;
    
    jobCards.forEach(jc => {
      jc.laborTasks.forEach(task => {
        if (task.technicianId && task.technicianId.toString() === req.params.id) {
          totalTasks++;
          totalHours += task.actualHours || 0;
          if (task.completed) {
            completedTasks++;
            if (task.actualHours <= task.hours) onTimeCount++;
          }
        }
      });
    });

    const reviews = await Review.find({ serviceCenter: req.user.id });
    const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
    const satisfaction = reviews.length > 0 ? (reviews.filter(r => r.rating >= 4).length / reviews.length) * 100 : 0;

    res.json({
      success: true,
      data: {
        totalJobCards: jobCards.length,
        totalHours,
        completedTasks,
        avgTime: completedTasks > 0 ? totalHours / completedTasks : 0,
        efficiency: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
        onTimeRate: completedTasks > 0 ? (onTimeCount / completedTasks) * 100 : 0,
        avgRating: avgRating.toFixed(1),
        satisfaction: satisfaction.toFixed(0)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all mechanics performance (for dashboard)
router.get('/performance/all', auth, async (req, res) => {
  try {
    const MechanicPerformance = require('../models/MechanicPerformance');
    
    const teamMembers = await TeamMember.find({ 
      serviceCenter: req.user.id,
      role: 'mechanic'
    });

    const performanceData = await Promise.all(teamMembers.map(async (member) => {
      let perf = await MechanicPerformance.findOne({ mechanic: member._id });
      
      // If no performance record exists, create default values
      if (!perf) {
        perf = {
          totalJobs: 0,
          completedJobs: 0,
          totalHours: 0,
          onTimeJobs: 0,
          avgRating: 0,
          totalRatings: 0,
          satisfactionCount: 0
        };
      }
      
      return {
        id: member._id,
        name: member.name,
        role: member.role,
        totalJobs: perf.completedJobs || 0,
        avgRating: parseFloat((perf.avgRating || 0).toFixed(1)),
        onTimeRate: perf.completedJobs > 0 ? parseFloat(((perf.onTimeJobs / perf.completedJobs) * 100).toFixed(0)) : 0,
        satisfaction: perf.totalRatings > 0 ? parseFloat(((perf.satisfactionCount / perf.totalRatings) * 100).toFixed(0)) : 0,
        avgTime: perf.completedJobs > 0 ? parseFloat((perf.totalHours / perf.completedJobs).toFixed(1)) : 0,
        efficiency: perf.totalJobs > 0 ? parseFloat(((perf.completedJobs / perf.totalJobs) * 100).toFixed(0)) : 0
      };
    }));

    const overallStats = {
      totalJobs: performanceData.reduce((sum, p) => sum + p.totalJobs, 0),
      avgRating: performanceData.length > 0 ? parseFloat((performanceData.reduce((sum, p) => sum + p.avgRating, 0) / performanceData.length).toFixed(1)) : 0,
      onTimeRate: performanceData.length > 0 ? parseFloat((performanceData.reduce((sum, p) => sum + p.onTimeRate, 0) / performanceData.length).toFixed(0)) : 0,
      satisfaction: performanceData.length > 0 ? parseFloat((performanceData.reduce((sum, p) => sum + p.satisfaction, 0) / performanceData.length).toFixed(0)) : 0
    };

    res.json({
      success: true,
      data: {
        overall: overallStats,
        individuals: performanceData
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
