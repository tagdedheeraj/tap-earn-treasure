
import React, { useEffect, useState } from 'react';
import AdminGuard from '@/components/admin/AdminGuard';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Minus, Ban, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  username: string | null;
  referral_code: string;
  created_at: string;
  total_coins: number;
  is_admin: boolean;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [coinAmount, setCoinAmount] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id,
          username,
          referral_code,
          created_at,
          coin_wallets(total_coins),
          user_roles(role)
        `);

      if (profilesError) throw profilesError;

      const usersWithCoins = profilesData?.map(profile => ({
        id: profile.id,
        username: profile.username,
        referral_code: profile.referral_code,
        created_at: profile.created_at,
        total_coins: profile.coin_wallets?.[0]?.total_coins || 0,
        is_admin: profile.user_roles?.some(role => role.role === 'admin') || false
      })) || [];

      setUsers(usersWithCoins);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.referral_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const updateUserCoins = async (userId: string, amount: number, action: 'add' | 'subtract') => {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) return;

      const finalAmount = action === 'add' ? amount : -amount;
      const newTotal = Math.max(0, user.total_coins + finalAmount);

      // Update wallet
      const { error: walletError } = await supabase
        .from('coin_wallets')
        .update({ 
          total_coins: newTotal,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (walletError) throw walletError;

      // Add transaction record
      const { error: transactionError } = await supabase
        .from('coin_transactions')
        .insert({
          user_id: userId,
          amount: Math.abs(finalAmount),
          transaction_type: finalAmount > 0 ? 'earned' : 'spent',
          source: 'admin',
          description: `Admin ${action === 'add' ? 'added' : 'subtracted'} ${Math.abs(finalAmount)} coins`
        });

      if (transactionError) throw transactionError;

      // Log admin action
      const { error: actionError } = await supabase
        .from('admin_actions')
        .insert({
          admin_id: (await supabase.auth.getUser()).data.user?.id || '',
          action_type: 'coin_adjustment',
          target_user_id: userId,
          description: `${action === 'add' ? 'Added' : 'Subtracted'} ${Math.abs(finalAmount)} coins`,
          metadata: { amount: finalAmount, new_total: newTotal }
        });

      if (actionError) throw actionError;

      toast({
        title: "Success",
        description: `Successfully ${action === 'add' ? 'added' : 'subtracted'} ${Math.abs(finalAmount)} coins`,
      });

      await fetchUsers();
      setCoinAmount('');
      setSelectedUser(null);
    } catch (error) {
      console.error('Error updating coins:', error);
      toast({
        title: "Error",
        description: "Failed to update user coins",
        variant: "destructive"
      });
    }
  };

  const toggleAdminRole = async (userId: string, isCurrentlyAdmin: boolean) => {
    try {
      if (isCurrentlyAdmin) {
        // Remove admin role
        const { error } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId)
          .eq('role', 'admin');

        if (error) throw error;
      } else {
        // Add admin role
        const { error } = await supabase
          .from('user_roles')
          .insert({
            user_id: userId,
            role: 'admin'
          });

        if (error) throw error;
      }

      // Log admin action
      await supabase
        .from('admin_actions')
        .insert({
          admin_id: (await supabase.auth.getUser()).data.user?.id || '',
          action_type: 'role_change',
          target_user_id: userId,
          description: `${isCurrentlyAdmin ? 'Removed' : 'Granted'} admin role`,
          metadata: { new_role: isCurrentlyAdmin ? 'user' : 'admin' }
        });

      toast({
        title: "Success",
        description: `Successfully ${isCurrentlyAdmin ? 'removed' : 'granted'} admin role`,
      });

      await fetchUsers();
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive"
      });
    }
  };

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
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600">Manage all registered users and their accounts</p>
          </div>

          {/* Search */}
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search users by username, referral code, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>Users ({filteredUsers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Referral Code</TableHead>
                    <TableHead>Total Coins</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.username || 'Anonymous'}
                      </TableCell>
                      <TableCell>{user.referral_code}</TableCell>
                      <TableCell>{user.total_coins.toLocaleString()}</TableCell>
                      <TableCell>
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.is_admin 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.is_admin ? 'Admin' : 'User'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedUser(user)}
                          >
                            Manage Coins
                          </Button>
                          <Button
                            size="sm"
                            variant={user.is_admin ? "destructive" : "default"}
                            onClick={() => toggleAdminRole(user.id, user.is_admin)}
                          >
                            {user.is_admin ? (
                              <>
                                <Ban className="w-4 h-4 mr-1" />
                                Remove Admin
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Make Admin
                              </>
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Coin Management Modal */}
          {selectedUser && (
            <Card className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
                <h3 className="text-lg font-semibold mb-4">
                  Manage Coins for {selectedUser.username || 'Anonymous'}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Current Balance: {selectedUser.total_coins.toLocaleString()} coins
                </p>
                <div className="space-y-4">
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={coinAmount}
                    onChange={(e) => setCoinAmount(e.target.value)}
                  />
                  <div className="flex space-x-2">
                    <Button
                      className="flex-1"
                      onClick={() => {
                        const amount = parseInt(coinAmount);
                        if (amount > 0) {
                          updateUserCoins(selectedUser.id, amount, 'add');
                        }
                      }}
                      disabled={!coinAmount || parseInt(coinAmount) <= 0}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Coins
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() => {
                        const amount = parseInt(coinAmount);
                        if (amount > 0) {
                          updateUserCoins(selectedUser.id, amount, 'subtract');
                        }
                      }}
                      disabled={!coinAmount || parseInt(coinAmount) <= 0}
                    >
                      <Minus className="w-4 h-4 mr-1" />
                      Subtract Coins
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setSelectedUser(null);
                      setCoinAmount('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </AdminLayout>
    </AdminGuard>
  );
};

export default AdminUsers;
