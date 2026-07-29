/**
 * Pure-function unit tests — Node built-in test runner (node:test).
 * Run: npm test
 *
 * Strategy: load source files into a shared vm context so all globals are
 * available exactly as they are in the browser, without any module refactor.
 * Only browser APIs that the loaded files actually call at parse-time are
 * mocked; heavy DOM functions (toast, refAllBtns, etc.) are stubbed lazily.
 */
import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createContext, runInContext } from 'node:vm';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = name => readFileSync(resolve(__dirname, `../js/${name}.js`), 'utf8');

// ── Minimal browser-API stubs ─────────────────────────────────────────────────
const ctx = {
  localStorage: {
    _store: {},
    getItem(k)    { return this._store[k] ?? null; },
    setItem(k, v) { this._store[k] = v; },
    removeItem(k) { delete this._store[k]; },
    key(i)        { return Object.keys(this._store)[i] ?? null; },
    get length()  { return Object.keys(this._store).length; },
  },
  document: {
    getElementById: () => null,
    querySelector:  () => null,
    querySelectorAll: () => [],
    addEventListener: () => {},
  },
  navigator: { wakeLock: null },
  addEventListener: () => {},
  window:    {},
  console,
  setTimeout,
  clearTimeout,
};
ctx.window = ctx;
createContext(ctx);

// Load modules in dependency order (mirrors the <script> order in index.html)
['constants', 'game-utils', 'state', 'wakelock', 'persistence', 'ui-core', 'players'].forEach(m =>
  runInContext(src(m), ctx)
);

// Convenience: grab a value/function from the vm context's shared lexical scope
// (const/arrow functions don't land on ctx as own properties, but are
//  accessible via runInContext on the same contextified sandbox)
const fn   = name => runInContext(name, ctx);
const vctx = name => runInContext(name, ctx); // alias for readability when fetching objects

// ── Helper to reset state between tests ──────────────────────────────────────
function resetState(overrides = {}) {
  const s = vctx('state');
  Object.assign(s, {
    goals: 0, pts: 0, og: 0, op_: 0,
    pnames: {}, slotp: {}, evts: [],
    teamSize: 15, sport: 'hurling',
    rcarded: {}, ycarded: {}, bcarded: {},
    ubench: {}, suboff: {}, captain: null,
    maxB: 17,
    ...overrides,
  });
  for (let i = 1; i <= 15; i++) s.slotp[i] = i;
  runInContext('initialsCache = {}', ctx);
}

// ─────────────────────────────────────────────────────────────────────────────
describe('fmt — time formatter', () => {
  it('formats 0 seconds', () => assert.equal(fn('fmt')(0), '00:00'));
  it('formats 65 seconds', () => assert.equal(fn('fmt')(65), '01:05'));
  it('formats exactly 1 hour', () => assert.equal(fn('fmt')(3600), '60:00'));
  it('formats 90 minutes', () => assert.equal(fn('fmt')(5400), '90:00'));
});

describe('esc — HTML escaper', () => {
  it('escapes ampersand', () => assert.equal(fn('esc')('a&b'), 'a&amp;b'));
  it('escapes less-than', () => assert.equal(fn('esc')('<script>'), '&lt;script&gt;'));
  it('escapes double-quote', () => assert.equal(fn('esc')('"hi"'), '&quot;hi&quot;'));
  it('leaves safe strings untouched', () => assert.equal(fn('esc')('Seán O\'Brien'), 'Seán O\'Brien'));
  it('coerces non-strings', () => assert.equal(fn('esc')(42), '42'));
});

describe('pad — zero-padding', () => {
  it('pads single digit', () => assert.equal(fn('pad')(5), '05'));
  it('leaves two digits alone', () => assert.equal(fn('pad')(59), '59'));
  it('handles zero', () => assert.equal(fn('pad')(0), '00'));
});

