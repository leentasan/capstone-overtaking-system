'use client';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { useDetectionStore } from '@/stores/useDetectionStore';

interface SpeedRange {
  range: string;
  count: number;
  percentage: number;
}

const SpeedDistribution: React.FC = () => {
  const detections = useDetectionStore((state) => state.detections);

  const calculateSpeedDistribution = (): SpeedRange[] => {
    const ranges = [
      { min: 0, max: 20, label: '0-20 cm/s' },
      { min: 20, max: 30, label: '20-30 cm/s' },
      { min: 30, max: 40, label: '30-40 cm/s' },
      { min: 40, max: 50, label: '40-50 cm/s' },
      { min: 50, max: Infinity, label: '>50 cm/s' }
    ];

    const counts = ranges.map(range => ({
      range: range.label,
      count: 0,
      percentage: 0
    }));

    // Filter detections that have vehicle_speed
    const detectionsWithSpeed = detections.filter(d => d.vehicle_speed !== null && d.vehicle_speed !== undefined);
    
    if (detectionsWithSpeed.length === 0) {
      return counts;
    }

    // Count detections in each range
    detectionsWithSpeed.forEach(detection => {
      const speed = detection.vehicle_speed!;
      const rangeIndex = ranges.findIndex(r => speed >= r.min && speed < r.max);
      if (rangeIndex !== -1) {
        counts[rangeIndex].count++;
      }
    });

    // Calculate percentages
    const total = detectionsWithSpeed.length;
    counts.forEach(item => {
      item.percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;
    });

    return counts;
  };

  const speedData = calculateSpeedDistribution();
  const hasData = speedData.some(item => item.count > 0);

  if (!hasData) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Distribusi Kecepatan
        </h3>
        <div className="h-[300px] flex items-center justify-center text-gray-500">
          <p>Belum ada data kecepatan</p>
        </div>
      </div>
    );
  }

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{payload[0].payload.range}</p>
          <p className="text-sm text-gray-600">
            Jumlah: {payload[0].value} ({payload[0].payload.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Distribusi Kecepatan
      </h3>

      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={speedData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="range" 
              stroke="#6b7280"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              stroke="#6b7280"
              tick={{ fontSize: 12 }}
              label={{ value: 'Jumlah Kendaraan', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {speedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-5 gap-2 text-xs">
        {speedData.map((item, index) => (
          <div key={index} className="text-center">
            <div 
              className="w-full h-2 rounded-full mb-1" 
              style={{ backgroundColor: COLORS[index] }}
            ></div>
            <p className="font-medium text-gray-900">{item.count}</p>
            <p className="text-gray-500">{item.percentage}%</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpeedDistribution;