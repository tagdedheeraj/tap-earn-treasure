
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Trophy, BookOpen, Gift, Sparkles, Calendar } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface QuickActionsProps {
  onNavigateToQuiz?: () => void;
  onNavigateToTasks?: () => void;
  onNavigateToRewards?: () => void;
  onNavigateToSpinWheel?: () => void;
  onNavigateToDailyRewards?: () => void;
}

const QuickActions = ({ onNavigateToQuiz, onNavigateToTasks, onNavigateToRewards, onNavigateToSpinWheel, onNavigateToDailyRewards }: QuickActionsProps) => {
  const handleWatchAd = () => {
    toast({
      title: "📺 Watch Ad",
      description: "Ad feature coming soon! Earn 5 points by watching video ads.",
    });
  };

  const handleDailyTasks = () => {
    if (onNavigateToTasks) {
      onNavigateToTasks();
    } else {
      toast({
        title: "📋 Daily Tasks",
        description: "Navigate to tasks section to complete pending tasks!",
      });
    }
  };

  const handleDailyQuiz = () => {
    if (onNavigateToQuiz) {
      onNavigateToQuiz();
    } else {
      toast({
        title: "🧠 Daily Quiz",
        description: "Navigate to quiz section to answer questions!",
      });
    }
  };

  const handleOffers = () => {
    if (onNavigateToRewards) {
      onNavigateToRewards();
    } else {
      toast({
        title: "🎁 Special Offers",
        description: "Check rewards section for new offers and deals!",
      });
    }
  };

  const handleSpinWheel = () => {
    if (onNavigateToSpinWheel) {
      onNavigateToSpinWheel();
    } else {
      toast({
        title: "🎰 Spin Wheel",
        description: "Try your luck with the daily spin wheel!",
      });
    }
  };

  const handleDailyRewards = () => {
    if (onNavigateToDailyRewards) {
      onNavigateToDailyRewards();
    } else {
      toast({
        title: "📅 Daily Rewards",
        description: "Claim your daily login rewards!",
      });
    }
  };

  const actions = [
    {
      icon: Play,
      title: 'Watch Ad',
      reward: '+5 points',
      color: 'bg-green-500',
      available: 8,
      onClick: handleWatchAd,
    },
    {
      icon: Calendar,
      title: 'Daily Rewards',
      reward: 'Login bonus',
      color: 'bg-blue-500',
      available: null,
      onClick: handleDailyRewards,
    },
    {
      icon: Sparkles,
      title: 'Spin Wheel',
      reward: 'Daily spin',
      color: 'bg-purple-500',
      available: null,
      onClick: handleSpinWheel,
    },
    {
      icon: Trophy,
      title: 'Daily Tasks',
      reward: '3 pending',
      color: 'bg-orange-500',
      available: null,
      onClick: handleDailyTasks,
    },
    {
      icon: BookOpen,
      title: 'Daily Quiz',
      reward: 'Ready',
      color: 'bg-indigo-500',
      available: null,
      onClick: handleDailyQuiz,
    },
    {
      icon: Gift,
      title: 'Offers',
      reward: 'New offers',
      color: 'bg-pink-500',
      available: null,
      onClick: handleOffers,
    },
  ];

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-4 text-gray-700">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 flex flex-col gap-2 hover:shadow-md transition-shadow"
                onClick={action.onClick}
              >
                <div className={`w-8 h-8 rounded-full ${action.color} text-white flex items-center justify-center`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="font-medium text-sm">{action.title}</span>
                <div className="flex items-center gap-1">
                  <Badge variant="secondary" className="text-xs">
                    {action.reward}
                  </Badge>
                  {action.available && (
                    <Badge variant="outline" className="text-xs">
                      {action.available} left
                    </Badge>
                  )}
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