describe('gn — player name lookup', () => {
  before(() => resetState());
  it('returns empty string for unknown slot', () => assert.equal(fn('gn')(99), ''));
  it('returns trimmed name when set', () => {
    vctx('state').pnames[3] = '  Ciarán  ';
    assert.equal(fn('gn')(3), 'Ciarán');
  });
});

describe('badgeCls — event badge CSS class', () => {
  const bc = () => fn('badgeCls');
  it('Goal → bg', () => assert.equal(bc()('Goal'), 'bg'));
  it('Point → bp', () => assert.equal(bc()('Point'), 'bp'));
  it('2 Point → bp', () => assert.equal(bc()('2 Point'), 'bp'));
  it('Wide → bw', () => assert.equal(bc()('Wide'), 'bw'));
  it('Red Card → br', () => assert.equal(bc()('Red Card'), 'br'));
  it('Yellow Card → by', () => assert.equal(bc()('Yellow Card'), 'by'));
  it('Black Card → bc', () => assert.equal(bc()('Black Card'), 'bc'));
  it('Turnover Won → bg', () => assert.equal(bc()('Turnover Won'), 'bg'));
  it('Turnover Lost → br', () => assert.equal(bc()('Turnover Lost'), 'br'));
  it('Free → bo (fallback)', () => assert.equal(bc()('Free'), 'bo'));
});

describe('computeInitials — clash-free initials', () => {
  before(() => {
    resetState();
    // Players 1+2 share first initial T but have different surnames → disambiguatable
    // Player 3 has Irish O' prefix
    // Player 4 is single-name
    vctx('state').pnames = { 1: 'Tom Murphy', 2: 'Tom Madden', 3: 'Seán O\'Brien', 4: 'Seán' };
  });

  it('single-name player returns first letter', () => {
    assert.equal(fn('computeInitials')(4, [1, 2, 3, 4]), 'S');
  });

  it('disambiguates players with same first initial but different surnames', () => {
    const all = [1, 2, 3, 4];
    const murphy = fn('computeInitials')(1, all); // Tom Murphy → TMU
    const madden = fn('computeInitials')(2, all); // Tom Madden → TMA
    assert.notEqual(murphy, madden);
    assert.match(murphy, /^TM/);
    assert.match(madden, /^TM/);
  });

  it('handles Irish O\' prefix in surname', () => {
    const result = fn('computeInitials')(3, [3]);
    assert.match(result, /^SO/);
  });
});

describe('playerScore — derives g-p from events', () => {
  before(() => {
    resetState();
    const s = vctx('state');
    s.slotp[7] = 7;
    s.evts = [
      { action: 'Goal',    slot: 7, time: '10:00', badge: 'G',  desc: '', cls: 'bg' },
      { action: 'Point',   slot: 7, time: '15:00', badge: 'P',  desc: '', cls: 'bp' },
      { action: 'Point',   slot: 7, time: '20:00', badge: 'P',  desc: '', cls: 'bp' },
      { action: '2 Point', slot: 7, time: '25:00', badge: '2P', desc: '', cls: 'bp' },
      { action: 'Point',   slot: 3, time: '12:00', badge: 'P',  desc: '', cls: 'bp' }, // different player
    ];
  });

  it('counts goals correctly', () => {
    assert.equal(fn('playerScore')(7).g, 1);
  });

  it('counts points (including 2-pointers) correctly', () => {
    assert.equal(fn('playerScore')(7).p, 4); // 1 + 1 + 2
  });

  it('ignores events belonging to other players', () => {
    assert.equal(fn('playerScore')(3).g, 0);
    assert.equal(fn('playerScore')(3).p, 1);
  });

  it('returns zeros for a player with no events', () => {
    const s = fn('playerScore')(99);
    assert.equal(s.g, 0);
    assert.equal(s.p, 0);
  });
});

