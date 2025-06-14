
import { LucideIcon } from 'lucide-react';

export interface DailyReward {
  day: number;
  reward: number;
  type: 'coins' | 'bonus';
  icon: LucideIcon;
  color: string;
  bgGradient: string;
}

export interface DailyRewardsState {
  loginStreak: number;
  todaysClaimed: boolean;
  currentDay: number;
}
