
import React from 'react';
import { TasksListProps } from '@/types/tasks';
import { useTaskProgress } from '@/hooks/useTaskProgress';
import TasksContainer from '@/components/tasks/TasksContainer';

const TasksList: React.FC<TasksListProps> = ({ onNavigateToQuiz }) => {
  const { tasks, quizCompleted, completeTask } = useTaskProgress(onNavigateToQuiz);

  return (
    <TasksContainer
      tasks={tasks}
      quizCompleted={quizCompleted}
      onCompleteTask={completeTask}
    />
  );
};

export default TasksList;