describe('serializeState — only persisted keys are included', () => {
  before(() => {
    resetState();
    Object.assign(vctx('state'), { usN: 'Donaghmore', oppN: 'Ratoath' });
  });

  it('includes score fields', () => {
    const s = fn('serializeState')();
    assert.equal(s.goals, 0);
    assert.equal(s.usN, 'Donaghmore');
  });

  it('excludes session-only globals (undos, selSlot, etc.)', () => {
    const s = fn('serializeState')();
    assert.equal(s.undos,   undefined);
    assert.equal(s.selSlot, undefined);
    assert.equal(s.tRun,    undefined);
  });

  it('round-trips through JSON without loss for defined values', () => {
    const s1 = fn('serializeState')();
    const s2 = JSON.parse(JSON.stringify(s1));
    // undefined values are dropped by JSON; only compare keys that survived.
    // Compare via JSON: s1's objects come from the vm realm, so deepStrictEqual
    // would fail on the cross-realm Object.prototype despite identical values.
    for (const [k, v] of Object.entries(s2)) {
      assert.equal(JSON.stringify(s1[k]), JSON.stringify(v), `key "${k}" changed after round-trip`);
    }
  });
});

describe('computeTurnoverScores — score attribution within time window', () => {
  // fn() returns objects from the vm realm, whose Object.prototype differs
  // from this realm's — assert/strict's deepEqual checks prototype identity,
  // so compare structurally via JSON instead (same approach as the
  // serializeState round-trip test above).
  const cts = evts => fn('computeTurnoverScores')(evts, 'Ratoath');
  const assertScores = (r, expected) => assert.equal(JSON.stringify(r), JSON.stringify(expected));

  it('credits us when a score follows our turnover within 30s', () => {
    const r = cts([
      { action: 'Turnover Won', slot: 5, time: '10:00', desc: '' },
      { action: 'Point', slot: 7, time: '10:20', desc: '' },
    ]);
    assertScores(r, { usG: 0, usP: 1, oppG: 0, oppP: 0 });
  });

  it('credits opposition when a score follows our lost turnover within 30s', () => {
    const r = cts([
      { action: 'Turnover Lost', slot: 5, time: '10:00', desc: '' },
      { badge: 'OPP', action: 'Goal', time: '10:15', desc: 'Ratoath Goal added' },
    ]);
    assertScores(r, { usG: 0, usP: 0, oppG: 1, oppP: 0 });
  });

  it('does not credit a score outside the 30s window', () => {
    const r = cts([
      { action: 'Turnover Won', slot: 5, time: '10:00', desc: '' },
      { action: 'Point', slot: 7, time: '10:31', desc: '' },
    ]);
    assertScores(r, { usG: 0, usP: 0, oppG: 0, oppP: 0 });
  });

  it('does not credit a mismatched team (their turnover, our score)', () => {
    const r = cts([
      { action: 'Turnover Lost', slot: 5, time: '10:00', desc: '' },
      { action: 'Point', slot: 7, time: '10:10', desc: '' },
    ]);
    assertScores(r, { usG: 0, usP: 0, oppG: 0, oppP: 0 });
  });

  it('ignores wides — they do not consume or satisfy a pending turnover', () => {
    const r = cts([
      { action: 'Turnover Won', slot: 5, time: '10:00', desc: '' },
      { action: 'Wide', slot: 7, time: '10:05', desc: '' },
      { action: 'Point', slot: 7, time: '10:20', desc: '' },
    ]);
    assertScores(r, { usG: 0, usP: 1, oppG: 0, oppP: 0 });
  });

  it('only the most recent turnover can be credited — an earlier one is superseded', () => {
    const r = cts([
      { action: 'Turnover Won', slot: 5, time: '10:00', desc: '' },
      { action: 'Turnover Lost', slot: 6, time: '10:05', desc: '' },
      { action: 'Point', slot: 7, time: '10:15', desc: '' },
    ]);
    // The Turnover Lost at 10:05 is the most recent, but the Point is ours —
    // team mismatch, so nothing is credited even though the Turnover Won
    // (10:00) is also within 30s of the score.
    assertScores(r, { usG: 0, usP: 0, oppG: 0, oppP: 0 });
  });

  it('a score consumes the pending turnover so a later score needs its own', () => {
    const r = cts([
      { action: 'Turnover Won', slot: 5, time: '10:00', desc: '' },
      { action: 'Point', slot: 7, time: '10:10', desc: '' },
      { action: 'Point', slot: 7, time: '10:20', desc: '' },
    ]);
    assertScores(r, { usG: 0, usP: 1, oppG: 0, oppP: 0 });
  });

  it('handles half-time offset via 1H/2H badges', () => {
    const r = cts([
      { badge: '1H', time: '30:00', desc: 'First half ended' },
      { badge: '2H', time: '0:00', desc: 'Second half started' },
      { action: 'Turnover Won', slot: 5, time: '0:05', desc: '' },
      { action: 'Goal', slot: 7, time: '0:25', desc: '' },
    ]);
    assertScores(r, { usG: 1, usP: 0, oppG: 0, oppP: 0 });
  });

  it('counts 2-pointers as 2 points', () => {
    const r = cts([
      { action: 'Turnover Won', slot: 5, time: '10:00', desc: '' },
      { action: '2 Point', slot: 7, time: '10:10', desc: '' },
    ]);
    assertScores(r, { usG: 0, usP: 2, oppG: 0, oppP: 0 });
  });
});

