
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Trophy, Coins, Gift, LogOut } from 'lucide-react';
import ProfileHeader from '@/components/ProfileHeader';

interface ProfileContentProps {
  profile: any;
  wallet: any;
  userLevel: number;
  loginStreak: number;
  onSignOut: () => void;
}

const ProfileContent = ({ profile, wallet, userLevel, loginStreak, onSignOut }: ProfileContentProps) => {
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

      {/* Referral Program Card */}
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
            onClick={onSignOut}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileContent;
