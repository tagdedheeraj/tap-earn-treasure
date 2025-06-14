
import React from 'react';
import { Star } from 'lucide-react';

const SpinWheelBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 3}s`
          }}
        >
          <Star className="w-2 h-2 text-yellow-300 opacity-60" />
        </div>
      ))}
    </div>
  );
};

export default SpinWheelBackground;
