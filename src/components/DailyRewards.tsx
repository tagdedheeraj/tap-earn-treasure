import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Gift, Coins, Star, Crown, Sparkles } from 'lucide-react';
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
    { day: 1, reward: 50, type: 'coins', icon: Coins, color: 'bg-yellow-500', bgGradient: 'from-yellow-400 to-yellow-500' },
    { day: 2, reward: 75, type: 'coins', icon: Coins, color: 'bg-yellow-500', bgGradient: 'from-yellow-500 to-orange-400' },
    { day: 3, reward: 100, type: 'coins', icon: Coins, color: 'bg-yellow-600', bgGradient: 'from-orange-400 to-orange-500' },
    { day: 4, reward: 125, type: 'coins', icon: Coins, color: 'bg-yellow-600', bgGradient: 'from-orange-500 to-red-400' },
    { day: 5, reward: 150, type: 'coins', icon: Coins, color: 'bg-orange-500', bgGradient: 'from-red-400 to-pink-400' },
    { day: 6, reward: 200, type: 'coins', icon: Coins, color: 'bg-orange-600', bgGradient: 'from-pink-400 to-purple-400' },
    { day: 7, reward: 500, type: 'bonus', icon: Crown, color: 'bg-purple-600', bgGradient: 'from-purple-500 to-indigo-600' },
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Enhanced Header Card */}
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
              {getMultiplier() > 1 && (
                <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 text-sm font-bold">
                  <Sparkles className="w-3 h-3 mr-1" />
                  {getMultiplier()}x Boost
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Mobile Optimized Rewards Calendar */}
        <Card className="bg-white/80 backdrop-blur-lg border-white/50 shadow-xl">
          <CardContent className="p-4 sm:p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">7-Day Reward Calendar</h3>
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {dailyRewards.map((reward, index) => {
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

        {/* Enhanced Claim Button */}
        <div className="text-center">
          {!todaysClaimed ? (
            <Button
              onClick={claimDailyReward}
              className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white py-4 text-lg font-bold shadow-2xl transform transition-all duration-300 hover:scale-105 rounded-2xl border-4 border-white/20 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
              <Gift className="w-6 h-6 mr-3 animate-bounce relative z-10" />
              <span className="relative z-10">Claim Day {currentDay} Reward ({dailyRewards[currentDay - 1]?.reward} Coins)</span>
              <Sparkles className="w-6 h-6 ml-3 animate-spin relative z-10" />
            </Button>
          ) : (
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
                  {currentDay < 7 ? ` (${dailyRewards[currentDay]?.reward} Coins)` : ' (Streak Reset)'}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Enhanced Streak Benefits */}
        <Card className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-lg border-white/50 shadow-xl">
          <CardContent className="p-6">
            <h4 className="font-bold text-gray-800 mb-4 text-center text-lg flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              Streak Benefits
              <Sparkles className="w-5 h-5 text-purple-500" />
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl border border-green-200">
                <span className="font-medium text-green-800">3+ Days Streak:</span>
                <Badge className="bg-green-500 text-white font-bold">1.5x Mining Speed</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl border border-blue-200">
                <span className="font-medium text-blue-800">7+ Days Streak:</span>
                <Badge className="bg-blue-500 text-white font-bold">2x Mining Speed</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl border border-purple-200">
                <span className="font-medium text-purple-800">Complete Week:</span>
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold">500 Bonus Coins</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Indicator */}
        <Card className="bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-200 shadow-lg">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-sm text-orange-800 font-medium mb-2">Weekly Progress</div>
              <div className="w-full bg-white/70 rounded-full h-3 mb-2">
                <div 
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-500 shadow-inner"
                  style={{ width: `${(currentDay / 7) * 100}%` }}
                ></div>
              </div>
              <div className="text-xs text-orange-700 font-bold">
                {currentDay}/7 Days • {Math.round((currentDay / 7) * 100)}% Complete
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DailyRewards;
