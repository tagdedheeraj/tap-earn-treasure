
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coins, Sparkles, Gift } from 'lucide-react';
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

  const rewards = [
    { points: 10, color: 'bg-red-500', label: '10' },
    { points: 25, color: 'bg-blue-500', label: '25' },
    { points: 50, color: 'bg-green-500', label: '50' },
    { points: 100, color: 'bg-yellow-500', label: '100' },
    { points: 15, color: 'bg-purple-500', label: '15' },
    { points: 75, color: 'bg-pink-500', label: '75' },
    { points: 200, color: 'bg-orange-500', label: '200' },
    { points: 30, color: 'bg-indigo-500', label: '30' },
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
    
    // Random rotation between 3-6 full rotations plus random position
    const randomRotation = Math.floor(Math.random() * 360) + (360 * (3 + Math.random() * 3));
    setRotation(prev => prev + randomRotation);

    // Determine winning segment
    const finalRotation = randomRotation % 360;
    const segmentAngle = 360 / rewards.length;
    const winningIndex = Math.floor((360 - finalRotation) / segmentAngle) % rewards.length;
    const reward = rewards[winningIndex];

    setTimeout(async () => {
      setIsSpinning(false);
      
      // Award points
      await updateCoins(reward.points, 'spin_wheel', `Daily spin wheel reward: ${reward.points} points`);
      
      // Update last spin date
      const today = new Date().toDateString();
      localStorage.setItem('lastSpinDate', today);
      setLastSpinDate(today);
      setCanSpin(false);

      // Show success notification
      notifyMiningCompleted(reward.points);
      
      toast({
        title: "🎰 Spin Completed!",
        description: `Congratulations! You won ${reward.points} points!`,
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

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-purple-800">
          <Sparkles className="w-6 h-6 text-yellow-500" />
          Daily Spin Wheel
          <Sparkles className="w-6 h-6 text-yellow-500" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Spin Wheel */}
        <div className="relative mx-auto w-64 h-64">
          <div className="absolute inset-0 rounded-full border-8 border-gray-300 bg-white shadow-2xl">
            <div 
              className={`w-full h-full rounded-full transition-transform duration-3000 ease-out ${isSpinning ? 'animate-spin' : ''}`}
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              {rewards.map((reward, index) => {
                const angle = (360 / rewards.length) * index;
                return (
                  <div
                    key={index}
                    className={`absolute w-full h-full ${reward.color} opacity-80`}
                    style={{
                      clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos(((angle + 45) * Math.PI) / 180)}% ${50 + 50 * Math.sin(((angle + 45) * Math.PI) / 180)}%)`,
                      transform: `rotate(${angle}deg)`,
                    }}
                  >
                    <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-white font-bold text-lg">
                      {reward.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Pointer */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-red-600 z-10"></div>
          
          {/* Center circle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-gray-800 rounded-full z-10 flex items-center justify-center">
            <Coins className="w-4 h-4 text-yellow-400" />
          </div>
        </div>

        {/* Spin Button */}
        <div className="text-center space-y-4">
          {canSpin ? (
            <Button
              onClick={handleSpin}
              disabled={isSpinning}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg font-bold shadow-lg transform transition-transform hover:scale-105"
            >
              {isSpinning ? (
                <>
                  <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                  Spinning...
                </>
              ) : (
                <>
                  <Gift className="w-5 h-5 mr-2" />
                  Spin Now!
                </>
              )}
            </Button>
          ) : (
            <div className="space-y-2">
              <Button disabled className="bg-gray-400 text-gray-600 px-8 py-3 text-lg font-bold">
                Already Spun Today
              </Button>
              <p className="text-sm text-gray-600">
                Next spin in: <Badge variant="outline">{getTimeUntilNextSpin()}</Badge>
              </p>
            </div>
          )}
        </div>

        {/* Rewards Info */}
        <div className="bg-white/50 rounded-lg p-4">
          <h4 className="font-semibold text-purple-800 mb-2 text-center">Daily Rewards:</h4>
          <div className="grid grid-cols-4 gap-2 text-center">
            {rewards.map((reward, index) => (
              <div key={index} className={`${reward.color} text-white rounded-lg py-1 px-2 text-xs font-bold`}>
                {reward.points}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpinWheel;
