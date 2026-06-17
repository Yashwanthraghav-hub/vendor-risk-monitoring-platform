import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Theme helpers for Chart.js text colors in dark mode
const getChartTheme = () => {
  const isDark = document.documentElement.classList.contains('dark');
  return {
    gridColor: isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.05)',
    textColor: isDark ? '#94a3b8' : '#64748b',
  };
};

// 1. Performance Trend Line Chart
export function PerformanceTrendChart({ dataPoints, labels }) {
  const { gridColor, textColor } = getChartTheme();
  
  const data = {
    labels: labels || ['Eval 1', 'Eval 2', 'Eval 3'],
    datasets: [
      {
        label: 'Delivery Rate (%)',
        data: dataPoints.delivery || [95, 96, 98],
        borderColor: '#3c72ac',
        backgroundColor: 'rgba(60, 114, 172, 0.1)',
        tension: 0.35,
        fill: true,
      },
      {
        label: 'Quality Score',
        data: dataPoints.quality || [92, 94, 95],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.35,
        fill: true,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: textColor, font: { family: 'Outfit' } }
      },
      tooltip: {
        titleFont: { family: 'Outfit' },
        bodyFont: { family: 'Outfit' }
      }
    },
    scales: {
      x: {
        grid: { color: gridColor },
        ticks: { color: textColor, font: { family: 'Outfit' } }
      },
      y: {
        min: 0,
        max: 100,
        grid: { color: gridColor },
        ticks: { color: textColor, font: { family: 'Outfit' } }
      }
    }
  };

  return <div className="h-full min-h-[200px]"><Line data={data} options={options} /></div>;
}

// 2. Risk Distribution Doughnut Chart
export function RiskDistributionChart({ lowCount, medCount, highCount }) {
  const { textColor } = getChartTheme();

  const data = {
    labels: ['Low Risk', 'Medium Risk', 'High Risk'],
    datasets: [
      {
        data: [lowCount, medCount, highCount],
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
        borderWidth: 0,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: textColor, font: { family: 'Outfit' } }
      }
    },
    cutout: '65%'
  };

  return <div className="h-full min-h-[200px]"><Doughnut data={data} options={options} /></div>;
}

// 3. Compliance Status Doughnut Chart
export function ComplianceStatusChart({ validCount, expiredCount, pendingCount }) {
  const { textColor } = getChartTheme();

  const data = {
    labels: ['Valid Documents', 'Expired Documents', 'Pending Renewal'],
    datasets: [
      {
        data: [validCount, expiredCount, pendingCount],
        backgroundColor: ['#10b981', '#ef4444', '#f59e0b'],
        borderWidth: 0,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: textColor, font: { family: 'Outfit' } }
      }
    },
    cutout: '65%'
  };

  return <div className="h-full min-h-[200px]"><Doughnut data={data} options={options} /></div>;
}

// 4. Monthly Delivery Delays Bar Chart
export function MonthlyDelaysChart({ values, labels }) {
  const { gridColor, textColor } = getChartTheme();

  const data = {
    labels: labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Incident Alerts Generated',
        data: values || [12, 19, 3, 5, 2, 3],
        backgroundColor: 'rgba(239, 68, 68, 0.85)',
        borderRadius: 6,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        titleFont: { family: 'Outfit' },
        bodyFont: { family: 'Outfit' }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: textColor, font: { family: 'Outfit' } }
      },
      y: {
        grid: { color: gridColor },
        ticks: { color: textColor, font: { family: 'Outfit' }, stepSize: 1 }
      }
    }
  };

  return <div className="h-full min-h-[200px]"><Bar data={data} options={options} /></div>;
}
