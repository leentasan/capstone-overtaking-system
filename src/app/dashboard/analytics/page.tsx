'use client';

import React, { useState, useEffect } from 'react';
import TrendChart from '@/components/analytics/TrendChart';
import HourlyTrafficChart from '@/components/analytics/HourlyTrafficChart';
import SpeedDistribution from '@/components/analytics/SpeedDistribution';
import PerformanceMetrics from '@/components/analytics/PerformanceMetrics';
import ExportSection from '@/components/analytics/ExportSection';

export default function AnalyticsPage() {
  // State untuk data
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    trendData: [],
    hourlyData: [],
    speedData: [],
    metrics: {
      totalDetections: 0,
      averageSpeed: 0,
      violations: 0,
      peakHour: '-'
    }
  });

  // Fetch data (atau gunakan dummy data)
  useEffect(() => {
    // TODO: Replace dengan fetch dari API/Supabase
    const fetchData = async () => {
      try {
        // Dummy data untuk testing
        const dummyData = {
          trendData: [
            { date: '2024-01-01', count: 45 },
            { date: '2024-01-02', count: 52 },
            { date: '2024-01-03', count: 38 },
            { date: '2024-01-04', count: 65 },
            { date: '2024-01-05', count: 58 },
            { date: '2024-01-06', count: 72 },
            { date: '2024-01-07', count: 61 }
          ],
          hourlyData: [
            { hour: '00:00', count: 5 },
            { hour: '06:00', count: 15 },
            { hour: '09:00', count: 35 },
            { hour: '12:00', count: 42 },
            { hour: '15:00', count: 38 },
            { hour: '18:00', count: 45 },
            { hour: '21:00', count: 20 }
          ],
          speedData: [
            { range: '0-20 km/h', count: 12 },
            { range: '20-40 km/h', count: 45 },
            { range: '40-60 km/h', count: 78 },
            { range: '60-80 km/h', count: 34 },
            { range: '>80 km/h', count: 8 }
          ],
          metrics: {
            totalDetections: 177,
            averageSpeed: 48.5,
            violations: 42,
            peakHour: '18:00'
          }
        };

        setAnalyticsData(dummyData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handler untuk export
  const handleExport = (format: 'csv' | 'pdf') => {
    console.log(`Exporting data as ${format}...`);
    // TODO: Implement export logic
    alert(`Export sebagai ${format.toUpperCase()} akan segera tersedia!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600 mt-1">
              Analisis data deteksi kendaraan dan performa sistem
            </p>
          </div>
          <ExportSection onExport={handleExport} />
        </div>

        {/* Performance Metrics */}
        <PerformanceMetrics metrics={analyticsData.metrics} />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Trend Chart - Full width on mobile, half on desktop */}
          <div className="lg:col-span-2">
            <TrendChart data={analyticsData.trendData} />
          </div>

          {/* Hourly Traffic */}
          <HourlyTrafficChart data={analyticsData.hourlyData} />

          {/* Speed Distribution */}
          <SpeedDistribution data={analyticsData.speedData} />
        </div>

        {/* Additional Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Tentang Analytics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div>
              <p className="font-medium text-gray-900 mb-1">Data Real-time</p>
              <p>Data diupdate secara otomatis setiap ada deteksi baru</p>
            </div>
            <div>
              <p className="font-medium text-gray-900 mb-1">Historical Data</p>
              <p>Akses data historis untuk analisis trend jangka panjang</p>
            </div>
            <div>
              <p className="font-medium text-gray-900 mb-1">Export Report</p>
              <p>Download laporan dalam format CSV atau PDF</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}