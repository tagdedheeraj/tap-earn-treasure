
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coins, TrendingUp, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

interface CoinWalletProps {
  totalCoins: number;
}

const CoinWallet: React.FC<CoinWalletProps> = ({ totalCoins }) => {
  const transactions = [
    { type: 'earned', amount: 100, source: 'Daily Mining', time: '2 hours ago' },
    { type: 'earned', amount: 15, source: 'Watch Ad', time: '4 hours ago' },
    { type: 'earned', amount: 25, source: 'Daily Quiz', time: '1 day ago' },
    { type: 'spent', amount: 500, source: 'Gift Card Redemption', time: '2 days ago' },
    { type: 'earned', amount: 50, source: 'Referral Bonus', time: '3 days ago' },
  ];

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
              <p className="text-2xl font-bold text-yellow-600">{totalCoins} coins</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>+125 today</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3 text-gray-700">Recent Transactions</h4>
          <div className="space-y-2">
            {transactions.map((transaction, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    transaction.type === 'earned' 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {transaction.type === 'earned' ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownLeft className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{transaction.source}</p>
                    <p className="text-xs text-gray-500">{transaction.time}</p>
                  </div>
                </div>
                <Badge 
                  variant={transaction.type === 'earned' ? 'default' : 'destructive'}
                  className="font-mono"
                >
                  {transaction.type === 'earned' ? '+' : '-'}{transaction.amount}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CoinWallet;
