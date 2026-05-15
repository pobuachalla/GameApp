#!/usr/bin/env node
// Concatenates all JS source files into js/bundle.js.
// Run with: node build.js
// Commit js/bundle.js so it is served without a separate build step.

'use strict';
const fs   = require('fs');
const path = require('path');

const FILES = [
  'clubs.js','pitch-svg.js','constants.js','state.js','wakelock.js',
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
