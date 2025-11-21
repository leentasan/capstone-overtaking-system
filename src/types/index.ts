// Types untuk semua data structure

export interface Detection {
  id: string;
  created_at: string;
  vehicle_type: 'mobil' | 'truk/bus sedang' | 'truk/bus besar';
  
  // 🔥 ADD: Processing time fields dari database
  classification_time: number; // float8 - waktu klasifikasi dalam seconds
  feasibility_time: number; // float8 - waktu feasibility check dalam seconds
  total_process_time: number; // int4 - total waktu proses dalam milliseconds
  
  // Measurements
  detected_length_m: number;
  vehicle_speed: number | null;
  distance_ab: number | null;
  ratio_hw: number; // float8 - height/width ratio
  
  // Result
  feasibility_result: 'safe' | 'unsafe' | 'warning_no_vehicle_detection' | null;
  
  // Image (optional, dari overtaking_images join)
  image_url?: string | null; // 👈 TAMBAHKAN | null
}

export interface Stats {
  totalDetections: number;
  todayCount: number;
  currentMonthCount: number;
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

export {};