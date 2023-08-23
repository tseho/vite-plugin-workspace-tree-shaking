import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import WorkspaceTreeShaking from 'vite-plugin-workspace-tree-shaking';
import {tsxParser} from 'vite-plugin-workspace-tree-shaking-tsx'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    WorkspaceTreeShaking({
      tsxParser: tsxParser,
    })
  ],
})
