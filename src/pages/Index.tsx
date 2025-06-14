
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Coins, Play, Trophy, Gift, Users, BookOpen, LogOut, Copy, Check, Crown, Star, TrendingUp, Calendar } from 'lucide-react';
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
  const [copied, setCopied] = useState(false);

  const tabConfig = [
    { id: 'home', label: 'Home', icon: Play },
    { id: 'tasks', label: 'Tasks', icon: Trophy },
    { id: 'quiz', label: 'Quiz', icon: BookOpen },
    { id: 'rewards', label: 'Rewards', icon: Gift },
    { id: 'profile', label: 'Profile', icon: Users },
  ];

  const handleCopyReferralCode = () => {
    if (profile?.referral_code) {
      navigator.clipboard.writeText(profile.referral_code);
      setCopied(true);
      toast({
        title: "Referral Code Copied! 📋",
        description: "Share with friends to earn 100 coins per successful referral!",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
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
            {/* Enhanced Profile Header Card */}
            <Card className="bg-gradient-to-br from-purple-600 via-purple-500 to-blue-600 border-0 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
              
              <CardHeader className="text-center relative z-10 pb-4">
                <div className="relative mx-auto mb-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    {profile?.username?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Crown className="w-4 h-4 text-yellow-800" />
                  </div>
                </div>
                
                <CardTitle className="text-2xl font-bold text-white mb-2">
                  {profile?.username || 'GiftLeap User'}
                </CardTitle>
                
                <div className="flex justify-center gap-3 mb-4">
                  <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                    <Star className="w-3 h-3 mr-1" />
                    Level {userLevel}
                  </Badge>
                  <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                    <Calendar className="w-3 h-3 mr-1" />
                    {loginStreak} Day Streak
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="relative z-10 pt-0">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/15 backdrop-blur-sm rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Coins className="w-5 h-5 text-yellow-300 mr-2" />
                      <span className="text-sm text-white/80">Total Coins</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{wallet?.total_coins || 0}</div>
                  </div>
                  
                  <div className="bg-white/15 backdrop-blur-sm rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <TrendingUp className="w-5 h-5 text-green-300 mr-2" />
                      <span className="text-sm text-white/80">Rank</span>
                    </div>
                    <div className="text-2xl font-bold text-white">#42</div>
                  </div>
                </div>

                <div className="bg-white/15 backdrop-blur-sm rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/80 text-sm">Referral Code</span>
                    <Badge variant="outline" className="font-mono text-white border-white/30 bg-white/10">
                      {profile?.referral_code || 'Loading...'}
                    </Badge>
                  </div>
                </div>

                <Button 
                  className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm"
                  onClick={handleCopyReferralCode}
                >
                  {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                  {copied ? 'Copied!' : 'Copy Referral Code'}
                </Button>
              </CardContent>
            </Card>

            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-green-700">12</div>
                  <div className="text-sm text-green-600">Referrals</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-cyan-100 border-blue-200">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-blue-700">8</div>
                  <div className="text-sm text-blue-600">Tasks Done</div>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Referral Program Card */}
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
                        <div className="text-sm text-gray-600">When friend completes first mining (100 coins)</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-4 rounded-xl text-white text-center shadow-lg">
                    <Coins className="w-8 h-8 mx-auto mb-2" />
                    <div className="text-3xl font-bold">100</div>
                    <div className="text-sm opacity-90">Coins for You</div>
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
                    <strong>15 successful referrals = 1,500 coins = ₹50 Gift Card! 🎁</strong>
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">GiftLeap</h1>
            <p className="text-purple-100 text-sm">Earn. Leap. Redeem.</p>
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
