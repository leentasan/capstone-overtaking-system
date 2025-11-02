'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useDetectionStore } from '@/stores/useDetectionStore';
import { Detection } from '@/types';

export function useSupabaseRealtime() {
  const { addDetection, updateDetection } = useDetectionStore();

  useEffect(() => {
    // Subscribe to INSERT events (new detection)
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

          // Fetch image URL (karena INSERT tidak include join)
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
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'overtaking_logs',
        },
        (payload) => {
          console.log('🔄 Updated detection:', payload.new);

          updateDetection(payload.new.id, payload.new as Partial<Detection>);
        }
      )
      .subscribe((status) => {
        console.log('Realtime status:', status);
      });

    // Cleanup on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [addDetection, updateDetection]);
}