// vite.config.ts
import { defineConfig } from 'vite'

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../public',
    emptyOutDir: true
  },
  server: {
    open: false
  }
});
