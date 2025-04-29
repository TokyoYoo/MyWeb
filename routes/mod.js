// routes/mod.js
const express = require('express');
const router = express.Router();
const Mod = require('../models/Mod');
const AdvancedWebsiteSettings = require('../models/AdvancedWebsiteSettings');
const { v4: uuidv4 } = require('uuid'); // ติดตั้ง uuid ด้วย npm install uuid

// ฟังก์ชั่นสำหรับดึงประเทศของผู้ใช้จาก IP (แนะนำให้ใช้ geoip-lite)
const getCountryFromIP = (req) => {
  try {
    // ถ้าใช้ geoip-lite สามารถดึงตามนี้:
    // const geoip = require('geoip-lite');
    // const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    // const geo = geoip.lookup(ip);
    // return geo ? geo.country : 'Unknown';
    
    // เวอร์ชั่นง่ายๆ สำหรับทดสอบ (ให้เปลี่ยนเป็นการทำงานจริงในภายหลัง)
    const countries = ['TH', 'US', 'JP', 'SG', 'MY', 'ID', 'VN', 'KR', 'CN'];
    return countries[Math.floor(Math.random() * countries.length)];
  } catch (err) {
    console.error('Error getting country:', err);
    return 'Unknown';
  }
};

// Display mod page with checkpoint 1
router.get('/:shortId', async (req, res) => {
  try {
    const mod = await Mod.findOne({ shortId: req.params.shortId });
    const settings = await AdvancedWebsiteSettings.findOne();
    
    if (!mod) {
      return res.status(404).render('404', { title: 'Mod Not Found' });
    }
    
    // สร้าง ID สำหรับติดตามผู้ใช้
    const userId = uuidv4();
    
    // ข้อมูลประเทศ
    const country = getCountryFromIP(req);
    
    // เพิ่มการนับตามประเทศ
    let countryExist = false;
    for (let i = 0; i < mod.countryStats.length; i++) {
      if (mod.countryStats[i].country === country) {
        mod.countryStats[i].count += 1;
        countryExist = true;
        break;
      }
    }
    
    if (!countryExist) {
      mod.countryStats.push({ country, count: 1 });
    }
    
    // เพิ่มข้อมูลผู้ใช้ใหม่
    mod.checkpointStats.push({
      userId,
      country,
      checkpoint1Time: new Date(),
      userAgent: req.headers['user-agent']
    });
    
    // เพิ่มจำนวนคลิกและจำนวน checkpoint 1
    mod.clicks += 1;
    mod.checkpoint1Count += 1;
    
    await mod.save();
    
    // ตั้งค่า session สำหรับติดตามผู้ใช้
    req.session.userId = userId;
    
    res.render('checkpoint', { 
      title: mod.name,
      mod,
      checkpoint: 1,
      nextUrl: `/mod/${mod.shortId}/checkpoint/2`,
      apiType: settings ? settings.checkpoint1Api : 'linkvertise',
      linkvertiseId: settings ? settings.linkvertiseId1 : '572754',
      workinkId: settings ? settings.workinkId1 : '1Zh1/m9skr9gt'
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
    const settings = await AdvancedWebsiteSettings.findOne();
    
    if (!mod) {
      return res.status(404).render('404', { title: 'Mod Not Found' });
    }
    
    // เพิ่มจำนวน checkpoint 2
    mod.checkpoint2Count += 1;
    
    // อัปเดตเวลาสำหรับผู้ใช้นี้
    const userId = req.session.userId;
    if (userId) {
      for (let i = 0; i < mod.checkpointStats.length; i++) {
        if (mod.checkpointStats[i].userId === userId) {
          mod.checkpointStats[i].checkpoint2Time = new Date();
          break;
        }
      }
    }
    
    await mod.save();
    
    res.render('checkpoint', { 
      title: mod.name,
      mod,
      checkpoint: 2,
      nextUrl: `/mod/${mod.shortId}/checkpoint/3`,
      apiType: settings ? settings.checkpoint2Api : 'linkvertise',
      linkvertiseId: settings ? settings.linkvertiseId2 : '572754',
      workinkId: settings ? settings.workinkId2 : '1Zh1/m9skr9gt'
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
    const settings = await AdvancedWebsiteSettings.findOne();
    
    if (!mod) {
      return res.status(404).render('404', { title: 'Mod Not Found' });
    }
    
    // เพิ่มจำนวน checkpoint 3
    mod.checkpoint3Count += 1;
    
    // อัปเดตเวลาสำหรับผู้ใช้นี้
    const userId = req.session.userId;
    if (userId) {
      for (let i = 0; i < mod.checkpointStats.length; i++) {
        if (mod.checkpointStats[i].userId === userId) {
          mod.checkpointStats[i].checkpoint3Time = new Date();
          break;
        }
      }
    }
    
    await mod.save();
    
    res.render('checkpoint', { 
      title: mod.name,
      mod,
      checkpoint: 3,
      nextUrl: `/mod/${mod.shortId}/download`,
      apiType: settings ? settings.checkpoint3Api : 'none',
      linkvertiseId: settings ? settings.linkvertiseId3 : '572754',
      workinkId: settings ? settings.workinkId3 : '1Zh1/m9skr9gt'
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
    
    // เพิ่มจำนวนการดาวน์โหลด
    mod.completedClicks += 1;
    
    // อัปเดตเวลาสำหรับผู้ใช้นี้
    const userId = req.session.userId;
    if (userId) {
      for (let i = 0; i < mod.checkpointStats.length; i++) {
        if (mod.checkpointStats[i].userId === userId) {
          mod.checkpointStats[i].downloadTime = new Date();
          mod.checkpointStats[i].completed = true;
          break;
        }
      }
    }
    
    await mod.save();
    
    // Redirect to original link
    res.redirect(mod.originalLink);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;