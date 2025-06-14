
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Gift, Star, Lock, ShoppingCart, CreditCard } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface RewardsSectionProps {
  totalCoins: number;
  setTotalCoins: (coins: number) => void;
}

const RewardsSection: React.FC<RewardsSectionProps> = ({ totalCoins, setTotalCoins }) => {
  const [redemptions, setRedemptions] = useState([
    { id: 1, item: 'Amazon Gift Card', amount: '$5', status: 'pending', date: '2024-01-15' },
    { id: 2, item: 'Google Play Card', amount: '$10', status: 'approved', date: '2024-01-10' },
  ]);

  const rewards = [
    {
      id: 1,
      name: 'Amazon Gift Card',
      description: '$5 Amazon Gift Card',
      cost: 1000,
      image: '🎁',
      category: 'Gift Cards',
      popular: true,
    },
    {
      id: 2,
      name: 'Google Play Card',
      description: '$10 Google Play Store Credit',
      cost: 2000,
      image: '🎮',
      category: 'Gift Cards',
      popular: false,
    },
    {
      id: 3,
      name: 'PayPal Cash',
      description: '$5 PayPal Cash',
      cost: 1200,
      image: '💰',
      category: 'Cash',
      popular: true,
    },
    {
      id: 4,
      name: 'Netflix Subscription',
      description: '1 Month Netflix Premium',
      cost: 3000,
      image: '📺',
      category: 'Subscriptions',
      popular: false,
    },
    {
      id: 5,
      name: 'Steam Gift Card',
      description: '$20 Steam Wallet Code',
      cost: 4000,
      image: '🎯',
      category: 'Gaming',
      popular: false,
    },
    {
      id: 6,
      name: 'Spotify Premium',
      description: '3 Months Spotify Premium',
      cost: 2500,
      image: '🎵',
      category: 'Subscriptions',
      popular: false,
    },
  ];

  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = ['All', 'Gift Cards', 'Cash', 'Gaming', 'Subscriptions'];

  const handleRedeem = (reward: typeof rewards[0]) => {
    if (totalCoins < reward.cost) {
      toast({
        title: "Insufficient Coins",
        description: `You need ${reward.cost - totalCoins} more coins to redeem this reward.`,
        variant: "destructive",
      });
      return;
    }

    setTotalCoins(totalCoins - reward.cost);
    const newRedemption = {
      id: redemptions.length + 1,
      item: reward.name,
      amount: reward.description,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
    };
    setRedemptions([newRedemption, ...redemptions]);

    toast({
      title: "Redemption Successful! 🎉",
      description: `Your ${reward.name} request is being processed. Check your email for updates.`,
    });
  };

  const filteredRewards = selectedCategory === 'All' 
    ? rewards 
    : rewards.filter(reward => reward.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Rewards Overview */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-6 h-6 text-purple-600" />
            Rewards Store
          </CardTitle>
          <p className="text-sm text-gray-600">Redeem your coins for amazing rewards</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg border text-center">
              <p className="text-2xl font-bold text-purple-600">{totalCoins}</p>
              <p className="text-sm text-gray-600">Available Coins</p>
            </div>
            <div className="bg-white p-4 rounded-lg border text-center">
              <p className="text-2xl font-bold text-green-600">{redemptions.length}</p>
              <p className="text-sm text-gray-600">Total Redeemed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className="whitespace-nowrap"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRewards.map((reward) => {
          const canAfford = totalCoins >= reward.cost;
          
          return (
            <Card key={reward.id} className={`relative ${!canAfford ? 'opacity-60' : ''}`}>
              {reward.popular && (
                <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                  <Star className="w-3 h-3 mr-1" />
                  Popular
                </Badge>
              )}
              
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{reward.image}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{reward.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{reward.description}</p>
                    <Badge variant="secondary" className="mb-3">
                      {reward.category}
                    </Badge>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className="text-lg font-bold text-purple-600">{reward.cost}</span>
                        <span className="text-sm text-gray-500">coins</span>
                      </div>
                      
                      <Button
                        onClick={() => handleRedeem(reward)}
                        disabled={!canAfford}
                        size="sm"
                        className={canAfford ? "bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700" : ""}
                      >
                        {!canAfford && <Lock className="w-4 h-4 mr-1" />}
                        {canAfford ? 'Redeem' : 'Locked'}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Redemptions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Recent Redemptions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {redemptions.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No redemptions yet</p>
          ) : (
            <div className="space-y-3">
              {redemptions.map((redemption) => (
                <div key={redemption.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{redemption.item}</p>
                    <p className="text-sm text-gray-600">{redemption.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{redemption.amount}</p>
                    <Badge 
                      variant={redemption.status === 'approved' ? 'default' : 'secondary'}
                      className={redemption.status === 'approved' ? 'bg-green-500' : 'bg-yellow-500'}
                    >
                      {redemption.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RewardsSection;
