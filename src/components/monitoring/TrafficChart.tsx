'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDetectionStore } from '@/stores/useDetectionStore';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { chartColors } from '@/lib/utils';

ChartJS.register(ArcElement, Tooltip, Legend);

export function TrafficChart() {
  const detections = useDetectionStore((state) => state.detections);

  const carCount = detections.filter((d) => d.vehicle_type === 'mobil').length;
  const mediumCount = detections.filter((d) => d.vehicle_type === 'truk/bus sedang').length;
  const largeCount = detections.filter((d) => d.vehicle_type === 'truk/bus besar').length;

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
        labels: {
          boxWidth: 12,
          padding: 6, // CHANGE: 8 → 6
          font: {
            size: 10 // CHANGE: 11 → 10
          }
        }
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
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2 pt-4"> {/* ADD: pb-2 pt-4 */}
        <CardTitle className="text-base">Traffic Distribution</CardTitle>
        <p className="text-xs text-gray-500">By Vehicle Type</p>
      </CardHeader>
      <CardContent className="flex-1 pt-0 pb-3"> {/* CHANGE: pt-2 → pt-0, ADD: pb-3 */}
        <div className="h-full max-h-[260px] flex items-center justify-center"> {/* CHANGE: 280px → 260px */}
          <div className="w-full max-w-[220px]"> {/* CHANGE: 240px → 220px */}
            <Doughnut data={data} options={options} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}