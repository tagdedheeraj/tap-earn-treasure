
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

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

  const updateCoins = async (amount: number, source: string, description: string) => {
    if (!user) return;

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
      if (source === 'mining' && amount > 0 && profile?.referred_by) {
        const referrerCode = await supabase
          .from('profiles')
          .select('referral_code')
          .eq('id', profile.referred_by)
          .single();

        if (!referrerCode.error && referrerCode.data) {
          // Check if this is user's first mining reward
          const { data: transactions } = await supabase
            .from('coin_transactions')
            .select('id')
            .eq('user_id', user.id)
            .eq('source', 'mining')
            .limit(1);

          if (transactions && transactions.length === 1) {
            // This is the first mining - give referrer bonus
            // First get the current coins
            const { data: referrerWallet } = await supabase
              .from('coin_wallets')
              .select('total_coins')
              .eq('user_id', profile.referred_by)
              .single();

            if (referrerWallet) {
              await supabase
                .from('coin_wallets')
                .update({ 
                  total_coins: referrerWallet.total_coins + 100,
                  updated_at: new Date().toISOString()
                })
                .eq('user_id', profile.referred_by);

              await supabase
                .from('coin_transactions')
                .insert({
                  user_id: profile.referred_by,
                  amount: 100,
                  transaction_type: 'earned',
                  source: 'referral',
                  description: 'Referral bonus - friend completed first mining'
                });
            }
          }
        }
      }

      // Refresh data
      await fetchUserData();
    } catch (error) {
      console.error('Error updating coins:', error);
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
