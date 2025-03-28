import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import sassDts from 'vite-plugin-sass-dts';

export default defineConfig({
  plugins: [react(), sassDts()],
  server: {
    host: true, // eller '0.0.0.0'
    port: 5173
  }
});
