import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/': new URL('./src/', import.meta.url).pathname,
    },
  },
  define: {
    'process.env': {},
  },
});
