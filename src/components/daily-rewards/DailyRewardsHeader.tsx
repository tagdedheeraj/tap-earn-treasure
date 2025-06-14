
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Gift, Star, Sparkles } from 'lucide-react';

interface DailyRewardsHeaderProps {
  loginStreak: number;
  multiplier: number;
}

const DailyRewardsHeader: React.FC<DailyRewardsHeaderProps> = ({ loginStreak, multiplier }) => {
  return (
    <Card className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white border-0 shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent animate-pulse"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
      
      <CardHeader className="text-center relative z-10 pb-2">
        <CardTitle className="flex items-center justify-center gap-3 text-2xl font-bold">
          <Calendar className="w-8 h-8 text-yellow-300 animate-bounce" />
          Daily Login Rewards
          <Gift className="w-8 h-8 text-yellow-300 animate-bounce" style={{ animationDelay: '0.5s' }} />
        </CardTitle>
        <p className="text-blue-100 font-medium">Claim your daily bonus!</p>
      </CardHeader>
      
      <CardContent className="pb-6 relative z-10">
        <div className="flex items-center justify-center gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 bg-white/20 rounded-2xl px-4 py-2 backdrop-blur-sm border border-white/30">
              <Star className="w-5 h-5 text-yellow-300" />
              <span className="text-xl font-bold">{loginStreak}</span>
              <span className="text-sm text-blue-100">Day Streak</span>
            </div>
          </div>
          {multiplier > 1 && (
            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 text-sm font-bold">
              <Sparkles className="w-3 h-3 mr-1" />
              {multiplier}x Boost
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyRewardsHeader;
