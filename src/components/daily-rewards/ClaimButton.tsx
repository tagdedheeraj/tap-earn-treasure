
import React from 'react';
import { Button } from '@/components/ui/button';
import { Gift, Sparkles, Star, Crown } from 'lucide-react';
import { DAILY_REWARDS } from '@/constants/dailyRewards';

interface ClaimButtonProps {
  currentDay: number;
  todaysClaimed: boolean;
  onClaim: () => void;
}

const ClaimButton: React.FC<ClaimButtonProps> = ({ currentDay, todaysClaimed, onClaim }) => {
  if (!todaysClaimed) {
    return (
      <Button
        onClick={onClaim}
        className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white py-4 text-lg font-bold shadow-2xl transform transition-all duration-300 hover:scale-105 rounded-2xl border-4 border-white/20 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
        <Gift className="w-6 h-6 mr-3 animate-bounce relative z-10" />
        <span className="relative z-10">Claim Day {currentDay} Reward ({DAILY_REWARDS[currentDay - 1]?.reward} Coins)</span>
        <Sparkles className="w-6 h-6 ml-3 animate-spin relative z-10" />
      </Button>
    );
  }

  return (
    <div className="space-y-3">
      <Button disabled className="w-full bg-gradient-to-r from-gray-400 to-gray-500 text-white py-4 text-lg font-bold rounded-2xl border-4 border-gray-300 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20"></div>
        <Star className="w-6 h-6 mr-3 relative z-10" />
        <span className="relative z-10">Today's Reward Claimed!</span>
        <Crown className="w-6 h-6 ml-3 relative z-10" />
      </Button>
      <p className="text-gray-600 font-medium">
        Come back tomorrow for Day {Math.min(currentDay + 1, 7)} reward 
        <span className="text-purple-600 font-bold">
          {currentDay < 7 ? ` (${DAILY_REWARDS[currentDay]?.reward} Coins)` : ' (Streak Reset)'}
        </span>
      </p>
    </div>
  );
};

export default ClaimButton;
