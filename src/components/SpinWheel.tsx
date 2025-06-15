
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCcw, Gift, Coins, Star } from 'lucide-react';
import { useUserData } from '@/hooks/useUserData';
import { toast } from '@/hooks/use-toast';

interface SpinReward {
  id: number;
  type: 'coins' | 'points' | 'bonus';
  amount: number;
  label: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SpinWheel = () => {
  const { updateCoins, wallet } = useUserData();
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [lastWin, setLastWin] = useState<SpinReward | null>(null);
  const [spinsLeft, setSpinsLeft] = useState(3);

  const rewards: SpinReward[] = [
    { id: 1, type: 'coins', amount: 50, label: '50 Coins', color: 'from-yellow-400 to-yellow-600', icon: Coins },
    { id: 2, type: 'points', amount: 25, label: '25 Points', color: 'from-blue-400 to-blue-600', icon: Star },
    { id: 3, type: 'coins', amount: 100, label: '100 Coins', color: 'from-green-400 to-green-600', icon: Coins },
    { id: 4, type: 'bonus', amount: 10, label: '10 Bonus', color: 'from-purple-400 to-purple-600', icon: Gift },
    { id: 5, type: 'coins', amount: 75, label: '75 Coins', color: 'from-orange-400 to-orange-600', icon: Coins },
    { id: 6, type: 'points', amount: 50, label: '50 Points', color: 'from-pink-400 to-pink-600', icon: Star },
  ];

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

      // Award the prize
      if (wonReward.type === 'coins') {
        await updateCoins(wonReward.amount, 'spin_wheel', `Won ${wonReward.amount} coins from spin wheel`);
      }

      toast({
        title: "🎉 Congratulations!",
        description: `You won ${wonReward.label}!`,
      });
    }, 3000);
  }, [isSpinning, spinsLeft, currentRotation, updateCoins]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <RotateCcw className="w-6 h-6" />
            Lucky Spin Wheel
          </CardTitle>
          <p className="text-purple-100">Spin to win amazing rewards!</p>
        </CardHeader>
      </Card>

      {/* Spin Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{spinsLeft}</div>
            <div className="text-sm text-blue-500">Spins Left</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{wallet?.total_coins || 0}</div>
            <div className="text-sm text-green-500">Total Coins</div>
          </CardContent>
        </Card>
      </div>

      {/* Spin Wheel */}
      <Card className="overflow-hidden">
        <CardContent className="p-8">
          <div className="relative w-80 h-80 mx-auto">
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
                      className="absolute top-4 right-8 text-white text-center transform -rotate-90"
                      style={{ transform: `rotate(${-angle + 30}deg)` }}
                    >
                      <Icon className="w-4 h-4 mx-auto mb-1" />
                      <div className="text-xs font-bold whitespace-nowrap">{reward.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Spin Button */}
          <div className="text-center mt-8">
            <Button
              onClick={handleSpin}
              disabled={isSpinning || spinsLeft <= 0}
              className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-lg shadow-2xl transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSpinning ? (
                <div className="flex flex-col items-center">
                  <RotateCcw className="w-8 h-8 animate-spin mb-2" />
                  <span>Spinning...</span>
                </div>
              ) : spinsLeft > 0 ? (
                <div className="flex flex-col items-center">
                  <RotateCcw className="w-8 h-8 mb-2" />
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
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center">
                <lastWin.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-bold text-green-800">Last Win</div>
                <div className="text-green-600">{lastWin.label}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* How to Get More Spins */}
      <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
        <CardContent className="p-4">
          <h3 className="font-bold text-orange-800 mb-2">How to Get More Spins?</h3>
          <ul className="text-sm text-orange-700 space-y-1">
            <li>• Complete daily tasks</li>
            <li>• Login daily for streak bonus</li>
            <li>• Refer friends to earn spins</li>
            <li>• Watch ads for extra spins</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpinWheel;
