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
    // 🎯 FINAL FIX: Proper timezone handling untuk WIB
    
    // Step 1: Dapatkan tanggal HARI INI dalam timezone WIB
    const nowUTC = new Date();
    const formatter = new Intl.DateTimeFormat('en-CA', { 
      timeZone: 'Asia/Jakarta',
      year: 'numeric',
      month: '2-digit', 
      day: '2-digit'
    });
    
    const todayWIBDateString = formatter.format(nowUTC); // "2025-11-05"
    
    // Step 2: Buat range waktu untuk "hari ini WIB" dalam format ISO dengan timezone
    // Hari ini WIB 00:00:00 sampai 23:59:59
    const startWIB = `${todayWIBDateString}T00:00:00.000+07:00`;
    const endWIB = `${todayWIBDateString}T23:59:59.999+07:00`;
    
    // Step 3: Convert ke ISO UTC (JavaScript will handle conversion)
    const todayStart = new Date(startWIB).toISOString();
    const todayEnd = new Date(endWIB).toISOString();

    // 🔍 DEBUG
    console.log('📅 Current time (UTC):', nowUTC.toISOString());
    console.log('📅 Current time (WIB):', nowUTC.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
    console.log('📅 Today WIB date:', todayWIBDateString);
    console.log('📅 Query range (WIB):', { start: startWIB, end: endWIB });
    console.log('📅 Query range (UTC):', { start: todayStart, end: todayEnd });

    // Fetch today's data from Supabase
    const { data: logs, error } = await supabase
      .from('clean_dashboard_with_images')
      .select('*')
      .gte('created_at', todayStart)
      .lte('created_at', todayEnd)
      .order('created_at', { ascending: true });

    // 🔍 DEBUG: Log results dengan detail timestamp
    console.log('📊 Query results:', {
      error: error?.message || null,
      logsCount: logs?.length || 0,
      firstLogTime: logs?.[0]?.created_at || null,
      lastLogTime: logs?.[logs?.length - 1]?.created_at || null
    });

    // 🔍 DEBUG: Log ALL timestamps untuk investigasi
    if (logs && logs.length > 0) {
      console.log('🕐 All log timestamps (UTC → WIB):');
      logs.forEach((log, index) => {
        const utcDate = new Date(log.created_at);
        const wibString = utcDate.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });
        const wibDate = new Date(utcDate.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
        console.log(`  [${index}] UTC: ${log.created_at} → WIB: ${wibString} (Hour: ${wibDate.getHours()})`);
      });
    }

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }

    // If no data, return empty analytics
    if (!logs || logs.length === 0) {
      console.log('⚠️ No logs found for today');
      return NextResponse.json({
        trendData: Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          total: 0,
          safe: 0,
          unsafe: 0
        })),
        speedData: [
          { range: '0-5', count: 0, percentage: 0 },
          { range: '5-10', count: 0, percentage: 0 },
          { range: '10-15', count: 0, percentage: 0 },
          { range: '15-20', count: 0, percentage: 0 },
          { range: '20+', count: 0, percentage: 0 }
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

    console.log('✅ Processing', logs.length, 'logs');

    // 🔧 FIX: Calculate hourly trend data dengan WIB timezone yang benar
    const nowWIBDate = new Date(nowUTC.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
    const currentHourWIB = nowWIBDate.getHours();
    
    const hourlyData = Array.from({ length: 24 }, (_, hour) => {
      const hourLogs = logs.filter(log => {
        // Convert UTC timestamp to WIB
        const logDate = new Date(log.created_at);
        const logDateWIB = new Date(logDate.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
        const logHour = logDateWIB.getHours();
        
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

    console.log('🕐 Current hour (WIB):', currentHourWIB);
    console.log('📊 Hourly data:', hourlyData.filter(h => h.total > 0));

    // Calculate speed distribution
    const speedRanges = {
      '0-5': 0,
      '5-10': 0,
      '10-15': 0,
      '15-20': 0,
      '20+': 0
    };

    logs.forEach(log => {
      const speed = log.vehicle_speed || 0;
      if (speed < 5) speedRanges['0-5']++;
      else if (speed < 10) speedRanges['5-10']++;
      else if (speed < 15) speedRanges['10-15']++;
      else if (speed < 20) speedRanges['15-20']++;
      else speedRanges['20+']++;
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

    console.log('✅ Analytics calculated:', metrics);

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