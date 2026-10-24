import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';

const htmlEntryPlugin: Plugin = {
  name: 'html-entry-resolver',
  transformIndexHtml: {
    order: 'pre',
    handler(html) {
      let transformed = html;
      if (!transformed.includes('src="/src/main.tsx"')) {
        transformed = transformed.replace(
          /<script type="module" crossorigin src=".*?"><\/script>/,
          '<script type="module" src="/src/main.tsx"></script>'
        );
        transformed = transformed.replace(
          /<link rel="stylesheet" crossorigin href=".*?">/,
          ''
        );
      }
      return transformed;
    },
  },
};

export default defineConfig(() => {
  return {
    base: './',
    plugins: [htmlEntryPlugin, react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname || process.cwd(), './src'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
