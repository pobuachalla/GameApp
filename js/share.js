'use strict';

// ─── SHARE ────────────────────────────────────────────────────────────────────
function shareWA() {
  const u=usTotal(), o=oppTotal();
  const lines=['*'+state.usN+': '+state.goals+'-'+state.pts+' ('+u+') v '+state.oppN+': '+state.og+'-'+state.op_+' ('+o+')*','*Time: '+fmt(state.secs)+'*',''];
  state.evts.forEach(e => lines.push(e.time+'  '+e.desc));
  window.open('https://wa.me/?text='+encodeURIComponent(lines.join('\n')),'_blank');
}

function shareCSV() {
  // Quote, and neutralise leading =+-@ so player names can't become live
  // formulas when the CSV is opened in Excel/Sheets
  const csvEsc = v => {
    let s = String(v||'').replace(/"/g,'""');
    if (/^[=+\-@]/.test(s)) s = "'" + s;
    return '"' + s + '"';
  };
  const rows = [['Time','Event','Description','Action','Type','zone_id','zone_x','zone_y','gk_outcome','gk_intensity','gk_save_score','gk_final_value']];
  state.evts.forEach(e => rows.push([
    e.time, e.badge, e.desc,
    e.action||'', e.sec||'',
    e.zone?e.zone.id:'', e.zone?e.zone.coords.x.toFixed(4):'', e.zone?e.zone.coords.y.toFixed(4):'',
    e.gkOutcome||'', e.gkIntensity??'', e.gkSaveScore??'', e.gkFinalValue??''
  ]));
  if (state.trackGameTime) {
    const { ptMap } = computePlayTimes();
    const ptRows = Object.entries(ptMap)
      .map(([pi, t]) => ({pi:+pi, name:gn(+pi), t}))
      .filter(r => r.name)
      .sort((a, b) => b.t - a.t || a.name.localeCompare(b.name));
    if (ptRows.length) {
      const startPis = new Set(Object.values(state.startSlotp || {}).map(Number));
      rows.push([]);
      rows.push(['player','role','minutes_played','seconds_played','','','','','','','','']);
      ptRows.forEach(r => rows.push([r.name, startPis.has(r.pi) ? 'starter' : 'sub', formatSeconds(r.t), r.t, '','','','','','','','']));
    }
  }
  const csv = rows.map(r => r.map(csvEsc).join(',')).join('\r\n');
  const filename = _buildFilenameBase() + '.csv';
  const blob = new Blob([csv], {type:'text/csv'});
  if (navigator.share && navigator.canShare && navigator.canShare({files:[new File([blob],filename,{type:'text/csv'})]})) {
    navigator.share({files:[new File([blob],filename,{type:'text/csv'})], title:filename})
      .catch(()=>{});
  } else {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    setTimeout(()=>URL.revokeObjectURL(a.href),10000);
  }
}

// ─── SCORE GRAPHIC ────────────────────────────────────────────────────────────
function _scorerGraphicLine(evts) {
  evts = evts || state.evts;
  const scorers = {};
  evts.forEach(ev => {
    if (!ev.slot || !ev.action) return;
    const a = ev.action;
    if (a !== 'Goal' && a !== 'Point' && a !== '2 Point') return;
    const pi = ev.pi != null ? ev.pi : state.slotp[ev.slot];
    if (!pi) return;
    if (!scorers[pi]) scorers[pi] = {name: gn(pi) || ('#' + pi), g: 0, p: 0};
    if (a === 'Goal')    scorers[pi].g++;
    if (a === 'Point')   scorers[pi].p++;
    if (a === '2 Point') scorers[pi].p += 2;
  });
  return Object.values(scorers)
    .filter(s => s.g + s.p > 0)
    .sort((a, b) => (b.g * 3 + b.p) - (a.g * 3 + a.p))
    .map(s => esc(s.name) + ' ' + s.g + '–' + pad(s.p))
    .join(' · ');
}

function _firstHalfEvts() {
  const out = [];
  for (const ev of state.evts) {
    if (ev.badge === '1H' && (ev.desc || '').includes('ended')) break;
    out.push(ev);
  }
  return out;
}

function _scoreOutcome(label, u, o) {
  const diff = Math.abs(u - o);
  const pts = diff + ' pt' + (diff !== 1 ? 's' : '');
  const verb = label === 'FT' ? ' win' : ' lead';
  if (u > o) return esc(state.usN) + verb + ' by ' + pts;
  if (o > u) return esc(state.oppN) + verb + ' by ' + pts;
  return label === 'FT' ? 'Draw' : 'Level';
}

function _crestEl(src, name) {
  const initials = (name || '').split(/[\s/-]+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?';
  const fbStyle = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;'
    + 'font-size:18px;font-weight:700;color:#BBBBB4;font-family:Arial,sans-serif;';
  const wrap = 'position:relative;width:60px;height:60px;flex-shrink:0;';
  if (!src) return `<div style="${wrap}"><div style="${fbStyle}">${esc(initials)}</div></div>`;
  return `<div style="${wrap}"><div style="${fbStyle}">${esc(initials)}</div>`
    + `<img src="${esc(src)}" alt="${esc(name)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;" onerror="this.style.display='none'"></div>`;
}

// Pair variant for amalgam clubs — two crests stacked inside the same 60×60 container.
function _crestElPair(src1, src2, name) {
  const initials = (name || '').split(/[\s/-]+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?';
  const fbStyle = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;'
    + 'font-size:18px;font-weight:700;color:#BBBBB4;font-family:Arial,sans-serif;';
  const wrap = 'position:relative;width:60px;height:60px;flex-shrink:0;';
  const n = esc(name);
  return `<div style="${wrap}"><div style="${fbStyle}">${esc(initials)}</div>`
    + `<img src="${esc(src1)}" alt="${n}" style="position:absolute;top:0;left:0;width:38px;height:38px;object-fit:contain;" onerror="this.style.display='none'">`
    + `<img src="${esc(src2)}" alt="${n}" style="position:absolute;bottom:0;right:0;width:42px;height:42px;object-fit:contain;" onerror="this.style.display='none'">`
    + '</div>';
}

function _teamCrestEl(name) {
  const pair = name ? findAmalgamPair(name) : null;
  if (pair) return _crestElPair(pair[0].crest, pair[1].crest, name);
  return _crestEl(_teamCrest(name || '') || null, name || '');
}

function _htmlNameFS(name) {
  const l = (name || '').length;
  if (l <= 8)  return '16px';
  if (l <= 13) return '13px';
  return '11px';
}

function _buildScoreGraphicHTML(label) {
  const isHT = label === 'HT';
  const isFT = label === 'FT';
  const isTime = !isHT && !isFT;

  // Use score snapshots for HT/FT so second-half scoring doesn't bleed in
  let g, p, og, op;
  if (isHT) {
    g = state.htGoals ?? state.goals; p  = state.htPts ?? state.pts;
    og = state.htOg   ?? state.og;    op = state.htOp  ?? state.op_;
  } else if (isFT) {
    g = state.ftGoals ?? state.goals; p  = state.ftPts ?? state.pts;
    og = state.ftOg   ?? state.og;    op = state.ftOp  ?? state.op_;
  } else {
    g = state.goals; p = state.pts; og = state.og; op = state.op_;
  }
  const usT = g * 3 + p, oppT = og * 3 + op;
  const usFmt  = g  + '–' + pad(p);
  const oppFmt = og + '–' + pad(op);
  const outcome    = _scoreOutcome(label, usT, oppT);
  const scorerLine = _scorerGraphicLine(isHT ? _firstHalfEvts() : state.evts);

  const dateStr  = matchDisplayDate().toLocaleDateString('en-IE', {weekday:'long', day:'numeric', month:'long', year:'numeric'}).toUpperCase();
  const compHtml = state.competition
    ? `<div style="font-size:13px;font-weight:700;color:#1F5B3A;margin-bottom:3px;">${esc(state.competition)}</div>` : '';
  const venueHtml = state.location
    ? `<div style="font-size:13px;color:#888;margin-top:2px;">${esc(state.location)}</div>` : '';

  const teamCol = (name, scoreFmt, total) =>
    `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:6px;min-width:0;">`
    + _teamCrestEl(name)
    + `<div style="font-size:${_htmlNameFS(name)};font-weight:800;color:#1F2A24;text-align:center;`
    + `letter-spacing:0.5px;text-transform:uppercase;line-height:1.2;word-break:break-word;">${esc(name || '')}</div>`
    + `<div style="font-size:40px;font-weight:900;color:#111;line-height:1;">${scoreFmt}</div>`
    + `<div style="font-size:15px;font-weight:600;color:#8B8B84;">(${total})</div></div>`;

  const labelFS = isTime ? (label.length > 3 ? '20px' : '24px') : '28px';
  let periodHtml = `<div style="font-size:${labelFS};font-weight:800;color:#3E4A42;line-height:1;">${esc(label)}</div>`;
  if (isHT) {
    periodHtml += `<div style="font-size:8px;letter-spacing:2px;color:#AAA;text-transform:uppercase;">HALF</div>`
      + `<div style="font-size:8px;letter-spacing:2px;color:#AAA;text-transform:uppercase;">TIME</div>`;
  } else if (isFT) {
    periodHtml += `<div style="font-size:8px;letter-spacing:2px;color:#AAA;text-transform:uppercase;">FULL</div>`
      + `<div style="font-size:8px;letter-spacing:2px;color:#AAA;text-transform:uppercase;">TIME</div>`;
  } else {
    periodHtml += `<div style="font-size:8px;letter-spacing:2px;color:#AAA;text-transform:uppercase;">MINS</div>`;
  }

  const scorersHtml = scorerLine
    ? `<div style="border-top:1px solid #EBEBEB;padding-top:10px;margin-top:2px;">`
      + `<div style="font-size:10px;font-weight:800;letter-spacing:2px;color:#1F2A24;text-transform:uppercase;margin-bottom:5px;">Scorers</div>`
      + `<div style="font-size:14px;color:#333;line-height:1.5;">${scorerLine}</div></div>`
    : '';

  return `<div style="background:#fff;border-radius:20px;padding:20px;box-shadow:0 2px 24px rgba(0,0,0,0.10);overflow:hidden;">`
    + `<div style="text-align:center;margin-bottom:16px;padding-bottom:14px;border-bottom:1px solid #EBEBEB;">`
    + compHtml
    + `<div style="font-size:11px;font-weight:700;letter-spacing:1.5px;color:#AAA;text-transform:uppercase;">${dateStr}</div>`
    + venueHtml + `</div>`
    + `<div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:16px;">`
    + teamCol(state.usN, usFmt, usT)
    + `<div style="flex-shrink:0;width:52px;display:flex;flex-direction:column;align-items:center;gap:2px;padding-top:16px;">`
    + periodHtml + `</div>`
    + teamCol(state.oppN, oppFmt, oppT)
    + `</div>`
    + `<div style="background:#F3F3EF;border-radius:14px;padding:10px 14px;text-align:center;margin-bottom:${scorerLine ? '12px' : '0'};">`
    + `<div style="font-size:14px;font-weight:700;color:#333;overflow-wrap:break-word;">${outcome}</div></div>`
    + scorersHtml
    + `<div style="margin:14px -20px -20px;height:8px;background:#1F5B3A;"></div></div>`;
}

function showScoreGraphic(label) {
  // eslint-disable-next-line no-restricted-syntax -- safe: all user values through esc() inside builder
  document.getElementById('score-graphic-wrap').innerHTML = _buildScoreGraphicHTML(label);
  document.getElementById('score-graphic-panel').classList.add('open');
}

function closeScoreGraphic() {
  document.getElementById('score-graphic-panel').classList.remove('open');
}

function openCurrentScoreCard() {
  const secs = state.secs + (state.period === 2 ? 1800 : 0);
  showScoreGraphic(Math.floor(secs / 60) + "'");
}

// ─── LINEUP GRAPHIC ───────────────────────────────────────────────────────────
function _buildLineupGraphicHTML() {
  const layout = GRID_LAYOUTS[state.teamSize] || GRID_LAYOUTS[15];
  const slotp   = state.startSlotp   || state.slotp;
  const captain = state.startCaptain != null ? state.startCaptain : state.captain;

  // Header — same content and structure as openLayout()
  const oppName  = state.oppN && state.oppN !== 'Opposition' ? state.oppN : '';
  const dateStr  = matchDisplayDate().toLocaleDateString('en-IE', {weekday:'long', day:'numeric', month:'long', year:'numeric'});

  const usCrestHtml  = _resolveCrestHTML(state.usN);
  const oppCrestHtml = _resolveCrestHTML(oppName);

  let vsHtml = oppName ? `vs ${esc(oppName)}<br>` : '';
  vsHtml += `<span style="font-size:11px;">${esc(dateStr)}</span>`;
  if (state.location) vsHtml += `<br><span style="font-size:11px;">${esc(state.location)}</span>`;

  const header = `<div class="layout-team-hdr">`
    + `<div class="layout-hdr-crest">${usCrestHtml}</div>`
    + `<div class="layout-hdr-center">`
    +   `<div class="layout-team-name">${esc(state.usN || '')}</div>`
    +   `<div class="layout-vs">${vsHtml}</div>`
    + `</div>`
    + `<div class="layout-hdr-crest">${oppCrestHtml}</div>`
    + `</div>`;

  // Formation — same structure and CSS classes as renderLayout()
  let formation = '<div class="layout-formation">';
  layout.forEach(row => {
    formation += '<div class="layout-row">';
    row.forEach(slot => {
      const pi    = slotp ? (slotp[slot] || slot) : slot;
      const name  = gn(pi) || '';
      const isCap = captain === slot;
      const isGK  = slot === 1;
      formation += '<div class="layout-player">';
      formation += '<div class="layout-shirt-wrap">';
      if (isCap) formation += '<span class="layout-cap-badge">C</span>';
      formation += `<i class="fa-solid fa-shirt layout-shirt-icon" style="color:${isGK ? CARD_YELLOW : TEAM_US_COLOR};"></i>`;
      formation += `<span class="layout-shirt-num" style="color:${isGK ? TEAM_US_COLOR : '#fff'};">${pi}</span>`;
      formation += '</div>';
      formation += `<div class="layout-player-name">${esc(name || '—')}</div>`;
      formation += '</div>';
    });
    formation += '</div>';
  });
  formation += '</div>';

  // Subs — same structure as renderLayout()
  let subsHtml = '';
  // Exclude any bench player who started (pre-game sub)
  const startingPis = new Set(Object.values(slotp).map(Number));
  const subs = [];
  for (let i = 16; i <= (state.maxB || 16); i++) { const n = gn(i); if (n && !startingPis.has(i)) subs.push({idx: i, name: n}); }
  // Include pre-game replaced players (still part of the squad)
  Object.values(state.preGameSubs || {}).forEach(pi => { const n = gn(pi); if (n) subs.push({idx: pi, name: n}); });
  if (subs.length) {
    subsHtml += '<div class="layout-subs-wrap">';
    subsHtml += '<div class="layout-subs-title">Subs</div>';
    subsHtml += '<div class="layout-subs-grid">';
    subs.forEach(s => {
      subsHtml += '<div class="layout-sub-player">';
      subsHtml += '<div class="layout-sub-shirt-wrap">';
      subsHtml += '<i class="fa-solid fa-shirt layout-sub-shirt"></i>';
      subsHtml += `<span class="layout-sub-num">${s.idx}</span>`;
      subsHtml += '</div>';
      subsHtml += `<div class="layout-sub-name">${esc(s.name)}</div>`;
      subsHtml += '</div>';
    });
    subsHtml += '</div></div>';
  }

  return `<div style="background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 2px 24px rgba(0,0,0,0.10);">`
    + header
    + formation + subsHtml
    + `<div style="height:8px;background:#1F5B3A;"></div></div>`;
}

function showLineupGraphic() {
  // eslint-disable-next-line no-restricted-syntax -- safe: all user values through esc() inside builder
  document.getElementById('score-graphic-wrap').innerHTML = _buildLineupGraphicHTML();
  document.getElementById('score-graphic-panel').classList.add('open');
}

// ─── MATCH STORY GRAPHIC ──────────────────────────────────────────────────────
// Team-level comparison, generated at full time — "why the winner won", built
// entirely from data already captured during the match (see game-utils.js:
// computeOppScoreBreakdown, computeTurnoverScores).
function _matchStoryStats() {
  const {
    goalCount, ptCount, twoPtCount, wideCount,
    turnoversWon, turnoversLost,
    ownWon, ownLost, ownUnclear, oppWon, oppLost, oppUnclear,
  } = aggregateMatchStats(state.evts, state.trackTurnovers, state.slotp, pl);
  const oppB = computeOppScoreBreakdown(state.evts, state.oppN);
  const ts   = computeTurnoverScores(state.evts, state.oppN);

  return {
    us:  { goals: goalCount, twoPt: twoPtCount, pts: ptCount, wides: wideCount,
           total: goalCount * 3 + twoPtCount * 2 + ptCount },
    opp: { goals: oppB.goals, twoPt: oppB.twoPt, pts: oppB.pts, wides: oppB.wides,
           total: oppB.goals * 3 + oppB.twoPt * 2 + oppB.pts },
    ownRestarts: { usWon: ownWon, oppWon: ownLost, total: ownWon + ownLost + ownUnclear },
    oppRestarts: { usWon: oppWon, oppWon: oppLost, total: oppWon + oppLost + oppUnclear },
    turnovers: { won: turnoversWon, lost: turnoversLost },
    turnoverScores: ts,
  };
}

// Picks the single stat with the biggest proportional swing (as a % split
// between the two sides) that also favours whichever team actually won —
// the "standout number" callout. Returns null if nothing qualifies.
function _matchStoryHighlight(st, usWon) {
  const candidates = [];
  const koUs = st.ownRestarts.usWon + st.oppRestarts.usWon;
  const koOpp = st.ownRestarts.oppWon + st.oppRestarts.oppWon;
  if (koUs + koOpp > 0) candidates.push({ label: 'Kickouts won', usVal: koUs, oppVal: koOpp, fmt: v => String(v) });

  if (st.turnovers.won + st.turnovers.lost > 0)
    candidates.push({ label: 'Turnovers won', usVal: st.turnovers.won, oppVal: st.turnovers.lost, fmt: v => String(v) });

  const tsUs = st.turnoverScores.usG * 3 + st.turnoverScores.usP;
  const tsOpp = st.turnoverScores.oppG * 3 + st.turnoverScores.oppP;
  if (tsUs + tsOpp > 0) candidates.push({ label: 'Points from turnovers', usVal: tsUs, oppVal: tsOpp, fmt: v => String(v) });

  const usAtt = st.us.goals + st.us.twoPt + st.us.pts + st.us.wides;
  const oppAtt = st.opp.goals + st.opp.twoPt + st.opp.pts + st.opp.wides;
  if (usAtt > 0 && oppAtt > 0) {
    const usConv = Math.round((st.us.goals + st.us.twoPt + st.us.pts) / usAtt * 100);
    const oppConv = Math.round((st.opp.goals + st.opp.twoPt + st.opp.pts) / oppAtt * 100);
    candidates.push({ label: 'Shooting conversion', usVal: usConv, oppVal: oppConv, fmt: v => v + '%' });
  }

  let best = null, bestSkew = -1;
  candidates.forEach(c => {
    const tot = c.usVal + c.oppVal;
    if (tot === 0) return;
    const usPct = c.usVal / tot * 100;
    const favoursWinner = usWon == null || (usWon ? usPct >= 50 : usPct <= 50);
    const skew = Math.abs(usPct - 50);
    if (favoursWinner && skew > bestSkew) { bestSkew = skew; best = c; }
  });
  return best;
}

function _matchStoryRow(label, usVal, oppVal, fmt) {
  fmt = fmt || (v => String(v));
  return `<div style="display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:1px solid #F0F0EE;">`
    + `<div style="flex:1;font-size:12px;color:#666;">${esc(label)}</div>`
    + `<div style="width:56px;text-align:right;font-size:14px;font-weight:700;color:${TEAM_US_COLOR};">${fmt(usVal)}</div>`
    + `<div style="width:56px;text-align:right;font-size:14px;font-weight:700;color:${TEAM_OPP_COLOR};">${fmt(oppVal)}</div>`
    + `</div>`;
}

function _buildMatchStoryGraphicHTML() {
  const g  = state.ftGoals ?? state.goals, p  = state.ftPts ?? state.pts;
  const og = state.ftOg    ?? state.og,    op = state.ftOp  ?? state.op_;
  const usT = g * 3 + p, oppT = og * 3 + op;
  const usFmt  = g  + '–' + pad(p);
  const oppFmt = og + '–' + pad(op);
  const usWon = usT === oppT ? null : usT > oppT;
  const winnerName = usWon == null ? null : (usWon ? state.usN : state.oppN);

  const st = _matchStoryStats();
  const hi = _matchStoryHighlight(st, usWon);

  const dateStr = matchDisplayDate().toLocaleDateString('en-IE', {weekday:'long', day:'numeric', month:'long', year:'numeric'}).toUpperCase();
  const compHtml = state.competition
    ? `<div style="font-size:13px;font-weight:700;color:#1F5B3A;margin-bottom:3px;">${esc(state.competition)}</div>` : '';

  // Amalgam clubs (e.g. "Donaghmore/Ashbourne") are long, slash-joined, and
  // have no spaces for the browser to wrap at — hint a break right after
  // each "/" so it doesn't fall back to breaking mid-word.
  const headline = winnerName
    ? 'WHY ' + esc(winnerName.toUpperCase()).split('/').join('/<wbr>') + ' WON'
    : 'A LEVEL MATCH';

  let h = `<div style="background:#fff;border-radius:20px;padding:20px;box-shadow:0 2px 24px rgba(0,0,0,0.10);overflow:hidden;">`;
  h += `<div style="text-align:center;margin-bottom:14px;padding-bottom:12px;border-bottom:1px solid #EBEBEB;">`;
  h += compHtml;
  h += `<div style="font-size:11px;font-weight:700;letter-spacing:1.5px;color:#AAA;text-transform:uppercase;">${dateStr}</div>`;
  h += `</div>`;

  h += `<div style="text-align:center;margin-bottom:14px;">`;
  h += `<div style="font-size:10px;font-weight:700;letter-spacing:2px;color:#AAA;text-transform:uppercase;margin-bottom:6px;">Full Time</div>`;
  h += `<div style="font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:700;color:#111;line-height:1.15;word-break:break-word;">${headline}</div>`;
  h += `</div>`;

  // Stacked name-above-score per team (not a single crowded row) so a long
  // or slash-joined club name has room to wrap instead of colliding with
  // the score numbers — same word-break safety net the headline needs.
  const teamBlock = (name, scoreFmt, total, color) =>
    `<div style="flex:1;max-width:150px;text-align:center;">`
    + `<div style="font-size:${_htmlNameFS(name)};font-weight:800;color:${color};text-transform:uppercase;word-break:break-word;line-height:1.2;">${esc(name || '').split('/').join('/<wbr>')}</div>`
    + `<div style="font-size:22px;font-weight:900;color:#111;white-space:nowrap;margin-top:4px;">${scoreFmt} <span style="font-size:12px;color:#AAA;font-weight:600;">(${total})</span></div>`
    + `</div>`;
  h += `<div style="display:flex;align-items:flex-start;justify-content:center;gap:14px;margin-bottom:16px;">`;
  h += teamBlock(state.usN, usFmt, usT, TEAM_US_COLOR);
  h += `<div style="font-size:11px;color:#AAA;padding-top:6px;">v</div>`;
  h += teamBlock(state.oppN, oppFmt, oppT, TEAM_OPP_COLOR);
  h += `</div>`;

  const rstLabel = state.sport === 'hurling' ? 'Puck Out' : 'Kickout';
  h += `<div style="border-top:1px solid #EBEBEB;padding-top:4px;">`;
  h += `<div style="display:flex;align-items:center;gap:8px;padding:4px 0 6px;">`;
  h += `<div style="flex:1;font-size:10px;font-weight:800;letter-spacing:1px;color:#AAA;text-transform:uppercase;">Statistic</div>`;
  h += html`<div style="width:56px;text-align:right;font-size:10px;font-weight:800;letter-spacing:.5px;color:${TEAM_US_COLOR};text-transform:uppercase;">${_statColHead(state.usN)}</div>`;
  h += html`<div style="width:56px;text-align:right;font-size:10px;font-weight:800;letter-spacing:.5px;color:${TEAM_OPP_COLOR};text-transform:uppercase;">${_statColHead(state.oppN)}</div>`;
  h += `</div>`;
  h += _matchStoryRow('Goals', st.us.goals, st.opp.goals);
  if (st.us.twoPt + st.opp.twoPt > 0) h += _matchStoryRow('2-Pointers', st.us.twoPt, st.opp.twoPt);
  h += _matchStoryRow('Points', st.us.pts, st.opp.pts);
  h += _matchStoryRow('Wides', st.us.wides, st.opp.wides);
  h += _matchStoryRow('Total Score', usFmt + ' (' + usT + ')', oppFmt + ' (' + oppT + ')', v => v);
  if (st.ownRestarts.total > 0) h += _matchStoryRow('Own ' + rstLabel + 's retained', st.ownRestarts.usWon, st.ownRestarts.oppWon);
  if (st.oppRestarts.total > 0) h += _matchStoryRow('Opp ' + rstLabel + 's won back', st.oppRestarts.usWon, st.oppRestarts.oppWon);
  const tsUsFmt = st.turnoverScores.usG + '-' + st.turnoverScores.usP, tsOppFmt = st.turnoverScores.oppG + '-' + st.turnoverScores.oppP;
  if (tsUsFmt !== '0-0' || tsOppFmt !== '0-0') h += _matchStoryRow('Scored from turnovers', tsUsFmt, tsOppFmt, v => v);
  h += `</div>`;

  if (hi) {
    const narrative = winnerName
      ? `${esc(winnerName)} won it on ${hi.label.toLowerCase()}: ${hi.fmt(hi.usVal)} to ${hi.fmt(hi.oppVal)}.`
      : `Closest call: ${hi.label.toLowerCase()} — ${hi.fmt(hi.usVal)} to ${hi.fmt(hi.oppVal)}.`;
    h += `<div style="background:#F3F3EF;border-radius:14px;padding:12px 14px;margin-top:14px;text-align:center;">`;
    h += `<div style="font-size:10px;font-weight:800;letter-spacing:1.5px;color:#999;text-transform:uppercase;margin-bottom:4px;">The Standout Number</div>`;
    h += `<div style="font-size:13px;color:#333;overflow-wrap:break-word;">${narrative}</div>`;
    h += `</div>`;
  }

  h += `<div style="margin:14px -20px -20px;height:8px;background:#1F5B3A;"></div></div>`;
  return h;
}

// Returns the raw (unescaped) truncated name — callers interpolate it inside
// an `html` tagged template, which escapes it.
function _statColHead(name) {
  const n = (name || '').trim();
  return n.length > 10 ? n.slice(0, 9) + '…' : n;
}

function showMatchStoryGraphic() {
  // eslint-disable-next-line no-restricted-syntax -- safe: all user values pass through esc() or the html`` tag inside builder
  document.getElementById('score-graphic-wrap').innerHTML = _buildMatchStoryGraphicHTML();
  document.getElementById('score-graphic-panel').classList.add('open');
}

function openShareMenu() {
  document.getElementById('sharovly').classList.add('open');
  el.sharpanel.classList.add('open');
  renderShareMainOpts();
}

function renderShareMainOpts() {
  const hasHT    = state.evts.some(ev => ev.badge === '1H' && (ev.desc || '').includes('ended'));
  const hasFT    = state.matchState === 'FULL_TIME';
  const hasEvts  = state.evts.length > 0;

  const opts = [
    { v:'lu',   icon:'fa-solid fa-shirt',       label:'Starting Line-up',     bg:'#E8F5E9', fg:TEAM_US_COLOR },
    { v:'curr', icon:'fas fa-clock',             label:'Current Score Card',   bg:'#E3F2FD', fg:'#1565C0' },
    { v:'ht',   icon:'fas fa-hourglass-half',    label:'Half Time Score Card', bg:'#FFFDE7', fg:'#E65100', guard:hasHT },
    { v:'ft',   icon:'fas fa-flag-checkered',    label:'Full Time Score Card', bg:'#FFEBEE', fg:TEAM_OPP_COLOR, guard:hasFT },
    { v:'story',icon:'fas fa-newspaper',         label:'Match Story',          bg:'#E0F2F1', fg:'#00695C', guard:hasFT },
    { v:'ai',   icon:'fas fa-brain',             label:'Analyse with AI',      bg:'#EDE7F6', fg:'#6A1B9A', guard:hasEvts },
  ];

  let h = '<div class="share-opts">';
  opts.forEach(o => {
    if (o.guard === false) return;
    h += `<button class="share-opt" data-v="${o.v}">`;
    h += `<span class="share-opt-icon" style="background:${o.bg};color:${o.fg};"><i class="${o.icon}"></i></span>`;
    h += `<span class="share-opt-label">${o.label}</span>`;
    h += `<i class="fas fa-chevron-right share-opt-arrow"></i>`;
    h += `</button>`;
  });
  h += '</div>';

  const wrap = document.getElementById('share-opts-wrap');
  // eslint-disable-next-line no-restricted-syntax -- safe: all option values are static strings
  wrap.innerHTML = h;
  wrap.onclick = e => {
    const btn = e.target.closest('[data-v]');
    if (!btn) return;
    const v = btn.dataset.v;
    if (v === 'ai')   { renderAITargetOpts(); return; }
    closeShareMenu();
    if (v === 'lu')   showLineupGraphic();
    if (v === 'curr') openCurrentScoreCard();
    if (v === 'ht')   showScoreGraphic('HT');
    if (v === 'ft')   showScoreGraphic('FT');
    if (v === 'story') showMatchStoryGraphic();
  };
}

function renderAITargetOpts() {
  let h = '<div class="share-opts">';
  h += `<button class="share-opt" data-v="__back">`;
  h += `<span class="share-opt-icon" style="background:var(--bg2);color:var(--t2);"><i class="fas fa-chevron-left"></i></span>`;
  h += `<span class="share-opt-label">Back</span>`;
  h += `</button>`;
  AI_CONFIG.targets.forEach(t => {
    h += `<button class="share-opt" data-v="${t.id}">`;
    const iconHtml = t.img ? `<img src="${t.img}" width="20" height="20" style="display:block;opacity:0.85;">` : `<i class="${t.icon}"></i>`;
    h += `<span class="share-opt-icon" style="background:${t.bg};color:${t.fg};">${iconHtml}</span>`;
    h += `<span class="share-opt-label">${t.label}</span>`;
    h += `<i class="fas fa-chevron-right share-opt-arrow"></i>`;
    h += `</button>`;
  });
  h += '<div style="font-size:11px;color:var(--t3);line-height:1.5;padding:10px 4px 2px;">The match prompt and data will be copied to your clipboard. Paste it into the chat to begin analysis.</div>';
  h += '</div>';

  const wrap = document.getElementById('share-opts-wrap');
  // eslint-disable-next-line no-restricted-syntax -- safe: all option values are static strings
  wrap.innerHTML = h;
  wrap.onclick = e => {
    const btn = e.target.closest('[data-v]');
    if (!btn) return;
    const v = btn.dataset.v;
    if (v === '__back') { renderShareMainOpts(); return; }
    shareWithAI(v);
  };
}

function shareWithAI(targetId) {
  const target = AI_CONFIG.targets.find(t => t.id === targetId);
  if (!target) return;
  const text = AI_CONFIG.buildPrompt(AI_CONFIG.buildPayload(state));
  closeShareMenu();

  // Launch synchronously inside the click so popup blockers allow it —
  // window.open inside a clipboard .then() or a setTimeout gets blocked,
  // especially on iOS Safari.
  if (!target.appUrl || !/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) {
    window.open(target.url, '_blank');
  } else {
    // Try the native app; if we never left the page, navigate to the web
    // version (navigation is not subject to the popup blocker).
    let appOpened = false;
    const onHide = () => { appOpened = true; };
    document.addEventListener('visibilitychange', onHide, { once: true });
    window.location.href = target.appUrl;
    setTimeout(() => {
      document.removeEventListener('visibilitychange', onHide);
      if (!appOpened) window.location.href = target.url;
    }, 1200);
  }

  navigator.clipboard.writeText(text)
    .then(() => toast('Prompt copied — paste into ' + target.label))
    .catch(() => toast('Open ' + target.label + ' and paste your data'));
}

function closeShareMenu() {
  document.getElementById('sharovly').classList.remove('open');
  el.sharpanel.classList.remove('open');
}

// ─── LOG PANEL ────────────────────────────────────────────────────────────────
function openLog()  { document.getElementById('logovly').classList.add('open'); el.logpanel.classList.add('open'); tail(); }
function closeLog() { document.getElementById('logovly').classList.remove('open'); el.logpanel.classList.remove('open'); }
