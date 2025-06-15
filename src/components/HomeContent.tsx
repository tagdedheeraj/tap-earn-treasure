import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Target, Users, Gift } from 'lucide-react';
import MiningDashboard from './MiningDashboard';
import QuickActions from './QuickActions';
import CoinWallet from './CoinWallet';
import MonthlyLimitDisplay from './MonthlyLimitDisplay';

interface HomeContentProps {
  onNavigateToQuiz: () => void;
  onNavigateToTasks: () => void;
  onNavigateToRewards: () => void;
  onNavigateToDailyRewards: () => void;
  onFeatureNavigation: (featureId: string) => void;
}

const HomeContent: React.FC<HomeContentProps> = ({
  onNavigateToQuiz,
  onNavigateToTasks,
  onNavigateToRewards,
  onNavigateToDailyRewards,
  onFeatureNavigation
}) => {
  return (
    <div className="space-y-6">
      {/* Monthly Limit Display */}
      <MonthlyLimitDisplay />

      {/* Main Mining Dashboard */}
      <MiningDashboard />

      {/* Quick Actions */}
      <QuickActions
        onNavigateToQuiz={onNavigateToQuiz}
        onNavigateToTasks={onNavigateToTasks}
        onNavigateToRewards={onNavigateToRewards}
        onNavigateToDailyRewards={onNavigateToDailyRewards}
        onFeatureNavigation={onFeatureNavigation}
      />

      {/* Coin Wallet */}
      <CoinWallet />

      {/* Achievements Section */}
      <Card className="bg-gradient-to-r from-purple-100 to-pink-100 border-purple-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Achievements
          </CardTitle>
          <p className="text-sm text-gray-500">Track your progress and unlock rewards</p>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Complete tasks and challenges to earn achievements and bonus rewards.</p>
          <Button size="sm" variant="secondary" onClick={() => onFeatureNavigation('achievements')}>
            View All
          </Button>
        </CardContent>
      </Card>

      {/* Leaderboard Preview */}
      <Card className="bg-gradient-to-r from-green-100 to-blue-100 border-green-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            Leaderboard
          </CardTitle>
          <p className="text-sm text-gray-500">See who's on top and compete for the crown</p>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Compete with other users and climb the ranks to earn exclusive rewards.</p>
          <Button size="sm" variant="secondary" onClick={() => onFeatureNavigation('leaderboard')}>
            View Leaderboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomeContent;
