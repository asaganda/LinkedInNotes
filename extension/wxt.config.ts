import { defineConfig } from 'wxt';

export default defineConfig({
  srcDir: 'src',
  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'Conntext',
    description: 'Private notes on any LinkedIn profile. See your context the moment you land on a page — no tab switching, no friction.',
    version: '1.1.0',
    permissions: ['activeTab', 'storage', 'tabs'],
    host_permissions: ['https://www.linkedin.com/*', 'https://*.supabase.co/*'],
  },
});
