
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
