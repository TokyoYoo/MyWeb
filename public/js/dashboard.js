// dashboard.js - Script for the admin dashboard

document.addEventListener('DOMContentLoaded', function() {
    // Get data passed from the EJS template
    const dashboardData = window.dashboardData || {};
    const mods = dashboardData.mods || [];
    const totalClicks = dashboardData.totalClicks || 0;
    const totalDownloads = dashboardData.totalDownloads || 0;
    
    // Initialize charts if elements exist
    initializeCharts(mods, totalClicks, totalDownloads);
    
    // Add event listeners for interactive elements
    setupEventListeners();
  });
  
  /**
   * Initialize all charts on the dashboard
   * @param {Array} mods - Array of mod objects
   * @param {Number} totalClicks - Total number of clicks
   * @param {Number} totalDownloads - Total number of completed clicks (downloads)
   */
  function initializeCharts(mods, totalClicks, totalDownloads) {
    // Usage Chart (Clicks vs Downloads)
    const usageChartElement = document.getElementById('usageChart');
    if (usageChartElement) {
      const usageCtx = usageChartElement.getContext('2d');
      const usageChart = new Chart(usageCtx, {
        type: 'bar',
        data: {
          labels: ['Click', 'Download'],
          datasets: [{
            label: 'Value',
            data: [totalClicks, totalDownloads],
            backgroundColor: [
              'rgba(54, 162, 235, 0.7)',
              'rgba(75, 192, 192, 0.7)'
            ],
            borderColor: [
              'rgba(54, 162, 235, 1)',
              'rgba(75, 192, 192, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          animation: {
            duration: 1500,
            easing: 'easeOutQuart'
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              padding: 10,
              cornerRadius: 6
            }
          }
        }
      });
    }
  
    // Top Mods Chart
    const topModsChartElement = document.getElementById('topModsChart');
    if (topModsChartElement && mods.length > 0) {
      // Sort mods by download count and take top 5
      const topMods = [...mods].sort((a, b) => b.completedClicks - a.completedClicks).slice(0, 5);
      
      const topModsCtx = topModsChartElement.getContext('2d');
      const topModsChart = new Chart(topModsCtx, {
        type: 'doughnut',
        data: {
          labels: topMods.map(mod => mod.name),
          datasets: [{
            label: 'Download',
            data: topMods.map(mod => mod.completedClicks),
            backgroundColor: [
              'rgba(255, 99, 132, 0.7)',
              'rgba(54, 162, 235, 0.7)',
              'rgba(255, 206, 86, 0.7)',
              'rgba(75, 192, 192, 0.7)',
              'rgba(153, 102, 255, 0.7)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          animation: {
            animateRotate: true,
            animateScale: true,
            duration: 1500
          },
          cutout: '65%',
          plugins: {
            legend: {
              position: 'right',
              labels: {
                padding: 15,
                usePointStyle: true,
                pointStyle: 'circle'
              }
            },
            title: {
              display: true,
              text: 'Popular Scripts (Download)',
              font: {
                size: 16
              },
              padding: {
                bottom: 20
              }
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              padding: 10,
              cornerRadius: 6,
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.raw || 0;
                  const percentage = Math.round((value / totalDownloads) * 100);
                  return `${label}: ${value} downloads (${percentage}%)`;
                }
              }
            }
          }
        }
      });
    }
    
    // You can add more charts here as needed
    // For example, a line chart showing clicks/downloads over time
  }
  
  /**
   * Set up event listeners for interactive elements
   */
  function setupEventListeners() {
    // Example: Confirmation for delete buttons
    const deleteButtons = document.querySelectorAll('.btn-danger');
    deleteButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        if (!confirm('Are you sure you want to delete this script?')) {
          e.preventDefault();
        }
      });
    });
    
    // Example: Toggle mobile menu (if you have one)
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
      menuToggle.addEventListener('click', function() {
        document.querySelector('.dashboard-sidebar').classList.toggle('active');
      });
    }
    
    // Add more event listeners as needed
  }
  
  /**
   * Helper function to format numbers with commas
   * @param {Number} num - The number to format
   * @return {String} - Formatted number
   */
  function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  
  /**
   * Helper function to calculate percentage
   * @param {Number} part - The partial value
   * @param {Number} total - The total value
   * @return {String} - Formatted percentage with one decimal place
   */
  function calculatePercentage(part, total) {
    if (total === 0) return '0.0';
    return ((part / total) * 100).toFixed(1);
  }