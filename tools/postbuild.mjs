#!/usr/bin/env node
/**
 * Runs after `vite build`:
 *  - removes local-only folders that Vite copied from public/ (uploads, data),
 *  - refuses to finish if the admin password is not configured,
 *  - lints every PHP file when PHP is available.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');

for (const dir of ['uploads', 'data']) {
  fs.rmSync(path.join(DIST, dir), { recursive: true, force: true });
}

const cfg = path.join(DIST, 'app', 'config.php');
if (!fs.existsSync(cfg)) {
  console.error('\n✖ dist/app/config.php is missing. Run: php tools/generate_hash.php "your-password"\n');
  process.exit(1);
}
const cfgText = fs.readFileSync(cfg, 'utf8');
if (/ADMIN_PASSWORD_HASH',\s*''/.test(cfgText)) {
  console.error('\n✖ The admin password is not set. Run: php tools/generate_hash.php "your-password"\n');
  process.exit(1);
}

const phpFiles = [];
const walk = (dir) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.php')) phpFiles.push(p);
  }
};
walk(DIST);
let php = true;
try {
  execFileSync('php', ['-v'], { stdio: 'ignore' });
} catch {
  php = false;
  console.warn('! PHP not found: skipping PHP syntax check.');
}
if (php) {
  for (const f of phpFiles) {
    try {
      execFileSync('php', ['-l', f], { stdio: 'pipe' });
    } catch (err) {
      console.error(`\n✖ PHP syntax error in ${path.relative(ROOT, f)}\n${err.stdout || err.message}`);
      process.exit(1);
    }
  }
  console.log(`✓ ${phpFiles.length} PHP files checked`);
}
console.log('✓ build ready in dist/');
