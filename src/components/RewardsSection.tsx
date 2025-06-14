
import React, { useState } from 'react';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useRewards } from '@/hooks/useRewards';
import RewardsOverview from '@/components/rewards/RewardsOverview';
import CategoryFilter from '@/components/rewards/CategoryFilter';
import RewardCard from '@/components/rewards/RewardCard';
import RecentRedemptions from '@/components/rewards/RecentRedemptions';

const RewardsSection: React.FC = () => {
  const { requireAuth, AuthDialog } = useRequireAuth();
  const { rewards, redemptions, handleRedeem, totalCoins } = useRewards();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Gift Cards', 'Cash', 'Gaming', 'Electronics', 'Recharge'];

  const handleRedeemWithAuth = async (reward: typeof rewards[0]) => {
    const redeemAction = async () => {
      await handleRedeem(reward);
    };
    
    requireAuth(redeemAction);
  };

  const filteredRewards = selectedCategory === 'All' 
    ? rewards 
    : rewards.filter(reward => reward.category === selectedCategory);

  return (
    <div className="space-y-6">
      <RewardsOverview 
        totalCoins={totalCoins} 
        totalRedeemed={redemptions.length} 
      />

      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRewards.map((reward) => {
          const canAfford = totalCoins >= reward.cost;
          
          return (
            <RewardCard
              key={reward.id}
              reward={reward}
              canAfford={canAfford}
              onRedeem={handleRedeemWithAuth}
            />
          );
        })}
      </div>

      <RecentRedemptions redemptions={redemptions} />
      <AuthDialog />
    </div>
  );
};

export default RewardsSection;
