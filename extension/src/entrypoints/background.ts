import { supabase } from '../lib/supabaseClient';

export default defineBackground(() => {
  // When the user clicks the magic link in their email, Supabase redirects them
  // to the callback URL with the session tokens in the URL fragment (#access_token=...).
  // This listener intercepts that tab, extracts the tokens, sets the session on the
  // Supabase client (which persists it to chrome.storage.local), then closes the tab.
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status !== 'complete') return;
    const url = tab.url ?? '';
    const isExtensionCallback = url.startsWith(`chrome-extension://${chrome.runtime.id}/`);
    const isAuthCallback = url.includes('access_token=');
    if (!isExtensionCallback || !isAuthCallback) return;

    const fragment = url.split('#')[1] ?? '';
    const params = new URLSearchParams(fragment);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');

    if (!accessToken || !refreshToken) return;

    supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
      .then(() => chrome.tabs.remove(tabId))
      .catch(console.error);
  });
});
