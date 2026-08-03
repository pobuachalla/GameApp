'use strict';

// ─── TIME UTILITIES ───────────────────────────────────────────────────────────
function toSeconds(s) {
  const p = (s || '0:00').split(':');
  return parseInt(p[0] || 0) * 60 + parseInt(p[1] || 0);
}

function formatSeconds(secs) {
  const m = Math.floor(secs / 60), sc = Math.round(secs % 60);
  return m + ':' + (sc < 10 ? '0' : '') + sc;
}

// Returns a Date for the match: state.matchDate (ISO string from Setup) if set,
// otherwise today. Use this wherever a display date is needed so share/print
// screens reflect the actual match day rather than always showing today.
function matchDisplayDate() {
  if (state.matchDate) {
    const d = new Date(state.matchDate + 'T12:00:00');
    if (!isNaN(d)) return d;
  }
  return new Date();
}

// ─── SCORE BADGE PROCESSING ───────────────────────────────────────────────────
// Applies an OPP, ADJ, Goal, Point, 2 Point, or Wide event to a running scores
// object {usG, usP, oppG, oppP}. Returns {mType, mTeam} or null.
function applyScoreBadge(ev, scores, oppN) {
  let mType = null, mTeam = 'us';
  if (ev.badge === 'OPP') {
    const d = ev.desc || '';
    if      (ev.action === 'Wide')         { mType = 'Wide'; mTeam = 'opp'; }
    else if (d.includes('Goal added'))     { scores.oppG++; mType = 'Goal';    mTeam = 'opp'; }
    else if (d.includes('2 Point added'))  { scores.oppP += 2; mType = '2 Point'; mTeam = 'opp'; }
    else if (d.includes('Point added'))    { scores.oppP++; mType = 'Point';   mTeam = 'opp'; }
    else if (d.includes('Goal removed'))    scores.oppG = Math.max(0, scores.oppG - 1);
    else if (d.includes('2 Point removed')) scores.oppP = Math.max(0, scores.oppP - 2);
    else if (d.includes('Point removed'))   scores.oppP = Math.max(0, scores.oppP - 1);
  } else if (ev.badge === 'ADJ') {
    const d = ev.desc || '';
    // Prefer the structured side tag; the desc-prefix check misattributes
    // older events if the opposition name was edited mid-match
    const adjOpp = ev.side ? ev.side === 'opp' : d.startsWith(oppN);
    if (ev.action === 'Wide') { mType = 'Wide'; mTeam = adjOpp ? 'opp' : 'us'; return { mType, mTeam }; }
    if      (d.includes('Goal added'))    { if(adjOpp){scores.oppG++;mType='Goal';mTeam='opp';}else{scores.usG++;mType='Goal';mTeam='us';} }
    else if (d.includes('2 Point added')) { if(adjOpp){scores.oppP+=2;mType='2 Point';mTeam='opp';}else{scores.usP+=2;mType='2 Point';mTeam='us';} }
    else if (d.includes('Point added'))   { if(adjOpp){scores.oppP++;mType='Point';mTeam='opp';}else{scores.usP++;mType='Point';mTeam='us';} }
    else if (d.includes('Goal removed'))    { if(adjOpp) scores.oppG=Math.max(0,scores.oppG-1); else scores.usG=Math.max(0,scores.usG-1); }
    else if (d.includes('2 Point removed')) { if(adjOpp) scores.oppP=Math.max(0,scores.oppP-2); else scores.usP=Math.max(0,scores.usP-2); }
    else if (d.includes('Point removed'))   { if(adjOpp) scores.oppP=Math.max(0,scores.oppP-1); else scores.usP=Math.max(0,scores.usP-1); }
  } else if (ev.action === 'Goal')    { scores.usG++;    mType = 'Goal';    mTeam = 'us'; }
    else if (ev.action === 'Point')   { scores.usP++;    mType = 'Point';   mTeam = 'us'; }
    else if (ev.action === '2 Point') { scores.usP += 2; mType = '2 Point'; mTeam = 'us'; }
    else if (ev.action === 'Wide')    {                   mType = 'Wide';    mTeam = 'us'; }
  return mType ? { mType, mTeam } : null;
}

