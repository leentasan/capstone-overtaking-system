'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDetectionStore } from '@/stores/useDetectionStore';

export function OverviewCard() {
  const stats = useDetectionStore((state) => state.stats);

  if (!stats) return null;

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Overview</CardTitle>
        <p className="text-sm text-gray-500">Total Deteksi Kendaraan</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="text-5xl font-bold">{stats.totalDetections}</div>
            <p className="text-sm text-gray-500">Current Month</p>
          </div>
          <div className="border-t pt-4">
            <div className="text-3xl font-bold text-purple-600">
              {stats.todayCount}
            </div>
            <p className="text-sm text-gray-500">Today</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}