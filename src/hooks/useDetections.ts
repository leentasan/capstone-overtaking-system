'use client';

import { useEffect } from 'react';
import { fetchDetections } from '@/lib/supabase';
import { useDetectionStore } from '@/stores/useDetectionStore';

export function useDetections() {
  const { setDetections, setLoading, dateRange } = useDetectionStore();

  useEffect(() => {
    async function loadDetections() {
      setLoading(true);
      try {
        const data = await fetchDetections(50, dateRange || undefined);
        setDetections(data);
      } catch (error) {
        console.error('Error fetching detections:', error);
      } finally {
        setLoading(false);
      }
    }

    loadDetections();
  }, [dateRange, setDetections, setLoading]);
}