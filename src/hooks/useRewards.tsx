
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { useUserData } from '@/hooks/useUserData';

export interface Reward {
  id: number;
  name: string;
  description: string;
  cost: number;
  image: string;
  category: string;
  popular: boolean;
}

export interface Redemption {
  id: number;
  item: string;
  amount: string;
  status: string;
  date: string;
}

export const useRewards = () => {
  const { wallet, updateCoins } = useUserData();
  
  const [redemptions, setRedemptions] = useState<Redemption[]>([
    { id: 1, item: '₹50 Gift Card', amount: '₹50', status: 'pending', date: '2024-01-15' },
    { id: 2, item: '₹100 Gift Card', amount: '₹100', status: 'approved', date: '2024-01-10' },
  ]);

  const rewards: Reward[] = [
    {
      id: 1,
      name: '₹50 Gift Card',
      description: '₹50 Amazon/Flipkart Gift Card',
      cost: 1500,
      image: '🎁',
      category: 'Gift Cards',
      popular: true,
    },
    {
      id: 2,
      name: '₹100 Gift Card',
      description: '₹100 Amazon/Flipkart Gift Card',
      cost: 2800,
      image: '💳',
      category: 'Gift Cards',
      popular: true,
    },
    {
      id: 3,
      name: '₹200 USB Drive',
      description: '32GB High-Speed USB Drive',
      cost: 5000,
      image: '💾',
      category: 'Electronics',
      popular: false,
    },
    {
      id: 4,
      name: 'PayPal Cash ₹50',
      description: '₹50 PayPal Cash Transfer',
      cost: 1600,
      image: '💰',
      category: 'Cash',
      popular: false,
    },
    {
      id: 5,
      name: 'Steam Gift Card ₹100',
      description: '₹100 Steam Wallet Code',
      cost: 3000,
      image: '🎮',
      category: 'Gaming',
      popular: false,
    },
    {
      id: 6,
      name: 'Mobile Recharge ₹100',
      description: '₹100 Mobile Recharge',
      cost: 2700,
      image: '📱',
      category: 'Recharge',
      popular: true,
    },
  ];

  const handleRedeem = async (reward: Reward) => {
    const totalCoins = wallet?.total_coins || 0;
    
    if (totalCoins < reward.cost) {
      toast({
        title: "Insufficient Points",
        description: `You need ${reward.cost - totalCoins} more points to redeem this reward.`,
        variant: "destructive",
      });
      return;
    }

    try {
      await updateCoins(-reward.cost, 'redemption', `Redeemed ${reward.name}`);
      
      const newRedemption: Redemption = {
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
    } catch (error) {
      console.error('Error processing redemption:', error);
      toast({
        title: "Error",
        description: "Failed to process redemption. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    rewards,
    redemptions,
    handleRedeem,
    totalCoins: wallet?.total_coins || 0,
  };
};
