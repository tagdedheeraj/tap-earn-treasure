
import React from 'react';
import { useDailyRewards } from '@/hooks/useDailyRewards';
import DailyRewardsHeader from './daily-rewards/DailyRewardsHeader';
import RewardsCalendar from './daily-rewards/RewardsCalendar';
import ClaimButton from './daily-rewards/ClaimButton';
import StreakBenefits from './daily-rewards/StreakBenefits';
import ProgressIndicator from './daily-rewards/ProgressIndicator';

const DailyRewards = () => {
  const { loginStreak, todaysClaimed, currentDay, claimDailyReward, getMultiplier } = useDailyRewards();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 p-4">
      <div className="max-w-md mx-auto space-y-6">
        <DailyRewardsHeader loginStreak={loginStreak} multiplier={getMultiplier()} />
        <RewardsCalendar currentDay={currentDay} todaysClaimed={todaysClaimed} />
        
        <div className="text-center">
          <ClaimButton 
            currentDay={currentDay} 
            todaysClaimed={todaysClaimed} 
            onClaim={claimDailyReward} 
          />
        </div>

        <StreakBenefits />
        <ProgressIndicator currentDay={currentDay} />
      </div>
    </div>
  );
};

export default DailyRewards;
