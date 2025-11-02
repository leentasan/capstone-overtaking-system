'use client';

import { useEffect } from 'react';
import { DashboardCard } from '@/components/monitoring/DashboardCard';
import { OverviewCard } from '@/components/monitoring/OverviewCard';
import { TrafficChart } from '@/components/monitoring/TrafficChart';
import { LogTable } from '@/components/monitoring/LogTable';
import { DateFilter } from '@/components/monitoring/DateFilter';
import { useSupabaseRealtime } from '@/hooks/useSupabaseRealtime';
import { useDetections } from '@/hooks/useDetections';
import { useStats } from '@/hooks/useStats';

export default function MonitoringPage() {
  // Load initial data
  useDetections();
  useStats();

  // Subscribe to realtime updates
  useSupabaseRealtime();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Real-time Monitoring</h1>
          <p className="text-gray-500">Live vehicle detection dashboard</p>
        </div>
        <DateFilter />
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <OverviewCard />
        <div className="lg:col-span-3">
          <DashboardCard />
        </div>
      </div>

      {/* Traffic Chart */}
      <TrafficChart />

      {/* Live Table */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Live Detections</h2>
        <LogTable />
      </div>
    </div>
  );
}