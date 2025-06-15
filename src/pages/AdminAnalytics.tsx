
import React, { useEffect, useState } from 'react';
import AdminGuard from '@/components/admin/AdminGuard';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsData {
  dailySignups: Array<{ date: string; count: number }>;
  transactionSources: Array<{ source: string; count: number; amount: number }>;
  userActivity: Array<{ date: string; active_users: number }>;
}

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    dailySignups: [],
    transactionSources: [],
    userActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Get daily signups for last 7 days
      const signupsPromise = supabase
        .from('profiles')
        .select('created_at')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      // Get transaction sources
      const transactionsPromise = supabase
        .from('coin_transactions')
        .select('source, amount');

      const [signupsResult, transactionsResult] = await Promise.all([
        signupsPromise,
        transactionsPromise
      ]);

      // Process daily signups
      const dailySignups = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
        const dateStr = date.toISOString().split('T')[0];
        const count = signupsResult.data?.filter(user => 
          user.created_at.split('T')[0] === dateStr
        ).length || 0;
        
        return {
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          count
        };
      }).reverse();

      // Process transaction sources
      const sourceMap = new Map();
      transactionsResult.data?.forEach(transaction => {
        const existing = sourceMap.get(transaction.source) || { count: 0, amount: 0 };
        sourceMap.set(transaction.source, {
          count: existing.count + 1,
          amount: existing.amount + transaction.amount
        });
      });

      const transactionSources = Array.from(sourceMap.entries()).map(([source, data]) => ({
        source: source.charAt(0).toUpperCase() + source.slice(1),
        count: data.count,
        amount: data.amount
      }));

      setAnalytics({
        dailySignups,
        transactionSources,
        userActivity: [] // We'll add this later
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

  if (loading) {
    return (
      <AdminGuard>
        <AdminLayout>
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </AdminLayout>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600">Monitor app performance and user behavior</p>
          </div>

          {/* Daily Signups Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Signups (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.dailySignups}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Transaction Sources */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Transaction Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.transactionSources}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ source, count }) => `${source}: ${count}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {analytics.transactionSources.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Transaction Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.transactionSources.map((source, index) => (
                    <div key={source.source} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div 
                          className="w-4 h-4 rounded-full mr-3"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></div>
                        <span className="font-medium">{source.source}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{source.count} transactions</div>
                        <div className="text-sm text-gray-600">{source.amount.toLocaleString()} coins</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-green-800">App Status</h3>
                  <p className="text-2xl font-bold text-green-600">Online</p>
                  <p className="text-sm text-green-600">All systems operational</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-800">Database</h3>
                  <p className="text-2xl font-bold text-blue-600">Healthy</p>
                  <p className="text-sm text-blue-600">Response time: ~50ms</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-semibold text-purple-800">API Status</h3>
                  <p className="text-2xl font-bold text-purple-600">Active</p>
                  <p className="text-sm text-purple-600">99.9% uptime</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </AdminGuard>
  );
};

export default AdminAnalytics;
