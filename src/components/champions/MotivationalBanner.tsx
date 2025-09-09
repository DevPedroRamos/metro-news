import React from 'react';
import copaMetrocasa from '@/assets/Copa-Metrocasa.png';

export const MotivationalBanner: React.FC = () => {
  return (
    <div className="w-full flex justify-center my-6">
      <div className="w-full overflow-hidden">
        <img 
          src={copaMetrocasa} 
          alt="Copa Metrocasa"
          className="w-full h-auto rounded-lg"
          style={{ borderRadius: '8px' }}
        />
      </div>
    </div>
  );
};