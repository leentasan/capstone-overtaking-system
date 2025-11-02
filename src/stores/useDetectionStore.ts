import { create } from 'zustand';
import { Detection, Stats, DateRange } from '@/types';

interface DetectionStore {
  // State
  detections: Detection[];
  stats: Stats | null;
  isLoading: boolean;
  dateRange: DateRange | null;
  
  // Actions
  setDetections: (detections: Detection[]) => void;
  addDetection: (detection: Detection) => void;
  updateDetection: (id: string, updates: Partial<Detection>) => void;
  setStats: (stats: Stats) => void;
  setLoading: (loading: boolean) => void;
  setDateRange: (range: DateRange | null) => void;
  
  // Clear all data
  reset: () => void;
}

export const useDetectionStore = create<DetectionStore>((set) => ({
  // Initial state
  detections: [],
  stats: null,
  isLoading: true,
  dateRange: null,
  
  // Actions
  setDetections: (detections) => set({ detections }),
  
  addDetection: (detection) =>
    set((state) => ({
      detections: [detection, ...state.detections],
    })),
  
  updateDetection: (id, updates) =>
    set((state) => ({
      detections: state.detections.map((d) =>
        d.id === id ? { ...d, ...updates } : d
      ),
    })),
  
  setStats: (stats) => set({ stats }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setDateRange: (dateRange) => set({ dateRange }),
  
  reset: () => set({
    detections: [],
    stats: null,
    isLoading: true,
    dateRange: null,
  }),
}));