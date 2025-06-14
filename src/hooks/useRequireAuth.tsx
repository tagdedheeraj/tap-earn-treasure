
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const useRequireAuth = () => {
  const { user } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const navigate = useNavigate();
  
  const requireAuth = (action: () => void) => {
    if (user) {
      // User is authenticated, proceed with action
      action();
      return true;
    } else {
      // User is not authenticated, show dialog
      setShowAuthDialog(true);
      return false;
    }
  };
  
  const AuthDialog = () => (
    <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Authentication Required</DialogTitle>
          <DialogDescription>
            You need to sign in or create an account to use this feature.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-between mt-4">
          <Button variant="outline" onClick={() => setShowAuthDialog(false)}>Cancel</Button>
          <Button onClick={() => {
            setShowAuthDialog(false);
            navigate('/auth');
          }}>Sign In / Register</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
  
  return { requireAuth, AuthDialog, isAuthenticated: !!user };
};