// ─── MATCH STATISTICS AGGREGATION ────────────────────────────────────────────
// Aggregates per-player and team stats from an events array.
// slotp: slot→pi mapping. getPlayerName: pi => string.
// References PLACED_BALL from global scope (defined in constants.js / review.html).
function aggregateMatchStats(evts, trackTurnovers, slotp, getPlayerName) {
  let goalCount=0, ptCount=0, twoPtCount=0, wideCount=0;
  let placedGoals=0, placedPts=0, placedTwoPts=0, placedWides=0;
  let ownWon=0, ownLost=0, ownUnclear=0, oppWon=0, oppLost=0, oppUnclear=0;
  let turnoversWon=0, turnoversLost=0, freesWon=0;
  const wonCategories = {}, lostCategories = {};
  const pstats = {};

  evts.forEach(ev => {
    if (ev.badge === 'RSTR') {
      const d = ev.desc || '';
      const won = d.includes(': Won'), lost = d.includes(': Lost');
      if (d.startsWith('Own Restart'))  { if(won)ownWon++; else if(lost)ownLost++; else ownUnclear++; }
      else if (d.startsWith('Opposition')) { if(won)oppWon++; else if(lost)oppLost++; else oppUnclear++; }
      return;
    }
    // Team-level scores/wides logged from the score-adjust drawer carry no
    // slot/player. Wides always get ev.action='Wide' when logged, but Goal/
    // Point/2 Point additions from adjUs()/adjFootball() historically don't
    // set ev.action at all (only adjOpp() does) — match on desc text instead
    // so both old saved matches and new ones are counted correctly.
    if (ev.badge === 'ADJ' && !ev.slot && ev.side !== 'opp') {
      if (ev.action === 'Wide') {
        wideCount++;
        if (PLACED_BALL.has(ev.sec)) placedWides++;
        return;
      }
      const d = ev.desc || '';
      const placed = PLACED_BALL.has(ev.sec);
      if      (d.includes('Goal added'))    { goalCount++;  if (placed) placedGoals++; }
      else if (d.includes('2 Point added')) { twoPtCount++; if (placed) placedTwoPts++; }
      else if (d.includes('Point added'))   { ptCount++;    if (placed) placedPts++; }
      return; // "removed" corrections and anything else here aren't new scoring events
    }
    if (!ev.action || !ev.slot) return;
    const pi = ev.pi != null ? ev.pi : slotp[ev.slot];
    if (!pi) return;
    const placed = PLACED_BALL.has(ev.sec);
    if (!pstats[pi]) pstats[pi] = {name:getPlayerName(pi),gPlay:0,gPlaced:0,pPlay:0,pPlaced:0,wides:0,yc:0,syc:0,rc:0,bc:0,twon:0,tlost:0,freesWon:0,twonSec:{},tlostSec:{},frees:{}};
    const ps = pstats[pi];
    if      (ev.action === 'Goal')        { goalCount++;   placed ? (placedGoals++,  ps.gPlaced++) : ps.gPlay++; }
    else if (ev.action === 'Point')       { ptCount++;     placed ? (placedPts++,    ps.pPlaced++) : ps.pPlay++; }
    else if (ev.action === '2 Point')     { twoPtCount++;  placed ? (placedTwoPts++, ps.pPlaced+=2) : ps.pPlay+=2; }
    else if (ev.action === 'Wide')        { wideCount++;   ps.wides++; if (placed) placedWides++; }
    else if (ev.action === 'Yellow Card')        ps.yc++;
    else if (ev.action === 'Second Yellow Card') { ps.yc++; ps.syc++; }
    else if (ev.action === 'Red Card')           ps.rc++;
    else if (ev.action === 'Black Card')  ps.bc++;
    else if (ev.action === 'Free Won')       { freesWon++; ps.freesWon++; }
    else if (ev.action === 'Turnover Won')  {
      turnoversWon++;  ps.twon++;
      if (trackTurnovers && ev.sec) { wonCategories[ev.sec]=(wonCategories[ev.sec]||0)+1; ps.twonSec[ev.sec]=(ps.twonSec[ev.sec]||0)+1; }
    }
    else if (ev.action === 'Turnover Lost') {
      turnoversLost++; ps.tlost++;
      if (trackTurnovers && ev.sec) { lostCategories[ev.sec]=(lostCategories[ev.sec]||0)+1; ps.tlostSec[ev.sec]=(ps.tlostSec[ev.sec]||0)+1; }
    }
    else if (ev.action === 'Free') { const ft = ev.sec || 'Other'; ps.frees[ft] = (ps.frees[ft]||0) + 1; }
  });

  let freesConc = 0, freesScored = 0;
  for (let i = 0; i < evts.length; i++) {
    if (evts[i].action !== 'Free') continue;
    freesConc++;
    for (let j = i + 1; j < evts.length; j++) {
      const next = evts[j];
      if (next.badge === 'RSTR') continue;
      if (next.badge === 'OPP') freesScored++;
      break;
    }
  }

  return {
    pstats, wonCategories, lostCategories,
    goalCount, ptCount, twoPtCount, wideCount,
    placedGoals, placedPts, placedTwoPts, placedWides,
    turnoversWon, turnoversLost, freesWon,
    ownWon, ownLost, ownUnclear, oppWon, oppLost, oppUnclear,
    freesConc, freesScored,
  };
}

