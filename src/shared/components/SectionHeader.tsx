import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  action?: ReactNode;
  className?: string;
}

export function SectionHeader({ title, action, className }: SectionHeaderProps) {
  return (
    <div className={cn('flex justify-between items-center mb-6 md:mb-8', className)}>
      <div className="flex items-center gap-2">
        <div className="w-1 h-6 bg-primary rounded-full" aria-hidden="true" />
        <h2 className="text-xl md:text-2xl font-bold text-foreground">{title}</h2>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
