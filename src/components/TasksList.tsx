import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, Play, Trophy, Users, Calendar, Gift } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useUserData } from '@/hooks/useUserData';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface TasksListProps {
  totalCoins: number;
  setTotalCoins: (coins: number) => void;
}

const TasksList: React.FC = () => {
  const { wallet, updateCoins } = useUserData();
  const { user } = useAuth();
  const [loginStreakProgress, setLoginStreakProgress] = useState(0);
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
      color: 'bg-green-500',
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
      color: 'bg-blue-500',
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
      color: 'bg-purple-500',
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
      color: 'bg-orange-500',
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
      color: 'bg-pink-500',
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
      
      // Update the login streak task in the tasks array
      setTasks(prevTasks => 
        prevTasks.map(task => {
          if (task.id === 4) { // Login streak task
            return {
              ...task,
              progress: progress,
              completed: isCompleted
            };
          }
          return task;
        })
      );

      // If just completed (exactly 7), give reward
      if (progress === 7 && loginStreakTask && !loginStreakTask.reward_claimed) {
        updateCoins(100, 'task', '7-Day Login Streak completion');
        toast({
          title: "Login Streak Completed! 🎉",
          description: "You earned 100 points for your 7-day login streak!",
        });

        // Mark reward as claimed
        await supabase
          .from('user_tasks')
          .update({ reward_claimed: true })
          .eq('id', loginStreakTask.id);
      }
    } catch (error) {
      console.error('Error in fetchLoginStreakProgress:', error);
    }
  };

  const completeTask = async (taskId: number) => {
    setTasks(prevTasks => 
      prevTasks.map(task => {
        if (task.id === taskId && !task.completed && task.id !== 4) { // Don't allow manual completion of login streak
          const newProgress = Math.min(task.progress + 1, task.total);
          const isCompleted = newProgress >= task.total;
          
          if (isCompleted) {
            updateCoins(task.reward, 'task', `Task completion: ${task.title}`);
            toast({
              title: "Task Completed! 🎉",
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
      case 'daily': return 'bg-blue-100 text-blue-700';
      case 'weekly': return 'bg-purple-100 text-purple-700';
      case 'streak': return 'bg-orange-100 text-orange-700';
      case 'referral': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-blue-600" />
            Daily Tasks & Bonuses
          </CardTitle>
          <p className="text-sm text-gray-600">Complete tasks to earn 30-50 points daily</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">{tasks.filter(t => t.completed).length}</p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">{tasks.filter(t => !t.completed).length}</p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{tasks.reduce((sum, t) => sum + (t.completed ? t.reward : 0), 0)}</p>
              <p className="text-sm text-gray-600">Points Earned</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks List */}
      <div className="space-y-4">
        {tasks.map((task) => {
          const Icon = task.icon;
          const progressPercentage = (task.progress / task.total) * 100;
          
          return (
            <Card key={task.id} className={`border-l-4 ${task.completed ? 'border-l-green-500 bg-green-50' : 'border-l-gray-300'}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full ${task.color} text-white flex items-center justify-center flex-shrink-0`}>
                    {task.completed ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <Icon className="w-6 h-6" />
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{task.title}</h3>
                        <p className="text-sm text-gray-600">{task.description}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={getTaskTypeColor(task.type)} variant="secondary">
                          {task.type}
                        </Badge>
                        <p className="text-lg font-bold text-yellow-600 mt-1">
                          +{task.reward} points
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{task.progress}/{task.total}</span>
                      </div>
                      <Progress value={progressPercentage} className="h-2" />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      {task.completed ? (
                        <Badge variant="default" className="bg-green-500">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Completed
                        </Badge>
                      ) : task.id === 4 ? (
                        <Badge variant="outline" className="text-orange-600 border-orange-300">
                          <Calendar className="w-4 h-4 mr-1" />
                          Auto-tracked
                        </Badge>
                      ) : (
                        <Button
                          onClick={() => completeTask(task.id)}
                          disabled={task.progress >= task.total}
                          variant="outline"
                          size="sm"
                        >
                          {task.progress > 0 ? 'Continue' : 'Start Task'}
                        </Button>
                      )}
                      
                      {task.type === 'daily' && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          Resets in 18h
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
