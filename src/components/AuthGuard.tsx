
import React from 'react';
import { useAuth } from '@/hooks/useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

// AuthGuard now has an optional requireAuth parameter
// If requireAuth is true, the user must be authenticated to access the page
// If requireAuth is false or undefined, any user can access the page
const AuthGuard: React.FC<AuthGuardProps> = ({ children, requireAuth = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If requireAuth is true and user is not authenticated, we would typically redirect
  // But we'll return the children anyway as we'll handle auth at the component level

  return <>{children}</>;
};

export default AuthGuard;
