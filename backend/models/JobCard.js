const mongoose = require('mongoose');

const jobCardSchema = new mongoose.Schema({
  jobCardNumber: { type: String, unique: true },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  serviceCenter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  serviceType: { type: String, required: true },
  assignedMechanic: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['created', 'in-progress', 'completed'], default: 'created' },
  startDate: { type: Date, default: Date.now },
  completedDate: Date,
  laborTasks: [{
    task: String,
    hours: Number,
    hourlyRate: { type: Number, default: 50 },
    completed: { type: Boolean, default: false },
    // NEW: Labor Tracking
    clockInTime: Date,
    clockOutTime: Date,
    actualHours: Number,
    technicianId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  spareParts: [{
    partName: String,
    quantity: Number,
    unitPrice: Number,
    totalPrice: Number
  }],
  totalLaborCost: { type: Number, default: 0 },
  totalPartsCost: { type: Number, default: 0 },
  totalCost: { type: Number, default: 0 },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  progressUpdates: [{
    timestamp: { type: Date, default: Date.now },
    status: String,
    description: String,
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  // NEW: Digital Vehicle Inspection
  inspectionPhotos: [{
    url: String,
    description: String,
    partName: String,
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    uploadedAt: { type: Date, default: Date.now },
    sentToCustomer: { type: Boolean, default: false },
    customerApproved: { type: Boolean, default: false },
    approvalDate: Date
  }],
  // NEW: Communication Log
  communications: [{
    type: { type: String, enum: ['sms', 'whatsapp', 'email'] },
    message: String,
    sentAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['sent', 'delivered', 'failed'], default: 'sent' },
    recipient: String
  }],
  notes: String
}, { timestamps: true });

// Auto-generate job card number
jobCardSchema.pre('save', async function(next) {
  if (!this.jobCardNumber) {
    const count = await mongoose.model('JobCard').countDocuments();
    this.jobCardNumber = `JC-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;
  }
  
  // Ensure we have a job card number
  if (!this.jobCardNumber) {
    this.jobCardNumber = `JC-${Date.now()}`;
  }
  
  // Calculate totals
  this.totalLaborCost = this.laborTasks.reduce((sum, task) => sum + (task.hours * task.hourlyRate), 0);
  this.totalPartsCost = this.spareParts.reduce((sum, part) => sum + part.totalPrice, 0);
  this.totalCost = this.totalLaborCost + this.totalPartsCost;
  
  next();
});

// Update mechanic performance when job is completed
jobCardSchema.post('save', async function(doc) {
  if (doc.status === 'completed' && doc.assignedMechanic) {
    const MechanicPerformance = mongoose.model('MechanicPerformance');
    const TeamMember = mongoose.model('TeamMember');
    
    const mechanic = await TeamMember.findById(doc.assignedMechanic);
    if (!mechanic) return;
    
    const perf = await MechanicPerformance.findOneAndUpdate(
      { mechanic: doc.assignedMechanic, serviceCenter: doc.serviceCenter },
      { $inc: { completedJobs: 1 } },
      { upsert: true, new: true }
    );
    
    const completedTasks = doc.laborTasks.filter(t => t.completed && t.technicianId?.toString() === doc.assignedMechanic.toString());
    const totalHours = completedTasks.reduce((sum, t) => sum + (t.actualHours || 0), 0);
    const onTime = completedTasks.filter(t => (t.actualHours || 0) <= t.hours).length;
    
    perf.totalHours += totalHours;
    perf.onTimeJobs += onTime;
    perf.totalJobs = perf.completedJobs;
    perf.lastUpdated = new Date();
    await perf.save();
  }
});

module.exports = mongoose.model('JobCard', jobCardSchema);