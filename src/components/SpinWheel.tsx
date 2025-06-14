
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coins, Sparkles, Gift, Star, Zap, Crown, Diamond, Trophy } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useUserData } from '@/hooks/useUserData';
import { useNotifications } from '@/hooks/useNotifications';

const SpinWheel = () => {
  const { updateCoins } = useUserData();
  const { notifyMiningCompleted } = useNotifications();
  const [isSpinning, setIsSpinning] = useState(false);
  const [canSpin, setCanSpin] = useState(true);
  const [rotation, setRotation] = useState(0);
  const [lastSpinDate, setLastSpinDate] = useState<string | null>(null);
  const [wonAmount, setWonAmount] = useState<number | null>(null);

  // Rewards configuration
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
    
    // Spin animation
    const randomRotation = Math.floor(Math.random() * 360) + (360 * 5);
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
      
      // Show toast
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
    }, 3000);
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-25 to-pink-50 pb-32">
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 pb-32 relative overflow-hidden">
        {/* Animated background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            >
              <Star className="w-2 h-2 text-yellow-300 opacity-60" />
            </div>
          ))}
        </div>

        <div className="max-w-md mx-auto space-y-6 relative z-10">
          {/* Header */}
          <Card className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl border-white/30 shadow-2xl">
            <CardHeader className="text-center bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center justify-center gap-3 text-2xl font-bold">
                <Sparkles className="w-8 h-8 text-yellow-300 animate-spin" />
                Lucky Spin Wheel
                <Sparkles className="w-8 h-8 text-yellow-300 animate-spin" style={{ animationDirection: 'reverse' }} />
              </CardTitle>
              <p className="text-purple-100 font-medium">Spin daily for amazing rewards!</p>
            </CardHeader>
          </Card>

          {/* Wheel */}
          <div className="flex justify-center">
            <div className="relative w-80 h-80">
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 opacity-60 blur-2xl animate-pulse"></div>
              
              {/* Main wheel */}
              <div className="absolute inset-4 rounded-full border-8 border-yellow-400 bg-white shadow-2xl overflow-hidden">
                <div 
                  className={`w-full h-full rounded-full transition-transform ease-out ${isSpinning ? 'duration-[3000ms]' : 'duration-1000'}`}
                  style={{ transform: `rotate(${rotation}deg)` }}
                >
                  {rewards.map((reward, index) => {
                    const angle = (360 / rewards.length) * index;
                    const nextAngle = (360 / rewards.length) * (index + 1);
                    const Icon = reward.icon;
                    
                    return (
                      <div
                        key={index}
                        className={`absolute w-full h-full bg-gradient-to-br ${reward.color}`}
                        style={{
                          clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos((angle * Math.PI) / 180)}% ${50 + 50 * Math.sin((angle * Math.PI) / 180)}%, ${50 + 50 * Math.cos((nextAngle * Math.PI) / 180)}% ${50 + 50 * Math.sin((nextAngle * Math.PI) / 180)}%)`,
                        }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div 
                            className="text-white font-bold text-center"
                            style={{ 
                              transform: `rotate(${angle + 22.5}deg) translateY(-60px)`,
                              transformOrigin: '50% 60px'
                            }}
                          >
                            <Icon className="w-5 h-5 mx-auto mb-1" />
                            <div className="text-lg font-black bg-black/20 rounded px-2 py-1">
                              {reward.label}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Pointer */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-30">
                <div className="w-0 h-0 border-l-6 border-r-6 border-b-12 border-l-transparent border-r-transparent border-b-yellow-500"></div>
                <div className="w-4 h-4 bg-yellow-500 rounded-full mx-auto -mt-1 border-2 border-white"></div>
              </div>
              
              {/* Center circle */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full z-20 flex items-center justify-center border-4 border-white shadow-xl">
                <Sparkles className={`w-6 h-6 text-white ${isSpinning ? 'animate-spin' : 'animate-pulse'}`} />
              </div>

              {/* Win amount display */}
              {wonAmount && !isSpinning && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl text-xl font-black animate-bounce border-4 border-white shadow-xl">
                    <div className="flex items-center gap-2">
                      <Coins className="w-5 h-5 animate-spin" />
                      +{wonAmount}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Spin Button */}
          <div className="text-center space-y-4">
            {canSpin ? (
              <Button
                onClick={handleSpin}
                disabled={isSpinning}
                className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 text-white px-12 py-6 text-xl font-bold shadow-2xl transform transition-all duration-300 hover:scale-105 disabled:scale-100 disabled:opacity-70 rounded-2xl border-4 border-white"
              >
                {isSpinning ? (
                  <>
                    <Sparkles className="w-6 h-6 mr-3 animate-spin" />
                    Spinning...
                  </>
                ) : (
                  <>
                    <Gift className="w-6 h-6 mr-3 animate-pulse" />
                    SPIN NOW!
                  </>
                )}
              </Button>
            ) : (
              <div className="space-y-4">
                <Button disabled className="bg-gray-500 text-gray-300 px-12 py-6 text-xl font-bold rounded-2xl border-4 border-gray-400 opacity-60">
                  Already Spin Today
                </Button>
                <p className="text-white/80 font-medium text-lg">
                  Next spin in: <Badge variant="outline" className="font-bold text-yellow-400 bg-yellow-400/10 border-yellow-400/30 text-lg px-3 py-1">{getTimeUntilNextSpin()}</Badge>
                </p>
              </div>
            )}
          </div>

          {/* Rewards Info */}
          <Card className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-lg rounded-2xl border border-white/20">
            <CardHeader className="text-center pb-4">
              <CardTitle className="font-bold text-white text-xl flex items-center justify-center gap-3">
                <Trophy className="w-6 h-6 text-yellow-400" />
                Today's Reward Pool
                <Trophy className="w-6 h-6 text-yellow-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {rewards.map((reward, index) => (
                  <div key={index} className={`bg-gradient-to-br ${reward.color} text-white rounded-xl py-4 px-3 text-center shadow-xl border-2 ${getRarityBorderColor(reward.rarity)}`}>
                    <reward.icon className="w-5 h-5 mx-auto mb-2" />
                    <div className="text-lg font-black">{reward.points}</div>
                    <div className="text-xs font-bold opacity-90">COINS</div>
                    <div className="text-xs mt-2 bg-white/20 rounded-full px-2 py-1 font-medium">
                      {reward.rarity}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Statistics */}
              <div className="mt-6 bg-gradient-to-r from-white/10 to-white/5 rounded-xl p-4 border border-white/10">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-black text-yellow-400 mb-1">1</div>
                    <div className="text-xs text-white/80 font-medium">Free Spin/Day</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-green-400 mb-1">50</div>
                    <div className="text-xs text-white/80 font-medium">Max Coins</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-purple-400 mb-1">10-50</div>
                    <div className="text-xs text-white/80 font-medium">Range</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SpinWheel;
