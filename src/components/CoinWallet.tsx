
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coins, TrendingUp, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useUserData } from '@/hooks/useUserData';

interface Transaction {
  id: string;
  amount: number;
  transaction_type: 'earned' | 'spent';
  source: string;
  description: string | null;
  created_at: string;
}

const CoinWallet: React.FC = () => {
  const { user } = useAuth();
  const { wallet } = useUserData();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  const fetchTransactions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('coin_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  const getSourceDisplayName = (source: string) => {
    const sourceMap: { [key: string]: string } = {
      'mining': 'Daily Mining',
      'quiz': 'Daily Quiz',
      'referral': 'Referral Bonus',
      'ad': 'Watch Ad',
      'task': 'Task Completion',
      'redemption': 'Gift Card Redemption'
    };
    return sourceMap[source] || source;
  };

  const todaysEarnings = transactions
    .filter(t => {
      const today = new Date().toDateString();
      const transactionDate = new Date(t.created_at).toDateString();
      return today === transactionDate && t.transaction_type === 'earned';
    })
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="w-5 h-5 text-yellow-500" />
          Coin Wallet
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Total Balance</p>
              <p className="text-2xl font-bold text-yellow-600">
                {wallet?.total_coins || 0} coins
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>+{todaysEarnings} today</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3 text-gray-700">Recent Transactions</h4>
          {loading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-3 bg-gray-50 rounded-lg animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : transactions.length > 0 ? (
            <div className="space-y-2">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      transaction.transaction_type === 'earned' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {transaction.transaction_type === 'earned' ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownLeft className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {transaction.description || getSourceDisplayName(transaction.source)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatTime(transaction.created_at)}
                      </p>
                    </div>
                  </div>
                  <Badge 
                    variant={transaction.transaction_type === 'earned' ? 'default' : 'destructive'}
                    className="font-mono"
                  >
                    {transaction.transaction_type === 'earned' ? '+' : '-'}{transaction.amount}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No transactions yet. Start earning coins!</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CoinWallet;
