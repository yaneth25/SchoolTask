import {
  isSupabaseConfigured,
  supabase,
  SUPABASE_CONFIG_MESSAGE,
} from './supabaseClient';

function mapAuthError(error) {
  const message = error?.message ?? 'Ocurrió un error inesperado.';

  if (message.includes('Invalid login credentials')) {
    return 'Correo o contraseña incorrectos.';
  }
  if (message.includes('Email not confirmed')) {
    return 'Confirma tu correo antes de iniciar sesión.';
  }
  if (message.includes('User already registered')) {
    return 'Ya existe una cuenta con ese correo.';
  }
  if (message.includes('Password should be at least')) {
    return 'La contraseña debe tener al menos 6 caracteres.';
  }
  if (message.includes('Unable to validate email address')) {
    return 'Introduce un correo electrónico válido.';
  }

  return message;
}

export async function loginUser({ email, password }) {
  if (!isSupabaseConfigured()) {
    return { success: false, message: SUPABASE_CONFIG_MESSAGE };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, message: mapAuthError(error) };
  }

  return { success: true, user: data.user };
}

export async function registerUser({ email, password }) {
  if (!isSupabaseConfigured()) {
    return { success: false, message: SUPABASE_CONFIG_MESSAGE };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { success: false, message: mapAuthError(error) };
  }

  if (data.user && !data.session) {
    return {
      success: true,
      message: 'Revisa tu correo para confirmar la cuenta antes de iniciar sesión.',
      user: data.user,
    };
  }

  return {
    success: true,
    message: 'Cuenta creada. Ya puedes iniciar sesión.',
    user: data.user,
  };
}

export async function logoutUser() {
  if (!isSupabaseConfigured()) {
    return { success: false, message: SUPABASE_CONFIG_MESSAGE };
  }

  const { error } = await supabase.auth.signOut();

  if (error) {
    return { success: false, message: mapAuthError(error) };
  }

  return { success: true };
}
