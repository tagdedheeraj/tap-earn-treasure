
export interface Task {
  id: number;
  title: string;
  description: string;
  reward: number;
  progress: number;
  total: number;
  type: 'daily' | 'weekly' | 'streak' | 'referral';
  completed: boolean;
  icon: any;
  color: string;
}

export interface TasksListProps {
  onNavigateToQuiz?: () => void;
}
