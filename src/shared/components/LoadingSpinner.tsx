import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

export function LoadingSpinner({ size = 'md', message, className }: LoadingSpinnerProps) {
  return (
    <div
      className={cn('flex items-center justify-center gap-3', className)}
      role="status"
      aria-live="polite"
      aria-label={message || 'Carregando'}
    >
      <Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} aria-hidden="true" />
      {message && <span className="text-sm text-muted-foreground">{message}</span>}
      <span className="sr-only">{message || 'Carregando'}</span>
    </div>
  );
}
