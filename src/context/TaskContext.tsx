import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { Task } from '../types';

type TaskContextValue = {
  tasks: Task[];
  addTask: (input: Omit<Task, 'id' | 'completed'>) => void;
  deleteTask: (id: string) => void;
  deleteAllTasks: () => void;
  toggleComplete: (id: string) => void;
};

const TaskContext = createContext<TaskContextValue | null>(null);

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = useCallback((input: Omit<Task, 'id' | 'completed'>) => {
    setTasks((prev) => [
      ...prev,
      {
        ...input,
        id: generateId(),
        completed: false,
      },
    ]);
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const deleteAllTasks = useCallback(() => {
    setTasks([]);
  }, []);

  const toggleComplete = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  }, []);

  const value = useMemo(
    () => ({
      tasks,
      addTask,
      deleteTask,
      deleteAllTasks,
      toggleComplete,
    }),
    [tasks, addTask, deleteTask, deleteAllTasks, toggleComplete],
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  const ctx = useContext(TaskContext);
  if (!ctx) {
    throw new Error('useTasks must be used within TaskProvider');
  }
  return ctx;
}
