
import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RotateCcw, Gift, Coins, Star, X } from 'lucide-react';
import { useUserData } from '@/hooks/useUserData';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import SpinStats from './spin/SpinStats';
import SpinWheelDisplay from './spin/SpinWheelDisplay';
import SpinButton from './spin/SpinButton';
import DailyLimitInfo from './spin/DailyLimitInfo';
import LastWinDisplay from './spin/LastWinDisplay';
import MoreOpportunities from './spin/MoreOpportunities';

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
        console.log('Awarding spin reward:', wonReward.actualAward);
        await updateCoins(wonReward.actualAward, 'spin_wheel', `Daily spin reward: ${wonReward.actualAward} points`);
        setTotalPointsToday(prev => prev + wonReward.actualAward);
        
        // Force refresh user data to update the UI
        setTimeout(async () => {
          await refetchData();
          console.log('User data refreshed after spin reward');
        }, 500);

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
      <SpinStats 
        spinsLeft={spinsLeft} 
        totalPointsToday={totalPointsToday} 
        totalCoins={wallet?.total_coins || 0} 
      />

      {/* Daily Limit Info */}
      <DailyLimitInfo />

      {/* Spin Wheel */}
      <SpinWheelDisplay 
        rewards={rewards} 
        currentRotation={currentRotation} 
        isSpinning={isSpinning} 
      />
      
      {/* Spin Button */}
      <SpinButton 
        onSpin={handleSpin} 
        isSpinning={isSpinning} 
        spinsLeft={spinsLeft} 
      />

      {/* Last Win */}
      {lastWin && <LastWinDisplay lastWin={lastWin} />}

      {/* More Opportunities */}
      <MoreOpportunities />
    </div>
  );
};

export default SpinWheel;
