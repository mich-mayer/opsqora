import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/opsqora/',
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        caseStudy: 'case-study.html',
      },
    },
  },
})
