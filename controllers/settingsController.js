// controllers/settingsController.js
const Settings = require('../models/Settings');

// อัปเดตการตั้งค่าโฆษณา
exports.updateAdsSettings = async (req, res) => {
  try {
    const { 
      linkvertiseId, 
      workinkUrl, 
      defaultCheckpoint1, 
      defaultCheckpoint2, 
      defaultCheckpoint3 
    } = req.body;
    
    // ตรวจสอบว่ามีการตั้งค่าอยู่แล้วหรือไม่
    let settings = await Settings.findOne({ userId: req.user.id });
    
    if (settings) {
      // อัปเดตการตั้งค่าที่มีอยู่
      settings.linkvertiseId = linkvertiseId;
      settings.workinkUrl = workinkUrl;
      settings.defaultCheckpoint1 = defaultCheckpoint1;
      settings.defaultCheckpoint2 = defaultCheckpoint2;
      settings.defaultCheckpoint3 = defaultCheckpoint3;
      settings.updatedAt = Date.now();
      
      await settings.save();
    } else {
      // สร้างการตั้งค่าใหม่
      settings = await Settings.create({
        userId: req.user.id,
        linkvertiseId,
        workinkUrl,
        defaultCheckpoint1,
        defaultCheckpoint2,
        defaultCheckpoint3
      });
    }
    
    res.render('admin/settings', {
      title: 'ตั้งค่าระบบ',
      user: req.user,
      settings,
      activeTab: 'website',
      success: 'บันทึกการตั้งค่าเรียบร้อยแล้ว'
    });
    
  } catch (err) {
    console.error('Error updating settings:', err);
    res.render('admin/settings', {
      title: 'ตั้งค่าระบบ',
      user: req.user,
      activeTab: 'website',
      error: 'เกิดข้อผิดพลาดในการบันทึกการตั้งค่า กรุณาลองใหม่อีกครั้ง'
    });
  }
};

// แสดงหน้าตั้งค่า (อัปเดตเพื่อรองรับการแสดงการตั้งค่าโฆษณา)
exports.showSettings = async (req, res) => {
  try {
    // ดึงการตั้งค่าโฆษณา
    const settings = await Settings.findOne({ userId: req.user.id });
    
    res.render('admin/settings', {
      title: 'ตั้งค่าระบบ',
      user: req.user,
      settings,
      activeTab: req.query.tab || 'account'
    });
  } catch (err) {
    console.error('Error showing settings:', err);
    res.render('admin/settings', {
      title: 'ตั้งค่าระบบ',
      user: req.user,
      error: 'เกิดข้อผิดพลาดในการโหลดการตั้งค่า',
      activeTab: req.query.tab || 'account'
    });
  }
};