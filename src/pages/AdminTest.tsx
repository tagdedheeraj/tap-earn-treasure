
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AdminTest = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, adminLoading } = useAdminAuth();
  const [userRoles, setUserRoles] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      checkUserRoles();
      fetchAllUsers();
    }
  }, [user]);

  const checkUserRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user?.id);
      
      console.log('User roles data:', data);
      console.log('User roles error:', error);
      setUserRoles(data || []);
    } catch (error) {
      console.error('Error fetching user roles:', error);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*');
      
      console.log('All user roles:', data);
      setAllUsers(data || []);
    } catch (error) {
      console.error('Error fetching all users:', error);
    }
  };

  const makeUserAdmin = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .insert([
          { user_id: user.id, role: 'admin' }
        ]);
      
      console.log('Insert result:', data, error);
      if (!error) {
        checkUserRoles();
        alert('Admin role added successfully!');
      }
    } catch (error) {
      console.error('Error making user admin:', error);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Admin Test Page</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Authentication Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><strong>Auth Loading:</strong> {authLoading ? 'Yes' : 'No'}</p>
              <p><strong>User:</strong> {user ? user.email : 'Not logged in'}</p>
              <p><strong>User ID:</strong> {user?.id || 'N/A'}</p>
              <p><strong>Admin Loading:</strong> {adminLoading ? 'Yes' : 'No'}</p>
              <p><strong>Is Admin:</strong> {isAdmin ? 'Yes' : 'No'}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Roles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Current User Roles:</strong></p>
                <pre className="text-sm bg-gray-100 p-2 rounded">
                  {JSON.stringify(userRoles, null, 2)}
                </pre>
                <Button onClick={makeUserAdmin} className="mt-2">
                  Make Current User Admin
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>All User Roles in Database</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-sm bg-gray-100 p-2 rounded max-h-60 overflow-auto">
                {JSON.stringify(allUsers, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminTest;
