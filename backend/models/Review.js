const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: false
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  serviceCenter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: false
  },
  mechanic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TeamMember'
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  serviceType: String
}, {
  timestamps: true
});

reviewSchema.post('save', async function(doc) {
  if (doc.mechanic) {
    const MechanicPerformance = mongoose.model('MechanicPerformance');
    const perf = await MechanicPerformance.findOne({ mechanic: doc.mechanic });
    if (perf) {
      perf.totalRatings += 1;
      perf.avgRating = ((perf.avgRating * (perf.totalRatings - 1)) + doc.rating) / perf.totalRatings;
      if (doc.rating >= 4) perf.satisfactionCount += 1;
      perf.lastUpdated = new Date();
      await perf.save();
    }
  }
});

module.exports = mongoose.model('Review', reviewSchema);
