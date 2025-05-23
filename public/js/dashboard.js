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
            text: 'สคริปต์ยอดนิยม (ดาวน์โหลด)',
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
                return `${label}: ${value} ดาวน์โหลด (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  }
  
  // Country Distribution Chart
  const countryChartElement = document.getElementById('countryChart');
  if (countryChartElement && mods.length > 0) {
    // Combine country stats from all mods
    const countryData = {};
    
    mods.forEach(mod => {
      if (mod.countryStats && mod.countryStats.length > 0) {
        mod.countryStats.forEach(stat => {
          if (countryData[stat.country]) {
            countryData[stat.country] += stat.count;
          } else {
            countryData[stat.country] = stat.count;
          }
        });
      }
    });
    
    // Convert to arrays for Chart.js
    const countries = Object.keys(countryData);
    const counts = Object.values(countryData);
    
    // Get top 10 countries by click count
    const top10Countries = countries
      .map((country, index) => ({ country, count: counts[index] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    const countryCtx = countryChartElement.getContext('2d');
    const countryChart = new Chart(countryCtx, {
      type: 'pie',
      data: {
        labels: top10Countries.map(item => item.country),
        datasets: [{
          data: top10Countries.map(item => item.count),
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(255, 159, 64, 0.7)',
            'rgba(201, 203, 207, 0.7)',
            'rgba(255, 99, 255, 0.7)',
            'rgba(54, 235, 162, 0.7)',
            'rgba(255, 255, 86, 0.7)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(201, 203, 207, 1)',
            'rgba(255, 99, 255, 1)',
            'rgba(54, 235, 162, 1)',
            'rgba(255, 255, 86, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        animation: {
          animateRotate: true,
          duration: 1500
        },
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
            text: 'การกระจายตัวตามประเทศ (10 อันดับแรก)',
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
                const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${value} คลิก (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  }
  
  // Funnel Chart for Checkpoints
  const funnelChartElement = document.getElementById('funnelChart');
  if (funnelChartElement && mods.length > 0) {
    // Calculate total numbers for each checkpoint
    const totalClick = mods.reduce((sum, mod) => sum + mod.clicks, 0);
    const checkpoint1 = mods.reduce((sum, mod) => sum + mod.checkpoint1Count, 0);
    const checkpoint2 = mods.reduce((sum, mod) => sum + mod.checkpoint2Count, 0);
    const checkpoint3 = mods.reduce((sum, mod) => sum + mod.checkpoint3Count, 0);
    const completed = mods.reduce((sum, mod) => sum + mod.completedClicks, 0);
    
    const funnelCtx = funnelChartElement.getContext('2d');
    const funnelChart = new Chart(funnelCtx, {
      type: 'bar',
      data: {
        labels: ['คลิกครั้งแรก', 'Checkpoint 1', 'Checkpoint 2', 'Checkpoint 3', 'ดาวน์โหลดสำเร็จ'],
        datasets: [{
          axis: 'y',
          label: 'จำนวนผู้ใช้',
          data: [totalClick, checkpoint1, checkpoint2, checkpoint3, completed],
          backgroundColor: [
            'rgba(54, 162, 235, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(255, 159, 64, 0.7)',
            'rgba(75, 192, 75, 0.7)'
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(75, 192, 75, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        animation: {
          duration: 1500
        },
        scales: {
          x: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          y: {
            grid: {
              display: false
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'ความคงอยู่ของผู้ใช้ตาม Checkpoint',
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
                const value = context.raw || 0;
                const percentage = totalClick > 0 ? Math.round((value / totalClick) * 100) : 0;
                return `${value} ผู้ใช้ (${percentage}% จากคลิกทั้งหมด)`;
              },
              afterBody: function(context) {
                if (context.length > 1) {
                  const current = context[0].raw;
                  const previous = context[0].dataIndex > 0 ? 
                    context[0].dataset.data[context[0].dataIndex - 1] : current;
                  
                  if (previous > 0 && context[0].dataIndex > 0) {
                    const dropRate = Math.round((1 - (current / previous)) * 100);
                    return `อัตราการหายไป: ${dropRate}% จาก step ก่อนหน้า`;
                  }
                }
                return '';
              }
            }
          }
        }
      }
    });
  }
  
  // Average Time Between Checkpoints
  const timeChartElement = document.getElementById('timeChart');
  if (timeChartElement && mods.length > 0) {
    // Calculate average time between checkpoints
    let totalTime1to2 = 0;
    let totalTime2to3 = 0;
    let totalTime3toDownload = 0;
    let count1to2 = 0;
    let count2to3 = 0;
    let count3toDownload = 0;
    
    mods.forEach(mod => {
      if (mod.checkpointStats && mod.checkpointStats.length > 0) {
        mod.checkpointStats.forEach(stat => {
          // Calculate time differences in minutes if both timestamps exist
          if (stat.checkpoint1Time && stat.checkpoint2Time) {
            const time1 = new Date(stat.checkpoint1Time);
            const time2 = new Date(stat.checkpoint2Time);
            const diffMinutes = (time2 - time1) / (1000 * 60);
            
            // Filter out unreasonable values (e.g., negative or extremely long times)
            if (diffMinutes >= 0 && diffMinutes < 60) {
              totalTime1to2 += diffMinutes;
              count1to2++;
            }
          }
          
          if (stat.checkpoint2Time && stat.checkpoint3Time) {
            const time2 = new Date(stat.checkpoint2Time);
            const time3 = new Date(stat.checkpoint3Time);
            const diffMinutes = (time3 - time2) / (1000 * 60);
            
            if (diffMinutes >= 0 && diffMinutes < 60) {
              totalTime2to3 += diffMinutes;
              count2to3++;
            }
          }
          
          if (stat.checkpoint3Time && stat.downloadTime) {
            const time3 = new Date(stat.checkpoint3Time);
            const timeDownload = new Date(stat.downloadTime);
            const diffMinutes = (timeDownload - time3) / (1000 * 60);
            
            if (diffMinutes >= 0 && diffMinutes < 60) {
              totalTime3toDownload += diffMinutes;
              count3toDownload++;
            }
          }
        });
      }
    });
    
    // Calculate averages
    const avgTime1to2 = count1to2 > 0 ? (totalTime1to2 / count1to2).toFixed(2) : 0;
    const avgTime2to3 = count2to3 > 0 ? (totalTime2to3 / count2to3).toFixed(2) : 0;
    const avgTime3toDownload = count3toDownload > 0 ? (totalTime3toDownload / count3toDownload).toFixed(2) : 0;
    
    const timeCtx = timeChartElement.getContext('2d');
    const timeChart = new Chart(timeCtx, {
      type: 'bar',
      data: {
        labels: ['Checkpoint 1 → 2', 'Checkpoint 2 → 3', 'Checkpoint 3 → ดาวน์โหลด'],
        datasets: [{
          label: 'เวลาเฉลี่ย (นาที)',
          data: [avgTime1to2, avgTime2to3, avgTime3toDownload],
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        animation: {
          duration: 1500
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'เวลาเฉลี่ย (นาที)'
            },
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
          title: {
            display: true,
            text: 'เวลาเฉลี่ยระหว่าง Checkpoint',
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
                const value = context.raw || 0;
                return `เวลาเฉลี่ย: ${value} นาที`;
              },
              afterBody: function(context) {
                if (context.length > 0) {
                  const index = context[0].dataIndex;
                  const counts = [count1to2, count2to3, count3toDownload];
                  return `จำนวนข้อมูล: ${counts[index]} คน`;
                }
                return '';
              }
            }
          }
        }
      }
    });
  }
}

/**
 * Set up event listeners for interactive elements
 */
function setupEventListeners() {
  // Example: Confirmation for delete buttons
  const deleteButtons = document.querySelectorAll('.btn-danger');
  deleteButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      if (!confirm('คุณแน่ใจหรือไม่ที่จะลบสคริปต์นี้?')) {
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
  
  // Add tab switching functionality
  const tabButtons = document.querySelectorAll('.tab-button');
  if (tabButtons.length > 0) {
    tabButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Remove active class from all buttons
        tabButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        this.classList.add('active');
        
        // Hide all tab content
        document.querySelectorAll('.tab-content').forEach(content => {
          content.classList.remove('active');
        });
        
        // Show the target content
        const targetId = this.getAttribute('data-target');
        document.getElementById(targetId).classList.add('active');
      });
    });
  }
  
  // Date range picker
  const dateRange = document.getElementById('dateRange');
  if (dateRange) {
    dateRange.addEventListener('change', function() {
      // Handle date range change (would need to implement)
      console.log('Date range changed:', this.value);
      // Would typically refresh data based on selected date range
    });
  }
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

/**
 * Helper function to get country name from country code
 * @param {String} code - The country code (e.g., 'TH', 'US')
 * @return {String} - Country name
 */
function getCountryName(code) {
  const countries = {
    'TH': 'ไทย',
    'US': 'สหรัฐอเมริกา',
    'JP': 'ญี่ปุ่น',
    'SG': 'สิงคโปร์',
    'MY': 'มาเลเซีย',
    'ID': 'อินโดนีเซีย',
    'VN': 'เวียดนาม',
    'KR': 'เกาหลีใต้',
    'CN': 'จีน',
    // Add more countries as needed
  };
  
  return countries[code] || code;
}
// public/js/dashboard.js

document.addEventListener('DOMContentLoaded', function() {
  // Set up tab navigation
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons and contents
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Add active class to clicked button and corresponding content
      button.classList.add('active');
      const targetId = button.dataset.target;
      document.getElementById(targetId).classList.add('active');
    });
  });
  
  // Create charts from dashboard data
  createUsageChart();
  createTopModsChart();
  createFunnelChart();
  
  // Initialize date filter functionality
  initDateFilter();
  
  // Add animations and interactive elements
  addInteractiveFeatures();
});

// Chart for usage statistics
function createUsageChart() {
  // Generate last 7 days for labels
  const dates = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
  }
  
  // Generate random data for demonstration
  const clickData = dates.map(() => Math.floor(Math.random() * 100) + 10);
  const downloadData = clickData.map(value => Math.floor(value * (0.4 + Math.random() * 0.3)));
  
  const ctx = document.getElementById('usageChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: dates,
      datasets: [
        {
          label: 'Clicks',
          data: clickData,
          fill: true,
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          borderColor: 'rgba(99, 102, 241, 1)',
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#fff',
          pointBorderColor: 'rgba(99, 102, 241, 1)',
          pointBorderWidth: 2
        },
        {
          label: 'Downloads',
          data: downloadData,
          fill: true,
          backgroundColor: 'rgba(14, 165, 233, 0.1)',
          borderColor: 'rgba(14, 165, 233, 1)',
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#fff',
          pointBorderColor: 'rgba(14, 165, 233, 1)',
          pointBorderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            boxWidth: 12,
            padding: 15
          }
        },
        tooltip: {
          backgroundColor: 'rgba(17, 24, 39, 0.8)',
          padding: 12,
          titleFont: {
            size: 13
          },
          bodyFont: {
            size: 12
          },
          displayColors: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            drawBorder: false
          },
          ticks: {
            font: {
              size: 11
            }
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            font: {
              size: 11
            }
          }
        }
      }
    }
  });
}

// Chart for top scripts
function createTopModsChart() {
  const { mods } = window.dashboardData;
  
  // Sort mods by clicks and get top 5
  const topMods = [...mods]
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 5);
  
  const ctx = document.getElementById('topModsChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: topMods.map(mod => mod.name),
      datasets: [
        {
          label: 'Clicks',
          data: topMods.map(mod => mod.clicks),
          backgroundColor: 'rgba(99, 102, 241, 0.8)',
          borderRadius: 4
        },
        {
          label: 'Downloads',
          data: topMods.map(mod => mod.completedClicks),
          backgroundColor: 'rgba(14, 165, 233, 0.8)',
          borderRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            boxWidth: 12,
            padding: 15
          }
        },
        tooltip: {
          backgroundColor: 'rgba(17, 24, 39, 0.8)',
          padding: 12
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            drawBorder: false
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            font: {
              size: 10
            }
          }
        }
      },
      barPercentage: 0.6,
      categoryPercentage: 0.7
    }
  });
}

// Chart for funnel analysis
function createFunnelChart() {
  const { mods } = window.dashboardData;
  
  // Calculate aggregate checkpoint data
  const totalClicks = mods.reduce((sum, mod) => sum + mod.clicks, 0);
  const totalCP1 = mods.reduce((sum, mod) => sum + (mod.checkpoint1Count || 0), 0);
  const totalCP2 = mods.reduce((sum, mod) => sum + (mod.checkpoint2Count || 0), 0);
  const totalCP3 = mods.reduce((sum, mod) => sum + (mod.checkpoint3Count || 0), 0);
  const totalCompleted = mods.reduce((sum, mod) => sum + mod.completedClicks, 0);
  
  const ctx = document.getElementById('funnelChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Initial Clicks', 'Checkpoint 1', 'Checkpoint 2', 'Checkpoint 3', 'Downloads'],
      datasets: [{
        axis: 'y',
        data: [totalClicks, totalCP1, totalCP2, totalCP3, totalCompleted],
        fill: false,
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',  // Initial - Primary
          'rgba(14, 165, 233, 0.8)',  // CP1 - Secondary
          'rgba(16, 185, 129, 0.8)',  // CP2 - Success
          'rgba(245, 158, 11, 0.8)',  // CP3 - Warning
          'rgba(139, 92, 246, 0.8)'   // Downloads - Purple
        ],
        borderWidth: 0,
        borderRadius: 6
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(17, 24, 39, 0.8)',
          callbacks: {
            afterLabel: function(context) {
              const index = context.dataIndex;
              const value = context.raw;
              const prevValue = index > 0 ? context.dataset.data[index - 1] : value;
              const percentage = prevValue !== 0 ? Math.round((value / prevValue) * 100) : 0;
              const dropoff = 100 - percentage;
              
              if (index === 0) return '';
              return `Conversion: ${percentage}% | Drop-off: ${dropoff}%`;
            }
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          grid: {
            drawBorder: false
          }
        },
        y: {
          grid: {
            display: false
          }
        }
      }
    }
  });
}

// Initialize date filter functionality
function initDateFilter() {
  const dateFilter = document.getElementById('dateRange');
  if (dateFilter) {
    // Set default date to today
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    dateFilter.value = `${year}-${month}-${day}`;
    
    // Add event listener for date change
    dateFilter.addEventListener('change', function() {
      // In a real application, this would filter the data based on the selected date
      // For now, we'll just show a notification
      showNotification('Data filtered for ' + new Date(this.value).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }));
    });
  }
}

// Add animations and interactive features
function addInteractiveFeatures() {
  // Add hover effects to table rows
  const tableRows = document.querySelectorAll('.mods-table tbody tr');
  tableRows.forEach(row => {
    row.addEventListener('mouseenter', () => {
      row.style.transition = 'background-color 0.2s';
    });
  });
  
  // Add smooth scroll for navigation links
  const navLinks = document.querySelectorAll('.sidebar-nav a');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // Prevent default only for in-page links
      const href = this.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        document.querySelector(href).scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
}

// Show notification function
function showNotification(message) {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  notification.style.position = 'fixed';
  notification.style.bottom = '20px';
  notification.style.right = '20px';
  notification.style.backgroundColor = '#4f46e5';
  notification.style.color = 'white';
  notification.style.padding = '12px 20px';
  notification.style.borderRadius = '8px';
  notification.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
  notification.style.zIndex = '1000';
  notification.style.opacity = '0';
  notification.style.transform = 'translateY(20px)';
  notification.style.transition = 'opacity 0.3s, transform 0.3s';
  
  document.body.appendChild(notification);
  
  // Show notification
  setTimeout(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateY(0)';
  }, 10);
  
  // Hide notification after 3 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(20px)';
    
    // Remove from DOM after animation
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}