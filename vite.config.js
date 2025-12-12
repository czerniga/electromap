import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Use default esbuild minify to avoid optional terser dependency issues
    minify: 'esbuild'
  }
})
