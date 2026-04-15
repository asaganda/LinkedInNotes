import { defineConfig } from 'wxt';

export default defineConfig({
  srcDir: 'src',
  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'LinkedIn Notes',
    description: 'View and manage notes about your LinkedIn connections directly on LinkedIn.',
    version: '1.0.0',
    permissions: ['activeTab', 'storage', 'tabs'],
  },
});
