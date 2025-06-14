
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Pickaxe, Clock, Coins, Zap } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useUserData } from '@/hooks/useUserData';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { supabase } from '@/integrations/supabase/client';

const MiningDashboard: React.FC = () => {
  const { user } = useAuth();
  const { wallet, updateCoins, refetchData } = useUserData();
  const { requireAuth, AuthDialog } = useRequireAuth();
  const [isMining, setIsMining] = useState(false);
  const [miningProgress, setMiningProgress] = useState(0);
  const [canMine, setCanMine] = useState(true);
  const [timeUntilNextMining, setTimeUntilNextMining] = useState(0);
  const [minedCoins, setMinedCoins] = useState(0);
  const [miningSession, setMiningSession] = useState<any>(null);

  // Fetch mining session from database
  useEffect(() => {
    const fetchMiningSession = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('mining_sessions')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setMiningSession(data);
          
          // Check if mining is in progress
          if (data.is_mining_active) {
            setIsMining(true);
            
            // Calculate progress based on time elapsed
            if (data.mining_started_at) {
              const startTime = new Date(data.mining_started_at).getTime();
              const now = Date.now();
              const elapsedTime = now - startTime;
              const totalMiningTime = 60000; // 1 minute for testing (would be longer in production)
              const calculatedProgress = Math.min(Math.floor((elapsedTime / totalMiningTime) * 100), 100);
              
              setMiningProgress(calculatedProgress);
              setMinedCoins(Math.min(calculatedProgress, 100));
              
              if (calculatedProgress >= 100) {
                setIsMining(false);
              }
            }
          }
          
          // Check if mining is on cooldown
          if (data.mining_completed_at) {
            const completedTime = new Date(data.mining_completed_at).getTime();
            const now = Date.now();
            const hoursSinceMining = (now - completedTime) / (1000 * 60 * 60);
            
            if (hoursSinceMining < 24) {
              setCanMine(false);
              setTimeUntilNextMining(24 - hoursSinceMining);
            } else {
              setCanMine(true);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching mining session:', error);
      }
    };
    
    fetchMiningSession();
    
    const intervalId = setInterval(() => {
      fetchMiningSession();
    }, 10000); // Refresh every 10 seconds
    
    return () => clearInterval(intervalId);
  }, [user]);

  // Timer for mining progress update
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isMining) {
      interval = setInterval(() => {
        setMiningProgress(prev => {
          const newProgress = prev + 1;
          const newMinedCoins = Math.min(newProgress, 100);
          setMinedCoins(newMinedCoins);
          
          if (newProgress >= 100) {
            clearInterval(interval);
            setIsMining(false);
          }
          
          return newProgress > 100 ? 100 : newProgress;
        });
      }, 600); // Speed adjusted for quicker mining (for testing purposes)
    }
    
    return () => clearInterval(interval);
  }, [isMining]);

  // Timer for countdown
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

  const startMining = async () => {
    const startMiningAction = async () => {
      if (!canMine || !user) return;
      
      try {
        // Update mining session in database
        const now = new Date().toISOString();
        const { error } = await supabase
          .from('mining_sessions')
          .update({
            is_mining_active: true,
            mining_progress: 0,
            coins_mined: 0,
            mining_started_at: now,
            last_mining_time: now
          })
          .eq('user_id', user.id);
        
        if (error) throw error;
        
        // Start mining animation locally
        setIsMining(true);
        setMiningProgress(0);
        setMinedCoins(0);
      } catch (error) {
        console.error('Error starting mining:', error);
        toast({
          title: "Error",
          description: "Failed to start mining. Please try again.",
          variant: "destructive",
        });
      }
    };
    
    requireAuth(startMiningAction);
  };

  const completeMining = async () => {
    const completeMiningAction = async () => {
      if (!user) return;
      
      try {
        // Update mining session in database
        const now = new Date().toISOString();
        const { error } = await supabase
          .from('mining_sessions')
          .update({
            is_mining_active: false,
            mining_progress: 100,
            coins_mined: 100,
            mining_completed_at: now
          })
          .eq('user_id', user.id);
        
        if (error) throw error;
        
        // Update coins in database
        await updateCoins(100, 'mining', 'Daily mining reward');
        
        setCanMine(false);
        setTimeUntilNextMining(24);
        
        toast({
          title: "Mining Complete! 🎉",
          description: `You earned 100 coins! Come back in 24 hours to mine again.`,
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
    
    requireAuth(completeMiningAction);
  };

  const collectMining = () => {
    if (miningProgress === 100 && minedCoins > 0) {
      completeMining();
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
    <>
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
                Collect 100 Coins
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
      <AuthDialog />
    </>
  );
};

export default MiningDashboard;
