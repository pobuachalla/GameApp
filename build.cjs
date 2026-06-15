#!/usr/bin/env node
// Concatenates all JS source files into js/bundle.js.
// Run with: node build.js
// Commit js/bundle.js so it is served without a separate build step.

'use strict';
const fs   = require('fs');
const path = require('path');

const FILES = [
  'clubs.js','age-grade.js','pitch-svg.js','constants.js','state.js','wakelock.js',
  'persistence.js','ui-core.js','modal.js','timer.js','events.js',
  'scoring.js','players.js','ai-config.js','share.js','settings.js',
  'layout.js','game-utils.js','stats.js','print.js','transfer.js',
  'gk.js','osc.js','sideline.js','app.js',
];

const parts = FILES.map(f => {
  const src = fs.readFileSync(path.join(__dirname, 'js', f), 'utf8');
  return `/* ── ${f} ── */\n${src}`;
});

const bundle = parts.join('\n');
const out = path.join(__dirname, 'js', 'bundle.js');
fs.writeFileSync(out, bundle);

const kb = (bundle.length / 1024).toFixed(1);
console.log(`bundle.js written — ${kb} KB unminified (${FILES.length} files)`);

// ── Service-worker cache version ──────────────────────────────────────────────
// Deterministic content hash over everything the SW precaches, so the cache
// name changes exactly when a cached asset changes. CI runs this before
// deploy; commit the updated sw.js when it shows as modified locally.
const crypto = require('crypto');
const swPath = path.join(__dirname, 'sw.js');
let sw = fs.readFileSync(swPath, 'utf8');
const shellFiles = [...(sw.match(/^\s*'\/([^']*)',\s*$/gm) || [])]
  .map(l => l.trim().replace(/^'\/?|',$/g, ''))
  .map(f => f === '' ? 'index.html' : f);
const hash = crypto.createHash('sha256');
for (const f of [...new Set(shellFiles)]) {
  const p = path.join(__dirname, f);
  if (fs.existsSync(p)) hash.update(f).update(fs.readFileSync(p));
}
const ver = hash.digest('hex').slice(0, 10);
const next = sw.replace(/const CACHE = 'gaa-tracker-[^']*';/, `const CACHE = 'gaa-tracker-${ver}';`);
if (next !== sw) {
  fs.writeFileSync(swPath, next);
  console.log(`sw.js cache version → gaa-tracker-${ver}`);
}
