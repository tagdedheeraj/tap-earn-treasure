
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface SpinReward {
  id: number;
  type: 'coins' | 'points' | 'blank';
  amount: number;
  label: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
  actualAward: number;
}

interface LastWinDisplayProps {
  lastWin: SpinReward;
}

const LastWinDisplay = ({ lastWin }: LastWinDisplayProps) => {
  return (
    <Card className={`${lastWin.actualAward > 0 ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' : 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200'}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-center gap-3">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${lastWin.actualAward > 0 ? 'from-green-400 to-emerald-500' : 'from-gray-400 to-slate-500'} flex items-center justify-center`}>
            <lastWin.icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className={`font-bold ${lastWin.actualAward > 0 ? 'text-green-800' : 'text-gray-800'}`}>Last Spin Result</div>
            <div className={`${lastWin.actualAward > 0 ? 'text-green-600' : 'text-gray-600'}`}>
              {lastWin.actualAward > 0 ? `${lastWin.actualAward} Points Received` : 'Better luck next time!'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LastWinDisplay;
