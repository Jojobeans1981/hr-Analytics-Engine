const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['technical', 'soft', 'leadership', 'domain']
  },
  description: String,
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    default: 'beginner'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Skill', skillSchema);