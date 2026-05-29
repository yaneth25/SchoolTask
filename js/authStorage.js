/**
 * Almacenamiento de sesión para Supabase Auth.
 * - Android/iOS: AsyncStorage (módulo nativo de Expo)
 * - Web: localStorage (AsyncStorage no tiene módulo nativo en el navegador)
 */
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const webAuthStorage = {
  getItem: (key) => Promise.resolve(globalThis.localStorage?.getItem(key) ?? null),
  setItem: (key, value) => {
    globalThis.localStorage?.setItem(key, value);
    return Promise.resolve();
  },
  removeItem: (key) => {
    globalThis.localStorage?.removeItem(key);
    return Promise.resolve();
  },
};

export const authStorage = Platform.OS === 'web' ? webAuthStorage : AsyncStorage;
