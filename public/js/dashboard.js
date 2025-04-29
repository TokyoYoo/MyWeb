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