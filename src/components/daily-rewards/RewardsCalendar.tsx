
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DAILY_REWARDS } from '@/constants/dailyRewards';

interface RewardsCalendarProps {
  currentDay: number;
  todaysClaimed: boolean;
}

const RewardsCalendar: React.FC<RewardsCalendarProps> = ({ currentDay, todaysClaimed }) => {
  return (
    <Card className="bg-white/80 backdrop-blur-lg border-white/50 shadow-xl">
      <CardContent className="p-4 sm:p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">7-Day Reward Calendar</h3>
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {DAILY_REWARDS.map((reward, index) => {
            const Icon = reward.icon;
            const isToday = index + 1 === currentDay;
            const isClaimed = index + 1 < currentDay || (index + 1 === currentDay && todaysClaimed);
            const isFuture = index + 1 > currentDay;
            
            return (
              <div
                key={reward.day}
                className={`relative p-1.5 sm:p-2 rounded-lg sm:rounded-xl border-2 text-center transition-all duration-300 ${
                  isToday
                    ? 'border-blue-500 bg-gradient-to-br from-blue-100 to-blue-200 shadow-lg scale-105 animate-pulse'
                    : isClaimed
                    ? 'border-green-500 bg-gradient-to-br from-green-100 to-green-200'
                    : 'border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100'
                }`}
              >
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-gradient-to-r ${reward.bgGradient} mx-auto mb-1 flex items-center justify-center shadow-md`}>
                  <Icon className="w-3 h-3 sm:w-4 sm:h-4 text-white drop-shadow-sm" />
                </div>
                <div className="text-xs font-bold text-gray-700">D{reward.day}</div>
                <div className="text-xs text-gray-600 font-semibold">{reward.reward}</div>
                
                {isClaimed && (
                  <div className="absolute -top-0.5 -right-0.5 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
                
                {isToday && !todaysClaimed && (
                  <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-ping"></div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default RewardsCalendar;
