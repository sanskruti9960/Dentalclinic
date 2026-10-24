import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const docsDir = path.resolve(rootDir, 'docs');

const distIndex = path.join(distDir, 'index.html');
const dist404 = path.join(distDir, '404.html');

if (fs.existsSync(distIndex)) {
  // 1. Create 404.html in dist for GitHub Pages SPA client routing
  fs.copyFileSync(distIndex, dist404);
  fs.writeFileSync(path.join(distDir, '.nojekyll'), '');
  console.log('✓ Created dist/404.html and dist/.nojekyll');

  // 2. Sync to docs/ folder (for users who choose Settings -> Pages -> /docs)
  fs.rmSync(docsDir, { recursive: true, force: true });
  fs.cpSync(distDir, docsDir, { recursive: true });
  console.log('✓ Synced compiled build to docs/ folder for GitHub Pages');

  // 3. Sync to root directory (for users who choose Settings -> Pages -> / (root))
  fs.copyFileSync(distIndex, path.join(rootDir, 'index.html'));
  fs.copyFileSync(distIndex, path.join(rootDir, '404.html'));
  fs.writeFileSync(path.join(rootDir, '.nojekyll'), '');

  // Copy dist/assets to root assets/
  const rootAssetsDir = path.join(rootDir, 'assets');
  fs.rmSync(rootAssetsDir, { recursive: true, force: true });
  if (fs.existsSync(path.join(distDir, 'assets'))) {
    fs.cpSync(path.join(distDir, 'assets'), rootAssetsDir, { recursive: true });
  }
  console.log('✓ Synced compiled bundle to root index.html and root assets/ for GitHub Pages root deployment');
}
process.exit(0);
