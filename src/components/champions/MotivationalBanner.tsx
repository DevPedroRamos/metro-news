import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Trophy, Zap, Target } from 'lucide-react';

export const MotivationalBanner: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-metro-red via-red-500 to-metro-red text-white rounded-3xl p-8 mb-8 relative overflow-hidden shadow-2xl">
      {/* Efeitos de fundo animados */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse duration-3000"></div>
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-white to-yellow-400 animate-glow"></div>
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-full blur-2xl animate-float"></div>
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>
      
      <div className="flex items-center justify-between relative z-10">
        <div className="flex-1">
          <div className="mb-2">
            <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 px-4 py-2 text-sm font-bold animate-bounce-in">
              🎮 MODO GAMIFICAÇÃO ATIVO
            </Badge>
          </div>
          <p className="text-2xl font-bold leading-relaxed mb-4 animate-slide-in">
            De pessoas para pessoas: juntos{' '}
            <span className="bg-white text-red-600 px-4 py-2 rounded-xl font-black shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer">
              construímos
            </span>{' '}
            o{' '}
            <span className="bg-white text-red-600 px-4 py-2 rounded-xl font-black shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer">
              futuro
            </span>
          </p>
          <p className="text-base opacity-90 font-medium mb-4 animate-fade-in">
            🏆 Compete, evolua e seja reconhecido pelos seus resultados!
          </p>
          
          {/* Mini estatísticas */}
          <div className="flex items-center space-x-4 animate-slide-up">
            <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Trophy className="h-4 w-4 text-yellow-300" />
              <span className="text-sm font-bold">Top 10</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Zap className="h-4 w-4 text-green-300" />
              <span className="text-sm font-bold">+125 XP</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Target className="h-4 w-4 text-blue-300" />
              <span className="text-sm font-bold">Meta 85%</span>
            </div>
          </div>
        </div>
        <div className="flex-shrink-0 ml-8 animate-float">
          <img 
            src="/lovable-uploads/e453533d-276d-404c-947e-d5bf9f2c73cb.png" 
            alt="Profissionais"
            className="w-56 h-36 object-contain filter drop-shadow-2xl hover:scale-110 transition-transform duration-500 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};