import React, { useState } from 'react';
import DailyRewards from '@/components/DailyRewards';
import TasksList from '@/components/TasksList';
import QuizSection from '@/components/QuizSection';
import RewardsSection from '@/components/RewardsSection';
import AchievementSystem from '@/components/AchievementSystem';
import Leaderboard from '@/components/Leaderboard';
import LoadingScreen from '@/components/LoadingScreen';
import AppHeader from '@/components/AppHeader';
import BottomNavigation from '@/components/BottomNavigation';
import HomeContent from '@/components/HomeContent';
import ProfileContent from '@/components/ProfileContent';
import SpinWheel from '@/components/SpinWheel';
import { useAuth } from '@/hooks/useAuth';
import { useUserData } from '@/hooks/useUserData';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const { signOut } = useAuth();
  const { profile, wallet, loading } = useUserData();
  const [activeTab, setActiveTab] = useState('home');
  const [userLevel] = useState(5);
  const [loginStreak] = useState(3);

  const handleNavigateToQuiz = () => {
    setActiveTab('quiz');
    toast({
      title: "🧠 Quiz Time!",
      description: "Answer questions correctly to earn points!",
    });
  };

  const handleNavigateToTasks = () => {
    setActiveTab('tasks');
    toast({
      title: "📋 Daily Tasks",
      description: "Complete tasks to earn coins and rewards!",
    });
  };

  const handleNavigateToRewards = () => {
    setActiveTab('rewards');
    toast({
      title: "🎁 Rewards",
      description: "Check out available rewards and offers!",
    });
  };

  const handleNavigateToDailyRewards = () => {
    setActiveTab('daily');
    toast({
      title: "📅 Daily Rewards",
      description: "Claim your daily login bonus!",
    });
  };

  const handleFeatureNavigation = (featureId: string) => {
    setActiveTab(featureId);
    const featureLabels: { [key: string]: string } = {
      quiz: 'Quiz Challenge',
      leaderboard: 'Leaderboard',
      achievements: 'Achievements'
    };
    
    const featureLabel = featureLabels[featureId];
    if (featureLabel) {
      toast({
        title: `🎯 ${featureLabel}`,
        description: `Navigated to ${featureLabel}`,
      });
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeContent
            onNavigateToQuiz={handleNavigateToQuiz}
            onNavigateToTasks={handleNavigateToTasks}
            onNavigateToRewards={handleNavigateToRewards}
            onNavigateToDailyRewards={handleNavigateToDailyRewards}
            onFeatureNavigation={handleFeatureNavigation}
          />
        );
      case 'daily':
        return <DailyRewards />;
      case 'tasks':
        return <TasksList onNavigateToQuiz={handleNavigateToQuiz} />;
      case 'spin':
        return <SpinWheel />;
      case 'quiz':
        return <QuizSection />;
      case 'leaderboard':
        return <Leaderboard />;
      case 'achievements':
        return <AchievementSystem />;
      case 'rewards':
        return <RewardsSection />;
      case 'profile':
        return (
          <ProfileContent
            profile={profile}
            wallet={wallet}
            userLevel={userLevel}
            loginStreak={loginStreak}
            onSignOut={signOut}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-25 to-pink-50">
      <AppHeader totalCoins={wallet?.total_coins || 0} />

      {/* Main Content */}
      <div className="p-4 pb-24">
        {renderContent()}
      </div>

      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
