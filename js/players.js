'use strict';

// ─── PLAYER ACTIONS ───────────────────────────────────────────────────────────
function sel(s) {
  if (swapSlot !== null) {
    if (s === swapSlot) { cancelSwap(); return; }
    execSwap(swapSlot, s);
    return;
  }
  const isHT       = state.matchState === 'HALF_TIME';
  const isPaused   = state.matchState === 'PAUSED_FIRST_HALF' || state.matchState === 'PAUSED_SECOND_HALF';
  const isPreMatch = state.matchState === 'PRE_MATCH';
  if (!tRun && !isHT && !isPaused && !isPreMatch) return;
  if (state.rcarded[state.slotp[s]]) { enterSwapMode(s); return; }
  const _bcPi = state.slotp[s];
  const _bcRem = (state.bcardedAt && state.bcardedAt[_bcPi] != null) ? (state.bcardedAt[_bcPi] + 600) - state.secs : -1;
  if (_bcRem > 0) {
    selSlot = s;
    document.getElementById('cfm-title').textContent = 'Player Sin-Binned';
    const _cfmBody = document.getElementById('cfm-body');
    // eslint-disable-next-line no-restricted-syntax -- safe: gn/_bcPi escaped; fmt returns numeric string
    _cfmBody.innerHTML =
      '<p class="cfm-msg">' + esc(gn(_bcPi)||('#'+_bcPi)) + ' has ' + fmt(_bcRem) + ' remaining.</p>' +
      '<button class="cfm-btn btn-primary">Substitute Player</button>' +
      '<button class="cfm-btn" style="margin-top:8px;background:transparent;color:var(--t2);border:1px solid var(--b);">Expire Black Card Early</button>';
    const _cfmBtns = _cfmBody.querySelectorAll('.cfm-btn');
    _cfmBtns[0].onclick = () => { closeConfirmDrawer(); subOff = s; pickSubOn(); };
    _cfmBtns[1].onclick = () => { closeConfirmDrawer(); expireBCCard(s); };
    document.getElementById('cfmpanel').classList.add('open');
    document.getElementById('cfmovly').classList.add('open');
    return;
  }
  selSlot = s;
  if (isHT) { subOff = selSlot; pickSubOn(); return; }
  openPlayerSheet(s);
}

function expireBCCard(s) {
  const pi = state.slotp[s];
  if (!pi) return;
  delete state.bcardedAt[pi];
  const btn = document.querySelector('[data-s="'+s+'"]');
  if (btn) btn.classList.remove('bc');
  refBtn(s);
  updateBCCountdowns();
  saveState();
}

// ─── PLAYER HEADER BUILDER ────────────────────────────────────────────────────
function buildPlyrHdr(slot, onClose) {
  const pi       = state.slotp[slot];
  const name     = gn(pi) || SLOT_POS[slot] || ('Pos ' + slot);
  const ini      = gi(pi);
  const {g, p}   = playerScore(pi);
  const scoreVal = g + '-' + String(p).padStart(2, '0');
  const pos      = SLOT_POS[slot] || ('Position ' + slot);
  // eslint-disable-next-line no-restricted-syntax -- safe: name/ini/pos escaped; scoreVal numeric; onClose is a trusted static string
  return (
    `<div class="ply-avatar">${esc(ini)}<span class="ply-avatar-num">${pi}</span></div>` +
    `<div class="ply-info"><div class="ply-name">${esc(name)}</div><div class="ply-pos">${esc(pos)}</div></div>` +
    `<div class="ply-score"><div class="ply-score-val">${esc(scoreVal)}</div><div class="ply-score-lbl">today</div></div>` +
    `<button class="ply-close" onclick="${onClose}"><i class="fas fa-xmark"></i></button>`
  );
}

