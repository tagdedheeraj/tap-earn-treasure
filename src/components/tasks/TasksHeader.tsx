
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, CheckCircle, Target, Award, TrendingUp } from 'lucide-react';
import { Task } from '@/types/tasks';

interface TasksHeaderProps {
  tasks: Task[];
}

const TasksHeader: React.FC<TasksHeaderProps> = ({ tasks }) => {
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = tasks.filter(t => !t.completed).length;
  const pointsEarned = tasks.reduce((sum, t) => sum + (t.completed ? t.reward : 0), 0);
  const progressPercentage = (completedTasks / tasks.length) * 100;

  return (
    <Card className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 border-0 text-white shadow-2xl overflow-hidden relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
      <div className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 bg-white/5 rounded-full -translate-y-16 md:-translate-y-24 translate-x-16 md:translate-x-24"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 md:w-36 md:h-36 bg-white/5 rounded-full translate-y-12 md:translate-y-18 -translate-x-12 md:-translate-x-18"></div>
      <div className="absolute top-1/2 right-1/4 w-16 h-16 md:w-20 md:h-20 bg-yellow-300/10 rounded-full animate-pulse"></div>
      
      <CardHeader className="relative z-10 pb-4 md:pb-6">
        <CardTitle className="flex items-center gap-3 md:gap-4 text-xl md:text-3xl font-bold mb-2">
          <div className="p-2 md:p-3 bg-white/20 rounded-xl md:rounded-2xl backdrop-blur-sm shadow-lg">
            <Trophy className="w-6 h-6 md:w-10 md:h-10 text-yellow-300" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-lg md:text-3xl">Daily Tasks & Bonuses</span>
              <Star className="w-5 h-5 md:w-7 md:h-7 text-yellow-300 animate-pulse" />
            </div>
            <p className="text-white/90 text-sm md:text-lg font-medium mt-1">Complete tasks to earn up to 370 points daily</p>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="relative z-10 pb-6 md:pb-8">
        {/* Mobile-Optimized Stats Grid */}
        <div className="grid grid-cols-3 gap-2 md:gap-4 mb-4 md:mb-6">
          <div className="bg-white/15 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-5 text-center border border-white/20 shadow-lg">
            <div className="flex items-center justify-center gap-1 md:gap-2 mb-1 md:mb-2">
              <CheckCircle className="w-4 h-4 md:w-6 md:h-6 text-green-300" />
              <div className="text-xl md:text-3xl font-bold">{completedTasks}</div>
            </div>
            <div className="text-white/80 text-xs md:text-sm font-medium">Completed</div>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-5 text-center border border-white/20 shadow-lg">
            <div className="flex items-center justify-center gap-1 md:gap-2 mb-1 md:mb-2">
              <Target className="w-4 h-4 md:w-6 md:h-6 text-orange-300" />
              <div className="text-xl md:text-3xl font-bold">{pendingTasks}</div>
            </div>
            <div className="text-white/80 text-xs md:text-sm font-medium">Pending</div>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-5 text-center border border-white/20 shadow-lg">
            <div className="flex items-center justify-center gap-1 md:gap-2 mb-1 md:mb-2">
              <Award className="w-4 h-4 md:w-6 md:h-6 text-yellow-300" />
              <div className="text-xl md:text-3xl font-bold text-yellow-300">{pointsEarned}</div>
            </div>
            <div className="text-white/80 text-xs md:text-sm font-medium">Points Earned</div>
          </div>
        </div>

        {/* Mobile-Optimized Progress Overview */}
        <div className="bg-white/15 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-5 border border-white/20 shadow-lg">
          <div className="flex items-center justify-between mb-2 md:mb-3">
            <h3 className="text-base md:text-lg font-bold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-green-300" />
              Daily Progress
            </h3>
            <span className="text-xl md:text-2xl font-bold text-yellow-300">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <Progress 
            value={progressPercentage} 
            className="h-2 md:h-3 bg-white/20 rounded-full"
          />
          <div className="flex justify-between text-xs md:text-sm text-white/80 mt-2">
            <span>Daily Tasks Completion</span>
            <span>{completedTasks}/{tasks.length} completed</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TasksHeader;
