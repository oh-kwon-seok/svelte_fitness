import { sveltekit } from '@sveltejs/kit/vite';
import  { defineConfig } from 'vite';
import removeConsole from "vite-plugin-remove-console";

export default defineConfig({
	plugins: [sveltekit(),removeConsole()],
  
	server: {
		port : 3000,
	  proxy: {
		'/api': {
		  target: 'http://jangan.godsun.co.kr:8081',
		  changeOrigin: true,
		  rewrite: (path) => path.replace(/^\/api/, ''),
		},
	  },
	},
	preview: {
		port: 3000, // 모바일 포트
	},
  });