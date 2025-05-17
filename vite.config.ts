import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {}
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/styles/abstracts/variables"; @import "./src/styles/abstracts/mixins";`
      }
    }
  }
});