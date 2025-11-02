import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { FeasibilityStatus } from '@/types';

interface StatusBadgeProps {
  status: FeasibilityStatus;
  showIcon?: boolean;
}

export function StatusBadge({ status, showIcon = true }: StatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'safe':
        return {
          label: 'Safe',
          icon: '🟢',
          className: 'bg-green-500 hover:bg-green-600 text-white',
        };
      case 'unsafe':
        return {
          label: 'Unsafe',
          icon: '🔴',
          className: 'bg-red-500 hover:bg-red-600 text-white',
        };
      case 'warning_no_vehicle_detection':
        return {
          label: 'No Vehicle',
          icon: '⚠️',
          className: 'bg-yellow-500 hover:bg-yellow-600 text-white',
        };
      default:
        return {
          label: 'Processing',
          icon: '⏳',
          className: 'bg-gray-400 hover:bg-gray-500 text-white',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Badge className={cn('font-medium', config.className)}>
      {showIcon && <span className="mr-1">{config.icon}</span>}
      {config.label}
    </Badge>
  );
}