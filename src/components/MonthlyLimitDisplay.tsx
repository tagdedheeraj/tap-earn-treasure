
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Coins, Calendar, TrendingUp } from 'lucide-react';
import { useMonthlyLimit } from '@/hooks/useMonthlyLimit';

const MonthlyLimitDisplay = () => {
  const { monthlyEarned, monthlyLimit, getRemainingPoints, loading } = useMonthlyLimit();

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-2 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const progressPercentage = (monthlyEarned / monthlyLimit) * 100;
  const remainingPoints = getRemainingPoints();

  return (
    <Card className="w-full bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2 text-blue-700">
          <Calendar className="w-5 h-5" />
          Monthly Earning Limit
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Earned this month</span>
            <span className="font-semibold text-blue-600">
              {monthlyEarned} / {monthlyLimit} points
            </span>
          </div>
          <Progress 
            value={progressPercentage} 
            className="h-3"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-sm">
            <Coins className="w-4 h-4 text-yellow-500" />
            <div>
              <p className="text-xs text-gray-500">Remaining</p>
              <p className="font-bold text-green-600">{remainingPoints}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-sm">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            <div>
              <p className="text-xs text-gray-500">Progress</p>
              <p className="font-bold text-blue-600">{Math.round(progressPercentage)}%</p>
            </div>
          </div>
        </div>

        {/* Warning */}
        {remainingPoints <= 100 && remainingPoints > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
            <p className="text-sm text-yellow-700">
              ⚠️ You're close to your monthly limit! Only {remainingPoints} points remaining.
            </p>
          </div>
        )}

        {remainingPoints === 0 && (
          <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
            <p className="text-sm text-red-700">
              🚫 Monthly limit reached! You can still earn unlimited referral bonuses.
            </p>
          </div>
        )}

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
          <p className="text-xs text-blue-600">
            💡 Referral bonuses are unlimited and don't count towards your monthly limit!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyLimitDisplay;
