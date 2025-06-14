
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coins, Sparkles, Gift, Star, Zap, Crown, Diamond } from 'lucide-react';
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

  const rewards = [
    { points: 10, color: 'from-red-500 to-red-600', label: '10', icon: Coins, rarity: 'common' },
    { points: 25, color: 'from-blue-500 to-blue-600', label: '25', icon: Star, rarity: 'common' },
    { points: 50, color: 'from-green-500 to-green-600', label: '50', icon: Sparkles, rarity: 'uncommon' },
    { points: 100, color: 'from-yellow-500 to-yellow-600', label: '100', icon: Zap, rarity: 'rare' },
    { points: 15, color: 'from-purple-500 to-purple-600', label: '15', icon: Gift, rarity: 'common' },
    { points: 75, color: 'from-pink-500 to-pink-600', label: '75', icon: Crown, rarity: 'uncommon' },
    { points: 200, color: 'from-orange-500 to-orange-600', label: '200', icon: Diamond, rarity: 'legendary' },
    { points: 30, color: 'from-indigo-500 to-indigo-600', label: '30', icon: Star, rarity: 'common' },
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
    
    // Enhanced rotation animation - more spins for excitement
    const randomRotation = Math.floor(Math.random() * 360) + (360 * (5 + Math.random() * 5));
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
        description: `You won ${reward.points} points! ${reward.rarity.toUpperCase()} reward!`,
      });
    }, 4000); // Longer spin time for more excitement
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

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600';
      case 'uncommon': return 'text-green-600';
      case 'rare': return 'text-blue-600';
      case 'legendary': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      {/* Floating particles effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
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
            <Sparkles className="w-4 h-4 text-yellow-300 opacity-60" />
          </div>
        ))}
      </div>

      <Card className="bg-gradient-to-br from-white/95 to-purple-50/95 backdrop-blur-lg border-purple-200 shadow-2xl max-w-md mx-auto">
        <CardHeader className="text-center bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
          <CardTitle className="flex items-center justify-center gap-2 text-2xl font-bold relative z-10">
            <Crown className="w-8 h-8 text-yellow-300 animate-bounce" />
            Lucky Spin Wheel
            <Crown className="w-8 h-8 text-yellow-300 animate-bounce" />
          </CardTitle>
          <p className="text-purple-100 relative z-10">Test your luck daily!</p>
        </CardHeader>
        
        <CardContent className="space-y-8 p-6">
          {/* Enhanced Spin Wheel */}
          <div className="relative mx-auto w-80 h-80">
            {/* Outer glow effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-50 blur-xl animate-pulse"></div>
            
            {/* Main wheel container */}
            <div className="absolute inset-4 rounded-full border-8 border-yellow-400 bg-white shadow-2xl overflow-hidden">
              <div 
                className={`w-full h-full rounded-full transition-transform ease-out ${isSpinning ? 'duration-[4000ms]' : 'duration-1000'}`}
                style={{ transform: `rotate(${rotation}deg)` }}
              >
                {rewards.map((reward, index) => {
                  const angle = (360 / rewards.length) * index;
                  const nextAngle = (360 / rewards.length) * (index + 1);
                  const Icon = reward.icon;
                  
                  return (
                    <div
                      key={index}
                      className={`absolute w-full h-full bg-gradient-to-br ${reward.color} opacity-90 hover:opacity-100 transition-opacity`}
                      style={{
                        clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos((angle * Math.PI) / 180)}% ${50 + 50 * Math.sin((angle * Math.PI) / 180)}%, ${50 + 50 * Math.cos((nextAngle * Math.PI) / 180)}% ${50 + 50 * Math.sin((nextAngle * Math.PI) / 180)}%)`,
                      }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div 
                          className="text-white font-bold text-center transform -rotate-45"
                          style={{ transform: `rotate(${angle + 22.5}deg)` }}
                        >
                          <Icon className="w-6 h-6 mx-auto mb-1" />
                          <div className="text-lg font-black drop-shadow-lg">{reward.label}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Enhanced Pointer */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-20">
              <div className="w-0 h-0 border-l-6 border-r-6 border-b-12 border-l-transparent border-r-transparent border-b-yellow-500 drop-shadow-lg"></div>
              <div className="w-4 h-4 bg-yellow-500 rounded-full mx-auto -mt-1 border-2 border-yellow-600"></div>
            </div>
            
            {/* Center circle with enhanced design */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full z-10 flex items-center justify-center border-4 border-white shadow-xl">
              <Sparkles className="w-8 h-8 text-white animate-spin" />
            </div>

            {/* Win amount display */}
            {wonAmount && !isSpinning && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-full text-xl font-bold animate-bounce border-4 border-white shadow-2xl">
                  +{wonAmount}
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
                className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 text-white px-12 py-4 text-xl font-bold shadow-2xl transform transition-all duration-300 hover:scale-110 disabled:scale-100 disabled:opacity-70 rounded-2xl border-4 border-white"
              >
                {isSpinning ? (
                  <>
                    <Sparkles className="w-6 h-6 mr-3 animate-spin" />
                    Spinning Magic...
                  </>
                ) : (
                  <>
                    <Gift className="w-6 h-6 mr-3 animate-pulse" />
                    SPIN TO WIN!
                  </>
                )}
              </Button>
            ) : (
              <div className="space-y-3">
                <Button disabled className="bg-gray-400 text-gray-600 px-12 py-4 text-xl font-bold rounded-2xl border-4 border-gray-300">
                  Already Spun Today
                </Button>
                <p className="text-gray-600 font-medium">
                  Next spin in: <Badge variant="outline" className="font-bold text-purple-600">{getTimeUntilNextSpin()}</Badge>
                </p>
              </div>
            )}
          </div>

          {/* Enhanced Rewards Info */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
            <h4 className="font-bold text-purple-800 mb-4 text-center text-lg flex items-center justify-center gap-2">
              <Diamond className="w-5 h-5" />
              Today's Rewards Pool
              <Diamond className="w-5 h-5" />
            </h4>
            <div className="grid grid-cols-4 gap-3">
              {rewards.map((reward, index) => (
                <div key={index} className={`bg-gradient-to-br ${reward.color} text-white rounded-xl py-3 px-2 text-center shadow-lg transform hover:scale-105 transition-transform`}>
                  <reward.icon className="w-4 h-4 mx-auto mb-1" />
                  <div className="text-sm font-bold">{reward.points}</div>
                  <div className={`text-xs ${getRarityColor(reward.rarity)} bg-white/90 rounded px-1 mt-1`}>
                    {reward.rarity}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Spin statistics */}
            <div className="mt-6 bg-white/60 rounded-xl p-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-purple-700">1</div>
                  <div className="text-sm text-purple-600">Free Spin/Day</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-pink-700">200</div>
                  <div className="text-sm text-pink-600">Max Reward</div>
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
