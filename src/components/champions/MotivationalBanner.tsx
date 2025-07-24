import React from 'react';

export const MotivationalBanner: React.FC = () => {
  return (
    <div className="bg-red-600 text-white rounded-lg p-8 mb-6 relative overflow-hidden">
      <div className="flex items-center justify-between relative z-10">
        <div className="flex-1">
          <p className="text-lg font-medium leading-relaxed">
            De pessoas para pessoas: juntos{' '}
            <span className="bg-white text-red-600 px-2 py-1 rounded font-bold">
              construímos
            </span>{' '}
            o{' '}
            <span className="bg-white text-red-600 px-2 py-1 rounded font-bold">
              futuro
            </span>
          </p>
        </div>
        <div className="flex-shrink-0 ml-8">
          <img 
            src="/lovable-uploads/e453533d-276d-404c-947e-d5bf9f2c73cb.png" 
            alt="Profissionais"
            className="w-48 h-32 object-contain"
          />
        </div>
      </div>
    </div>
  );
};