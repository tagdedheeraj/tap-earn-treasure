
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  username: string | null;
  referral_code: string;
  referred_by: string | null;
}

interface CoinWallet {
  total_coins: number;
}

export const useUserData = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [wallet, setWallet] = useState<CoinWallet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
    } else {
      setProfile(null);
      setWallet(null);
      setLoading(false);
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Fetch wallet
      const { data: walletData, error: walletError } = await supabase
        .from('coin_wallets')
        .select('total_coins')
        .eq('user_id', user.id)
        .single();

      if (walletError) throw walletError;
      setWallet(walletData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkMonthlyLimit = async (amount: number, source: string) => {
    if (!user || source === 'referral') return true; // Referral bonuses are unlimited

    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

      // Get current month earnings (excluding referral bonuses)
      const { data: transactions, error } = await supabase
        .from('coin_transactions')
        .select('amount')
        .eq('user_id', user.id)
        .eq('transaction_type', 'earned')
        .neq('source', 'referral')
        .gte('created_at', startOfMonth.toISOString())
        .lte('created_at', endOfMonth.toISOString());

      if (error) throw error;

      const totalEarned = transactions?.reduce((sum, t) => sum + t.amount, 0) || 0;
      const MONTHLY_LIMIT = 1000;

      return (totalEarned + amount) <= MONTHLY_LIMIT;
    } catch (error) {
      console.error('Error checking monthly limit:', error);
      return false;
    }
  };

  const updateCoins = async (amount: number, source: string, description: string) => {
    if (!user) return { success: false, message: 'User not authenticated' };

    // Check monthly limit for earning transactions (excluding referrals)
    if (amount > 0 && source !== 'referral') {
      const canEarn = await checkMonthlyLimit(amount, source);
      if (!canEarn) {
        toast({
          title: "Monthly Limit Reached",
          description: "You have reached your monthly earning limit of 1000 points. Referral bonuses are still unlimited!",
          variant: "destructive"
        });
        return { success: false, message: 'Monthly limit exceeded' };
      }
    }

    try {
      // Update wallet
      const { error: walletError } = await supabase
        .from('coin_wallets')
        .update({ 
          total_coins: (wallet?.total_coins || 0) + amount,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (walletError) throw walletError;

      // Add transaction
      const { error: transactionError } = await supabase
        .from('coin_transactions')
        .insert({
          user_id: user.id,
          amount: Math.abs(amount),
          transaction_type: amount > 0 ? 'earned' : 'spent',
          source,
          description
        });

      if (transactionError) throw transactionError;

      // Process referral bonus for new users who mine for the first time
      if (source === 'mining' && amount > 0) {
        // Check if this is user's first mining reward
        const { data: transactions } = await supabase
          .from('coin_transactions')
          .select('id')
          .eq('user_id', user.id)
          .eq('source', 'mining')
          .limit(2); // Check for 2 to see if this is the first

        if (transactions && transactions.length === 1) {
          // This is the first mining - check if user was referred and award bonus
          if (profile?.referred_by) {
            await awardReferralBonus(profile.referred_by);
          }
        }
      }

      // Refresh data
      await fetchUserData();
      return { success: true, message: 'Coins updated successfully' };
    } catch (error) {
      console.error('Error updating coins:', error);
      return { success: false, message: 'Failed to update coins' };
    }
  };

  const awardReferralBonus = async (referrerId: string) => {
    try {
      // Get current referrer wallet balance
      const { data: currentWallet, error: fetchError } = await supabase
        .from('coin_wallets')
        .select('total_coins')
        .eq('user_id', referrerId)
        .single();

      if (fetchError) {
        console.error('Error fetching referrer wallet:', fetchError);
        return;
      }

      // Update referrer's wallet with 100 bonus points (unlimited)
      const { error: walletUpdateError } = await supabase
        .from('coin_wallets')
        .update({
          total_coins: currentWallet.total_coins + 100,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', referrerId);

      if (walletUpdateError) {
        console.error('Error updating referrer wallet:', walletUpdateError);
        return;
      }

      // Record referrer transaction (marked as referral source - unlimited)
      const { error: transactionError } = await supabase
        .from('coin_transactions')
        .insert({
          user_id: referrerId,
          amount: 100,
          transaction_type: 'earned',
          source: 'referral',
          description: 'Referral bonus - friend completed first mining'
        });

      if (transactionError) {
        console.error('Error creating referral transaction:', transactionError);
      }

      console.log('Referral bonus awarded successfully');
    } catch (error) {
      console.error('Error awarding referral bonus:', error);
    }
  };

  return {
    profile,
    wallet,
    loading,
    refetchData: fetchUserData,
    updateCoins
  };
};
