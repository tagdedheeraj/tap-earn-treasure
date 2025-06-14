import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, Play, Trophy, Users, Calendar, Gift, Zap, Star, BookOpen, Target, Award, TrendingUp } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useUserData } from '@/hooks/useUserData';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface TasksListProps {
  onNavigateToQuiz?: () => void;
}

const TasksList: React.FC<TasksListProps> = ({ onNavigateToQuiz }) => {
  const { wallet, updateCoins } = useUserData();
  const { user } = useAuth();
  const [loginStreakProgress, setLoginStreakProgress] = useState(0);
  const [weeklyProgress, setWeeklyProgress] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
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
      description: 'Answer quiz questions correctly to earn points',
      reward: 20,
      progress: 0,
      total: 1,
      type: 'daily',
      completed: false,
      icon: BookOpen,
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
      fetchTaskProgress();
    }
  }, [user]);

  const fetchTaskProgress = async () => {
    if (!user) return;

    try {
      // Fetch login streak progress
      const { data: loginStreakTask } = await supabase
        .from('user_tasks')
        .select('*')
        .eq('user_id', user.id)
        .eq('task_type', 'login_streak')
        .maybeSingle();

      const streakProgress = loginStreakTask?.completed_count || 0;
      setLoginStreakProgress(streakProgress);

      // Check if quiz was completed today
      const { data: quizSession } = await supabase
        .from('quiz_sessions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      const today = new Date().toISOString().split('T')[0];
      const quizCompletedToday = quizSession?.last_quiz_date === today;
      setQuizCompleted(quizCompletedToday);

      // Calculate weekly progress (login streak + quiz completion for this week)
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      weekStart.setHours(0, 0, 0, 0);

      // For now, simple calculation: if login streak >= 1 and quiz completed, count as 1 day
      let weeklyDays = 0;
      if (streakProgress >= 1) weeklyDays++;
      if (quizCompletedToday) weeklyDays++;
      setWeeklyProgress(Math.min(weeklyDays, 7));

      // Update tasks array with real progress
      setTasks(prevTasks => 
        prevTasks.map(task => {
          switch (task.id) {
            case 2: // Quiz task
              return {
                ...task,
                progress: quizCompletedToday ? 1 : 0,
                completed: quizCompletedToday
              };
            case 4: // Login streak
              return {
                ...task,
                progress: streakProgress,
                completed: streakProgress >= 7
              };
            case 5: // Weekly bonus
              return {
                ...task,
                progress: weeklyDays,
                completed: weeklyDays >= 7
              };
            default:
              return task;
          }
        })
      );
    } catch (error) {
      console.error('Error fetching task progress:', error);
    }
  };

  const completeTask = async (taskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    if (taskId === 2) {
      // Navigate to quiz for quiz task
      if (onNavigateToQuiz) {
        onNavigateToQuiz();
      }
      return;
    }

    // Handle other tasks
    setTasks(prevTasks => 
      prevTasks.map(t => {
        if (t.id === taskId && !t.completed && t.id !== 4 && t.id !== 5) {
          const newProgress = Math.min(t.progress + 1, t.total);
          const isCompleted = newProgress >= t.total;
          
          if (isCompleted) {
            updateCoins(t.reward, 'task', `Task completion: ${t.title}`);
            toast({
              title: "🎉 Task Completed!",
              description: `You earned ${t.reward} points!`,
            });
          }
          
          return {
            ...t,
            progress: newProgress,
            completed: isCompleted,
          };
        }
        return t;
      })
    );
  };

  // Function to be called when quiz is completed
  const onQuizCompleted = (score: number, points: number) => {
    setQuizCompleted(true);
    
    // Update quiz task
    setTasks(prevTasks => 
      prevTasks.map(task => {
        if (task.id === 2) {
          return {
            ...task,
            progress: 1,
            completed: true
          };
        }
        return task;
      })
    );

    // Check if weekly bonus should be awarded
    checkWeeklyBonus();
  };

  const checkWeeklyBonus = async () => {
    const weeklyTask = tasks.find(t => t.id === 5);
    if (weeklyTask && weeklyProgress >= 6 && !weeklyTask.completed) {
      // Award weekly bonus
      await updateCoins(200, 'task', 'Weekly bonus - completed all daily tasks');
      toast({
        title: "🎉 Weekly Bonus!",
        description: "You earned 200 points for completing all daily tasks this week!",
      });
      
      setTasks(prevTasks => 
        prevTasks.map(task => {
          if (task.id === 5) {
            return {
              ...task,
              progress: 7,
              completed: true
            };
          }
          return task;
        })
      );
    }
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

  const getTaskStatusText = (task: any) => {
    if (task.completed) return 'Completed';
    if (task.id === 2 && !quizCompleted) return 'Start Quiz';
    if (task.id === 4) return 'Auto-tracked';
    if (task.id === 5) return 'Auto-tracked';
    return task.progress > 0 ? 'Continue' : 'Start Task';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-25 to-pink-50 pb-32">
      <div className="space-y-6 p-4">
        {/* Enhanced Header Card with Better Design */}
        <Card className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 border-0 text-white shadow-2xl overflow-hidden relative">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-24 translate-x-24"></div>
          <div className="absolute bottom-0 left-0 w-36 h-36 bg-white/5 rounded-full translate-y-18 -translate-x-18"></div>
          <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-yellow-300/10 rounded-full animate-pulse"></div>
          
          <CardHeader className="relative z-10 pb-6">
            <CardTitle className="flex items-center gap-4 text-3xl font-bold mb-2">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm shadow-lg">
                <Trophy className="w-10 h-10 text-yellow-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  Daily Tasks & Bonuses
                  <Star className="w-7 h-7 text-yellow-300 animate-pulse" />
                </div>
                <p className="text-white/90 text-lg font-medium mt-1">Complete tasks to earn up to 370 points daily</p>
              </div>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="relative z-10 pb-8">
            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-5 text-center border border-white/20 shadow-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CheckCircle className="w-6 h-6 text-green-300" />
                  <div className="text-3xl font-bold">{tasks.filter(t => t.completed).length}</div>
                </div>
                <div className="text-white/80 text-sm font-medium">Completed</div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-5 text-center border border-white/20 shadow-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Target className="w-6 h-6 text-orange-300" />
                  <div className="text-3xl font-bold">{tasks.filter(t => !t.completed).length}</div>
                </div>
                <div className="text-white/80 text-sm font-medium">Pending</div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-5 text-center border border-white/20 shadow-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Award className="w-6 h-6 text-yellow-300" />
                  <div className="text-3xl font-bold text-yellow-300">{tasks.reduce((sum, t) => sum + (t.completed ? t.reward : 0), 0)}</div>
                </div>
                <div className="text-white/80 text-sm font-medium">Points Earned</div>
              </div>
            </div>

            {/* Progress Overview */}
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-5 border border-white/20 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-300" />
                  Daily Progress
                </h3>
                <span className="text-2xl font-bold text-yellow-300">
                  {Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)}%
                </span>
              </div>
              <Progress 
                value={(tasks.filter(t => t.completed).length / tasks.length) * 100} 
                className="h-3 bg-white/20 rounded-full"
              />
              <div className="flex justify-between text-sm text-white/80 mt-2">
                <span>Daily Tasks Completion</span>
                <span>{tasks.filter(t => t.completed).length}/{tasks.length} completed</span>
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
                        ) : (task.id === 4 || task.id === 5) ? (
                          <Badge variant="outline" className="border-2 border-orange-300 text-orange-700 bg-orange-50 px-4 py-2 font-semibold">
                            <Calendar className="w-4 h-4 mr-2" />
                            Auto-tracked
                          </Badge>
                        ) : (
                          <Button
                            onClick={() => completeTask(task.id)}
                            disabled={task.completed || (task.id === 2 && quizCompleted)}
                            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold px-6 py-2 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                          >
                            {task.id === 2 ? <BookOpen className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                            {getTaskStatusText(task)}
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
    </div>
  );
};

export default TasksList;
