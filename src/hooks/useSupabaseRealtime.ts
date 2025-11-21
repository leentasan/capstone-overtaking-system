'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useDetectionStore } from '@/stores/useDetectionStore';
import { fetchStats } from '@/lib/supabase';
import { Detection } from '@/types';

export function useSupabaseRealtime() {
  const { addDetection, updateDetection, setStats, dateRange } = useDetectionStore();

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

          // Tunggu sebentar biar image sempat ke-insert
          await new Promise(resolve => setTimeout(resolve, 500));

          // Fetch full data dari view langsung (sudah include image_url)
          const { data: fullData, error } = await supabase
            .from('clean_dashboard_with_images')
            .select('*')
            .eq('id', payload.new.id)
            .single();

          if (error) {
            console.error('❌ Error fetching full detection:', error);
            // Fallback: pakai data dari payload tanpa image
            addDetection({
              ...payload.new,
              image_url: null,
            } as Detection);
          } else {
            console.log('✅ Full detection with image:', fullData);
            addDetection(fullData as Detection);
          }

          // Refresh stats
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
        async (payload) => {
          console.log('🔄 Updated detection:', payload.new);

          // Fetch full data dari view
          const { data: fullData } = await supabase
            .from('clean_dashboard_with_images')
            .select('*')
            .eq('id', payload.new.id)
            .single();

          if (fullData) {
            updateDetection(payload.new.id, fullData as Partial<Detection>);
          } else {
            updateDetection(payload.new.id, payload.new as Partial<Detection>);
          }

          // Refresh stats
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
          event: 'INSERT',
          schema: 'public',
          table: 'overtaking_images',
        },
        async (payload) => {
          console.log('🖼️ New image uploaded:', payload.new);
          
          // Update detection yang udah ada dengan image baru
          const { data: fullData } = await supabase
            .from('clean_dashboard_with_images')
            .select('*')
            .eq('id', payload.new.overtaking_log_id)
            .single();
          
          if (fullData) {
            updateDetection(payload.new.overtaking_log_id, fullData as Partial<Detection>);
          }
        }
      )
      .subscribe((status) => {
        console.log('Realtime status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [addDetection, updateDetection, setStats, dateRange]);
}