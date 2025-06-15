
import React, { useEffect, useState } from 'react';
import AdminGuard from '@/components/admin/AdminGuard';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Coins, Activity, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  totalUsers: number;
  totalCoins: number;
  dailyActiveUsers: number;
  totalTransactions: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalCoins: 0,
    dailyActiveUsers: 0,
    totalTransactions: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Get total users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get total coins distributed
      const { data: coinData } = await supabase
        .from('coin_wallets')
        .select('total_coins');
      
      const totalCoins = coinData?.reduce((sum, wallet) => sum + wallet.total_coins, 0) || 0;

      // Get total transactions
      const { count: totalTransactions } = await supabase
        .from('coin_transactions')
        .select('*', { count: 'exact', head: true });

      // Get daily active users (users who had transactions today)
      const today = new Date().toISOString().split('T')[0];
      const { count: dailyActiveUsers } = await supabase
        .from('coin_transactions')
        .select('user_id', { count: 'exact', head: true })
        .gte('created_at', `${today}T00:00:00.000Z`)
        .lt('created_at', `${today}T23:59:59.999Z`);

      setStats({
        totalUsers: totalUsers || 0,
        totalCoins,
        dailyActiveUsers: dailyActiveUsers || 0,
        totalTransactions: totalTransactions || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Coins',
      value: stats.totalCoins.toLocaleString(),
      icon: Coins,
      color: 'bg-yellow-500'
    },
    {
      title: 'Daily Active Users',
      value: stats.dailyActiveUsers,
      icon: Activity,
      color: 'bg-green-500'
    },
    {
      title: 'Total Transactions',
      value: stats.totalTransactions,
      icon: TrendingUp,
      color: 'bg-purple-500'
    }
  ];

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
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Manage your app and monitor key metrics</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.color}`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <h3 className="font-semibold text-gray-900 mb-1">Manage Users</h3>
                  <p className="text-sm text-gray-600">View and manage all registered users</p>
                </button>
                <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <h3 className="font-semibold text-gray-900 mb-1">App Settings</h3>
                  <p className="text-sm text-gray-600">Configure app-wide settings and limits</p>
                </button>
                <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <h3 className="font-semibold text-gray-900 mb-1">View Analytics</h3>
                  <p className="text-sm text-gray-600">Monitor app performance and user activity</p>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </AdminGuard>
  );
};

export default AdminDashboard;
