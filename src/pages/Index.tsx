
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Coins, Play, Trophy, Gift, Users, BookOpen, LogOut, Copy, Check } from 'lucide-react';
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
                    onClick={handleCopyReferralCode}
                  >
                    {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    {copied ? 'Copied!' : 'Copy Referral Code'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Referral Program Card */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-xl text-green-700 flex items-center gap-2">
                  <Users className="w-6 h-6" />
                  Referral Program Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-800 mb-2">How It Works:</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="bg-green-100 text-green-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
                      <span>Share your referral code with friends</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="bg-green-100 text-green-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
                      <span>Friend joins GiftLeap using your code</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="bg-green-100 text-green-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
                      <span>When friend completes their first mining (100 coins), you both get rewarded!</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded-lg border border-green-200 text-center">
                    <div className="text-2xl font-bold text-green-600">100</div>
                    <div className="text-sm text-gray-600">Coins for You</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-green-200 text-center">
                    <div className="text-2xl font-bold text-blue-600">500</div>
                    <div className="text-sm text-gray-600">Welcome Bonus for Friend</div>
                  </div>
                </div>

                <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800 mb-1">🎯 Pro Tips:</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Unlimited referrals - no daily limits!</li>
                    <li>• Bonus only applies when friend actively mines</li>
                    <li>• Both accounts must be genuine (anti-fraud protection)</li>
                    <li>• Track your referrals in the rewards section</li>
                  </ul>
                </div>

                <div className="bg-purple-50 p-3 rounded-lg border border-purple-200 text-center">
                  <p className="text-sm text-purple-700">
                    <strong>Quick Math:</strong> 15 successful referrals = 1,500 coins = ₹50 Gift Card! 🎁
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Button 
                  variant="outline" 
                  className="w-full"
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
