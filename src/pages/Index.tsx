
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import HomeContent from '@/components/HomeContent';
import ProfileHeader from '@/components/ProfileHeader';
import QuickActions from '@/components/QuickActions';
import BottomNavigation from '@/components/BottomNavigation';
import LoadingScreen from '@/components/LoadingScreen';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Shield, Settings } from 'lucide-react';
import AdminAccessButton from '@/components/AdminAccessButton';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('home');

  // Mock data for components that require props
  const mockProfile = {
    username: user?.email?.split('@')[0] || 'User',
    referral_code: 'REF123'
  };
  
  const mockWallet = {
    total_coins: 1250
  };

  // Navigation handlers
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    toast({
      title: `Navigated to ${tab}`,
      description: `${tab} feature coming soon!`,
    });
  };

  const handleNavigateToQuiz = () => {
    toast({
      title: "Quiz Feature",
      description: "Quiz section coming soon!",
    });
  };

  const handleNavigateToTasks = () => {
    toast({
      title: "Tasks Feature", 
      description: "Tasks section coming soon!",
    });
  };

  const handleNavigateToRewards = () => {
    toast({
      title: "Rewards Feature",
      description: "Rewards section coming soon!",
    });
  };

  const handleNavigateToDailyRewards = () => {
    toast({
      title: "Daily Rewards Feature",
      description: "Daily rewards section coming soon!",
    });
  };

  const handleFeatureNavigation = (featureId: string) => {
    toast({
      title: `${featureId} Feature`,
      description: `${featureId} feature coming soon!`,
    });
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to App</h1>
          <p className="text-gray-600 mb-8">Please login to continue</p>
          <Link to="/auth">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
              Login / Sign Up
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header with Admin Access */}
      <div className="flex justify-between items-center p-4 bg-white/80 backdrop-blur-sm border-b">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Link to="/admin-test">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Admin Test
            </Button>
          </Link>
          <AdminAccessButton />
        </div>
      </div>

      {/* Main Content */}
      <div className="pb-20">
        <ProfileHeader 
          profile={mockProfile}
          wallet={mockWallet}
          userLevel={5}
          loginStreak={7}
        />
        <QuickActions 
          onNavigateToQuiz={handleNavigateToQuiz}
          onNavigateToTasks={handleNavigateToTasks}
          onNavigateToRewards={handleNavigateToRewards}
          onNavigateToDailyRewards={handleNavigateToDailyRewards}
          onFeatureNavigation={handleFeatureNavigation}
        />
        <HomeContent 
          onNavigateToQuiz={handleNavigateToQuiz}
          onNavigateToTasks={handleNavigateToTasks}
          onNavigateToRewards={handleNavigateToRewards}
          onNavigateToDailyRewards={handleNavigateToDailyRewards}
          onFeatureNavigation={handleFeatureNavigation}
        />
      </div>
      
      <BottomNavigation 
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
    </div>
  );
};

export default Index;
