// models/AdvancedWebsiteSettings.js
const mongoose = require('mongoose');

const AdvancedWebsiteSettingsSchema = new mongoose.Schema({
  // Linkvertise IDs
  linkvertiseId1: {
    type: String,
    default: ''
  },
  linkvertiseId2: {
    type: String,
    default: ''
  },
  linkvertiseId3: {
    type: String,
    default: ''
  },
  
  // Workink IDs
  workinkId1: {
    type: String,
    default: ''
  },
  workinkId2: {
    type: String,
    default: ''
  },
  workinkId3: {
    type: String,
    default: '1Zh1/m9skr9gt'
  },
  
  // API selections
  checkpoint1Api: {
    type: String,
    enum: ['linkvertise', 'workink', 'none'],
    default: 'linkvertise'
  },
  checkpoint2Api: {
    type: String,
    enum: ['linkvertise', 'workink', 'none'],
    default: 'linkvertise'
  },
  checkpoint3Api: {
    type: String,
    enum: ['linkvertise', 'workink', 'none'],
    default: 'none'
  }
});

module.exports = mongoose.model('AdvancedWebsiteSettings', AdvancedWebsiteSettingsSchema);