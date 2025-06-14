
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface ProgressIndicatorProps {
  currentDay: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentDay }) => {
  return (
    <Card className="bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-200 shadow-lg">
      <CardContent className="p-4">
        <div className="text-center">
          <div className="text-sm text-orange-800 font-medium mb-2">Weekly Progress</div>
          <div className="w-full bg-white/70 rounded-full h-3 mb-2">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-500 shadow-inner"
              style={{ width: `${(currentDay / 7) * 100}%` }}
            ></div>
          </div>
          <div className="text-xs text-orange-700 font-bold">
            {currentDay}/7 Days • {Math.round((currentDay / 7) * 100)}% Complete
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressIndicator;
