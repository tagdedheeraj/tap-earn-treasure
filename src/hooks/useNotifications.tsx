
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useNotifications = () => {
  const { user } = useAuth();

  const createNotification = async (
    type: string,
    title: string,
    message: string,
    data?: any
  ) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          type,
          title,
          message,
          data,
          is_read: false
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  const notifyMiningCompleted = (points: number) => {
    createNotification(
      'mining',
      'Mining Completed! 🎉',
      `You've successfully mined ${points} points! Keep up the great work.`,
      { points }
    );
  };

  const notifyTaskCompleted = (taskName: string, points: number) => {
    createNotification(
      'task',
      'Task Completed! ✅',
      `Great job! You completed "${taskName}" and earned ${points} points.`,
      { taskName, points }
    );
  };

  const notifyQuizCompleted = (score: number, points: number) => {
    createNotification(
      'quiz',
      'Quiz Completed! 🧠',
      `Quiz completed with ${score}% score! You earned ${points} points.`,
      { score, points }
    );
  };

  const notifyReferralBonus = (points: number) => {
    createNotification(
      'referral',
      'Referral Bonus! 🎁',
      `Your friend joined and completed their first mining! You earned ${points} points.`,
      { points }
    );
  };

  const notifyWelcomeBonus = (points: number) => {
    createNotification(
      'referral',
      'Welcome Bonus! 🎉',
      `Welcome to GiftLeap! You received ${points} points as a welcome bonus.`,
      { points }
    );
  };

  const notifyRewardRedeemed = (itemName: string, points: number) => {
    createNotification(
      'reward',
      'Reward Redeemed! 🎁',
      `You successfully redeemed "${itemName}" for ${points} points.`,
      { itemName, points }
    );
  };

  const notifyAdWatched = (points: number) => {
    createNotification(
      'mining',
      'Ad Watched! 📺',
      `Thanks for watching! You earned ${points} points.`,
      { points }
    );
  };

  return {
    createNotification,
    notifyMiningCompleted,
    notifyTaskCompleted,
    notifyQuizCompleted,
    notifyReferralBonus,
    notifyWelcomeBonus,
    notifyRewardRedeemed,
    notifyAdWatched
  };
};