// ─── SCORES FROM TURNOVERS ────────────────────────────────────────────────────
// Attributes a score to the most recent turnover if it happened within
// TURNOVER_SCORE_WINDOW seconds and the team matches (Turnover Won → our
// score, Turnover Lost → their score). Only the single most recent turnover
// is ever in play, so an earlier one can't retroactively claim a score, and
// each score consumes it whether or not it ends up matching — a later score
// needs a fresh turnover of its own to be credited.
const TURNOVER_SCORE_WINDOW = 30;

function computeTurnoverScores(evts, oppN) {
  let usG = 0, usP = 0, oppG = 0, oppP = 0;
  let halfSecs = 0, inH2 = false;
  let lastTurnover = null; // { team: 'us'|'opp', t: secs }
  const _sc = { usG: 0, usP: 0, oppG: 0, oppP: 0 }; // bookkeeping only, for applyScoreBadge

  evts.forEach(ev => {
    let t = toSeconds(ev.time);
    if (ev.badge === '1H') { halfSecs = t; return; }
    if (ev.badge === '2H') { inH2 = true; return; }
    if (inH2) t += halfSecs;

    if (ev.action === 'Turnover Won')  { lastTurnover = { team: 'us',  t }; return; }
    if (ev.action === 'Turnover Lost') { lastTurnover = { team: 'opp', t }; return; }

    const res = applyScoreBadge(ev, _sc, oppN);
    if (!res || res.mType === 'Wide') return;

    if (lastTurnover && res.mTeam === lastTurnover.team && (t - lastTurnover.t) <= TURNOVER_SCORE_WINDOW) {
      const pts = res.mType === '2 Point' ? 2 : 1;
      if (res.mTeam === 'us') { if (res.mType === 'Goal') usG++; else usP += pts; }
      else                    { if (res.mType === 'Goal') oppG++; else oppP += pts; }
    }
    lastTurnover = null; // consumed — a later score needs its own turnover
  });

  return { usG, usP, oppG, oppP };
}

// ─── OPPOSITION SCORE BREAKDOWN ───────────────────────────────────────────────
// Splits opposition scoring into goals / 2-pointers / points / wides. Tracks
// the delta each event causes on a running accumulator (via applyScoreBadge)
// rather than pattern-matching "added"/"removed" text directly, so a
// correction from the score-adjust drawer (its own logged event) nets out
// instead of being double-counted.
function computeOppScoreBreakdown(evts, oppN) {
  let goals = 0, twoPt = 0, pts = 0, wides = 0;
  const sc = { usG: 0, usP: 0, oppG: 0, oppP: 0 };

  evts.forEach(ev => {
    const prevG = sc.oppG, prevP = sc.oppP;
    const res = applyScoreBadge(ev, sc, oppN);
    if (res && res.mTeam === 'opp' && res.mType === 'Wide') { wides++; return; }
    const dG = sc.oppG - prevG, dP = sc.oppP - prevP;
    if      (dG > 0) goals++;
    else if (dG < 0) goals = Math.max(0, goals - 1);
    if      (dP === 2)  twoPt++;
    else if (dP === -2) twoPt = Math.max(0, twoPt - 1);
    else if (dP === 1)  pts++;
    else if (dP === -1) pts = Math.max(0, pts - 1);
  });

  return { goals, twoPt, pts, wides };
}

// ─── TRANSITION OUTCOME ANALYSIS ──────────────────────────────────────────────
// Classifies every turnover into a "transition": the passage of play from the
// moment possession changes hands until it resolves into a score, a shot,
// another turnover, a restart, or the end of a half/match. Consecutive
// turnovers by the SAME team (e.g. Poor Pass -> Second to the Ball -> Lost in
// Tackle -> Goal) are merged into a single transition so conversion rates
// aren't inflated by re-counting the same breakdown three times.
//
// Sport-agnostic by construction: the walk only ever keys off the action name
// (Turnover Won/Lost, Goal/Point/2 Point, Wide/Short/Saved) — it never matches
// on ev.sec (the turnover sub-type), so any future sub-type — hurling, ladies
// football, camogie, or one that doesn't exist yet — classifies correctly
// without a code change.
const TRANSITION_SCORE_ACTS = new Set(['Goal', 'Point', '2 Point']);
// 'GK Save' is its own action (tracked via the goalkeeper's own player sheet
// when Track GK Performance is on) rather than an opposition Wide/Saved event
// — but it IS an opposition shot attempt (one our keeper stopped), so it must
// count as a shot for transition purposes even though it carries our own
// player's badge/slot.
const TRANSITION_SHOT_ACTS = new Set(['Wide', 'Short', 'Saved']);

