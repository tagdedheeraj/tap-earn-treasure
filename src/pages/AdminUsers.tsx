
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import AdminGuard from '@/components/admin/AdminGuard';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, UserPlus, UserMinus, Coins } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  username: string | null;
  referral_code: string;
  referred_by: string | null;
  created_at: string;
  email?: string;
}

interface UserWallet {
  total_coins: number;
}

interface UserData extends UserProfile {
  wallet: UserWallet | null;
  roles: string[];
}

const AdminUsers = () => {
  const { isAdmin, adminLoading, user } = useAdminAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isAdmin && !adminLoading) {
      fetchUsers();
    }
  }, [isAdmin, adminLoading]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Fetch all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch wallets for all users
      const { data: wallets, error: walletsError } = await supabase
        .from('coin_wallets')
        .select('user_id, total_coins');

      if (walletsError) throw walletsError;

      // Fetch roles for all users
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Combine the data
      const usersData: UserData[] = profiles?.map((profile) => {
        const wallet = wallets?.find(w => w.user_id === profile.id);
        const roles = userRoles?.filter(r => r.user_id === profile.id).map(r => r.role) || [];
        
        return {
          ...profile,
          wallet: wallet || null,
          roles
        };
      }) || [];

      setUsers(usersData);
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

  const updateUserCoins = async (userId: string, newAmount: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('coin_wallets')
        .update({ total_coins: newAmount })
        .eq('user_id', userId);

      if (error) throw error;

      // Log admin action
      await supabase
        .from('admin_actions')
        .insert({
          admin_id: user.id,
          action_type: 'update_coins',
          target_user_id: userId,
          description: `Updated user coins to ${newAmount}`,
          metadata: { previous_amount: users.find(u => u.id === userId)?.wallet?.total_coins }
        });

      toast({
        title: "Success",
        description: "User coins updated successfully"
      });

      fetchUsers();
    } catch (error) {
      console.error('Error updating coins:', error);
      toast({
        title: "Error",
        description: "Failed to update user coins",
        variant: "destructive"
      });
    }
  };

  const toggleUserRole = async (userId: string, role: 'admin' | 'user') => {
    if (!user) return;

    try {
      const targetUser = users.find(u => u.id === userId);
      const hasRole = targetUser?.roles.includes(role);

      if (hasRole) {
        // Remove role
        const { error } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId)
          .eq('role', role);

        if (error) throw error;
      } else {
        // Add role
        const { error } = await supabase
          .from('user_roles')
          .insert({ user_id: userId, role });

        if (error) throw error;
      }

      // Log admin action
      await supabase
        .from('admin_actions')
        .insert({
          admin_id: user.id,
          action_type: hasRole ? 'remove_role' : 'add_role',
          target_user_id: userId,
          description: `${hasRole ? 'Removed' : 'Added'} ${role} role`,
          metadata: { role }
        });

      toast({
        title: "Success",
        description: `User role ${hasRole ? 'removed' : 'added'} successfully`
      });

      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive"
      });
    }
  };

  const filteredUsers = users.filter(user =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.referral_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (adminLoading || loading) {
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
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">User Management</h1>
            <Button onClick={fetchUsers}>Refresh Data</Button>
          </div>

          {/* Search */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Search className="w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search users by username, ID, or referral code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Users List */}
          <div className="grid gap-4">
            {filteredUsers.map((user) => (
              <Card key={user.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {user.username || 'No Username'}
                        {user.roles.includes('admin') && (
                          <Badge variant="destructive">Admin</Badge>
                        )}
                      </CardTitle>
                      <p className="text-sm text-gray-600">ID: {user.id}</p>
                      <p className="text-sm text-gray-600">Referral: {user.referral_code}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-lg font-bold">
                        <Coins className="w-5 h-5 text-yellow-600" />
                        {user.wallet?.total_coins || 0}
                      </div>
                      <p className="text-sm text-gray-600">
                        Joined: {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Input
                      type="number"
                      placeholder="New coin amount"
                      className="w-40"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const newAmount = parseInt((e.target as HTMLInputElement).value);
                          if (!isNaN(newAmount) && newAmount >= 0) {
                            updateUserCoins(user.id, newAmount);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      variant={user.roles.includes('admin') ? 'destructive' : 'default'}
                      onClick={() => toggleUserRole(user.id, 'admin')}
                    >
                      {user.roles.includes('admin') ? (
                        <>
                          <UserMinus className="w-4 h-4 mr-1" />
                          Remove Admin
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4 mr-1" />
                          Make Admin
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-600">No users found matching your search.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </AdminLayout>
    </AdminGuard>
  );
};

export default AdminUsers;
