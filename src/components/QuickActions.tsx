
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Trophy, BookOpen, Gift } from 'lucide-react';

const QuickActions = () => {
  const actions = [
    {
      icon: Play,
      title: 'Watch Ad',
      reward: '+5 points',
      color: 'bg-green-500',
      available: 8,
    },
    {
      icon: Trophy,
      title: 'Daily Tasks',
      reward: '3 pending',
      color: 'bg-orange-500',
      available: null,
    },
    {
      icon: BookOpen,
      title: 'Daily Quiz',
      reward: 'Ready',
      color: 'bg-blue-500',
      available: null,
    },
    {
      icon: Gift,
      title: 'Offers',
      reward: 'New offers',
      color: 'bg-purple-500',
      available: null,
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
