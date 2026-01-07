const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Load models first to avoid schema registration errors
require('../models/User');
require('../models/Vehicle');
require('../models/Booking');
require('../models/JobCard');
require('../models/TeamMember');
require('../models/MechanicPerformance');
require('../models/Review');
require('../models/Inventory');
require('../models/Invoice');
require('../models/StockRequest');
require('../models/Notification');

// Routes
app.use('/api/auth', require('../routes/auth'));
app.use('/api/users', require('../routes/users'));
app.use('/api/vehicles', require('../routes/vehicles'));
app.use('/api/bookings', require('../routes/bookings'));
app.use('/api/jobcards', require('../routes/jobcards'));
app.use('/api/admin', require('../routes/admin'));
app.use('/api/servicecenter', require('../routes/servicecenter'));
app.use('/api/inventory', require('../routes/inventory'));
app.use('/api/invoices', require('../routes/invoices'));
app.use('/api/reviews', require('../routes/reviews'));
app.use('/api/stock-requests', require('../routes/stockRequests'));
app.use('/api/system', require('../routes/systemFlow'));
app.use('/api/inspection', require('../routes/inspection'));
app.use('/api/notifications', require('../routes/notifications'));
app.use('/api/labor-tracking', require('../routes/laborTracking'));
app.use('/api/team', require('../routes/team'));
app.use('/api/analytics', require('../routes/analytics'));

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));