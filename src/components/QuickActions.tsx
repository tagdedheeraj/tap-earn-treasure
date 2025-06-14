
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Trophy, BookOpen, Gift, Gamepad2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface QuickActionsProps {
  onNavigateToQuiz?: () => void;
  onNavigateToTasks?: () => void;
  onNavigateToRewards?: () => void;
  onNavigateToMiniGames?: () => void;
}

const QuickActions = ({ onNavigateToQuiz, onNavigateToTasks, onNavigateToRewards, onNavigateToMiniGames }: QuickActionsProps) => {
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

  const handleMiniGames = () => {
    if (onNavigateToMiniGames) {
      onNavigateToMiniGames();
    } else {
      toast({
        title: "🎮 Mini Games",
        description: "Play games to earn 50 points daily!",
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
      color: 'bg-blue-500',
      available: null,
      onClick: handleDailyQuiz,
    },
    {
      icon: Gamepad2,
      title: 'Mini Games',
      reward: '+50 points',
      color: 'bg-pink-500',
      available: null,
      onClick: handleMiniGames,
    },
    {
      icon: Gift,
      title: 'Offers',
      reward: 'New offers',
      color: 'bg-purple-500',
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
