
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Pickaxe, Clock, Zap, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useUserData } from '@/hooks/useUserData';
import { useNotifications } from '@/hooks/useNotifications';
import { toast } from '@/hooks/use-toast';

const MiningDashboard = () => {
  const { user } = useAuth();
  const { updateCoins } = useUserData();
  const { notifyMiningCompleted } = useNotifications();
  const [miningData, setMiningData] = useState({
    mining_progress: 0,
    can_mine_next: null,
    last_mining_time: null,
    coins_mined: 0
  });
  const [timeLeft, setTimeLeft] = useState('');
  const [canCollect, setCanCollect] = useState(false);
  const [isCollecting, setIsCollecting] = useState(false);

  useEffect(() => {
    if (user) {
      fetchMiningData();
    }
  }, [user]);

  useEffect(() => {
    const timer = setInterval(() => {
      updateTimer();
    }, 1000);

    return () => clearInterval(timer);
  }, [miningData]);

  const fetchMiningData = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('mining_sessions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      if (data) {
        setMiningData(data);
      }
    } catch (error) {
      console.error('Error fetching mining data:', error);
    }
  };

  const updateTimer = () => {
    if (!miningData.last_mining_time) {
      setTimeLeft('Ready to mine!');
      setCanCollect(false);
      return;
    }

    const lastMining = new Date(miningData.last_mining_time);
    const now = new Date();
    const miningDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const timeElapsed = now.getTime() - lastMining.getTime();
    const remainingTime = miningDuration - timeElapsed;

    if (remainingTime <= 0) {
      // Mining completed
      if (miningData.mining_progress < 100) {
        // Update progress to 100% if mining is completed
        updateMiningProgress(100);
      }
      setTimeLeft('Mining completed!');
      setCanCollect(true);
    } else {
      // Mining in progress
      const progress = Math.min((timeElapsed / miningDuration) * 100, 100);
      
      if (Math.floor(progress) !== miningData.mining_progress) {
        updateMiningProgress(Math.floor(progress));
      }

      const hours = Math.floor(remainingTime / (1000 * 60 * 60));
      const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
      
      setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      setCanCollect(false);
    }
  };

  const updateMiningProgress = async (progress: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('mining_sessions')
        .update({ 
          mining_progress: progress,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;
      
      setMiningData(prev => ({ ...prev, mining_progress: progress }));
    } catch (error) {
      console.error('Error updating mining progress:', error);
    }
  };

  const startMining = async () => {
    if (!user) return;

    try {
      const now = new Date().toISOString();
      const { error } = await supabase
        .from('mining_sessions')
        .update({
          last_mining_time: now,
          mining_progress: 0,
          updated_at: now
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setMiningData(prev => ({
        ...prev,
        last_mining_time: now,
        mining_progress: 0
      }));

      toast({
        title: "Mining Started! ⛏️",
        description: "Your mining session has begun. Come back in 24 hours to collect your points!",
      });
    } catch (error) {
      console.error('Error starting mining:', error);
    }
  };

  const collectPoints = async () => {
    if (!user || isCollecting) return;

    setIsCollecting(true);
    try {
      const pointsToAdd = 100;
      
      // Add points to user's wallet
      await updateCoins(pointsToAdd, 'mining', 'Daily mining reward');

      // Update mining session
      const { error } = await supabase
        .from('mining_sessions')
        .update({
          coins_mined: miningData.coins_mined + pointsToAdd,
          mining_progress: 0,
          last_mining_time: null,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      // Send notification
      notifyMiningCompleted(pointsToAdd);

      setMiningData(prev => ({
        ...prev,
        coins_mined: prev.coins_mined + pointsToAdd,
        mining_progress: 0,
        last_mining_time: null
      }));

      setCanCollect(false);
      setTimeLeft('Ready to mine!');

      toast({
        title: "Points Collected! 🎉",
        description: `You earned ${pointsToAdd} points! Start mining again to earn more.`,
      });
    } catch (error) {
      console.error('Error collecting points:', error);
      toast({
        title: "Error",
        description: "Failed to collect points. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCollecting(false);
    }
  };

  const canStartMining = !miningData.last_mining_time && miningData.mining_progress === 0;

  return (
    <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-t-lg">
        <CardTitle className="text-xl flex items-center gap-2">
          <Pickaxe className="w-6 h-6" />
          Point Mining
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {/* Mining Progress */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Mining Progress</span>
            <Badge variant="secondary" className="font-mono">
              {miningData.mining_progress}%
            </Badge>
          </div>
          <Progress 
            value={miningData.mining_progress} 
            className="h-3 bg-gray-200"
          />
        </div>

        {/* Timer Display */}
        <div className="bg-white p-4 rounded-xl border border-yellow-200 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-orange-500" />
            <span className="font-semibold text-gray-700">
              {canStartMining ? 'Ready to Start' : canCollect ? 'Ready to Collect' : 'Mining in Progress'}
            </span>
          </div>
          <div className="text-2xl font-bold text-orange-600 font-mono">
            {timeLeft}
          </div>
          {!canStartMining && !canCollect && (
            <p className="text-sm text-gray-600 mt-2">
              Mining will complete in 24 hours
            </p>
          )}
        </div>

        {/* Action Button */}
        <div className="text-center">
          {canStartMining ? (
            <Button 
              onClick={startMining}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-3 text-lg"
            >
              <Zap className="w-5 h-5 mr-2" />
              Start Mining
            </Button>
          ) : canCollect ? (
            <Button 
              onClick={collectPoints}
              disabled={isCollecting}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 text-lg"
            >
              {isCollecting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Collecting...
                </>
              ) : (
                <>
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Collect 100 Points
                </>
              )}
            </Button>
          ) : (
            <Button 
              disabled
              className="w-full bg-gray-400 text-white font-semibold py-3 text-lg cursor-not-allowed"
            >
              <Clock className="w-5 h-5 mr-2" />
              Mining in Progress...
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-3 rounded-lg border border-yellow-200 text-center">
            <div className="text-sm text-gray-600">Total Mined</div>
            <div className="text-lg font-bold text-yellow-600">{miningData.coins_mined}</div>
          </div>
          <div className="bg-white p-3 rounded-lg border border-yellow-200 text-center">
            <div className="text-sm text-gray-600">Session Reward</div>
            <div className="text-lg font-bold text-orange-600">100 Points</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MiningDashboard;
