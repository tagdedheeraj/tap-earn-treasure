
import React from 'react';
import { Sparkles, Coins } from 'lucide-react';

interface Reward {
  points: number;
  color: string;
  label: string;
  icon: React.ComponentType<any>;
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
    <div className="relative mx-auto w-80 h-80">
      {/* Multiple glowing rings */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 opacity-60 blur-2xl animate-pulse"></div>
      <div className="absolute inset-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-40 blur-xl animate-pulse"></div>
      
      {/* Main wheel container with enhanced border */}
      <div className="absolute inset-4 rounded-full border-8 border-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 bg-white shadow-2xl overflow-hidden">
        <div className="absolute inset-0 rounded-full border-4 border-white/50"></div>
        
        <div 
          className={`w-full h-full rounded-full transition-transform ease-out relative ${isSpinning ? 'duration-[4000ms]' : 'duration-1000'}`}
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {rewards.map((reward, index) => {
            const angle = (360 / rewards.length) * index;
            const nextAngle = (360 / rewards.length) * (index + 1);
            const Icon = reward.icon;
            
            return (
              <div
                key={index}
                className={`absolute w-full h-full bg-gradient-to-br ${reward.color} opacity-95 hover:opacity-100 transition-all duration-300`}
                style={{
                  clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos((angle * Math.PI) / 180)}% ${50 + 50 * Math.sin((angle * Math.PI) / 180)}%, ${50 + 50 * Math.cos((nextAngle * Math.PI) / 180)}% ${50 + 50 * Math.sin((nextAngle * Math.PI) / 180)}%)`,
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div 
                    className="text-white font-bold text-center transform"
                    style={{ 
                      transform: `rotate(${angle + 22.5}deg) translateY(-60px)`,
                      transformOrigin: '50% 60px'
                    }}
                  >
                    <Icon className="w-6 h-6 mx-auto mb-1 drop-shadow-lg" />
                    <div className="text-xl font-black drop-shadow-lg bg-black/20 rounded px-2 py-1">
                      {reward.label}
                    </div>
                    <div className="text-xs font-bold opacity-90 mt-1">COINS</div>
                  </div>
                </div>
                
                {/* Segment separator lines */}
                <div 
                  className="absolute top-0 left-1/2 w-0.5 h-full bg-white/30 transform -translate-x-1/2"
                  style={{ transformOrigin: '50% 100%', transform: `translateX(-50%) rotate(${angle}deg)` }}
                ></div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Enhanced 3D Pointer */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-3 z-30">
        <div className="relative">
          <div className="w-0 h-0 border-l-8 border-r-8 border-b-16 border-l-transparent border-r-transparent border-b-yellow-500 drop-shadow-2xl filter brightness-110"></div>
          <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mx-auto -mt-2 border-4 border-white shadow-xl"></div>
          <div className="absolute inset-0 bg-white/30 rounded-full animate-ping"></div>
        </div>
      </div>
      
      {/* Enhanced Center circle */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-br from-yellow-400 via-orange-500 to-yellow-600 rounded-full z-20 flex items-center justify-center border-6 border-white shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-full"></div>
        <Sparkles className={`w-8 h-8 text-white relative z-10 ${isSpinning ? 'animate-spin' : 'animate-pulse'}`} />
      </div>

      {/* Win amount display with enhanced animation */}
      {wonAmount && !isSpinning && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40">
          <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 text-white px-8 py-4 rounded-2xl text-2xl font-black animate-bounce border-4 border-white shadow-2xl">
            <div className="flex items-center gap-2">
              <Coins className="w-6 h-6 animate-spin" />
              +{wonAmount}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WheelContainer;
