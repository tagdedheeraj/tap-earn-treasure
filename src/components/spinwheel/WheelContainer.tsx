
import React from 'react';
import { Sparkles, Star } from 'lucide-react';

interface Reward {
  points: number;
  color: string;
  label: string;
  icon: any;
  rarity: string;
}

interface WheelContainerProps {
  rewards: Reward[];
  rotation: number;
  isSpinning: boolean;
  wonAmount: number | null;
}

const WheelContainer: React.FC<WheelContainerProps> = ({ 
  rewards, 
  rotation, 
  isSpinning, 
  wonAmount 
}) => {
  return (
    <div className="flex justify-center">
      <div className="relative w-80 h-80">
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 opacity-60 blur-2xl animate-pulse"></div>
        
        {/* Main wheel */}
        <div className="absolute inset-4 rounded-full border-8 border-yellow-400 bg-white shadow-2xl overflow-hidden">
          <div 
            className={`w-full h-full rounded-full transition-transform ease-out ${isSpinning ? 'duration-[3000ms]' : 'duration-1000'}`}
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            {rewards.map((reward, index) => {
              const angle = (360 / rewards.length) * index;
              const nextAngle = (360 / rewards.length) * (index + 1);
              const Icon = reward.icon;
              
              return (
                <div
                  key={index}
                  className={`absolute w-full h-full bg-gradient-to-br ${reward.color}`}
                  style={{
                    clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos((angle * Math.PI) / 180)}% ${50 + 50 * Math.sin((angle * Math.PI) / 180)}%, ${50 + 50 * Math.cos((nextAngle * Math.PI) / 180)}% ${50 + 50 * Math.sin((nextAngle * Math.PI) / 180)}%)`,
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div 
                      className="text-white font-bold text-center"
                      style={{ 
                        transform: `rotate(${angle + 22.5}deg) translateY(-60px)`,
                        transformOrigin: '50% 60px'
                      }}
                    >
                      <Icon className="w-5 h-5 mx-auto mb-1" />
                      <div className="text-lg font-black bg-black/20 rounded px-2 py-1">
                        {reward.label}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-30">
          <div className="w-0 h-0 border-l-6 border-r-6 border-b-12 border-l-transparent border-r-transparent border-b-yellow-500"></div>
          <div className="w-4 h-4 bg-yellow-500 rounded-full mx-auto -mt-1 border-2 border-white"></div>
        </div>
        
        {/* Center circle */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full z-20 flex items-center justify-center border-4 border-white shadow-xl">
          <Sparkles className={`w-6 h-6 text-white ${isSpinning ? 'animate-spin' : 'animate-pulse'}`} />
        </div>

        {/* Win amount display */}
        {wonAmount && !isSpinning && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40">
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl text-xl font-black animate-bounce border-4 border-white shadow-xl">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 animate-spin" />
                +{wonAmount}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WheelContainer;
