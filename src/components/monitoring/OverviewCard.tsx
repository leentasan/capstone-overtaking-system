'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDetectionStore } from '@/stores/useDetectionStore';
import { format, isSameDay, startOfMonth } from 'date-fns';

export function OverviewCard() {
  const stats = useDetectionStore((state) => state.stats);
  const dateRange = useDetectionStore((state) => state.dateRange);

  if (!stats) return null;

  const isToday = dateRange && 
    isSameDay(dateRange.from, new Date()) && 
    isSameDay(dateRange.to, new Date());
  
  const isCurrentMonth = dateRange && 
    isSameDay(dateRange.from, startOfMonth(new Date())) &&
    isSameDay(dateRange.to, new Date());

  const getFilterLabel = () => {
    if (!dateRange) return 'All Time';
    if (isToday) return `Today (${format(new Date(), 'dd MMM yyyy')})`;
    if (isCurrentMonth) return 'Current Month';
    return `${format(dateRange.from, 'dd MMM')} - ${format(dateRange.to, 'dd MMM yyyy')}`;
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3 pt-4"> {/* ADD: pb-3 pt-4 untuk reduce padding */}
        <CardTitle className="text-base">Overview</CardTitle> {/* CHANGE: default → text-base */}
        <p className="text-xs text-gray-500">Total Deteksi Kendaraan</p> {/* CHANGE: text-sm → text-xs */}
      </CardHeader>
      <CardContent className="flex-1 pt-0"> {/* CHANGE: default → pt-0 */}
        <div className="space-y-3"> {/* CHANGE: space-y-4 → space-y-3 */}
          <div>
            <div className="text-4xl font-bold text-purple-600"> {/* CHANGE: text-5xl → text-4xl */}
              {stats.totalDetections}
            </div>
            <p className="text-xs text-gray-500">{getFilterLabel()}</p> {/* CHANGE: text-sm → text-xs */}
          </div>

          <div className="border-t pt-3"> {/* CHANGE: pt-4 → pt-3 */}
            <div className="grid grid-cols-2 gap-3"> {/* CHANGE: gap-4 → gap-3 */}
              <div>
                <div className="text-xl font-bold"> {/* CHANGE: text-2xl → text-xl */}
                  {stats.currentMonthCount}
                </div>
                <p className="text-xs text-gray-500">Current Month</p>
              </div>

              <div className="border-l pl-3"> {/* CHANGE: pl-4 → pl-3 */}
                <div className="text-xl font-bold text-purple-600"> {/* CHANGE: text-2xl → text-xl */}
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