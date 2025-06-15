
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const MoreOpportunities = () => {
  return (
    <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
      <CardContent className="p-4">
        <h3 className="font-bold text-orange-800 mb-2">More Daily Opportunities</h3>
        <ul className="text-sm text-orange-700 space-y-1">
          <li>• Complete daily tasks and challenges</li>
          <li>• Maintain login streaks for bonus rewards</li>
          <li>• Invite friends to join the platform</li>
          <li>• Participate in special promotional activities</li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default MoreOpportunities;
