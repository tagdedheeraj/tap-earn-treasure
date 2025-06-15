
import React from 'react';
import { Play, Calendar, Trophy, Gift, User, RotateCcw } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNavigation = ({ activeTab, onTabChange }: BottomNavigationProps) => {
  const mainTabConfig = [
    { id: 'home', label: 'Home', icon: Play, gradient: 'from-blue-500 to-purple-500' },
    { id: 'daily', label: 'Daily', icon: Calendar, gradient: 'from-blue-500 to-cyan-500' },
    { id: 'tasks', label: 'Tasks', icon: Trophy, gradient: 'from-orange-500 to-red-500' },
    { id: 'spin', label: 'Spin', icon: RotateCcw, gradient: 'from-green-500 to-emerald-500' },
    { id: 'rewards', label: 'Rewards', icon: Gift, gradient: 'from-pink-500 to-rose-500' },
    { id: 'profile', label: 'Profile', icon: User, gradient: 'from-gray-500 to-slate-500' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200/50 px-1 py-2 shadow-2xl">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {mainTabConfig.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center py-2 px-2 rounded-xl transition-all duration-300 transform min-w-[50px] ${
                isActive
                  ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg scale-110 -translate-y-1`
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              {isActive && (
                <div className="absolute inset-0 bg-white/20 rounded-xl animate-pulse"></div>
              )}
              <Icon className={`w-4 h-4 relative z-10 ${isActive ? 'animate-bounce' : ''}`} />
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
  );
};

export default BottomNavigation;
