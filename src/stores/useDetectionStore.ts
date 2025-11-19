import { create } from 'zustand';
import { Detection, Stats, DateRange } from '@/types';
import { startOfMonth, endOfDay, startOfDay, isSameDay } from 'date-fns';

interface DetectionStore {
  // State
  detections: Detection[];
  stats: Stats | null;
  isLoading: boolean;
  dateRange: DateRange | null;
  error: string | null;
  
  // Actions
  setDetections: (detections: Detection[]) => void;
  addDetection: (detection: Detection) => void;
  updateDetection: (id: string, updates: Partial<Detection>) => void;
  setStats: (stats: Stats) => void;
  setLoading: (loading: boolean) => void;
  setDateRange: (range: DateRange | null) => void;
  fetchDetections: () => Promise<void>; // 🔥 NEW
  
  // Clear all data
  reset: () => void;
}

export const useDetectionStore = create<DetectionStore>((set, get) => ({
  // Initial state
  detections: [],
  stats: null,
  isLoading: true,
  dateRange: null,
  error: null,
  
  // Actions
  setDetections: (detections) => {
    const { dateRange } = get();
    const stats = calculateStats(detections, dateRange);
    set({ detections, stats });
  },
  
  addDetection: (detection) =>
    set((state) => {
      const newDetections = [detection, ...state.detections];
      const stats = calculateStats(newDetections, state.dateRange);
      return { detections: newDetections, stats };
    }),
  
  updateDetection: (id, updates) =>
    set((state) => {
      const newDetections = state.detections.map((d) =>
        d.id === id ? { ...d, ...updates } : d
      );
      const stats = calculateStats(newDetections, state.dateRange);
      return { detections: newDetections, stats };
    }),
  
  setStats: (stats) => set({ stats }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setDateRange: (dateRange) => {
    set({ dateRange });
    // 🔥 Auto-fetch when date range changes
    get().fetchDetections();
  },

  // 🔥 NEW: Fetch detections from API
  fetchDetections: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const { dateRange } = get();
      
      // Build query params
      const params = new URLSearchParams();
      
      if (dateRange) {
        // Convert date range to ISO strings
        params.set('from', startOfDay(dateRange.from).toISOString());
        params.set('to', endOfDay(dateRange.to).toISOString());
      }
      
      console.log('🔍 Fetching detections with params:', params.toString());

      // Fetch from API
      const response = await fetch(`/api/detections?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch detections');
      }

      const detections = data.detections || [];
      console.log('✅ Received detections:', detections.length);

      // Calculate stats
      const stats = calculateStats(detections, dateRange);

      set({ 
        detections, 
        stats,
        isLoading: false,
        error: null
      });

    } catch (error) {
      console.error('❌ Error fetching detections:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false 
      });
    }
  },
  
  reset: () => set({
    detections: [],
    stats: null,
    isLoading: true,
    dateRange: null,
    error: null,
  }),
}));

// 🔥 Helper function to calculate stats
function calculateStats(detections: Detection[], dateRange: DateRange | null): Stats {
  const now = new Date();
  const today = startOfDay(now);
  const monthStart = startOfMonth(now);

  // Filter for today
  const todayDetections = detections.filter(d => {
    const detectionDate = new Date(d.created_at);
    return isSameDay(detectionDate, today);
  });

  // Filter for current month
  const monthDetections = detections.filter(d => {
    const detectionDate = new Date(d.created_at);
    return detectionDate >= monthStart && detectionDate <= now;
  });

  // Calculate metrics from ALL filtered detections
  const totalDetections = detections.length;
  const safeCount = detections.filter(d => d.feasibility_result === 'safe').length;
  const unsafeCount = detections.filter(d => d.feasibility_result === 'unsafe').length;

  const speedsValid = detections
    .filter(d => d.vehicle_speed !== null && d.vehicle_speed !== undefined && d.vehicle_speed > 0)
    .map(d => d.vehicle_speed!);
  const averageSpeed = speedsValid.length > 0
    ? speedsValid.reduce((a, b) => a + b, 0) / speedsValid.length
    : 0;

  const safeRatio = totalDetections > 0 
    ? (safeCount / totalDetections) * 100 
    : 0;

  return {
    totalDetections,
    todayCount: todayDetections.length,
    currentMonthCount: monthDetections.length,
    overtakingCount: unsafeCount,
    averageSpeed,
    safeCount,
    unsafeCount,
    safeRatio
  };
}