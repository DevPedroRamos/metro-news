import React from 'react';
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useActiveVisits } from '@/hooks/useActiveVisits';
import { ActiveVisitsPopover } from './ActiveVisitsPopover';

export function VisitButton() {
  const { visits, loading, finalizeVisit } = useActiveVisits();
  const hasActiveVisits = visits.length > 0;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={`relative transition-all duration-300 ${
            hasActiveVisits 
              ? 'animate-pulse-glow bg-gradient-to-r from-metro-red to-red-500 text-white shadow-lg hover:shadow-xl' 
              : 'hover:bg-[#FF000F]/70 hover:shadow-md'
          }`}
        >
          <Clock className={`h-5 w-5 ${hasActiveVisits ? 'animate-scale-pulse' : ''}`} />
          {hasActiveVisits && (
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-metro-green rounded-full text-xs font-bold text-white flex items-center justify-center animate-scale-pulse">
              {visits.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent 
        align="end" 
        side="bottom" 
        className="p-0 border border-border shadow-lg"
        sideOffset={5}
      >
        <ActiveVisitsPopover 
          visits={visits}
          loading={loading}
          onFinalizeVisit={finalizeVisit}
        />
      </PopoverContent>
    </Popover>
  );
}