// 'us' | 'opp' for a score/shot event. Player-attributed events (logged via
// the on-pitch action sheet) are always our own player's action; OPP events
// and ADJ corrections tagged side:'opp' belong to the opposition. 'GK Save'
// is the one exception — always an opposition shot, despite being logged
// against our own goalkeeper.
function _transitionEventTeam(ev) {
  if (ev.action === 'GK Save') return 'opp';
  if (ev.badge === 'OPP') return 'opp';
  if (ev.badge === 'ADJ') return ev.side === 'opp' ? 'opp' : 'us';
  return 'us';
}

// evts: state.evts. slotp: slot->pi mapping. getPlayerName: pi => display name.
function computeTransitionOutcomes(evts, slotp, getPlayerName) {
  const transitions = [];
  const consumed = new Array(evts.length).fill(false);
  const playerOf = ev => {
    const pi = ev.pi != null ? ev.pi : (ev.slot != null ? slotp[ev.slot] : null);
    return pi || null;
  };
  const addPlayer = (list, pi) => { if (pi != null && !list.includes(pi)) list.push(pi); };

  for (let i = 0; i < evts.length; i++) {
    if (consumed[i]) continue;
    const ev = evts[i];
    const isWon  = ev.action === 'Turnover Won';
    const isLost = ev.action === 'Turnover Lost';
    if (!isWon && !isLost) continue;

    const ownTeam = isWon ? 'us' : 'opp';
    // Outcome vocabulary differs for the two sides of a transition even
    // though the walk logic below is identical.
    const NAMES = isWon
      ? { score: 'Score', shot: 'Shot', settled: 'NoOutcome' }
      : { score: 'ConcededScore', shot: 'ConcededShot', settled: 'Recovered' };

    const t = {
      id: transitions.length + 1,
      team: ownTeam,
      startEventId: i,
      turnoverType: ev.sec || null,
      playersInvolved: [],
      events: [i],
      outcome: null,
      endingEventId: null,
      chainLength: 1, // number of merged consecutive same-team turnover events
    };
    addPlayer(t.playersInvolved, playerOf(ev));

    for (let j = i + 1; j < evts.length; j++) {
      const e = evts[j];
      if (e.badge === '1H' || e.badge === '2H' || e.badge === 'END' || e.badge === 'RSTR') {
        t.outcome = NAMES.settled; t.endingEventId = j; break;
      }
      if (e.action === 'Turnover Won' || e.action === 'Turnover Lost') {
        if ((e.action === 'Turnover Won') === isWon) {
          // Consecutive turnover by the same team — extends this transition.
          addPlayer(t.playersInvolved, playerOf(e));
          t.events.push(j);
          t.chainLength++;
          consumed[j] = true;
          continue;
        }
        // Possession changed hands the other way before any shot/score — this
        // transition resolves with no outcome. The new turnover event is left
        // unconsumed so the outer loop starts its own transition there.
        t.outcome = NAMES.settled; t.endingEventId = j; break;
      }
      const isShot = TRANSITION_SHOT_ACTS.has(e.action) || e.action === 'GK Save';
      if (!e.action || (!TRANSITION_SCORE_ACTS.has(e.action) && !isShot)) {
        continue; // frees, cards, substitutions, etc. don't end the sequence
      }
      const isScore = TRANSITION_SCORE_ACTS.has(e.action);
      const evTeam  = _transitionEventTeam(e);
      t.events.push(j);
      t.endingEventId = j;
      // A score/shot by the other side without a logged turnover in between
      // means possession must already have changed — resolve as if it had.
      t.outcome = evTeam === ownTeam ? (isScore ? NAMES.score : NAMES.shot) : NAMES.settled;
      break;
    }
    if (t.outcome === null) { t.outcome = NAMES.settled; t.endingEventId = null; }
    transitions.push(t);
  }

  return _summariseTransitions(transitions, getPlayerName);
}

