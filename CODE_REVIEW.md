# GameApp Code Review

*Full-codebase review — June 2026. Covers `js/` modules, all HTML pages and their inline scripts, the service worker/PWA setup, and the test suites. Every finding below was verified against the source; file:line references point at the relevant code.*

## Verdict

For a hand-rolled vanilla-JS PWA this is well above average: a single state object with disciplined setter helpers, an explicit match-phase state machine, wall-clock-anchored timing, a real escaping strategy (`esc()` + the `html` tagged template, enforced by a custom ESLint rule), and a genuinely substantial Selenium suite (~160 tests). The problems cluster around three structural seams rather than sloppy code:

1. **The undo stack assumes a 1:1 pairing with the event log that nothing enforces** — three code paths already violate it.
2. **Event schema drift on `evts[].badge`** — the live tracker, entry.html, and merge.html each assume a different meaning, which silently breaks two whole features.
3. **Copy-paste divergence** — five standalone pages re-implement helpers that exist in `js/`, and the copies have measurably drifted (five different `esc()` implementations, two club directories, duplicated stats/print/AI render paths).

---

## High severity

### H1. Undo stack desyncs permanently after a sideline card
`js/sideline.js:32-36` calls `addRow()` (pushes to `state.evts` + DOM) but never `pushUndo()`. `undoLast()` (`js/events.js:28-41`) pops `undos` and then *unconditionally* pops `state.evts` and removes the last DOM row. After logging a sideline card, the next Undo reverts the previous operation's side effects (e.g. decrements a goal) while deleting the *sideline* row — the goal stays in the log while the scoreboard drops, and the offset persists for every subsequent undo.

**Mirror-image bug:** `execPreGameSub` (`js/players.js:641-655`) calls `pushUndo` *without* `addRow`. Since position swaps do log a 'POS' row pre-match, a swap → pre-game sub → Undo sequence pops the swap's event row while reverting the sub.

**Fix:** make undo entries carry `hasEvent: bool` and have `undoLast` pop `evts`/DOM only when set; then pair `sidelineAction` with a `pushUndo(desc, () => state.sidelineCards.pop())`.

### H2. Black-card sin-bin countdown breaks across half-time
`logEv` stores `state.bcardedAt[pi] = state.secs` (`js/players.js:449`), but the second-half transition resets `state.secs = 0` (`js/timer.js:77`). Remaining time is computed as `(bcardedAt + 600) - state.secs` (`js/players.js:16`, `js/ui-core.js:186,201`), so a black card issued at 25:00 in H1 shows ~35:00 remaining once H2 starts and the player can never legitimately return.
**Fix:** rebase `bcardedAt[pi] -= htSecs` (clamped at 0) on the HALF_TIME → RUNNING_SECOND_HALF transition, or track expiry in cumulative match time.

### H3. "2 Point removed" only decrements 1 point in every stats recomputation
`applyScoreBadge` (`js/game-utils.js:36,44`) has `'2 Point added'` branches but no `'2 Point removed'` counterpart — the `'Point removed'` substring check matches it and subtracts 1 instead of 2. Every consumer that replays events (timeline and sub table in `js/stats.js:16,93`, print report `js/print.js:16,551`) shows scores one point too high after a football 2-point correction.
**Fix:** add `'2 Point removed'` branches ahead of the `'Point removed'` checks in both the OPP and ADJ arms.

### H4. entry.html exports are invisible to Match Review (badge schema mismatch)
`entry.html:846-855,917-934` writes `badge: ev.half` (`'1H'`/`'2H'`/`'ET'`) on **every** event, but in the live-tracker format those badges are reserved for half *marker* events: `review.html:265-266` does `if(ev.badge==='1H'){...; return;}`, so every event from an entry.html export is treated as a structural marker and skipped — no scorers, no timeline, no cards, no per-player stats, despite the page promising "exports the same JSON format as the live tracker". `merge.html`'s `STRUCTURAL = ['1H','2H','END']` likewise discards them all. entry.html also exports `matchState:'final'` and card/bench maps as arrays where the live schema uses objects (`entry.html:937-960` vs `js/state.js:4-29`), and the "Final Score (us)" inputs are collected but never used in the export.
**Fix:** set `badge` to the half only on dedicated marker events (or to player initials like the live app), emit `MM:SS` times, and align field shapes with `state.js`.

### H5. merge.html's core feature doesn't work (wrong badge schema) and it has zero HTML escaping
Two independent high-severity problems in the same page:

