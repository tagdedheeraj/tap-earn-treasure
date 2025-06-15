
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const DailyLimitInfo = () => {
  return (
    <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
      <CardContent className="p-4 text-center">
        <h3 className="font-bold text-indigo-800 mb-2">Daily Opportunity Limit</h3>
        <p className="text-sm text-indigo-700">
          Get up to 10,000 points daily through various activities including spins, tasks, and daily bonuses!
        </p>
        <p className="text-xs text-indigo-600 mt-1">
          Reset every 24 hours • Maximum 3 daily spins
        </p>
      </CardContent>
    </Card>
  );
};

export default DailyLimitInfo;
