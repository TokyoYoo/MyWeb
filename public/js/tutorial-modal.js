document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS animation library
    if (typeof AOS !== 'undefined') {
      AOS.init();
    }
    
    // Modal Tutorial Controls
    const tutorialModal = document.getElementById('tutorialModal');
    const openTutorialBtn = document.getElementById('openTutorial');
    const countdownElement = document.getElementById('countdown');
    const understoodButton = document.getElementById('understoodButton');
    
    // ตรวจสอบว่ามี element ที่ต้องการหรือไม่
    if (!tutorialModal || !openTutorialBtn || !countdownElement || !understoodButton) {
      return; // ออกจากฟังก์ชันถ้าไม่พบ element
    }
    
    // นับถอยหลัง 5 วินาที และปลดล็อกปุ่ม
    let timeLeft = 5;
    
    function startCountdown() {
      understoodButton.classList.remove('active');
      understoodButton.disabled = true;
      
      const timer = setInterval(function() {
        timeLeft--;
        countdownElement.textContent = timeLeft;
        
        if (timeLeft <= 0) {
          clearInterval(timer);
          // ปลดล็อกปุ่ม
          understoodButton.classList.add('active');
          understoodButton.disabled = false;
        }
      }, 1000);
    }
    
    // ปุ่ม "ฉันเข้าใจแล้ว" 
    understoodButton.addEventListener('click', function() {
      if (this.classList.contains('active')) {
        tutorialModal.style.display = 'none';
      }
    });
    
    openTutorialBtn.addEventListener('click', function() {
      tutorialModal.style.display = 'flex';
      timeLeft = 5;
      countdownElement.textContent = timeLeft;
      startCountdown();
    });
    
    // แสดง Modal อัตโนมัติหลังจากโหลดหน้าเว็บ 1.5 วินาที
    setTimeout(function() {
      tutorialModal.style.display = 'flex';
      startCountdown();
    }, 1500);
  });