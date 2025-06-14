
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, BookOpen, TrendingUp, Award } from 'lucide-react';
import MiningDashboard from '@/components/MiningDashboard';
import QuickActions from '@/components/QuickActions';
import CoinWallet from '@/components/CoinWallet';
import { toast } from '@/hooks/use-toast';

interface HomeContentProps {
  onNavigateToQuiz: () => void;
  onNavigateToTasks: () => void;
  onNavigateToRewards: () => void;
  onNavigateToDailyRewards: () => void;
  onFeatureNavigation: (featureId: string) => void;
}

const HomeContent = ({ 
  onNavigateToQuiz, 
  onNavigateToTasks, 
  onNavigateToRewards, 
  onNavigateToDailyRewards,
  onFeatureNavigation 
}: HomeContentProps) => {
  const additionalFeatures = [
    { id: 'quiz', label: 'Quiz Challenge', icon: BookOpen, gradient: 'from-green-500 to-emerald-500', description: 'Test your knowledge' },
    { id: 'leaderboard', label: 'Leaderboard', icon: TrendingUp, gradient: 'from-yellow-500 to-orange-500', description: 'See your ranking' },
    { id: 'achievements', label: 'Achievements', icon: Award, gradient: 'from-indigo-500 to-purple-500', description: 'Unlock badges' },
  ];

  return (
    <div className="space-y-6">
      <MiningDashboard />
      <QuickActions 
        onNavigateToQuiz={onNavigateToQuiz}
        onNavigateToTasks={onNavigateToTasks}
        onNavigateToRewards={onNavigateToRewards}
        onNavigateToDailyRewards={onNavigateToDailyRewards}
      />
      <CoinWallet />
      
      {/* More Features Section */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="text-xl flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-300" />
            More Features
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-4">
            {additionalFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <Button
                  key={feature.id}
                  variant="outline"
                  className="h-auto p-4 flex items-center gap-4 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 border-2 hover:border-purple-300"
                  onClick={() => onFeatureNavigation(feature.id)}
                >
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${feature.gradient} text-white flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-lg text-gray-800">{feature.label}</div>
                    <div className="text-sm text-gray-600">{feature.description}</div>
                  </div>
                  <div className="text-purple-500">
                    <Star className="w-5 h-5" />
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomeContent;
