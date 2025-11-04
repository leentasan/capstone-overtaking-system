// Types untuk semua data structure

export interface Detection {
  id: string;
  created_at: string;
  vehicle_type: 'mobil' | 'truk/bus sedang' | 'truk/bus besar'; // ✅ Updated
  detected_length_m: number;
  vehicle_speed: number | null;
  distance_ab: number | null;
  feasibility_result: 'safe' | 'unsafe' | 'warning_no_vehicle_detection' | null;
  image_url?: string;
}

export interface Stats {
  totalDetections: number;
  todayCount: number;
  overtakingCount: number; // unsafe count
  averageSpeed: number;
  safeCount: number;
  unsafeCount: number;
  safeRatio: number; // percentage
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
  }[];
}

export interface DateRange {
  from: Date;
  to: Date;
}

export type FeasibilityStatus = 'safe' | 'unsafe' | 'warning_no_vehicle_detection' | null;
export type VehicleType = 'mobil' | 'truk/bus sedang' | 'truk/bus besar';