// Rolls a transitions array up into team totals and a per-player breakdown.
// Player counts are keyed on distinct transitions a player took part in (not
// raw turnover events), so a player's own won/lost/created/conceded figures
// always sum to 100% of their involvements — see computeTransitionOutcomes'
// chainLength for how many raw turnovers a merged chain actually contained.
function _summariseTransitions(transitions, getPlayerName) {
  const positive = { total: 0, ledToShot: 0, ledToScore: 0, noOutcome: 0 };
  const negative = { total: 0, concededShot: 0, concededScore: 0, recovered: 0 };
  const playerBreakdown = {};
  const ensure = pi => playerBreakdown[pi] || (playerBreakdown[pi] = {
    pi, name: getPlayerName(pi),
    turnoversWon: 0, shotsCreated: 0, scoresCreated: 0,
    turnoversLost: 0, shotsConceded: 0, scoresConceded: 0,
  });

  transitions.forEach(t => {
    if (t.team === 'us') {
      positive.total++;
      if      (t.outcome === 'Score') positive.ledToScore++;
      else if (t.outcome === 'Shot')  positive.ledToShot++;
      else                            positive.noOutcome++;
      t.playersInvolved.forEach(pi => {
        const p = ensure(pi);
        p.turnoversWon++;
        if      (t.outcome === 'Score') p.scoresCreated++;
        else if (t.outcome === 'Shot')  p.shotsCreated++;
      });
    } else {
      negative.total++;
      if      (t.outcome === 'ConcededScore') negative.concededScore++;
      else if (t.outcome === 'ConcededShot')  negative.concededShot++;
      else                                     negative.recovered++;
      t.playersInvolved.forEach(pi => {
        const p = ensure(pi);
        p.turnoversLost++;
        if      (t.outcome === 'ConcededScore') p.scoresConceded++;
        else if (t.outcome === 'ConcededShot')  p.shotsConceded++;
      });
    }
  });

  positive.shotConversion  = pct(positive.ledToShot + positive.ledToScore, positive.total);
  positive.scoreConversion = pct(positive.ledToScore, positive.total);
  negative.shotAgainstPct  = pct(negative.concededShot + negative.concededScore, negative.total);
  negative.scoreAgainstPct = pct(negative.concededScore, negative.total);

  Object.values(playerBreakdown).forEach(p => {
    p.scorePct    = pct(p.scoresCreated, p.turnoversWon);
    p.recoveryPct = pct(p.turnoversLost - p.shotsConceded - p.scoresConceded, p.turnoversLost);
  });

  return { transitions, positive, negative, playerBreakdown };
}

// Turns a computeTransitionOutcomes() result into short coaching sentences.
// Plain text (no HTML/escaping) — callers embed it via esc()/html`` (stats.js,
// print.js) or drop it straight into the AI prompt (ai-config.js) as-is.
function buildTransitionInsights(data, usN, oppN) {
  const { transitions, positive, negative, playerBreakdown } = data;
  const lines = [];

  if (positive.total > 0) {
    const shots = positive.ledToShot + positive.ledToScore;
    lines.push(`${usN}'s ${positive.total} positive turnover${positive.total!==1?'s':''} generated ${shots} shot${shots!==1?'s':''} and ${positive.ledToScore} score${positive.ledToScore!==1?'s':''}.`);
    if (positive.ledToScore > 0) {
      lines.push(`${Math.round(positive.ledToScore/positive.total*100)}% of regains became scores.`);
    }
  }

  if (negative.total > 0 && negative.recovered > 0) {
    lines.push(`${Math.round(negative.recovered/negative.total*100)}% of lost possessions were recovered before ${oppN} produced a shot.`);
  }

  // Longest merged turnover chain that ended in a score — the clearest single
  // example of a recurring breakdown (or reward) worth raising with the group.
  const chains = transitions.filter(t => t.chainLength >= 3 && (t.outcome === 'Score' || t.outcome === 'ConcededScore'));
  if (chains.length) {
    const worst = chains.sort((a, b) => b.chainLength - a.chainLength)[0];
    const who = worst.team === 'us' ? usN : oppN;
    lines.push(`${worst.chainLength} consecutive ${worst.team === 'us' ? 'attacking' : 'defensive'} turnovers created one score for ${who}.`);
  }

  const players = Object.values(playerBreakdown);
  const topCreator = players.filter(p => p.scoresCreated >= 2).sort((a, b) => b.scoresCreated - a.scoresCreated)[0];
  if (topCreator) lines.push(`${topCreator.name} initiated ${topCreator.scoresCreated} scoring transitions.`);

  const conversionLeader = players.filter(p => p.turnoversWon >= 3 && p.scoresCreated > 0)
    .sort((a, b) => (b.scoresCreated / b.turnoversWon) - (a.scoresCreated / a.turnoversWon))[0];
  if (conversionLeader && (!topCreator || conversionLeader.pi !== topCreator.pi)) {
    lines.push(`${conversionLeader.name} produced the highest score conversion.`);
  }

  const mixed = players.filter(p => p.turnoversWon >= 3 && p.turnoversLost >= 2)
    .sort((a, b) => (b.turnoversWon + b.turnoversLost) - (a.turnoversWon + a.turnoversLost))[0];
  if (mixed) lines.push(`${mixed.name} was heavily involved offensively but also featured in multiple negative transitions.`);

  return lines;
}