// ─── PLAYER SHEET ─────────────────────────────────────────────────────────────
function openPlayerSheet(s) {
  selSlot = s;

  document.getElementById('ply-hdr').innerHTML = buildPlyrHdr(s, 'closePlayerSheetAndReset()');

  // Pre-match: only allow pre-game substitutions
  if (state.matchState === 'PRE_MATCH') {
    // eslint-disable-next-line no-restricted-syntax -- safe: static HTML only
    document.getElementById('ply-body').innerHTML =
      `<div class="ps-sec">` +
        `<div class="ps-sec-hdr"><span class="ps-lbl">PERSONNEL</span></div>` +
        `<div class="ps-pers-row">` +
          `<button class="ps-pers-btn" onclick="psAction('Pre-game Sub')">` +
            `<span class="ps-pers-icon"><i class="fas fa-people-arrows"></i></span>` +
            `Pre-match sub` +
          `</button>` +
          `<button class="ps-pers-btn" onclick="psAction('Swap Position')">` +
            `<span class="ps-pers-icon"><i class="fas fa-arrows-left-right"></i></span>` +
            `Swap position` +
          `</button>` +
        `</div>` +
      `</div>`;
    document.getElementById('plyovly').classList.add('open');
    el.plysheet.classList.add('open');
    return;
  }

  // Body
  const isFball = state.sport === 'football';
  const bigCols = isFball ? '1fr 1fr 1fr' : '1fr 1fr';
  const twoPBtn = isFball
    ? `<button class="ps-btn ps-btn-big ps-btn-2p" onclick="psAction('2 Point')">` +
      `<span class="ps-btn-icon"><i class="fas fa-flag"></i></span>` +
      `<span class="ps-btn-lbl">2 Point</span><span class="ps-btn-sub">2 points</span></button>`
    : '';

  // eslint-disable-next-line no-restricted-syntax -- safe: all dynamic values are static strings or esc()
  document.getElementById('ply-body').innerHTML =
    // GOALKEEPING (slot 1, tracking enabled)
    (s === 1 && !!state.trackGKPerformance
      ? `<div class="ps-sec">` +
          `<div class="ps-sec-hdr"><span class="ps-lbl">GOALKEEPING</span></div>` +
          `<button class="ps-pers-btn ps-btn-gk" onclick="psAction('GK Save')">` +
            `<span class="ps-pers-icon"><i class="fas fa-hand" style="font-size:.75em;display:inline-block;transform:rotate(315deg) scaleX(-1);"></i><i class="fas fa-hand" style="font-size:.75em;display:inline-block;transform:rotate(45deg);"></i></span>` +
            `Rate a save<i class="fas fa-chevron-right" style="margin-left:auto;font-size:12px;color:var(--t3);"></i>` +
          `</button>` +
        `</div>`
      : '') +
    // SCORE
    `<div class="ps-sec">` +
      `<div class="ps-sec-hdr"><span class="ps-lbl">SCORE</span></div>` +
      `<div class="ps-score-grid-big${s === 1 ? ' ps-score-grid-big--gk' : ''}" style="grid-template-columns:${bigCols};">` +
        `<button class="ps-btn ps-btn-big ps-btn-goal" onclick="psAction('Goal')"><span class="ps-btn-icon"><i class="fas fa-flag"></i></span><span class="ps-btn-lbl">Goal</span><span class="ps-btn-sub">3 points</span></button>` +
        twoPBtn +
        `<button class="ps-btn ps-btn-big ps-btn-point" onclick="psAction('Point')"><span class="ps-btn-icon"><i class="far fa-flag"></i></span><span class="ps-btn-lbl">Point</span><span class="ps-btn-sub">1 point</span></button>` +
      `</div>` +
      `<div class="ps-score-grid-sm">` +
        `<button class="ps-btn ps-btn-sm" onclick="psAction('Wide')"><span class="ps-btn-icon"><i class="fa-solid fa-child-reaching"></i></span><span class="ps-btn-lbl">Wide</span></button>` +
        `<button class="ps-btn ps-btn-sm" onclick="psAction('Short')"><span class="ps-btn-icon"><i class="fas fa-arrow-down"></i></span><span class="ps-btn-lbl">Short</span></button>` +
        `<button class="ps-btn ps-btn-sm" onclick="psAction('Saved')"><span class="ps-btn-icon"><i class="fa-kit fa-solid-h-circle-xmark"></i></span><span class="ps-btn-lbl">Save / Post</span></button>` +
      `</div>` +
    `</div>` +
    // POSSESSION
    `<div class="ps-sec">` +
      `<div class="ps-sec-hdr"><span class="ps-lbl">POSSESSION</span></div>` +
      `<div class="ps-poss">` +
        `<button class="ps-poss-btn ps-poss-won" onclick="psAction('Turnover Won')"><span class="ps-poss-icon"><i class="fas fa-turn-up"></i></span>Turnover won</button>` +
        `<button class="ps-poss-btn ps-poss-lost" onclick="psAction('Turnover Lost')"><span class="ps-poss-icon"><i class="fas fa-turn-down"></i></span>Turnover lost</button>` +
      `</div>` +
    `</div>` +
    // DISCIPLINE
    `<div class="ps-sec">` +
      `<div class="ps-sec-hdr"><span class="ps-lbl">DISCIPLINE</span></div>` +
      `<div class="ps-disc">` +
        `<button class="ps-btn ps-btn-sm" onclick="psAction('Free')"><span class="ps-btn-icon"><i class="fa-regular fa-whistle"></i></span><span class="ps-btn-lbl">Free</span></button>` +
        `<button class="ps-btn ps-btn-sm" onclick="psAction('Advanced')"><span class="ps-btn-icon"><i class="fas fa-right-from-line"></i></span><span class="ps-btn-lbl">Advanced</span></button>` +
        `<button class="ps-btn ps-btn-sm" onclick="psAction('Card')"><span class="ps-btn-icon" style="display:flex;gap:2px;align-items:center;"><i class="fas fa-square" style="font-size:9px;color:${CARD_YELLOW};"></i><i class="fas fa-square" style="font-size:9px;color:${CARD_BLACK};"></i><i class="fas fa-square" style="font-size:9px;color:${CARD_RED};"></i></span><span class="ps-btn-lbl">Card</span></button>` +
      `</div>` +
    `</div>` +
    // PERSONNEL
    `<div class="ps-sec">` +
      `<div class="ps-sec-hdr"><span class="ps-lbl">PERSONNEL</span></div>` +
      `<div class="ps-pers-row">` +
        `<button class="ps-pers-btn" onclick="psAction('Substitution')">` +
          `<span class="ps-pers-icon"><i class="fas fa-people-arrows"></i></span>` +
          `Substitute off` +
        `</button>` +
        `<button class="ps-pers-btn" onclick="psAction('Swap Position')">` +
          `<span class="ps-pers-icon"><i class="fas fa-arrows-left-right"></i></span>` +
          `Swap position` +
        `</button>` +
      `</div>` +
    `</div>`;

  document.getElementById('plyovly').classList.add('open');
  el.plysheet.classList.add('open');
}

