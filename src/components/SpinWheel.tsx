
import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCcw, Gift, Coins, Star, X } from 'lucide-react';
import { useUserData } from '@/hooks/useUserData';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface SpinReward {
  id: number;
  type: 'coins' | 'points' | 'blank';
  amount: number;
  label: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
  actualAward: number; // What user actually gets
}

const SpinWheel = () => {
  const { user } = useAuth();
  const { updateCoins, wallet, refetchData } = useUserData();
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [lastWin, setLastWin] = useState<SpinReward | null>(null);
  const [spinsLeft, setSpinsLeft] = useState(3);
  const [totalPointsToday, setTotalPointsToday] = useState(0);

  const rewards: SpinReward[] = [
    { id: 1, type: 'coins', amount: 15, label: '15 Points', color: 'from-yellow-400 to-yellow-600', icon: Coins, actualAward: 15 },
    { id: 2, type: 'blank', amount: 0, label: 'Try Again', color: 'from-gray-400 to-gray-600', icon: X, actualAward: 0 },
    { id: 3, type: 'coins', amount: 25, label: '25 Points', color: 'from-green-400 to-green-600', icon: Coins, actualAward: 25 },
    { id: 4, type: 'coins', amount: 10000, label: '10K Points', color: 'from-purple-400 to-purple-600', icon: Gift, actualAward: 20 }, // Visual bait
    { id: 5, type: 'coins', amount: 20, label: '20 Points', color: 'from-orange-400 to-orange-600', icon: Coins, actualAward: 20 },
    { id: 6, type: 'blank', amount: 0, label: 'Try Again', color: 'from-gray-400 to-gray-600', icon: X, actualAward: 0 },
    { id: 7, type: 'coins', amount: 30, label: '30 Points', color: 'from-blue-400 to-blue-600', icon: Star, actualAward: 30 },
    { id: 8, type: 'coins', amount: 12, label: '12 Points', color: 'from-pink-400 to-pink-600', icon: Coins, actualAward: 12 },
  ];

  useEffect(() => {
    checkDailySpins();
  }, [user]);

  const checkDailySpins = async () => {
    if (!user) return;

    try {
      const today = new Date().toDateString();
      
      // Check today's spin transactions
      const { data: todaySpins, error } = await supabase
        .from('coin_transactions')
        .select('amount')
        .eq('user_id', user.id)
        .eq('source', 'spin_wheel')
        .gte('created_at', new Date(today).toISOString());

      if (error) throw error;

      const todaySpinCount = todaySpins?.length || 0;
      const todayPoints = todaySpins?.reduce((sum, spin) => sum + spin.amount, 0) || 0;
      
      setSpinsLeft(Math.max(0, 3 - todaySpinCount));
      setTotalPointsToday(todayPoints);
    } catch (error) {
      console.error('Error checking daily spins:', error);
    }
  };

  const handleSpin = useCallback(async () => {
    if (isSpinning || spinsLeft <= 0) return;

    setIsSpinning(true);
    setSpinsLeft(prev => prev - 1);

    // Random rotation between 1800-3600 degrees (5-10 full rotations)
    const randomRotation = Math.random() * 1800 + 1800;
    const newRotation = currentRotation + randomRotation;
    
    setCurrentRotation(newRotation);

    // Calculate which reward was won
    const normalizedRotation = newRotation % 360;
    const segmentSize = 360 / rewards.length;
    const winningIndex = Math.floor((360 - normalizedRotation) / segmentSize) % rewards.length;
    const wonReward = rewards[winningIndex];

    setTimeout(async () => {
      setIsSpinning(false);
      setLastWin(wonReward);

      // Award the actual prize (not the displayed amount for 10K)
      if (wonReward.actualAward > 0) {
        await updateCoins(wonReward.actualAward, 'spin_wheel', `Daily spin reward: ${wonReward.actualAward} points`);
        setTotalPointsToday(prev => prev + wonReward.actualAward);
        await refetchData();

        toast({
          title: "🎉 Congratulations!",
          description: `You received ${wonReward.actualAward} points!`,
        });
      } else {
        toast({
          title: "😔 Better luck next time!",
          description: "Try spinning again!",
        });
      }
    }, 3000);
  }, [isSpinning, spinsLeft, currentRotation, updateCoins, refetchData]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <RotateCcw className="w-6 h-6" />
            Daily Lucky Spin
          </CardTitle>
          <p className="text-purple-100">Test your luck with daily spins!</p>
        </CardHeader>
      </Card>

      {/* Spin Stats */}
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
            <div className="text-xl font-bold text-orange-600">{wallet?.total_coins || 0}</div>
            <div className="text-xs text-orange-500">Total Points</div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Limit Info */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <CardContent className="p-4 text-center">
          <h3 className="font-bold text-indigo-800 mb-2">Daily Opportunity Limit</h3>
          <p className="text-sm text-indigo-700">
            Get up to 10,000 points daily through various activities including spins, tasks, and daily bonuses!
          </p>
          <p className="text-xs text-indigo-600 mt-1">
            Reset every 24 hours • Maximum 3 daily spins
          </p>
        </CardContent>
      </Card>

      {/* Spin Wheel */}
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="relative w-72 h-72 mx-auto">
            {/* Pointer */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
              <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-red-500"></div>
            </div>
            
            {/* Wheel */}
            <div 
              className={`w-full h-full rounded-full relative overflow-hidden shadow-2xl border-8 border-white transition-transform duration-3000 ease-out ${isSpinning ? 'animate-spin' : ''}`}
              style={{ transform: `rotate(${currentRotation}deg)` }}
            >
              {rewards.map((reward, index) => {
                const angle = (360 / rewards.length) * index;
                const Icon = reward.icon;
                return (
                  <div
                    key={reward.id}
                    className={`absolute w-1/2 h-1/2 origin-bottom-right bg-gradient-to-r ${reward.color}`}
                    style={{
                      transform: `rotate(${angle}deg)`,
                      clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                    }}
                  >
                    <div 
                      className="absolute top-4 right-6 text-white text-center transform -rotate-90"
                      style={{ transform: `rotate(${-angle + 22.5}deg)` }}
                    >
                      <Icon className="w-3 h-3 mx-auto mb-1" />
                      <div className="text-xs font-bold whitespace-nowrap">{reward.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Spin Button */}
          <div className="text-center mt-6">
            <Button
              onClick={handleSpin}
              disabled={isSpinning || spinsLeft <= 0}
              className="w-28 h-28 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-base shadow-2xl transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSpinning ? (
                <div className="flex flex-col items-center">
                  <RotateCcw className="w-6 h-6 animate-spin mb-1" />
                  <span className="text-sm">Spinning...</span>
                </div>
              ) : spinsLeft > 0 ? (
                <div className="flex flex-col items-center">
                  <RotateCcw className="w-6 h-6 mb-1" />
                  <span>SPIN</span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <span className="text-sm">No Spins</span>
                  <span className="text-sm">Left</span>
                </div>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Last Win */}
      {lastWin && (
        <Card className={`${lastWin.actualAward > 0 ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' : 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200'}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-center gap-3">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${lastWin.actualAward > 0 ? 'from-green-400 to-emerald-500' : 'from-gray-400 to-slate-500'} flex items-center justify-center`}>
                <lastWin.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className={`font-bold ${lastWin.actualAward > 0 ? 'text-green-800' : 'text-gray-800'}`}>Last Spin Result</div>
                <div className={`${lastWin.actualAward > 0 ? 'text-green-600' : 'text-gray-600'}`}>
                  {lastWin.actualAward > 0 ? `${lastWin.actualAward} Points Received` : 'Better luck next time!'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* How to Get More Opportunities */}
      <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
        <CardContent className="p-4">
          <h3 className="font-bold text-orange-800 mb-2">More Daily Opportunities</h3>
          <ul className="text-sm text-orange-700 space-y-1">
            <li>• Complete daily tasks and challenges</li>
            <li>• Maintain login streaks for bonus rewards</li>
            <li>• Invite friends to join the platform</li>
            <li>• Participate in special promotional activities</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpinWheel;
