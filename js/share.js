'use strict';

// ─── SHARE ────────────────────────────────────────────────────────────────────
function shareWA() {
  const u=usTotal(), o=oppTotal();
  const lines=['*'+state.usN+': '+state.goals+'-'+state.pts+' ('+u+') v '+state.oppN+': '+state.og+'-'+state.op_+' ('+o+')*','*Time: '+fmt(state.secs)+'*',''];
  state.evts.forEach(e => lines.push(e.time+'  '+e.desc));
  window.open('https://wa.me/?text='+encodeURIComponent(lines.join('\n')),'_blank');
}

function shareCSV() {
  const csvEsc = v => '"' + String(v||'').replace(/"/g,'""') + '"';
  const rows = [['Time','Event','Description','zone_id','zone_x','zone_y']];
  state.evts.forEach(e => rows.push([e.time, e.badge, e.desc, e.zone?e.zone.id:'', e.zone?e.zone.coords.x.toFixed(4):'', e.zone?e.zone.coords.y.toFixed(4):'']));
  const csv = rows.map(r => r.map(csvEsc).join(',')).join('\r\n');
  const date = new Date().toISOString().slice(0,10);
  const safe = (state.usN||'match').replace(/[^a-z0-9]/gi,'_');
  const filename = safe+'_'+date+'.csv';
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
function _scorerGraphicLine() {
  const scorers = {};
  state.evts.forEach(ev => {
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
    .slice(0, 4)
    .map(s => esc(s.name) + ' ' + s.g + '–' + pad(s.p))
    .join(' · ');
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
  const initials = (name || '').split(/[\s\/\-]+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?';
  const fbStyle = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;'
    + 'font-size:18px;font-weight:700;color:#BBBBB4;font-family:Arial,sans-serif;';
  const wrap = 'position:relative;width:60px;height:60px;flex-shrink:0;';
  if (!src) return `<div style="${wrap}"><div style="${fbStyle}">${esc(initials)}</div></div>`;
  return `<div style="${wrap}"><div style="${fbStyle}">${esc(initials)}</div>`
    + `<img src="${esc(src)}" alt="${esc(name)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;" onerror="this.style.display='none'"></div>`;
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
  const scorerLine = _scorerGraphicLine();

  const now = new Date();
  const dateStr  = now.toLocaleDateString('en-IE', {weekday:'long', day:'numeric', month:'long', year:'numeric'}).toUpperCase();
  const compHtml = state.competition
    ? `<div style="font-size:13px;font-weight:700;color:#1F5B3A;margin-bottom:3px;">${esc(state.competition)}</div>` : '';
  const venueHtml = state.location
    ? `<div style="font-size:13px;color:#888;margin-top:2px;">${esc(state.location)}</div>` : '';

  const usCrest  = _teamCrest(state.usN);
  const oppCrest = _teamCrest(state.oppN && state.oppN !== 'Opposition' ? state.oppN : '');

  const teamCol = (crest, name, scoreFmt, total) =>
    `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:6px;min-width:0;">`
    + _crestEl(crest, name)
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
    + teamCol(usCrest, state.usN, usFmt, usT)
    + `<div style="flex-shrink:0;width:52px;display:flex;flex-direction:column;align-items:center;gap:2px;padding-top:16px;">`
    + periodHtml + `</div>`
    + teamCol(oppCrest, state.oppN, oppFmt, oppT)
    + `</div>`
    + `<div style="background:#F3F3EF;border-radius:14px;padding:10px 14px;text-align:center;margin-bottom:${scorerLine ? '12px' : '0'};">`
    + `<div style="font-size:14px;font-weight:700;color:#333;overflow-wrap:break-word;">${outcome}</div></div>`
    + scorersHtml
    + `<div style="margin:14px -20px -20px;height:8px;background:#1F5B3A;"></div></div>`;
}

function showScoreGraphic(label) {
  document.getElementById('score-graphic-wrap').innerHTML = _buildScoreGraphicHTML(label);
  const btn = document.getElementById('score-graphic-continue-btn');
  if (btn) btn.textContent = label === 'HT' ? 'Continue' : 'Close';
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
  const layout      = GRID_LAYOUTS[state.teamSize] || GRID_LAYOUTS[15];
  const snapSlotp   = state.startSlotp || state.slotp;
  const snapCaptain = state.startCaptain != null ? state.startCaptain : state.captain;

  // Header — same content and structure as openLayout()
  const usCrest  = _teamCrest(state.usN);
  const oppName  = state.oppN && state.oppN !== 'Opposition' ? state.oppN : '';
  const oppCrest = oppName ? _teamCrest(oppName) : null;
  const dateStr  = new Date().toLocaleDateString('en-IE', {weekday:'long', day:'numeric', month:'long', year:'numeric'});

  const usCrestHtml  = usCrest  ? `<img src="${esc(usCrest)}"  alt="${esc(state.usN)}" onerror="this.style.display='none'">` : '';
  const oppCrestHtml = oppCrest ? `<img src="${esc(oppCrest)}" alt="${esc(oppName)}"   onerror="this.style.display='none'">` : '';

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
      const pi    = snapSlotp ? (snapSlotp[slot] || slot) : slot;
      const name  = gn(pi) || '';
      const isCap = snapCaptain === slot;
      const isGK  = slot === 1;
      formation += '<div class="layout-player">';
      formation += '<div class="layout-shirt-wrap">';
      if (isCap) formation += '<span class="layout-cap-badge">C</span>';
      formation += `<i class="fa-solid fa-shirt layout-shirt-icon" style="color:${isGK ? '#FDD835' : '#2E7D32'};"></i>`;
      formation += `<span class="layout-shirt-num" style="color:${isGK ? '#2E7D32' : '#fff'};">${slot}</span>`;
      formation += '</div>';
      formation += `<div class="layout-player-name">${esc(name || '—')}</div>`;
      formation += '</div>';
    });
    formation += '</div>';
  });
  formation += '</div>';

  // Subs — same structure as renderLayout()
  let subsHtml = '';
  const subs = [];
  for (let i = 16; i <= (state.maxB || 16); i++) { const n = gn(i); if (n) subs.push({idx: i, name: n}); }
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
  document.getElementById('score-graphic-wrap').innerHTML = _buildLineupGraphicHTML();
  const btn = document.getElementById('score-graphic-continue-btn');
  if (btn) btn.textContent = 'Close';
  document.getElementById('score-graphic-panel').classList.add('open');
}

function openShareMenu() {
  const hasHT = state.evts.some(ev => ev.badge === '1H' && (ev.desc || '').includes('ended'));
  const hasFT = state.matchState === 'FULL_TIME';
  el.mtitle.textContent = 'Share';

  const opts = [
    { v:'lu',   icon:'fa-solid fa-shirt',     label:'Starting Line-up',     bg:'#E8F5E9', fg:'#2E7D32' },
    { v:'curr', icon:'fas fa-clock',           label:'Current Score Card',   bg:'#E3F2FD', fg:'#1565C0' },
    { v:'ht',   icon:'fas fa-hourglass-half',  label:'Half Time Score Card', bg:'#FFFDE7', fg:'#E65100', guard:hasHT },
    { v:'ft',   icon:'fas fa-flag-checkered',  label:'Full Time Score Card', bg:'#FFEBEE', fg:'#C62828', guard:hasFT },
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
  el.mopts.innerHTML = h;
  modalHandlerRef = (v) => {
    closeMod();
    if (v === 'lu')   showLineupGraphic();
    if (v === 'curr') openCurrentScoreCard();
    if (v === 'ht')   showScoreGraphic('HT');
    if (v === 'ft')   showScoreGraphic('FT');
  };
  el.mopts.addEventListener('click', handleModalClick);
  el.modal.style.display = 'block';
}

// ─── LOG PANEL ────────────────────────────────────────────────────────────────
function openLog()  { document.getElementById('logovly').classList.add('open'); el.logpanel.classList.add('open'); tail(); }
function closeLog() { document.getElementById('logovly').classList.remove('open'); el.logpanel.classList.remove('open'); }
