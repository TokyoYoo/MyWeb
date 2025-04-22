// models/WebsiteSettings.js
const mongoose = require('mongoose');

const WebsiteSettingsSchema = new mongoose.Schema({
  linkvertiseId: {
    type: String,
    default: '572754'
  },
  workinkId: {
    type: String,
    default: '1Zh1/m9skr9gt'
  },
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

module.exports = mongoose.model('WebsiteSettings', WebsiteSettingsSchema);