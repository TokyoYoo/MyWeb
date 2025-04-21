// routes/mod.js
const express = require('express');
const router = express.Router();
const Mod = require('../models/Mod');
const mongoose = require('mongoose');
const LinkvertiseConfig = require('../models/LinkvertiseConfig');

// Helper function to retrieve Linkvertise ID
async function getLinkvertiseId() {
  try {
    const config = await LinkvertiseConfig.getSingleton();
    return config.linkvertiseId || '572754'; // Return default value if no value in database
  } catch (error) {
    console.error('Error retrieving Linkvertise ID:', error);
    return '572754'; // Return default value when there's an error
  }
}

// Display mod page with checkpoint 1
router.get('/:shortId', async (req, res) => {
  try {
    const mod = await Mod.findOne({ shortId: req.params.shortId });
    
    if (!mod) {
      return res.status(404).render('404', { title: 'Mod Not Found' });
    }
    
    // Increment clicks counter
    await Mod.findByIdAndUpdate(mod._id, { $inc: { clicks: 1 } });
    
    // Retrieve Linkvertise ID from database
    const linkvertiseId = await getLinkvertiseId();
    
    res.render('checkpoint', { 
      title: mod.name,
      mod,
      checkpoint: 1,
      nextUrl: `/mod/${mod.shortId}/checkpoint/2`,
      linkvertiseId: linkvertiseId // Send ID to template
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error occurred');
  }
});

// Checkpoint 2
router.get('/:shortId/checkpoint/2', async (req, res) => {
  try {
    const mod = await Mod.findOne({ shortId: req.params.shortId });
    
    if (!mod) {
      return res.status(404).render('404', { title: 'Mod Not Found' });
    }
    
    // Retrieve Linkvertise ID from database
    const linkvertiseId = await getLinkvertiseId();
    
    res.render('checkpoint', { 
      title: mod.name,
      mod,
      checkpoint: 2,
      nextUrl: `/mod/${mod.shortId}/checkpoint/3`,
      linkvertiseId: linkvertiseId // Send ID to template
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error occurred');
  }
});

// Checkpoint 3 - แก้ไขให้ nextUrl ไปที่หน้าเลือก script แทน
router.get('/:shortId/checkpoint/3', async (req, res) => {
  try {
    const mod = await Mod.findOne({ shortId: req.params.shortId });
    
    if (!mod) {
      return res.status(404).render('404', { title: 'Mod Not Found' });
    }
    
    // Retrieve Linkvertise ID from database
    const linkvertiseId = await getLinkvertiseId();
    
    res.render('checkpoint', { 
      title: mod.name,
      mod,
      checkpoint: 3,
      nextUrl: `/mod/${mod.shortId}/scripts`, // เปลี่ยนเป็นไปที่หน้าเลือก scripts
      linkvertiseId: linkvertiseId // Send ID to template
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error occurred');
  }
});

// หน้าเลือก Script เพื่อดาวน์โหลด (หน้าใหม่)
router.get('/:shortId/scripts', async (req, res) => {
  try {
    const mod = await Mod.findOne({ shortId: req.params.shortId });
    
    if (!mod) {
      return res.status(404).render('404', { title: 'Mod Not Found' });
    }
    
    // Render หน้า download ที่มีให้เลือก script
    res.render('download', { 
      title: `${mod.name} - Download`,
      mod
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error occurred');
  }
});

// ดาวน์โหลด Script ที่เลือก
router.get('/:shortId/download/:scriptIndex', async (req, res) => {
  try {
    const mod = await Mod.findOne({ shortId: req.params.shortId });
    
    if (!mod) {
      return res.status(404).render('404', { title: 'Mod Not Found' });
    }
    
    const scriptIndex = parseInt(req.params.scriptIndex);
    
    // ตรวจสอบว่ามี script ตามที่เลือกมาหรือไม่
    if (!mod.scripts || !mod.scripts[scriptIndex]) {
      return res.status(404).render('404', { title: 'Script Not Found' });
    }
    
    // ดึง link ของ script ที่เลือก
    const scriptLink = mod.scripts[scriptIndex].link;
    
    // Increment completed clicks counter
    await Mod.findByIdAndUpdate(mod._id, { $inc: { completedClicks: 1 } });
    
    // Redirect to original link
    res.redirect(scriptLink);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error occurred');
  }
});

module.exports = router;