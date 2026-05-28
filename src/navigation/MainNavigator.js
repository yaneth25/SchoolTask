import { createRef, useMemo } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ScheduleScreen from '../screens/ScheduleScreen';
import Notificaciones from '../screens/Notificaciones';
import Configuracion from '../screens/Configuracion';
import TaskListScreen from '../screens/TaskListScreen';
import AssignClassScreen from '../screens/AssignClassScreen';
import AssignTaskScreen from '../screens/AssignTaskScreen';
import { useTheme } from '../context/ThemeContext';

const Stack = createStackNavigator();

export const navigationRef = createRef();

export default function MainNavigator({
  onMenuPress,
  onAssignPress,
  onEditClass,
  onDeleteClass,
  onAssignTaskPress,
  onEditTaskPress,
  editingItem,
  onCancelAssign,
  onSubmitClass,
  onCancelTask,
  onSubmitTask,
  onDeleteAccount,
  onLogout,
}) {
  const { colors } = useTheme();

  const navTheme = useMemo(
    () => ({
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        background: colors.background,
      },
    }),
    [colors.background],
  );

  return (
    <NavigationContainer ref={navigationRef} theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animationEnabled: true,
        }}
      >
        <Stack.Screen name="Clases">
          {(props) => (
            <ScheduleScreen
              {...props}
              onMenuPress={onMenuPress}
              onAssignPress={onAssignPress}
              onEditClass={onEditClass}
              onDeleteClass={onDeleteClass}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Notificaciones">
          {(props) => (
            <Notificaciones {...props} onMenuPress={onMenuPress} />
          )}
        </Stack.Screen>

        <Stack.Screen name="Configuracion">
          {(props) => (
            <Configuracion
              {...props}
              onMenuPress={onMenuPress}
              onDeleteAccount={onDeleteAccount}
              onLogout={onLogout}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Tareas">
          {(props) => (
            <TaskListScreen
              {...props}
              onMenuPress={onMenuPress}
              onAssignTaskPress={onAssignTaskPress}
              onEditTaskPress={onEditTaskPress}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="AsignarClase">
          {(props) => (
            <AssignClassScreen
              {...props}
              editingItem={editingItem}
              onMenuPress={onMenuPress}
              onCancel={onCancelAssign}
              onSubmit={onSubmitClass}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="AsignarTarea">
          {(props) => (
            <AssignTaskScreen
              {...props}
              taskToEdit={editingItem}
              onMenuPress={onMenuPress}
              onCancel={onCancelTask}
              onSubmit={onSubmitTask}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export function navigateToScreen(name) {
  if (!navigationRef.current?.isReady()) return;

  const current = navigationRef.current.getCurrentRoute()?.name;
  if (current === name) return;

  navigationRef.current.navigate(name);
}
