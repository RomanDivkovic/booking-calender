import { supabase } from '../../lib/supabase';

// 🔥 Registrering
export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

// 🔥 Inloggning
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) throw error;
  return data;
}

// 🔥 Utloggning
export async function signOut() {
  await supabase.auth.signOut();
}
