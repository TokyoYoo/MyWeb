// public/js/main.js
document.addEventListener('DOMContentLoaded', function() {
    // Copy link button functionality
    const copyButtons = document.querySelectorAll('.copy-link-btn');
    if (copyButtons) {
      copyButtons.forEach(button => {
        button.addEventListener('click', function() {
          const linkToCopy = this.dataset.link;
          
          // Create a temporary input element
          const tempInput = document.createElement('input');
          tempInput.value = linkToCopy;
          document.body.appendChild(tempInput);
          
          // Select and copy the text
          tempInput.select();
          document.execCommand('copy');
          
          // Remove the temporary element
          document.body.removeChild(tempInput);
          
          // Update button text temporarily
          const originalText = this.textContent;
          this.textContent = 'Copied!';
          
          // Reset button text after 2 seconds
          setTimeout(() => {
            this.textContent = originalText;
          }, 2000);
        });
      });
    }
    
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (menuToggle && mobileMenu) {
      menuToggle.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        this.classList.toggle('active');
      });
    }
  });