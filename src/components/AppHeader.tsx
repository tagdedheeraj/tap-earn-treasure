
import React from 'react';
import { Star, Coins, Sparkles } from 'lucide-react';
import NotificationCenter from '@/components/NotificationCenter';

interface AppHeaderProps {
  totalCoins: number;
}

const AppHeader = ({ totalCoins }: AppHeaderProps) => {
  return (
    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white sticky top-0 z-20 shadow-2xl">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
        
        <div className="relative z-10 p-4 md:p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <Star className="w-6 h-6 md:w-8 md:h-8 text-yellow-300" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold">GiftLeap</h1>
                <p className="text-purple-100 text-xs md:text-sm font-medium">Earn. Leap. Redeem.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <NotificationCenter />
              <div className="flex items-center gap-2 md:gap-3 bg-white/20 rounded-xl md:rounded-2xl px-2 md:px-4 py-1 md:py-2 backdrop-blur-sm border border-white/30">
                <Coins className="w-4 h-4 md:w-6 md:h-6 text-yellow-300" />
                <span className="font-bold text-sm md:text-xl">{totalCoins}</span>
                <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-yellow-300 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppHeader;
