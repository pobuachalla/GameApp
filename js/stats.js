'use strict';

// ─── SCORE TIMELINE ───────────────────────────────────────────────────────────
function buildTimelineHTML() {
  let usG=0,usP=0,oppG=0,oppP=0,halfSecs=0,inH2=false;
  const data = [{secs:0,us:0,opp:0}];
  const subs=[], reds=[], blacks=[], markers=[];

  state.evts.forEach(ev => {
    let t = toSeconds(ev.time);
    if (ev.badge==='1H') { halfSecs=t; return; }
    if (ev.badge==='2H') { inH2=true; return; }
    if (inH2) t += halfSecs;
    const sc = {usG, usP, oppG, oppP};
    const prevUs=usG*3+usP, prevOpp=oppG*3+oppP;
    const _res = applyScoreBadge(ev, sc, state.oppN);
    const mType = _res ? _res.mType : null, mTeam = _res ? _res.mTeam : 'us';
    ({usG, usP, oppG, oppP} = sc);
    if (!_res) {
      if      (ev.action === 'sub')        subs.push({secs:t});
      else if (ev.action === 'Red Card')   reds.push({secs:t});
      else if (ev.action === 'Black Card') blacks.push({secs:t});
    }
    const curUs=usG*3+usP, curOpp=oppG*3+oppP;
    const placed = isPlacedBall(ev);
    if (mType) markers.push({secs:t, team:mTeam, type:mType, usScore:curUs, oppScore:curOpp, placed});
    if (curUs!==prevUs||curOpp!==prevOpp||mType==='Wide') data.push({secs:t,us:curUs,opp:curOpp});
  });

  if (data.length < 2) return '';

  const totalSecs = Math.max(data[data.length-1].secs, halfSecs||1);
  data.push({secs:totalSecs, us:usG*3+usP, opp:oppG*3+oppP});
  const maxPts = Math.max(...data.map(d=>Math.max(d.us,d.opp)),1);

  const W=272,H=100,PL=24,PR=8,PT=8,PB=18;
  const cw=W-PL-PR, ch=H-PT-PB;
  const x=s=>(PL+(s/totalSecs)*cw).toFixed(1);
  const y=p=>(PT+ch-(p/maxPts)*ch).toFixed(1);
  const usLine  = data.map(d=>x(d.secs)+','+y(d.us)).join(' ');
  const oppLine = data.map(d=>x(d.secs)+','+y(d.opp)).join(' ');
  const yMid=Math.round(maxPts/2);

  let svg=`<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="width:100%;display:block;">`;
  svg+=`<line x1="${PL}" y1="${PT+ch}" x2="${PL+cw}" y2="${PT+ch}" stroke="var(--b)" stroke-width="1"/>`;
  svg+=`<text x="${PL-4}" y="${y(0)+4}" text-anchor="end" font-size="9" fill="var(--t3)">0</text>`;
  svg+=`<text x="${PL-4}" y="${parseFloat(y(yMid))+4}" text-anchor="end" font-size="9" fill="var(--t3)">${yMid}</text>`;
  svg+=`<text x="${PL-4}" y="${parseFloat(y(maxPts))+4}" text-anchor="end" font-size="9" fill="var(--t3)">${maxPts}</text>`;
  svg+=`<text x="${PL}" y="${H-2}" text-anchor="middle" font-size="9" fill="var(--t3)">0'</text>`;
  if (halfSecs>0) {
    svg+=`<line x1="${x(halfSecs)}" y1="${PT}" x2="${x(halfSecs)}" y2="${PT+ch}" stroke="var(--bm)" stroke-width="1" stroke-dasharray="3 2"/>`;
    svg+=`<text x="${x(halfSecs)}" y="${H-2}" text-anchor="middle" font-size="9" fill="var(--t3)">HT</text>`;
  }
  svg+=`<text x="${x(totalSecs)}" y="${H-2}" text-anchor="middle" font-size="9" fill="var(--t3)">${Math.round(totalSecs/60)}'</text>`;
  subs.forEach(e   => { const sx=x(e.secs); svg+=`<line x1="${sx}" y1="${PT}" x2="${sx}" y2="${PT+ch}" stroke="#F59E0B" stroke-width="1.5" stroke-dasharray="2 2"/>`; });
  reds.forEach(e   => { const sx=x(e.secs); svg+=`<line x1="${sx}" y1="${PT}" x2="${sx}" y2="${PT+ch}" stroke="${CARD_RED}" stroke-width="1.5" stroke-dasharray="2 2"/>`; });
  blacks.forEach(e => { const sx=x(e.secs); svg+=`<line x1="${sx}" y1="${PT}" x2="${sx}" y2="${PT+ch}" stroke="${CARD_BLACK}" stroke-width="1.5" stroke-dasharray="2 2"/>`; });
  svg+=`<polyline points="${oppLine}" fill="none" stroke="#C62828" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;
  svg+=`<polyline points="${usLine}"  fill="none" stroke="#2E7D32" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;
  markers.forEach(m => {
    const cx=x(m.secs), cy=y(m.team==='us'?m.usScore:m.oppScore);
    const mcol=m.team==='us'?'#2E7D32':'#C62828';
    const dotCol=m.type==='Wide'?'#9E9E9E':m.type==='2 Point'?'#F59E0B':mcol;
    const dotR=m.type==='Goal'?3.5:m.type==='2 Point'?3:m.type==='Point'?3:2;
    if(m.placed)svg+=`<circle cx="${cx}" cy="${cy}" r="${dotR+2}" fill="none" stroke="${dotCol}" stroke-width="1" opacity="0.7"/>`;
    if      (m.type==='Goal')    svg+=`<circle cx="${cx}" cy="${cy}" r="3.5" fill="#2E7D32" stroke="#fff" stroke-width="1.2"/>`;
    else if (m.type==='2 Point') svg+=`<circle cx="${cx}" cy="${cy}" r="3"   fill="#F59E0B" stroke="#fff" stroke-width="1.2"/>`;
    else if (m.type==='Point')   svg+=`<circle cx="${cx}" cy="${cy}" r="3"   fill="#fff"    stroke="#9A9E99" stroke-width="1.2"/>`;
    else if (m.type==='Wide')    svg+=`<circle cx="${cx}" cy="${cy}" r="2"   fill="#9E9E9E" stroke="none"/>`;
  });
  svg+='</svg>';

  let h='<div class="stat-section"><div class="stat-section-title">Score Timeline</div><div class="stat-card" style="padding:10px 8px 8px;">';
  h+=svg;
  h+='<div style="display:flex;gap:16px;justify-content:center;margin-top:6px;flex-wrap:wrap;">';
  h+=`<span style="font-size:11px;color:var(--t2);display:flex;align-items:center;gap:4px;"><span style="display:inline-block;width:16px;height:2px;background:#2E7D32;border-radius:1px;vertical-align:middle;"></span>${esc(state.usN)}</span>`;
  h+=`<span style="font-size:11px;color:var(--t2);display:flex;align-items:center;gap:4px;"><span style="display:inline-block;width:16px;height:2px;background:#C62828;border-radius:1px;vertical-align:middle;"></span>${esc(state.oppN)}</span>`;
  if (subs.length)   h+=`<span style="font-size:11px;color:var(--t2);display:flex;align-items:center;gap:4px;"><span style="display:inline-block;width:14px;height:0;border-top:2px dashed #F59E0B;vertical-align:middle;"></span>Sub</span>`;
  if (reds.length)   h+=`<span style="font-size:11px;color:var(--t2);display:flex;align-items:center;gap:4px;"><span style="display:inline-block;width:14px;height:0;border-top:2px dashed ${CARD_RED};vertical-align:middle;"></span>Red</span>`;
  if (blacks.length) h+=`<span style="font-size:11px;color:var(--t2);display:flex;align-items:center;gap:4px;"><span style="display:inline-block;width:14px;height:0;border-top:2px dashed ${CARD_BLACK};vertical-align:middle;"></span>Black</span>`;
  h+='</div></div></div>';
  return h;
}

