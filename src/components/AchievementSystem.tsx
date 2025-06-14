
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Target, Users, Coins, Calendar, Award } from 'lucide-react';
import { useUserData } from '@/hooks/useUserData';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  target: number;
  current: number;
  reward: number;
  category: 'mining' | 'tasks' | 'social' | 'loyalty' | 'special';
  unlocked: boolean;
  color: string;
}

const AchievementSystem = () => {
  const { wallet } = useUserData();
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    // Initialize achievements with current progress
    const totalCoins = wallet?.total_coins || 0;
    const loginStreak = parseInt(localStorage.getItem('loginStreak') || '1');
    const tasksCompleted = parseInt(localStorage.getItem('totalTasksCompleted') || '0');
    const referrals = parseInt(localStorage.getItem('totalReferrals') || '0');

    const achievementsList: Achievement[] = [
      {
        id: 'first_coins',
        title: 'First Steps',
        description: 'Earn your first 100 coins',
        icon: Coins,
        target: 100,
        current: Math.min(totalCoins, 100),
        reward: 50,
        category: 'mining',
        unlocked: totalCoins >= 100,
        color: 'from-yellow-400 to-yellow-600'
      },
      {
        id: 'coin_collector',
        title: 'Coin Collector',
        description: 'Accumulate 1,000 total coins',
        icon: Coins,
        target: 1000,
        current: Math.min(totalCoins, 1000),
        reward: 200,
        category: 'mining',
        unlocked: totalCoins >= 1000,
        color: 'from-yellow-400 to-yellow-600'
      },
      {
        id: 'coin_master',
        title: 'Coin Master',
        description: 'Reach 5,000 total coins',
        icon: Trophy,
        target: 5000,
        current: Math.min(totalCoins, 5000),
        reward: 500,
        category: 'mining',
        unlocked: totalCoins >= 5000,
        color: 'from-purple-400 to-purple-600'
      },
      {
        id: 'loyal_user',
        title: 'Loyal User',
        description: 'Login for 7 consecutive days',
        icon: Calendar,
        target: 7,
        current: Math.min(loginStreak, 7),
        reward: 100,
        category: 'loyalty',
        unlocked: loginStreak >= 7,
        color: 'from-blue-400 to-blue-600'
      },
      {
        id: 'dedication',
        title: 'Dedication',
        description: 'Login for 30 consecutive days',
        icon: Star,
        target: 30,
        current: Math.min(loginStreak, 30),
        reward: 500,
        category: 'loyalty',
        unlocked: loginStreak >= 30,
        color: 'from-indigo-400 to-indigo-600'
      },
      {
        id: 'task_starter',
        title: 'Task Starter',
        description: 'Complete your first 5 tasks',
        icon: Target,
        target: 5,
        current: Math.min(tasksCompleted, 5),
        reward: 75,
        category: 'tasks',
        unlocked: tasksCompleted >= 5,
        color: 'from-green-400 to-green-600'
      },
      {
        id: 'task_master',
        title: 'Task Master',
        description: 'Complete 50 tasks',
        icon: Award,
        target: 50,
        current: Math.min(tasksCompleted, 50),
        reward: 300,
        category: 'tasks',
        unlocked: tasksCompleted >= 50,
        color: 'from-emerald-400 to-emerald-600'
      },
      {
        id: 'social_butterfly',
        title: 'Social Butterfly',
        description: 'Refer 3 friends to GiftLeap',
        icon: Users,
        target: 3,
        current: Math.min(referrals, 3),
        reward: 200,
        category: 'social',
        unlocked: referrals >= 3,
        color: 'from-pink-400 to-pink-600'
      },
      {
        id: 'influencer',
        title: 'Influencer',
        description: 'Refer 10 friends to GiftLeap',
        icon: Users,
        target: 10,
        current: Math.min(referrals, 10),
        reward: 750,
        category: 'social',
        unlocked: referrals >= 10,
        color: 'from-red-400 to-red-600'
      }
    ];

    setAchievements(achievementsList);
  }, [wallet]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'mining': return Coins;
      case 'tasks': return Target;
      case 'social': return Users;
      case 'loyalty': return Calendar;
      default: return Star;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'mining': return 'text-yellow-600';
      case 'tasks': return 'text-green-600';
      case 'social': return 'text-pink-600';
      case 'loyalty': return 'text-blue-600';
      default: return 'text-purple-600';
    }
  };

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">{unlockedAchievements.length}</h3>
              <p className="text-purple-100">Achievements Unlocked</p>
            </div>
            <Trophy className="w-12 h-12 text-yellow-300" />
          </div>
          <div className="mt-4">
            <Progress 
              value={(unlockedAchievements.length / achievements.length) * 100} 
              className="h-3 bg-purple-300"
            />
            <p className="text-sm text-purple-100 mt-2">
              {unlockedAchievements.length} of {achievements.length} completed
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Unlocked Achievements */}
      {unlockedAchievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Trophy className="w-6 h-6" />
              Unlocked Achievements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {unlockedAchievements.map((achievement) => {
              const Icon = achievement.icon;
              const CategoryIcon = getCategoryIcon(achievement.category);
              
              return (
                <div key={achievement.id} className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${achievement.color} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-gray-800">{achievement.title}</h4>
                        <Badge variant="default" className="bg-green-500 text-white">
                          <Award className="w-3 h-3 mr-1" />
                          Unlocked
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm">{achievement.description}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <Badge variant="outline" className={getCategoryColor(achievement.category)}>
                          <CategoryIcon className="w-3 h-3 mr-1" />
                          {achievement.category}
                        </Badge>
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          <Coins className="w-3 h-3 mr-1" />
                          +{achievement.reward} points
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Locked Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-700">
            <Target className="w-6 h-6" />
            In Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {lockedAchievements.map((achievement) => {
            const Icon = achievement.icon;
            const CategoryIcon = getCategoryIcon(achievement.category);
            const progress = (achievement.current / achievement.target) * 100;
            
            return (
              <div key={achievement.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
                    <Icon className="w-8 h-8 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-gray-600">{achievement.title}</h4>
                      <Badge variant="outline" className="text-gray-500">
                        {achievement.current}/{achievement.target}
                      </Badge>
                    </div>
                    <p className="text-gray-500 text-sm">{achievement.description}</p>
                    <div className="mt-3">
                      <Progress value={progress} className="h-2" />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>{Math.round(progress)}% complete</span>
                        <span>+{achievement.reward} points</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <Badge variant="outline" className={getCategoryColor(achievement.category)}>
                        <CategoryIcon className="w-3 h-3 mr-1" />
                        {achievement.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default AchievementSystem;
