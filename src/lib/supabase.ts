import { createClient } from '@supabase/supabase-js';
import { Detection, Stats } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

console.log('Supabase URL:', supabaseUrl); // Debug
console.log('Supabase Key exists:', !!supabaseAnonKey); // Debug

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test connection
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

export async function fetchDetections(limit: number = 50): Promise<Detection[]> {
  try {
    console.log('🔍 Attempting to fetch from overtaking_logs...');
    
    const { data, error } = await supabase
      .from('overtaking_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    // Log error detail lengkap
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

export async function fetchStats(): Promise<Stats> {
  try {
    console.log('🔍 Fetching stats...');
    
    const { data, error } = await supabase
      .from('overtaking_logs')
      .select('*');

    if (error) {
      console.error('❌ Stats Error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      
      // Return default stats on error
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