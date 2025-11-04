'use client';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface SpeedRange {
  range: string;
  count: number;
  percentage: number;
}

interface SpeedDistributionProps {
  data: SpeedRange[];
}

const SpeedDistribution: React.FC<SpeedDistributionProps> = ({ data }) => {
  // Guard: Kalau data kosong
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Speed Distribution (cm/s)
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Distribusi kecepatan kendaraan hari ini
          </p>
        </div>
        <div className="h-[300px] flex items-center justify-center text-gray-500">
          <p>Belum ada data kecepatan hari ini</p>
        </div>
      </div>
    );
  }

  const getColor = (range: string) => {
    switch (range) {
      case '0-500': return '#10b981';
      case '500-1000': return '#3b82f6';
      case '1000-1500': return '#f59e0b';
      case '1500-2000': return '#ef4444';
      case '2000+': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getLabel = (range: string) => {
    switch (range) {
      case '0-500': return 'Very Slow';
      case '500-1000': return 'Slow';
      case '1000-1500': return 'Normal';
      case '1500-2000': return 'Fast';
      case '2000+': return 'Very Fast';
      default: return range;
    }
  };

  const chartData = data.map(item => ({
    range: item.range,
    count: item.count,
    percentage: item.percentage.toFixed(1),
    label: getLabel(item.range)
  }));

  // Custom Tooltip untuk Recharts v3
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{data.label}</p>
          <p className="text-sm text-gray-600">Range: {data.range} cm/s</p>
          <p className="text-sm text-blue-600">Count: {data.count}</p>
          <p className="text-sm text-gray-600">Percentage: {data.percentage}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Speed Distribution (cm/s)
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Distribusi kecepatan kendaraan hari ini
        </p>
      </div>
      
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={chartData}
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
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.range)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-5 gap-2 text-xs">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center gap-1">
            <div 
              className="w-3 h-3 rounded" 
              style={{ backgroundColor: getColor(item.range) }}
            ></div>
            <span className="text-gray-600">{item.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600">
          <span className="font-semibold">Note:</span> Speed dalam centimeter per second (cm/s). 
          1000 cm/s ≈ 36 km/h
        </p>
      </div>
    </div>
  );
};

export default SpeedDistribution;