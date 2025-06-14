
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Lock } from 'lucide-react';
import { Reward } from '@/hooks/useRewards';

interface RewardCardProps {
  reward: Reward;
  canAfford: boolean;
  onRedeem: (reward: Reward) => void;
}

const RewardCard: React.FC<RewardCardProps> = ({ reward, canAfford, onRedeem }) => {
  return (
    <Card className={`relative ${!canAfford ? 'opacity-60' : ''}`}>
      {reward.popular && (
        <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
          <Star className="w-3 h-3 mr-1" />
          Popular
        </Badge>
      )}
      
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="text-4xl">{reward.image}</div>
          <div className="flex-1">
            <h3 className="font-semibold">{reward.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{reward.description}</p>
            <Badge variant="secondary" className="mb-3">
              {reward.category}
            </Badge>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-lg font-bold text-purple-600">{reward.cost}</span>
                <span className="text-sm text-gray-500">points</span>
              </div>
              
              <Button
                onClick={() => onRedeem(reward)}
                disabled={!canAfford}
                size="sm"
                className={canAfford ? "bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700" : ""}
              >
                {!canAfford && <Lock className="w-4 h-4 mr-1" />}
                {canAfford ? 'Redeem' : 'Locked'}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RewardCard;
