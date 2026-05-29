/**
 * ============================================================================
 * SESIÓN DE USUARIO — SchoolTask
 * ============================================================================
 *
 * Equivalente a “proteger index.html” en una web estática:
 * aquí comprobamos si hay usuario autenticado antes de mostrar la app.
 *
 * Usado desde App.js al arrancar y al cambiar el estado de auth.
 * ============================================================================
 */

import { supabase } from './supabase';

/**
 * Devuelve el usuario actual según el token guardado en el dispositivo.
 * Usa supabase.auth.getUser() (valida el JWT con el servidor).
 *
 * @returns {Promise<import('@supabase/supabase-js').User | null>}
 */
export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    return null;
  }
  return user ?? null;
}

/**
 * Al abrir la app: lee la sesión persistida y devuelve el usuario si sigue válido.
 * App.js usa esto para ir directo a la pantalla principal sin volver a login.
 */
export async function restoreAuthSession() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.user) {
    return session.user;
  }
  return getCurrentUser();
}

/**
 * Escucha inicios/cierres de sesión (login, logout, token renovado).
 *
 * @param {(user: import('@supabase/supabase-js').User | null) => void} onUserChange
 * @returns {{ unsubscribe: () => void }}
 */
export function subscribeToAuthChanges(onUserChange) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    onUserChange(session?.user ?? null);
  });

  return {
    unsubscribe: () => subscription.unsubscribe(),
  };
}

/**
 * Comprueba si hay sesión activa. Si no, devuelve false.
 * (En web redirigirías a login.html; aquí App.js muestra LoginScreen.)
 */
export async function hasActiveSession() {
  const user = await getCurrentUser();
  return Boolean(user);
}
