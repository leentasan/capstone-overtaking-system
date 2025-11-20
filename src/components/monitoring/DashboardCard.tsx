'use client';

import { MetricCard } from './MetricCard';
import { useDetectionStore } from '@/stores/useDetectionStore';
import { Car, AlertTriangle, Gauge, ShieldCheck } from 'lucide-react';

export function DashboardCard() {
  const stats = useDetectionStore((state) => state.stats);

  if (!stats) return null;

  // Add safe defaults for values that might be undefined
  const averageSpeed = stats.averageSpeed ?? 0;
  const safeRatio = stats.safeRatio ?? 0;
  const todayCount = stats.todayCount ?? 0;
  const overtakingCount = stats.overtakingCount ?? 0;
  const safeCount = stats.safeCount ?? 0;
  const totalDetections = stats.totalDetections ?? 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Total Today"
        value={todayCount}
        subtitle="Detections"
        icon={Car}
        color="purple"
      />

      <MetricCard
        title="Overtaking Count"
        value={overtakingCount}
        subtitle="Unsafe maneuvers"
        icon={AlertTriangle}
        color="pink"
      />

      <MetricCard
        title="Average Speed"
        value={`${averageSpeed.toFixed(1)} cm/s`}
        subtitle="All vehicles"
        icon={Gauge}
        color="blue"
      />

      <MetricCard
        title="Safe Ratio"
        value={`${safeRatio.toFixed(1)}%`}
        subtitle={`${safeCount} / ${totalDetections}`}
        icon={ShieldCheck}
        color="amber"
      />
    </div>
  );
}