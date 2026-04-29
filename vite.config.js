import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages部署：仓库名作为base路径
// 如果仓库名是 taro，则 base: '/taro/'
// 如果使用自定义域名，则 base: '/'
const repoName = 'taro'; // 修改为你的GitHub仓库名

export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_PAGES ? `/${repoName}/` : '/',
  server: {
    host: true,
    port: 5173
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
});