// ─── SUBSTITUTIONS TABLE ──────────────────────────────────────────────────────
function buildSubTableHTML() {
  const hasSubs = state.evts.some(ev=>ev.action==='sub');
  if (!hasSubs) return '';

  const _sc={usG:0,usP:0,oppG:0,oppP:0};
  const scoreAt=[];
  state.evts.forEach(ev => {
    applyScoreBadge(ev, _sc, state.oppN);
    scoreAt.push({usG:_sc.usG,usP:_sc.usP,oppG:_sc.oppG,oppP:_sc.oppP});
  });
  const fUsG=_sc.usG,fUsP=_sc.usP,fOppG=_sc.oppG,fOppP=_sc.oppP;

  let h='<div class="stat-section"><div class="stat-section-title">Substitutions</div><div class="stat-card" style="padding:0;overflow:hidden;">';
  h+='<div style="display:flex;align-items:center;padding:7px 12px;background:var(--bg3);border-bottom:.5px solid var(--b);gap:6px;">';
  h+='<span style="font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--t3);min-width:38px;">Time</span>';
  h+='<span style="font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--t3);flex:1;">On</span>';
  h+='<span style="font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--t3);flex:1;">Off</span>';
  h+='<span style="font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--t3);min-width:60px;text-align:right;">Score</span>';
  h+='</div>';

  state.evts.forEach((ev,i)=>{
    if (ev.action!=='sub') return;
    const at=scoreAt[i]||{usG:0,usP:0,oppG:0,oppP:0};
    const aUG=fUsG-at.usG, aUP=fUsP-at.usP, aOG=fOppG-at.oppG, aOP=fOppP-at.oppP;
    const m=ev.desc.match(/Sub: (.+) off \/ (.+) on \(pos (\d+)\)/);
    const offName=m?m[1]:'?', onName=m?m[2]:'?', pos=m?m[3]:'';
    const scoreNow=at.usG+'-'+at.usP+' v '+at.oppG+'-'+at.oppP;
    const afterUs='+'+aUG+'-'+aUP, afterOpp='+'+aOG+'-'+aOP;
    h+='<div style="display:flex;align-items:flex-start;padding:8px 12px;border-bottom:.5px solid var(--b);gap:6px;">';
    h+='<span style="font-size:12px;color:var(--t3);min-width:38px;padding-top:1px;">'+ev.time+'</span>';
    h+='<div style="flex:1;min-width:0;">';
    h+='<div style="font-size:13px;font-weight:500;color:var(--t1);">'+esc(onName)+'</div>';
    if (pos) h+='<div style="font-size:10px;color:var(--t3);">Pos '+pos+'</div>';
    h+='</div>';
    h+='<div style="flex:1;min-width:0;">';
    h+='<div style="font-size:13px;color:var(--t2);">'+esc(offName)+'</div>';
    h+='</div>';
    h+='<div style="min-width:60px;text-align:right;">';
    h+='<div style="font-size:11px;color:var(--t3);">'+scoreNow+'</div>';
    h+='<div style="font-size:10px;color:var(--t3);margin-top:2px;"><span style="color:#2E7D32;">'+afterUs+'</span> / <span style="color:#C62828;">'+afterOpp+'</span></div>';
    h+='</div>';
    h+='</div>';
  });

  h+='<div style="padding:7px 12px;font-size:10px;color:var(--t3);">After = goals-pts scored from sub on ('+esc(state.usN)+' / '+esc(state.oppN)+')</div>';
  h+='</div></div>';
  return h;
}

