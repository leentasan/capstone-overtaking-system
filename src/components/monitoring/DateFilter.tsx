'use client';

import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useDetectionStore } from '@/stores/useDetectionStore';
import { DateRange } from '@/types';

export function DateFilter() {
  const { dateRange, setDateRange } = useDetectionStore();
  const [tempRange, setTempRange] = useState<{ from?: Date; to?: Date }>({
    from: dateRange?.from,
    to: dateRange?.to,
  });

  const handleApply = () => {
    if (tempRange.from && tempRange.to) {
      setDateRange({ from: tempRange.from, to: tempRange.to });
    }
  };

  const handleReset = () => {
    setTempRange({ from: undefined, to: undefined });
    setDateRange(null);
  };

  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2">
            <CalendarIcon className="h-4 w-4" />
            {dateRange
              ? `${format(dateRange.from, 'dd/MM/yyyy')} - ${format(dateRange.to, 'dd/MM/yyyy')}`
              : 'Select date range'}
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
              Reset
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}