
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Gift, Coins, Star, Crown } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useUserData } from '@/hooks/useUserData';
import { useNotifications } from '@/hooks/useNotifications';

const DailyRewards = () => {
  const { updateCoins } = useUserData();
  const { notifyMiningCompleted } = useNotifications();
  const [loginStreak, setLoginStreak] = useState(1);
  const [todaysClaimed, setTodaysClaimed] = useState(false);
  const [currentDay, setCurrentDay] = useState(1);

  const dailyRewards = [
    { day: 1, reward: 50, type: 'coins', icon: Coins, color: 'bg-yellow-500' },
    { day: 2, reward: 75, type: 'coins', icon: Coins, color: 'bg-yellow-500' },
    { day: 3, reward: 100, type: 'coins', icon: Coins, color: 'bg-yellow-600' },
    { day: 4, reward: 125, type: 'coins', icon: Coins, color: 'bg-yellow-600' },
    { day: 5, reward: 150, type: 'coins', icon: Coins, color: 'bg-orange-500' },
    { day: 6, reward: 200, type: 'coins', icon: Coins, color: 'bg-orange-600' },
    { day: 7, reward: 500, type: 'bonus', icon: Crown, color: 'bg-purple-600' },
  ];

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
        setLoginStreak(newStreak);
        setCurrentDay(newStreak);
        localStorage.setItem('loginStreak', newStreak.toString());
      } else if (daysDiff > 1) {
        // Streak broken
        setLoginStreak(1);
        setCurrentDay(1);
        localStorage.setItem('loginStreak', '1');
      } else {
        // Same day
        setLoginStreak(parseInt(storedStreak || '1'));
        setCurrentDay(parseInt(storedStreak || '1'));
      }
    } else {
      setLoginStreak(1);
      setCurrentDay(1);
      localStorage.setItem('loginStreak', '1');
    }

    localStorage.setItem('lastLoginDate', today);
    setTodaysClaimed(claimedToday === today);
  }, []);

  const claimDailyReward = async () => {
    if (todaysClaimed) return;

    const todaysReward = dailyRewards[currentDay - 1];
    const today = new Date().toDateString();

    try {
      await updateCoins(todaysReward.reward, 'daily_reward', `Day ${currentDay} daily login reward`);
      
      setTodaysClaimed(true);
      localStorage.setItem('claimedDailyReward', today);

      notifyMiningCompleted(todaysReward.reward);
      
      toast({
        title: "🎁 Daily Reward Claimed!",
        description: `Day ${currentDay}: You earned ${todaysReward.reward} points!`,
      });

      // Reset streak if it's day 7
      if (currentDay === 7) {
        setTimeout(() => {
          setLoginStreak(1);
          setCurrentDay(1);
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
    if (loginStreak >= 7) return 2;
    if (loginStreak >= 3) return 1.5;
    return 1;
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-blue-800">
          <Calendar className="w-6 h-6 text-blue-600" />
          Daily Login Rewards
          <Gift className="w-6 h-6 text-blue-600" />
        </CardTitle>
        <div className="flex items-center justify-center gap-4 mt-2">
          <Badge variant="outline" className="text-blue-700 border-blue-300">
            <Star className="w-3 h-3 mr-1" />
            {loginStreak} Day Streak
          </Badge>
          {getMultiplier() > 1 && (
            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
              {getMultiplier()}x Multiplier
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Daily Rewards Grid */}
        <div className="grid grid-cols-7 gap-2">
          {dailyRewards.map((reward, index) => {
            const Icon = reward.icon;
            const isToday = index + 1 === currentDay;
            const isClaimed = index + 1 < currentDay || (index + 1 === currentDay && todaysClaimed);
            const isFuture = index + 1 > currentDay;
            
            return (
              <div
                key={reward.day}
                className={`relative p-3 rounded-lg border-2 text-center transition-all duration-300 ${
                  isToday
                    ? 'border-blue-500 bg-blue-100 shadow-lg scale-105'
                    : isClaimed
                    ? 'border-green-500 bg-green-100'
                    : 'border-gray-300 bg-gray-50'
                }`}
              >
                <div className={`w-8 h-8 rounded-full ${reward.color} mx-auto mb-2 flex items-center justify-center`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div className="text-xs font-bold text-gray-700">Day {reward.day}</div>
                <div className="text-xs text-gray-600">{reward.reward}</div>
                
                {isClaimed && (
                  <div className="absolute top-1 right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
                
                {isToday && !todaysClaimed && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Claim Button */}
        <div className="text-center">
          {!todaysClaimed ? (
            <Button
              onClick={claimDailyReward}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-lg font-bold shadow-lg transform transition-transform hover:scale-105"
            >
              <Gift className="w-5 h-5 mr-2" />
              Claim Day {currentDay} Reward
            </Button>
          ) : (
            <div className="space-y-2">
              <Button disabled className="bg-gray-400 text-gray-600 px-8 py-3 text-lg font-bold">
                <Star className="w-5 h-5 mr-2" />
                Today's Reward Claimed!
              </Button>
              <p className="text-sm text-gray-600">
                Come back tomorrow for Day {Math.min(currentDay + 1, 7)} reward
              </p>
            </div>
          )}
        </div>

        {/* Streak Info */}
        <div className="bg-white/50 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2 text-center">Streak Benefits:</h4>
          <div className="space-y-2 text-sm text-blue-700">
            <div className="flex justify-between items-center">
              <span>3+ Days:</span>
              <Badge variant="outline">1.5x Mining Speed</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>7+ Days:</span>
              <Badge variant="outline">2x Mining Speed</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Complete Week:</span>
              <Badge className="bg-purple-500">500 Bonus Points</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyRewards;
