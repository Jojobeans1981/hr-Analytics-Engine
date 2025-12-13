const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const employeeRoutes = require('./routes/employeeRoutes');
const riskRoutes = require('./routes/riskRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/Prometheus', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log(`âœ… Connected to MongoDB: ${mongoose.connection.host}/${mongoose.connection.name}`);
  
  // Test the connection
  const Employee = require('./models/Employee');
  const count = await Employee.countDocuments();
  console.log(`í³Š Found ${count} employees in the database`);
  
  if (count > 0) {
    const sample = await Employee.findOne();
    console.log(`í±¤ Sample employee: ${sample.name} - ${sample.department} - ${sample.riskScore}%`);
  }
})
.catch(err => {
  console.error('âŒ MongoDB connection error:', err.message);
});

// Routes
app.use('/api/employees', employeeRoutes);
app.use('/api/risk', riskRoutes);

// Health check with DB status
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const statusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  
  res.status(200).json({
    success: true,
    message: 'Server is running',
    database: {
      name: mongoose.connection.name,
      status: statusMap[dbStatus] || 'unknown',
      connected: dbStatus === 1
    },
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`íº€ Server running on port ${PORT}`);
});
