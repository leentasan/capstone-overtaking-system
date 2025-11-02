'use client';

import { useEffect } from 'react';
import { fetchStats } from '@/lib/supabase';
import { useDetectionStore } from '@/stores/useDetectionStore';

export function useStats() {
  const { setStats, dateRange } = useDetectionStore();

  useEffect(() => {
    async function loadStats() {
      try {
        const stats = await fetchStats(dateRange || undefined);
        setStats(stats);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    }

    loadStats();
  }, [dateRange, setStats]);
}