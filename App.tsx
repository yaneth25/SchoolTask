import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { TaskProvider } from './src/context/TaskContext';
import type { RootStackParamList } from './src/navigation/types';
import { AddTaskScreen } from './src/screens/AddTaskScreen';
import { TaskListScreen } from './src/screens/TaskListScreen';
import { colors } from './src/theme';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <TaskProvider>
        <NavigationContainer>
          <StatusBar style="dark" />
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.background },
              animation: 'slide_from_right',
            }}
          >
            <Stack.Screen name="TaskList" component={TaskListScreen} />
            <Stack.Screen name="AddTask" component={AddTaskScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </TaskProvider>
    </SafeAreaProvider>
  );
}
