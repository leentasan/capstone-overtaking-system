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
// import { ImageLightbox } from './ImageLightbox';
import { formatTime, getVehicleTypeLabel } from '@/lib/utils';
import { Detection } from '@/types';
// import Image from 'next/image';
import { cn } from '@/lib/utils';

export function LogTable() {
  const { detections, isLoading } = useDetectionStore();
  // const [selectedDetection, setSelectedDetection] = useState<Detection | null>(null);

  console.log('🖼️ Detections with images:', detections.map(d => ({
    id: d.id,
    image_url: d.image_url,
    has_image: !!d.image_url
  })));
  
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
              <TableHead className="pl-6 py-4">Time</TableHead>
              {/* <TableHead className="py-4">Image</TableHead> */}
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
                  <TableCell className="font-medium py-6 pl-6">
                    {formatTime(detection.created_at)}
                  </TableCell>

                  {/* Image Cell - Commented */}
                  {/* <TableCell className="py-6">
                    {detection.image_url ? (
                      <div
                        className="relative w-16 h-16 cursor-pointer hover:opacity-80 transition-opacity rounded overflow-hidden"
                        onClick={() => setSelectedDetection(detection)}
                      >
                        <Image
                          src={detection.image_url}
                          alt={`Detection ${detection.id}`}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">
                        No Image
                      </div>
                    )}
                  </TableCell> */}

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

      {/* Lightbox - Commented */}
      {/* {selectedDetection && (
        <ImageLightbox
          detection={selectedDetection}
          open={!!selectedDetection}
          onClose={() => setSelectedDetection(null)}
        />
      )} */}
    </>
  );
}