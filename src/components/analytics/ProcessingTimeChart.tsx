// components/ProcessingTimeChart.tsx
'use client';
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useDetectionStore } from '@/stores/useDetectionStore';

interface HourlyLatency {
  hour: number;
  avgClassification: number;
  avgFeasibility: number;
  avgTotal: number;
  count: number;
}

const ProcessingTimeChart: React.FC = () => {
  const detections = useDetectionStore((state) => state.detections);

  // Calculate hourly averages
  const calculateHourlyLatency = () => {
    // 1. Siapkan wadah untuk menampung total waktu dan jumlah data per jam
    const tempHourly = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      sumClassification: 0,
      sumFeasibility: 0,
      sumTotal: 0,
      count: 0
    }));

    if (!detections || detections.length === 0) {
      return [];
    }

    // 2. Loop data untuk menjumlahkan waktu
    detections.forEach(detection => {
      const createdAt = new Date(detection.created_at);
      const hour = createdAt.getHours();

      // Pastikan nilai tidak null/undefined
      const classTime = detection.classification_time || 0;
      const feasTime = detection.feasibility_time || 0;
      
      // Total process time biasanya ms, kita ubah ke detik (dibagi 1000)
      // Jika di db kamu total_process_time int4 (ms), maka bagi 1000. 
      // Jika sudah detik, hilangkan "/ 1000".
      const totalTime = (detection.total_process_time || 0) / 1000; 

      tempHourly[hour].sumClassification += classTime;
      tempHourly[hour].sumFeasibility += feasTime;
      tempHourly[hour].sumTotal += totalTime;
      tempHourly[hour].count++;
    });

    // 3. Hitung Rata-rata (Average)
    return tempHourly.map(item => ({
      hour: `${item.hour.toString().padStart(2, '0')}:00`,
      'Classification': item.count > 0 ? Number((item.sumClassification / item.count).toFixed(3)) : 0,
      'Feasibility': item.count > 0 ? Number((item.sumFeasibility / item.count).toFixed(3)) : 0,
      'Total Process': item.count > 0 ? Number((item.sumTotal / item.count).toFixed(3)) : 0,
    }));
  };

  const chartData = calculateHourlyLatency();
  const hasData = chartData.some(h => h['Total Process'] > 0);

  // Guard: Kalau data kosong
  if (!hasData) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Rata-rata Waktu Proses (Per Jam)
        </h3>
        <div className="h-[300px] flex items-center justify-center text-gray-500">
          <p>Belum ada data waktu proses</p>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg z-50">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm flex justify-between gap-4">
              <span>{entry.name}:</span>
              <span className="font-mono">{entry.value} s</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Rata-rata Waktu Proses (Detik)
        </h3>
      </div>
      
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
              label={{ value: 'Detik (s)', angle: -90, position: 'insideLeft', style: { fill: '#9ca3af' } }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {/* Garis untuk Classification Time (Misal: Ungu) */}
            <Line 
              type="monotone" 
              dataKey="Classification" 
              stroke="#8b5cf6" 
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              name="Classification"
            />

            {/* Garis untuk Feasibility Time (Misal: Orange) */}
            <Line 
              type="monotone" 
              dataKey="Feasibility" 
              stroke="#f59e0b" 
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              name="Feasibility"
            />

            {/* Garis untuk Total Process (Misal: Biru Gelap - karena ini akumulasi) */}
            <Line 
              type="monotone" 
              dataKey="Total Process" 
              stroke="#1e40af" 
              strokeWidth={2}
              strokeDasharray="5 5" // Putus-putus biar beda
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              name="Total System"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend Manual di Bawah (Opsional, biar seragam sama grafik sebelah) */}
      <div className="mt-4 flex items-center justify-center gap-6 text-sm text-gray-600 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-violet-500 rounded-full"></div>
          <span>Classification</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
          <span>Feasibility</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-800 rounded-full"></div>
          <span>Total System</span>
        </div>
      </div>
    </div>
  );
};

export default ProcessingTimeChart;