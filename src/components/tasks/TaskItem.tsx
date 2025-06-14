
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
      <CardContent className="p-4 md:p-6">
        <div className="flex items-start gap-3 md:gap-4">
          {/* Mobile-Optimized Icon */}
          <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gradient-to-r ${task.color} text-white flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            {task.completed ? (
              <CheckCircle className="w-6 h-6 md:w-8 md:h-8" />
            ) : (
              <Icon className="w-6 h-6 md:w-8 md:h-8" />
            )}
          </div>
          
          <div className="flex-1 space-y-2 md:space-y-3 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-base md:text-lg text-gray-800 leading-tight">{task.title}</h3>
                <p className="text-gray-600 text-sm md:text-base mt-1 leading-snug">{task.description}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <Badge className={`${getTaskTypeColor(task.type)} px-2 py-1 text-xs md:text-sm font-semibold shadow-md`}>
                  {task.type}
                </Badge>
                <div className="flex items-center gap-1 mt-1 md:mt-2 justify-end">
                  <Zap className="w-3 h-3 md:w-4 md:h-4 text-yellow-500" />
                  <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                    +{task.reward}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Mobile-Optimized Progress Section */}
            <div className="space-y-2 md:space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium text-sm md:text-base">Progress</span>
                <span className="font-bold text-base md:text-lg">{task.progress}/{task.total}</span>
              </div>
              <div className="relative">
                <Progress 
                  value={progressPercentage} 
                  className="h-2 md:h-3 bg-gray-200 rounded-full overflow-hidden"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse rounded-full"></div>
              </div>
            </div>
            
            {/* Mobile-Optimized Action Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-1 md:pt-2">
              {task.completed ? (
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-2 text-xs md:text-sm font-semibold shadow-lg w-fit">
                  <CheckCircle className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  Completed
                </Badge>
              ) : (task.id === 4 || task.id === 5) ? (
                <Badge variant="outline" className="border-2 border-orange-300 text-orange-700 bg-orange-50 px-3 py-2 font-semibold text-xs md:text-sm w-fit">
                  <Calendar className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  Auto-tracked
                </Badge>
              ) : (
                <Button
                  onClick={() => onCompleteTask(task.id)}
                  disabled={task.completed || (task.id === 2 && quizCompleted)}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold px-4 py-2 md:px-6 md:py-2 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 text-sm md:text-base w-full sm:w-auto"
                >
                  {task.id === 2 ? <BookOpen className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" /> : <Play className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />}
                  {getTaskStatusText()}
                </Button>
              )}
              
              {task.type === 'daily' && (
                <div className="flex items-center gap-2 bg-gray-100 px-2 py-1 md:px-3 md:py-1 rounded-full w-fit">
                  <Clock className="w-3 h-3 md:w-4 md:h-4 text-gray-500" />
                  <span className="text-xs md:text-sm text-gray-600 font-medium">Resets in 18h</span>
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
