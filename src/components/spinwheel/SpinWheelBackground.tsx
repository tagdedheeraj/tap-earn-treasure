
import React from 'react';
import { Coins, Star, Sparkles } from 'lucide-react';

const SpinWheelBackground = () => {
  return (
    <>
      {/* Enhanced animated background with multiple layers */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Twinkling stars */}
        {[...Array(30)].map((_, i) => (
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
        
        {/* Glowing dots */}
        {[...Array(40)].map((_, i) => (
          <div
            key={`dot-${i}`}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${1.5 + Math.random() * 2}s`
            }}
          >
            <div className="w-1 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-70 shadow-lg"></div>
          </div>
        ))}
      </div>

      {/* Floating coins animation with better positioning */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={`coin-${i}`}
            className="absolute animate-bounce"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2.5 + Math.random() * 1.5}s`
            }}
          >
            <Coins className="w-4 h-4 text-yellow-400 opacity-50 drop-shadow-lg" />
          </div>
        ))}
      </div>

      {/* Floating sparkles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={`sparkle-${i}`}
            className="absolute animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            <Sparkles className="w-3 h-3 text-white opacity-30" />
          </div>
        ))}
      </div>

      {/* Gradient overlay circles for depth */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
    </>
  );
};

export default SpinWheelBackground;
