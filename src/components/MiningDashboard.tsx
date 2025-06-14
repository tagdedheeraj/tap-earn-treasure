
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
  const [canCollect, setCanCollect] = useState(false);
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
        
        if (error) {
          console.log('Mining session not found, will create one when needed');
          return;
        }
        
        if (data) {
          setMiningSession(data);
          
          // Check if user can mine based on last mining time
          if (data.last_mining_time) {
            const lastMiningTime = new Date(data.last_mining_time).getTime();
            const now = Date.now();
            const hoursSinceMining = (now - lastMiningTime) / (1000 * 60 * 60);
            
            if (hoursSinceMining < 24) {
              // Mining is in progress or completed, check the exact state
              const remainingHours = 24 - hoursSinceMining;
              const progressPercentage = Math.min(((24 - remainingHours) / 24) * 100, 100);
              
              setMiningProgress(progressPercentage);
              setCanMine(false);
              
              if (progressPercentage >= 100) {
                // 24 hours completed, allow collection
                setCanCollect(true);
                setIsMining(false);
              } else {
                // Still mining
                setIsMining(true);
                setCanCollect(false);
              }
              
              setTimeUntilNextMining(remainingHours);
            } else {
              // Can start new mining
              setCanMine(true);
              setIsMining(false);
              setCanCollect(false);
              setMiningProgress(0);
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
    }, 60000); // Check every minute for more accurate updates
    
    return () => clearInterval(intervalId);
  }, [user]);

  // Timer for mining progress update - updates every minute for 24 hours
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isMining && miningSession?.last_mining_time) {
      interval = setInterval(() => {
        const lastMiningTime = new Date(miningSession.last_mining_time).getTime();
        const now = Date.now();
        const hoursPassed = (now - lastMiningTime) / (1000 * 60 * 60);
        const progressPercentage = Math.min((hoursPassed / 24) * 100, 100);
        
        setMiningProgress(progressPercentage);
        
        if (progressPercentage >= 100) {
          // 24 hours completed
          setIsMining(false);
          setCanCollect(true);
          clearInterval(interval);
          
          toast({
            title: "Mining Complete! 🎉",
            description: "Your 24-hour mining session is complete! Collect your 100 coins now.",
          });
        }
      }, 60000); // Update every minute
    }
    
    return () => clearInterval(interval);
  }, [isMining, miningSession]);

  // Timer for countdown display
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (!canMine && timeUntilNextMining > 0) {
      interval = setInterval(() => {
        setTimeUntilNextMining(prev => {
          const newTime = prev - (1/60); // Decrease by 1 minute
          if (newTime <= 0) {
            setCanMine(true);
            setCanCollect(true);
            return 0;
          }
          return newTime;
        });
      }, 60000); // Update every minute
    }
    
    return () => clearInterval(interval);
  }, [canMine, timeUntilNextMining]);

  const startMining = async () => {
    const startMiningAction = async () => {
      if (!canMine || !user) return;
      
      try {
        const now = new Date().toISOString();
        
        const { error } = await supabase
          .from('mining_sessions')
          .update({
            mining_progress: 0,
            coins_mined: 0,
            last_mining_time: now
          })
          .eq('user_id', user.id);
        
        if (error) throw error;
        
        setIsMining(true);
        setMiningProgress(0);
        setCanMine(false);
        setCanCollect(false);
        setTimeUntilNextMining(24);
        
        // Update mining session state
        setMiningSession(prev => ({
          ...prev,
          last_mining_time: now
        }));
        
        toast({
          title: "Mining Started! ⛏️",
          description: "Your 24-hour mining session has begun. Come back in 24 hours to collect your coins!",
        });
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
      if (!user || !canCollect) return;
      
      try {
        const now = new Date().toISOString();
        
        const { error } = await supabase
          .from('mining_sessions')
          .update({
            mining_progress: 100,
            coins_mined: 100,
            last_mining_time: now
          })
          .eq('user_id', user.id);
        
        if (error) throw error;
        
        // Award 100 coins
        await updateCoins(100, 'mining', 'Daily mining reward - 24 hours completed');
        
        // Reset states for next mining cycle
        setCanMine(true);
        setCanCollect(false);
        setMiningProgress(0);
        setIsMining(false);
        setTimeUntilNextMining(0);
        
        toast({
          title: "Coins Collected! 🎉",
          description: `You earned 100 coins! You can start mining again now.`,
        });
      } catch (error) {
        console.error('Error completing mining:', error);
        toast({
          title: "Error",
          description: "Failed to collect mining reward. Please try again.",
          variant: "destructive",
        });
      }
    };
    
    requireAuth(completeMiningAction);
  };

  const formatTimeRemaining = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const formatMiningStatus = () => {
    if (isMining) {
      return `Mining... ${Math.floor(miningProgress)}% complete`;
    }
    if (canCollect) {
      return "Ready to collect!";
    }
    if (!canMine) {
      return `Next mining in: ${formatTimeRemaining(timeUntilNextMining)}`;
    }
    return "Ready to mine";
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
          <p className="text-purple-100">Mine 100 coins every 24 hours</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Progress (24 Hours)</span>
              <Badge variant="secondary" className="bg-white/20 text-white">
                {Math.floor(miningProgress)}/100
              </Badge>
            </div>
            <Progress value={miningProgress} className="h-3 bg-white/20" />
            <div className="flex justify-between items-center text-sm">
              <span>{formatMiningStatus()}</span>
              {canCollect && <span className="animate-pulse text-yellow-300">💰 Ready!</span>}
            </div>
          </div>

          <div className="text-center">
            {canMine && !isMining && !canCollect ? (
              <Button
                onClick={startMining}
                className="w-full bg-white text-purple-600 hover:bg-gray-100 font-bold py-3 text-lg"
              >
                <Pickaxe className="w-5 h-5 mr-2" />
                Start 24-Hour Mining
              </Button>
            ) : canCollect ? (
              <Button
                onClick={completeMining}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 text-lg animate-pulse"
              >
                <Coins className="w-5 h-5 mr-2" />
                Collect 100 Coins
              </Button>
            ) : isMining ? (
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-purple-100">
                  <Clock className="w-5 h-5" />
                  <span>Time remaining: {formatTimeRemaining(24 - (miningProgress / 100 * 24))}</span>
                </div>
                <Button disabled className="w-full bg-white/20 text-white/50 font-bold py-3 text-lg">
                  Mining in Progress... {Math.floor(miningProgress)}%
                </Button>
              </div>
            ) : (
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-purple-100">
                  <Clock className="w-5 h-5" />
                  <span>Next mining in: {formatTimeRemaining(timeUntilNextMining)}</span>
                </div>
                <Button disabled className="w-full bg-white/20 text-white/50 font-bold py-3 text-lg">
                  Mining on Cooldown
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <AuthDialog />
    </>
  );
};

export default MiningDashboard;
