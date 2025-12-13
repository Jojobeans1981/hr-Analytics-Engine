const mongoose = require('mongoose');

// Your actual database schema (based on your data)
const employeeSchema = new mongoose.Schema({
  name: String,
  email: String,
  employeeId: String,
  department: String,
  role: String,
  location: String,
  tenureMonths: Number,
  performanceRating: Number,
  engagementScore: Number,
  compRatio: Number,
  criticalSkills: [String],
  skillGaps: [String],
  riskScore: Number,
  riskLevel: String,
  status: String,
  lastAssessmentDate: Date,
  hireDate: Date,
  createdAt: Date,
  updatedAt: Date
}, {
  collection: 'employees',  // Explicitly set to 'employees'
  strict: false  // Allow extra fields that might exist
});

// Virtuals for frontend compatibility
employeeSchema.virtual('position').get(function() {
  return this.role;
});

employeeSchema.virtual('performanceScore').get(function() {
  // Convert 0-5 rating to 0-100 score
  return this.performanceRating ? (this.performanceRating / 5) * 100 : 0;
});

// Convert riskLevel to uppercase for frontend
employeeSchema.virtual('riskLevelFormatted').get(function() {
  return this.riskLevel ? this.riskLevel.toUpperCase() : 'MEDIUM';
});

employeeSchema.set('toJSON', { 
  virtuals: true,
  transform: function(doc, ret) {
    // Ensure riskLevel is uppercase in JSON output
    if (ret.riskLevel) {
      ret.riskLevel = ret.riskLevel.toUpperCase();
    }
    return ret;
  }
});

employeeSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Employee', employeeSchema);