function closePlayerSheet() {
  document.getElementById('plyovly').classList.remove('open');
  el.plysheet.classList.remove('open');
}

function closePlayerSheetAndReset() {
  closePlayerSheet();
  const body = document.getElementById('ply-body');
  if (body) body.onclick = null;
  selSlot = null;
}

// ─── SHEET SUB-OPTIONS ────────────────────────────────────────────────────────
function showPSOpts(title, opts, handler, layout) {
  let h = '<div class="ps-sub-wrap">';
  if (layout === 'grid') {
    h += buildHowGrid(title, opts, 'psActionBack()');
  } else {
    h += '<div class="ps-sub-nav">'
      + '<button class="ps-sub-back" onclick="psActionBack()"><i class="fas fa-chevron-left"></i></button>'
      + `<span class="ps-sub-title">${esc(title)}</span>`
      + '</div>'
      + '<div class="ps-sub-opts">';
    opts.forEach(o => {
      const val   = typeof o === 'string' ? o : o.val;
      const label = typeof o === 'string' ? o : o.label;
      const pre   = (typeof o === 'object' && o.pre) ? o.pre : '';
      // eslint-disable-next-line no-restricted-syntax -- safe: val/label escaped, pre is trusted static HTML
      h += `<button class="ps-sub-opt" data-v="${esc(val)}">${pre}${esc(label)}<i class="fas fa-chevron-right ps-sub-arrow"></i></button>`;
    });
    h += '</div>';
  }
  h += '</div>';
  // eslint-disable-next-line no-restricted-syntax -- safe: built from static strings and esc()
  document.getElementById('ply-body').innerHTML = h;
  const body = document.getElementById('ply-body');
  body.onclick = e => {
    const btn = e.target.closest('[data-v]');
    if (!btn) return;
    body.onclick = null;
    handler(btn.dataset.v);
  };
}

function psActionBack() { openPlayerSheet(selSlot); }