- **Merge logic** (`merge.html:528-539,633-655`): real exports use player *initials* as `badge` (verified against `gaa-st--peter-s-dunboyne-2026-04-29.json` and `js/players.js:458`), but merge.html assumes type codes. `findBestMatch` requires `c.badge === ev.badge`, so the advertised "two coaches attributed the same goal to different players" case never matches — both copies are kept as "unique" events and conflict resolution never fires. The score recalculation checks `ev.badge === 'G'`/`'P'`, which matches no real event, so merged-in scores never adjust the header score.
- **XSS** (`merge.html:420-428,484-499,747-765,810-824`): the page contains no `esc()` helper at all and injects file names, team names, event descriptions, and player names from imported JSON straight into `innerHTML`. A crafted match file (`pnames: {"5": "<img src=x onerror=...>"}`) executes script when the conflict UI renders. The inline `onclick="removeFile('...')"` escapes only single quotes, so `"` in a filename breaks out of the attribute too.

**Fix:** match on `ev.action` (`'Goal'`, `'Point'`, `'2 Point'`…) and treat `badge` as display-only; add the standard `esc()` and apply it to every interpolated value; replace inline `onclick` with delegated listeners.

### H6. Wake lock is never re-acquired after the OS releases it
When the screen sleeps or the app backgrounds, the browser releases the wake lock, but `wakeLock` (`js/wakelock.js:4`) still holds the released object — `reacquireWakeLock()` bails on `if (!tRun || wakeLock) return;` (`js/wakelock.js:19`) and never re-acquires. After the first screen sleep mid-match, keep-awake is silently dead for the rest of the game — the exact scenario the module exists for.
**Fix:** in `acquireWakeLock()`, add `wakeLock.addEventListener('release', () => { wakeLock = null; })`.

