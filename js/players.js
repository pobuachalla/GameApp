'use strict';

// ─── PLAYER ACTIONS ───────────────────────────────────────────────────────────
function sel(s) {
  const isHT = state.matchState === 'HALF_TIME';
  if ((!tRun && !isHT) || state.rcarded[state.slotp[s]]) return;
  selSlot = s;
  if (isHT) { subOff = selSlot; pickSubOn(); return; }
  const acts = state.sport==='football' ? ACTS : ACTS.filter(a => a !== '2 Point');
  showOpts(pl(state.slotp[s])+' — select action', acts, actCb, false);
}

function actCb(a) {
  if (a==='Substitution') { subOff=selSlot; pickSubOn(); return; }
  if (a==='Card') {
    showOpts('Card — colour?', ['Yellow Card','Black Card','Red Card'], colour => { logEv(colour, null); closeMod(); }, false);
    return;
  }
  if (a==='Advanced') {
    const advOpts = state.sport==='football' ? ['Dissent','Ball Handover','Sideline'] : ['Dissent','Sideline'];
    showOpts('Advanced — reason?', advOpts, sub => { logEv('Advanced', sub); closeMod(); }, false);
    return;
  }
  pendAct = a;
  let sec = NS[a];
  if (sec) {
    // For 2 Point, restrict to From Play and From Free only
    if (a==='2 Point') {
      sec = ['From Play', 'From Free', 'From Sideline'];
    } else {
      // Convert From 65 to From 45 for Football for other scoring actions
      const from65 = state.sport==='football' ? 'From 45' : 'From 65';
      sec = sec.map(o => o==='From 65' ? from65 : o);
      // Chop is not a football foul
      if (a==='Free' && state.sport==='football') sec = sec.filter(o => o !== 'Chop');
    }
    const titles = {Goal:'Goal — how scored?',Point:'Point — how scored?','2 Point':'2 Point — how scored?',Wide:'Wide — how attempted?',Short:'Short — how attempted?',Saved:'Saved — how attempted?',Free:'Free — reason?'};
    showOpts(titles[a], sec, secCb, false);
  } else { logEv(a,null); closeMod(); }
}

const ZONE_ACTS    = new Set(['Goal','Point','2 Point','Wide','Short','Saved']);
const RESTART_ACTS = new Set(['Goal','Point','2 Point','Wide']);

function secCb(s) {
  const act = pendAct;
  if (state.trackShotLocations && ZONE_ACTS.has(act)) {
    // Save all session state before closeMod() clears it
    pendActSaved  = act;
    pendSecVal    = s;
    pendSlotSaved = selSlot;
    closeMod();
    showZonePicker();
  } else {
    logEv(act, s);
    closeMod();
    if (RESTART_ACTS.has(act)) showRestartModal('us');
  }
}

// ─── ZONE PICKER ──────────────────────────────────────────────────────────────
function showZonePicker() {
  const act = pendActSaved, sec = pendSecVal, slot = pendSlotSaved;
  const pi   = state.slotp[slot];
  const name = gn(pi) ? gn(pi)+' (#'+pi+')' : '#'+pi;
  document.getElementById('zone-ctx').textContent = act + '  ·  ' + name;

  // Preselect cell based on how the shot was taken
  zoneSelectedId     = getZonePreselect(sec);
  zoneSelectedCoords = getZonePreselectCoords(sec) || (zoneSelectedId ? getZoneCellCoords(zoneSelectedId) : null);

  document.getElementById('zone-pitch-wrap').innerHTML = buildZoneSVG(zoneSelectedId);
  document.getElementById('zonepanel').classList.add('open');
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
    `<text x="160" y="19" text-anchor="middle" font-size="9" font-weight="700" fill="#2E7D32" font-family="-apple-system,BlinkMacSystemFont,sans-serif">DEFENSIVE END</text>` +
    `<rect x="10" y="379" width="300" height="11" fill="white" opacity="0.92"/>` +
    `<text x="160" y="388" text-anchor="middle" font-size="9" font-weight="700" fill="#2E7D32" font-family="-apple-system,BlinkMacSystemFont,sans-serif">▾ ATTACKING END</text>`;
  return `<svg viewBox="0 0 320 400" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block;touch-action:none;" preserveAspectRatio="xMidYMid meet">${PITCH_SVG_INNER}${cells}${labels}</svg>`;
}

