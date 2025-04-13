// routes/index.js
const express = require('express');
const router = express.Router();
const Mod = require('../models/Mod');

// Home page
router.get('/', async (req, res) => {
  try {
    const recentMods = await Mod.find().sort({ createdAt: -1 }).limit(10);
    res.render('index', { 
      title: 'Apologize',
      recentMods
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;