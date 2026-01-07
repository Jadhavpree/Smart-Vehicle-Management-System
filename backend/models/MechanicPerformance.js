const mongoose = require('mongoose');

const mechanicPerformanceSchema = new mongoose.Schema({
  mechanic: { type: mongoose.Schema.Types.ObjectId, ref: 'TeamMember', required: true },
  serviceCenter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  totalJobs: { type: Number, default: 0 },
  completedJobs: { type: Number, default: 0 },
  totalHours: { type: Number, default: 0 },
  onTimeJobs: { type: Number, default: 0 },
  avgRating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  satisfactionCount: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

mechanicPerformanceSchema.index({ mechanic: 1, serviceCenter: 1 }, { unique: true });

module.exports = mongoose.model('MechanicPerformance', mechanicPerformanceSchema);
