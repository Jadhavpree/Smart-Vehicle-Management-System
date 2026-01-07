const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const JobCard = require('../models/JobCard');

// Add inspection note (text-based instead of photo)
router.post('/:jobCardId/inspection-note', auth, async (req, res) => {
  try {
    const { description, partName } = req.body;
    const jobCard = await JobCard.findById(req.params.jobCardId);
    
    if (!jobCard) {
      return res.status(404).json({ message: 'Job card not found' });
    }

    const inspectionData = {
      url: '', // Empty for now, can add photo URL later
      description,
      partName,
      uploadedBy: req.user.id,
      uploadedAt: new Date(),
      sentToCustomer: false,
      customerApproved: false
    };

    jobCard.inspectionPhotos.push(inspectionData);
    await jobCard.save();

    res.json({ 
      message: 'Inspection note added successfully',
      inspection: inspectionData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get inspection notes for a job card
router.get('/:jobCardId/inspection-notes', auth, async (req, res) => {
  try {
    const jobCard = await JobCard.findById(req.params.jobCardId)
      .populate('inspectionPhotos.uploadedBy', 'name');
    
    if (!jobCard) {
      return res.status(404).json({ message: 'Job card not found' });
    }

    res.json(jobCard.inspectionPhotos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send inspection note to customer
router.post('/:jobCardId/send-inspection/:inspectionId', auth, async (req, res) => {
  try {
    const jobCard = await JobCard.findById(req.params.jobCardId)
      .populate('customer', 'name email phone');
    
    if (!jobCard) {
      return res.status(404).json({ message: 'Job card not found' });
    }

    const inspection = jobCard.inspectionPhotos.id(req.params.inspectionId);
    if (!inspection) {
      return res.status(404).json({ message: 'Inspection not found' });
    }

    inspection.sentToCustomer = true;
    
    // Add communication log
    jobCard.communications.push({
      type: 'sms',
      message: `Inspection update: ${inspection.partName} - ${inspection.description}`,
      sentAt: new Date(),
      status: 'sent',
      recipient: jobCard.customer.phone
    });

    await jobCard.save();

    res.json({ 
      message: 'Inspection note sent to customer',
      inspection
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Customer approves inspection finding
router.patch('/:jobCardId/approve-inspection/:inspectionId', auth, async (req, res) => {
  try {
    const jobCard = await JobCard.findById(req.params.jobCardId);
    
    if (!jobCard) {
      return res.status(404).json({ message: 'Job card not found' });
    }

    const inspection = jobCard.inspectionPhotos.id(req.params.inspectionId);
    if (!inspection) {
      return res.status(404).json({ message: 'Inspection not found' });
    }

    inspection.customerApproved = true;
    inspection.approvalDate = new Date();
    
    await jobCard.save();

    res.json({ 
      message: 'Inspection approved by customer',
      inspection
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
