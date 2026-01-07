const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  serviceCenter: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Service center is required']
  },
  name: { 
    type: String, 
    required: [true, 'Name is required'],
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters'],
    trim: true
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address']
  },
  phone: { 
    type: String, 
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^\+?[1-9]\d{9,14}$/, 'Please provide a valid phone number (10-15 digits)']
  },
  role: { 
    type: String, 
    enum: ['mechanic', 'technician', 'service_advisor', 'manager'], 
    default: 'mechanic' 
  },
  specialization: [String],
  employeeId: { 
    type: String,
    trim: true,
    maxlength: [50, 'Employee ID too long']
  },
  hourlyRate: { 
    type: Number, 
    default: 50,
    min: [0, 'Hourly rate cannot be negative'],
    max: [1000, 'Hourly rate too high']
  },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'on_leave'], 
    default: 'active' 
  },
  hireDate: { 
    type: Date, 
    default: Date.now 
  },
  certifications: [String],
  notes: { 
    type: String,
    maxlength: [1000, 'Notes too long']
  }
}, { timestamps: true });

// Auto-create performance record for mechanics
teamMemberSchema.post('save', async function(doc) {
  if (doc.role === 'mechanic') {
    const MechanicPerformance = mongoose.model('MechanicPerformance');
    await MechanicPerformance.findOneAndUpdate(
      { mechanic: doc._id, serviceCenter: doc.serviceCenter },
      {
        mechanic: doc._id,
        serviceCenter: doc.serviceCenter,
        totalJobs: 0,
        completedJobs: 0,
        totalHours: 0,
        onTimeJobs: 0,
        avgRating: 0,
        totalRatings: 0,
        satisfactionCount: 0,
        lastUpdated: new Date()
      },
      { upsert: true, new: true }
    );
  }
});

module.exports = mongoose.model('TeamMember', teamMemberSchema);
