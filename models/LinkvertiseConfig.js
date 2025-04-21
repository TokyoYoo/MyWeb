const mongoose = require('mongoose');

const LinkvertiseConfigSchema = new mongoose.Schema({
  linkvertiseId: {
    type: String,
    required: true,
    default: '572754' // Default ID as a fallback
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure there's only one config document by using a singleton pattern
LinkvertiseConfigSchema.statics.getSingleton = async function() {
  let config = await this.findOne();
  if (!config) {
    config = await this.create({});
  }
  return config;
};

const LinkvertiseConfig = mongoose.model('LinkvertiseConfig', LinkvertiseConfigSchema);

module.exports = LinkvertiseConfig;