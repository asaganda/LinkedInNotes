import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Chrome extension storage adapter — persists the Supabase session in
// chrome.storage.local instead of localStorage, which is not available in
// content script / shadow DOM contexts.
const chromeStorageAdapter = {
  getItem: (key: string): Promise<string | null> =>
    new Promise((resolve) =>
      chrome.storage.local.get(key, (result) => resolve(result[key] ?? null))
    ),
  setItem: (key: string, value: string): Promise<void> =>
    new Promise((resolve) =>
      chrome.storage.local.set({ [key]: value }, resolve)
    ),
  removeItem: (key: string): Promise<void> =>
    new Promise((resolve) =>
      chrome.storage.local.remove(key, resolve)
    ),
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
    storage: chromeStorageAdapter,
  },
});
