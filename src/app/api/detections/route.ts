// app/api/detections/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from'); // ISO string
    const to = searchParams.get('to');     // ISO string

    console.log('🔍 Fetching detections with filters:', { from, to });

    // Base query - SELECT all fields needed
    let query = supabase
      .from('clean_dashboard_view')
      .select(`
        id,
        created_at,
        vehicle_type,
        classification_time,
        feasibility_time,
        total_process_time,
        detected_length_m,
        vehicle_speed,
        distance_ab,
        ratio_hw,
        feasibility_result
      `)
      .order('created_at', { ascending: false });

    // Apply date filters if provided
    if (from) {
      query = query.gte('created_at', from);
    }
    if (to) {
      query = query.lte('created_at', to);
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ Supabase error:', error);
      return NextResponse.json({ error: 'Failed to fetch detections' }, { status: 500 });
    }

    console.log('✅ Fetched detections:', data?.length || 0);

    // Return detections (no transformation needed if field names match)
    return NextResponse.json({ 
      detections: data || [],
      count: data?.length || 0
    });

  } catch (error) {
    console.error('❌ Error fetching detections:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}