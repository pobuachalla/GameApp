/**
 * Pure-function unit tests for crest resolution — Node built-in test runner (node:test).
 * Run: npm test
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createContext, runInContext } from 'node:vm';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = name => readFileSync(resolve(__dirname, `../js/${name}.js`), 'utf8');

const ctx = { console };
ctx.window = ctx;
createContext(ctx);
runInContext(src('clubs'), ctx);

const fn = name => runInContext(name, ctx);

describe('resolveCrest — club vs county disambiguation', () => {
  it('picks the county crest when a Meath club name is only a substring match (Antrim, not Trim)', () => {
    assert.equal(fn('resolveCrest')('Antrim'), 'crests/antrim.png');
  });
  it('still picks the club crest on an exact club name match', () => {
    assert.equal(fn('resolveCrest')('Trim'), 'crests/trim.png');
  });
  it('picks the county crest when no club matches', () => {
    assert.equal(fn('resolveCrest')('Down'), 'crests/down.png');
  });
  it('picks the club crest when the club name is the longer/better match', () => {
    assert.equal(fn('resolveCrest')('Meath Hill'), 'crests/meath_hill.jpeg');
  });
  it('returns null when nothing matches', () => {
    assert.equal(fn('resolveCrest')('Nonexistent Team'), null);
  });
});
