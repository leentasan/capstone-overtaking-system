'use client';

import { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDetectionStore } from '@/stores/useDetectionStore';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { chartColors } from '@/lib/utils';

ChartJS.register(ArcElement, Tooltip, Legend);

export function TrafficChart() {
  const detections = useDetectionStore((state) => state.detections);

  // Count by vehicle type
  const carCount = detections.filter((d) => d.vehicle_type === 'car').length;
  const mediumCount = detections.filter((d) => d.vehicle_type === 'medium').length;
  const largeCount = detections.filter((d) => d.vehicle_type === 'large').length;

  const data = {
    labels: ['Mobil', 'Truck Sedang', 'Truck Besar'],
    datasets: [
      {
        data: [carCount, mediumCount, largeCount],
        backgroundColor: [
          chartColors.primary,   // Purple
          chartColors.secondary, // Pink
          chartColors.tertiary,  // Blue
        ],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Traffic Distribution</CardTitle>
        <p className="text-sm text-gray-500">By Vehicle Type</p>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <Doughnut data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}