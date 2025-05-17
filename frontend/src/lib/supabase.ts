import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface UserSettings {
  id?: string;
  user_id?: string;
  logo_url?: string;
  primary_color: string;
  secondary_color: string;
  font_family: string;
  created_at?: string;
  updated_at?: string;
}

export const defaultUserSettings: UserSettings = {
  primary_color: '#3498db',
  secondary_color: '#2ecc71',
  font_family: 'Arial',
};

export async function getUserSettings(userId: string): Promise<UserSettings> {
  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching user settings:', error);
    return defaultUserSettings;
  }

  return data || defaultUserSettings;
}

export async function saveUserSettings(settings: UserSettings): Promise<void> {
  const { error } = await supabase
    .from('user_settings')
    .upsert(settings, { onConflict: 'user_id' });

  if (error) {
    console.error('Error saving user settings:', error);
    throw error;
  }
}
