/**
 * ============================================================================
 * CONFIGURACIÓN DE SUPABASE — SchoolTask
 * ============================================================================
 *
 * Este proyecto es una app Expo/React Native. Los formularios de login y
 * registro están en src/screens/LoginScreen.js y RegisterScreen.js.
 * La lógica de autenticación importa este archivo.
 *
 * ── PASOS EN SUPABASE (hazlo una sola vez) ─────────────────────────────────
 *
 * 1. Entra en https://supabase.com y crea un proyecto nuevo.
 * 2. Ve a: Project Settings → API
 * 3. Copia:
 *    • Project URL        → pégala en SUPABASE_URL (abajo)
 *    • anon public key    → pégala en SUPABASE_ANON_KEY (abajo)
 *      (usa la clave "anon", NUNCA la "service_role" en la app)
 *
 * 4. Authentication → Providers → Email: deja "Email" activado.
 *    • Si activas "Confirm email", el usuario debe confirmar el correo
 *      antes de poder iniciar sesión (verás un mensaje en el registro).
 *
 * 5. Crea la tabla "usuarios" en SQL Editor (ver comentarios en js/auth.js).
 *
 * ── CÓMO EJECUTAR LA APP ───────────────────────────────────────────────────
 *
 * NO abras el proyecto con doble clic en archivos sueltos.
 * Usa el servidor de desarrollo de Expo:
 *
 *   npm install
 *   npx expo start
 *
 * Luego escanea el QR (Expo Go) o pulsa w (web) / a (Android) / i (iOS).
 *
 * Para una web estática HTML aparte, usarías live-server; esta app usa Expo.
 * ============================================================================
 */

import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { authStorage } from './authStorage';

// ▼▼▼ PEGA AQUÍ TU Project URL de Supabase → Settings → API ▼▼▼
const SUPABASE_URL = 'https://hqihqryelriphuhujhef.supabase.co';

// ▼▼▼ PEGA AQUÍ tu anon public key de Supabase → Settings → API ▼▼▼
const SUPABASE_ANON_KEY = 'sb_publishable_KQz9-rKrir3IE0VR_ekpxg_z1uAMy90';

/**
 * Cliente único de Supabase para toda la app.
 * authStorage guarda la sesión (AsyncStorage en móvil, localStorage en web).
 */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: authStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
