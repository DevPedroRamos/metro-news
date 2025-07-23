import React from 'react';

const ProfileLoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex items-center gap-5">
        <div 
          className="w-14 h-14 rounded-full animate-spin"
          style={{
            background: 'conic-gradient(#ED1B24 10%, #235FAF, #16A85A, #ED1B24)',
            WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 15px), black 0)',
            mask: 'radial-gradient(farthest-side, transparent calc(100% - 15px), black 0)'
          }}
        />
        <img 
          src="/lovable-uploads/e694e1f5-9413-4775-bc42-153d43c49fa6.png" 
          alt="MetroNews" 
          className="h-14"
        />
      </div>
    </div>
  );
};

export default ProfileLoadingSpinner;