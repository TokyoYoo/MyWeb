// routes/mod.js
const express = require('express');
const router = express.Router();
const Mod = require('../models/Mod');
const Settings = require('../models/Settings');

// Helper function to get settings for a specific user
async function getSettings(userId) {
  try {
    let settings = await Settings.findOne({ userId });
    
    if (!settings) {
      // สร้างการตั้งค่าเริ่มต้นถ้ายังไม่มี
      settings = await Settings.create({ 
        userId,
        linkvertiseId: '572754',
        workinkUrl: 'https://work.ink/1Zga/m9rbrvua',
        defaultCheckpoint1: 'linkvertise',
        defaultCheckpoint2: 'none',
        defaultCheckpoint3: 'none'
      });
    }
    
    return settings;
  } catch (err) {
    console.error('Error getting settings:', err);
    return null;
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
    
    // ดึงการตั้งค่าโฆษณา
    const settings = await getSettings(mod.createdBy);
    const adProvider = mod.adConfig?.checkpoint1?.provider || settings?.defaultCheckpoint1 || 'linkvertise';
    
    res.render('checkpoint', { 
      title: mod.name,
      mod,
      checkpoint: 1,
      nextUrl: `/mod/${mod.shortId}/checkpoint/2`,
      adProvider,
      linkvertiseId: settings?.linkvertiseId || '572754',
      workinkUrl: settings?.workinkUrl || 'https://work.ink/1Zga/m9rbrvua'
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Checkpoint 2
router.get('/:shortId/checkpoint/2', async (req, res) => {
  try {
    const mod = await Mod.findOne({ shortId: req.params.shortId });
    
    if (!mod) {
      return res.status(404).render('404', { title: 'Mod Not Found' });
    }
    
    // ดึงการตั้งค่าโฆษณา
    const settings = await getSettings(mod.createdBy);
    const adProvider = mod.adConfig?.checkpoint2?.provider || settings?.defaultCheckpoint2 || 'none';
    
    res.render('checkpoint', { 
      title: mod.name,
      mod,
      checkpoint: 2,
      nextUrl: `/mod/${mod.shortId}/checkpoint/3`,
      adProvider,
      linkvertiseId: settings?.linkvertiseId || '572754',
      workinkUrl: settings?.workinkUrl || 'https://work.ink/1Zga/m9rbrvua'
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Checkpoint 3
router.get('/:shortId/checkpoint/3', async (req, res) => {
  try {
    const mod = await Mod.findOne({ shortId: req.params.shortId });
    
    if (!mod) {
      return res.status(404).render('404', { title: 'Mod Not Found' });
    }
    
    // ดึงการตั้งค่าโฆษณา
    const settings = await getSettings(mod.createdBy);
    const adProvider = mod.adConfig?.checkpoint3?.provider || settings?.defaultCheckpoint3 || 'none';
    
    res.render('checkpoint', { 
      title: mod.name,
      mod,
      checkpoint: 3,
      nextUrl: `/mod/${mod.shortId}/download`,
      adProvider,
      linkvertiseId: settings?.linkvertiseId || '572754',
      workinkUrl: settings?.workinkUrl || 'https://work.ink/1Zga/m9rbrvua'
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Final download page
router.get('/:shortId/download', async (req, res) => {
  try {
    const mod = await Mod.findOne({ shortId: req.params.shortId });
    
    if (!mod) {
      return res.status(404).render('404', { title: 'Mod Not Found' });
    }
    
    // Increment completed clicks counter
    await Mod.findByIdAndUpdate(mod._id, { $inc: { completedClicks: 1 } });
    
    // Redirect to original link
    res.redirect(mod.originalLink);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;