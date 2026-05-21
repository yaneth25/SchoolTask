import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TasksProvider, useTasks } from './src/context/TasksContext';
import TaskListScreen from './src/screens/TaskListScreen';
import AssignTaskScreen from './src/screens/AssignTaskScreen';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Alert, SafeAreaView, StyleSheet } from 'react-native';
import SidebarMenu from './src/components/SidebarMenu';
import AssignClassScreen from './src/screens/AssignClassScreen';
import ScheduleScreen from './src/screens/ScheduleScreen';
import { COLORS } from './src/constants/theme';

// Importación de tus pantallas nuevas de inicio
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';

// Métodos de utilidades para el calendario
import {
  createClassEntry,
  createRecessEntry,
  updateScheduleEntry,
} from './src/utils/schedule';

// COMPONENTE PRINCIPAL INTEGRADO
export default function App() {
  return (
    <SafeAreaProvider>
      <TasksProvider>
        <MainAppContent />
      </TasksProvider>
    </SafeAreaProvider>
  );
}

// Subcomponente interno para manejar la lógica de estados junto con useTasks
function MainAppContent() {
  // Estado de navegación inicial: Arranca en la pantalla de Login
  const [currentScreen, setCurrentScreen] = useState('Login'); 
  
  // Tus estados originales de la app principal
  const [classes, setClasses] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Importamos el creador y actualizador de tareas
  const { addTask, updateTask } = useTasks(); 

  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  const goToSchedule = () => {
    setEditingItem(null);
    setCurrentScreen('schedule');
  };

  const goToAssign = (item = null) => {
    setEditingItem(item);
    setCurrentScreen('assign');
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

  const handleMenuItem = (itemId) => {
    closeDrawer();

    switch (itemId) {
      case 'clases':
        goToSchedule();
        break;
      case 'tareas':
        setCurrentScreen('tareas'); 
        break;
      case 'notificaciones':
        Alert.alert('Próximamente', 'Próximamente lo uniré a otras pantallas');
        break;
      case 'configuracion':
        Alert.alert('Próximamente', 'Próximamente lo uniré a otras pantallas');
        break;
      case 'cerrar':
        // Cierra sesión de forma segura mandando al usuario al login
        setCurrentScreen('Login');
        break;
      default:
        break;
    }
  };

  // Renderizado condicional integrado con Login y Registro
  const renderScreen = () => {
    if (currentScreen === 'Login') {
      return (
        <LoginScreen 
          onLoginSuccess={() => setCurrentScreen('schedule')} 
          onGoToRegister={() => setCurrentScreen('Register')} 
        />
      );
    }

    if (currentScreen === 'Register') {
      return (
        <RegisterScreen 
          onRegisterSuccess={() => setCurrentScreen('Login')} 
          onGoToLogin={() => setCurrentScreen('Login')} 
        />
      );
    }

    if (currentScreen === 'schedule') {
      return (
        <ScheduleScreen
          classes={classes}
          onMenuPress={openDrawer}
          onAssignPress={() => goToAssign()}
          onEditClass={(item) => goToAssign(item)}
          onDeleteClass={handleDeleteClass}
        />
      );
    }
    
    if (currentScreen === 'assign') {
      return (
        <AssignClassScreen
          editingItem={editingItem}
          onMenuPress={openDrawer}
          onCancel={goToSchedule}
          onSubmit={handleFormSubmit}
        />
      );
    }

    if (currentScreen === 'tareas') {
      return (
        <TaskListScreen 
          onMenuPress={openDrawer}
          onBack={goToSchedule}
          onAssignTaskPress={() => {
            setEditingItem(null);
            setCurrentScreen('assignTask');
          }} 
          onEditTaskPress={(task) => {
            setEditingItem(task);
            setCurrentScreen('assignTask');
          }}
        />
      );
    }

    if (currentScreen === 'assignTask') {
      return (
        <AssignTaskScreen
          onMenuPress={openDrawer}
          onCancel={() => {
            setEditingItem(null);
            setCurrentScreen('tareas');
          }} 
          taskToEdit={editingItem}
          onSubmit={(taskData) => {
            if (editingItem && editingItem.id) {
              if (updateTask) {
                updateTask({ ...taskData, id: editingItem.id });
              }
            } else {
              if (addTask) {
                addTask(taskData); 
              }
            }
            setEditingItem(null);
            setCurrentScreen('tareas'); 
          }}
        />
      );
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      
      {renderScreen()}

      {/* El menú lateral solo debe ser accesible si no se está en Login o Registro */}
      {currentScreen !== 'Login' && currentScreen !== 'Register' && (
        <SidebarMenu
          visible={drawerOpen}
          onClose={closeDrawer}
          onItemPress={handleMenuItem}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
