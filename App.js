import { useCallback, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Graduate_400Regular } from '@expo-google-fonts/graduate';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';

SplashScreen.preventAutoHideAsync().catch(() => {});

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Graduate_400Regular,
  });

  useEffect(() => {
    async function hide() {
      if (fontsLoaded || fontError) {
        await SplashScreen.hideAsync();
      }
    }
    hide();
  }, [fontsLoaded, fontError]);

  const fallback = useCallback(() => {
    return <View style={styles.fallback} />;
  }, []);

  if (!fontsLoaded && !fontError) {
    return fallback();
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            contentStyle: { backgroundColor: '#FFFFFF' },
          }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  fallback: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
