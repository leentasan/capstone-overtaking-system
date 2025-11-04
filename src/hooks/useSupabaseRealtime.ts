'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useDetectionStore } from '@/stores/useDetectionStore';
import { fetchStats } from '@/lib/supabase'; // 👈 TAMBAH INI
import { Detection } from '@/types';

export function useSupabaseRealtime() {
  const { addDetection, updateDetection, setStats, dateRange } = useDetectionStore(); // 👈 TAMBAH setStats & dateRange

  useEffect(() => {
    const channel = supabase
      .channel('detections-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'overtaking_logs',
        },
        async (payload) => {
          console.log('🆕 New detection:', payload.new);

          const { data: imageData } = await supabase
            .from('overtaking_images')
            .select('image_url')
            .eq('overtaking_log_id', payload.new.id)
            .single();

          const newDetection: Detection = {
            ...payload.new,
            image_url: imageData?.image_url || null,
          } as Detection;

          addDetection(newDetection);

          // 👇 TAMBAH INI - Refresh stats setelah data baru masuk
          try {
            const updatedStats = await fetchStats(dateRange || undefined);
            setStats(updatedStats);
          } catch (error) {
            console.error('Error refreshing stats:', error);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'overtaking_logs',
        },
        async (payload) => { // 👈 TAMBAH async
          console.log('🔄 Updated detection:', payload.new);

          updateDetection(payload.new.id, payload.new as Partial<Detection>);

          // 👇 TAMBAH INI - Refresh stats setelah update
          try {
            const updatedStats = await fetchStats(dateRange || undefined);
            setStats(updatedStats);
          } catch (error) {
            console.error('Error refreshing stats:', error);
          }
        }
      )
      .subscribe((status) => {
        console.log('Realtime status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [addDetection, updateDetection, setStats, dateRange]); // 👈 TAMBAH setStats & dateRange
}