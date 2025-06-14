import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Coins, Play, Trophy, Gift, Users, BookOpen, LogOut, TrendingUp, Calendar, Star, Sparkles } from 'lucide-react';
import MiningDashboard from '@/components/MiningDashboard';
import QuickActions from '@/components/QuickActions';
import CoinWallet from '@/components/CoinWallet';
import TasksList from '@/components/TasksList';
import QuizSection from '@/components/QuizSection';
import RewardsSection from '@/components/RewardsSection';
import ProfileHeader from '@/components/ProfileHeader';
import NotificationCenter from '@/components/NotificationCenter';
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
    { id: 'home', label: 'Home', icon: Play, gradient: 'from-blue-500 to-purple-500' },
    { id: 'tasks', label: 'Tasks', icon: Trophy, gradient: 'from-orange-500 to-red-500' },
    { id: 'quiz', label: 'Quiz', icon: BookOpen, gradient: 'from-green-500 to-emerald-500' },
    { id: 'rewards', label: 'Rewards', icon: Gift, gradient: 'from-pink-500 to-rose-500' },
    { id: 'profile', label: 'Profile', icon: Users, gradient: 'from-indigo-500 to-purple-500' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-6"></div>
            <Sparkles className="w-6 h-6 text-purple-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="text-gray-700 text-lg font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  };

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
            <ProfileHeader 
              profile={profile}
              wallet={wallet}
              userLevel={userLevel}
              loginStreak={loginStreak}
            />

            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                    <Users className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-green-700 mb-1">12</div>
                  <div className="text-green-600 font-medium">Referrals</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-cyan-100 border-blue-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                    <Trophy className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-blue-700 mb-1">8</div>
                  <div className="text-blue-600 font-medium">Tasks Done</div>
                </CardContent>
              </Card>
            </div>

            {/* Keep existing referral program card and sign out card */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-lg">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Users className="w-6 h-6" />
                  Referral Program Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="bg-white p-5 rounded-xl border border-green-200 shadow-sm">
                  <h3 className="font-bold text-green-800 mb-4 text-lg">🎯 How It Works:</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-green-100 text-green-700 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                      <div>
                        <div className="font-semibold text-gray-800">Share your referral code</div>
                        <div className="text-sm text-gray-600">Send your unique code to friends</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-green-100 text-green-700 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                      <div>
                        <div className="font-semibold text-gray-800">Friend joins GiftLeap</div>
                        <div className="text-sm text-gray-600">They sign up using your referral code</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-green-100 text-green-700 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                      <div>
                        <div className="font-semibold text-gray-800">Both get rewarded!</div>
                        <div className="text-sm text-gray-600">When friend completes first mining (100 points)</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-4 rounded-xl text-white text-center shadow-lg">
                    <Coins className="w-8 h-8 mx-auto mb-2" />
                    <div className="text-3xl font-bold">100</div>
                    <div className="text-sm opacity-90">Points for You</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-4 rounded-xl text-white text-center shadow-lg">
                    <Gift className="w-8 h-8 mx-auto mb-2" />
                    <div className="text-3xl font-bold">500</div>
                    <div className="text-sm opacity-90">Welcome Bonus</div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-200">
                  <h4 className="font-bold text-yellow-800 mb-2 flex items-center gap-2">
                    🎯 Pro Tips:
                  </h4>
                  <ul className="text-sm text-yellow-700 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-500">•</span>
                      <span>Unlimited referrals - no daily limits!</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-500">•</span>
                      <span>Bonus only applies when friend actively mines</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-500">•</span>
                      <span>Both accounts must be genuine (anti-fraud protection)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-500">•</span>
                      <span>Track your referrals in the rewards section</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-xl border border-purple-200 text-center">
                  <div className="text-lg font-bold text-purple-800 mb-1">💡 Quick Math:</div>
                  <p className="text-sm text-purple-700">
                    <strong>15 successful referrals = 1,500 points = ₹50 Gift Card! 🎁</strong>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Sign Out Card */}
            <Card className="border-gray-200">
              <CardContent className="p-4">
                <Button 
                  variant="outline" 
                  className="w-full text-gray-700 border-gray-300 hover:bg-gray-50"
                  onClick={signOut}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-25 to-pink-50">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white sticky top-0 z-20 shadow-2xl">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
          
          <div className="relative z-10 p-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Star className="w-8 h-8 text-yellow-300" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">GiftLeap</h1>
                  <p className="text-purple-100 text-sm font-medium">Earn. Leap. Redeem.</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <NotificationCenter />
                <div className="flex items-center gap-3 bg-white/20 rounded-2xl px-4 py-2 backdrop-blur-sm border border-white/30">
                  <Coins className="w-6 h-6 text-yellow-300" />
                  <span className="font-bold text-xl">{wallet?.total_coins || 0}</span>
                  <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 pb-24">
        {renderContent()}
      </div>

      {/* Enhanced Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200/50 px-2 py-3 shadow-2xl">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {tabConfig.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex flex-col items-center py-2 px-3 rounded-2xl transition-all duration-300 transform ${
                  isActive
                    ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg scale-110 -translate-y-1`
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-white/20 rounded-2xl animate-pulse"></div>
                )}
                <Icon className={`w-6 h-6 relative z-10 ${isActive ? 'animate-bounce' : ''}`} />
                <span className={`text-xs mt-1 font-medium relative z-10 ${isActive ? 'font-bold' : ''}`}>
                  {tab.label}
                </span>
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Index;
