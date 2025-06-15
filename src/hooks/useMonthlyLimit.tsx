
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useMonthlyLimit = () => {
  const { user } = useAuth();
  const [monthlyEarned, setMonthlyEarned] = useState(0);
  const [canEarn, setCanEarn] = useState(true);
  const [loading, setLoading] = useState(true);

  const MONTHLY_LIMIT = 1000; // Normal users limit

  useEffect(() => {
    if (user) {
      checkMonthlyEarnings();
    }
  }, [user]);

  const checkMonthlyEarnings = async () => {
    if (!user) return;

    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

      // Get transactions for current month (excluding referral bonuses)
      const { data: transactions, error } = await supabase
        .from('coin_transactions')
        .select('amount')
        .eq('user_id', user.id)
        .eq('transaction_type', 'earned')
        .neq('source', 'referral') // Exclude referral bonuses from limit
        .gte('created_at', startOfMonth.toISOString())
        .lte('created_at', endOfMonth.toISOString());

      if (error) throw error;

      const totalEarned = transactions?.reduce((sum, t) => sum + t.amount, 0) || 0;
      setMonthlyEarned(totalEarned);
      setCanEarn(totalEarned < MONTHLY_LIMIT);
    } catch (error) {
      console.error('Error checking monthly earnings:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkCanEarn = (amount: number, source: string) => {
    // Referral bonuses are not limited
    if (source === 'referral') return true;
    
    // Check if adding this amount would exceed limit
    return (monthlyEarned + amount) <= MONTHLY_LIMIT;
  };

  const getRemainingPoints = () => {
    return Math.max(0, MONTHLY_LIMIT - monthlyEarned);
  };

  return {
    monthlyEarned,
    canEarn,
    loading,
    monthlyLimit: MONTHLY_LIMIT,
    checkCanEarn,
    getRemainingPoints,
    refreshLimit: checkMonthlyEarnings
  };
};
