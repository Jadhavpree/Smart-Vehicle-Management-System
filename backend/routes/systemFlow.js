const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const Booking = require('../models/Booking');
const JobCard = require('../models/JobCard');
const Invoice = require('../models/Invoice');
const Inventory = require('../models/Inventory');
const JobParts = require('../models/JobParts');
const auth = require('../middleware/auth');

// Get complete flow data for any entity
router.get('/flow/:entityType/:entityId', auth, async (req, res) => {
  try {
    const { entityType, entityId } = req.params;
    let flowData = {};

    switch (entityType) {
      case 'vehicle':
        const vehicle = await Vehicle.findById(entityId).populate('owner');
        const vehicleBookings = await Booking.find({ vehicle: entityId }).populate('assignedMechanic');
        flowData = { vehicle, bookings: vehicleBookings };
        break;

      case 'booking':
        const booking = await Booking.findById(entityId)
          .populate('customer')
          .populate('vehicle')
          .populate('assignedMechanic');
        const jobCard = await JobCard.findOne({ booking: entityId });
        const invoice = jobCard ? await Invoice.findOne({ jobCard: jobCard._id }) : null;
        flowData = { booking, jobCard, invoice };
        break;

      case 'jobcard':
        const jobCardData = await JobCard.findById(entityId)
          .populate('booking')
          .populate('vehicle')
          .populate('assignedMechanic');
        const jobParts = await JobParts.find({ jobCard: entityId }).populate('part');
        const invoiceData = await Invoice.findOne({ jobCard: entityId });
        flowData = { jobCard: jobCardData, parts: jobParts, invoice: invoiceData };
        break;

      case 'invoice':
        const invoiceInfo = await Invoice.findById(entityId)
          .populate('jobCard')
          .populate('customer')
          .populate('vehicle');
        flowData = { invoice: invoiceInfo };
        break;

      default:
        return res.status(400).json({ error: 'Invalid entity type' });
    }

    res.json(flowData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Status transition endpoints
router.patch('/booking/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    // Auto-create job card when status becomes 'confirmed'
    if (status === 'confirmed') {
      const existingJobCard = await JobCard.findOne({ booking: req.params.id });
      if (!existingJobCard) {
        const jobCard = new JobCard({
          booking: req.params.id,
          customer: booking.customer,
          vehicle: booking.vehicle,
          serviceType: booking.serviceType,
          assignedMechanic: booking.assignedMechanic
        });
        await jobCard.save();
        
        // Update booking status to job_card_created
        await Booking.findByIdAndUpdate(req.params.id, { status: 'job_card_created' });
      }
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Inventory update when parts are used
router.post('/jobcard/:id/use-part', auth, async (req, res) => {
  try {
    const { partId, quantity, unitPrice } = req.body;
    
    // Check inventory availability
    const inventoryItem = await Inventory.findById(partId);
    if (!inventoryItem || inventoryItem.currentStock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    // Create job parts record
    const jobPart = new JobParts({
      jobCard: req.params.id,
      part: partId,
      quantityUsed: quantity,
      unitPrice,
      totalPrice: quantity * unitPrice
    });
    await jobPart.save();

    // Update inventory
    await Inventory.findByIdAndUpdate(partId, {
      $inc: { currentStock: -quantity }
    });

    // Update job card totals
    const jobCard = await JobCard.findById(req.params.id);
    const allParts = await JobParts.find({ jobCard: req.params.id });
    const partsTotal = allParts.reduce((sum, part) => sum + part.totalPrice, 0);
    
    jobCard.totalPartsCost = partsTotal;
    jobCard.totalCost = jobCard.totalLaborCost + partsTotal;
    await jobCard.save();

    res.json({ jobPart, updatedJobCard: jobCard });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Auto-generate invoice when job card is completed
router.patch('/jobcard/:id/complete', auth, async (req, res) => {
  try {
    const jobCard = await JobCard.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'completed',
        completedDate: new Date()
      },
      { new: true }
    ).populate('booking');

    // Update booking status
    await Booking.findByIdAndUpdate(jobCard.booking._id, { 
      status: 'ready_for_billing' 
    });

    // Auto-generate invoice
    const existingInvoice = await Invoice.findOne({ jobCard: req.params.id });
    if (!existingInvoice) {
      const invoice = new Invoice({
        jobCard: req.params.id,
        customer: jobCard.customer,
        vehicle: jobCard.vehicle,
        laborCost: jobCard.totalLaborCost,
        partsCost: jobCard.totalPartsCost,
        subtotal: jobCard.totalCost,
        tax: jobCard.totalCost * 0.1, // 10% tax
        totalAmount: jobCard.totalCost * 1.1
      });
      await invoice.save();
      
      res.json({ jobCard, invoice });
    } else {
      res.json({ jobCard, invoice: existingInvoice });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;