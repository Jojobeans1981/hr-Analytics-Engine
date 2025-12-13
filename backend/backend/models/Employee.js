const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Employee name is required'],
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    enum: ['Engineering', 'Sales', 'Marketing', 'Finance', 'HR', 'Operations', 'Product', 'Other']
  },
  riskScore: {
    type: Number,
    required: [true, 'Risk score is required'],
    min: [0, 'Risk score cannot be negative'],
    max: [100, 'Risk score cannot exceed 100']
  },
  riskLevel: {
    type: String,
    required: [true, 'Risk level is required'],
    enum: ['LOW', 'MEDIUM', 'HIGH'],
    default: 'MEDIUM'
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  position: {
    type: String,
    required: [true, 'Position is required'],
    trim: true
  },
  hireDate: {
    type: Date,
    required: [true, 'Hire date is required']
  },
  lastReview: Date,
  performanceScore: {
    type: Number,
    min: 0,
    max: 100
  },
  manager: String,
  location: String,
  skills: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp before saving
employeeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Auto-calculate risk level based on score
employeeSchema.pre('save', function(next) {
  if (this.riskScore >= 70) {
    this.riskLevel = 'HIGH';
  } else if (this.riskScore >= 40) {
    this.riskLevel = 'MEDIUM';
  } else {
    this.riskLevel = 'LOW';
  }
  next();
});

module.exports = mongoose.model('Employee', employeeSchema);
