
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { useUserData } from '@/hooks/useUserData';
import { useNotifications } from '@/hooks/useNotifications';
import { DailyRewardsState } from '@/types/dailyRewards';
import { DAILY_REWARDS } from '@/constants/dailyRewards';

export const useDailyRewards = () => {
  const { updateCoins } = useUserData();
  const { notifyMiningCompleted } = useNotifications();
  const [state, setState] = useState<DailyRewardsState>({
    loginStreak: 1,
    todaysClaimed: false,
    currentDay: 1,
  });

  useEffect(() => {
    const storedStreak = localStorage.getItem('loginStreak');
    const lastLoginDate = localStorage.getItem('lastLoginDate');
    const claimedToday = localStorage.getItem('claimedDailyReward');
    
    const today = new Date().toDateString();
    
    if (lastLoginDate) {
      const daysDiff = Math.floor((new Date().getTime() - new Date(lastLoginDate).getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1) {
        // Consecutive day
        const newStreak = Math.min(parseInt(storedStreak || '1') + 1, 7);
        setState(prev => ({ ...prev, loginStreak: newStreak, currentDay: newStreak }));
        localStorage.setItem('loginStreak', newStreak.toString());
      } else if (daysDiff > 1) {
        // Streak broken
        setState(prev => ({ ...prev, loginStreak: 1, currentDay: 1 }));
        localStorage.setItem('loginStreak', '1');
      } else {
        // Same day
        const streak = parseInt(storedStreak || '1');
        setState(prev => ({ ...prev, loginStreak: streak, currentDay: streak }));
      }
    } else {
      setState(prev => ({ ...prev, loginStreak: 1, currentDay: 1 }));
      localStorage.setItem('loginStreak', '1');
    }

    localStorage.setItem('lastLoginDate', today);
    setState(prev => ({ ...prev, todaysClaimed: claimedToday === today }));
  }, []);

  const claimDailyReward = async () => {
    if (state.todaysClaimed) return;

    const todaysReward = DAILY_REWARDS[state.currentDay - 1];
    const today = new Date().toDateString();

    try {
      await updateCoins(todaysReward.reward, 'daily_reward', `Day ${state.currentDay} daily login reward`);
      
      setState(prev => ({ ...prev, todaysClaimed: true }));
      localStorage.setItem('claimedDailyReward', today);

      notifyMiningCompleted(todaysReward.reward);
      
      toast({
        title: "🎁 Daily Reward Claimed!",
        description: `Day ${state.currentDay}: You earned ${todaysReward.reward} points!`,
      });

      // Reset streak if it's day 7
      if (state.currentDay === 7) {
        setTimeout(() => {
          setState(prev => ({ ...prev, loginStreak: 1, currentDay: 1 }));
          localStorage.setItem('loginStreak', '1');
          toast({
            title: "🔄 Streak Reset!",
            description: "Weekly streak completed! Starting fresh tomorrow.",
          });
        }, 2000);
      }
    } catch (error) {
      console.error('Error claiming daily reward:', error);
      toast({
        title: "❌ Error",
        description: "Failed to claim daily reward. Please try again.",
      });
    }
  };

  const getMultiplier = () => {
    if (state.loginStreak >= 7) return 2;
    if (state.loginStreak >= 3) return 1.5;
    return 1;
  };

  return {
    ...state,
    claimDailyReward,
    getMultiplier,
  };
};
