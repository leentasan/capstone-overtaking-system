'use client';
import React from 'react';
import { useDetectionStore } from '@/stores/useDetectionStore';

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
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
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

export default function PerformanceMetrics() {
  // 🔥 AMBIL DATA DARI STORE (sudah filtered by dateRange)
  const detections = useDetectionStore((state) => state.detections);

  // 🔥 HITUNG METRICS DARI DETECTIONS YANG SUDAH DIFILTER
  const metrics = React.useMemo(() => {
    if (!detections || detections.length === 0) {
      return {
        totalDetections: 0,
        systemAccuracy: 0,
        avgClassificationTime: 0,
        avgFeasibilityTime: 0,
        avgSpeed: 0,
        complianceRate: 0
      };
    }

    // Total detections
    const totalDetections = detections.length;

    // System Accuracy - dari detections yang punya classification_time
    const withClassTime = detections.filter(d => 
      d.classification_time !== null && 
      d.classification_time !== undefined &&
      d.classification_time > 0
    );
    const systemAccuracy = withClassTime.length > 0 
      ? (withClassTime.length / totalDetections) * 100 
      : 0;

    // Avg Classification Time
    const classTimesValid = detections
      .filter(d => 
        d.classification_time !== null && 
        d.classification_time !== undefined && 
        d.classification_time > 0
      )
      .map(d => d.classification_time);
    const avgClassificationTime = classTimesValid.length > 0
      ? classTimesValid.reduce((a, b) => a + b, 0) / classTimesValid.length
      : 0;

    // Avg Feasibility Time
    const feasTimesValid = detections
      .filter(d => 
        d.feasibility_time !== null && 
        d.feasibility_time !== undefined && 
        d.feasibility_time > 0
      )
      .map(d => d.feasibility_time);
    const avgFeasibilityTime = feasTimesValid.length > 0
      ? feasTimesValid.reduce((a, b) => a + b, 0) / feasTimesValid.length
      : 0;

    // Avg Speed (dari vehicle_speed)
    const speedsValid = detections
      .filter(d => 
        d.vehicle_speed !== null && 
        d.vehicle_speed !== undefined && 
        d.vehicle_speed > 0
      )
      .map(d => d.vehicle_speed!);
    const avgSpeed = speedsValid.length > 0
      ? speedsValid.reduce((a, b) => a + b, 0) / speedsValid.length
      : 0;

    // Compliance Rate (dari feasibility_result)
    const safeCount = detections.filter(d => 
      d.feasibility_result === 'safe'
    ).length;
    const complianceRate = totalDetections > 0 
      ? (safeCount / totalDetections) * 100 
      : 0;

    return {
      totalDetections,
      systemAccuracy,
      avgClassificationTime,
      avgFeasibilityTime,
      avgSpeed,
      complianceRate
    };
  }, [detections]);

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
    // PERUBAHAN DISINI: xl:grid-cols-6 DIUBAH JADI xl:grid-cols-5
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      <MetricCard
        title="Total Deteksi"
        value={metrics.totalDetections}
        subtitle="Periode terpilih"
        status="normal"
      />
      
      {/* <MetricCard
        title="Akurasi Sistem"
        // value={`${metrics.systemAccuracy.toFixed(1)}%`}
        value="80%"
        subtitle="Target: 80%"
        status={getAccuracyStatus(metrics.systemAccuracy)}
      /> */}
      
      <MetricCard
        title="Avg Class Time"
        value={metrics.avgClassificationTime > 0 ? `${metrics.avgClassificationTime.toFixed(1)}s` : 'N/A'}
        subtitle="Target: <7s"
        status={getTimeStatus(metrics.avgClassificationTime, 7)}
      />
      
      <MetricCard
        title="Avg Feas Time"
        value={metrics.avgFeasibilityTime > 0 ? `${metrics.avgFeasibilityTime.toFixed(1)}s` : 'N/A'}
        subtitle="Target: <1s"
        status={getTimeStatus(metrics.avgFeasibilityTime, 1)}
      />
      
      <MetricCard
        title="Avg Speed"
        value={metrics.avgSpeed > 0 ? `${metrics.avgSpeed.toFixed(0)} cm/s` : '0 cm/s'}
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