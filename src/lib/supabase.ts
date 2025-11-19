import { createClient } from '@supabase/supabase-js';
import { Detection, Stats, DateRange } from '@/types';

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

// Fetch detections with optional date range filter
export async function fetchDetections(limit: number = 50, dateRange?: DateRange): Promise<Detection[]> {
  try {
    console.log('🔍 Attempting to fetch from overtaking_logs...');
    
    let query = supabase
      .from('overtaking_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    // Apply date range filter if provided
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

// Fetch stats with smart filtering:
// - Always calculate todayCount and currentMonthCount from ALL data
// - Other metrics use filtered data (if dateRange provided)
export async function fetchStats(dateRange?: DateRange): Promise<Stats> {
  try {
    console.log('🔍 Fetching stats...');
    
    // STEP 1: Fetch ALL data (for today & current month calculation)
    const { data: allData, error: allError } = await supabase
      .from('overtaking_logs')
      .select('*');

    if (allError) {
      console.error('❌ Stats Error:', {
        message: allError.message,
        details: allError.details,
        hint: allError.hint,
        code: allError.code
      });
      
      return {
        totalDetections: 0,
        todayCount: 0,
        currentMonthCount: 0,
        overtakingCount: 0,
        averageSpeed: 0,
        safeCount: 0,
        unsafeCount: 0,
        safeRatio: 0,
      };
    }

    // STEP 2: Calculate TODAY count (always from all data)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayEnd = new Date(today);
    todayEnd.setHours(23, 59, 59, 999);
    
    const todayCount = allData?.filter(log => {
      const logDate = new Date(log.created_at);
      return logDate >= today && logDate <= todayEnd;
    }).length || 0;

    // STEP 3: Calculate CURRENT MONTH count (always from all data)
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);
    
    const currentMonthCount = allData?.filter(log => {
      const logDate = new Date(log.created_at);
      return logDate >= currentMonth;
    }).length || 0;

    // STEP 4: Apply date range filter for other metrics
    let filteredData = allData || [];
    
    if (dateRange?.from || dateRange?.to) {
      filteredData = allData?.filter(log => {
        const logDate = new Date(log.created_at);
        
        if (dateRange.from) {
          const fromDate = new Date(dateRange.from);
          fromDate.setHours(0, 0, 0, 0);
          if (logDate < fromDate) return false;
        }
        
        if (dateRange.to) {
          const toDate = new Date(dateRange.to);
          toDate.setHours(23, 59, 59, 999);
          if (logDate > toDate) return false;
        }
        
        return true;
      }) || [];
    }

    console.log('✅ Stats data - All:', allData?.length, 'Filtered:', filteredData.length);
    console.log('📊 Today:', todayCount, 'Current Month:', currentMonthCount);

    // STEP 5: Calculate metrics from filtered data
    const totalDetections = filteredData.length;
    
    const safeCount = filteredData.filter(log => log.feasibility_result === 'safe').length;
    const unsafeCount = filteredData.filter(log => log.feasibility_result === 'unsafe').length;
    
    const speedValues = filteredData
      .filter(log => log.vehicle_speed !== null)
      .map(log => log.vehicle_speed!);
    
    const averageSpeed = speedValues.length > 0 
      ? speedValues.reduce((sum, speed) => sum + speed, 0) / speedValues.length 
      : 0;

    const safeRatio = totalDetections > 0 ? (safeCount / totalDetections) * 100 : 0;

    return {
      totalDetections,
      todayCount, // Always from all data
      currentMonthCount, // Always from all data
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
      currentMonthCount: 0,
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