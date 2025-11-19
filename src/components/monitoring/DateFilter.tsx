'use client';

import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useDetectionStore } from '@/stores/useDetectionStore';
import { DateRange } from '@/types';

// Helper: Get today's date range (00:00:00 - 23:59:59)
function getTodayRange(): DateRange {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);
  
  return { from: today, to: endOfDay };
}

export function DateFilter() {
  const { dateRange, setDateRange } = useDetectionStore();
  const [tempRange, setTempRange] = useState<{ from?: Date; to?: Date }>({
    from: dateRange?.from,
    to: dateRange?.to,
  });

  // Set default to TODAY on mount
  useEffect(() => {
    if (!dateRange) {
      const todayRange = getTodayRange();
      setDateRange(todayRange);
    }
  }, [dateRange, setDateRange]);

  const handleApply = () => {
    if (tempRange.from && tempRange.to) {
      // Ensure full day coverage
      const from = new Date(tempRange.from);
      from.setHours(0, 0, 0, 0);
      
      const to = new Date(tempRange.to);
      to.setHours(23, 59, 59, 999);
      
      setDateRange({ from, to });
    }
  };

  const handleReset = () => {
    // Reset to TODAY (not null)
    const todayRange = getTodayRange();
    setTempRange({ from: todayRange.from, to: todayRange.to });
    setDateRange(todayRange);
  };

  const formatDateRange = () => {
    if (!dateRange) return 'Select date range';
    
    const from = format(dateRange.from, 'dd/MM/yyyy');
    const to = format(dateRange.to, 'dd/MM/yyyy');
    
    // If same day, show "Today" or just one date
    if (from === to) {
      const today = format(new Date(), 'dd/MM/yyyy');
      return from === today ? 'Today' : from;
    }
    
    return `${from} - ${to}`;
  };

  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2">
            <CalendarIcon className="h-4 w-4" />
            {formatDateRange()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="range"
            selected={{ from: tempRange.from, to: tempRange.to }}
            onSelect={(range) =>
              setTempRange({ from: range?.from, to: range?.to })
            }
            numberOfMonths={2}
          />
          <div className="flex gap-2 p-3 border-t">
            <Button onClick={handleApply} size="sm" className="flex-1">
              Apply
            </Button>
            <Button onClick={handleReset} size="sm" variant="outline">
              Reset to Today
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}