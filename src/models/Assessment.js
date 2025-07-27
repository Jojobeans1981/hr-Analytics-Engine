const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },
  type: {
    type: String,
    enum: ['individual', 'team'],
    default: 'individual'
  },
  assessmentDate: {
    type: Date,
    default: Date.now
  },
  risk: {
    score: Number,
    level: {
      type: String,
      enum: ['low', 'medium', 'high']
    },
    factors: [String],
    insights: [String],
    impactScore: Number
  },
  sentiment: {
    score: Number,
    overallSentiment: String,
    insights: [String]
  },
  skills: {
    score: Number,
    gaps: [String],
    strengths: [String],
    recommendations: [String]
  },
  overallScore: Number,
  recommendations: [{
    priority: {
      type: String,
      enum: ['urgent', 'high', 'medium', 'low']
    },
    category: String,
    action: String,
    reason: String,
    timeline: String,
    specificActions: [String]
  }],
  alerts: [{
    type: String,
    message: String,
    icon: String
  }],
  aggregateMetrics: Object,
  riskDistribution: Object,
  skillsOverview: Object,
  teamHealth: Object,
  assessedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes
assessmentSchema.index({ employee: 1, assessmentDate: -1 });
assessmentSchema.index({ team: 1, assessmentDate: -1 });
assessmentSchema.index({ 'risk.level': 1 });

module.exports = mongoose.model('Assessment', assessmentSchema);