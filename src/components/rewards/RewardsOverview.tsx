
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RewardsOverviewProps {
  totalCoins: number;
  totalRedeemed: number;
}

const RewardsOverview: React.FC<RewardsOverviewProps> = ({ totalCoins, totalRedeemed }) => {
  return (
    <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="w-6 h-6 text-purple-600" />
          Rewards Store
        </CardTitle>
        <p className="text-sm text-gray-600">Start from ₹50 rewards at 1500 points</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg border text-center">
            <p className="text-2xl font-bold text-purple-600">{totalCoins}</p>
            <p className="text-sm text-gray-600">Available Points</p>
          </div>
          <div className="bg-white p-4 rounded-lg border text-center">
            <p className="text-2xl font-bold text-green-600">{totalRedeemed}</p>
            <p className="text-sm text-gray-600">Total Redeemed</p>
          </div>
        </div>
        
        <Link to="/gadgets">
          <Button className="w-full mt-4 bg-gradient-to-r from-indigo-500 to-purple-600">
            <Smartphone className="w-4 h-4 mr-2" />
            Browse Premium Gadgets
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default RewardsOverview;
