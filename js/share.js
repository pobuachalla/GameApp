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

// ─── SVG SCORE GRAPHIC ───────────────────────────────────────────────────────

let _sgShareText = '';

async function _fetchCrestB64(name) {
  const src = _teamCrest(name || '');
  if (!src) return null;
  try {
    const r = await fetch(src, { cache: 'force-cache' });
    if (!r.ok) return null;
    const blob = await r.blob();
    return await new Promise(res => {
      const rd = new FileReader();
      rd.onload  = () => res(rd.result);
      rd.onerror = () => res(null);
      rd.readAsDataURL(blob);
    });
  } catch { return null; }
}

function _svgCrestEl(cx, cy, r, initials, b64, clipId) {
  let out = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#EEEEEA"/>`;
  if (b64) {
    out += `<clipPath id="${clipId}"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath>`;
    out += `<image href="${b64}" x="${cx-r}" y="${cy-r}" width="${r*2}" height="${r*2}" clip-path="url(#${clipId})" preserveAspectRatio="xMidYMid meet"/>`;
  } else {
    const fs = initials.length > 2 ? 13 : 16;
    out += `<text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="central" font-size="${fs}" font-weight="700" fill="#9A9E99" font-family="Arial,Helvetica,sans-serif">${esc(initials)}</text>`;
  }
  return out;
}

function _svgNameSize(name) {
  const l = (name || '').length;
  return l <= 8 ? 16 : l <= 14 ? 13 : 11;
}

function _wrapScorerLines(text, maxChars) {
  const parts = text.split(' · ');
  const lines = [];
  let cur = '';
  for (const p of parts) {
    if (!cur) { cur = p; }
    else if (cur.length + 3 + p.length <= maxChars) { cur += ' · ' + p; }
    else { lines.push(cur); cur = p; }
  }
  if (cur) lines.push(cur);
  return lines;
}

