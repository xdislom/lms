import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState = ({ title = 'Xatolik yuz berdi', message = 'Ma\'lumotni yuklashda xatolik yuz berdi. Iltimos qaytadan urinib ko\'ring.', onRetry }: ErrorStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-destructive/20 rounded-lg bg-destructive/5 text-destructive">
      <AlertTriangle className="w-12 h-12 mb-4 opacity-80" />
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="mt-1 mb-4 text-sm opacity-80 max-w-md">{message}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry} className="border-destructive/30 hover:bg-destructive hover:text-destructive-foreground">
          Qaytadan urinish
        </Button>
      )}
    </div>
  );
};