function psAction(a) {
  if (a === 'GK Save') {
    const slot = selSlot;
    closePlayerSheetAndReset();
    openGKSaveFlow(slot);
    return;
  }
  if (a === 'Card') {
    const _pi = state.slotp[selSlot];
    const opts = [
      {val:'Yellow Card', label:'Yellow Card', pre:'<i class="fas fa-square ps-card-y"></i>'},
      {val:'Black Card',  label:'Black Card',  pre:'<i class="fas fa-square ps-card-b"></i>'},
      {val:'Red Card',    label:'Red Card',    pre:'<i class="fas fa-square ps-card-r"></i>'},
    ];
    if ((state.ycarded[_pi]||0) > 0) opts.push({val:'Second Yellow Card', label:'2nd Yellow', pre:'<span style="display:inline-flex;gap:1px;align-items:center;"><i class="fas fa-square ps-card-y" style="font-size:9px;"></i><i class="fas fa-square ps-card-y" style="font-size:9px;"></i></span>'});
    showPSOpts('Card — colour?', opts, colour => { logEv(colour, null); closePlayerSheetAndReset(); }, 'grid');
    return;
  }
  if (a === 'Advanced') {
    const opts = state.sport === 'football' ? ['Dissent','Ball Handover'] : ['Dissent'];
    showPSOpts('Advanced — reason?', opts, sub => { logEv('Advanced', sub); closePlayerSheetAndReset(); }, 'grid');
    return;
  }
  if (a === 'Turnover Won') {
    const opts = state.trackTurnovers
      ? ['Won a Free','First to the Ball','Tackle Turnover','Block','Defensive Pressure']
      : ['Won a Free','Possession'];
    if (state.trackTurnovers && state.sport === 'hurling') opts.splice(2, 0, 'Hook');
    showPSOpts('Turnover Won — how?', opts, sub => {
      if (sub === 'Won a Free') { logEv('Free Won', null); }
      else { logEv('Turnover Won', state.trackTurnovers ? sub : null); }
      closePlayerSheetAndReset();
    }, 'grid');
    return;
  }
  if (a === 'Turnover Lost' && state.trackTurnovers) {
    showPSOpts('Turnover Lost — how?', ['Poor Pass','Lost in Tackle','Second to the Ball','Over Played','Isolated'],
      sub => { logEv('Turnover Lost', sub); closePlayerSheetAndReset(); }, 'grid');
    return;
  }
  if (a === 'Free') {
    let opts = FSEC.slice();
    if (state.sport === 'football') { opts = opts.filter(o => o !== 'Chop'); opts.push('Breach'); }
    showPSOpts('Free — reason?', opts, sub => { logEv('Free', sub); closePlayerSheetAndReset(); }, 'grid');
    return;
  }
  const SCORE_ACTS = new Set(['Goal','Point','2 Point','Wide','Short','Saved']);
  if (SCORE_ACTS.has(a)) {
    pendAct = a;
    const from65 = state.sport === 'football' ? 'From 45' : 'From 65';
    let opts = a === '2 Point'
      ? ['From Play','From Free','From Sideline']
      : SSEC.map(o => o === 'From 65' ? from65 : o);
    const titles = {
      Goal:'Goal — how scored?', Point:'Point — how scored?', '2 Point':'2 Point — how scored?',
      Wide:'Wide — how attempted?', Short:'Short — how attempted?', Saved:'Saved — how attempted?',
    };
    showPSOpts(titles[a], opts, sec => {
      if (state.trackShotLocations && ZONE_ACTS.has(a)) {
        pendActSaved  = a;
        pendSecVal    = sec;
        pendSlotSaved = selSlot;
        closePlayerSheet();
        selSlot = null;
        showZonePicker();
      } else {
        logEv(a, sec);
        closePlayerSheetAndReset();
        if (RESTART_ACTS.has(a)) showRestartModal('us');
      }
    }, 'grid');
    return;
  }
  if (a === 'Substitution' || a === 'Pre-game Sub') {
    subOff = selSlot;
    closePlayerSheet();
    pickSubOn();
    return;
  }
  if (a === 'Swap Position') {
    const slot = selSlot;
    closePlayerSheetAndReset();
    enterSwapMode(slot);
    return;
  }
  // Turnover Won/Lost without detailed tracking — log directly
  logEv(a, null);
  closePlayerSheetAndReset();
}

const ZONE_ACTS    = new Set(['Goal','Point','2 Point','Wide','Short','Saved']);
const RESTART_ACTS = new Set(['Goal','Point','2 Point','Wide']);

