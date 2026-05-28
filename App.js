import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { TasksProvider, useTasks } from './src/context/TasksContext';
import { NotificationsProvider, useNotifications } from './src/context/NotificationsContext';
import { ClassesProvider, useClasses } from './src/context/ClassesContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { SettingsProvider, useSettings } from './src/context/SettingsContext';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';
import { logoutUser } from './js/auth';
import { restoreAuthSession, subscribeToAuthChanges } from './js/session';
import SidebarMenu from './src/components/SidebarMenu';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import AuthStatusScreen from './src/screens/AuthStatusScreen';
import MainNavigator, { navigateToScreen } from './src/navigation/MainNavigator';
import {
  createClassEntry,
  createRecessEntry,
  updateScheduleEntry,
} from './src/utils/schedule';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <SettingsProvider>
          <TasksProvider>
            <ClassesProvider>
              <NotificationsProvider>
                <MainAppContent />
              </NotificationsProvider>
            </ClassesProvider>
          </TasksProvider>
        </SettingsProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function MainAppContent() {
  const [authScreen, setAuthScreen] = useState('Login');
  const [authReady, setAuthReady] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const { colors, isDarkMode, setDarkMode } = useTheme();
  const { classes, setClasses } = useClasses();
  const { addTask, updateTask, clearTasks } = useTasks();
  const { clearDismissed } = useNotifications();
  const { resetSettings } = useSettings();

  // Restaurar sesión al abrir la app (equivalente a session.js en index.html)
  useEffect(() => {
    let active = true;

    restoreAuthSession().then((user) => {
      if (!active) return;
      if (user) {
        setAuthScreen('main');
      }
      setAuthReady(true);
    });

    const { unsubscribe } = subscribeToAuthChanges((user) => {
      if (user) {
        setAuthScreen('main');
        return;
      }
      setAuthScreen((current) => (current === 'main' ? 'Login' : current));
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  const goToSchedule = () => {
    setEditingItem(null);
    navigateToScreen('Clases');
  };

  const goToAssignClass = (item = null) => {
    setEditingItem(item);
    navigateToScreen('AsignarClase');
  };

  const handleFormSubmit = (formData) => {
    if (editingItem) {
      setClasses((prev) =>
        prev.map((entry) =>
          entry.id === editingItem.id
            ? updateScheduleEntry(entry, formData, formData.mode)
            : entry,
        ),
      );
    } else if (formData.mode === 'recess') {
      setClasses((prev) => [
        ...prev,
        createRecessEntry({
          startTime: formData.startTime,
          endTime: formData.endTime,
        }),
      ]);
    } else {
      setClasses((prev) => [...prev, createClassEntry(formData)]);
    }

    goToSchedule();
  };

  const handleDeleteClass = (id) => {
    setClasses((prev) => prev.filter((entry) => entry.id !== id));
  };

  const resetUserData = () => {
    setClasses([]);
    clearTasks();
    clearDismissed();
    resetSettings();
    setDarkMode(false);
    setEditingItem(null);
  };

  const handleDeleteAccount = () => {
    resetUserData();
    setAuthScreen('accountDeleted');
  };

  const handleLogout = async () => {
    setEditingItem(null);
    const result = await logoutUser();
    if (!result.success) {
      Alert.alert('Error al cerrar sesión', result.message);
      return;
    }
    setAuthScreen('sessionClosed');
  };

  const handleMenuItem = (itemId) => {
    closeDrawer();

    switch (itemId) {
      case 'clases':
        navigateToScreen('Clases');
        break;
      case 'tareas':
        navigateToScreen('Tareas');
        break;
      case 'notificaciones':
        navigateToScreen('Notificaciones');
        break;
      case 'configuracion':
        navigateToScreen('Configuracion');
        break;
      case 'cerrar':
        handleLogout();
        break;
      default:
        break;
    }
  };

  const handleLoginSuccess = () => {
    setAuthScreen('main');
  };

  if (!authReady) {
    return (
      <SafeAreaView style={[styles.safe, styles.authLoading]}>
        <StatusBar style="dark" />
        <View style={styles.authLoadingInner}>
          <ActivityIndicator size="large" color="#2F2F2F" />
        </View>
      </SafeAreaView>
    );
  }

  if (authScreen === 'Login') {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar style="dark" />
        <LoginScreen
          onLoginSuccess={handleLoginSuccess}
          onGoToRegister={() => setAuthScreen('Register')}
        />
      </SafeAreaView>
    );
  }

  if (authScreen === 'Register') {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar style="dark" />
        <RegisterScreen
          onRegisterSuccess={() => setAuthScreen('Login')}
          onGoToLogin={() => setAuthScreen('Login')}
        />
      </SafeAreaView>
    );
  }

  if (authScreen === 'accountDeleted') {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar style="dark" />
        <AuthStatusScreen
          type="deleted"
          onLogin={() => setAuthScreen('Login')}
          onRegister={() => setAuthScreen('Register')}
        />
      </SafeAreaView>
    );
  }

  if (authScreen === 'sessionClosed') {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar style="dark" />
        <AuthStatusScreen
          type="logout"
          onLogin={() => setAuthScreen('Login')}
          onRegister={() => setAuthScreen('Register')}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />

      <MainNavigator
        onMenuPress={openDrawer}
        onAssignPress={() => goToAssignClass()}
        onEditClass={(item) => goToAssignClass(item)}
        onDeleteClass={handleDeleteClass}
        onAssignTaskPress={() => {
          setEditingItem(null);
          navigateToScreen('AsignarTarea');
        }}
        onEditTaskPress={(task) => {
          setEditingItem(task);
          navigateToScreen('AsignarTarea');
        }}
        editingItem={editingItem}
        onCancelAssign={goToSchedule}
        onSubmitClass={handleFormSubmit}
        onCancelTask={() => {
          setEditingItem(null);
          navigateToScreen('Tareas');
        }}
        onSubmitTask={(taskData) => {
          if (editingItem?.id) {
            updateTask({ ...taskData, id: editingItem.id });
          } else {
            addTask(taskData);
          }
          setEditingItem(null);
          navigateToScreen('Tareas');
        }}
        onDeleteAccount={handleDeleteAccount}
        onLogout={handleLogout}
      />

      <SidebarMenu
        visible={drawerOpen}
        onClose={closeDrawer}
        onItemPress={handleMenuItem}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  authLoading: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  authLoadingInner: {
    padding: 24,
  },
});