// ─── PLAYER FILTERING ─────────────────────────────────────────────────────────
function getScorers(pstats) {
  return Object.values(pstats).filter(p =>
    p.gPlay+p.gPlaced+p.pPlay+p.pPlaced+p.wides > 0
  ).sort((a, b) => {
    const ta = (a.gPlay+a.gPlaced)*3+(a.pPlay+a.pPlaced);
    const tb = (b.gPlay+b.gPlaced)*3+(b.pPlay+b.pPlaced);
    return tb !== ta ? tb - ta : a.name.localeCompare(b.name);
  });
}

function getDiscPlayers(pstats) {
  return Object.values(pstats).filter(p =>
    p.yc+p.bc+p.rc > 0 || Object.keys(p.frees).length > 0
  ).sort((a, b) => {
    const ca = a.rc*100+a.bc*10+a.yc, cb = b.rc*100+b.bc*10+b.yc;
    if (cb !== ca) return cb - ca;
    const fa = Object.values(a.frees).reduce((s,n)=>s+n,0);
    const fb = Object.values(b.frees).reduce((s,n)=>s+n,0);
    return fb - fa || a.name.localeCompare(b.name);
  });
}

// ─── MOMENTUM ─────────────────────────────────────────────────────────────────
function calculateMomentum(usGoals, usPts, ogGoals, ogPts, ownWon, oppWon, ownLost, oppLost, turnoversWon, turnoversLost) {
  const usMom  = (usGoals*3 + usPts) + (ownWon  + oppWon)  * 2 + turnoversWon;
  const oppMom = (ogGoals*3 + ogPts) + (ownLost + oppLost) * 2 + turnoversLost;
  const momTotal = usMom + oppMom;
  const usPct  = momTotal > 0 ? Math.round(usMom  / momTotal * 100) : 50;
  const oppPct = momTotal > 0 ? 100 - usPct : 50;
  return { usMom, oppMom, momTotal, usPct, oppPct };
}

// ─── SHOT MAP COMPUTATION ────────────────────────────────────────────────────
// Deterministic jitter so dots don't overlap.
function shotJitter(seed, range) {
  const x = Math.sin(seed) * 43758.5453;
  return (x - Math.floor(x) - 0.5) * range;
}

