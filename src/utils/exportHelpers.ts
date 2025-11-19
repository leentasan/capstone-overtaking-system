// utils/exportHelpers.ts
import { Detection } from '@/types';

export function exportToCSV(detections: Detection[]) {
  if (!detections || detections.length === 0) {
    alert('No data to export');
    return;
  }

  // Create CSV header
  const headers = [
    'Time',
    'Vehicle Type',
    'Length (m)',
    'Speed (km/h)',
    'Distance (m)',
    'Feasibility',
    'Classification Time (ms)',
    'Feasibility Time (ms)'
  ];

  // Create CSV rows
  const rows = detections.map(d => [
    new Date(d.created_at).toLocaleString(),
    d.vehicle_type || '-',
    d.detected_length_m?.toFixed(1) || '-',
    d.vehicle_speed || '-',
    d.distance_ab || '-',
    d.feasibility_result || '-',
    d.classification_time?.toFixed(0) || '-',
    d.feasibility_time?.toFixed(0) || '-'
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  // Download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `detections_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToPDF(detections: Detection[]) {
  if (!detections || detections.length === 0) {
    alert('No data to export');
    return;
  }

  // Calculate metrics
  const totalDetections = detections.length;
  const safeCount = detections.filter(d => d.feasibility_result === 'safe').length;
  const unsafeCount = detections.filter(d => d.feasibility_result === 'unsafe').length;
  const complianceRate = totalDetections > 0 ? ((safeCount / totalDetections) * 100).toFixed(1) : '0';
  
  const avgSpeed = detections
    .filter(d => d.vehicle_speed)
    .reduce((sum, d) => sum + (d.vehicle_speed || 0), 0) / 
    detections.filter(d => d.vehicle_speed).length || 0;

  // Create HTML content for PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Vehicle Detection Report</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          padding: 40px;
          color: #333;
        }
        h1 { 
          color: #1f2937;
          border-bottom: 3px solid #3b82f6;
          padding-bottom: 10px;
        }
        .summary {
          background: #f3f4f6;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          margin-top: 15px;
        }
        .metric {
          background: white;
          padding: 15px;
          border-radius: 6px;
          border-left: 4px solid #3b82f6;
        }
        .metric-label {
          font-size: 12px;
          color: #6b7280;
          text-transform: uppercase;
        }
        .metric-value {
          font-size: 24px;
          font-weight: bold;
          color: #1f2937;
          margin-top: 5px;
        }
        table { 
          width: 100%; 
          border-collapse: collapse; 
          margin-top: 20px;
          font-size: 12px;
        }
        th { 
          background: #3b82f6; 
          color: white; 
          padding: 12px 8px;
          text-align: left;
        }
        td { 
          padding: 10px 8px; 
          border-bottom: 1px solid #e5e7eb;
        }
        tr:nth-child(even) { 
          background: #f9fafb; 
        }
        .safe { color: #10b981; font-weight: bold; }
        .unsafe { color: #ef4444; font-weight: bold; }
        .footer {
          margin-top: 30px;
          text-align: center;
          color: #6b7280;
          font-size: 11px;
        }
      </style>
    </head>
    <body>
      <h1>🚗 Vehicle Detection Report</h1>
      
      <div class="summary">
        <h2 style="margin-top: 0;">Summary Statistics</h2>
        <div class="summary-grid">
          <div class="metric">
            <div class="metric-label">Total Detections</div>
            <div class="metric-value">${totalDetections}</div>
          </div>
          <div class="metric">
            <div class="metric-label">Avg Speed</div>
            <div class="metric-value">${avgSpeed.toFixed(1)} km/h</div>
          </div>
          <div class="metric">
            <div class="metric-label">Compliance Rate</div>
            <div class="metric-value">${complianceRate}%</div>
          </div>
        </div>
      </div>

      <h2>Detection Details</h2>
      <table>
        <thead>
          <tr>
            <th>Time</th>
            <th>Vehicle Type</th>
            <th>Length (m)</th>
            <th>Speed (km/h)</th>
            <th>Distance (m)</th>
            <th>Feasibility</th>
          </tr>
        </thead>
        <tbody>
          ${detections.map(d => `
            <tr>
              <td>${new Date(d.created_at).toLocaleString()}</td>
              <td>${d.vehicle_type || '-'}</td>
              <td>${d.detected_length_m?.toFixed(1) || '-'}</td>
              <td>${d.vehicle_speed || '-'}</td>
              <td>${d.distance_ab || '-'}</td>
              <td class="${d.feasibility_result === 'safe' ? 'safe' : 'unsafe'}">
                ${d.feasibility_result || '-'}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="footer">
        Generated on ${new Date().toLocaleString()} | Vehicle Detection System
      </div>
    </body>
    </html>
  `;

  // Open print dialog
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load then print
    printWindow.onload = () => {
      printWindow.print();
    };
  }
}