// ─── ZONE PICKER ──────────────────────────────────────────────────────────────
function showZonePicker() {
  const act = pendActSaved, sec = pendSecVal, slot = pendSlotSaved;
  document.getElementById('zone-hdr').innerHTML = buildPlyrHdr(slot, 'skipZone()');

  // Preselect cell based on how the shot was taken
  zoneSelectedId     = getZonePreselect(sec);
  zoneSelectedCoords = getZonePreselectCoords(sec) || (zoneSelectedId ? getZoneCellCoords(zoneSelectedId) : null);

  // eslint-disable-next-line no-restricted-syntax -- safe: zoneSelectedId is an internal integer
  document.getElementById('zone-pitch-wrap').innerHTML = buildZoneSVG(zoneSelectedId);
  document.getElementById('zonepanel').classList.add('open');
  document.getElementById('zoneovly').classList.add('open');
}

function getZonePreselect(sec) {
  if (sec === 'From 65') return 'z-3-2';   // cell containing y=215 (65m line, attacking side of centre)
  if (sec === 'From 45') return 'z-4-2';   // cell containing y=268 (45m line)
  if (sec === 'From Penalty') return 'z-6-2';
  return null;
}

function getZonePreselectCoords(sec) {
  if (sec === 'From 65') return { x: 0.5, y: parseFloat((215/400).toFixed(4)) };
  if (sec === 'From 45') return { x: 0.5, y: parseFloat((268/400).toFixed(4)) };
  return null;
}

function getZoneCellCoords(id) {
  if (!id) return null;
  const parts = id.split('-');
  const r = parseInt(parts[1]), c = parseInt(parts[2]);
  return {
    x: parseFloat(((ZPX + c * ZCW + ZCW / 2) / 320).toFixed(4)),
    y: parseFloat(((ZPY + r * ZCH + ZCH / 2) / 400).toFixed(4))
  };
}

function buildZoneSVG(selectedId) {
  let cells = '';
  for (let r = 0; r < ZONE_ROWS; r++) {
    for (let c = 0; c < ZONE_COLS; c++) {
      const id   = `z-${r}-${c}`;
      const x    = ZPX + c * ZCW;
      const y    = ZPY + r * ZCH;
      const cx   = (x + ZCW / 2) / 320;
      const cy   = (y + ZCH / 2) / 400;
      const sel  = id === selectedId;
      const fill = sel ? 'rgba(55,138,221,0.52)' : 'rgba(255,255,255,0.04)';
      const strk = sel ? 'rgba(55,138,221,0.9)'  : 'rgba(255,255,255,0.22)';
      const sw   = sel ? '1.5' : '0.7';
      cells += `<rect id="${id}" x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${ZCW.toFixed(1)}" height="${ZCH.toFixed(1)}" fill="${fill}" stroke="${strk}" stroke-width="${sw}" onclick="selectZoneCell('${id}',${cx.toFixed(4)},${cy.toFixed(4)})" style="cursor:pointer;-webkit-tap-highlight-color:transparent;"/>`;
    }
  }
  // End-orientation labels inside SVG
  const labels =
    `<rect x="10" y="10" width="300" height="11" fill="white" opacity="0.92"/>` +
    `<text x="160" y="19" text-anchor="middle" font-size="9" font-weight="700" fill="${TEAM_US_COLOR}" font-family="-apple-system,BlinkMacSystemFont,sans-serif">DEFENSIVE END</text>` +
    `<rect x="10" y="379" width="300" height="11" fill="white" opacity="0.92"/>` +
    `<text x="160" y="388" text-anchor="middle" font-size="9" font-weight="700" fill="${TEAM_US_COLOR}" font-family="-apple-system,BlinkMacSystemFont,sans-serif">▾ ATTACKING END</text>`;
  return `<svg viewBox="0 0 320 400" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block;touch-action:none;" preserveAspectRatio="xMidYMid meet">${PITCH_SVG_INNER}${cells}${labels}</svg>`;
}

function selectZoneCell(id, x, y) {
  if (zoneSelectedId === id) {
    zoneSelectedId = null; zoneSelectedCoords = null;
  } else {
    zoneSelectedId = id;
    zoneSelectedCoords = {x: parseFloat(x), y: parseFloat(y)};
  }
  // eslint-disable-next-line no-restricted-syntax -- safe: zoneSelectedId is an internal integer
  document.getElementById('zone-pitch-wrap').innerHTML = buildZoneSVG(zoneSelectedId);
}

function closeZone() {
  document.getElementById('zonepanel').classList.remove('open');
  document.getElementById('zoneovly').classList.remove('open');
}

function confirmZone() {
  const zone = zoneSelectedId
    ? {id: zoneSelectedId, coords: zoneSelectedCoords, scheme: ZONE_SCHEME}
    : null;
  _finishZone(zone);
}

