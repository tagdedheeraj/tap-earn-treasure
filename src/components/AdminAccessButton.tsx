
import React from 'react';
import { Button } from '@/components/ui/button';
import { Shield, User, Settings } from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';

const AdminAccessButton = () => {
  const { user } = useAuth();
  const { isAdmin, adminLoading } = useAdminAuth();

  console.log('AdminAccessButton - User:', user?.email);
  console.log('AdminAccessButton - IsAdmin:', isAdmin);
  console.log('AdminAccessButton - AdminLoading:', adminLoading);

  if (!user) {
    return (
      <Link to="/auth">
        <Button variant="outline" size="sm">
          <User className="w-4 h-4 mr-2" />
          Login
        </Button>
      </Link>
    );
  }

  if (adminLoading) {
    return (
      <Button variant="outline" size="sm" disabled>
        <Shield className="w-4 h-4 mr-2 animate-spin" />
        Checking...
      </Button>
    );
  }

  if (isAdmin) {
    return (
      <Link to="/admin">
        <Button variant="destructive" size="sm">
          <Shield className="w-4 h-4 mr-2" />
          Admin Panel
        </Button>
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600 hidden md:block">
        {user.email}
      </span>
      <Link to="/admin-test">
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4 mr-2" />
          Get Admin Access
        </Button>
      </Link>
    </div>
  );
};

export default AdminAccessButton;
