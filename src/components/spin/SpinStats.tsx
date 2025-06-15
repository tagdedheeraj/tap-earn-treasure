
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface SpinStatsProps {
  spinsLeft: number;
  totalPointsToday: number;
  totalCoins: number;
}

const SpinStats = ({ spinsLeft, totalPointsToday, totalCoins }: SpinStatsProps) => {
  return (
    <div className="grid grid-cols-3 gap-3">
      <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
        <CardContent className="p-3 text-center">
          <div className="text-xl font-bold text-blue-600">{spinsLeft}</div>
          <div className="text-xs text-blue-500">Spins Left</div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
        <CardContent className="p-3 text-center">
          <div className="text-xl font-bold text-green-600">{totalPointsToday}</div>
          <div className="text-xs text-green-500">Today's Points</div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
        <CardContent className="p-3 text-center">
          <div className="text-xl font-bold text-orange-600">{totalCoins}</div>
          <div className="text-xs text-orange-500">Total Points</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpinStats;
