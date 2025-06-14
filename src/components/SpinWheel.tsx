
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Coins, Sparkles, Gift, Star, Zap, Crown, Diamond, Trophy } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useUserData } from '@/hooks/useUserData';
import { useNotifications } from '@/hooks/useNotifications';
import SpinWheelBackground from './spinwheel/SpinWheelBackground';
import WheelContainer from './spinwheel/WheelContainer';
import SpinButton from './spinwheel/SpinButton';
import RewardsInfo from './spinwheel/RewardsInfo';

const SpinWheel = () => {
  const { updateCoins } = useUserData();
  const { notifyMiningCompleted } = useNotifications();
  const [isSpinning, setIsSpinning] = useState(false);
  const [canSpin, setCanSpin] = useState(true);
  const [rotation, setRotation] = useState(0);
  const [lastSpinDate, setLastSpinDate] = useState<string | null>(null);
  const [wonAmount, setWonAmount] = useState<number | null>(null);

  // Modern rewards with values between 10-50 coins
  const rewards = [
    { points: 10, color: 'from-red-500 to-red-600', label: '10', icon: Coins, rarity: 'common' },
    { points: 25, color: 'from-blue-500 to-blue-600', label: '25', icon: Star, rarity: 'common' },
    { points: 50, color: 'from-green-500 to-green-600', label: '50', icon: Sparkles, rarity: 'rare' },
    { points: 30, color: 'from-yellow-500 to-yellow-600', label: '30', icon: Zap, rarity: 'uncommon' },
    { points: 15, color: 'from-purple-500 to-purple-600', label: '15', icon: Gift, rarity: 'common' },
    { points: 40, color: 'from-pink-500 to-pink-600', label: '40', icon: Crown, rarity: 'uncommon' },
    { points: 20, color: 'from-orange-500 to-orange-600', label: '20', icon: Trophy, rarity: 'common' },
    { points: 35, color: 'from-indigo-500 to-indigo-600', label: '35', icon: Diamond, rarity: 'uncommon' },
  ];

  useEffect(() => {
    const storedLastSpin = localStorage.getItem('lastSpinDate');
    if (storedLastSpin) {
      setLastSpinDate(storedLastSpin);
      const today = new Date().toDateString();
      setCanSpin(storedLastSpin !== today);
    }
  }, []);

  const handleSpin = async () => {
    if (!canSpin || isSpinning) return;

    setIsSpinning(true);
    setWonAmount(null);
    
    // Enhanced rotation animation
    const randomRotation = Math.floor(Math.random() * 360) + (360 * (6 + Math.random() * 4));
    setRotation(prev => prev + randomRotation);

    // Determine winning segment
    const finalRotation = randomRotation % 360;
    const segmentAngle = 360 / rewards.length;
    const winningIndex = Math.floor((360 - finalRotation) / segmentAngle) % rewards.length;
    const reward = rewards[winningIndex];

    setTimeout(async () => {
      setIsSpinning(false);
      setWonAmount(reward.points);
      
      // Award points
      await updateCoins(reward.points, 'spin_wheel', `Daily spin wheel reward: ${reward.points} points`);
      
      // Update last spin date
      const today = new Date().toDateString();
      localStorage.setItem('lastSpinDate', today);
      setLastSpinDate(today);
      setCanSpin(false);

      // Show success notification
      notifyMiningCompleted(reward.points);
      
      // Enhanced toast based on reward rarity
      const rarityEmojis = {
        common: '🎯',
        uncommon: '✨',
        rare: '🔥',
        legendary: '💎'
      };
      
      toast({
        title: `${rarityEmojis[reward.rarity]} Amazing Spin!`,
        description: `You won ${reward.points} coins! ${reward.rarity.toUpperCase()} reward!`,
      });
    }, 4000);
  };

  const getTimeUntilNextSpin = () => {
    if (!lastSpinDate) return null;
    
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const timeLeft = tomorrow.getTime() - today.getTime();
    const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hoursLeft}h ${minutesLeft}m`;
  };

  const getRarityBorderColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-300';
      case 'uncommon': return 'border-green-400';
      case 'rare': return 'border-blue-400';
      case 'legendary': return 'border-purple-400';
      default: return 'border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 relative overflow-hidden">
      <SpinWheelBackground />

      <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border-white/20 shadow-2xl max-w-md mx-auto relative z-10">
        <CardHeader className="text-center bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white rounded-t-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent animate-pulse"></div>
          <CardTitle className="flex items-center justify-center gap-3 text-2xl font-bold relative z-10">
            <div className="animate-spin">
              <Sparkles className="w-8 h-8 text-yellow-300" />
            </div>
            Lucky Spin Wheel
            <div className="animate-spin">
              <Sparkles className="w-8 h-8 text-yellow-300" />
            </div>
          </CardTitle>
          <p className="text-purple-100 relative z-10 font-medium">Spin daily for amazing rewards!</p>
        </CardHeader>
        
        <CardContent className="space-y-8 p-6">
          <WheelContainer 
            rewards={rewards}
            rotation={rotation}
            isSpinning={isSpinning}
            wonAmount={wonAmount}
          />

          <SpinButton 
            canSpin={canSpin}
            isSpinning={isSpinning}
            onSpin={handleSpin}
            getTimeUntilNextSpin={getTimeUntilNextSpin}
          />

          <RewardsInfo 
            rewards={rewards}
            getRarityBorderColor={getRarityBorderColor}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default SpinWheel;
