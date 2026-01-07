const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  make: { type: String, required: true, trim: true },
  model: { type: String, required: true, trim: true },
  year: { type: Number, required: true, min: 1900, max: new Date().getFullYear() + 1 },
  vin: { type: String, unique: true, sparse: true, uppercase: true, trim: true },
  licensePlate: { type: String, required: true, uppercase: true, trim: true },
  mileage: { type: Number, required: true, min: 0 },
  color: { type: String, trim: true },
  engineType: { type: String, enum: ['v4', 'v6', 'v8', 'electric', 'hybrid', 'diesel', ''], default: '' },
  transmissionType: { type: String, enum: ['automatic', 'manual', 'cvt', 'dual-clutch', ''], default: '' },
  fuelType: { type: String, enum: ['gasoline', 'diesel', 'electric', 'hybrid', 'plug-in-hybrid', ''], default: '' },
  notes: { type: String, maxlength: 500 },
  status: { type: String, enum: ['active', 'inactive', 'sold'], default: 'active' },
  lastServiceDate: { type: Date },
  nextServiceDue: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);