// Builds SVG dot markup and thirds breakdown from a filtered shots array.
// getInitials(pi): returns the text label to render inside each dot.
function computeShotDots(shots, getInitials) {
  const placed_arr = [];
  let dots = '';
  shots.forEach((s, i) => {
    const isSideline = s.sec === 'From Sideline';
    const is45       = s.sec === 'From 45';
    const is65       = s.sec === 'From 65';
    const isPenalty  = s.sec === 'From Penalty';
    const baseCx = isPenalty ? 160 : isSideline ? (s.zone.coords.x < 0.5 ? ZPX : ZPX + ZPW) : ZPX + s.zone.coords.x * ZPW;
    const baseCy = isPenalty ? 360 : is45 ? 268 : is65 ? 215 : ZPY + s.zone.coords.y * ZPH;
    const isScore = s.action !== 'Wide' && s.action !== 'Short' && s.action !== 'Saved';
    const isGoal  = s.action === 'Goal';
    const isShort = s.action === 'Short';
    const isSaved = s.action === 'Saved';
    const r = isGoal ? 9 : 6;
    let cx, cy, jRange = 16;
    let bestCx = baseCx, bestCy = baseCy, bestOverlap = Infinity;
    for (let attempt = 0; attempt < 15; attempt++) {
      const tryX = baseCx + (isSideline || isPenalty ? 0 : shotJitter(i * 2.1 + 1 + attempt * 17.3, jRange));
      const tryY = baseCy + (is45 || is65 || isPenalty ? 0 : shotJitter(i * 2.1 + 2 + attempt * 17.3, jRange));
      const maxOverlap = placed_arr.reduce((m, p) => Math.max(m, r + p.r + 4 - Math.hypot(tryX - p.cx, tryY - p.cy)), 0);
      if (maxOverlap <= 0) { cx = tryX; cy = tryY; break; }
      if (maxOverlap < bestOverlap) { bestOverlap = maxOverlap; bestCx = tryX; bestCy = tryY; }
      jRange += 8;
    }
    if (cx == null) { cx = bestCx; cy = bestCy; }
    placed_arr.push({cx, cy, r});
    const cxS = cx.toFixed(1), cyS = cy.toFixed(1);
    const fill = isShort ? '#9E9E9E' : isSaved ? '#F97316' : isScore ? TEAM_US_COLOR : TEAM_OPP_COLOR;
    if (s.placed) dots += `<circle cx="${cxS}" cy="${cyS}" r="${r+3.5}" fill="none" stroke="${fill}" stroke-width="1.5" opacity="0.7"/>`;
    dots += `<circle cx="${cxS}" cy="${cyS}" r="${r}" fill="${fill}" opacity="0.82" stroke="white" stroke-width="1.2"/>`;
    if (s.pi != null) {
      const ini = getInitials(s.pi);
      const fs = isGoal ? 7 : (ini.length >= 4 ? 4.5 : 5.5);
      dots += `<text x="${cxS}" y="${cyS}" text-anchor="middle" dominant-baseline="central" font-size="${fs}" font-weight="700" fill="white" font-family="-apple-system,BlinkMacSystemFont,sans-serif" style="pointer-events:none;">${ini}</text>`;
    }
  });

  const thirds = { att:{shots:0,scores:0}, mid:{shots:0,scores:0}, def:{shots:0,scores:0} };
  shots.forEach(s => {
    const t = s.zone.coords.y > 0.667 ? 'att' : s.zone.coords.y > 0.333 ? 'mid' : 'def';
    thirds[t].shots++;
    if (s.action !== 'Wide' && s.action !== 'Short' && s.action !== 'Saved') thirds[t].scores++;
  });

  return { dots, thirds };
}

// ─── PLACED BALL ─────────────────────────────────────────────────────────────
function isPlacedBall(ev) {
  return PLACED_BALL.has(ev.sec) ||
    (ev.sec == null && (ev.badge === 'OPP' || ev.badge === 'ADJ') &&
      [...PLACED_BALL].some(pb => (ev.desc || '').includes(pb)));
}

// ─── PERCENTAGE HELPER ────────────────────────────────────────────────────────
// Returns formatted percentage string or '—' for zero denominator.
function pct(n, d) { return d > 0 ? Math.round(n / d * 100) + '%' : '—'; }

// ─── TURNOVER DONUT ───────────────────────────────────────────────────────────
function buildTurnoverDonut(title, entries, colorMap, fallback) {
  const total = entries.reduce((s, [,n]) => s + n, 0);
  if (total === 0) return '';

  const CX = 54, CY = 54, R = 46, IR = 24;
  const GAP = 0.025;
  let svg = `<svg width="108" height="108" viewBox="0 0 108 108" style="display:block;margin:0 auto;">`;

  let angle = -Math.PI / 2;
  entries.forEach(([cat, n]) => {
    const sweep = (n / total) * 2 * Math.PI - (entries.length > 1 ? GAP : 0);
    const a1 = angle + (entries.length > 1 ? GAP / 2 : 0);
    const a2 = a1 + sweep;
    const x1 = CX + R  * Math.cos(a1), y1 = CY + R  * Math.sin(a1);
    const x2 = CX + R  * Math.cos(a2), y2 = CY + R  * Math.sin(a2);
    const ix1= CX + IR * Math.cos(a2), iy1= CY + IR * Math.sin(a2);
    const ix2= CX + IR * Math.cos(a1), iy2= CY + IR * Math.sin(a1);
    const large = sweep > Math.PI ? 1 : 0;
    const color = colorMap[cat] || fallback;
    svg += `<path d="M${x1} ${y1} A${R} ${R} 0 ${large} 1 ${x2} ${y2} L${ix1} ${iy1} A${IR} ${IR} 0 ${large} 0 ${ix2} ${iy2}Z" fill="${color}"/>`;
    if (sweep > 0.38) {
      const midA = a1 + sweep / 2;
      const lr = (R + IR) / 2;
      svg += `<text x="${(CX + lr * Math.cos(midA)).toFixed(1)}" y="${(CY + lr * Math.sin(midA) + 3).toFixed(1)}" text-anchor="middle" font-size="9" font-weight="600" fill="rgba(255,255,255,0.82)">${n}</text>`;
    }
    angle += (n / total) * 2 * Math.PI;
  });

  svg += `<text x="${CX}" y="${CY - 5}" text-anchor="middle" font-size="14" font-weight="700" fill="var(--t1)">${total}</text>`;
  svg += `<text x="${CX}" y="${CY + 9}" text-anchor="middle" font-size="8"  fill="var(--t2)">total</text>`;
  svg += '</svg>';

  let legend = '<div style="margin-top:6px;">';
  [...entries].sort((a, b) => b[1] - a[1]).forEach(([cat, n]) => {
    const p = Math.round(n / total * 100);
    const color = colorMap[cat] || fallback;
    legend += `<div style="display:flex;align-items:center;gap:5px;margin-bottom:3px;">
      <span style="width:9px;height:9px;border-radius:50%;background:${color};flex-shrink:0;"></span>
      <span style="font-size:10px;color:var(--t2);flex:1;line-height:1.3;">${esc(cat)}</span>
      <span style="font-size:10px;font-weight:700;color:var(--t1);">${p}%</span>
    </div>`;
  });
  legend += '</div>';

  return `<div style="flex:1;min-width:120px;max-width:160px;">
    <div style="font-size:11px;font-weight:700;color:var(--t2);text-align:center;margin-bottom:6px;text-transform:uppercase;letter-spacing:.4px;">${esc(title)}</div>
    ${svg}${legend}
  </div>`;
}

