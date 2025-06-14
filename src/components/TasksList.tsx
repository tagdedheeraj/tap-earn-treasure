
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, Play, Trophy, Users, Calendar, Gift, Zap, Star } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useUserData } from '@/hooks/useUserData';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const TasksList: React.FC = () => {
  const { wallet, updateCoins } = useUserData();
  const { user } = useAuth();
  const [loginStreakProgress, setLoginStreakProgress] = useState(0);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Watch Video Ads',
      description: 'Watch 3 rewarded video ads to earn points',
      reward: 50,
      progress: 0,
      total: 3,
      type: 'daily',
      completed: false,
      icon: Play,
      color: 'from-green-400 to-green-600',
    },
    {
      id: 2,
      title: 'Complete Daily Quiz',
      description: 'Answer 5 questions correctly',
      reward: 20,
      progress: 0,
      total: 1,
      type: 'daily',
      completed: false,
      icon: Trophy,
      color: 'from-blue-400 to-blue-600',
    },
    {
      id: 3,
      title: 'Invite Friends',
      description: 'Invite friends who complete their first mining',
      reward: 100,
      progress: 0,
      total: 1,
      type: 'referral',
      completed: false,
      icon: Users,
      color: 'from-purple-400 to-purple-600',
    },
    {
      id: 4,
      title: '7-Day Login Streak',
      description: 'Login daily for 7 consecutive days',
      reward: 100,
      progress: 0,
      total: 7,
      type: 'streak',
      completed: false,
      icon: Calendar,
      color: 'from-orange-400 to-orange-600',
    },
    {
      id: 5,
      title: 'Weekly Bonus',
      description: 'Complete all daily tasks for a week',
      reward: 200,
      progress: 0,
      total: 7,
      type: 'weekly',
      completed: false,
      icon: Gift,
      color: 'from-pink-400 to-pink-600',
    },
  ]);

  useEffect(() => {
    if (user) {
      fetchLoginStreakProgress();
    }
  }, [user]);

  const fetchLoginStreakProgress = async () => {
    if (!user) return;

    try {
      const { data: loginStreakTask, error } = await supabase
        .from('user_tasks')
        .select('*')
        .eq('user_id', user.id)
        .eq('task_type', 'login_streak')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching login streak:', error);
        return;
      }

      const progress = loginStreakTask?.completed_count || 0;
      const isCompleted = progress >= 7;
      
      setLoginStreakProgress(progress);
      
      // Track if reward was already claimed (using a local state for now)
      if (progress === 7 && !rewardClaimed) {
        setRewardClaimed(true);
        updateCoins(100, 'task', '7-Day Login Streak completion');
        toast({
          title: "🎉 Login Streak Completed!",
          description: "You earned 100 points for your 7-day login streak!",
        });
      }
      
      // Update the login streak task in the tasks array
      setTasks(prevTasks => 
        prevTasks.map(task => {
          if (task.id === 4) {
            return {
              ...task,
              progress: progress,
              completed: isCompleted
            };
          }
          return task;
        })
      );
    } catch (error) {
      console.error('Error in fetchLoginStreakProgress:', error);
    }
  };

  const completeTask = async (taskId: number) => {
    setTasks(prevTasks => 
      prevTasks.map(task => {
        if (task.id === taskId && !task.completed && task.id !== 4) {
          const newProgress = Math.min(task.progress + 1, task.total);
          const isCompleted = newProgress >= task.total;
          
          if (isCompleted) {
            updateCoins(task.reward, 'task', `Task completion: ${task.title}`);
            toast({
              title: "🎉 Task Completed!",
              description: `You earned ${task.reward} points!`,
            });
          }
          
          return {
            ...task,
            progress: newProgress,
            completed: isCompleted,
          };
        }
        return task;
      })
    );
  };

  const getTaskTypeColor = (type: string) => {
    switch (type) {
      case 'daily': return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
      case 'weekly': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'streak': return 'bg-gradient-to-r from-orange-500 to-red-500 text-white';
      case 'referral': return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
      default: return 'bg-gradient-to-r from-gray-400 to-gray-600 text-white';
    }
  };

  return (
    <div className="space-y-6 p-1">
      {/* Enhanced Header Card */}
      <Card className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 border-0 text-white shadow-2xl overflow-hidden relative">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-20 translate-x-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16"></div>
        
        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center gap-3 text-2xl font-bold">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <Trophy className="w-8 h-8" />
            </div>
            Daily Tasks & Bonuses
            <Star className="w-6 h-6 text-yellow-300 animate-pulse" />
          </CardTitle>
          <p className="text-white/90 text-lg">Complete tasks to earn 30-50 points daily</p>
        </CardHeader>
        
        <CardContent className="relative z-10">
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20">
              <div className="text-3xl font-bold mb-1">{tasks.filter(t => t.completed).length}</div>
              <div className="text-white/80 text-sm">Completed</div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20">
              <div className="text-3xl font-bold mb-1">{tasks.filter(t => !t.completed).length}</div>
              <div className="text-white/80 text-sm">Pending</div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20">
              <div className="text-3xl font-bold mb-1 text-yellow-300">{tasks.reduce((sum, t) => sum + (t.completed ? t.reward : 0), 0)}</div>
              <div className="text-white/80 text-sm">Points Earned</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Tasks List */}
      <div className="space-y-4">
        {tasks.map((task, index) => {
          const Icon = task.icon;
          const progressPercentage = (task.progress / task.total) * 100;
          
          return (
            <Card 
              key={task.id} 
              className={`group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-lg ${
                task.completed 
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-l-green-500' 
                  : 'bg-white hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 border-l-4 border-l-gray-200'
              }`}
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* Enhanced Icon */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${task.color} text-white flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {task.completed ? (
                      <CheckCircle className="w-8 h-8" />
                    ) : (
                      <Icon className="w-8 h-8" />
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">{task.title}</h3>
                        <p className="text-gray-600 mt-1">{task.description}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={`${getTaskTypeColor(task.type)} px-3 py-1 text-sm font-semibold shadow-md`}>
                          {task.type}
                        </Badge>
                        <div className="flex items-center gap-1 mt-2">
                          <Zap className="w-4 h-4 text-yellow-500" />
                          <span className="text-xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                            +{task.reward}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Enhanced Progress Section */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium">Progress</span>
                        <span className="font-bold text-lg">{task.progress}/{task.total}</span>
                      </div>
                      <div className="relative">
                        <Progress 
                          value={progressPercentage} 
                          className="h-3 bg-gray-200 rounded-full overflow-hidden"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse rounded-full"></div>
                      </div>
                    </div>
                    
                    {/* Enhanced Action Section */}
                    <div className="flex justify-between items-center pt-2">
                      {task.completed ? (
                        <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 text-sm font-semibold shadow-lg">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Completed
                        </Badge>
                      ) : task.id === 4 ? (
                        <Badge variant="outline" className="border-2 border-orange-300 text-orange-700 bg-orange-50 px-4 py-2 font-semibold">
                          <Calendar className="w-4 h-4 mr-2" />
                          Auto-tracked
                        </Badge>
                      ) : (
                        <Button
                          onClick={() => completeTask(task.id)}
                          disabled={task.progress >= task.total}
                          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold px-6 py-2 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          {task.progress > 0 ? 'Continue' : 'Start Task'}
                        </Button>
                      )}
                      
                      {task.type === 'daily' && (
                        <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600 font-medium">Resets in 18h</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default TasksList;
