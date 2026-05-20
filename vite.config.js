import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // GitHub Pages base path for https://github.com/ItzGazz-IT/2026worldcup
  base: '/2026worldcup/',
})
