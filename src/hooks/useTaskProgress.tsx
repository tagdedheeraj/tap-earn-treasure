
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { useUserData } from '@/hooks/useUserData';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Task } from '@/types/tasks';
import { getInitialTasks } from '@/components/tasks/TasksData';

export const useTaskProgress = (onNavigateToQuiz?: () => void) => {
  const { updateCoins } = useUserData();
  const { user } = useAuth();
  const [loginStreakProgress, setLoginStreakProgress] = useState(0);
  const [weeklyProgress, setWeeklyProgress] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(getInitialTasks());

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
            // Use updateCoins which now checks monthly limits
            updateCoins(t.reward, 'task', `Task completion: ${t.title}`).then((result) => {
              if (result.success) {
                toast({
                  title: "🎉 Task Completed!",
                  description: `You earned ${t.reward} points!`,
                });
              }
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

  const onQuizCompleted = async (score: number, points: number) => {
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
      // Award weekly bonus (respecting monthly limits)
      const result = await updateCoins(200, 'task', 'Weekly bonus - completed all daily tasks');
      if (result.success) {
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
    }
  };

  return {
    tasks,
    quizCompleted,
    completeTask,
    onQuizCompleted
  };
};
