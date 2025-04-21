// routes/admin.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const shortid = require('shortid');
const Mod = require('../models/Mod');
const User = require('../models/User');
const auth = require('../middlewares/auth');
const LinkvertiseConfig = require('../models/LinkvertiseConfig');

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.isAdmin) {
    return next();
  }
  return res.redirect('/admin/login');
};

// Login verification function (modified from ensureAuthenticated to isAdmin)
const ensureAuthenticated = isAdmin;

// Admin login page
router.get('/login', (req, res) => {
  if (req.session.user && req.session.user.isAdmin) {
    return res.redirect('/admin/dashboard');
  }
  res.render('admin/login', { title: 'Admin Login' });
});

// Admin login processing
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.render('admin/login', { 
        title: 'Admin Login',
        error: 'Invalid credentials' 
      });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render('admin/login', { 
        title: 'Admin Login',
        error: 'Invalid credentials' 
      });
    }
    
    // Set session
    req.session.user = {
      id: user._id,
      username: user.username,
      isAdmin: user.isAdmin
    };
    
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error(err);
    res.render('admin/login', { 
      title: 'Admin Login',
      error: 'Server error occurred' 
    });
  }
});

// Admin dashboard
router.get('/dashboard', isAdmin, async (req, res) => {
  try {
    const mods = await Mod.find().sort({ createdAt: -1 });
    res.render('admin/dashboard', { 
      title: 'Admin Dashboard',
      mods
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error occurred');
  }
});

// Create link page
router.get('/create-link', isAdmin, (req, res) => {
  res.render('admin/create-link', { title: 'Create New Link' });
});

// Link creation processing
router.post('/create-link', isAdmin, async (req, res) => {
  try {
    const { name, originalLink, image } = req.body;
    
    // Create short ID
    const shortId = shortid.generate();
    
    const newMod = new Mod({
      name,
      originalLink,
      image: image || '/images/default-mod.png',
      shortId,
      createdBy: req.session.user.username
    });
    
    await newMod.save();
    
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error(err);
    res.render('admin/create-link', { 
      title: 'Create New Link',
      error: 'Error creating link',
      formData: req.body
    });
  }
});

// Edit link page
router.get('/edit/:id', isAdmin, async (req, res) => {
  try {
    const mod = await Mod.findById(req.params.id);
    if (!mod) {
      return res.status(404).send('Mod not found');
    }
    res.render('admin/edit-link', { title: 'Edit Link', mod });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error occurred');
  }
});

// Update link
router.put('/edit/:id', isAdmin, async (req, res) => {
  try {
    const { name, originalLink, image } = req.body;
    
    await Mod.findByIdAndUpdate(req.params.id, {
      name,
      originalLink,
      image: image || '/images/default-mod.png'
    });
    
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error occurred');
  }
});

// Delete link
router.delete('/delete/:id', isAdmin, async (req, res) => {
  try {
    await Mod.findByIdAndDelete(req.params.id);
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error occurred');
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// Settings page (modified from ensureAuthenticated to isAdmin)
router.get('/settings', isAdmin, async (req, res) => {
  try {
    // Retrieve Linkvertise ID from database
    let linkvertiseConfig = await LinkvertiseConfig.findOne();
    
    // If no data exists, create default value
    if (!linkvertiseConfig) {
      linkvertiseConfig = { linkvertiseId: '' };
    }
    
    res.render('admin/settings', {
      title: 'Settings',
      user: req.session.user,
      linkvertiseId: linkvertiseConfig.linkvertiseId,
      success: req.flash ? req.flash('success') : null,
      error: req.flash ? req.flash('error') : null,
      activeTab: req.flash && req.flash('activeTab') ? req.flash('activeTab')[0] : 'account'
    });
  } catch (err) {
    console.error(err);
    if (req.flash) {
      req.flash('error', 'Error loading data');
    }
    res.redirect('/admin/dashboard');
  }
});

// Change password from settings page
router.post('/settings/change-password', isAdmin, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    
    // Check if new passwords match
    if (newPassword !== confirmPassword) {
      return res.render('admin/settings', {
        title: 'System Settings',
        user: req.session.user,
        error: 'New passwords do not match',
        activeTab: 'password'
      });
    }
    
    // Find user from session ID
    const user = await User.findById(req.session.user.id);
    if (!user) {
      return res.render('admin/settings', {
        title: 'System Settings',
        user: req.session.user,
        error: 'User not found',
        activeTab: 'password'
      });
    }
    
    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.render('admin/settings', {
        title: 'System Settings',
        user: req.session.user,
        error: 'Current password is incorrect',
        activeTab: 'password'
      });
    }
    
    // Encrypt and save new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    
    return res.render('admin/settings', {
      title: 'System Settings',
      user: req.session.user,
      success: 'Password changed successfully',
      activeTab: 'password'
    });
  } catch (err) {
    console.error(err);
    res.render('admin/settings', {
      title: 'System Settings',
      user: req.session.user,
      error: 'Server error occurred',
      activeTab: 'password'
    });
  }
});

// Update Linkvertise ID
router.post('/settings/update-linkvertise', isAdmin, async (req, res) => {
  try {
    const { linkvertiseId } = req.body;
    
    if (!linkvertiseId) {
      if (req.flash) {
        req.flash('error', 'Please specify Linkvertise ID');
        req.flash('activeTab', 'linkvertise');
      }
      return res.redirect('/admin/settings');
    }
    
    // Update Linkvertise ID
    const config = await LinkvertiseConfig.findOne();
    if (config) {
      config.linkvertiseId = linkvertiseId;
      config.updatedAt = Date.now();
      await config.save();
    } else {
      await LinkvertiseConfig.create({
        linkvertiseId: linkvertiseId
      });
    }
    
    if (req.flash) {
      req.flash('success', 'Linkvertise ID updated successfully');
      req.flash('activeTab', 'linkvertise');
    }
    res.redirect('/admin/settings');
  } catch (err) {
    console.error(err);
    if (req.flash) {
      req.flash('error', 'Error updating Linkvertise ID');
      req.flash('activeTab', 'linkvertise');
    }
    res.redirect('/admin/settings');
  }
});

module.exports = router;