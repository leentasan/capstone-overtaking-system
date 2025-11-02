import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Chart colors for Traffic Chart
export const chartColors = {
  motor: '#3b82f6',    // blue
  mobil: '#10b981',    // green
  truk: '#f59e0b',     // amber
  bus: '#8b5cf6',      // purple
  
  // Alias untuk backward compatibility
  primary: '#3b82f6',
  secondary: '#10b981',
  tertiary: '#f59e0b',
  quaternary: '#8b5cf6',
  
  background: {
    motor: 'rgba(59, 130, 246, 0.2)',
    mobil: 'rgba(16, 185, 129, 0.2)',
    truk: 'rgba(245, 158, 11, 0.2)',
    bus: 'rgba(139, 92, 246, 0.2)',
  }
};

// Format timestamp to readable time (HH:MM:SS)
export function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

// Format timestamp to readable date (DD/MM/YYYY HH:MM)
export function formatDate(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Format date only (DD/MM/YYYY)
export function formatDateOnly(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

// Format date to ISO string (YYYY-MM-DD)
export function formatDateISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Get vehicle type label in Indonesian
export function getVehicleTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    motor: 'Motor',
    mobil: 'Mobil',
    truk: 'Truk',
    bus: 'Bus',
    motorcycle: 'Motor',
    car: 'Mobil',
    truck: 'Truk',
  };
  return labels[type.toLowerCase()] || type;
}

// Get vehicle type color
export function getVehicleTypeColor(type: string): string {
  const colors: Record<string, string> = {
    motor: 'bg-blue-500',
    mobil: 'bg-green-500',
    truk: 'bg-amber-500',
    bus: 'bg-purple-500',
    motorcycle: 'bg-blue-500',
    car: 'bg-green-500',
    truck: 'bg-amber-500',
  };
  return colors[type.toLowerCase()] || 'bg-gray-500';
}

// Format confidence percentage
export function formatConfidence(confidence: number): string {
  return `${(confidence * 100).toFixed(1)}%`;
}

// Get confidence color class
export function getConfidenceColor(confidence: number): string {
  if (confidence >= 0.9) return 'text-green-600';
  if (confidence >= 0.7) return 'text-yellow-600';
  return 'text-red-600';
}

// Truncate text
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// Get relative time (e.g., "5 minutes ago")
export function getRelativeTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds} detik yang lalu`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit yang lalu`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam yang lalu`;
  return `${Math.floor(diffInSeconds / 86400)} hari yang lalu`;
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}