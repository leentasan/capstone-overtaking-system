'use client';
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface HourlyData {
  hour: number;
  total: number;
  safe: number;
  unsafe: number;
}

interface TrendChartProps {
  data: HourlyData[];
}

const TrendChart: React.FC<TrendChartProps> = ({ data }) => {
  // Guard: Kalau data kosong
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Trend Deteksi Hari Ini (Per Jam)
        </h3>
        <div className="h-[300px] flex items-center justify-center text-gray-500">
          <p>Belum ada data deteksi hari ini</p>
        </div>
      </div>
    );
  }

  const chartData = data.map(item => ({
    hour: `${item.hour.toString().padStart(2, '0')}:00`,
    Total: item.total,
    Safe: item.safe,
    Unsafe: item.unsafe
  }));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Trend Deteksi Hari Ini (Per Jam)
      </h3>
      
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="hour" 
              stroke="#6b7280"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              stroke="#6b7280"
              tick={{ fontSize: 12 }}
            />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="Total" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line 
              type="monotone" 
              dataKey="Safe" 
              stroke="#10b981" 
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line 
              type="monotone" 
              dataKey="Unsafe" 
              stroke="#ef4444" 
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Total Deteksi</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Safe</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Unsafe</span>
          </div>
        </div>
        <span className="text-gray-500">Data: Hari ini (00:00 - 23:59)</span>
      </div>
    </div>
  );
};

export default TrendChart;