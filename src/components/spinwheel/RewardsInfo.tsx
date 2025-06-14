
import React from 'react';
import { Trophy } from 'lucide-react';

interface Reward {
  points: number;
  color: string;
  label: string;
  icon: React.ComponentType<any>;
  rarity: string;
}

interface RewardsInfoProps {
  rewards: Reward[];
  getRarityBorderColor: (rarity: string) => string;
}

const RewardsInfo: React.FC<RewardsInfoProps> = ({ rewards, getRarityBorderColor }) => {
  return (
    <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-lg rounded-2xl md:rounded-3xl p-4 md:p-6 border border-white/20">
      <h4 className="font-bold text-white mb-4 md:mb-6 text-center text-lg md:text-xl flex items-center justify-center gap-2 md:gap-3">
        <Trophy className="w-5 h-5 md:w-6 md:h-6 text-yellow-400" />
        <span className="text-sm md:text-xl">Today's Reward Pool</span>
        <Trophy className="w-5 h-5 md:w-6 md:h-6 text-yellow-400" />
      </h4>
      
      {/* Mobile: 2 columns, Tablet+: 4 columns */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
        {rewards.map((reward, index) => (
          <div key={index} className={`bg-gradient-to-br ${reward.color} text-white rounded-xl md:rounded-2xl py-3 md:py-4 px-2 md:px-3 text-center shadow-xl transform hover:scale-105 transition-all duration-300 border-2 ${getRarityBorderColor(reward.rarity)}`}>
            <reward.icon className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-2 drop-shadow-lg" />
            <div className="text-sm md:text-lg font-black drop-shadow-lg">{reward.points}</div>
            <div className="text-xs font-bold opacity-90">COINS</div>
            <div className={`text-xs mt-1 md:mt-2 bg-white/20 rounded-full px-1 md:px-2 py-1 font-medium`}>
              {reward.rarity}
            </div>
          </div>
        ))}
      </div>
      
      {/* Enhanced Statistics - Mobile Responsive */}
      <div className="mt-6 md:mt-8 bg-gradient-to-r from-white/10 to-white/5 rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/10">
        <div className="grid grid-cols-3 gap-3 md:gap-6 text-center">
          <div>
            <div className="text-xl md:text-3xl font-black text-yellow-400 mb-1 md:mb-2">1</div>
            <div className="text-xs md:text-sm text-white/80 font-medium">Free Spin/Day</div>
          </div>
          <div>
            <div className="text-xl md:text-3xl font-black text-green-400 mb-1 md:mb-2">50</div>
            <div className="text-xs md:text-sm text-white/80 font-medium">Max Coins</div>
          </div>
          <div>
            <div className="text-xl md:text-3xl font-black text-purple-400 mb-1 md:mb-2">10-50</div>
            <div className="text-xs md:text-sm text-white/80 font-medium">Range</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardsInfo;
