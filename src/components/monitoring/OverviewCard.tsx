'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDetectionStore } from '@/stores/useDetectionStore';
import { format, isSameDay } from 'date-fns';

export function OverviewCard() {
  const stats = useDetectionStore((state) => state.stats);
  const dateRange = useDetectionStore((state) => state.dateRange);

  if (!stats) return null;

  const today = new Date();
  
  const isToday = dateRange && 
    isSameDay(dateRange.from, today) && 
    isSameDay(dateRange.to, today);

  const getFilterLabel = () => {
    if (!dateRange) return 'All Time';
    if (isToday) return `Today (${format(today, 'dd MMM yyyy')})`;
    return `${format(dateRange.from, 'dd MMM')} - ${format(dateRange.to, 'dd MMM yyyy')}`;
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3 pt-4">
        <CardTitle className="text-base">Overview</CardTitle>
        <p className="text-xs text-gray-500">Total Deteksi Kendaraan</p>
      </CardHeader>
      <CardContent className="flex-1 pt-0">
        <div className="space-y-3">
          <div>
            <div className="text-4xl font-bold text-purple-600">
              {stats.totalDetections}
            </div>
            <p className="text-xs text-gray-500">{getFilterLabel()}</p>
          </div>

          <div className="border-t pt-3">
            <div className="grid grid-cols-1 gap-3"> {/* CHANGE: grid-cols-2 → grid-cols-1 */}
              {/* Current Month - Commented */}
              {/* <div>
                <div className="text-xl font-bold">
                  {stats.currentMonthCount}
                </div>
                <p className="text-xs text-gray-500">Current Month</p>
              </div> */}

              <div> {/* REMOVE: border-l pl-3 */}
                <div className="text-xl font-bold text-purple-600">
                  {stats.todayCount}
                </div>
                <p className="text-xs text-gray-500">Today</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}