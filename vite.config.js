import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  base: "forms_atom",
  plugins: [vue()],
  build: {
    outDir: "forms_atom"
  }
})
