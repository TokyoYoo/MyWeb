// routes/admin.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const shortid = require('shortid');
const Mod = require('../models/Mod');
const User = require('../models/User');
const auth = require('../middlewares/auth');
const WebsiteSettings = require('../models/AdvancedWebsiteSettings');
// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.isAdmin) {
    return next();
  }
  return res.redirect('/admin/login');
};

// Admin login page
router.get('/login', (req, res) => {
  if (req.session.user && req.session.user.isAdmin) {
    return res.redirect('/admin/dashboard');
  }
  res.render('admin/login', { title: 'Admin Login' });
});

// Admin login process
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
      error: 'Server error' 
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
    res.status(500).send('Server Error');
  }
});

// Create link page
router.get('/create-link', isAdmin, (req, res) => {
  res.render('admin/create-link', { title: 'Create New Link' });
});

// Create link process
router.post('/create-link', isAdmin, async (req, res) => {
  try {
    const { name, originalLink, image } = req.body;
    
    // Generate short ID
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
    res.status(500).send('Server Error');
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
    res.status(500).send('Server Error');
  }
});

// Delete link
router.delete('/delete/:id', isAdmin, async (req, res) => {
  try {
    await Mod.findByIdAndDelete(req.params.id);
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// เพิ่มส่วนนี้ก่อน module.exports = router; ในไฟล์ routes/admin.js


// เปลี่ยนรหัสผ่านจากหน้าตั้งค่า
router.post('/settings/change-password', isAdmin, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    
    // ตรวจสอบว่ารหัสผ่านใหม่ตรงกัน
    if (newPassword !== confirmPassword) {
      return res.render('admin/settings', {
        title: 'ตั้งค่าระบบ',
        user: req.session.user,
        error: 'รหัสผ่านใหม่ไม่ตรงกัน',
        activeTab: 'password'
      });
    }
    
    // หาผู้ใช้จาก ID ในเซสชัน
    const user = await User.findById(req.session.user.id);
    if (!user) {
      return res.render('admin/settings', {
        title: 'ตั้งค่าระบบ',
        user: req.session.user,
        error: 'ไม่พบผู้ใช้',
        activeTab: 'password'
      });
    }
    
    // ตรวจสอบรหัสผ่านปัจจุบัน
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.render('admin/settings', {
        title: 'ตั้งค่าระบบ',
        user: req.session.user,
        error: 'รหัสผ่านปัจจุบันไม่ถูกต้อง',
        activeTab: 'password'
      });
    }
    
    // เข้ารหัสและบันทึกรหัสผ่านใหม่
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    
    return res.render('admin/settings', {
      title: 'ตั้งค่าระบบ',
      user: req.session.user,
      success: 'เปลี่ยนรหัสผ่านสำเร็จ',
      activeTab: 'password'
    });
  } catch (err) {
    console.error(err);
    res.render('admin/settings', {
      title: 'ตั้งค่าระบบ',
      user: req.session.user,
      error: 'เกิดข้อผิดพลาดในเซิร์ฟเวอร์',
      activeTab: 'password'
    });
  }
});
router.post('/settings/update-website', isAdmin, async (req, res) => {
  try {
    const { linkvertiseId, workinkId, checkpoint1Api, checkpoint2Api, checkpoint3Api } = req.body;
    
    // หาหรือสร้างการตั้งค่า
    let settings = await WebsiteSettings.findOne();
    
    if (!settings) {
      settings = new WebsiteSettings({
        linkvertiseId,
        workinkId,
        checkpoint1Api,
        checkpoint2Api,
        checkpoint3Api
      });
    } else {
      settings.linkvertiseId = linkvertiseId;
      settings.workinkId = workinkId;
      settings.checkpoint1Api = checkpoint1Api;
      settings.checkpoint2Api = checkpoint2Api;
      settings.checkpoint3Api = checkpoint3Api;
    }
    
    await settings.save();
    
    return res.render('admin/settings', {
      title: 'ตั้งค่าระบบ',
      user: req.session.user,
      settings,
      success: 'บันทึกการตั้งค่าเรียบร้อยแล้ว',
      activeTab: 'website'
    });
  } catch (err) {
    console.error(err);
    res.render('admin/settings', {
      title: 'ตั้งค่าระบบ',
      user: req.session.user,
      error: 'เกิดข้อผิดพลาดในเซิร์ฟเวอร์',
      activeTab: 'website'
    });
  }
});

// แก้ไขเส้นทาง settings เพื่อดึงข้อมูลการตั้งค่า
router.get('/settings', isAdmin, async (req, res) => {
  try {
    const advancedSettings = await AdvancedWebsiteSettings.findOne();
    
    res.render('admin/settings', { 
      title: 'ตั้งค่าระบบ',
      user: req.session.user,
      settings: advancedSettings
    });
  } catch (err) {
    console.error(err);
    res.render('admin/settings', { 
      title: 'ตั้งค่าระบบ',
      user: req.session.user,
      error: 'เกิดข้อผิดพลาดในการดึงข้อมูลการตั้งค่า'
    });
  }
});
module.exports = router;