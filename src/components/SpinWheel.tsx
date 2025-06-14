
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
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
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
            <div className="w-1 h-1 bg-yellow-400 rounded-full opacity-60"></div>
          </div>
        ))}
      </div>

      {/* Floating coins animation */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            <Coins className="w-3 h-3 text-yellow-400 opacity-40" />
          </div>
        ))}
      </div>

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
          {/* Modern Enhanced Spin Wheel */}
          <div className="relative mx-auto w-80 h-80">
            {/* Multiple glowing rings */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 opacity-60 blur-2xl animate-pulse"></div>
            <div className="absolute inset-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-40 blur-xl animate-pulse"></div>
            
            {/* Main wheel container with enhanced border */}
            <div className="absolute inset-4 rounded-full border-8 border-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 bg-white shadow-2xl overflow-hidden">
              <div className="absolute inset-0 rounded-full border-4 border-white/50"></div>
              
              <div 
                className={`w-full h-full rounded-full transition-transform ease-out relative ${isSpinning ? 'duration-[4000ms]' : 'duration-1000'}`}
                style={{ transform: `rotate(${rotation}deg)` }}
              >
                {rewards.map((reward, index) => {
                  const angle = (360 / rewards.length) * index;
                  const nextAngle = (360 / rewards.length) * (index + 1);
                  const Icon = reward.icon;
                  
                  return (
                    <div
                      key={index}
                      className={`absolute w-full h-full bg-gradient-to-br ${reward.color} opacity-95 hover:opacity-100 transition-all duration-300`}
                      style={{
                        clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos((angle * Math.PI) / 180)}% ${50 + 50 * Math.sin((angle * Math.PI) / 180)}%, ${50 + 50 * Math.cos((nextAngle * Math.PI) / 180)}% ${50 + 50 * Math.sin((nextAngle * Math.PI) / 180)}%)`,
                      }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div 
                          className="text-white font-bold text-center transform"
                          style={{ 
                            transform: `rotate(${angle + 22.5}deg) translateY(-60px)`,
                            transformOrigin: '50% 60px'
                          }}
                        >
                          <Icon className="w-6 h-6 mx-auto mb-1 drop-shadow-lg" />
                          <div className="text-xl font-black drop-shadow-lg bg-black/20 rounded px-2 py-1">
                            {reward.label}
                          </div>
                          <div className="text-xs font-bold opacity-90 mt-1">COINS</div>
                        </div>
                      </div>
                      
                      {/* Segment separator lines */}
                      <div 
                        className="absolute top-0 left-1/2 w-0.5 h-full bg-white/30 transform -translate-x-1/2"
                        style={{ transformOrigin: '50% 100%', transform: `translateX(-50%) rotate(${angle}deg)` }}
                      ></div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Enhanced 3D Pointer */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-3 z-30">
              <div className="relative">
                <div className="w-0 h-0 border-l-8 border-r-8 border-b-16 border-l-transparent border-r-transparent border-b-yellow-500 drop-shadow-2xl filter brightness-110"></div>
                <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mx-auto -mt-2 border-4 border-white shadow-xl"></div>
                <div className="absolute inset-0 bg-white/30 rounded-full animate-ping"></div>
              </div>
            </div>
            
            {/* Enhanced Center circle */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-br from-yellow-400 via-orange-500 to-yellow-600 rounded-full z-20 flex items-center justify-center border-6 border-white shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-full"></div>
              <Sparkles className={`w-8 h-8 text-white relative z-10 ${isSpinning ? 'animate-spin' : 'animate-pulse'}`} />
            </div>

            {/* Win amount display with enhanced animation */}
            {wonAmount && !isSpinning && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40">
                <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 text-white px-8 py-4 rounded-2xl text-2xl font-black animate-bounce border-4 border-white shadow-2xl">
                  <div className="flex items-center gap-2">
                    <Coins className="w-6 h-6 animate-spin" />
                    +{wonAmount}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Spin Button */}
          <div className="text-center space-y-4">
            {canSpin ? (
              <Button
                onClick={handleSpin}
                disabled={isSpinning}
                className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 text-white px-16 py-6 text-2xl font-bold shadow-2xl transform transition-all duration-300 hover:scale-110 disabled:scale-100 disabled:opacity-70 rounded-3xl border-4 border-white relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                {isSpinning ? (
                  <>
                    <Sparkles className="w-8 h-8 mr-4 animate-spin relative z-10" />
                    <span className="relative z-10">Spinning...</span>
                  </>
                ) : (
                  <>
                    <Gift className="w-8 h-8 mr-4 animate-pulse relative z-10" />
                    <span className="relative z-10">SPIN NOW!</span>
                  </>
                )}
              </Button>
            ) : (
              <div className="space-y-4">
                <Button disabled className="bg-gray-500 text-gray-300 px-16 py-6 text-2xl font-bold rounded-3xl border-4 border-gray-400 opacity-60">
                  Already Spun Today
                </Button>
                <p className="text-white/80 font-medium text-lg">
                  Next spin in: <Badge variant="outline" className="font-bold text-yellow-400 bg-yellow-400/10 border-yellow-400/30 text-lg px-3 py-1">{getTimeUntilNextSpin()}</Badge>
                </p>
              </div>
            )}
          </div>

          {/* Enhanced Rewards Info */}
          <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
            <h4 className="font-bold text-white mb-6 text-center text-xl flex items-center justify-center gap-3">
              <Trophy className="w-6 h-6 text-yellow-400" />
              Today's Reward Pool
              <Trophy className="w-6 h-6 text-yellow-400" />
            </h4>
            <div className="grid grid-cols-4 gap-3">
              {rewards.map((reward, index) => (
                <div key={index} className={`bg-gradient-to-br ${reward.color} text-white rounded-2xl py-4 px-3 text-center shadow-xl transform hover:scale-105 transition-all duration-300 border-2 ${getRarityBorderColor(reward.rarity)}`}>
                  <reward.icon className="w-5 h-5 mx-auto mb-2 drop-shadow-lg" />
                  <div className="text-lg font-black drop-shadow-lg">{reward.points}</div>
                  <div className="text-xs font-bold opacity-90">COINS</div>
                  <div className={`text-xs mt-2 bg-white/20 rounded-full px-2 py-1 font-medium`}>
                    {reward.rarity}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Enhanced Statistics */}
            <div className="mt-8 bg-gradient-to-r from-white/10 to-white/5 rounded-2xl p-6 border border-white/10">
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-black text-yellow-400 mb-2">1</div>
                  <div className="text-sm text-white/80 font-medium">Free Spin/Day</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-green-400 mb-2">50</div>
                  <div className="text-sm text-white/80 font-medium">Max Coins</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-purple-400 mb-2">10-50</div>
                  <div className="text-sm text-white/80 font-medium">Range</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpinWheel;
