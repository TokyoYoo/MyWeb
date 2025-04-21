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

// Checkpoint 3
router.get('/:shortId/checkpoint/3', async (req, res) => {
  try {
    const mod = await Mod.findOne({ shortId: req.params.shortId });
    
    if (!mod) {
      return res.status(404).render('404', { title: 'Script Not Found' });
    }
    
    // Retrieve Linkvertise ID from database
    const linkvertiseId = await getLinkvertiseId();
    
    res.render('checkpoint', { 
      title: mod.name,
      mod,
      checkpoint: 3,
      nextUrl: `/mod/${mod.shortId}/download`,
      linkvertiseId: linkvertiseId // Send ID to template
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error occurred');
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
    res.status(500).send('Server error occurred');
  }
});

module.exports = router;