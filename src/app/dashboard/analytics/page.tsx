'use client';

import React, { useState, useEffect } from 'react';
import TrendChart from '@/components/analytics/TrendChart';
import SpeedDistribution from '@/components/analytics/SpeedDistribution';
import PerformanceMetrics from '@/components/analytics/PerformanceMetrics';
import ExportSection from '@/components/analytics/ExportSection';

// Types
interface HourlyData {
  hour: number;
  total: number;
  safe: number;
  unsafe: number;
}

interface SpeedRange {
  range: string;
  count: number;
  percentage: number;
}

interface AnalyticsData {
  trendData: HourlyData[];
  speedData: SpeedRange[];
  metrics: {
    totalDetections: number;
    systemAccuracy: number;
    avgClassificationTime: number;
    avgFeasibilityTime: number;
    avgSpeed: number;
    complianceRate: number;
  };
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    trendData: [],
    speedData: [],
    metrics: {
      totalDetections: 0,
      systemAccuracy: 0,
      avgClassificationTime: 0,
      avgFeasibilityTime: 0,
      avgSpeed: 0,
      complianceRate: 0
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        console.log('🔄 Fetching analytics data...');
        
        const response = await fetch('/api/analytics');
        
        console.log('📡 Response status:', response.status);
        console.log('📡 Response OK:', response.ok);
        
        if (!response.ok) {
          throw new Error('Failed to fetch analytics');
        }
        
        const data = await response.json();
        
        console.log('✅ Data received:', data);
        console.log('📊 Total Detections:', data.metrics?.totalDetections);
        console.log('📊 Trend Data length:', data.trendData?.length);
        console.log('📊 Speed Data length:', data.speedData?.length);
        
        setAnalyticsData(data);
        
      } catch (error) {
        console.error('❌ Error fetching analytics data:', error);
        console.log('⚠️ Using fallback empty data');
        
        // Fallback ke data kosong jika error
        setAnalyticsData({
          trendData: [],
          speedData: [],
          metrics: {
            totalDetections: 0,
            systemAccuracy: 0,
            avgClassificationTime: 0,
            avgFeasibilityTime: 0,
            avgSpeed: 0,
            complianceRate: 0
          }
        });
      } finally {
        setLoading(false);
        console.log('✅ Loading completed');
      }
    };

    fetchData();
  }, []);

  // Debug: Log setiap kali analyticsData berubah
  useEffect(() => {
    console.log('🔍 Current analyticsData state:', analyticsData);
    console.log('🔍 Has data?', analyticsData.metrics.totalDetections > 0);
  }, [analyticsData]);

  const handleExport = (format: 'csv' | 'pdf') => {
    console.log(`Exporting data as ${format}...`);
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
          <ExportSection/>
        </div>

        {/* Debug Info - HAPUS NANTI
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-yellow-800 mb-2">🐛 Debug Info:</p>
          <div className="text-xs text-yellow-700 space-y-1">
            <p>Total Detections: {analyticsData.metrics.totalDetections}</p>
            <p>Trend Data: {analyticsData.trendData.length} items</p>
            <p>Speed Data: {analyticsData.speedData.length} items</p>
            <p>Button should be: {analyticsData.metrics.totalDetections > 0 ? '✅ ENABLED' : '❌ DISABLED'}</p>
          </div>
        </div> */}

        {/* Performance Metrics */}
        <PerformanceMetrics/>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Trend Chart - Full width */}
          <div className="lg:col-span-2">
            <TrendChart/>
          </div>

          {/* Speed Distribution - Full width */}
          <div className="lg:col-span-2">
            <SpeedDistribution />
          </div>
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