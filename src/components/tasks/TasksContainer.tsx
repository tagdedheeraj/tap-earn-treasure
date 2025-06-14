
import React from 'react';
import TasksHeader from '@/components/tasks/TasksHeader';
import TaskItem from '@/components/tasks/TaskItem';
import { Task } from '@/types/tasks';

interface TasksContainerProps {
  tasks: Task[];
  quizCompleted: boolean;
  onCompleteTask: (taskId: number) => void;
}

const TasksContainer: React.FC<TasksContainerProps> = ({ 
  tasks, 
  quizCompleted, 
  onCompleteTask 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-25 to-pink-50 pb-32">
      <div className="space-y-6 p-4">
        <TasksHeader tasks={tasks} />

        {/* Enhanced Tasks List */}
        <div className="space-y-4">
          {tasks.map((task, index) => (
            <TaskItem
              key={task.id}
              task={task}
              index={index}
              quizCompleted={quizCompleted}
              onCompleteTask={onCompleteTask}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TasksContainer;
