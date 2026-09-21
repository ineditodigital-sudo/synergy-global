#!/usr/bin/env node
/**
 * Writes public/app/seed-content.json from src/content/defaults.js.
 * The server uses it only when it has no published content yet (first
 * deploy of this version); after that, the CMS content is the source of truth.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { normalizeContent } from '../src/content/normalize.js';
import { DEFAULT_CONTENT } from '../src/content/defaults.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(ROOT, 'public', 'app', 'seed-content.json');
const seed = normalizeContent(DEFAULT_CONTENT);
seed._meta = { schema: seed._meta.schema, version: 0, updatedAt: '' };
fs.writeFileSync(out, JSON.stringify(seed, null, 2) + '\n');
console.log(`seed content written: ${path.relative(ROOT, out)} (${(fs.statSync(out).size / 1024).toFixed(1)} KB)`);
