// models/Mod.js
const mongoose = require('mongoose');

const ModSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  originalLink: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: '/images/default-mod.png'
  },
  shortId: {
    type: String,
    required: true,
    unique: true
  },
  clicks: {
    type: Number,
    default: 0
  },
  completedClicks: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: String,
    required: true
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  adConfig: {
    checkpoint1: {
      provider: { type: String, enum: ['none', 'linkvertise', 'workink'], default: 'linkvertise' }
    },
    checkpoint2: {
      provider: { type: String, enum: ['none', 'linkvertise', 'workink'], default: 'none' }
    },
    checkpoint3: {
      provider: { type: String, enum: ['none', 'linkvertise', 'workink'], default: 'none' }
    }
  }
});

module.exports = mongoose.model('Mod', ModSchema);