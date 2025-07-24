import React from 'react';
import { Button } from '@/components/ui/button';
import { Trophy } from 'lucide-react';

export const MotivationalBanner: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-primary-foreground/20 p-3 rounded-full">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold mb-1">Meta Mensal 2025</h2>
            <p className="text-primary-foreground/90">
              Supere seus limites e conquiste o topo do ranking!
            </p>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
        >
          Saber Mais
        </Button>
      </div>
    </div>
  );
};