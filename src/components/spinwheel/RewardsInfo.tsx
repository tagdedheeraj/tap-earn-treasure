
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
    <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
      <h4 className="font-bold text-white mb-6 text-center text-xl flex items-center justify-center gap-3">
        <Trophy className="w-6 h-6 text-yellow-400" />
        Today's Reward Pool
        <Trophy className="w-6 h-6 text-yellow-400" />
      </h4>
      <div className="grid grid-cols-4 gap-3">
        {rewards.map((reward, index) => (
          <div key={index} className={`bg-gradient-to-br ${reward.color} text-white rounded-2xl py-4 px-3 text-center shadow-xl transform hover:scale-105 transition-all duration-300 border-2 ${getRarityBorderColor(reward.rarity)}`}>
            <reward.icon className="w-5 h-5 mx-auto mb-2 drop-shadow-lg" />
            <div className="text-lg font-black drop-shadow-lg">{reward.points}</div>
            <div className="text-xs font-bold opacity-90">COINS</div>
            <div className={`text-xs mt-2 bg-white/20 rounded-full px-2 py-1 font-medium`}>
              {reward.rarity}
            </div>
          </div>
        ))}
      </div>
      
      {/* Enhanced Statistics */}
      <div className="mt-8 bg-gradient-to-r from-white/10 to-white/5 rounded-2xl p-6 border border-white/10">
        <div className="grid grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl font-black text-yellow-400 mb-2">1</div>
            <div className="text-sm text-white/80 font-medium">Free Spin/Day</div>
          </div>
          <div>
            <div className="text-3xl font-black text-green-400 mb-2">50</div>
            <div className="text-sm text-white/80 font-medium">Max Coins</div>
          </div>
          <div>
            <div className="text-3xl font-black text-purple-400 mb-2">10-50</div>
            <div className="text-sm text-white/80 font-medium">Range</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardsInfo;
