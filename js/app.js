'use strict';

// ─── RESTORE UI ───────────────────────────────────────────────────────────────
function restoreUI() {
  setUsGoals(state.goals); setUsPts(state.pts);
  setOppGoals(state.og);   setOppPts(state.op_);
  upTot();
  el.uslbl.textContent=state.usN.toUpperCase();
  el.opplbl.textContent=state.oppN.toUpperCase();
  // Backwards compat: derive matchState from event badges if not set in saved data
  if (!state.matchState || state.matchState === 'PRE_MATCH') {
    const lastBadge = state.evts.length ? state.evts[state.evts.length-1].badge : null;
    const hasBadge = b => state.evts.some(e => e.badge === b);
    if (lastBadge === 'END') {
      state.matchState = 'FULL_TIME';
    } else if (hasBadge('2H')) {
      state.matchState = 'PAUSED_SECOND_HALF';
    } else if (hasBadge('1H')) {
      const h1Events = state.evts.filter(e => e.badge === '1H');
      state.matchState = h1Events.length >= 2 ? 'HALF_TIME' : 'PAUSED_FIRST_HALF';
    }
  }
  // If running state was saved, compute true elapsed and restore as paused
  if (state.matchState === 'RUNNING_FIRST_HALF' || state.matchState === 'RUNNING_SECOND_HALF') {
    if (state.tWallStart) {
      const trueElapsed = Math.floor((Date.now() - state.tWallStart) / 1000);
      state.secs = trueElapsed;
      state.tPausedAt = trueElapsed;
    } else {
      state.tPausedAt = state.secs;
    }
    state.matchState = state.matchState === 'RUNNING_FIRST_HALF' ? 'PAUSED_FIRST_HALF' : 'PAUSED_SECOND_HALF';
    state.tWallStart = null;
  }
  el['timer-display'].textContent=fmt(state.secs);
  if(state.secs>=1800) el['timer-display'].classList.add('overtime');
  renderTimerUI();
  if (state.matchState === 'FULL_TIME') {
    const ub = document.getElementById('undobtn');
    if (ub && ub.id === 'undobtn') {
      ub.id='resetbtn'; ub.disabled=false; ub.classList.remove('danger');
      // eslint-disable-next-line no-restricted-syntax -- safe: static HTML only
      ub.innerHTML='<i class="fas fa-arrows-rotate" aria-hidden="true"></i>Reset';
      ub.onclick=resetMatch;
    }
  }
  state.evts.forEach(e => {
    const r=document.createElement('div'); r.className='ev-row';
    // eslint-disable-next-line no-restricted-syntax -- safe: time/cls are internal computed values; badge and desc pass through esc()
    r.innerHTML='<div class="ev-check"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--ti)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="display:none"><polyline points="20 6 9 17 4 12"/></svg></div>'
      +'<span class="ev-time">'+e.time+'</span>'
      +'<span class="ev-bdg '+(e.cls||'bo')+'">'+esc(e.badge||'')+'</span>'
      +'<span style="color:var(--t1);font-size:13px;flex:1;">'+esc(e.desc||'')+'</span>';
    r.addEventListener('click',()=>toggleRow(r));
    el.evlog.appendChild(r);
  });
  if(state.evts.length) el.logempty.style.display='none';
  const pisWithEvts=new Set(state.evts.filter(e=>e.slot&&e.action&&e.action!=='sub').map(e=>e.pi!=null?e.pi:state.slotp[e.slot]));
  const teamSz=state.teamSize||15;
  for(let s=1;s<=teamSz;s++){
    const b=document.querySelector('[data-s="'+s+'"]'); if(!b) continue;
    const pi=state.slotp[s];
    if(state.rcarded[pi])          b.classList.add('rc');
    else if(pisWithEvts.has(pi))   b.classList.add('hev');
    if(state.ubench[state.slotp[s]]) b.classList.add('sub');
  }
  buildInitialsCache();
  refAllBtns();
  syncMeta();
}

// ─── INIT ─────────────────────────────────────────────────────────────────────
function init() {
  initEl();
  // eslint-disable-next-line no-restricted-syntax -- safe: PITCH_SVG_INNER is a trusted compile-time constant
  document.getElementById('pitch-main-host').innerHTML =
    `<svg viewBox="0 0 320 400" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;" preserveAspectRatio="xMidYMid slice">${PITCH_SVG_INNER}</svg>`;
  const restored = loadSavedState();
  renderPGrid();
  if (restored) {
    restoreUI();
    toast('Match restored');
  } else {
    buildInitialsCache();
    refAllBtns();
    upTot();
    syncMeta();
  }
}

init();
