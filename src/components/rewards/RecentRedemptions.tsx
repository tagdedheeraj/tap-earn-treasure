
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import { Redemption } from '@/hooks/useRewards';

interface RecentRedemptionsProps {
  redemptions: Redemption[];
}

const RecentRedemptions: React.FC<RecentRedemptionsProps> = ({ redemptions }) => {
  return (
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
  );
};

export default RecentRedemptions;
