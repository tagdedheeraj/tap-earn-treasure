
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
              <div className="text-3xl font-bold">{completedTasks}</div>
            </div>
            <div className="text-white/80 text-sm font-medium">Completed</div>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-5 text-center border border-white/20 shadow-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Target className="w-6 h-6 text-orange-300" />
              <div className="text-3xl font-bold">{pendingTasks}</div>
            </div>
            <div className="text-white/80 text-sm font-medium">Pending</div>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-5 text-center border border-white/20 shadow-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Award className="w-6 h-6 text-yellow-300" />
              <div className="text-3xl font-bold text-yellow-300">{pointsEarned}</div>
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
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <Progress 
            value={progressPercentage} 
            className="h-3 bg-white/20 rounded-full"
          />
          <div className="flex justify-between text-sm text-white/80 mt-2">
            <span>Daily Tasks Completion</span>
            <span>{completedTasks}/{tasks.length} completed</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TasksHeader;
