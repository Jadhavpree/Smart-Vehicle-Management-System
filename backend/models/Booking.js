const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Customer is required']
  },
  vehicle: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Vehicle', 
    required: [true, 'Vehicle is required']
  },
  serviceCenter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  serviceType: { 
    type: String, 
    required: [true, 'Service type is required'],
    trim: true,
    minlength: [2, 'Service type too short'],
    maxlength: [200, 'Service type too long']
  },
  description: { 
    type: String,
    maxlength: [1000, 'Description too long']
  },
  preferredDate: { 
    type: Date, 
    required: [true, 'Preferred date is required'],
    validate: {
      validator: function(date) {
        return date >= new Date(new Date().setHours(0, 0, 0, 0));
      },
      message: 'Preferred date cannot be in the past'
    }
  },
  scheduledDate: Date,
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'job_card_created', 'in_service', 'ready_for_billing', 'paid', 'cancelled'], 
    default: 'pending' 
  },
  assignedMechanic: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  estimatedCost: { 
    type: Number,
    min: [0, 'Cost cannot be negative']
  },
  actualCost: { 
    type: Number,
    min: [0, 'Cost cannot be negative']
  },
  notes: { 
    type: String,
    maxlength: [1000, 'Notes too long']
  },
  notificationPreference: { type: String, enum: ['sms', 'whatsapp', 'email', 'all'], default: 'all' },
  customerPhone: { 
    type: String,
    match: [/^\+?[1-9]\d{9,14}$/, 'Invalid phone number format']
  },
  smsNotifications: [{
    message: String,
    sentAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['sent', 'delivered', 'failed'], default: 'sent' }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);