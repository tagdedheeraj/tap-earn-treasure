
import { Coins, Crown } from 'lucide-react';
import { DailyReward } from '@/types/dailyRewards';

export const DAILY_REWARDS: DailyReward[] = [
  { day: 1, reward: 50, type: 'coins', icon: Coins, color: 'bg-yellow-500', bgGradient: 'from-yellow-400 to-yellow-500' },
  { day: 2, reward: 75, type: 'coins', icon: Coins, color: 'bg-yellow-500', bgGradient: 'from-yellow-500 to-orange-400' },
  { day: 3, reward: 100, type: 'coins', icon: Coins, color: 'bg-yellow-600', bgGradient: 'from-orange-400 to-orange-500' },
  { day: 4, reward: 125, type: 'coins', icon: Coins, color: 'bg-yellow-600', bgGradient: 'from-orange-500 to-red-400' },
  { day: 5, reward: 150, type: 'coins', icon: Coins, color: 'bg-orange-500', bgGradient: 'from-red-400 to-pink-400' },
  { day: 6, reward: 200, type: 'coins', icon: Coins, color: 'bg-orange-600', bgGradient: 'from-pink-400 to-purple-400' },
  { day: 7, reward: 500, type: 'bonus', icon: Crown, color: 'bg-purple-600', bgGradient: 'from-purple-500 to-indigo-600' },
];
