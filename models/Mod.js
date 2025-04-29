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
  checkpoint1Count: {
    type: Number,
    default: 0
  },
  checkpoint2Count: {
    type: Number,
    default: 0
  },
  checkpoint3Count: {
    type: Number,
    default: 0
  },
  countryStats: [{
    country: String,
    count: {
      type: Number,
      default: 0
    }
  }],
  checkpointStats: [{
    userId: String,
    country: String,
    checkpoint1Time: Date,
    checkpoint2Time: Date,
    checkpoint3Time: Date,
    downloadTime: Date,
    userAgent: String,
    completed: {
      type: Boolean,
      default: false
    }
  }],
  createdBy: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Mod', ModSchema);