'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDetectionStore } from '@/stores/useDetectionStore';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { chartColors } from '@/lib/utils';

ChartJS.register(ArcElement, Tooltip, Legend);

export function TrafficChart() {
  const detections = useDetectionStore((state) => state.detections);

  // // DEBUG
  // console.log('=== TRAFFIC CHART DEBUG ===');
  // console.log('Total detections:', detections.length);
  // console.log('Sample detection:', detections[0]);
  // console.log('All vehicle types:', detections.map(d => d.vehicle_type));

  // const carCount = detections.filter((d) => d.vehicle_type === 'mobil').length;
  // const mediumCount = detections.filter((d) => d.vehicle_type === 'truk/bus sedang').length;
  // const largeCount = detections.filter((d) => d.vehicle_type === 'truk/bus besar').length;

  // // DEBUG
  // console.log('Chart counts:', { carCount, mediumCount, largeCount });
  // console.log('===========================');

  const data = {
    labels: ['Mobil', 'Truck Sedang', 'Truck Besar'],
    datasets: [
      {
        data: [carCount, mediumCount, largeCount],
        backgroundColor: [
          chartColors.primary,
          chartColors.secondary,
          chartColors.tertiary,
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
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
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