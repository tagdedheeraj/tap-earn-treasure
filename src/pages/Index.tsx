
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Coins, Play, Trophy, Gift, Users, BookOpen, Star } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import MiningDashboard from '@/components/MiningDashboard';
import QuickActions from '@/components/QuickActions';
import CoinWallet from '@/components/CoinWallet';
import TasksList from '@/components/TasksList';
import QuizSection from '@/components/QuizSection';
import RewardsSection from '@/components/RewardsSection';

const Index = () => {
  const [totalCoins, setTotalCoins] = useState(1250);
  const [activeTab, setActiveTab] = useState('home');
  const [userLevel, setUserLevel] = useState(5);
  const [loginStreak, setLoginStreak] = useState(3);

  const tabConfig = [
    { id: 'home', label: 'Home', icon: Play },
    { id: 'tasks', label: 'Tasks', icon: Trophy },
    { id: 'quiz', label: 'Quiz', icon: BookOpen },
    { id: 'rewards', label: 'Rewards', icon: Gift },
    { id: 'profile', label: 'Profile', icon: Users },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6">
            <MiningDashboard totalCoins={totalCoins} setTotalCoins={setTotalCoins} />
            <QuickActions />
            <CoinWallet totalCoins={totalCoins} />
          </div>
        );
      case 'tasks':
        return <TasksList totalCoins={totalCoins} setTotalCoins={setTotalCoins} />;
      case 'quiz':
        return <QuizSection totalCoins={totalCoins} setTotalCoins={setTotalCoins} />;
      case 'rewards':
        return <RewardsSection totalCoins={totalCoins} setTotalCoins={setTotalCoins} />;
      case 'profile':
        return (
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
              <CardHeader className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold">
                  U
                </div>
                <CardTitle className="text-2xl">User Profile</CardTitle>
                <div className="flex justify-center gap-4 mt-4">
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                    Level {userLevel}
                  </Badge>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    {loginStreak} Day Streak
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Coins Earned</span>
                    <span className="font-bold text-lg">{totalCoins + 5000}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Referral Code</span>
                    <Badge variant="outline" className="font-mono">REWARD123</Badge>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700">
                    <Users className="w-4 h-4 mr-2" />
                    Share Referral Code
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">CoinMiner Pro</h1>
            <p className="text-purple-100 text-sm">Earn coins daily!</p>
          </div>
          <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1">
            <Coins className="w-5 h-5 text-yellow-300" />
            <span className="font-bold text-lg">{totalCoins}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 pb-20">
        {renderContent()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around">
          {tabConfig.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                  isActive
                    ? 'text-purple-600 bg-purple-50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs mt-1">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Index;
