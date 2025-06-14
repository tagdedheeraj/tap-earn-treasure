import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, Play, Trophy, Users, Calendar } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useUserData } from '@/hooks/useUserData';

interface TasksListProps {
  totalCoins: number;
  setTotalCoins: (coins: number) => void;
}

const TasksList: React.FC = () => {
  const { wallet, updateCoins } = useUserData();
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Watch 3 Video Ads',
      description: 'Watch rewarded video ads to earn coins',
      reward: 15,
      progress: 1,
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
      reward: 25,
      progress: 0,
      total: 1,
      type: 'daily',
      completed: false,
      icon: Trophy,
      color: 'bg-blue-500',
    },
    {
      id: 3,
      title: 'Invite a Friend',
      description: 'Share your referral code with friends',
      reward: 100,
      progress: 0,
      total: 1,
      type: 'weekly',
      completed: false,
      icon: Users,
      color: 'bg-purple-500',
    },
    {
      id: 4,
      title: '7-Day Login Streak',
      description: 'Login daily for 7 consecutive days',
      reward: 200,
      progress: 3,
      total: 7,
      type: 'streak',
      completed: false,
      icon: Calendar,
      color: 'bg-orange-500',
    },
  ]);

  const completeTask = async (taskId: number) => {
    setTasks(prevTasks => 
      prevTasks.map(task => {
        if (task.id === taskId && !task.completed) {
          const newProgress = Math.min(task.progress + 1, task.total);
          const isCompleted = newProgress >= task.total;
          
          if (isCompleted) {
            updateCoins(task.reward, 'task', `Task completion: ${task.title}`);
            toast({
              title: "Task Completed! 🎉",
              description: `You earned ${task.reward} coins!`,
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
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Tasks Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-blue-600" />
            Daily Tasks
          </CardTitle>
          <p className="text-sm text-gray-600">Complete tasks to earn bonus coins</p>
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
              <p className="text-sm text-gray-600">Coins Earned</p>
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
                          +{task.reward} coins
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
