
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy } from 'lucide-react';

interface Reward {
  points: number;
  color: string;
  label: string;
  icon: any;
  rarity: string;
}

interface RewardsInfoProps {
  rewards: Reward[];
}

const RewardsInfo: React.FC<RewardsInfoProps> = ({ rewards }) => {
  const getRarityBorderColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-300';
      case 'uncommon': return 'border-green-400';
      case 'rare': return 'border-blue-400';
      case 'legendary': return 'border-purple-400';
      default: return 'border-gray-300';
    }
  };

  return (
    <Card className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-lg rounded-2xl border border-white/20">
      <CardHeader className="text-center pb-4">
        <CardTitle className="font-bold text-white text-xl flex items-center justify-center gap-3">
          <Trophy className="w-6 h-6 text-yellow-400" />
          Today's Reward Pool
          <Trophy className="w-6 h-6 text-yellow-400" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {rewards.map((reward, index) => (
            <div key={index} className={`bg-gradient-to-br ${reward.color} text-white rounded-xl py-4 px-3 text-center shadow-xl border-2 ${getRarityBorderColor(reward.rarity)}`}>
              <reward.icon className="w-5 h-5 mx-auto mb-2" />
              <div className="text-lg font-black">{reward.points}</div>
              <div className="text-xs font-bold opacity-90">COINS</div>
              <div className="text-xs mt-2 bg-white/20 rounded-full px-2 py-1 font-medium">
                {reward.rarity}
              </div>
            </div>
          ))}
        </div>
        
        {/* Statistics */}
        <div className="mt-6 bg-gradient-to-r from-white/10 to-white/5 rounded-xl p-4 border border-white/10">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-black text-yellow-400 mb-1">1</div>
              <div className="text-xs text-white/80 font-medium">Free Spin/Day</div>
            </div>
            <div>
              <div className="text-2xl font-black text-green-400 mb-1">50</div>
              <div className="text-xs text-white/80 font-medium">Max Coins</div>
            </div>
            <div>
              <div className="text-2xl font-black text-purple-400 mb-1">10-50</div>
              <div className="text-xs text-white/80 font-medium">Range</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RewardsInfo;
