import { createContext, useContext, useMemo, useState } from 'react';
import {
  createClassEntry,
  createRecessEntry,
  updateScheduleEntry,
} from '../utils/schedule';

const ClassesContext = createContext(null);

export function ClassesProvider({ children }) {
  const [classes, setClasses] = useState([]);

  const value = useMemo(
    () => ({
      classes,
      setClasses,
      createClassEntry,
      createRecessEntry,
      updateScheduleEntry,
    }),
    [classes],
  );

  return (
    <ClassesContext.Provider value={value}>{children}</ClassesContext.Provider>
  );
}

export function useClasses() {
  const ctx = useContext(ClassesContext);
  if (!ctx) {
    throw new Error('useClasses debe usarse dentro de ClassesProvider');
  }
  return ctx;
}
