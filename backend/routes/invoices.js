const express = require('express');
const Invoice = require('../models/Invoice');
const JobCard = require('../models/JobCard');
const auth = require('../middleware/auth');
const { sendInvoiceEmail } = require('../services/emailService');
const notificationService = require('../services/notificationService');

const router = express.Router();

// Create invoice from job card
router.post('/', auth, async (req, res) => {
  try {
    const { jobCardId } = req.body;
    
    const jobCard = await JobCard.findById(jobCardId).populate('customer vehicle booking');
    if (!jobCard) {
      return res.status(404).json({ success: false, message: 'Job card not found' });
    }

    // Get service center details (current user)
    const serviceCenter = await require('../models/User').findById(req.userId).select('name email phone address');

    // Auto-calculate costs from job card
    const laborCost = jobCard.totalLaborCost || 150;
    const partsCost = jobCard.totalPartsCost || 75;
    const subtotal = laborCost + partsCost;
    const tax = subtotal * 0.1; // 10% tax
    const totalAmount = subtotal + tax;

    const invoice = new Invoice({
      jobCard: jobCardId,
      customer: jobCard.customer._id,
      vehicle: jobCard.vehicle._id,
      serviceCenter: req.userId,
      serviceType: jobCard.serviceType,
      laborCost,
      partsCost,
      subtotal,
      tax,
      totalAmount,
      status: 'pending'
    });

    await invoice.save();
    
    // Populate invoice before sending response
    await invoice.populate('customer', 'name email phone address');
    await invoice.populate('vehicle', 'make model year licensePlate');
    await invoice.populate('serviceCenter', 'name email phone address');
    await invoice.populate('jobCard');
    
    // Create notification for new invoice
    await notificationService.createInvoiceNotification(invoice, jobCard.customer._id);
    
    res.status(201).json({ 
      success: true, 
      data: invoice,
      message: 'Invoice auto-generated with labor and parts breakdown'
    });
  } catch (error) {
    console.error('Invoice creation error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to create invoice'
    });
  }
});

// Get all invoices
router.get('/', auth, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.userId);
    
    let query = {};
    if (user.role === 'customer') {
      query = { customer: req.userId };
    } else {
      query = { serviceCenter: req.userId };
    }
    
    const invoices = await Invoice.find(query)
      .populate('customer', 'name email phone')
      .populate('vehicle', 'make model year licensePlate')
      .populate('jobCard');
    res.json({ success: true, data: invoices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single invoice
router.get('/:id', auth, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('customer', 'name email phone address')
      .populate('vehicle', 'make model year licensePlate vin mileage')
      .populate('serviceCenter', 'name email phone address')
      .populate({
        path: 'jobCard',
        populate: [
          { path: 'laborTasks' },
          { path: 'spareParts' }
        ]
      });
    
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }
    
    res.json({ success: true, data: invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update payment status
router.patch('/:id/payment', auth, async (req, res) => {
  try {
    const { paymentStatus, paymentMethod } = req.body;
    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      { 
        paymentStatus, 
        paymentMethod,
        paidDate: paymentStatus === 'paid' ? new Date() : null
      },
      { new: true }
    );
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mock payment processing
router.post('/:id/process-payment', auth, async (req, res) => {
  try {
    const { paymentMethod, cardNumber } = req.body;
    
    // Mock payment gateway simulation - 100% success for demo
    const isPaymentSuccessful = true;
    
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }
    
    if (isPaymentSuccessful) {
      invoice.status = 'paid';
      invoice.paymentMethod = paymentMethod;
      invoice.paymentDate = new Date();
      await invoice.save();
      
      // Create notification for successful payment
      await notificationService.createPaymentNotification(invoice, req.userId);
      
      res.json({ 
        success: true, 
        message: 'Payment processed successfully',
        transactionId: `TXN-${Date.now()}`,
        invoice 
      });
    } else {
      invoice.status = 'failed';
      await invoice.save();
      
      res.status(400).json({ 
        success: false, 
        message: 'Payment failed. Please try again.',
        invoice 
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Send invoice email
router.post('/:id/send-email', auth, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('customer', 'name email phone address')
      .populate('vehicle', 'make model year licensePlate vin mileage')
      .populate('serviceCenter', 'name email phone address')
      .populate('jobCard');
    
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }
    
    const result = await sendInvoiceEmail(invoice.customer.email, invoice);
    
    if (result.success) {
      res.json({ 
        success: true, 
        message: 'Invoice email sent successfully',
        messageId: result.messageId
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to send email: ' + result.error
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;