### H7. Service worker precaches 3 of 10 pages and depends on a gitignored file
`sw.js:6-16` caches `/`, `review.html`, `season.html`, CSS, `js/bundle.js`, manifest, and icons. Missing: `home.html` (the hub), `index.html` as a literal path (home links `href="index.html"`, which won't match the cached `/`), `quick.html`, `entry.html`, `roster.html`, `merge.html`, the scripts review/season actually load (`js/constants.js`, `js/game-utils.js`, `js/pitch-svg.js`), and runtime data (`roster.json`, `meath_gaa_directory.json`, `crests/*`). Offline, most of the app 404s. Worse: `js/bundle.js` is gitignored and only produced by `build.cjs`, and `cache.addAll` is all-or-nothing — on any non-built deploy the SW silently never installs. Font Awesome is cross-origin and explicitly skipped (`sw.js:39-40`), so all icons vanish offline regardless.
**Fix:** generate the SHELL list in `build.cjs`; include all pages, per-page scripts, `/index.html`, and data files; consider self-hosting the FA subset.

### H8. `npm test` is red and CI runs neither tests nor lint
33/34 unit tests pass; the round-trip test (`tests/utils.test.js:198`) fails because the app code runs in a `node:vm` context while `JSON.parse` runs in the host realm — `assert.deepEqual` from `node:assert/strict` compares prototypes across realms. A test-harness bug, not an app bug, but it makes the suite useless as a signal.
**Fix:** compare `JSON.stringify(s1[k]) === JSON.stringify(v)` for that check. Then wire `npm test` + `npm run lint` into the deploy workflow — currently nothing runs them, and the Selenium suite can't run in CI anyway because `tests/selenium/conftest.py:46` hardcodes a macOS Chrome path and the served repo lacks `bundle.js` on a fresh clone.

### H9. Two byte-identical 795 KB icons load on every page
`favicon.png` and `apple-touch-icon.png` are each 794,848 bytes, 1024×1024, and **byte-identical** (`cmp` confirms). The favicon is fetched by every page; `manifest.json` declares only these 1024px icons (no 192/512), and the "maskable" icon is the same un-padded art. ~1.6 MB of icon payload should be ~40-80 KB.
**Fix:** real ~48px favicon, 180px apple-touch-icon, compressed 192/512/1024 manifest icons with proper maskable padding.

---

## Medium severity

- **M1. `doReset` never clears HT/FT snapshots** (`js/scoring.js:84-120`): `htGoals/htPts/htOg/htOp/ftGoals/…` survive a New Game; `share.js:132-135` renders `state.htGoals ?? state.goals`, so the new match's share graphic can show last game's half-time line. Set all eight back to `null`.
- **M2. `removeSelected` desyncs the scoreboard** (`js/events.js:77-86`): splices `state.evts` without adjusting scores, so a removed Goal leaves the displayed score 3 ahead of what stats/exports recompute. Also leaves stale `data-ev-idx` attributes, so later OSC/GK enrichment (`js/osc.js:63`, `js/gk.js:341`) can rewrite the wrong row.
- **M3. `execSub` undo corrupts bench bookkeeping** (`js/players.js:581-586`): the revert unconditionally writes `suboff`/`ubench`, fabricating a "previously subbed off" record for a fresh bench player (he then appears twice in `pickSubOn`). Capture and restore the prior values instead.
- **M4. Position swaps corrupt play-time minutes** (`js/stats.js:136-164`): `computePlayTimes` tracks slot occupancy via `sub` events only and ignores `pos-swap`, so after a swap, minutes are credited to the wrong players in the Play Time panel, print report, and CSV. Record both slots on the swap event and handle it in the replay.
- **M5. Opposition goals drawn in the home team's colour** (`js/stats.js:66`, `js/print.js:65`): the goal marker hard-codes `fill="${TEAM_US_COLOR}"` even when `mTeam==='opp'` — misleading in a coaching artifact. Use the already-computed `mcol`. (Same bug in both copies — see the duplication theme.)
- **M6. GK "By Half" panel never renders for live exports** (`review.html:685-691`): filters GK events by `e.badge === '1H'/'2H'`, but live GK events carry player initials as badge (`js/gk.js:304`). Derive the half from position relative to the `2H` marker, as `computeStats` already does.
- **M7. quick.html clock loses time when backgrounded** (`quick.html:426-436`): `S.secs++` in a 1 s `setInterval`; mobile browsers throttle/suspend timers when the screen locks — exactly the sideline scenario. index.html already solved this with wall-clock anchoring; do the same here. Also `quick.html:630` hardcodes 30-minute halves when computing the shared minute label.
- **M8. season.html single-quote injection in inline `onclick`** (`season.html:340,368,1112,1277`): its `esc()` doesn't escape `'` (roster.html's does), and player names are interpolated into single-quoted JS strings — `O'Brien` throws a SyntaxError and breaks the player drawer; a crafted name in imported JSON executes on click. Copy roster's `esc()` or switch to dataset + delegated listeners.
- **M9. JSON import validation is nearly nonexistent**: `review.html:213`, `season.html:381`, `merge.html:388`, and `js/transfer.js:55-62` check only `Array.isArray(evts)` before `Object.assign(state, data)`; `season.html:1208-1224` (`addMoreFiles`) skips even that. Extract one shared `validateMatchExport()` into `js/game-utils.js` and use it at all entry points.
- **M10. AI prompt GK rating diverges from the UI** (`js/ai-config.js:246-266`): re-implements `calculateGKRating` but drops the age bonus, so a U12 keeper shown as 72 "Very Good" in the app can be embedded as ~53 "Below Average" in the AI prompt — or silently excluded by the ≥65/≤35 gate. Call `calculateGKRating(gkEvts, state.ageGrade)` instead.
- **M11. `shareWithAI` popups get blocked** (`js/share.js:370-389`): `window.open` runs inside a clipboard `.then()` / a 1200 ms `setTimeout`, outside the user-activation window — on iOS Safari the fallback is essentially guaranteed blocked. Open the tab synchronously in the click handler, then write the clipboard.
- **M12. entry.html forces desktop rendering on phones** (`entry.html:5`): `<meta name="viewport" content="width=1200">` defeats its own `@media(max-width:700px)` rules from first paint. Use `width=device-width` (review/season only switch to 1200 *after* a file loads).
- **M13. ADJ team attribution by string prefix** (`js/game-utils.js:39`): `d.startsWith(oppN)` against the *current* opposition name — renaming the opposition mid-match silently re-attributes earlier adjustments. The events mostly already carry structured `action`/`side`; prefer those.
- **M14. Period-marker undo entries are no-ops** (`js/timer.js:36,69,85`): undoing "1st Half started" deletes the marker row but leaves the state machine untouched, and timeline half-splitting keys off those `'1H'`/`'2H'` badges. Make them non-undoable.
- **M15. SW update flow + hosting assumptions** (`sw.js:3,23,32`): manual `CACHE = 'gaa-tracker-v7'` hand-bumps with nothing enforcing them; `skipWaiting`+`claim` seizes open pages mid-session with no reload prompt (possible index.html/bundle.js version skew). Root-absolute paths (`/sw.js`, `start_url: "/"`) hard-require domain-root hosting — fine with the custom domain, but undocumented; relative paths would be safer.

---

## Low severity / hygiene

- **Silent persistence failure** (`js/persistence.js:22,45`): both save paths `catch(e) {}` — on quota exhaustion or Safari private mode the coach loses the match with zero indication. Show a one-time warning toast; add a `pagehide` fallback for the 500 ms debounce window. Related: `clearSavedState` doesn't cancel the pending debounced save (`js/persistence.js:41` + `js/scoring.js:118`), which can resurrect the key after New Game.
- **~1 s truncation per pause/resume** (`js/timer.js:39,49`): `tPausedAt` is floored to seconds on every pause; frequent pauses accumulate drift. Keep milliseconds, floor only for display.
- **13-a-side "Clear names" misses slot 15** (`js/settings.js:92-98`): iterates `1..13` but `TEAM_SLOTS[13]` is non-contiguous (`[1,2,4,…,15]`). Iterate `TEAM_SLOTS[sz]` like `settings.js:143` does.
- **GK stats show jersey #1's name, not the slot-1 occupant** (`js/stats.js:215`, `js/print.js:424`): after a keeper sub the rating still names the original keeper; `ai-config.js:260` does it correctly via `slotp[1]`.
- **One missing escape** (`js/print.js:628`): the print shot map passes `gi(pi)` raw into SVG markup where the stats path escapes it (`js/stats.js:623`) — one-line fix, reachable via imported files.
- **Double-escaped GK name persisted** (`js/gk.js:340`): `esc()` applied to text stored in `ev.desc`, which is escaped again on render — `&` displays as `&amp;`.
- **CSV formula injection** (`js/share.js:11-19`): `csvEsc` doesn't neutralise leading `=`/`+`/`-`/`@` in player names/descriptions.
- **Sync `revokeObjectURL` after download click** (`js/transfer.js:44-45`): historically cancels downloads in Firefox/WebViews; `share.js:44` already defers 10 s.
- **Dead `__back` branch in the AI target menu** (`js/share.js:355-362`): no element ever renders `data-v="__back"`, so there's no way back to the main share menu.
- **Dead code:** `ACTS`/`NS` (`js/constants.js:4,7`); `periodLabel`/`periodBadge` (`js/timer.js:4-5`); `buildScorerSummary`/`formatScorer` (`js/scoring.js:4-35` — duplicates of game-utils logic, a rules-drift trap); `shotMapTeamFilter` (`js/state.js:41`); `pendAct` (written, never read); `PLACED` set in `entry.html:450`; `.rv-lu-*` CSS in `review.html:130-137`; the always-true `usedInSec` condition in `merge.html:558-583`. entry.html also handles `'2 Point'` events its own form can't produce — football 2-pointers can't be entered there at all.
- **Drawer-logged Wides invisible to stats** (`js/scoring.js:206-215`): team-drawer wides get badge `'ADJ'`/`'OPP'` with no slot, so they never appear in wide counts while identical player-sheet wides do.
- **Repo hygiene** (verified via `git ls-files`): 11 `tests/selenium/__pycache__/*.pyc` files tracked; `.DS_Store` tracked; `PNG image.png` (1.3 MB icon source) tracked and referenced nowhere. `git rm -r --cached` them and add `__pycache__/`, `*.pyc` to `.gitignore`.
- **Accessibility:** rating dots in entry.html are click-only `<div>`s with no keyboard path; season.html's clickable rows/sortable headers are mouse-only; `merge.html` sets `user-scalable=no`; many icon-only buttons lack `aria-label`.
- **Head/meta inconsistency:** CSP meta exists only on index.html (the pages with actual XSS exposure have none); `theme-color` differs between pages and is absent on four; `tokens.css` is linked by only 3 pages while the rest re-declare the same custom properties inline; only index.html declares `color-scheme`, so other pages can get dark-default form controls.
- **Unit-test coverage:** only 6 of 24 `js/` modules are loaded by the unit suite; the most test-worthy pure-logic modules (`game-utils.js`, `scoring.js`, `timer.js`'s state machine, `clubs.js`, `stats.js`) have zero unit tests.

---

## The three structural fixes worth prioritising

1. **Make the undo contract explicit** (fixes H1 and M14, prevents recurrence): undo entries record whether they own an event row; `undoLast` pops conditionally.
2. **Stop parsing description strings; standardise the event schema** (fixes H3, H4, H5-logic, M6, M13): events already mostly carry `action`/`side` — make all writers set them, make all readers (`applyScoreBadge`, review, merge) prefer them, and document that `badge` is display-only. Add the shared `validateMatchExport()` at every import point while you're in there.
3. **Extract the shared page runtime** (fixes the five-`esc()` problem, M8, the quick.html club-list drift, and most future drift): one small shared file with `esc`, `toSeconds`, the filename builder, and the club directory, included by every page; fold the duplicated stats/print/AI builders into parameterised functions in `game-utils.js`.
