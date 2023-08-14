import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import WorkspaceTreeShaking from 'vite-plugin-workspace-tree-shaking';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), WorkspaceTreeShaking()],
})
