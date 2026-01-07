const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
    unique: true, 
    lowercase: true, 
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address']
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters']
  },
  role: { type: String, enum: ['customer', 'mechanic', 'admin'], default: 'customer' },
  phone: { 
    type: String, 
    trim: true,
    match: [/^\+?[1-9]\d{9,14}$/, 'Please provide a valid phone number (10-15 digits)']
  },
  address: { type: String, trim: true, maxlength: [500, 'Address too long'] },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);