
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Medal, Crown, Star, TrendingUp, Users, Calendar } from 'lucide-react';
import { useUserData } from '@/hooks/useUserData';

interface LeaderboardUser {
  id: string;
  username: string;
  points: number;
  rank: number;
  level: number;
  avatar?: string;
  streak: number;
}

const Leaderboard = () => {
  const { wallet, profile } = useUserData();
  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly' | 'alltime'>('weekly');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [userRank, setUserRank] = useState<number>(0);

  // Mock leaderboard data - in real app, this would come from your backend
  const mockLeaderboardData = {
    weekly: [
      { id: '1', username: 'CoinMaster_99', points: 2450, rank: 1, level: 12, streak: 15 },
      { id: '2', username: 'PointHunter', points: 2200, rank: 2, level: 10, streak: 8 },
      { id: '3', username: 'GiftLeaper', points: 1950, rank: 3, level: 9, streak: 12 },
      { id: '4', username: 'TaskNinja', points: 1800, rank: 4, level: 8, streak: 6 },
      { id: '5', username: 'RewardSeeker', points: 1650, rank: 5, level: 7, streak: 10 },
      { id: '6', username: 'You', points: wallet?.total_coins || 0, rank: 6, level: 5, streak: 3 },
      { id: '7', username: 'QuizGenius', points: 1400, rank: 7, level: 6, streak: 4 },
      { id: '8', username: 'SpinWinner', points: 1200, rank: 8, level: 5, streak: 7 },
      { id: '9', username: 'DailyGrinder', points: 1000, rank: 9, level: 4, streak: 2 },
      { id: '10', username: 'AdWatcher', points: 850, rank: 10, level: 3, streak: 5 },
    ],
    monthly: [
      { id: '1', username: 'MonthlyKing', points: 8500, rank: 1, level: 18, streak: 25 },
      { id: '2', username: 'TopEarner', points: 7800, rank: 2, level: 16, streak: 20 },
      { id: '3', username: 'PointMaster', points: 7200, rank: 3, level: 15, streak: 18 },
      { id: '4', username: 'You', points: wallet?.total_coins || 0, rank: 4, level: 5, streak: 3 },
      { id: '5', username: 'ConsistentUser', points: 6000, rank: 5, level: 12, streak: 15 },
    ],
    alltime: [
      { id: '1', username: 'LegendaryUser', points: 25000, rank: 1, level: 35, streak: 45 },
      { id: '2', username: 'OGMember', points: 22000, rank: 2, level: 32, streak: 40 },
      { id: '3', username: 'ElitePlayer', points: 20000, rank: 3, level: 30, streak: 35 },
      { id: '4', username: 'VeteranEarner', points: 18000, rank: 4, level: 28, streak: 30 },
      { id: '5', username: 'You', points: wallet?.total_coins || 0, rank: 25, level: 5, streak: 3 },
    ]
  };

  useEffect(() => {
    const data = mockLeaderboardData[activeTab];
    setLeaderboardData(data);
    
    const userEntry = data.find(user => user.username === 'You');
    setUserRank(userEntry?.rank || 0);
  }, [activeTab, wallet?.total_coins]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-lg font-bold text-gray-600">{rank}</span>;
    }
  };

  const getRankColor = (rank: number, isUser: boolean = false) => {
    if (isUser) return 'bg-gradient-to-r from-blue-50 to-indigo-100 border-blue-300';
    
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-50 to-amber-100 border-yellow-300';
      case 2:
        return 'bg-gradient-to-r from-gray-50 to-slate-100 border-gray-300';
      case 3:
        return 'bg-gradient-to-r from-orange-50 to-amber-100 border-orange-300';
      default:
        return 'bg-white border-gray-200';
    }
  };

  const tabs = [
    { id: 'weekly' as const, label: 'Weekly', icon: Calendar },
    { id: 'monthly' as const, label: 'Monthly', icon: TrendingUp },
    { id: 'alltime' as const, label: 'All Time', icon: Trophy },
  ];

  return (
    <div className="space-y-6">
      {/* User Rank Card */}
      <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">#{userRank}</h3>
              <p className="text-purple-100">Your {activeTab} rank</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{wallet?.total_coins || 0}</div>
              <p className="text-purple-100">Total Points</p>
            </div>
            <Trophy className="w-12 h-12 text-yellow-300" />
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <Users className="w-6 h-6" />
            Leaderboard
          </CardTitle>
          
          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {leaderboardData.map((user) => {
            const isUser = user.username === 'You';
            
            return (
              <div
                key={user.id}
                className={`p-4 rounded-lg border-2 transition-all duration-300 ${getRankColor(user.rank, isUser)} ${
                  isUser ? 'transform scale-102 shadow-lg' : 'hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className="flex-shrink-0">
                    {getRankIcon(user.rank)}
                  </div>
                  
                  {/* User Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`font-bold ${isUser ? 'text-blue-800' : 'text-gray-800'}`}>
                        {user.username}
                        {isUser && <span className="text-blue-600"> (You)</span>}
                      </h4>
                      <Badge variant="outline" className="text-xs">
                        Level {user.level}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500" />
                        {user.points.toLocaleString()} pts
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-green-500" />
                        {user.streak} day streak
                      </span>
                    </div>
                  </div>
                  
                  {/* Points */}
                  <div className="text-right">
                    <div className={`text-lg font-bold ${isUser ? 'text-blue-700' : 'text-gray-700'}`}>
                      {user.points.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">points</div>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Leaderboard Rewards Info */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800 text-center">🏆 Weekly Rewards</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-2">
              <Crown className="w-8 h-8 text-yellow-500 mx-auto" />
              <div className="font-bold text-yellow-700">1st Place</div>
              <Badge className="bg-yellow-500 text-white">1000 pts</Badge>
            </div>
            <div className="space-y-2">
              <Medal className="w-8 h-8 text-gray-400 mx-auto" />
              <div className="font-bold text-gray-700">2nd Place</div>
              <Badge className="bg-gray-500 text-white">500 pts</Badge>
            </div>
            <div className="space-y-2">
              <Medal className="w-8 h-8 text-amber-600 mx-auto" />
              <div className="font-bold text-amber-700">3rd Place</div>
              <Badge className="bg-amber-600 text-white">250 pts</Badge>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-white/50 rounded-lg text-center">
            <p className="text-sm text-green-700">
              <strong>Top 10 players</strong> get special recognition and bonus rewards!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Leaderboard;
