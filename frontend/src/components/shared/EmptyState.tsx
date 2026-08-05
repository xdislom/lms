import React from 'react';
import { FileQuestion } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export const EmptyState = ({ title = 'Ma\'lumot topilmadi', description = 'Hozircha hech qanday ma\'lumot yo\'q.', icon }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed rounded-lg bg-card">
      <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-muted text-muted-foreground">
        {icon || <FileQuestion className="w-8 h-8" />}
      </div>
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
};
