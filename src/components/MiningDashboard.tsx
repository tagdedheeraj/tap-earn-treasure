
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Pickaxe, Clock, Coins, Zap } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useUserData } from '@/hooks/useUserData';
import { supabase } from '@/integrations/supabase/client';

const MiningDashboard: React.FC = () => {
  const { user } = useAuth();
  const { wallet, updateCoins, refetchData } = useUserData();
  const [isMining, setIsMining] = useState(false);
  const [miningProgress, setMiningProgress] = useState(0);
  const [canMine, setCanMine] = useState(true);
  const [timeUntilNextMining, setTimeUntilNextMining] = useState(0);
  const [minedCoins, setMinedCoins] = useState(0);

  useEffect(() => {
    const lastMiningTime = localStorage.getItem('lastMiningTime');
    const storedProgress = localStorage.getItem('miningProgress');
    const storedMinedCoins = localStorage.getItem('minedCoins');
    
    if (storedProgress) {
      setMiningProgress(parseInt(storedProgress));
    }
    if (storedMinedCoins) {
      setMinedCoins(parseInt(storedMinedCoins));
    }
    
    if (lastMiningTime) {
      const timeDiff = Date.now() - parseInt(lastMiningTime);
      const hoursElapsed = timeDiff / (1000 * 60 * 60);
      
      if (hoursElapsed < 24) {
        setCanMine(false);
        setTimeUntilNextMining(24 - hoursElapsed);
      }
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (!canMine && timeUntilNextMining > 0) {
      interval = setInterval(() => {
        setTimeUntilNextMining(prev => {
          if (prev <= 0.1) {
            setCanMine(true);
            return 0;
          }
          return prev - 0.1;
        });
      }, 6000); // Update every 6 seconds for demo purposes
    }
    
    return () => clearInterval(interval);
  }, [canMine, timeUntilNextMining]);

  const startMining = () => {
    if (!canMine) return;
    
    setIsMining(true);
    setMiningProgress(0);
    setMinedCoins(0);
    
    const miningInterval = setInterval(() => {
      setMiningProgress(prev => {
        const newProgress = prev + 1;
        const newMinedCoins = Math.floor(newProgress * 1); // 1 coin per progress point
        setMinedCoins(newMinedCoins);
        
        localStorage.setItem('miningProgress', newProgress.toString());
        localStorage.setItem('minedCoins', newMinedCoins.toString());
        
        if (newProgress >= 100) {
          clearInterval(miningInterval);
          setIsMining(false);
          completeMining(newMinedCoins);
        }
        
        return newProgress;
      });
    }, 200); // Fast for demo, in real app this would be much slower
  };

  const completeMining = async (coins: number) => {
    if (!user) return;
    
    try {
      // Update coins in database
      await updateCoins(coins, 'mining', 'Daily mining reward');
      
      setCanMine(false);
      setTimeUntilNextMining(24);
      localStorage.setItem('lastMiningTime', Date.now().toString());
      localStorage.removeItem('miningProgress');
      localStorage.removeItem('minedCoins');
      
      toast({
        title: "Mining Complete! 🎉",
        description: `You earned ${coins} coins! Come back in 24 hours to mine again.`,
      });
    } catch (error) {
      console.error('Error completing mining:', error);
      toast({
        title: "Error",
        description: "Failed to save mining reward. Please try again.",
        variant: "destructive",
      });
    }
  };

  const collectMining = () => {
    if (miningProgress === 100 && minedCoins > 0) {
      completeMining(minedCoins);
      setMiningProgress(0);
      setMinedCoins(0);
    }
  };

  const formatTimeRemaining = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  return (
    <Card className="bg-gradient-to-br from-purple-500 to-blue-600 text-white border-0 shadow-xl">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className={`w-24 h-24 rounded-full bg-white/20 flex items-center justify-center ${isMining ? 'animate-pulse' : ''}`}>
              <Pickaxe className={`w-12 h-12 ${isMining ? 'animate-bounce' : ''}`} />
            </div>
            {isMining && (
              <div className="absolute -top-2 -right-2">
                <Zap className="w-6 h-6 text-yellow-300 animate-ping" />
              </div>
            )}
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">Daily Mining</CardTitle>
        <p className="text-purple-100">Mine up to 100 coins every 24 hours</p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Mining Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm">Progress</span>
            <Badge variant="secondary" className="bg-white/20 text-white">
              {miningProgress}/100
            </Badge>
          </div>
          <Progress value={miningProgress} className="h-3 bg-white/20" />
          <div className="flex justify-between items-center text-sm">
            <span>Mined: {minedCoins} coins</span>
            {isMining && <span className="animate-pulse">⛏️ Mining...</span>}
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center">
          {canMine && miningProgress === 0 ? (
            <Button
              onClick={startMining}
              disabled={isMining}
              className="w-full bg-white text-purple-600 hover:bg-gray-100 font-bold py-3 text-lg"
            >
              <Pickaxe className="w-5 h-5 mr-2" />
              Start Mining
            </Button>
          ) : miningProgress === 100 ? (
            <Button
              onClick={collectMining}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 text-lg"
            >
              <Coins className="w-5 h-5 mr-2" />
              Collect {minedCoins} Coins
            </Button>
          ) : !canMine ? (
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-purple-100">
                <Clock className="w-5 h-5" />
                <span>Next mining in: {formatTimeRemaining(timeUntilNextMining)}</span>
              </div>
              <Button disabled className="w-full bg-white/20 text-white/50 font-bold py-3 text-lg">
                Mining on Cooldown
              </Button>
            </div>
          ) : (
            <Button
              disabled
              className="w-full bg-white/20 text-white/50 font-bold py-3 text-lg"
            >
              Mining in Progress...
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MiningDashboard;
