import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    // Definir variables de entorno por defecto
    'import.meta.env.VITE_API_URL': JSON.stringify(
      'https://dev.intelnexo.com/dialer-api/v1'
    ),
    'import.meta.env.VITE_API_URL_V2': JSON.stringify(
      'https://dev.intelnexo.com/dialer-api/v2'
    ),
  },
});
