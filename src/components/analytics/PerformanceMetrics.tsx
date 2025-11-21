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
  const detections = useDetectionStore((state) => state.detections);

  const metrics = React.useMemo(() => {
    // Default return jika data kosong
    if (!detections || detections.length === 0) {
      return {
        totalDetections: 0,
        systemAccuracy: 0,
        avgClassificationTime: 0,
        avgFeasibilityTime: 0,
        avgSpeed: 0,
        complianceRate: 0,
        avgTotalTime: 0, // TAMBAHAN: Default value
      };
    }

    const totalDetections = detections.length;

    // 1. System Accuracy
    const withClassTime = detections.filter(d => 
      d.classification_time !== null && d.classification_time !== undefined && d.classification_time > 0
    );
    const systemAccuracy = withClassTime.length > 0 
      ? (withClassTime.length / totalDetections) * 100 
      : 0;

    // 2. Avg Classification Time
    const classTimesValid = detections
      .filter(d => d.classification_time && d.classification_time > 0)
      .map(d => d.classification_time);
    const avgClassificationTime = classTimesValid.length > 0
      ? classTimesValid.reduce((a, b) => a + b, 0) / classTimesValid.length
      : 0;

    // 3. Avg Feasibility Time
    const feasTimesValid = detections
      .filter(d => d.feasibility_time && d.feasibility_time > 0)
      .map(d => d.feasibility_time);
    const avgFeasibilityTime = feasTimesValid.length > 0
      ? feasTimesValid.reduce((a, b) => a + b, 0) / feasTimesValid.length
      : 0;

    // 4. Avg Speed
    const speedsValid = detections
      .filter(d => d.vehicle_speed && d.vehicle_speed > 0)
      .map(d => d.vehicle_speed!);
    const avgSpeed = speedsValid.length > 0
      ? speedsValid.reduce((a, b) => a + b, 0) / speedsValid.length
      : 0;

    // 5. Compliance Rate
    const safeCount = detections.filter(d => d.feasibility_result === 'safe').length;
    const complianceRate = totalDetections > 0 
      ? (safeCount / totalDetections) * 100 
      : 0;

    // 🔥 6. NEW METRIC: Avg Total Time (Adjusted)
    // Logika: Ambil total_process_time (ms) -> convert ke detik -> kurangi 5 detik
    const totalTimesValid = detections
      // Pastikan ambil detection yang punya total_process_time (perlu disesuaikan dengan interface Type kamu)
      // @ts-ignore: Asumsi properti total_process_time ada di object detection
      .filter(d => d.total_process_time && d.total_process_time > 0)
      // @ts-ignore
      .map(d => {
        const timeInSeconds = d.total_process_time / 1000; // Convert 12453 ms -> 12.453 s
        const adjustedTime = timeInSeconds - 5;            // 12.453 - 5 = 7.453 s
        return adjustedTime > 0 ? adjustedTime : 0;        // Safety check agar tidak minus
      });

    const avgTotalTime = totalTimesValid.length > 0
      ? totalTimesValid.reduce((a, b) => a + b, 0) / totalTimesValid.length
      : 0;

    return {
      totalDetections,
      systemAccuracy,
      avgClassificationTime,
      avgFeasibilityTime,
      avgSpeed,
      complianceRate,
      avgTotalTime // Masukkan ke return object
    };
  }, [detections]);

  // Helper functions status...
  const getTimeStatus = (time: number, target: number) => {
    if (time <= target) return 'good';
    if (time <= target * 1.2) return 'warning';
    return 'warning'; // logic warning default
  };

  const getComplianceStatus = (rate: number) => {
    if (rate >= 85) return 'good';
    if (rate >= 70) return 'warning';
    return 'warning';
  };

  return (
    // 🔥 UPDATE GRID: Ubah ke xl:grid-cols-6 agar muat 6 kartu sebaris di layar lebar
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <MetricCard
        title="Total Deteksi"
        value={metrics.totalDetections}
        subtitle="Periode terpilih"
        status="normal"
      />
      
      {/* Kartu System Accuracy (Jika ingin dinyalakan kembali) */}
      {/* <MetricCard ... /> */}
      
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

      {/* 🔥 KARTU BARU: AVG TOTAL TIME */}
      <MetricCard
        title="Avg Total Time"
        value={metrics.avgTotalTime > 0 ? `${metrics.avgTotalTime.toFixed(1)}s` : 'N/A'}
        subtitle="Processing (-5s delay)"
        // Contoh target: misal diharapkan total proses (real) di bawah 8 detik
        status={getTimeStatus(metrics.avgTotalTime, 8)} 
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