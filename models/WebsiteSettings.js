// models/WebsiteSettings.js
const mongoose = require('mongoose');

const WebsiteSettingsSchema = new mongoose.Schema({
  // Default provider IDs (จะไม่ใช้หน้าฟอร์มแล้ว แต่ยังเก็บไว้เพื่อความเข้ากันได้กับโค้ดเก่า)
  linkvertiseId: {
    type: String,
    default: '572754'
  },
  workinkId: {
    type: String,
    default: '1Zh1/m9skr9gt'
  },
  lootlabId: {
    type: String,
    default: '1174439'
  },
  
  // Checkpoint configurations
  checkpoint1: {
    provider: {
      type: String,
      enum: ['linkvertise', 'workink', 'lootlab', 'none'],
      default: 'linkvertise'
    },
    linkvertiseId: {
      type: String,
      default: '572754'
    },
    workinkId: {
      type: String,
      default: '1Zh1/m9skr9gt'
    },
    lootlabId: {
      type: String,
      default: '1174439'
    }
  },
  
  checkpoint2: {
    provider: {
      type: String,
      enum: ['linkvertise', 'workink', 'lootlab', 'none'],
      default: 'linkvertise'
    },
    linkvertiseId: {
      type: String,
      default: '572754'
    },
    workinkId: {
      type: String,
      default: '1Zh1/m9skr9gt'
    },
    lootlabId: {
      type: String,
      default: '1174439'
    }
  },
  
  checkpoint3: {
    provider: {
      type: String,
      enum: ['linkvertise', 'workink', 'lootlab', 'none'],
      default: 'none'
    },
    linkvertiseId: {
      type: String,
      default: '572754'
    },
    workinkId: {
      type: String,
      default: '1Zh1/m9skr9gt'
    },
    lootlabId: {
      type: String,
      default: '1174439'
    }
  },
  
  // For backward compatibility
  checkpoint1Api: {
    type: String,
    enum: ['linkvertise', 'workink', 'lootlab', 'none'],
    default: 'linkvertise'
  },
  checkpoint2Api: {
    type: String,
    enum: ['linkvertise', 'workink', 'lootlab', 'none'],
    default: 'linkvertise'
  },
  checkpoint3Api: {
    type: String,
    enum: ['linkvertise', 'workink', 'lootlab', 'none'],
    default: 'none'
  }
});

module.exports = mongoose.model('WebsiteSettings', WebsiteSettingsSchema);