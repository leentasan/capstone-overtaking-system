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
import { ImageLightbox } from './ImageLightbox';
import { formatTime, getVehicleTypeLabel } from '@/lib/utils';
import { Detection } from '@/types';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export function LogTable() {
  const { detections, isLoading } = useDetectionStore();
  const [selectedDetection, setSelectedDetection] = useState<Detection | null>(null);

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
              <TableHead>Time</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Vehicle Type</TableHead>
              <TableHead>Length</TableHead>
              <TableHead>Speed</TableHead>
              <TableHead>Distance</TableHead>
              <TableHead>Feasibility</TableHead>
              <TableHead>Status</TableHead>
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
                  <TableCell className="font-medium">
                    {formatTime(detection.created_at)}
                  </TableCell>

                  <TableCell>
                    {detection.image_url ? (
                      <div
                        className="relative w-16 h-16 cursor-pointer hover:opacity-80 transition-opacity rounded-lg overflow-hidden"
                        onClick={() => setSelectedDetection(detection)}
                      >
                        <Image
                          src={detection.image_url}
                          alt="Vehicle"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                        No image
                      </div>
                    )}
                  </TableCell>

                  <TableCell>
                    {getVehicleTypeLabel(detection.vehicle_type)}
                  </TableCell>

                  <TableCell>{detection.detected_length_m.toFixed(1)} m</TableCell>

                  <TableCell>
                    {detection.vehicle_speed ? (
                      `${detection.vehicle_speed} km/h`
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>

                  <TableCell>
                    {detection.distance_ab ? (
                      `${detection.distance_ab} m`
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>

                  <TableCell>
                    <StatusBadge status={detection.feasibility_result} />
                  </TableCell>

                  <TableCell>
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

      <ImageLightbox
        detection={selectedDetection}
        open={!!selectedDetection}
        onClose={() => setSelectedDetection(null)}
      />
    </>
  );
}