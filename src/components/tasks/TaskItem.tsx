
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, Play, Calendar, BookOpen, Zap } from 'lucide-react';
import { Task } from '@/types/tasks';

interface TaskItemProps {
  task: Task;
  index: number;
  quizCompleted: boolean;
  onCompleteTask: (taskId: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, index, quizCompleted, onCompleteTask }) => {
  const Icon = task.icon;
  const progressPercentage = (task.progress / task.total) * 100;

  const getTaskTypeColor = (type: string) => {
    switch (type) {
      case 'daily': return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
      case 'weekly': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'streak': return 'bg-gradient-to-r from-orange-500 to-red-500 text-white';
      case 'referral': return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
      default: return 'bg-gradient-to-r from-gray-400 to-gray-600 text-white';
    }
  };

  const getTaskStatusText = () => {
    if (task.completed) return 'Completed';
    if (task.id === 2 && !quizCompleted) return 'Start Quiz';
    if (task.id === 4) return 'Auto-tracked';
    if (task.id === 5) return 'Auto-tracked';
    return task.progress > 0 ? 'Continue' : 'Start Task';
  };

  return (
    <Card 
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
                  onClick={() => onCompleteTask(task.id)}
                  disabled={task.completed || (task.id === 2 && quizCompleted)}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold px-6 py-2 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  {task.id === 2 ? <BookOpen className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                  {getTaskStatusText()}
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
};

export default TaskItem;
