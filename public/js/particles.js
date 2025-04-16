// particles.js
document.addEventListener('DOMContentLoaded', function() {
    if (typeof AOS !== 'undefined') {
      AOS.init();
    }
    
    // Add some subtle background particle effects
    const container = document.querySelector('body');
    
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      
      // Random styling for each particle
      particle.style.position = 'absolute';
      particle.style.width = Math.random() * 10 + 'px';
      particle.style.height = particle.style.width;
      particle.style.background = 'rgba(255, 255, 255, ' + (Math.random() * 0.2) + ')';
      particle.style.borderRadius = '50%';
      particle.style.pointerEvents = 'none';
      
      // Random position
      particle.style.left = Math.random() * 100 + 'vw';
      particle.style.top = Math.random() * 100 + 'vh';
      
      // Add animation
      particle.style.animation = `float ${5 + Math.random() * 10}s linear infinite`;
      
      container.appendChild(particle);
    }
  });