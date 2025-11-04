// utils/exportHelpers.ts
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Extend jsPDF type to include lastAutoTable
declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable?: {
      finalY: number;
    };
  }
}

export interface AnalyticsData {
  trendData: Array<{ hour: number; total: number; safe: number; unsafe: number }>;
  speedData: Array<{ range: string; count: number; percentage: number }>;
  metrics: {
    totalDetections: number;
    systemAccuracy: number;
    avgClassificationTime: number;
    avgFeasibilityTime: number;
    avgSpeed: number;
    complianceRate: number;
  };
}

export function exportToCSV(data: AnalyticsData) {
  const today = new Date().toISOString().split('T')[0];
  
  // Create CSV content
  let csv = 'Overtaking System Analytics Report\n';
  csv += `Generated: ${new Date().toLocaleString()}\n\n`;
  
  // Metrics section
  csv += 'SYSTEM METRICS\n';
  csv += 'Metric,Value\n';
  csv += `Total Detections,${data.metrics.totalDetections}\n`;
  csv += `System Accuracy,${data.metrics.systemAccuracy.toFixed(2)}%\n`;
  csv += `Average Classification Time,${data.metrics.avgClassificationTime.toFixed(2)}ms\n`;
  csv += `Average Feasibility Time,${data.metrics.avgFeasibilityTime.toFixed(2)}ms\n`;
  csv += `Average Speed,${data.metrics.avgSpeed.toFixed(2)}\n`;
  csv += `Compliance Rate,${data.metrics.complianceRate.toFixed(2)}%\n\n`;
  
  // Hourly trend data
  csv += 'HOURLY DETECTION TRENDS\n';
  csv += 'Hour,Total Detections,Safe,Unsafe\n';
  data.trendData.forEach(row => {
    csv += `${row.hour}:00,${row.total},${row.safe},${row.unsafe}\n`;
  });
  csv += '\n';
  
  // Speed distribution
  csv += 'SPEED DISTRIBUTION\n';
  csv += 'Speed Range,Count,Percentage\n';
  data.speedData.forEach(row => {
    csv += `${row.range},${row.count},${row.percentage.toFixed(2)}%\n`;
  });
  
  // Create blob and download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `analytics_report_${today}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  console.log('✅ CSV exported successfully');
}

export function exportToPDF(data: AnalyticsData) {
  const today = new Date().toISOString().split('T')[0];
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(18);
  doc.text('Overtaking System Analytics Report', 14, 20);
  
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);
  
  // System Metrics Table
  doc.setFontSize(14);
  doc.text('System Metrics', 14, 40);
  
  autoTable(doc, {
    startY: 45,
    head: [['Metric', 'Value']],
    body: [
      ['Total Detections', data.metrics.totalDetections.toString()],
      ['System Accuracy', `${data.metrics.systemAccuracy.toFixed(2)}%`],
      ['Avg Classification Time', `${data.metrics.avgClassificationTime.toFixed(2)}ms`],
      ['Avg Feasibility Time', `${data.metrics.avgFeasibilityTime.toFixed(2)}ms`],
      ['Average Speed', data.metrics.avgSpeed.toFixed(2)],
      ['Compliance Rate', `${data.metrics.complianceRate.toFixed(2)}%`],
    ],
  });
  
  // Hourly Trends Table
  const finalY = doc.lastAutoTable?.finalY || 45;
  doc.setFontSize(14);
  doc.text('Hourly Detection Trends', 14, finalY + 15);
  
  autoTable(doc, {
    startY: finalY + 20,
    head: [['Hour', 'Total', 'Safe', 'Unsafe']],
    body: data.trendData
      .filter(row => row.total > 0)
      .map(row => [
        `${row.hour}:00`,
        row.total.toString(),
        row.safe.toString(),
        row.unsafe.toString(),
      ]),
  });
  
  // Speed Distribution Table
  const finalY2 = doc.lastAutoTable?.finalY || finalY + 20;
  doc.setFontSize(14);
  doc.text('Speed Distribution', 14, finalY2 + 15);
  
  autoTable(doc, {
    startY: finalY2 + 20,
    head: [['Speed Range', 'Count', 'Percentage']],
    body: data.speedData.map(row => [
      row.range,
      row.count.toString(),
      `${row.percentage.toFixed(2)}%`,
    ]),
  });
  
  // Save PDF
  doc.save(`analytics_report_${today}.pdf`);
  
  console.log('✅ PDF exported successfully');
}