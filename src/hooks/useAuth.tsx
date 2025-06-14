
import { useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Setting up auth state listener');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Track login streak when user signs in
        if (event === 'SIGNED_IN' && session?.user) {
          setTimeout(() => {
            updateLoginStreak(session.user.id);
          }, 0);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      console.log('Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  const updateLoginStreak = async (userId: string) => {
    try {
      console.log('Updating login streak for user:', userId);
      
      // Get current date in YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0];
      
      // Check if user has a login streak task record
      const { data: existingTask, error: fetchError } = await supabase
        .from('user_tasks')
        .select('*')
        .eq('user_id', userId)
        .eq('task_type', 'login_streak')
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching login streak task:', fetchError);
        return;
      }

      if (existingTask) {
        const lastResetDate = existingTask.last_reset_date;
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        let newCount = existingTask.completed_count;
        
        // If last login was yesterday, increment streak
        if (lastResetDate === yesterdayStr) {
          newCount = Math.min(existingTask.completed_count + 1, 7);
        }
        // If last login was today, don't change anything
        else if (lastResetDate === today) {
          return; // Already logged in today
        }
        // If gap is more than 1 day, reset streak
        else {
          newCount = 1; // Start new streak
        }

        // Update the task
        const { error: updateError } = await supabase
          .from('user_tasks')
          .update({
            completed_count: newCount,
            last_reset_date: today,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingTask.id);

        if (updateError) {
          console.error('Error updating login streak:', updateError);
        } else {
          console.log('Login streak updated:', newCount);
        }
      } else {
        // Create new login streak task
        const { error: insertError } = await supabase
          .from('user_tasks')
          .insert({
            user_id: userId,
            task_type: 'login_streak',
            completed_count: 1,
            last_reset_date: today
          });

        if (insertError) {
          console.error('Error creating login streak task:', insertError);
        } else {
          console.log('Login streak task created');
        }
      }
    } catch (error) {
      console.error('Error in updateLoginStreak:', error);
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out user');
      await supabase.auth.signOut();
      window.location.href = '/auth';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return {
    user,
    session,
    loading,
    signOut,
  };
};
