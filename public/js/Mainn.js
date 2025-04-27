document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS Animation Library
    AOS.init();
    
    // Random download count
    const downloadElement = document.querySelector('.download-count');
    if (downloadElement) {
      const baseDownloadCount = 4295;
      
      // Random fluctuation every few seconds
      setInterval(() => {
        const randomVariation = Math.floor(Math.random() * 5);
        const newCount = baseDownloadCount + randomVariation;
        downloadElement.textContent = newCount.toLocaleString();
      }, 3000);
    }
    
    // Random active users
    const activeUsersElement = document.getElementById('activeUsers');
    if (activeUsersElement) {
      const baseActiveUsers = 138;
      
      setInterval(() => {
        // Random fluctuation between -2 and +2
        const randomVariation = Math.floor(Math.random() * 5) - 2;
        let newCount = baseActiveUsers + randomVariation;
        
        // Ensure count never goes below a certain threshold
        if (newCount < 120) newCount = 120;
        
        activeUsersElement.textContent = newCount;
      }, 5000);
    }
    
    // Track button clicks for analytics
    const ctaButton = document.getElementById('cta-button');
    if (ctaButton) {
      ctaButton.addEventListener('click', function(e) {
        // Log click event (you can replace with your analytics)
        console.log('CTA button clicked');
        
        // Add visual feedback on click
        this.classList.add('clicked');
        setTimeout(() => {
          this.classList.remove('clicked');
        }, 200);
      });
    }
    
    // Populate testimonials
    const testimonials = [
      { initials: 'MK', text: 'Works perfectly! Worth it!', time: '2m ago', rating: 5 },
      { initials: 'JD', text: 'Easy to use, no problems!', time: '5m ago', rating: 5 },
      { initials: 'TN', text: 'Best script ever, 100% working', time: '12m ago', rating: 5 },
      { initials: 'RS', text: 'Exactly what I needed', time: '18m ago', rating: 5 },
      { initials: 'AL', text: 'Super fast and reliable', time: '25m ago', rating: 5 },
      { initials: 'PK', text: 'Amazing service, got it instantly', time: '34m ago', rating: 5 },
      { initials: 'CV', text: 'Finally found a working one!', time: '41m ago', rating: 5 },
      { initials: 'WT', text: 'Just perfect, no issues at all', time: '1h ago', rating: 5 }
    ];
    
    const testimonialsContainer = document.getElementById('testimonials-container');
    if (testimonialsContainer) {
      // Show random 3 testimonials
      const shuffled = [...testimonials].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 3);
      
      selected.forEach(testimonial => {
        const testimonialElement = document.createElement('div');
        testimonialElement.className = 'testimonial';
        
        const stars = '★'.repeat(testimonial.rating) + '☆'.repeat(5 - testimonial.rating);
        
        testimonialElement.innerHTML = `
          <div class="testimonial-avatar">${testimonial.initials}</div>
          <div class="testimonial-content">
            <div class="testimonial-rating">${stars}</div>
            <div class="testimonial-text">${testimonial.text}</div>
          </div>
          <div class="testimonial-time">${testimonial.time}</div>
        `;
        
        testimonialsContainer.appendChild(testimonialElement);
      });
    }
    
    // Add "recently downloaded" notification
    function showRandomDownloadNotification() {
      // Names for random notifications
      const names = ['Alex', 'Sam', 'Taylor', 'Jordan', 'Casey', 'Riley', 'Avery', 'Morgan', 'Jamie', 'Quinn'];
      const randomName = names[Math.floor(Math.random() * names.length)];
      
      // Times for notification
      const times = ['just now', '1m ago', '2m ago', '5m ago'];
      const randomTime = times[Math.floor(Math.random() * times.length)];
      
      // Create notification element
      const notification = document.createElement('div');
      notification.className = 'download-notification';
      notification.innerHTML = `
        <div class="notification-icon">↓</div>
        <div class="notification-content">
          <div class="notification-text"><strong>${randomName}</strong> downloaded</div>
          <div class="notification-time">${randomTime}</div>
        </div>
      `;
      
      // Add to document
      document.body.appendChild(notification);
      
      // Show with animation
      setTimeout(() => {
        notification.classList.add('show');
      }, 100);
      
      // Remove after 4 seconds
      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
          notification.remove();
        }, 300);
      }, 4000);
    }
    
    // Show a download notification every 10-20 seconds
    function scheduleRandomNotification() {
      const randomDelay = 10000 + Math.floor(Math.random() * 10000); // 10-20 seconds
      setTimeout(() => {
        showRandomDownloadNotification();
        scheduleRandomNotification(); // Schedule next notification
      }, randomDelay);
    }
    
    // Start the notification sequence after 5 seconds
    setTimeout(scheduleRandomNotification, 5000);
    
    // Add style for download notification
    const style = document.createElement('style');
    style.textContent = `
      .download-notification {
        position: fixed;
        bottom: -100px;
        left: 20px;
        background: rgba(40, 20, 70, 0.9);
        backdrop-filter: blur(10px);
        border-radius: 12px;
        padding: 12px;
        display: flex;
        align-items: center;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
        transition: transform 0.3s ease;
        z-index: 100;
        border: 1px solid rgba(255, 255, 255, 0.1);
        max-width: 250px;
        transform: translateY(0);
      }
      
      .download-notification.show {
        transform: translateY(-120px);
      }
      
      .notification-icon {
        background: linear-gradient(135deg, #8a2be2, #ff69b4);
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 12px;
        color: white;
        font-weight: bold;
      }
      
      .notification-content {
        flex: 1;
      }
      
      .notification-text {
        font-size: 0.8rem;
        color: white;
      }
      
      .notification-time {
        font-size: 0.7rem;
        color: rgba(255, 255, 255, 0.6);
      }
      
      .clicked {
        transform: scale(0.95) !important;
        opacity: 0.9;
      }
    `;
    document.head.appendChild(style);
  });