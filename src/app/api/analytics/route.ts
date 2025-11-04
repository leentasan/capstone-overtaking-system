import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface OvertakingLog {
  id: string;
  vehicle_type: string;
  classification_time: number;
  distance_ab: number;
  feasibility_result: string;
  feasibility_time: number;
  created_at: string;
  vehicle_speed: number;
  detected_length_m: number;
  ratio_hw: number;
}

export async function GET() {
  try {
    // Get today's date range (start and end of day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStart = today.toISOString();
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const todayEnd = tomorrow.toISOString();

    // Fetch today's data from Supabase
    const { data: logs, error } = await supabase
      .from('overtaking_logs')
      .select('*')
      .gte('created_at', todayStart)
      .lt('created_at', todayEnd)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }

    // If no data, return empty analytics
    if (!logs || logs.length === 0) {
      return NextResponse.json({
        trendData: Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          total: 0,
          safe: 0,
          unsafe: 0
        })),
        speedData: [
          { range: '0-500', count: 0, percentage: 0 },
          { range: '500-1000', count: 0, percentage: 0 },
          { range: '1000-1500', count: 0, percentage: 0 },
          { range: '1500-2000', count: 0, percentage: 0 },
          { range: '2000+', count: 0, percentage: 0 }
        ],
        metrics: {
          totalDetections: 0,
          systemAccuracy: 0,
          avgClassificationTime: 0,
          avgFeasibilityTime: 0,
          avgSpeed: 0,
          complianceRate: 0
        }
      });
    }

    // Calculate hourly trend data
    const hourlyData = Array.from({ length: 24 }, (_, hour) => {
      const hourLogs = logs.filter(log => {
        const logHour = new Date(log.created_at).getHours();
        return logHour === hour;
      });

      const safe = hourLogs.filter(log => log.feasibility_result === 'feasible').length;
      const unsafe = hourLogs.filter(log => log.feasibility_result === 'not_feasible').length;

      return {
        hour,
        total: hourLogs.length,
        safe,
        unsafe
      };
    });

    // Calculate speed distribution
    const speedRanges = {
      '0-500': 0,
      '500-1000': 0,
      '1000-1500': 0,
      '1500-2000': 0,
      '2000+': 0
    };

    logs.forEach(log => {
      const speed = log.vehicle_speed || 0;
      if (speed < 500) speedRanges['0-500']++;
      else if (speed < 1000) speedRanges['500-1000']++;
      else if (speed < 1500) speedRanges['1000-1500']++;
      else if (speed < 2000) speedRanges['1500-2000']++;
      else speedRanges['2000+']++;
    });

    const totalLogs = logs.length;
    const speedData = Object.entries(speedRanges).map(([range, count]) => ({
      range,
      count,
      percentage: totalLogs > 0 ? (count / totalLogs) * 100 : 0
    }));

    // Calculate metrics
    const safeCount = logs.filter(log => log.feasibility_result === 'feasible').length;
    const totalClassificationTime = logs.reduce((sum, log) => sum + (log.classification_time || 0), 0);
    const totalFeasibilityTime = logs.reduce((sum, log) => sum + (log.feasibility_time || 0), 0);
    const totalSpeed = logs.reduce((sum, log) => sum + (log.vehicle_speed || 0), 0);

    const metrics = {
      totalDetections: totalLogs,
      systemAccuracy: totalLogs > 0 ? (safeCount / totalLogs) * 100 : 0,
      avgClassificationTime: totalLogs > 0 ? totalClassificationTime / totalLogs : 0,
      avgFeasibilityTime: totalLogs > 0 ? totalFeasibilityTime / totalLogs : 0,
      avgSpeed: totalLogs > 0 ? totalSpeed / totalLogs : 0,
      complianceRate: totalLogs > 0 ? (safeCount / totalLogs) * 100 : 0
    };

    return NextResponse.json({
      trendData: hourlyData,
      speedData,
      metrics
    });

  } catch (error) {
    console.error('Error processing analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}