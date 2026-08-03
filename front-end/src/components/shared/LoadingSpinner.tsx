import { Loader2 } from 'lucide-react';
import React from 'react';

export const LoadingSpinner = ({ className }: { className?: string }) => {
  return (
    <div className={`flex items-center justify-center w-full h-full p-8 ${className || ''}`}>
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
    </div>
  );
};
