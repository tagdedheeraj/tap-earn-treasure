
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface SpinReward {
  id: number;
  type: 'coins' | 'points' | 'blank';
  amount: number;
  label: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
  actualAward: number;
}

interface SpinWheelDisplayProps {
  rewards: SpinReward[];
  currentRotation: number;
  isSpinning: boolean;
}

const SpinWheelDisplay = ({ rewards, currentRotation, isSpinning }: SpinWheelDisplayProps) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="relative w-72 h-72 mx-auto">
          {/* Pointer */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
            <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-red-500"></div>
          </div>
          
          {/* Wheel */}
          <div 
            className={`w-full h-full rounded-full relative overflow-hidden shadow-2xl border-8 border-white transition-transform duration-3000 ease-out ${isSpinning ? 'animate-spin' : ''}`}
            style={{ transform: `rotate(${currentRotation}deg)` }}
          >
            {rewards.map((reward, index) => {
              const angle = (360 / rewards.length) * index;
              const Icon = reward.icon;
              return (
                <div
                  key={reward.id}
                  className={`absolute w-1/2 h-1/2 origin-bottom-right bg-gradient-to-r ${reward.color}`}
                  style={{
                    transform: `rotate(${angle}deg)`,
                    clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                  }}
                >
                  <div 
                    className="absolute top-4 right-6 text-white text-center transform -rotate-90"
                    style={{ transform: `rotate(${-angle + 22.5}deg)` }}
                  >
                    <Icon className="w-3 h-3 mx-auto mb-1" />
                    <div className="text-xs font-bold whitespace-nowrap">{reward.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpinWheelDisplay;
