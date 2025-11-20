'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useDetectionStore } from '@/stores/useDetectionStore';
import { StatusBadge } from '../shared/StatusBadge';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { EmptyState } from '../shared/EmptyState';
// import { ImageLightbox } from './ImageLightbox'; // Bisa di-remove kalau image beneran gak dipake
import { formatTime, getVehicleTypeLabel } from '@/lib/utils';
import { Detection } from '@/types';
// import Image from 'next/image'; // Bisa di-remove
import { cn } from '@/lib/utils';

export function LogTable() {
  const { detections, isLoading } = useDetectionStore();
  // const [selectedDetection, setSelectedDetection] = useState<Detection | null>(null); // Unused state kalau image gada

  if (isLoading) {
    return (
      <div className="py-12">
        <LoadingSpinner text="Loading detections..." />
      </div>
    );
  }

  if (detections.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {/* Tambah py-4 di header juga biar seimbang */}
              <TableHead className=" pl-6 py-4">Time</TableHead>
              {/* Kolom Image Dihapus */}
              <TableHead className="py-4">Vehicle Type</TableHead>
              <TableHead className="py-4">Length</TableHead>
              <TableHead className="py-4">Speed</TableHead>
              <TableHead className="py-4">Distance</TableHead>
              <TableHead className="py-4">Feasibility</TableHead>
              <TableHead className="py-4">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {detections.map((detection) => {
              const isProcessing = !detection.feasibility_result;

              return (
                <TableRow
                  key={detection.id}
                  className={cn(
                    'transition-all duration-300',
                    isProcessing && 'bg-yellow-50/50'
                  )}
                >
                  {/* TIPS: Tambahkan class 'py-6' (atau py-8) di setiap TableCell 
                      untuk menambah jarak atas-bawah (padding vertical).
                  */}
                  
                  <TableCell className="font-medium py-6 pl-6">
                    {formatTime(detection.created_at)}
                  </TableCell>

                  {/* Kolom Image Cell Dihapus */}

                  <TableCell className="py-6">
                    {getVehicleTypeLabel(detection.vehicle_type)}
                  </TableCell>

                  <TableCell className="py-6">
                    {detection.detected_length_m.toFixed(1)} cm
                  </TableCell>

                  <TableCell className="py-6">
                    {detection.vehicle_speed ? (
                      `${detection.vehicle_speed} cm/s`
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>

                  <TableCell className="py-6">
                    {detection.distance_ab ? (
                      `${detection.distance_ab} cm`
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>

                  <TableCell className="py-6">
                    <StatusBadge status={detection.feasibility_result} />
                  </TableCell>

                  <TableCell className="py-6">
                    {isProcessing ? (
                      <span className="flex items-center gap-2 text-sm text-gray-500">
                        <span className="animate-spin">⏳</span>
                        Processing
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-sm text-green-600">
                        ✅ Complete
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Lightbox dihapus/dikomen karena tidak ada trigger gambarnya lagi */}
      {/* <ImageLightbox
        detection={selectedDetection}
        open={!!selectedDetection}
        onClose={() => setSelectedDetection(null)}
      /> */}
    </>
  );
}