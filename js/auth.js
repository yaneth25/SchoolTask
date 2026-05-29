/**
 * ============================================================================
 * AUTENTICACIÓN — registro, login, logout y tabla usuarios
 * ============================================================================
 *
 * ── CREAR TABLA "usuarios" EN SUPABASE ─────────────────────────────────────
 *
 * En el panel: SQL Editor → New query → ejecuta:
 *
 *   create table public.usuarios (
 *     id uuid primary key references auth.users (id) on delete cascade,
 *     created_at timestamptz default now() not null
 *   );
 *
 *   alter table public.usuarios enable row level security;
 *
 *   create policy "El usuario inserta su propia fila"
 *     on public.usuarios for insert
 *     with check (auth.uid() = id);
 *
 *   create policy "El usuario lee su propia fila"
 *     on public.usuarios for select
 *     using (auth.uid() = id);
 *
 * RECOMENDADO si activas "Confirm email" (el insert desde la app puede fallar
 * sin sesión). Crea el perfil automáticamente al registrarse en Auth:
 *
 *   create or replace function public.handle_new_user()
 *   returns trigger
 *   language plpgsql
 *   security definer set search_path = public
 *   as $$
 *   begin
 *     insert into public.usuarios (id) values (new.id)
 *     on conflict (id) do nothing;
 *     return new;
 *   end;
 *   $$;
 *
 *   create trigger on_auth_user_created
 *     after insert on auth.users
 *     for each row execute function public.handle_new_user();
 *
 * ── DESPUÉS DE CONFIGURAR ──────────────────────────────────────────────────
 *
 * 1. Proyecto Supabase creado
 * 2. URL y anon key en js/supabase.js
 * 3. Tabla usuarios + políticas RLS
 * 4. npx expo start
 * ============================================================================
 */

import { supabase } from './supabase';

/**
 * Traduce errores de Supabase a mensajes claros en español para Alert.
 */
export function formatAuthError(error) {
  if (!error?.message) {
    return 'Ocurrió un error inesperado. Inténtalo de nuevo.';
  }

  const msg = error.message.toLowerCase();

  if (msg.includes('invalid login credentials')) {
    return 'Correo o contraseña incorrectos.';
  }
  if (msg.includes('user already registered')) {
    return 'Este correo ya está registrado. Inicia sesión o usa otro correo.';
  }
  if (msg.includes('email not confirmed')) {
    return 'Debes confirmar tu correo antes de iniciar sesión. Revisa tu bandeja de entrada.';
  }
  if (msg.includes('password') && msg.includes('6')) {
    return 'La contraseña debe tener al menos 6 caracteres.';
  }
  if (msg.includes('invalid email')) {
    return 'El correo electrónico no es válido.';
  }
  if (msg.includes('signup is disabled')) {
    return 'El registro está desactivado en el servidor. Contacta al administrador.';
  }
  if (msg.includes('failed to fetch') || msg.includes('network')) {
    return 'Sin conexión o URL de Supabase incorrecta. Revisa js/supabase.js y tu internet.';
  }

  return error.message;
}

/**
 * Inserta una fila en public.usuarios con el id del usuario de Auth.
 */
async function insertUsuarioProfile(userId) {
  const { error } = await supabase.from('usuarios').insert([{ id: userId }]);

  if (error) {
    // Código 23505 = fila duplicada (el usuario ya existía)
    if (error.code === '23505') {
      return { ok: true };
    }
    return { ok: false, error };
  }
  return { ok: true };
}

/** Asegura fila en usuarios tras login (útil si el registro requirió confirmar email). */
async function ensureUsuarioProfile(userId) {
  const { data, error: selectError } = await supabase
    .from('usuarios')
    .select('id')
    .eq('id', userId)
    .maybeSingle();

  if (selectError) {
    return { ok: false, error: selectError };
  }
  if (data) {
    return { ok: true };
  }
  return insertUsuarioProfile(userId);
}

/**
 * Registro: signUp + fila en tabla usuarios.
 *
 * @param {{ email: string, password: string }} params
 */
export async function registerUser({ email, password }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { success: false, message: formatAuthError(error) };
  }

  const user = data.user;
  if (!user) {
    return {
      success: false,
      message: 'No se pudo crear la cuenta. Revisa la configuración de Supabase.',
    };
  }

  const needsEmailConfirmation = !data.session;

  if (data.session) {
    const profile = await insertUsuarioProfile(user.id);
    if (!profile.ok) {
      return {
        success: false,
        message:
          formatAuthError(profile.error) ||
          'Cuenta creada pero falló guardar el perfil. Revisa la tabla usuarios, RLS o el trigger en auth.js.',
      };
    }
  }

  return {
    success: true,
    needsEmailConfirmation,
    message: needsEmailConfirmation
      ? 'Cuenta creada. Revisa tu correo para confirmar la cuenta y luego inicia sesión.'
      : '¡Registro exitoso! Ya puedes iniciar sesión.',
  };
}

/**
 * Login con correo y contraseña.
 */
export async function loginUser({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, message: formatAuthError(error) };
  }

  if (!data.user) {
    return { success: false, message: 'No se pudo iniciar sesión.' };
  }

  const profile = await ensureUsuarioProfile(data.user.id);
  if (!profile.ok) {
    return {
      success: false,
      message:
        formatAuthError(profile.error) ||
        'Sesión iniciada pero no se pudo sincronizar el perfil en la tabla usuarios.',
    };
  }

  return { success: true, message: 'Sesión iniciada correctamente.' };
}

/**
 * Cierra sesión en Supabase y borra el token local.
 */
export async function logoutUser() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { success: false, message: formatAuthError(error) };
  }

  return { success: true };
}