describe('computeOppScoreBreakdown — opposition scoring split by type', () => {
  const cob = evts => fn('computeOppScoreBreakdown')(evts, 'Ratoath');

  it('counts a goal added via the score-adjust drawer', () => {
    const r = cob([{ badge: 'OPP', action: 'Goal', time: '10:00', desc: 'Ratoath: Goal added' }]);
    assert.equal(JSON.stringify(r), JSON.stringify({ goals: 1, twoPt: 0, pts: 0, wides: 0 }));
  });

  it('counts a point and a 2-pointer added separately', () => {
    const r = cob([
      { badge: 'OPP', action: 'Point',   time: '10:00', desc: 'Ratoath: Point added' },
      { badge: 'ADJ', action: '2 Point', side: 'opp', time: '10:05', desc: 'Ratoath: 2 Point added' },
    ]);
    assert.equal(JSON.stringify(r), JSON.stringify({ goals: 0, twoPt: 1, pts: 1, wides: 0 }));
  });

  it('counts an opposition wide', () => {
    const r = cob([{ badge: 'OPP', action: 'Wide', side: 'opp', time: '10:00', desc: 'Ratoath: Wide · From Play' }]);
    assert.equal(JSON.stringify(r), JSON.stringify({ goals: 0, twoPt: 0, pts: 0, wides: 1 }));
  });

  it('nets out a correction instead of double-counting', () => {
    const r = cob([
      { badge: 'OPP', action: 'Goal', time: '10:00', desc: 'Ratoath: Goal added' },
      { badge: 'OPP', side: 'opp',    time: '10:30', desc: 'Ratoath: Goal removed' }, // mis-tap correction
    ]);
    assert.equal(JSON.stringify(r), JSON.stringify({ goals: 0, twoPt: 0, pts: 0, wides: 0 }));
  });

  it('nets out a removed 2-pointer independently of points', () => {
    const r = cob([
      { badge: 'ADJ', action: '2 Point', side: 'opp', time: '10:00', desc: 'Ratoath: 2 Point added' },
      { badge: 'OPP', action: 'Point',                time: '10:05', desc: 'Ratoath: Point added' },
      { badge: 'ADJ', side: 'opp',                    time: '10:10', desc: 'Ratoath: 2 Point removed' },
    ]);
    assert.equal(JSON.stringify(r), JSON.stringify({ goals: 0, twoPt: 0, pts: 1, wides: 0 }));
  });

  it('ignores our own scores', () => {
    const r = cob([
      { action: 'Goal', slot: 7, time: '10:00', desc: '' },
      { action: 'Point', slot: 7, time: '10:05', desc: '' },
    ]);
    assert.equal(JSON.stringify(r), JSON.stringify({ goals: 0, twoPt: 0, pts: 0, wides: 0 }));
  });
});
