import { createClient } from '@supabase/supabase-js';
import { Detection, Stats, DateRange } from '@/types'; // 👈 TAMBAH DateRange

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key exists:', !!supabaseAnonKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function testConnection() {
  try {
    const { data, error } = await supabase.from('overtaking_logs').select('count');
    console.log('Connection test:', { data, error });
    return !error;
  } catch (err) {
    console.error('Connection failed:', err);
    return false;
  }
}

// 👇 TAMBAH parameter dateRange (optional)
export async function fetchDetections(limit: number = 50, dateRange?: DateRange): Promise<Detection[]> {
  try {
    console.log('🔍 Attempting to fetch from overtaking_logs...');
    
    let query = supabase
      .from('overtaking_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    // 👇 TAMBAH filter dateRange jika ada
    if (dateRange?.from) {
      query = query.gte('created_at', dateRange.from.toISOString());
    }
    if (dateRange?.to) {
      const toDate = new Date(dateRange.to);
      toDate.setHours(23, 59, 59, 999); // Include seluruh hari
      query = query.lte('created_at', toDate.toISOString());
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ Supabase Error Details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return [];
    }

    console.log('✅ Fetched logs:', data?.length || 0);
    return data || [];
  } catch (error: any) {
    console.error('❌ Fetch failed:', error);
    return [];
  }
}

// 👇 TAMBAH parameter dateRange (optional)
export async function fetchStats(dateRange?: DateRange): Promise<Stats> {
  try {
    console.log('🔍 Fetching stats...');
    
    let query = supabase.from('overtaking_logs').select('*');

    // 👇 TAMBAH filter dateRange jika ada
    if (dateRange?.from) {
      query = query.gte('created_at', dateRange.from.toISOString());
    }
    if (dateRange?.to) {
      const toDate = new Date(dateRange.to);
      toDate.setHours(23, 59, 59, 999);
      query = query.lte('created_at', toDate.toISOString());
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ Stats Error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      
      return {
        totalDetections: 0,
        todayCount: 0,
        overtakingCount: 0,
        averageSpeed: 0,
        safeCount: 0,
        unsafeCount: 0,
        safeRatio: 0,
      };
    }

    console.log('✅ Stats data count:', data?.length || 0);

    const totalDetections = data?.length || 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = data?.filter(log => {
      const logDate = new Date(log.created_at);
      return logDate >= today;
    }).length || 0;

    const safeCount = data?.filter(log => log.feasibility_result === 'safe').length || 0;
    const unsafeCount = data?.filter(log => log.feasibility_result === 'unsafe').length || 0;
    
    const speedValues = data?.filter(log => log.vehicle_speed !== null).map(log => log.vehicle_speed!) || [];
    const averageSpeed = speedValues.length > 0 
      ? speedValues.reduce((sum, speed) => sum + speed, 0) / speedValues.length 
      : 0;

    const safeRatio = totalDetections > 0 ? (safeCount / totalDetections) * 100 : 0;

    return {
      totalDetections,
      todayCount,
      overtakingCount: unsafeCount,
      averageSpeed: Math.round(averageSpeed * 100) / 100,
      safeCount,
      unsafeCount,
      safeRatio: Math.round(safeRatio * 100) / 100,
    };
  } catch (error: any) {
    console.error('❌ Stats failed:', error);
    return {
      totalDetections: 0,
      todayCount: 0,
      overtakingCount: 0,
      averageSpeed: 0,
      safeCount: 0,
      unsafeCount: 0,
      safeRatio: 0,
    };
  }
}

// Re-export types
export type { DateRange } from '@/types';