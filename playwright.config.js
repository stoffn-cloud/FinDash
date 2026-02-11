import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    // Verander 5173 naar 3000 voor Next.js
    baseURL: 'http://localhost:3000',
  },
});
