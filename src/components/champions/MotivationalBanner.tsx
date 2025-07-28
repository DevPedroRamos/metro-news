import React from 'react';

export const MotivationalBanner: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-metro-red via-red-500 to-metro-red text-white rounded-2xl p-8 mb-6 relative overflow-hidden shadow-2xl">
      {/* Efeitos de fundo animados */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-white to-yellow-400"></div>
      
      <div className="flex items-center justify-between relative z-10">
        <div className="flex-1">
          <div className="mb-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-sm">
              🎮 MODO GAMIFICAÇÃO ATIVO
            </span>
          </div>
          <p className="text-xl font-bold leading-relaxed mb-2">
            De pessoas para pessoas: juntos{' '}
            <span className="bg-white text-red-600 px-3 py-1 rounded-xl font-black shadow-lg">
              construímos
            </span>{' '}
            o{' '}
            <span className="bg-white text-red-600 px-3 py-1 rounded-xl font-black shadow-lg">
              futuro
            </span>
          </p>
          <p className="text-sm opacity-90 font-medium">
            🏆 Compete, evolua e seja reconhecido pelos seus resultados!
          </p>
        </div>
        <div className="flex-shrink-0 ml-8">
          <img 
            src="/lovable-uploads/e453533d-276d-404c-947e-d5bf9f2c73cb.png" 
            alt="Profissionais"
            className="w-48 h-32 object-contain filter drop-shadow-2xl hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>
    </div>
  );
};