'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Detection } from '@/types';
import { formatDate, getVehicleTypeLabel } from '@/lib/utils';
import { StatusBadge } from '../shared/StatusBadge';
import Image from 'next/image';

interface ImageLightboxProps {
  detection: Detection | null;
  open: boolean;
  onClose: () => void;
}

export function ImageLightbox({ detection, open, onClose }: ImageLightboxProps) {
  if (!detection) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Detection Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Image */}
          <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
            {detection.image_url ? (
              <Image
                src={detection.image_url}
                alt="Vehicle detection"
                fill
                className="object-contain"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No image available
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Time:</span>
              <p className="font-medium">{formatDate(detection.created_at)}</p>
            </div>
            <div>
              <span className="text-gray-500">Vehicle Type:</span>
              <p className="font-medium">{getVehicleTypeLabel(detection.vehicle_type)}</p>
            </div>
            <div>
              <span className="text-gray-500">Length:</span>
              <p className="font-medium">{detection.detected_length_m.toFixed(1)} m</p>
            </div>
            <div>
              <span className="text-gray-500">Speed:</span>
              <p className="font-medium">
                {detection.vehicle_speed ? `${detection.vehicle_speed} cm/s` : '-'}
              </p>
            </div>
            <div>
              <span className="text-gray-500">Distance:</span>
              <p className="font-medium">
                {detection.distance_ab ? `${detection.distance_ab} cm` : '-'}
              </p>
            </div>
            <div>
              <span className="text-gray-500">Feasibility:</span>
              <div className="mt-1">
                <StatusBadge status={detection.feasibility_result} />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}