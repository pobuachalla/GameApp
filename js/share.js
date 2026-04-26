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
    .map(s => s.name + ' ' + s.g + '–' + pad(s.p))
    .join(' · ');
}

function _scoreOutcome(isHT) {
  const u = usTotal(), o = oppTotal();
  const diff = Math.abs(u - o);
  const pts = diff + ' pt' + (diff !== 1 ? 's' : '');
  if (u > o) return esc(state.usN) + ' lead by ' + pts;
  if (o > u) return esc(state.oppN) + ' lead by ' + pts;
  return isHT ? 'Level at Half Time' : 'Draw';
}

function _nameFS(name) {
  const l = (name || '').length;
  if (l <= 10) return 34;
  if (l <= 14) return 28;
  if (l <= 18) return 23;
  return 19;
}

function _buildScoreGraphicSVG(label, usCrestHref, oppCrestHref) {
  const isHT = label === 'HT';
  const usG = state.goals, usP = state.pts;
  const oppG = state.og, oppP = state.op_;
  const usT = usTotal(), oppT = oppTotal();
  const usFmt = usG + '–' + pad(usP);
  const oppFmt = oppG + '–' + pad(oppP);
  const outcome = _scoreOutcome(isHT);
  const outFS = outcome.length > 28 ? 20 : outcome.length > 22 ? 23 : 26;
  const scorerLine = _scorerGraphicLine();

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IE', {weekday:'long',day:'numeric',month:'long',year:'numeric'}).toUpperCase();
  const sub = state.location ? esc(state.location) : '';

  const usCImg = usCrestHref
    ? `<image x="172" y="242" width="156" height="156" href="${esc(usCrestHref)}" clip-path="url(#ucc)" preserveAspectRatio="xMidYMid meet"/>`
    : `<text x="250" y="335" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="38" font-weight="800" fill="#BBBBB4">${esc((state.usN||'').slice(0,2).toUpperCase())}</text>`;
  const oppCImg = oppCrestHref
    ? `<image x="752" y="242" width="156" height="156" href="${esc(oppCrestHref)}" clip-path="url(#occ)" preserveAspectRatio="xMidYMid meet"/>`
    : `<text x="830" y="335" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="38" font-weight="800" fill="#BBBBB4">${esc((state.oppN||'').slice(0,2).toUpperCase())}</text>`;

  const usNameFS = _nameFS(state.usN);
  const oppNameFS = _nameFS(state.oppN);

  return `<svg width="1080" height="1080" viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <clipPath id="ucc"><circle cx="250" cy="320" r="75"/></clipPath>
    <clipPath id="occ"><circle cx="830" cy="320" r="75"/></clipPath>
  </defs>
  <rect width="1080" height="1080" fill="#F8F8F6"/>
  <rect x="70" y="70" width="940" height="940" rx="36" fill="#FFFFFF" stroke="#E2E2DC" stroke-width="3"/>
  <text x="540" y="145" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="26" font-weight="700" fill="#1F2A24" letter-spacing="2">${dateStr}</text>
  ${sub ? `<text x="540" y="190" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="22" fill="#777">${sub}</text>` : ''}
  <circle cx="250" cy="320" r="78" fill="#F1F1EE" stroke="#D7D7D0" stroke-width="3"/>
  ${usCImg}
  <text x="540" y="330" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="44" font-weight="800" fill="#3E4A42">${label}</text>
  <text x="540" y="368" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="18" fill="#888" letter-spacing="2">${isHT ? 'HALF TIME' : 'FULL TIME'}</text>
  <circle cx="830" cy="320" r="78" fill="#F1F1EE" stroke="#D7D7D0" stroke-width="3"/>
  ${oppCImg}
  <text x="250" y="475" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="${usNameFS}" font-weight="800" fill="#1F2A24" letter-spacing="1">${esc((state.usN||'').toUpperCase())}</text>
  <text x="830" y="475" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="${oppNameFS}" font-weight="800" fill="#1F2A24" letter-spacing="1">${esc((state.oppN||'').toUpperCase())}</text>
  <text x="250" y="585" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="76" font-weight="900" fill="#111">${usFmt}</text>
  <text x="250" y="635" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="34" font-weight="700" fill="#8B8B84">(${usT})</text>
  <text x="830" y="585" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="76" font-weight="900" fill="#111">${oppFmt}</text>
  <text x="830" y="635" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="34" font-weight="700" fill="#8B8B84">(${oppT})</text>
  <rect x="270" y="705" width="540" height="62" rx="31" fill="#F3F3EF"/>
  <text x="540" y="747" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="${outFS}" font-weight="700" fill="#333">${outcome}</text>
  <line x1="140" y1="830" x2="940" y2="830" stroke="#E5E5DE" stroke-width="2"/>
  ${scorerLine
    ? `<text x="140" y="878" font-family="Arial,Helvetica,sans-serif" font-size="22" font-weight="800" fill="#1F2A24" letter-spacing="2">SCORERS</text>
  <text x="140" y="930" font-family="Arial,Helvetica,sans-serif" font-size="24" font-weight="500" fill="#333" textLength="800" lengthAdjust="spacingAndGlyphs">${scorerLine}</text>`
    : `<text x="540" y="890" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="22" fill="#9A9E99">No scores recorded</text>`}
  <rect x="70" y="980" width="940" height="30" fill="#1F5B3A"/>
</svg>`;
}

