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

// ─── SCORE BADGE PROCESSING ───────────────────────────────────────────────────
// Applies an OPP, ADJ, Goal, Point, 2 Point, or Wide event to a running scores
// object {usG, usP, oppG, oppP}. Returns {mType, mTeam} or null.
function applyScoreBadge(ev, scores, oppN) {
  let mType = null, mTeam = 'us';
  if (ev.badge === 'OPP') {
    const d = ev.desc || '';
    if      (d.includes('Goal added'))     { scores.oppG++; mType = 'Goal';    mTeam = 'opp'; }
    else if (d.includes('2 Point added'))  { scores.oppP += 2; mType = '2 Point'; mTeam = 'opp'; }
    else if (d.includes('Point added'))    { scores.oppP++; mType = 'Point';   mTeam = 'opp'; }
    else if (d.includes('Goal removed'))   scores.oppG = Math.max(0, scores.oppG - 1);
    else if (d.includes('Point removed'))  scores.oppP = Math.max(0, scores.oppP - 1);
  } else if (ev.badge === 'ADJ') {
    const d = ev.desc || '';
    const adjOpp = d.startsWith(oppN);
    if      (d.includes('Goal added'))    { if(adjOpp){scores.oppG++;mType='Goal';mTeam='opp';}else{scores.usG++;mType='Goal';mTeam='us';} }
    else if (d.includes('2 Point added')) { if(adjOpp){scores.oppP+=2;mType='2 Point';mTeam='opp';}else{scores.usP+=2;mType='2 Point';mTeam='us';} }
    else if (d.includes('Point added'))   { if(adjOpp){scores.oppP++;mType='Point';mTeam='opp';}else{scores.usP++;mType='Point';mTeam='us';} }
    else if (d.includes('Goal removed'))  { if(adjOpp) scores.oppG=Math.max(0,scores.oppG-1); else scores.usG=Math.max(0,scores.usG-1); }
    else if (d.includes('Point removed')) { if(adjOpp) scores.oppP=Math.max(0,scores.oppP-1); else scores.usP=Math.max(0,scores.usP-1); }
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
  let turnoversWon=0, turnoversLost=0;
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
    if (!ev.action || !ev.slot) return;
    const pi = ev.pi != null ? ev.pi : slotp[ev.slot];
    if (!pi) return;
    const placed = PLACED_BALL.has(ev.sec);
    if (!pstats[pi]) pstats[pi] = {name:getPlayerName(pi),gPlay:0,gPlaced:0,pPlay:0,pPlaced:0,wides:0,yc:0,rc:0,bc:0,twon:0,tlost:0,twonSec:{},tlostSec:{},frees:{}};
    const ps = pstats[pi];
    if      (ev.action === 'Goal')        { goalCount++;   placed ? (placedGoals++,  ps.gPlaced++) : ps.gPlay++; }
    else if (ev.action === 'Point')       { ptCount++;     placed ? (placedPts++,    ps.pPlaced++) : ps.pPlay++; }
    else if (ev.action === '2 Point')     { twoPtCount++;  placed ? (placedTwoPts++, ps.pPlaced+=2) : ps.pPlay+=2; }
    else if (ev.action === 'Wide')        { wideCount++;   ps.wides++; if (placed) placedWides++; }
    else if (ev.action === 'Yellow Card') ps.yc++;
    else if (ev.action === 'Red Card')    ps.rc++;
    else if (ev.action === 'Black Card')  ps.bc++;
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
    turnoversWon, turnoversLost,
    ownWon, ownLost, ownUnclear, oppWon, oppLost, oppUnclear,
    freesConc, freesScored,
  };
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