async function _buildScoreGraphicSVG(label) {
  const isHT = label === 'HT', isFT = label === 'FT';

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
  const usT = g*3+p, oppT = og*3+op;
  const usFmt  = g  + '–' + pad(p);
  const oppFmt = og + '–' + pad(op);
  const outcome    = _scoreOutcome(label, usT, oppT);
  const scorerLine = _scorerGraphicLine(isHT ? _firstHalfEvts() : state.evts);
  const dateStr    = matchDisplayDate().toLocaleDateString('en-IE', {
    weekday:'long', day:'numeric', month:'long', year:'numeric'
  }).toUpperCase();

  const [usB64, oppB64] = await Promise.all([
    _fetchCrestB64(state.usN),
    _fetchCrestB64(state.oppN),
  ]);

  const usIni  = ((state.usN  || '').split(/[\s\/-]+/).filter(Boolean).slice(0,2).map(w=>w[0]).join('').toUpperCase()) || '?';
  const oppIni = ((state.oppN || '').split(/[\s\/-]+/).filter(Boolean).slice(0,2).map(w=>w[0]).join('').toUpperCase()) || '?';

  const W = 500, PAD = 24;
  const CX_L = 125, CX_R = 375, CX_M = 250;
  const F = 'Arial,Helvetica,sans-serif';
  const GREEN = '#1F5B3A';

  // ── Compute Y positions top-to-bottom
  let y = 22;
  const hdrLines = [];
  if (state.competition) {
    hdrLines.push({ text: state.competition, size: 14, weight: 700, fill: GREEN });
    y += 22;
  }
  hdrLines.push({ text: dateStr, size: 10, weight: 700, fill: '#AAAAAA' });
  y += 18;
  if (state.location) {
    hdrLines.push({ text: state.location, size: 12, weight: 400, fill: '#888888' });
    y += 18;
  }
  y += 10;
  const DIV1_Y = y;  y += 20;

  const CR = 28;
  const CREST_CY = y + CR;  y = CREST_CY + CR + 14;
  const NAME_Y  = y + 14;   y = NAME_Y + 8;
  const SCORE_Y = y + 40;   y = SCORE_Y + 8;
  const TOTAL_Y = y + 18;   y = TOTAL_Y + 20;

  const DIV2_Y = y;  y += 14;
  const OPY = y, OPH = 40;
  y += OPH + 14;

  const scorerLinesArr = scorerLine ? _wrapScorerLines(scorerLine, 56) : [];
  let DIV3_Y = -1, SCR_HDR_Y = -1, SCR_START_Y = -1;
  if (scorerLinesArr.length) {
    DIV3_Y     = y;              y += 16;
    SCR_HDR_Y  = y + 11;        y += 22;
    SCR_START_Y = y + 14;
    y = SCR_START_Y + scorerLinesArr.length * 22 + 8;
  }

  const BAR_Y = y + 10;
  const H = BAR_Y + 8;
  const PERIOD_CY = Math.round((CREST_CY + TOTAL_Y) / 2);

  // ── Build SVG
  let s = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="width:100%;height:auto;display:block;" xmlns="http://www.w3.org/2000/svg">`;
  s += `<defs><clipPath id="sgcc"><rect width="${W}" height="${H}" rx="20"/></clipPath></defs>`;
  s += `<g clip-path="url(#sgcc)">`;
  s += `<rect width="${W}" height="${H}" fill="#FFFFFF"/>`;

  // Header
  let hy = 22;
  for (const ln of hdrLines) {
    hy += ln.size + 6;
    s += `<text x="${CX_M}" y="${hy}" text-anchor="middle" font-size="${ln.size}" font-weight="${ln.weight}" fill="${ln.fill}" font-family="${F}">${esc(ln.text)}</text>`;
  }
  s += `<line x1="${PAD}" y1="${DIV1_Y}" x2="${W-PAD}" y2="${DIV1_Y}" stroke="#EBEBEB" stroke-width="1"/>`;

  // Crests
  s += _svgCrestEl(CX_L, CREST_CY, CR, usIni,  usB64,  'sgcl');
  s += _svgCrestEl(CX_R, CREST_CY, CR, oppIni, oppB64, 'sgcr');

  // Team names
  s += `<text x="${CX_L}" y="${NAME_Y}" text-anchor="middle" font-size="${_svgNameSize(state.usN)}"  font-weight="800" fill="#1F2A24" font-family="${F}">${esc(state.usN  || '')}</text>`;
  s += `<text x="${CX_R}" y="${NAME_Y}" text-anchor="middle" font-size="${_svgNameSize(state.oppN)}" font-weight="800" fill="#1F2A24" font-family="${F}">${esc(state.oppN || '')}</text>`;

  // Scores
  s += `<text x="${CX_L}" y="${SCORE_Y}" text-anchor="middle" font-size="38" font-weight="900" fill="#111111" font-family="${F}">${esc(usFmt)}</text>`;
  s += `<text x="${CX_R}" y="${SCORE_Y}" text-anchor="middle" font-size="38" font-weight="900" fill="#111111" font-family="${F}">${esc(oppFmt)}</text>`;
  s += `<text x="${CX_L}" y="${TOTAL_Y}" text-anchor="middle" font-size="14" font-weight="600" fill="#8B8B84" font-family="${F}">(${usT})</text>`;
  s += `<text x="${CX_R}" y="${TOTAL_Y}" text-anchor="middle" font-size="14" font-weight="600" fill="#8B8B84" font-family="${F}">(${oppT})</text>`;

  // Period label
  if (isHT || isFT) {
    s += `<text x="${CX_M}" y="${PERIOD_CY}" text-anchor="middle" dominant-baseline="central" font-size="26" font-weight="800" fill="#3E4A42" font-family="${F}">${isHT?'HT':'FT'}</text>`;
    s += `<text x="${CX_M}" y="${PERIOD_CY+24}" text-anchor="middle" font-size="8" font-weight="700" fill="#AAAAAA" letter-spacing="2" font-family="${F}">${isHT?'HALF':'FULL'}</text>`;
    s += `<text x="${CX_M}" y="${PERIOD_CY+35}" text-anchor="middle" font-size="8" font-weight="700" fill="#AAAAAA" letter-spacing="2" font-family="${F}">TIME</text>`;
  } else {
    const tFS = label.length > 3 ? 18 : 22;
    s += `<text x="${CX_M}" y="${PERIOD_CY-6}" text-anchor="middle" font-size="${tFS}" font-weight="800" fill="#3E4A42" font-family="${F}">${esc(label)}</text>`;
    s += `<text x="${CX_M}" y="${PERIOD_CY+14}" text-anchor="middle" font-size="8" font-weight="700" fill="#AAAAAA" letter-spacing="2" font-family="${F}">MINS</text>`;
  }

  // Divider + outcome
  s += `<line x1="${PAD}" y1="${DIV2_Y}" x2="${W-PAD}" y2="${DIV2_Y}" stroke="#EBEBEB" stroke-width="1"/>`;
  s += `<rect x="${PAD}" y="${OPY}" width="${W-PAD*2}" height="${OPH}" rx="12" fill="#F3F3EF"/>`;
  s += `<text x="${CX_M}" y="${OPY+OPH/2}" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="700" fill="#333333" font-family="${F}">${esc(outcome)}</text>`;

  // Scorers
  if (scorerLinesArr.length) {
    s += `<line x1="${PAD}" y1="${DIV3_Y}" x2="${W-PAD}" y2="${DIV3_Y}" stroke="#EBEBEB" stroke-width="1"/>`;
    s += `<text x="${CX_M}" y="${SCR_HDR_Y}" text-anchor="middle" font-size="10" font-weight="700" fill="#1F2A24" letter-spacing="2" font-family="${F}">SCORERS</text>`;
    scorerLinesArr.forEach((ln, i) => {
      s += `<text x="${CX_M}" y="${SCR_START_Y + i*22}" text-anchor="middle" font-size="13" fill="#444444" font-family="${F}">${esc(ln)}</text>`;
    });
  }

  // Bottom accent bar
  s += `<rect x="0" y="${BAR_Y}" width="${W}" height="${H-BAR_Y}" fill="${GREEN}"/>`;
  s += `</g></svg>`;
  return s;
}

function _svgToPNGBlob(svgString, w, h) {
  return new Promise((resolve, reject) => {
    const scale = 2;
    const canvas = document.createElement('canvas');
    canvas.width  = w * scale;
    canvas.height = h * scale;
    const ctx = canvas.getContext('2d');
    ctx.scale(scale, scale);
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const img  = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      canvas.toBlob(b => b ? resolve(b) : reject(new Error('toBlob failed')), 'image/png');
    };
    img.onerror = e => { URL.revokeObjectURL(url); reject(e); };
    img.src = url;
  });
}

function _buildShareBtns() {
  const base = 'border:none;border-radius:999px;padding:10px 18px;font-size:14px;font-weight:600;cursor:pointer;font-family:inherit;display:inline-flex;align-items:center;gap:7px;touch-action:manipulation;white-space:nowrap;';
  let h = `<div style="display:flex;gap:8px;margin-top:16px;flex-wrap:wrap;justify-content:center;padding-bottom:4px;">`;
  h += `<button style="${base}background:#1F5B3A;color:#fff;" onclick="_scoreGraphicShare('native')"><i class="fas fa-share-nodes"></i> Share</button>`;
  h += `<button style="${base}background:#25D366;color:#fff;" onclick="_scoreGraphicShare('whatsapp')"><i class="fab fa-whatsapp"></i> WhatsApp</button>`;
  h += `<button style="${base}background:#000;color:#fff;" onclick="_scoreGraphicShare('twitter')"><i class="fab fa-x-twitter"></i> X</button>`;
  h += `<button style="${base}background:#E8F0FE;color:#1A73E8;" onclick="_scoreGraphicShare('download')"><i class="fas fa-download"></i> Save</button>`;
  h += `</div>`;
  return h;
}

async function _scoreGraphicShare(type) {
  if (type === 'whatsapp') {
    window.open('https://wa.me/?text=' + encodeURIComponent(_sgShareText), '_blank');
    return;
  }
  if (type === 'twitter') {
    window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(_sgShareText), '_blank');
    return;
  }
  const svg = document.querySelector('#score-graphic-wrap svg');
  if (!svg) return;
  const W = parseInt(svg.getAttribute('width'));
  const H = parseInt(svg.getAttribute('height'));
  let pngBlob;
  try {
    pngBlob = await _svgToPNGBlob(new XMLSerializer().serializeToString(svg), W, H);
  } catch { toast('Could not generate image'); return; }
  const fname = 'score-card.png';
  const file  = new File([pngBlob], fname, { type: 'image/png' });
  if (type === 'native' && navigator.share && navigator.canShare?.({ files: [file] })) {
    navigator.share({ files: [file], title: fname }).catch(() => {});
    return;
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(pngBlob);
  a.download = fname;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 10000);
}

async function showScoreGraphic(label) {
  const wrap = document.getElementById('score-graphic-wrap');
  document.getElementById('score-graphic-panel').classList.add('open');
  wrap.innerHTML = `<div style="text-align:center;padding:48px 20px;color:#9A9E99;font-size:14px;font-family:inherit;">Building graphic…</div>`;

  const isHT = label === 'HT', isFT = label === 'FT';
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
  const usT = g*3+p, oppT = og*3+op;
  const labelTxt = isHT ? 'Half Time' : isFT ? 'Full Time' : label;
  _sgShareText = (state.competition ? state.competition + ' | ' : '')
    + `${state.usN||'Us'} ${g}-${pad(p)} (${usT}) v ${state.oppN||'Opposition'} ${og}-${pad(op)} (${oppT}) — ${labelTxt}`;

  const svgStr = await _buildScoreGraphicSVG(label);
  wrap.innerHTML = svgStr + _buildShareBtns();
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
  };
}

function renderAITargetOpts() {
  let h = '<div class="share-opts">';
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

  const launch = () => {
    closeShareMenu();
    if (!target.appUrl || !/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) {
      window.open(target.url, '_blank');
      return;
    }
    // Try native app; fall back to web if app not installed
    let appOpened = false;
    const onHide = () => { appOpened = true; };
    document.addEventListener('visibilitychange', onHide, { once: true });
    window.location.href = target.appUrl;
    setTimeout(() => {
      document.removeEventListener('visibilitychange', onHide);
      if (!appOpened) window.open(target.url, '_blank');
    }, 1200);
  };

  navigator.clipboard.writeText(text)
    .then(() => { toast('Prompt copied — paste into ' + target.label); launch(); })
    .catch(() => { toast('Open ' + target.label + ' and paste your data'); launch(); });
}

function closeShareMenu() {
  document.getElementById('sharovly').classList.remove('open');
  el.sharpanel.classList.remove('open');
}

// ─── LOG PANEL ────────────────────────────────────────────────────────────────
function openLog()  { document.getElementById('logovly').classList.add('open'); el.logpanel.classList.add('open'); tail(); }
function closeLog() { document.getElementById('logovly').classList.remove('open'); el.logpanel.classList.remove('open'); }
