import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  status?: 'good' | 'warning' | 'normal';
}

function MetricCard({ title, value, subtitle, status = 'normal' }: MetricCardProps) {
  const statusColors = {
    good: 'text-green-600',
    warning: 'text-yellow-600',
    normal: 'text-blue-600'
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <p className="text-gray-600 text-sm font-medium mb-2">{title}</p>
      <p className={`text-3xl font-bold ${statusColors[status]}`}>
        {value}
      </p>
      {subtitle && (
        <p className="text-gray-500 text-xs mt-2">{subtitle}</p>
      )}
    </div>
  );
}

interface PerformanceMetricsProps {
  metrics: {
    totalDetections: number;
    systemAccuracy: number;
    avgClassificationTime: number;
    avgFeasibilityTime: number;
    avgSpeed: number;
    complianceRate: number;
  };
}

export default function PerformanceMetrics({ metrics }: PerformanceMetricsProps) {
  const getAccuracyStatus = (accuracy: number) => {
    if (accuracy >= 80) return 'good';
    if (accuracy >= 70) return 'warning';
    return 'warning';
  };

  const getTimeStatus = (time: number, target: number) => {
    if (time <= target) return 'good';
    if (time <= target * 1.2) return 'warning';
    return 'warning';
  };

  const getComplianceStatus = (rate: number) => {
    if (rate >= 85) return 'good';
    if (rate >= 70) return 'warning';
    return 'warning';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <MetricCard
        title="Total Deteksi"
        value={metrics.totalDetections}
        subtitle="Hari ini"
        status="normal"
      />
      
      <MetricCard
        title="Akurasi Sistem"
        value={`${metrics.systemAccuracy.toFixed(1)}%`}
        subtitle="Target: 80%"
        status={getAccuracyStatus(metrics.systemAccuracy)}
      />
      
      <MetricCard
        title="Avg Class Time"
        value={`${metrics.avgClassificationTime.toFixed(1)}s`}
        subtitle="Target: <7s"
        status={getTimeStatus(metrics.avgClassificationTime, 7)}
      />
      
      <MetricCard
        title="Avg Feas Time"
        value={`${metrics.avgFeasibilityTime.toFixed(1)}s`}
        subtitle="Target: <1s"
        status={getTimeStatus(metrics.avgFeasibilityTime, 1)}
      />
      
      <MetricCard
        title="Avg Speed"
        value={`${metrics.avgSpeed.toFixed(0)} cm/s`}
        subtitle="Kecepatan rata-rata"
        status="normal"
      />
      
      <MetricCard
        title="Compliance Rate"
        value={`${metrics.complianceRate.toFixed(1)}%`}
        subtitle="Safe detections"
        status={getComplianceStatus(metrics.complianceRate)}
      />
    </div>
  );
}