import { supabase } from './supabaseClient';

export async function restoreAuthSession() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    return null;
  }

  return data.session?.user ?? null;
}

export function subscribeToAuthChanges(callback) {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });

  return {
    unsubscribe: () => {
      data.subscription.unsubscribe();
    },
  };
}