// ─── PLAY TIME ────────────────────────────────────────────────────────────────
function computePlayTimes() {
  const teamSz = state.teamSize || 15;
  const curSlotPi = {}, ptStart = {}, ptMap = {};

  (TEAM_SLOTS[teamSz]||TEAM_SLOTS[15]).forEach(sl => {
    const pi = (state.startSlotp||{})[sl];
    if (pi) { curSlotPi[sl] = pi; ptStart[pi] = 0; }
  });

  let halfSecs = 0, inH2 = false, lastSecs = 0;
  state.evts.forEach(ev => {
    let t = toSeconds(ev.time);
    if (ev.badge === '1H') { halfSecs = t; return; }
    if (ev.badge === '2H') { inH2 = true; return; }
    if (inH2) t += halfSecs;
    lastSecs = Math.max(lastSecs, t);
    if (ev.action === 'sub' && ev.slot != null) {
      const offPi = curSlotPi[ev.slot];
      const onM = (ev.desc||'').match(/\(#(\d+)\) on/);
      const onPi = onM ? +onM[1] : null;
      if (offPi != null && ptStart[offPi] != null) { ptMap[offPi] = (ptMap[offPi]||0) + (t - ptStart[offPi]); delete ptStart[offPi]; }
      if (onPi != null) { ptStart[onPi] = t; curSlotPi[ev.slot] = onPi; }
    }
  });

  const totalSecs = Math.max(lastSecs, halfSecs || 1);
  Object.entries(ptStart).forEach(([pi, start]) => { ptMap[+pi] = (ptMap[+pi]||0) + (totalSecs - start); });
  return { ptMap, totalSecs };
}

function buildPlayTimeHTML() {
  if (!state.trackGameTime) return '';
  if (!state.evts.some(ev => ev.action === 'sub')) return '';
  const { ptMap } = computePlayTimes();
  const startPis = new Set(Object.values(state.startSlotp||{}).map(Number));
  const rows = Object.entries(ptMap)
    .map(([pi, t]) => ({pi:+pi, name:gn(+pi), t}))
    .filter(r => r.name)
    .sort((a, b) => b.t - a.t || a.name.localeCompare(b.name));
  if (!rows.length) return '';

  const maxT = rows[0].t || 1;
  let h = '<div class="stat-section"><div class="stat-section-title">Play Time</div><div class="stat-card" style="padding:8px 12px;">';
  rows.forEach(r => {
    const pct = Math.round(r.t / maxT * 100);
    const isSub = !startPis.has(r.pi);
    h += '<div style="display:flex;align-items:center;gap:10px;padding:5px 0;">';
    h += `<div style="font-size:13px;font-weight:500;color:var(--t1);min-width:110px;white-space:nowrap;">${esc(r.name)}</div>`;
    h += `<div style="flex:1;background:var(--bg3);border-radius:4px;overflow:hidden;height:8px;"><div style="background:#2E7D32;opacity:${isSub?'.55':'1'};width:${pct}%;height:100%;border-radius:4px;"></div></div>`;
    h += `<div style="font-size:13px;font-weight:700;color:#2E7D32;min-width:40px;text-align:right;">${formatSeconds(r.t)}</div>`;
    h += `<div style="font-size:10px;color:var(--t3);min-width:24px;">${isSub?'Sub':''}</div>`;
    h += '</div>';
  });
  h += '</div></div>';
  return h;
}

// ─── STATS HELPERS ────────────────────────────────────────────────────────────
function rstBlock(label, won, lost, unclear, total) {
  let out = '<div class="stat-sub-hdr" style="margin-top:0;">'+label+'</div>';
  if (total === 0) {
    out += '<div style="font-size:13px;color:var(--t3);padding:2px 0 10px;">None recorded</div>';
  } else {
    const pct = Math.round(won / total * 100);
    out += '<div class="stat-split-bar"><div class="stat-split-won" style="width:'+pct+'%"></div></div>';
    out += '<div class="stat-split-labels">';
    out += '<span style="color:#2E7D32;font-weight:600;">'+won+' won <span style="font-weight:400;">('+pct+'%)</span></span>';
    out += '<span style="color:#C62828;font-weight:600;">'+lost+' lost'+(unclear?' <span style="font-weight:400;color:var(--t2);">+'+unclear+' unclear</span>':'')+'</span>';
    out += '</div>';
  }
  return out;
}

// ─── GOALKEEPER PERFORMANCE STAT ─────────────────────────────────────────────
function buildGKStatHTML() {
  if (!state.trackGKPerformance) return '';
  const _gk = calculateGKRating(state.evts, state.ageGrade);
  if (!_gk) return '';
  const { rating, label, ratingColor, saves, goals, shots, saveRate, ratedEvts } = _gk;
  const gkName = gn(1) || 'Goalkeeper';
  const intensityLabels = ['', 'Routine', 'Moderate', 'Challenging', 'Difficult', 'Exceptional'];

  let h = '<div class="stat-section"><div class="stat-section-title">Goalkeeper Performance</div>';
  h += '<div class="stat-card">';
  h += `<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">`;
  h += html`<div style="font-size:14px;font-weight:600;color:var(--t1);">${gkName}</div>`;
  h += `<div style="font-size:12px;color:var(--t3);">${saves} save${saves !== 1 ? 's' : ''} / ${goals} goal${goals !== 1 ? 's' : ''} conceded (${saveRate}%)</div>`;
  h += `</div>`;
  h += `<div style="display:flex;align-items:baseline;gap:8px;margin-bottom:12px;">`;
  h += `<div style="font-size:40px;font-weight:800;color:${ratingColor};line-height:1;">${rating}</div>`;
  h += `<div style="font-size:15px;font-weight:700;color:${ratingColor};">${label}</div>`;
  h += `<div style="font-size:11px;color:var(--t3);margin-left:auto;">/ 100</div>`;
  h += `</div>`;
  h += `<div class="gk-rating-bar-wrap"><div class="gk-rating-bar"></div>`;
  h += `<div class="gk-rating-marker" style="left:${rating}%;background:${ratingColor};"></div></div>`;
  h += `<div style="display:flex;justify-content:space-between;margin-top:4px;font-size:10px;color:var(--t3);">`;
  h += `<span>Struggling</span><span>Average</span><span>Excellent</span></div>`;

  if (ratedEvts.length >= 3) {
    const levels = [5, 4, 3, 2, 1].filter(i => ratedEvts.some(e => (e.gkIntensity || 3) === i));
    if (levels.length) {
      h += `<div style="border-top:.5px solid var(--b);margin-top:14px;padding-top:10px;">`;
      h += `<div class="stat-sub-hdr" style="margin-top:0;margin-bottom:8px;">By shot difficulty</div>`;
      levels.forEach(intensity => {
        const lvl = ratedEvts.filter(e => (e.gkIntensity || 3) === intensity);
        const sv = lvl.filter(e => e.gkOutcome === 'save').length;
        const pct = Math.round(sv / lvl.length * 100);
        const bc = pct >= 70 ? '#2E7D32' : pct >= 40 ? '#F59E0B' : '#C62828';
        h += `<div style="display:flex;align-items:center;gap:8px;padding:3px 0;">`;
        h += html`<div style="font-size:12px;color:var(--t2);min-width:96px;">${intensityLabels[intensity]}</div>`;
        h += `<div style="flex:1;background:var(--bg3);border-radius:3px;overflow:hidden;height:6px;"><div style="background:${bc};width:${pct}%;height:100%;border-radius:3px;"></div></div>`;
        h += `<div style="font-size:12px;font-weight:600;color:${bc};min-width:36px;text-align:right;">${sv}/${lvl.length}</div>`;
        h += `</div>`;
      });
      h += `</div>`;
    }
  }

  h += '</div></div>';
  return h;
}

// ─── OPPOSITION SCORING PROFILE ───────────────────────────────────────────────
function buildOppScorerHTML() {
  if (!state.trackOppScorers) return '';
  const scorerEvts = state.evts.filter(e => e.oppScorer);
  if (scorerEvts.length === 0) return '';

  // Aggregate by position label
  const map = {}; // label → { num, label, goals, pts }
  scorerEvts.forEach(e => {
    const s = e.oppScorer;
    const key = s.label + ' (' + s.num + ')';
    if (!map[key]) map[key] = { num: s.num, label: s.label, goals: 0, pts: 0 };
    const action = e.action || '';
    if (action === 'Goal')    map[key].goals++;
    else if (action === '2 Point') map[key].pts += 2;
    else                      map[key].pts++;
  });

  const rows = Object.values(map).sort((a, b) => {
    const ta = a.goals * 3 + a.pts, tb = b.goals * 3 + b.pts;
    return tb !== ta ? tb - ta : a.num - b.num;
  });

  let h = '<div class="stat-section"><div class="stat-section-title">Opposition Scoring Profile</div>';
  h += '<div class="stat-card" style="padding:0;overflow:hidden;">';

  rows.forEach((r, i) => {
    const total = r.goals * 3 + r.pts;
    const scoreStr = r.goals + '-' + r.pts;
    const border = i < rows.length - 1 ? 'border-bottom:.5px solid var(--b);' : '';
    h += `<div style="display:flex;align-items:center;gap:10px;padding:10px 14px;${border}">`;
    h += `<div style="width:28px;height:28px;border-radius:50%;background:#6A1B9A22;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:#6A1B9A;flex-shrink:0;">${r.num}</div>`;
    h += `<div style="flex:1;min-width:0;">`;
    h += `<div style="font-size:13px;font-weight:600;color:var(--t1);">${esc(r.label)}</div>`;
    h += `<div style="font-size:11px;color:var(--t2);">${scoreStr} &nbsp;·&nbsp; ${total} pt${total !== 1 ? 's' : ''}</div>`;
    h += `</div>`;
    // Mini bar scaled to max total
    const maxTot = rows[0].goals * 3 + rows[0].pts;
    const pct = maxTot > 0 ? Math.round(total / maxTot * 100) : 0;
    h += `<div style="width:60px;background:var(--bg3);border-radius:3px;overflow:hidden;height:6px;">`;
    h += `<div style="background:#6A1B9A;width:${pct}%;height:100%;border-radius:3px;"></div></div>`;
    h += `</div>`;
  });

  h += '</div></div>';
  return h;
}

// ─── STATS PANEL ──────────────────────────────────────────────────────────────
function openStats() {
  renderStats();
  document.getElementById('match-notes-input').value = state.matchNotes || '';
  _activateStatsTab('stats');
  document.getElementById('statsoverlay').classList.add('open');
  document.getElementById('statspanel').classList.add('open');
}

function closeStats() {
  document.getElementById('statsoverlay').classList.remove('open');
  document.getElementById('statspanel').classList.remove('open');
}

function _activateStatsTab(tab) {
  const isStats = tab === 'stats';
  document.querySelectorAll('.stats-tab').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  document.getElementById('stats-content').style.display   = isStats ? '' : 'none';
  document.getElementById('stats-notes-wrap').style.display = isStats ? '' : 'none';
  document.getElementById('assess-content').style.display  = isStats ? 'none' : '';
}

function switchStatsTab(tab) {
  _activateStatsTab(tab);
  if (tab === 'assess') renderAssessment();
}

function renderStats() {
  // eslint-disable-next-line no-restricted-syntax -- safe: buildStatsHTML() only uses internal counters, no user data interpolated
  document.getElementById('stats-content').innerHTML = buildStatsHTML();
}

function buildStatsHTML() {
  const {
    pstats, wonCategories, lostCategories,
    goalCount, ptCount, twoPtCount, wideCount,
    placedGoals, placedPts, placedTwoPts, placedWides,
    turnoversWon, turnoversLost,
    ownWon, ownLost, ownUnclear, oppWon, oppLost, oppUnclear,
    freesConc, freesScored,
  } = aggregateMatchStats(state.evts, state.trackTurnovers, state.slotp, pl);

  const totalScoreActions = goalCount + ptCount + twoPtCount;
  const totalAttempts = totalScoreActions + wideCount;
  const scorePct = totalAttempts > 0 ? Math.round(totalScoreActions / totalAttempts * 100) : 0;
  const totalPts = goalCount*3 + ptCount + twoPtCount*2;
  const displayPts = ptCount + twoPtCount*2;
  const placedScoreCount = placedGoals + placedPts + placedTwoPts;
  const placedAttempts = placedScoreCount + placedWides;
  const placedPct = placedAttempts > 0 ? Math.round(placedScoreCount / placedAttempts * 100) : 0;
  const totalTurnovers = turnoversWon + turnoversLost;
  const ownTotal = ownWon + ownLost + ownUnclear;
  const oppTotal = oppWon + oppLost + oppUnclear;

  if (!totalAttempts && !ownTotal && !oppTotal && !state.og && !state.op_) {
    return '<div style="text-align:center;padding:48px 0 20px;font-size:14px;color:var(--t2);">No stats to show yet<br><span style="font-size:12px;">Start recording events to see stats here.</span></div>';
  }

  // Momentum calculation
  const {usPct, oppPct, momTotal} = calculateMomentum(state.goals, state.pts, state.og, state.op_, ownWon, oppWon, ownLost, oppLost, turnoversWon, turnoversLost);
  const dominant = usPct > oppPct ? state.usN : usPct < oppPct ? state.oppN : null;

  let h = '';
  h += buildTimelineHTML();

  // Momentum bar
  h += '<div class="stat-section"><div class="stat-section-title">Momentum</div>';
  h += '<div class="momentum-card">';
  h += '<div class="momentum-bar">';
  h += '<div class="momentum-us" style="width:'+usPct+'%"></div>';
  h += '<div class="momentum-opp"></div>';
  h += '</div>';
  h += '<div class="momentum-feet">';
  h += html`<div class="momentum-team">`;
  h += html`<span class="momentum-name" style="color:#2E7D32;">${state.usN}</span>`;
  h += `<span class="momentum-pct" style="color:#2E7D32;">${usPct}%</span>`;
  h += '</div>';
  h += html`<div class="momentum-team right">`;
  h += html`<span class="momentum-name">${state.oppN}</span>`;
  h += `<span class="momentum-pct" style="color:#6B6F66;">${oppPct}%</span>`;
  h += '</div>';
  h += '</div>';
  const basisNote = (ownTotal+oppTotal > 0 && totalTurnovers > 0) ? 'Scores + restarts + turnovers'
    : (ownTotal+oppTotal > 0) ? 'Scores + restarts won'
    : totalTurnovers > 0 ? 'Scores + turnovers'
    : 'Based on scores';
  const domNote = dominant ? ' &mdash; '+esc(dominant)+' dominant' : '';
  h += '<div class="momentum-basis">'+basisNote+domNote+'</div>';
  h += '</div></div>';

  // Scoring + Placed Balls
  h += '<div class="stat-section"><div class="stat-section-title">Scoring</div><div class="stat-card">';
  h += '<div class="stat-big">'+goalCount+'-'+displayPts+' <span style="font-size:15px;font-weight:500;color:var(--t2);">('+totalPts+'pts)</span></div>';
  h += '<div class="stat-big-sub">'+totalScoreActions+' score'+(totalScoreActions!==1?'s':'')+' from '+totalAttempts+' attempt'+(totalAttempts!==1?'s':'')+' &mdash; '+scorePct+'% conversion</div>';
  if (totalAttempts > 0) {
    const bt = totalAttempts;
    const gw = goalCount/bt*100, tw = twoPtCount/bt*100, pw = ptCount/bt*100, ww = wideCount/bt*100;
    h += '<div class="stat-attempt-bar">';
    if (gw > 0) h += '<div class="stat-attempt-seg" style="width:'+gw+'%;background:#2E7D32;"></div>';
    if (tw > 0) h += '<div class="stat-attempt-seg" style="width:'+tw+'%;background:#D97706;"></div>';
    if (pw > 0) h += '<div class="stat-attempt-seg" style="width:'+pw+'%;background:#C8CAC4;"></div>';
    if (ww > 0) h += '<div class="stat-attempt-seg" style="width:'+ww+'%;background:#9E9E9E;"></div>';
    h += '</div>';
    h += '<div class="stat-legend">';
    if (goalCount > 0)  h += '<span class="stat-legend-item"><span class="stat-legend-dot" style="background:#2E7D32;"></span>'+goalCount+' goal'+(goalCount!==1?'s':'')+'</span>';
    if (twoPtCount > 0) h += '<span class="stat-legend-item"><span class="stat-legend-dot" style="background:#D97706;"></span>'+twoPtCount+' 2-ptr'+(twoPtCount!==1?'s':'')+'</span>';
    if (ptCount > 0)    h += '<span class="stat-legend-item"><span class="stat-legend-dot" style="background:#C8CAC4;border:.5px solid var(--b);"></span>'+ptCount+' point'+(ptCount!==1?'s':'')+'</span>';
    if (wideCount > 0)  h += '<span class="stat-legend-item"><span class="stat-legend-dot" style="background:#9E9E9E;"></span>'+wideCount+' wide'+(wideCount!==1?'s':'')+'</span>';
    h += '</div>';
  }
  if (placedAttempts > 0) {
    h += '<div style="border-top:.5px solid var(--b);margin:12px 0 10px;"></div>';
    h += '<div class="stat-sub-hdr" style="margin-top:0;">Placed Balls</div>';
    const ringGrad = 'conic-gradient(#2E7D32 '+placedPct+'%, var(--bg3) 0%)';
    h += '<div class="stat-ring-wrap">';
    h += '<div class="stat-ring" style="background:'+ringGrad+';">';
    h += '<div class="stat-ring-inner"><div class="stat-ring-pct">'+placedPct+'%</div><div class="stat-ring-lbl">conv.</div></div>';
    h += '</div>';
    h += '<div style="flex:1;">';
    h += '<div style="font-size:16px;font-weight:700;color:#2E7D32;line-height:1.2;">'+placedScoreCount+' converted</div>';
    h += '<div style="font-size:12px;color:var(--t2);margin-top:2px;">from '+placedAttempts+' attempt'+(placedAttempts!==1?'s':'')+'</div>';
    if (placedWides > 0) h += '<div style="font-size:12px;color:var(--t2);margin-top:6px;">'+placedWides+' placed ball wide'+(placedWides!==1?'s':'')+'</div>';
    h += '</div></div>';
  }
  h += '</div></div>';

  // Player Scoring
  const scorers = getScorers(pstats);
  if (scorers.length > 0) {
    h += '<div class="stat-section"><div class="stat-section-title">Player Scoring</div><div class="stat-card">';
    scorers.forEach(p => {
      const g = p.gPlay+p.gPlaced, pts = p.pPlay+p.pPlaced, total = g*3+pts;
      h += html`<div class="stat-prow"><div class="stat-pname">${p.name}</div>`;
      h += '<div class="stat-ptags">';
      if (g > 0 || pts > 0) h += `<span class="stat-tag green">${g}-${pts} (${total})</span>`;
      if (p.wides > 0) h += `<span class="stat-tag grey">${p.wides} wide${p.wides!==1?'s':''}</span>`;
      h += '</div></div>';
    });
    h += '</div></div>';
  }

  // Shot Map
  if (state.trackShotLocations) {
    const smHtml = buildShotMapHTML();
    if (smHtml) h += smHtml;
  }

  // Turnovers
  if (totalTurnovers > 0) {
    const wonPct = Math.round(turnoversWon / totalTurnovers * 100);
    h += '<div class="stat-section"><div class="stat-section-title">Turnovers</div><div class="stat-card">';
    h += '<div style="display:flex;gap:12px;align-items:center;padding:4px 0 10px;">';
    h += '<div style="flex:1;text-align:center;"><div style="font-size:24px;font-weight:700;color:#2E7D32;line-height:1;">'+turnoversWon+'</div><div style="font-size:11px;color:var(--t2);margin-top:2px;">Won</div></div>';
    h += '<div style="flex:1;text-align:center;"><div style="font-size:24px;font-weight:700;color:#C62828;line-height:1;">'+turnoversLost+'</div><div style="font-size:11px;color:var(--t2);margin-top:2px;">Lost</div></div>';
    h += '</div>';
    h += '<div class="stat-split-bar"><div class="stat-split-won" style="width:'+wonPct+'%"></div></div>';
    h += '<div class="stat-split-labels"><span style="color:#2E7D32;font-weight:600;">'+wonPct+'% won</span><span style="color:#C62828;font-weight:600;">'+(100-wonPct)+'% lost</span></div>';
    const twPlayers = Object.values(pstats).filter(p=>p.twon+p.tlost>0).sort((a,b)=>(b.twon-b.tlost)-(a.twon-a.tlost)||a.name.localeCompare(b.name));
    if (twPlayers.length) {
      h += '<div style="border-top:.5px solid var(--b);margin-top:10px;padding-top:6px;">';
      twPlayers.forEach(p => {
        h += html`<div class="stat-prow"><div class="stat-pname">${p.name}</div><div class="stat-ptags">`;
        if (p.twon  > 0) h += `<span class="stat-tag green">+${p.twon}</span>`;
        if (p.tlost > 0) h += `<span class="stat-tag red">-${p.tlost}</span>`;
        h += '</div></div>';
        if (state.trackTurnovers) {
          const wonSecs  = Object.entries(p.twonSec).sort((a,b)=>b[1]-a[1]);
          const lostSecs = Object.entries(p.tlostSec).sort((a,b)=>b[1]-a[1]);
          if (wonSecs.length || lostSecs.length) {
            h += '<div style="display:flex;gap:6px;flex-wrap:wrap;padding:2px 0 6px 2px;">';
            wonSecs.forEach(([cat,n])  => h += `<span class="stat-tag green" style="font-size:10px;">${esc(cat)}${n>1?' ×'+n:''}</span>`);
            lostSecs.forEach(([cat,n]) => h += `<span class="stat-tag red"   style="font-size:10px;">${esc(cat)}${n>1?' ×'+n:''}</span>`);
            h += '</div>';
          }
        }
      });
      h += '</div>';
    }
    // Donut charts — only when detailed tracking is on and there is categorised data
    if (state.trackTurnovers) {
      const wonEntries  = Object.entries(wonCategories);
      const lostEntries = Object.entries(lostCategories);
      if (wonEntries.length || lostEntries.length) {
        const WON_COLORS  = {'First to the Ball':'#1B5E20','Tackle Turnover':'#388E3C','Block':'#66BB6A','Hook':'#00897B','Defensive Pressure':'#A5D6A7'};
        const LOST_COLORS = {'Poor Pass':'#B71C1C','Lost in Tackle':CARD_RED,'Second to the Ball':'#EF9A9A','Over Played':'#E65100','Isolated':'#FFAB91'};
        h += '<div style="border-top:.5px solid var(--b);margin-top:12px;padding-top:12px;display:flex;gap:8px;justify-content:space-around;flex-wrap:wrap;">';
        if (wonEntries.length)  h += buildTurnoverDonut('Won by type',  wonEntries,  WON_COLORS,  '#2E7D32');
        if (lostEntries.length) h += buildTurnoverDonut('Lost by type', lostEntries, LOST_COLORS, '#C62828');
        h += '</div>';
      }
    }
    h += '</div></div>';
  }

  // Restarts
  const rstLabel = state.sport === 'hurling' ? 'Puck Out' : 'Kickout';
  h += '<div class="stat-section"><div class="stat-section-title">Restarts</div><div class="stat-card">';
  h += rstBlock('Own '+rstLabel+'s', ownWon, ownLost, ownUnclear, ownTotal);
  h += '<div style="border-top:.5px solid var(--b);margin:6px 0 10px;"></div>';
  h += rstBlock('Opposition '+rstLabel+'s', oppWon, oppLost, oppUnclear, oppTotal);
  h += '</div></div>';

  // Goalkeeper Performance
  const gkStatHtml = buildGKStatHTML();
  if (gkStatHtml) h += gkStatHtml;

  // Opposition Scoring Profile
  const oscHtml = buildOppScorerHTML();
  if (oscHtml) h += oscHtml;

  // Discipline
  const discPlayers = getDiscPlayers(pstats);
  if (discPlayers.length > 0 || freesConc > 0) {
    h += '<div class="stat-section"><div class="stat-section-title">Discipline</div>';
    if (freesConc > 0) {
      h += '<div style="display:flex;gap:16px;padding:4px 0 10px;align-items:baseline;">';
      h += `<span style="font-size:13px;color:var(--t2);">Frees conceded: <strong style="color:var(--t1);">${freesConc}</strong></span>`;
      if (freesScored > 0) h += `<span style="font-size:13px;color:#C62828;font-weight:600;">${freesScored} scored by opposition</span>`;
      h += '</div>';
    }
    if (discPlayers.length > 0) {
      h += '<div class="stat-card">';
      discPlayers.forEach(p => {
        const freeTotal = Object.values(p.frees).reduce((s,n)=>s+n,0);
        h += '<div class="disc-row">';
        if (p.yc+p.bc+p.rc > 0) {
          h += '<span style="display:flex;gap:3px;flex-shrink:0;">';
          for (let i=0;i<p.yc;i++) h += `<span class="disc-chip" style="background:${CARD_YELLOW};" title="Yellow Card"></span>`;
          for (let i=0;i<p.bc;i++) h += `<span class="disc-chip" style="background:${CARD_BLACK};" title="Black Card"></span>`;
          for (let i=0;i<p.rc;i++) h += `<span class="disc-chip" style="background:${CARD_RED};" title="Red Card"></span>`;
          h += '</span>';
        }
        h += html`<span class="stat-pname" style="flex:1;">${p.name}</span>`;
        if (freeTotal > 0) {
          h += '<span class="stat-ptags">';
          h += `<span class="stat-tag grey">${freeTotal} free${freeTotal!==1?'s':''}</span>`;
          Object.entries(p.frees).sort((a,b)=>b[1]-a[1]).forEach(([type,n]) => {
            h += `<span class="stat-tag grey">${esc(type)}${n>1?' ×'+n:''}</span>`;
          });
          h += '</span>';
        }
        h += '</div>';
      });
      h += '</div>';
    }
    h += '</div>';
  }

  // Substitutions
  h += buildSubTableHTML();

  // Play Time
  h += buildPlayTimeHTML();

  return h;
}

// ─── SHOT MAP ─────────────────────────────────────────────────────────────────
function buildShotMapHTML() {
  const shotActs = new Set(['Goal','Point','2 Point','Wide','Short','Saved']);
  let inH2 = false;
  const shots = [];
  state.evts.forEach(ev => {
    if (ev.badge === '1H') { if ((ev.desc||'').includes('ended')) inH2 = true; return; }
    if (!shotActs.has(ev.action) || !ev.zone) return;
    const pi = ev.pi != null ? ev.pi : (ev.slot != null ? state.slotp[ev.slot] : null);
    shots.push({ action: ev.action, zone: ev.zone, team: ev.slot != null ? 'us' : 'opp', half: inH2 ? 'h2' : 'h1', slot: ev.slot != null ? ev.slot : null, pi, placed: PLACED_BALL.has(ev.sec), sec: ev.sec });
  });

  if (shots.length === 0) return '';

  const seenPi = new Set();
  const playerList = [];
  shots.forEach(s => { if (s.pi != null && !seenPi.has(s.pi)) { seenPi.add(s.pi); playerList.push(s.pi); } });
  playerList.sort((a,b) => a - b);

  if (shotMapPlayerFilter !== 'all' && !seenPi.has(Number(shotMapPlayerFilter))) shotMapPlayerFilter = 'all';

  const filtered = shots.filter(s => {
    if (shotMapHalfFilter !== 'all' && s.half !== shotMapHalfFilter) return false;
    if (shotMapPlayerFilter !== 'all' && String(s.pi) !== String(shotMapPlayerFilter)) return false;
    return true;
  });

  const { dots, thirds } = computeShotDots(filtered, pi => esc(gi(pi)));
  const svg = `<svg viewBox="0 0 320 400" xmlns="http://www.w3.org/2000/svg" style="width:100%;border-radius:8px;" preserveAspectRatio="xMidYMid meet">${PITCH_SVG_INNER}${dots}</svg>`;

  const hChip = (val,label) => `<button class="zone-chip${shotMapHalfFilter===val?' active':''}" onclick="setShotMapFilter('half','${val}')">${label}</button>`;
  const pChip = (val,label) => `<button class="zone-chip${String(shotMapPlayerFilter)===String(val)?' active':''}" onclick="setShotMapFilter('player','${val}')">${label}</button>`;

  let h = '<div id="shot-map-section" class="stat-section">';
  h += '<div class="stat-section-title">Shot Map</div>';
  h += '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px;">';
  h += hChip('all','Full Match')+hChip('h1','H1')+hChip('h2','H2');
  h += '</div>';
  if (playerList.length > 0) {
    h += '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px;">';
    h += pChip('all','All');
    playerList.forEach(pi => { h += pChip(pi, esc(gi(pi))); });
    h += '</div>';
  }
  h += `<div style="border-radius:8px;overflow:hidden;margin-bottom:8px;">${svg}</div>`;
  h += '<div style="display:flex;gap:14px;flex-wrap:wrap;margin-bottom:10px;font-size:12px;color:var(--t2);align-items:center;">';
  h += '<span style="display:flex;align-items:center;gap:4px;"><svg width="12" height="12"><circle cx="6" cy="6" r="5" fill="#2E7D32" opacity=".82"/></svg>Score</span>';
  h += '<span style="display:flex;align-items:center;gap:4px;"><svg width="12" height="12"><circle cx="6" cy="6" r="5" fill="#C62828" opacity=".82"/></svg>Wide</span>';
  h += '<span style="display:flex;align-items:center;gap:4px;"><svg width="12" height="12"><circle cx="6" cy="6" r="5" fill="#9E9E9E" opacity=".82"/></svg>Short</span>';
  h += '<span style="display:flex;align-items:center;gap:4px;"><svg width="12" height="12"><circle cx="6" cy="6" r="5" fill="#F97316" opacity=".82"/></svg>Saved</span>';
  h += '<span style="display:flex;align-items:center;gap:4px;"><svg width="14" height="14"><circle cx="7" cy="7" r="6" fill="#2E7D32" opacity=".82" stroke="white" stroke-width="1"/></svg>Goal</span>';
  h += '<span style="display:flex;align-items:center;gap:4px;"><svg width="18" height="18"><circle cx="9" cy="9" r="8" fill="none" stroke="#2E7D32" stroke-width="1.5" opacity=".7"/><circle cx="9" cy="9" r="5" fill="#2E7D32" opacity=".82" stroke="white" stroke-width="1"/></svg>Placed</span>';
  h += '</div>';

  const thirdRows = [['Attacking third',thirds.att],['Middle third',thirds.mid],['Defensive third',thirds.def]];
  const hasData = thirdRows.some(([,d]) => d.shots > 0);
  if (hasData) {
    h += '<table style="width:100%;font-size:12px;border-collapse:collapse;">';
    h += '<tr style="color:var(--t3);font-size:11px;"><th style="text-align:left;padding:4px 0;font-weight:500;">Zone</th><th style="text-align:center;font-weight:500;">Shots</th><th style="text-align:center;font-weight:500;">Scores</th><th style="text-align:center;font-weight:500;">Conv%</th></tr>';
    thirdRows.forEach(([label,d]) => {
      if (d.shots === 0) return;
      h += `<tr><td style="padding:3px 0;color:var(--t2);">${label}</td><td style="text-align:center;color:var(--t1);">${d.shots}</td><td style="text-align:center;color:var(--t1);">${d.scores}</td><td style="text-align:center;font-weight:600;color:var(--ti);">${pct(d.scores,d.shots)}</td></tr>`;
    });
    h += '</table>';
  }

  h += '</div>';
  return h;
}

function setShotMapFilter(key, val) {
  if (key === 'half') shotMapHalfFilter = val;
  if (key === 'player') shotMapPlayerFilter = val;
  const section = document.getElementById('shot-map-section');
  if (section) section.outerHTML = buildShotMapHTML();
}

// ─── TEAM ASSESSMENT ──────────────────────────────────────────────────────────
const _ASSESS_DIMS = [
  { key:'effort',     label:'Effort',     desc:'Workrate, hunger, off-the-ball running' },
  { key:'skill',      label:'Skill',      desc:'Basics: passing, kicking, first touch' },
  { key:'tactics',    label:'Tactics',    desc:'Shape, gameplan, set-piece execution' },
  { key:'intensity',  label:'Intensity',  desc:'Physicality, tackling, ball-winning' },
  { key:'discipline', label:'Discipline', desc:'Composure, frees conceded, cards' },
  { key:'spirit',     label:'Spirit',     desc:'Attitude, response to setbacks' },
];
const _ASSESS_COLOURS = ['#C8E6C9','#81C784','#4CAF50','#388E3C','#1B5E20'];

function assessRate(key, val) {
  if (!state.teamAssessment) state.teamAssessment = { effort:0, skill:0, tactics:0, intensity:0, discipline:0, spirit:0, notes:'' };
  state.teamAssessment[key] = (state.teamAssessment[key] === val) ? 0 : val;
  saveState();
  renderAssessment();
}

function renderAssessment() {
  if (!state.teamAssessment) state.teamAssessment = { effort:0, skill:0, tactics:0, intensity:0, discipline:0, spirit:0, notes:'' };
  const ta = state.teamAssessment;
  const rated = _ASSESS_DIMS.filter(d => (ta[d.key] || 0) > 0);
  const avg   = rated.length > 0
    ? (rated.reduce((s, d) => s + ta[d.key], 0) / rated.length).toFixed(1)
    : null;

  let h = '<div class="assess-wrap"><div class="assess-q">How did the team perform?</div>';
  h += '<div class="assess-card">';
  _ASSESS_DIMS.forEach((dim, i) => {
    const val = ta[dim.key] || 0;
    const border = i < _ASSESS_DIMS.length - 1 ? ' assess-row-border' : '';
    h += `<div class="assess-row${border}"><div class="assess-row-info">`;
    h += `<div class="assess-dim-name">${esc(dim.label)}</div>`;
    h += `<div class="assess-dim-desc">${esc(dim.desc)}</div></div>`;
    h += '<div class="assess-dots">';
    for (let v = 1; v <= 5; v++) {
      const colour = v <= val ? _ASSESS_COLOURS[v - 1] : '#D5D5D5';
      const sel    = v === val ? ' assess-dot-sel' : '';
      h += `<div class="assess-dot${sel}" style="background:${colour};" onclick="assessRate('${dim.key}',${v})"></div>`;
    }
    h += '</div></div>';
  });
  h += '</div>';

  h += '<div class="assess-card assess-notes-card">';
  h += '<div class="assess-notes-label">Coach notes (optional)</div>';
  h += `<textarea class="assess-notes-input" rows="3" placeholder="A line or two on the match — anything you’ll want to remember in 6 weeks…" oninput="if(!state.teamAssessment)state.teamAssessment={};state.teamAssessment.notes=this.value;saveState()">${esc(ta.notes || '')}</textarea>`;
  h += '</div>';

  h += '<div class="assess-card assess-overall-card">';
  h += '<div><div class="assess-overall-lbl">Overall rating</div>';
  const dimWord = rated.length === 1 ? 'dimension' : 'dimensions';
  h += `<div class="assess-overall-sub">Average of ${rated.length} ${dimWord} rated</div></div>`;
  h += `<div class="assess-overall-val">${avg !== null ? avg + '<span>/5</span>' : '—'}</div>`;
  h += '</div>';

  h += '</div>';

  // eslint-disable-next-line no-restricted-syntax -- safe: all user data passed through esc()
  document.getElementById('assess-content').innerHTML = h;
}