function skipZone() { _finishZone(null); }

function _finishZone(zone) {
  closeZone();
  // Temporarily restore selSlot so logEv can read it
  selSlot = pendSlotSaved;
  logEv(pendActSaved, pendSecVal, zone);
  const act = pendActSaved;
  selSlot = null;
  pendActSaved = pendSecVal = pendSlotSaved = null;
  zoneSelectedId = null; zoneSelectedCoords = null;
  if (RESTART_ACTS.has(act)) showRestartModal('us');
}

// ─── EVENT LOGGING ────────────────────────────────────────────────────────────
function badgeCls(a) {
  if(a==='Goal')return 'bg'; if(a==='Point')return 'bp'; if(a==='2 Point')return 'bp'; if(a==='Wide'||a==='Short'||a==='Saved')return 'bw';
  if(a==='Red Card')return 'br'; if(a==='Yellow Card'||a==='Second Yellow Card')return 'by'; if(a.indexOf('Card')>=0)return 'bc';
  if(a==='Turnover Won'||a==='Free Won')return 'bg'; if(a==='Turnover Lost')return 'br';
  return 'bo';
}

function logEv(action, sec, zone) {
  const slot = selSlot, pi = state.slotp[slot];
  const prevG  = state.goals, prevP = state.pts;

  if (action==='Goal')    { setUsGoals(state.goals + 1); }
  if (action==='Point')   { setUsPts(state.pts + 1); }
  if (action==='2 Point') { setUsPts(state.pts + 2); }
  if (action==='Goal'||action==='Point'||action==='2 Point') upTot();

  if (action==='Red Card') {
    state.rcarded[pi]=true;
    const b=document.querySelector('[data-s="'+slot+'"]');
    if(b){ b.classList.remove('hev','sub'); b.classList.add('rc'); const e=document.createElement('span'); e.className='card-r'; b.appendChild(e); }
  }
  if (action==='Second Yellow Card') {
    state.rcarded[pi]=true;
    state.ycarded[pi]=(state.ycarded[pi]||0)+1;
    const b=document.querySelector('[data-s="'+slot+'"]');
    if(b){ b.classList.remove('hev','sub'); b.classList.add('rc'); const cy=b.querySelector('.card-y'); if(cy)cy.remove(); const e=document.createElement('span'); e.className='card-r'; b.appendChild(e); }
  }
  if (action==='Yellow Card') {
    state.ycarded[pi]=(state.ycarded[pi]||0)+1;
    const b=document.querySelector('[data-s="'+slot+'"]');
    if(b&&!b.querySelector('.card-y')){ const e=document.createElement('span'); e.className='card-y'; b.appendChild(e); }
  }
  if (action==='Black Card') {
    state.bcarded[pi]=(state.bcarded[pi]||0)+1;
    state.bcardedAt[pi]=state.secs;
    refBtn(slot);
  }

  const desc = pl(pi)+': '+action+(sec?' · '+sec:'');
  if (action!=='Red Card' && action!=='Second Yellow Card') {
    const b=document.querySelector('[data-s="'+slot+'"]');
    if(b&&!b.classList.contains('rc')) b.classList.add('hev');
  }
  addRow(fmt(state.secs), gi(pi), badgeCls(action), desc);
  // Tag the event with slot/action/sec for accurate undo hev check and scorer summary
  const ev = state.evts[state.evts.length-1];
  ev.slot=slot; ev.pi=pi; ev.action=action; ev.sec=sec||null; ev.zone=(zone!==undefined)?zone:null;
  if (action==='Goal'||action==='Point'||action==='2 Point') refBtn(slot);

  pushUndo(desc, () => {
    if (action==='Goal')    { setUsGoals(prevG); upTot(); refBtn(slot); }
    if (action==='Point')   { setUsPts(prevP);   upTot(); refBtn(slot); }
    if (action==='2 Point') { setUsPts(prevP);   upTot(); refBtn(slot); }
    if (action==='Red Card') {
      delete state.rcarded[pi];
      const b=document.querySelector('[data-s="'+slot+'"]');
      if(b){ b.classList.remove('rc'); const c=b.querySelector('.card-r'); if(c)c.remove(); }
    }
    if (action==='Second Yellow Card') {
      delete state.rcarded[pi];
      state.ycarded[pi]=(state.ycarded[pi]||1)-1;
      if(state.ycarded[pi]<=0) delete state.ycarded[pi];
      const b=document.querySelector('[data-s="'+slot+'"]');
      if(b){ b.classList.remove('rc'); const cr=b.querySelector('.card-r'); if(cr)cr.remove(); if((state.ycarded[pi]||0)>0&&!b.querySelector('.card-y')){ const ey=document.createElement('span'); ey.className='card-y'; b.appendChild(ey); } }
    }
    if (action==='Yellow Card') {
      state.ycarded[pi]=(state.ycarded[pi]||1)-1;
      if(state.ycarded[pi]<=0){ delete state.ycarded[pi]; const b=document.querySelector('[data-s="'+slot+'"]'); const c=b&&b.querySelector('.card-y'); if(c)c.remove(); }
    }
    if (action==='Black Card') {
      state.bcarded[pi]=(state.bcarded[pi]||1)-1;
      if(state.bcarded[pi]<=0){ delete state.bcarded[pi]; delete state.bcardedAt[pi]; }
      const _bb=document.querySelector('[data-s="'+slot+'"]');
      if(_bb){ _bb.classList.remove('bc'); refBtn(slot); }
    }
    const b2=document.querySelector('[data-s="'+slot+'"]');
    const still=state.evts.some(e=>e.slot===slot);
    if(b2){ if(still)b2.classList.add('hev'); else b2.classList.remove('hev'); }
  });
}

