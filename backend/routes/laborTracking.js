const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const JobCard = require('../models/JobCard');

// Clock in for a labor task
router.post('/:jobCardId/task/:taskId/clock-in', auth, async (req, res) => {
  try {
    const jobCard = await JobCard.findById(req.params.jobCardId);
    
    if (!jobCard) {
      return res.status(404).json({ message: 'Job card not found' });
    }

    const task = jobCard.laborTasks.id(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if already clocked in
    if (task.clockInTime && !task.clockOutTime) {
      return res.status(400).json({ message: 'Already clocked in for this task' });
    }

    task.clockInTime = new Date();
    task.technicianId = req.user.id;
    
    await jobCard.save();

    res.json({ 
      message: 'Clocked in successfully',
      task,
      clockInTime: task.clockInTime
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Clock out from a labor task
router.post('/:jobCardId/task/:taskId/clock-out', auth, async (req, res) => {
  try {
    const jobCard = await JobCard.findById(req.params.jobCardId);
    
    if (!jobCard) {
      return res.status(404).json({ message: 'Job card not found' });
    }

    const task = jobCard.laborTasks.id(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (!task.clockInTime) {
      return res.status(400).json({ message: 'Must clock in before clocking out' });
    }

    if (task.clockOutTime) {
      return res.status(400).json({ message: 'Already clocked out' });
    }

    task.clockOutTime = new Date();
    
    // Calculate actual hours worked
    const milliseconds = task.clockOutTime - task.clockInTime;
    task.actualHours = Number((milliseconds / (1000 * 60 * 60)).toFixed(2));
    task.completed = true;
    
    await jobCard.save();

    // Update mechanic performance in real-time
    if (task.technicianId) {
      const MechanicPerformance = require('../models/MechanicPerformance');
      const perf = await MechanicPerformance.findOne({ mechanic: task.technicianId });
      if (perf) {
        perf.totalHours += task.actualHours;
        if (task.actualHours <= task.hours) perf.onTimeJobs += 1;
        perf.lastUpdated = new Date();
        await perf.save();
      }
    }

    res.json({ 
      message: 'Clocked out successfully',
      task,
      clockOutTime: task.clockOutTime,
      actualHours: task.actualHours,
      estimatedHours: task.hours,
      variance: Number((task.actualHours - task.hours).toFixed(2))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get labor analytics for a job card
router.get('/:jobCardId/labor-analytics', auth, async (req, res) => {
  try {
    const jobCard = await JobCard.findById(req.params.jobCardId)
      .populate('laborTasks.technicianId', 'name');
    
    if (!jobCard) {
      return res.status(404).json({ message: 'Job card not found' });
    }

    const analytics = {
      totalEstimatedHours: 0,
      totalActualHours: 0,
      totalEstimatedCost: 0,
      totalActualCost: 0,
      efficiency: 0,
      tasks: []
    };

    jobCard.laborTasks.forEach(task => {
      analytics.totalEstimatedHours += task.hours || 0;
      analytics.totalActualHours += task.actualHours || 0;
      analytics.totalEstimatedCost += (task.hours || 0) * task.hourlyRate;
      analytics.totalActualCost += (task.actualHours || 0) * task.hourlyRate;

      analytics.tasks.push({
        task: task.task,
        estimatedHours: task.hours,
        actualHours: task.actualHours,
        variance: task.actualHours ? Number((task.actualHours - task.hours).toFixed(2)) : null,
        technician: task.technicianId?.name,
        completed: task.completed,
        clockInTime: task.clockInTime,
        clockOutTime: task.clockOutTime
      });
    });

    // Calculate efficiency percentage
    if (analytics.totalActualHours > 0) {
      analytics.efficiency = Number(((analytics.totalEstimatedHours / analytics.totalActualHours) * 100).toFixed(2));
    }

    analytics.profitability = {
      estimatedRevenue: analytics.totalEstimatedCost,
      actualCost: analytics.totalActualCost,
      variance: Number((analytics.totalEstimatedCost - analytics.totalActualCost).toFixed(2)),
      variancePercentage: analytics.totalEstimatedCost > 0 
        ? Number((((analytics.totalEstimatedCost - analytics.totalActualCost) / analytics.totalEstimatedCost) * 100).toFixed(2))
        : 0
    };

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get technician performance report
router.get('/technician-performance/:technicianId', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const query = {
      'laborTasks.technicianId': req.params.technicianId
    };

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const jobCards = await JobCard.find(query)
      .populate('laborTasks.technicianId', 'name');

    let totalEstimatedHours = 0;
    let totalActualHours = 0;
    let totalTasks = 0;
    let completedTasks = 0;

    jobCards.forEach(jobCard => {
      jobCard.laborTasks.forEach(task => {
        if (task.technicianId && task.technicianId._id.toString() === req.params.technicianId) {
          totalTasks++;
          totalEstimatedHours += task.hours || 0;
          totalActualHours += task.actualHours || 0;
          if (task.completed) completedTasks++;
        }
      });
    });

    const performance = {
      technicianId: req.params.technicianId,
      totalJobCards: jobCards.length,
      totalTasks,
      completedTasks,
      completionRate: totalTasks > 0 ? Number(((completedTasks / totalTasks) * 100).toFixed(2)) : 0,
      totalEstimatedHours,
      totalActualHours,
      efficiency: totalActualHours > 0 ? Number(((totalEstimatedHours / totalActualHours) * 100).toFixed(2)) : 0,
      averageTaskTime: completedTasks > 0 ? Number((totalActualHours / completedTasks).toFixed(2)) : 0
    };

    res.json(performance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new labor task to job card
router.post('/:jobCardId/add-task', auth, async (req, res) => {
  try {
    const { task, hours, hourlyRate } = req.body;
    
    const jobCard = await JobCard.findById(req.params.jobCardId);
    if (!jobCard) {
      return res.status(404).json({ message: 'Job card not found' });
    }

    jobCard.laborTasks.push({
      task,
      hours,
      hourlyRate: hourlyRate || 50,
      completed: false
    });

    await jobCard.save();

    res.json({ 
      message: 'Labor task added successfully',
      task: jobCard.laborTasks[jobCard.laborTasks.length - 1]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
