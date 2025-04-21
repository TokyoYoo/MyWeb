// models/Settings.js
const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  linkvertiseId: {
    type: String,
    default: '572754'
  },
  workinkUrl: {
    type: String,
    default: 'https://work.ink/1Zga/m9rbrvua'
  },
  userId: {
    type: String,
    required: true,
    unique: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Settings', SettingsSchema);