import React, { createContext, useContext, useState, useCallback } from 'react';
import { DESCRIPTION_MAX_LENGTH } from '../constants/theme';

const TasksContext = createContext();

function clampDescription(text) {
  if (!text) return '';
  return text.substring(0, DESCRIPTION_MAX_LENGTH);
}

export function TasksProvider({ children }) {
  const [tasks, setTasks] = useState([]);

  const addTask = useCallback((task) => {
    setTasks((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        ...task,
        description: clampDescription(task.description),
      },
    ]);
  }, []);

  const removeTask = useCallback((id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  const updateTask = useCallback((updatedTask) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === updatedTask.id
          ? {
              ...updatedTask,
              description: clampDescription(updatedTask.description),
            }
          : task,
      ),
    );
  }, []);

  const clearTasks = useCallback(() => {
    setTasks([]);
  }, []);

  return (
    <TasksContext.Provider
      value={{ tasks, addTask, removeTask, updateTask, clearTasks }}
    >
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TasksContext);
  return (
    context || {
      tasks: [],
      addTask: () => {},
      removeTask: () => {},
      updateTask: () => {},
      clearTasks: () => {},
    }
  );
}
