import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTasks } from './TasksContext';
import { useSettings } from './SettingsContext';
import { useClasses } from './ClassesContext';
import { getSchoolDayTitle } from '../utils/dayHelpers';
import { buildDaySchedule } from '../utils/schedule';
import { getClassStatus, getNowMinutes } from '../utils/time';
import {
  diffDays,
  formatDateKey,
  parseDueDate,
  startOfDay,
} from '../utils/notificationHelpers';

const NotificationsContext = createContext(null);
const REGENERATE_MS = 24 * 60 * 60 * 1000;
const TICK_MS = 60 * 1000;

function buildGeneratedNotifications(tasks, classes, now, settings) {
  if (!settings.notificationsEnabled) {
    return [];
  }

  const items = [];
  const today = startOfDay(now);
  const pendingTasks = tasks.filter((t) => t.title && t.dueDate);

  if (settings.workDeliveryEnabled && pendingTasks.length > 0) {
    items.push({
      id: `general-${formatDateKey(today)}`,
      type: 'general',
      sectionDate: today,
      title: '¡NO OLVIDES HACER TUS TAREAS!',
      description: 'TERMINA TODAS TUS TAREAS PENDIENTES',
    });

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    items.push({
      id: `general-${formatDateKey(yesterday)}`,
      type: 'general',
      sectionDate: yesterday,
      title: '¡NO OLVIDES HACER TUS TAREAS!',
      description: 'TERMINA TODAS TUS TAREAS PENDIENTES',
    });
  }

  pendingTasks.forEach((task) => {
    const due = parseDueDate(task.dueDate);
    if (!due) return;

    const daysUntil = diffDays(today, due);
    const description =
      'RECUERDA TERMINAR LA TAREA ANTES DE LA FECHA DE ENTREGA';

    if (daysUntil === 0 && settings.deadlineReminderEnabled) {
      items.push({
        id: `task-today-${task.id}`,
        type: 'task',
        sectionDate: today,
        title: `LA TAREA: ${task.title.toUpperCase()} SE ENTREGA HOY`,
        description,
      });
    } else if (daysUntil === 1 && settings.deadlineReminderEnabled) {
      items.push({
        id: `task-tomorrow-${task.id}`,
        type: 'task',
        sectionDate: today,
        title: `LA TAREA: ${task.title.toUpperCase()} SE ENTREGA MAÑANA`,
        description,
      });
    } else if (daysUntil < 0 && settings.overdueEnabled) {
      items.push({
        id: `task-overdue-${task.id}`,
        type: 'task',
        sectionDate: due,
        title: `LA TAREA: ${task.title.toUpperCase()} — FECHA VENCIDA`,
        description,
      });
    }
  });

  if (settings.nextClassEnabled) {
    const dayKey = getSchoolDayTitle(now);
    const scheduleItems = buildDaySchedule(classes, dayKey);
    const { nextId } = getClassStatus(scheduleItems, getNowMinutes(now));
    const nextClass = scheduleItems.find((c) => c.id === nextId && !c.isRecess);

    if (nextClass) {
      items.push({
        id: `next-class-${formatDateKey(today)}-${nextClass.id}`,
        type: 'class',
        sectionDate: today,
        title: `PRÓXIMA CLASE: ${nextClass.subject}`,
        description: `COMIENZA A LAS ${nextClass.startTime}`,
      });
    }
  }

  return items;
}

export function NotificationsProvider({ children }) {
  const { tasks } = useTasks();
  const { classes } = useClasses();
  const { settings } = useSettings();
  const [now, setNow] = useState(() => new Date());
  const [dismissedIds, setDismissedIds] = useState([]);
  const [generated, setGenerated] = useState([]);
  const lastRegenerateRef = useRef(Date.now());

  const regenerate = useCallback(() => {
    setGenerated(
      buildGeneratedNotifications(tasks, classes, new Date(), settings),
    );
    lastRegenerateRef.current = Date.now();
  }, [tasks, classes, settings]);

  useEffect(() => {
    regenerate();
  }, [regenerate]);

  useEffect(() => {
    const tick = setInterval(() => {
      const next = new Date();
      setNow(next);

      if (Date.now() - lastRegenerateRef.current >= REGENERATE_MS) {
        regenerate();
      }
    }, TICK_MS);

    return () => clearInterval(tick);
  }, [regenerate]);

  const visibleNotifications = useMemo(() => {
    const dismissed = new Set(dismissedIds);
    return generated.filter((n) => !dismissed.has(n.id));
  }, [generated, dismissedIds]);

  const dismissNotification = useCallback((id) => {
    setDismissedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const dismissAll = useCallback(() => {
    setDismissedIds((prev) => {
      const all = generated.map((n) => n.id);
      return [...new Set([...prev, ...all])];
    });
  }, [generated]);

  const clearDismissed = useCallback(() => {
    setDismissedIds([]);
  }, []);

  const value = useMemo(
    () => ({
      notifications: visibleNotifications,
      now,
      dismissNotification,
      dismissAll,
      clearDismissed,
    }),
    [visibleNotifications, now, dismissNotification, dismissAll, clearDismissed],
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) {
    return {
      notifications: [],
      now: new Date(),
      dismissNotification: () => {},
      dismissAll: () => {},
      clearDismissed: () => {},
    };
  }
  return ctx;
}
