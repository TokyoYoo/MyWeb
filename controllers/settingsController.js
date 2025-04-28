// controllers/settingsController.js
const WebsiteSettings = require('../models/WebsiteSettings');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Display settings page
exports.showSettings = async (req, res) => {
  try {
    // Get website settings
    const settings = await WebsiteSettings.findOne({});
    
    res.render('admin/settings', {
      title: 'Settings',
      user: req.user,
      settings: settings,
      activeTab: req.query.tab || 'account'
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { 
      title: 'Error',
      message: 'An error occurred while loading settings.' 
    });
  }
};

// Update website settings
exports.updateWebsite = async (req, res) => {
  try {
    // Extract form data
    const { 
      linkvertiseId, 
      workinkId, 
      lootlabId,
      checkpoint1, 
      checkpoint2, 
      checkpoint3,
      checkpoint1Api,
      checkpoint2Api, 
      checkpoint3Api
    } = req.body;

    // Find existing settings or create new
    let settings = await WebsiteSettings.findOne({});
    if (!settings) {
      settings = new WebsiteSettings();
    }

    // Update global provider IDs
    settings.linkvertiseId = linkvertiseId;
    settings.workinkId = workinkId;
    settings.lootlabId = lootlabId;
    
    // Update checkpoint providers (for backward compatibility)
    settings.checkpoint1Api = checkpoint1Api;
    settings.checkpoint2Api = checkpoint2Api;
    settings.checkpoint3Api = checkpoint3Api;
    
    // Update checkpoint configurations
    if (checkpoint1) {
      settings.checkpoint1 = {
        provider: checkpoint1.provider || 'linkvertise',
        linkvertiseId: checkpoint1.linkvertiseId || '',
        workinkId: checkpoint1.workinkId || '',
        lootlabId: checkpoint1.lootlabId || ''
      };
    }

    if (checkpoint2) {
      settings.checkpoint2 = {
        provider: checkpoint2.provider || 'linkvertise',
        linkvertiseId: checkpoint2.linkvertiseId || '',
        workinkId: checkpoint2.workinkId || '',
        lootlabId: checkpoint2.lootlabId || ''
      };
    }

    if (checkpoint3) {
      settings.checkpoint3 = {
        provider: checkpoint3.provider || 'none',
        linkvertiseId: checkpoint3.linkvertiseId || '',
        workinkId: checkpoint3.workinkId || '',
        lootlabId: checkpoint3.lootlabId || ''
      };
    }

    // Save updated settings
    await settings.save();

    res.render('admin/settings', {
      title: 'Settings',
      user: req.user,
      settings: settings,
      success: 'Website settings updated successfully.',
      activeTab: 'website'
    });
  } catch (err) {
    console.error(err);
    // Get settings to re-render the form
    const settings = await WebsiteSettings.findOne({});
    
    res.render('admin/settings', {
      title: 'Settings',
      user: req.user,
      settings: settings,
      error: 'Error updating website settings.',
      activeTab: 'website'
    });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.user._id;

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      const settings = await WebsiteSettings.findOne({});
      return res.render('admin/settings', {
        title: 'Settings',
        user: req.user,
        settings: settings,
        error: 'New passwords do not match.',
        activeTab: 'password'
      });
    }

    // Get user from database
    const user = await User.findById(userId);
    
    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      const settings = await WebsiteSettings.findOne({});
      return res.render('admin/settings', {
        title: 'Settings',
        user: req.user,
        settings: settings,
        error: 'Current password is incorrect.',
        activeTab: 'password'
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update user's password
    user.password = hashedPassword;
    await user.save();

    // Get settings for rendering
    const settings = await WebsiteSettings.findOne({});
    
    res.render('admin/settings', {
      title: 'Settings',
      user: req.user,
      settings: settings,
      success: 'Password changed successfully.',
      activeTab: 'password'
    });
  } catch (err) {
    console.error(err);
    // Get settings to re-render the form
    const settings = await WebsiteSettings.findOne({});
    
    res.render('admin/settings', {
      title: 'Settings',
      user: req.user,
      settings: settings,
      error: 'Error changing password.',
      activeTab: 'password'
    });
  }
};