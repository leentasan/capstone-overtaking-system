import { FileQuestion } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export function EmptyState({
  title = 'No data available',
  description = 'There are no detections to display yet.',
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {icon || <FileQuestion className="h-16 w-16 text-gray-300 mb-4" />}
      <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 max-w-md">{description}</p>
    </div>
  );
}