// ─── SUBSTITUTION ─────────────────────────────────────────────────────────────
// ─── SUBSTITUTION DRAWER ──────────────────────────────────────────────────────
function showSubDrawer(title, avail, onPick) {
  document.getElementById('sub-title').textContent = title;
  const list = document.getElementById('sub-list');
  if (!avail.length) {
    // eslint-disable-next-line no-restricted-syntax -- safe: static HTML only
    list.innerHTML = '<p style="color:var(--t2);font-size:14px;padding:4px 0;">No players available.</p>';
    list.onclick = null;
  } else {
    list.innerHTML = avail.map(o =>
      `<button class="ps-sub-opt" data-v="${esc(String(o.val))}">` +
        (o.num != null ? `<div class="sub-num">${o.num}</div>` : '') +
        `<div style="flex:1;min-width:0;">` +
          (o.label ? `<div style="font-size:15px;font-weight:500;color:var(--t1);">${esc(o.label)}</div>` : '') +
          (o.sub ? `<div style="font-size:12px;color:var(--t2);margin-top:2px;">${esc(o.sub)}</div>` : '') +
        `</div>` +
        `<i class="fas fa-chevron-right ps-sub-arrow"></i>` +
      `</button>`
    ).join('');
    list.onclick = e => {
      const btn = e.target.closest('[data-v]');
      if (!btn) return;
      list.onclick = null;
      onPick(btn.getAttribute('data-v'));
    };
  }
  const hdr = document.getElementById('sub-hdr');
  if (subOff != null) {
    hdr.innerHTML = buildPlyrHdr(subOff, 'closeSubDrawer()');
    hdr.style.display = '';
  } else {
    hdr.innerHTML = '';
    hdr.style.display = 'none';
  }
  document.getElementById('subpanel').classList.add('open');
  document.getElementById('subovly').classList.add('open');
}

function closeSubDrawer() {
  document.getElementById('subpanel').classList.remove('open');
  document.getElementById('subovly').classList.remove('open');
  const list = document.getElementById('sub-list');
  if (list) list.onclick = null;
  subOff = null; selSlot = null; postSubCb = null;
}

function pickSubOn() {
  const used={};
  const sz=state.teamSize||15; (TEAM_SLOTS[sz]||TEAM_SLOTS[15]).forEach(s=>{used[state.slotp[s]]=true;});
  const isGK = subOff===1, avail=[];
  for (let idx=16; idx<=state.maxB+5; idx++) {
    if(used[idx])continue;
    const n=gn(idx); if(!n&&idx>state.maxB)continue;
    const gks=idx===16; if(isGK&&!gks)continue; if(!isGK&&gks)continue;
    avail.push({val:String(idx),label:n,num:idx,sub:gks?'Sub GK':'Outfield sub'});
  }
  for (let pidx in state.suboff) {
    pidx=parseInt(pidx); if(used[pidx])continue;
    if(isGK!==(state.suboff[pidx]===1))continue;
    if(state.rcarded[pidx])continue;
    avail.push({val:String(pidx),label:gn(pidx),num:pidx,sub:'Previously subbed off'});
  }
  for (const [slotStr, pi] of Object.entries(state.preGameSubs || {})) {
    if(used[pi])continue;
    if(state.rcarded[pi])continue;
    if(isGK!==(parseInt(slotStr)===1))continue;
    avail.push({val:String(pi),label:gn(pi),num:pi,sub:'Pre-match replaced'});
  }
  const isPreGame = state.matchState === 'PRE_MATCH';
  showSubDrawer('Who comes on?', avail, v => {
    if (isPreGame) execPreGameSub(parseInt(v));
    else execSub(parseInt(v));
  });
}