// ─── TRANSITION FUNNEL (shared render helper for stats.js & print.js) ────────
// steps: [{value, label}, ...] rendered as a vertical funnel joined by
// down-arrows, first step emphasised in accentColor. Colors are passed in
// (rather than read from CSS vars) so the in-app renderer can use
// var(--x) tokens while the print renderer passes plain hex.
function buildTransitionFunnelHTML(title, steps, accentColor, textColor, subColor) {
  let h = `<div style="text-align:center;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:${subColor};margin-bottom:8px;">${esc(title)}</div>`;
  h += '<div style="display:flex;flex-direction:column;align-items:center;">';
  steps.forEach((s, i) => {
    if (i > 0) h += `<i class="fas fa-arrow-down" style="font-size:12px;color:${subColor};margin:2px 0;"></i>`;
    h += '<div style="text-align:center;">';
    h += `<div style="font-size:${i===0?'26px':'20px'};font-weight:700;color:${i===0?accentColor:textColor};line-height:1.1;">${esc(String(s.value))}</div>`;
    h += `<div style="font-size:10px;color:${subColor};margin-top:1px;">${esc(s.label)}</div>`;
    h += '</div>';
  });
  h += '</div>';
  return h;
}

// ─── GK RATING ────────────────────────────────────────────────────────────────
// Returns null if no rated events. Otherwise returns rating data.
function calculateGKRating(evts, ageGrade) {
  const ratedEvts = evts.filter(e => e.gkOutcome != null && e.gkFinalValue != null);
  if (ratedEvts.length === 0) return null;

  let weightedDevSum = 0, totalWeight = 0, saves = 0, goals = 0;
  ratedEvts.forEach(e => {
    const dev = e.gkFinalValue - 4;
    const wt = 1 + ((e.gkIntensity || 3) - 1) * 0.4;
    weightedDevSum += dev * wt;
    totalWeight += wt;
    if (e.gkOutcome === 'save') saves++; else goals++;
  });

  const avgDev = totalWeight > 0 ? weightedDevSum / totalWeight : 0;
  const _ageBonus = ({U8:2.0,U10:1.75,U12:1.5,U14:1.2,U16:0.75,Minor:0.35})[ageGrade] || 0;
  const rating = Math.round(50 + (Math.max(-4, Math.min(4, avgDev + _ageBonus)) / 4) * 50);
  const label = rating >= 80 ? 'Outstanding' : rating >= 65 ? 'Very Good' : rating >= 55 ? 'Good'
    : rating >= 45 ? 'Average' : rating >= 35 ? 'Below Average' : rating >= 20 ? 'Poor' : 'Very Poor';
  const ratingColor = rating >= 65 ? '#2E7D32' : rating >= 45 ? '#F59E0B' : '#C62828';
  const shots = saves + goals;
  const saveRate = shots > 0 ? Math.round(saves / shots * 100) : 0;

  return { rating, label, ratingColor, saves, goals, shots, saveRate, ratedEvts };
}
