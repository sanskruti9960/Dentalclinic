import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const docsDir = path.resolve(rootDir, 'docs');

// Create 404.html in dist for GitHub Pages SPA fallback
const distIndex = path.join(distDir, 'index.html');
const dist404 = path.join(distDir, '404.html');

if (fs.existsSync(distIndex)) {
  fs.copyFileSync(distIndex, dist404);
  console.log('✓ Created dist/404.html for GitHub Pages routing');

  // Also sync to docs/ folder so user can deploy via "Deploy from a branch -> /docs"
  fs.rmSync(docsDir, { recursive: true, force: true });
  fs.cpSync(distDir, docsDir, { recursive: true });
  console.log('✓ Synced compiled build to docs/ folder for GitHub Pages');
}
process.exit(0);

