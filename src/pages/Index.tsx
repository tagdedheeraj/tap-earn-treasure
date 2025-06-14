
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Coins, Play, Trophy, Gift, Users, BookOpen, LogOut } from 'lucide-react';
import MiningDashboard from '@/components/MiningDashboard';
import QuickActions from '@/components/QuickActions';
import CoinWallet from '@/components/CoinWallet';
import TasksList from '@/components/TasksList';
import QuizSection from '@/components/QuizSection';
import RewardsSection from '@/components/RewardsSection';
import { useAuth } from '@/hooks/useAuth';
import { useUserData } from '@/hooks/useUserData';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const { signOut } = useAuth();
  const { profile, wallet, loading } = useUserData();
  const [activeTab, setActiveTab] = useState('home');
  const [userLevel] = useState(5);
  const [loginStreak] = useState(3);

  const tabConfig = [
    { id: 'home', label: 'Home', icon: Play },
    { id: 'tasks', label: 'Tasks', icon: Trophy },
    { id: 'quiz', label: 'Quiz', icon: BookOpen },
    { id: 'rewards', label: 'Rewards', icon: Gift },
    { id: 'profile', label: 'Profile', icon: Users },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6">
            <MiningDashboard />
            <QuickActions />
            <CoinWallet />
          </div>
        );
      case 'tasks':
        return <TasksList />;
      case 'quiz':
        return <QuizSection />;
      case 'rewards':
        return <RewardsSection />;
      case 'profile':
        return (
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
              <CardHeader className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold">
                  {profile?.username?.[0]?.toUpperCase() || 'U'}
                </div>
                <CardTitle className="text-2xl">
                  {profile?.username || 'User Profile'}
                </CardTitle>
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
                    <span className="text-gray-600">Total Coins</span>
                    <span className="font-bold text-lg">{wallet?.total_coins || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Referral Code</span>
                    <Badge variant="outline" className="font-mono">
                      {profile?.referral_code || 'Loading...'}
                    </Badge>
                  </div>
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
                    onClick={() => {
                      if (profile?.referral_code) {
                        navigator.clipboard.writeText(profile.referral_code);
                        // Could add toast here
                      }
                    }}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Share Referral Code (1000 coins per referral!)
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={signOut}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
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
            <span className="font-bold text-lg">{wallet?.total_coins || 0}</span>
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
