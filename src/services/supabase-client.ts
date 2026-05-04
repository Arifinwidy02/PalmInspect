import { getURL } from '@/utils/helpers';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function uploadImageToStorage(
  file: File,
  projectId: string
): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'jpg';
  const path = `projects/${projectId}/image.${ext}`;

  const { error } = await supabase.storage
    .from('drone-images')
    .upload(path, file, { upsert: true });

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from('drone-images')
    .getPublicUrl(path);

  return urlData.publicUrl;
}

export async function signInWithEmail(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signUpWithEmail(email: string, password: string, name: string) {
  return supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });
}

export async function signInWithGoogle() {
  const redirectTo = `${getURL()}/auth/callback`;
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo },
  });
}

export async function signOut() {
  return supabase.auth.signOut();
}
