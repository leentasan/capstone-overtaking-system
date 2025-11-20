'use client';

import React from 'react';
import { OverviewCard } from '@/components/monitoring/OverviewCard';
import { TrafficChart } from '@/components/monitoring/TrafficChart';
import PerformanceMetrics from '@/components/analytics/PerformanceMetrics';
import SpeedDistribution from '@/components/analytics/SpeedDistribution';
import TrendChart from '@/components/analytics/TrendChart';
import { DateFilter } from '@/components/monitoring/DateFilter';
import ExportSection from '@/components/analytics/ExportSection'; // ✅ FIX: default import
import { LogTable } from '@/components/monitoring/LogTable'; // ✅ FIX: named import
import { useDetectionStore } from '@/stores/useDetectionStore';

export default function DashboardPage() {
  const isLoading = useDetectionStore((state) => state.isLoading);
  const detections = useDetectionStore((state) => state.detections);
  const error = useDetectionStore((state) => state.error);
  const dateRange = useDetectionStore((state) => state.dateRange);
  const fetchDetections = useDetectionStore((state) => state.fetchDetections);

  // 🔥 FIX: Only trigger on dateRange changes
  React.useEffect(() => {
    fetchDetections();
  }, [dateRange, fetchDetections]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              Selamat Siang 👋
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Monitor sistem deteksi kendaraan secara real-time
            </p>
          </div>

          <div className="flex items-center gap-3">
            <DateFilter />
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <p className="text-blue-800 text-sm">Loading data...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">
              <span className="font-semibold">Error:</span> {error}
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && detections.length === 0 && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-amber-800 text-sm">
              No detections found for the selected date range
            </p>
          </div>
        )}

        {/* PERFORMANCE METRICS */}
        <div className="mb-6">
          <PerformanceMetrics />
        </div>

        {/* Grid Layout untuk Overview & Traffic */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Overview Card (1/3) */}
          <div className="lg:col-span-1">
            <OverviewCard />
          </div>

          {/* Traffic Chart (2/3) */}
          <div className="lg:col-span-2">
            <TrafficChart />
          </div>
        </div>

        {/* SPEED & TREND CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Speed Distribution */}
          <SpeedDistribution />

          {/* Trend Chart */}
          <TrendChart />
        </div>

        {/* Log Table */}
        <div className="mb-6">
          <LogTable />
        </div>
      </div>
    </div>
  );
}