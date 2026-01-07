const express = require('express');
const JobCard = require('../models/JobCard');
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');

const router = express.Router();

// Create job card from booking
router.post('/', auth, async (req, res) => {
  try {
    const { bookingId, assignedMechanic, laborTasks } = req.body;
    
    const booking = await Booking.findById(bookingId).populate('customer vehicle');
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Generate job card number
    const count = await JobCard.countDocuments();
    const jobCardNumber = `JC-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;
    
    const jobCard = new JobCard({
      jobCardNumber,
      booking: bookingId,
      customer: booking.customer._id,
      vehicle: booking.vehicle._id,
      serviceCenter: booking.serviceCenter,
      serviceType: booking.serviceType,
      assignedMechanic: assignedMechanic || null,
      laborTasks: laborTasks || [],
      status: 'created'
    });

    await jobCard.save();
    
    // Update booking with assigned mechanic for review purposes
    if (assignedMechanic) {
      booking.assignedMechanic = assignedMechanic;
      await booking.save();
    }
    
    // Populate the job card before sending response
    await jobCard.populate('customer', 'name email');
    await jobCard.populate('vehicle', 'make model year licensePlate');
    await jobCard.populate('assignedMechanic', 'name');
    
    res.status(201).json({ 
      success: true, 
      data: jobCard,
      message: 'Job card created successfully'
    });
  } catch (error) {
    console.error('Job card creation error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to create job card'
    });
  }
});

// Get all job cards
router.get('/', auth, async (req, res) => {
  try {
    const query = req.userId ? { serviceCenter: req.userId } : {};
    const jobCards = await JobCard.find(query)
      .populate('customer', 'name email')
      .populate('vehicle', 'make model year licensePlate')
      .populate('assignedMechanic', 'name')
      .populate('booking');
    res.json({ success: true, data: jobCards });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update job card
router.patch('/:id', auth, async (req, res) => {
  try {
    const jobCard = await JobCard.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('customer vehicle assignedMechanic');
    
    if (!jobCard) {
      return res.status(404).json({ message: 'Job card not found' });
    }
    
    // Sync mechanic assignment to booking
    if (req.body.assignedMechanic && jobCard.booking) {
      await Booking.findByIdAndUpdate(jobCard.booking, {
        assignedMechanic: req.body.assignedMechanic
      });
    }
    
    res.json(jobCard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add spare part to job card and auto-decrement inventory
router.post('/:id/add-part', auth, async (req, res) => {
  try {
    const { inventoryItemId, quantity } = req.body;
    const Inventory = require('../models/Inventory');
    
    const jobCard = await JobCard.findById(req.params.id);
    if (!jobCard) {
      return res.status(404).json({ message: 'Job card not found' });
    }
    
    const inventoryItem = await Inventory.findById(inventoryItemId);
    if (!inventoryItem) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }
    
    if (inventoryItem.currentStock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }
    
    // Add part to job card
    jobCard.spareParts.push({
      partName: inventoryItem.partName,
      quantity: quantity,
      unitPrice: inventoryItem.unitPrice,
      totalPrice: quantity * inventoryItem.unitPrice
    });
    
    // Auto-decrement inventory
    inventoryItem.currentStock -= quantity;
    await inventoryItem.save();
    await jobCard.save();
    
    res.json({ success: true, jobCard, inventoryItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update job card progress
router.patch('/:id/progress', auth, async (req, res) => {
  try {
    const { progress, description } = req.body;
    
    const jobCard = await JobCard.findById(req.params.id)
      .populate('customer', 'name phone')
      .populate('vehicle', 'make model licensePlate');
      
    if (!jobCard) {
      return res.status(404).json({ message: 'Job card not found' });
    }
    
    const oldStatus = jobCard.status;
    jobCard.progress = progress;
    jobCard.progressUpdates.push({
      status: progress === 100 ? 'completed' : 'in-progress',
      description,
      updatedBy: req.userId
    });
    
    if (progress === 100) {
      jobCard.status = 'completed';
      jobCard.completedDate = new Date();
      
      // AUTO-SEND SMS: Service completed
      if (jobCard.customer?.phone) {
        const message = `Great news! Your ${jobCard.vehicle?.make} ${jobCard.vehicle?.model} (${jobCard.vehicle?.licensePlate}) is ready for pickup!`;
        jobCard.communications.push({
          type: 'sms',
          message,
          sentAt: new Date(),
          status: 'sent',
          recipient: jobCard.customer.phone
        });
        // TODO: Integrate with SMS provider
        // await sendSMS(jobCard.customer.phone, message);
      }
    } else if (oldStatus === 'created' && progress > 0) {
      // AUTO-SEND SMS: Service started
      if (jobCard.customer?.phone) {
        const message = `Your ${jobCard.vehicle?.make} ${jobCard.vehicle?.model} (${jobCard.vehicle?.licensePlate}) is now being serviced.`;
        jobCard.communications.push({
          type: 'sms',
          message,
          sentAt: new Date(),
          status: 'sent',
          recipient: jobCard.customer.phone
        });
        // TODO: Integrate with SMS provider
        // await sendSMS(jobCard.customer.phone, message);
      }
    }
    
    await jobCard.save();
    res.json(jobCard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;