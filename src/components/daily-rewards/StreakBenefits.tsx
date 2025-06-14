
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

const StreakBenefits: React.FC = () => {
  return (
    <Card className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-lg border-white/50 shadow-xl">
      <CardContent className="p-6">
        <h4 className="font-bold text-gray-800 mb-4 text-center text-lg flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          Streak Benefits
          <Sparkles className="w-5 h-5 text-purple-500" />
        </h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl border border-green-200">
            <span className="font-medium text-green-800">3+ Days Streak:</span>
            <Badge className="bg-green-500 text-white font-bold">1.5x Mining Speed</Badge>
          </div>
          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl border border-blue-200">
            <span className="font-medium text-blue-800">7+ Days Streak:</span>
            <Badge className="bg-blue-500 text-white font-bold">2x Mining Speed</Badge>
          </div>
          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl border border-purple-200">
            <span className="font-medium text-purple-800">Complete Week:</span>
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold">500 Bonus Coins</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StreakBenefits;