let _sgLabel = 'HT';

function showScoreGraphic(label) {
  _sgLabel = label;
  const usCrest  = _teamCrest(state.usN);
  const oppCrest = _teamCrest(state.oppN && state.oppN !== 'Opposition' ? state.oppN : '');
  const wrap = document.getElementById('score-graphic-wrap');
  wrap.innerHTML = _buildScoreGraphicSVG(label, usCrest, oppCrest);
  const svgEl = wrap.querySelector('svg');
  if (svgEl) { svgEl.style.width = '100%'; svgEl.style.height = 'auto'; }
  const btn = document.getElementById('score-graphic-continue-btn');
  if (btn) btn.textContent = label === 'HT' ? 'Continue' : 'Close';
  document.getElementById('score-graphic-panel').classList.add('open');
}

function closeScoreGraphic() {
  document.getElementById('score-graphic-panel').classList.remove('open');
}

async function _imgToDataUrl(src) {
  try {
    const resp = await fetch(src);
    const blob = await resp.blob();
    return await new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(r.result);
      r.onerror = rej;
      r.readAsDataURL(blob);
    });
  } catch { return null; }
}

async function shareScoreGraphic() {
  const usCrest  = _teamCrest(state.usN);
  const oppCrest = _teamCrest(state.oppN && state.oppN !== 'Opposition' ? state.oppN : '');
  const [usDat, oppDat] = await Promise.all([
    usCrest  ? _imgToDataUrl(usCrest)  : Promise.resolve(null),
    oppCrest ? _imgToDataUrl(oppCrest) : Promise.resolve(null),
  ]);
  const svg = _buildScoreGraphicSVG(_sgLabel, usDat || usCrest, oppDat || oppCrest);
  const blob = new Blob([svg], {type: 'image/svg+xml'});
  const safe = (state.usN || 'match').replace(/[^a-z0-9]/gi, '_');
  const filename = safe + '_' + _sgLabel.toLowerCase() + '.svg';
  if (navigator.share && navigator.canShare && navigator.canShare({files:[new File([blob],filename,{type:'image/svg+xml'})]})) {
    navigator.share({files:[new File([blob],filename,{type:'image/svg+xml'})],title:filename}).catch(()=>{});
  } else {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 10000);
  }
}

// ─── LOG PANEL ────────────────────────────────────────────────────────────────
function openLog()  { document.getElementById('logovly').classList.add('open'); el.logpanel.classList.add('open'); tail(); }
function closeLog() { document.getElementById('logovly').classList.remove('open'); el.logpanel.classList.remove('open'); }