function execSub(bi) {
  const sl=subOff, out=state.slotp[sl];
  state.suboff[out]=sl; state.slotp[sl]=bi; state.ubench[bi]=true;
  if(state.suboff[bi])delete state.suboff[bi];
  const desc='Sub: '+pl(out)+' off / '+pl(bi)+' on (pos '+sl+')';
  const btn=document.querySelector('[data-s="'+sl+'"]'); if(btn)btn.classList.add('sub');
  addRow(fmt(state.secs), state.matchState==='HALF_TIME' ? 'HT' : 'SUB', 'bs', desc);
  const ev=state.evts[state.evts.length-1]; ev.slot=sl; ev.action='sub';
  const cs=sl,co=out,ci=bi;
  pushUndo(desc,()=>{
    state.slotp[cs]=co; delete state.suboff[co]; delete state.ubench[ci]; state.suboff[ci]=cs;
    const b2=document.querySelector('[data-s="'+cs+'"]');
    if(b2){ b2.classList.remove('sub'); if(state.ubench[co])b2.classList.add('sub'); }
    refBtn(cs);
  });
  refBtn(sl);
  const cb = postSubCb;
  closeSubDrawer();
  if (cb) cb();
}

// ─── POSITION SWAP ────────────────────────────────────────────────────────────
function enterSwapMode(slot) {
  swapSlot = slot;
  const sz = state.teamSize || 15;
  (TEAM_SLOTS[sz] || TEAM_SLOTS[15]).forEach(s => {
    const b = document.querySelector('[data-s="' + s + '"]');
    if (!b) return;
    if (s === slot) b.classList.add('swap-src');
    else b.classList.add('swap-tgt');
  });
  document.getElementById('swap-pill').style.display = 'flex';
}

function cancelSwap() {
  const sz = state.teamSize || 15;
  (TEAM_SLOTS[sz] || TEAM_SLOTS[15]).forEach(s => {
    const b = document.querySelector('[data-s="' + s + '"]');
    if (!b) return;
    b.classList.remove('swap-src', 'swap-tgt');
  });
  swapSlot = null;
  document.getElementById('swap-pill').style.display = 'none';
}

function execSwap(slotA, slotB) {
  const piA = state.slotp[slotA], piB = state.slotp[slotB];
  const prevCaptain = state.captain;
  state.slotp[slotA] = piB;
  state.slotp[slotB] = piA;
  if (state.captain === slotA) state.captain = slotB;
  else if (state.captain === slotB) state.captain = slotA;
  const desc = 'Pos swap: ' + pl(piA) + ' ↔ ' + pl(piB);
  addRow(fmt(state.secs), 'POS', 'bo', desc);
  const ev = state.evts[state.evts.length - 1];
  ev.slot = slotA; ev.action = 'pos-swap'; ev.pi = piA;
  pushUndo(desc, () => {
    state.slotp[slotA] = piA;
    state.slotp[slotB] = piB;
    state.captain = prevCaptain;
    refBtn(slotA); refBtn(slotB);
  });
  refBtn(slotA); refBtn(slotB);
  cancelSwap();
}

// ─── PRE-GAME SUBSTITUTION ────────────────────────────────────────────────────
// Updates the slot assignment so the incoming player fills the position while
// keeping their own jersey number. No match event is logged.
function execPreGameSub(bi) {
  const sl  = subOff;
  const out = state.slotp[sl];
  state.slotp[sl] = bi;
  if (!state.preGameSubs) state.preGameSubs = {};
  state.preGameSubs[sl] = out;
  refBtn(sl);
  const cs = sl, co = out;
  pushUndo('Pre-match sub (pos ' + sl + '): ' + pl(bi) + ' in for ' + pl(co), () => {
    state.slotp[cs] = co;
    delete state.preGameSubs[cs];
    refBtn(cs);
  });
  closeSubDrawer();
}
