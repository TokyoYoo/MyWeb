// models/Mod.js
const mongoose = require('mongoose');
const shortid = require('shortid');

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
  name: {
    type: String,
    required: true,
    trim: true
  },
  originalLink: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    trim: true
  },
  shortId: {
    type: String,
    default: shortid.generate,
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
  createdAt: {
    type: Date,
    default: Date.now
  },
  // เพิ่มเมื่อต้องการเก็บข้อมูลเพิ่มเติม (optional)
  description: {
    type: String,
    trim: true
  }
});

module.exports = mongoose.model('Mod', ModSchema);