function selectZoneCell(id, x, y) {
  if (zoneSelectedId === id) {
    zoneSelectedId = null; zoneSelectedCoords = null;
  } else {
    zoneSelectedId = id;
    zoneSelectedCoords = {x: parseFloat(x), y: parseFloat(y)};
  }
  document.getElementById('zone-pitch-wrap').innerHTML = buildZoneSVG(zoneSelectedId);
}

function closeZone() {
  document.getElementById('zonepanel').classList.remove('open');
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
  if(a==='Red Card')return 'br'; if(a==='Yellow Card')return 'by'; if(a.indexOf('Card')>=0)return 'bc';
  if(a==='Turnover Won')return 'bg'; if(a==='Turnover Lost')return 'br';
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
  if (action==='Yellow Card') {
    state.ycarded[pi]=(state.ycarded[pi]||0)+1;
    const b=document.querySelector('[data-s="'+slot+'"]');
    if(b&&!b.querySelector('.card-y')){ const e=document.createElement('span'); e.className='card-y'; b.appendChild(e); }
  }
  if (action==='Black Card') {
    state.bcarded[pi]=(state.bcarded[pi]||0)+1;
    const b=document.querySelector('[data-s="'+slot+'"]');
    if(b&&!b.querySelector('.card-b')){ const e=document.createElement('span'); e.className='card-b'; b.appendChild(e); }
  }

  const desc = pl(pi)+': '+action+(sec?' · '+sec:'');
  if (action!=='Red Card') {
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
    if (action==='Yellow Card') {
      state.ycarded[pi]=(state.ycarded[pi]||1)-1;
      if(state.ycarded[pi]<=0){ delete state.ycarded[pi]; const b=document.querySelector('[data-s="'+slot+'"]'); const c=b&&b.querySelector('.card-y'); if(c)c.remove(); }
    }
    if (action==='Black Card') {
      state.bcarded[pi]=(state.bcarded[pi]||1)-1;
      if(state.bcarded[pi]<=0){ delete state.bcarded[pi]; const b=document.querySelector('[data-s="'+slot+'"]'); const c=b&&b.querySelector('.card-b'); if(c)c.remove(); }
    }
    const b2=document.querySelector('[data-s="'+slot+'"]');
    const still=state.evts.some(e=>e.slot===slot);
    if(b2){ if(still)b2.classList.add('hev'); else b2.classList.remove('hev'); }
  });
}

// ─── SUBSTITUTION ─────────────────────────────────────────────────────────────
function pickSubOn() {
  const used={};
  const sz=state.teamSize||15; for (let s=1; s<=sz; s++) used[state.slotp[s]]=true;
  const isGK = subOff===1, avail=[];
  for (let idx=16; idx<=state.maxB+5; idx++) {
    if(used[idx])continue;
    const n=gn(idx); if(!n&&idx>state.maxB)continue;
    const gks=idx===16; if(isGK&&!gks)continue; if(!isGK&&gks)continue;
    avail.push({val:String(idx),label:(n||'#'+idx),sub:gks?'Sub GK':'Outfield sub'});
  }
  for (let pidx in state.suboff) {
    pidx=parseInt(pidx); if(used[pidx])continue;
    if(isGK!==(state.suboff[pidx]===1))continue;
    if(state.rcarded[pidx])continue;
    avail.push({val:String(pidx),label:(gn(pidx)||'#'+pidx),sub:'Previously subbed off'});
  }
  if (!avail.length) {
    el.mtitle.textContent='No subs available';
    el.mopts.innerHTML='<p style="color:var(--t2);font-size:14px;padding:8px 0 4px;">No players available.</p>';
    return;
  }
  showOpts('Who comes on?', avail, v => execSub(parseInt(v)), true);
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
  refBtn(sl); closeMod();
}
