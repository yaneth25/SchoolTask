import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const SettingsContext = createContext(null);

const DEFAULT_SETTINGS = {
  notificationsEnabled: true,
  vibrationEnabled: true,
  nextClassEnabled: true,
  workDeliveryEnabled: true,
  deadlineReminderEnabled: true,
  overdueEnabled: true,
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  const updateSetting = useCallback((key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  const value = useMemo(
    () => ({
      settings,
      updateSetting,
      resetSettings,
    }),
    [settings, updateSetting, resetSettings],
  );

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    return {
      settings: DEFAULT_SETTINGS,
      updateSetting: () => {},
      resetSettings: () => {},
    };
  }
  return ctx;
}
