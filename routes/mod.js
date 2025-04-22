// routes/mod.js
const express = require('express');
const router = express.Router();
const Mod = require('../models/Mod');
const WebsiteSettings = require('../models/WebsiteSettings');

// Display mod page with checkpoint 1
router.get('/:shortId', async (req, res) => {
  try {
    const mod = await Mod.findOne({ shortId: req.params.shortId });
    const settings = await WebsiteSettings.findOne();
    
    if (!mod) {
      return res.status(404).render('404', { title: 'Mod Not Found' });
    }
    
    // Increment clicks counter
    await Mod.findByIdAndUpdate(mod._id, { $inc: { clicks: 1 } });
    
    res.render('checkpoint', { 
      title: mod.name,
      mod,
      checkpoint: 1,
      nextUrl: `/mod/${mod.shortId}/checkpoint/2`,
      apiType: settings ? settings.checkpoint1Api : 'linkvertise',
      linkvertiseId: settings ? settings.linkvertiseId : '572754',
      workinkId: settings ? settings.workinkId : '1Zga/m9rbrvua'
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
    const settings = await WebsiteSettings.findOne();
    
    if (!mod) {
      return res.status(404).render('404', { title: 'Mod Not Found' });
    }
    
    res.render('checkpoint', { 
      title: mod.name,
      mod,
      checkpoint: 2,
      nextUrl: `/mod/${mod.shortId}/checkpoint/3`,
      apiType: settings ? settings.checkpoint2Api : 'linkvertise',
      linkvertiseId: settings ? settings.linkvertiseId : '572754',
      workinkId: settings ? settings.workinkId : '1Zga/m9rbrvua'
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
    const settings = await WebsiteSettings.findOne();
    
    if (!mod) {
      return res.status(404).render('404', { title: 'Mod Not Found' });
    }
    
    res.render('checkpoint', { 
      title: mod.name,
      mod,
      checkpoint: 3,
      nextUrl: `/mod/${mod.shortId}/download`,
      apiType: settings ? settings.checkpoint3Api : 'none',
      linkvertiseId: settings ? settings.linkvertiseId : '572754',
      workinkId: settings ? settings.workinkId : '1Zga/m9rbrvua'
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