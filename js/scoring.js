'use strict';

// ─── SCORER SUMMARY ───────────────────────────────────────────────────────────
function buildScorerSummary() {
  const scorers = {}; // pi -> {name, gPlay,gPlaced,pPlay,pPlaced}
  state.evts.forEach(ev => {
    if (!ev.slot || !ev.action) return;
    const a = ev.action;
    if (a !== 'Goal' && a !== 'Point' && a !== '2 Point') return;
    const pi = ev.pi != null ? ev.pi : state.slotp[ev.slot];
    if (!pi) return;
    if (!scorers[pi]) scorers[pi] = {name: pl(pi), gPlay:0, gPlaced:0, pPlay:0, pPlaced:0};
    const s = scorers[pi];
    const placed = PLACED_BALL.has(ev.sec);
    if (a === 'Goal')    { placed ? s.gPlaced++ : s.gPlay++; }
    if (a === 'Point')   { placed ? s.pPlaced++ : s.pPlay++; }
    if (a === '2 Point') { placed ? s.pPlaced+=2 : s.pPlay+=2; }
  });
  return Object.values(scorers).sort((a, b) => {
    const ta = (a.gPlay+a.gPlaced)*3 + (a.pPlay+a.pPlaced);
    const tb = (b.gPlay+b.gPlaced)*3 + (b.pPlay+b.pPlaced);
    return tb !== ta ? tb - ta : a.name.localeCompare(b.name);
  });
}

function formatScorer(s) {
  const g = s.gPlay+s.gPlaced, p = s.pPlay+s.pPlaced;
  const total = g*3+p;
  const parts = [];
  if (s.gPlay||s.pPlay)   parts.push((s.gPlay)+'-'+(s.pPlay)+' from play');
  if (s.gPlaced||s.pPlaced) parts.push((s.gPlaced)+'-'+(s.pPlaced)+' from placed balls');
  return esc(s.name)+' <span style="font-weight:600;">'+g+'-'+p+'</span>'
    +' <span style="color:var(--t2);font-size:12px;">('+total+'pts)</span>'
    +(parts.length ? '<br><span style="font-size:11px;color:var(--t2);">'+parts.join(', ')+'</span>' : '');
}

// ─── FULL TIME RESULT ─────────────────────────────────────────────────────────
function showFullTimeResult() {
  const u = usTotal(), o = oppTotal();
  const result = u>o?'Win':o>u?'Loss':'Draw';
  const now = new Date();
  const clockStr = pad(now.getHours())+':'+pad(now.getMinutes());
  const desc = 'Match ended at '+clockStr+' — '+state.usN+' '+state.goals+'-'+state.pts+' ('+u+') v '+state.oppN+' '+state.og+'-'+state.op_+' ('+o+') — '+result;
  addRow(fmt(state.secs),'END','bperiod',desc);
  const ub = document.getElementById('undobtn');
  if (ub) {
    ub.id='resetbtn'; ub.disabled=false; ub.classList.remove('danger');
    // eslint-disable-next-line no-restricted-syntax -- safe: static HTML only
    ub.innerHTML='<i class="fas fa-arrows-rotate" aria-hidden="true"></i>Reset';
    ub.onclick=resetMatch;
  }
  showScoreGraphic('FT');
}

// ─── CONFIRM DRAWER ───────────────────────────────────────────────────────────
function closeConfirmDrawer() {
  document.getElementById('cfmpanel').classList.remove('open');
  document.getElementById('cfmovly').classList.remove('open');
}

function showConfirmDrawer(title, message, btnLabel, isDanger, onConfirm) {
  document.getElementById('cfm-title').textContent = title;
  const body = document.getElementById('cfm-body');
  // eslint-disable-next-line no-restricted-syntax -- safe: message/btnLabel passed through esc()
  body.innerHTML =
    '<p class="cfm-msg">' + esc(message) + '</p>' +
    '<button class="cfm-btn' + (isDanger ? ' cfm-btn-danger' : ' cfm-btn-confirm') + '">' + esc(btnLabel) + '</button>';
  body.querySelector('.cfm-btn').onclick = () => { closeConfirmDrawer(); onConfirm(); };
  document.getElementById('cfmpanel').classList.add('open');
  document.getElementById('cfmovly').classList.add('open');
}

// ─── RESET ────────────────────────────────────────────────────────────────────
function resetMatch() {
  showConfirmDrawer(
    'Reset match?',
    'All scores, events and cards will be cleared. Team and player settings are kept.',
    'Clear everything and reset',
    true,
    doReset
  );
}

function doReset() {
  setUsGoals(0); setUsPts(0); setOppGoals(0); setOppPts(0);
  upTot();
  state.evts=[]; undos=[];
  state.matchNotes=''; const _mn=document.getElementById('match-notes-input'); if(_mn)_mn.value='';
  // eslint-disable-next-line no-restricted-syntax -- safe: static HTML only
  el.evlog.innerHTML = '<div id="logempty" style="color:var(--t3);font-size:13px;padding:10px 0;">No events recorded yet</div>';
  el.logempty = document.getElementById('logempty');
  syncMeta();
  state.secs=0;
  state.tWallStart=null; state.tPausedAt=0;
  state.matchState='PRE_MATCH';
  stopInterval(); tRun=false;
  state.period=1;
  el['timer-display'].textContent='00:00';
  el['timer-display'].classList.remove('overtime','muted');
  renderTimerUI();
  setGrid(false);
  state.rcarded={}; state.ycarded={}; state.bcarded={};
  const sz = state.teamSize || 15;
  (TEAM_SLOTS[sz]||TEAM_SLOTS[15]).forEach(s=>{state.slotp[s]=s;});
  renderPGrid();
  state.ubench={}; state.suboff={}; state.maxB=17;
  const rb = document.getElementById('resetbtn');
  if (rb) {
    rb.id='undobtn'; rb.classList.add('danger');
    // eslint-disable-next-line no-restricted-syntax -- safe: static HTML only
    rb.innerHTML='<i class="fas fa-rotate-left" aria-hidden="true"></i>Undo';
    rb.onclick=undoLast; rb.disabled=true;
  }
  refAllBtns();
  clearSavedState();
  toast('Match reset');
}

// ─── SCORE ADJUST DRAWER ──────────────────────────────────────────────────────
function closeScoreDrawer() {
  document.getElementById('scrpanel').classList.remove('open');
  document.getElementById('scrovly').classList.remove('open');
  const body = document.getElementById('scr-body');
  if (body) body.onclick = null;
  pendScoreAdj = null;
}

function openScoreModal(side) {
  const isUs = side === 'us';
  document.getElementById('scr-title').textContent = (isUs ? state.usN : state.oppN) + ' — adjust score';
  const body = document.getElementById('scr-body');
  // eslint-disable-next-line no-restricted-syntax -- safe: static HTML with internal score tokens only
  body.innerHTML =
    '<div class="ps-poss">'
      + '<button class="ps-poss-btn ps-poss-won" data-act="g+"><span class="ps-poss-icon"><i class="fas fa-flag fa-beat-fade"></i></span>+ Goal</button>'
      + '<button class="ps-poss-btn ps-poss-lost" data-act="g-"><span class="ps-poss-icon"><i class="fas fa-minus"></i></span>− Goal</button>'
    + '</div>'
    + (state.sport === 'football'
      ? '<div class="ps-poss">'
          + '<button class="ps-poss-btn ps-poss-won" data-act="f+"><span class="ps-poss-icon"><i class="fas fa-flag fa-beat-fade"></i></span>+ 2 Point</button>'
          + '<button class="ps-poss-btn ps-poss-lost" data-act="f-"><span class="ps-poss-icon"><i class="fas fa-minus"></i></span>− 2 Point</button>'
        + '</div>'
      : '')
    + '<div class="ps-poss">'
      + '<button class="ps-poss-btn ps-poss-won" data-act="p+"><span class="ps-poss-icon"><i class="far fa-flag fa-beat-fade"></i></span>+ Point</button>'
      + '<button class="ps-poss-btn ps-poss-lost" data-act="p-"><span class="ps-poss-icon"><i class="fas fa-minus"></i></span>− Point</button>'
    + '</div>'
    + '<button class="ps-poss-btn" style="width:100%;background:var(--bg2);color:var(--t2);" data-act="w+">'
      + '<span class="ps-poss-icon" style="background:var(--bg3);"><i class="fa-solid fa-child-reaching"></i></span>Wide'
    + '</button>';
  body.onclick = e => {
    const btn = e.target.closest('[data-act]');
    if (!btn) return;
    body.onclick = null;
    const v = btn.getAttribute('data-act');
    if (v === 'w+') {
      closeScoreDrawer();
      const wTeam = isUs ? state.usN : state.oppN;
      const wBadge = isUs ? 'ADJ' : 'OPP';
      const wCls   = isUs ? 'badj' : 'bopp';
      const wDesc  = wTeam + ': Wide';
      addRow(fmt(state.secs), wBadge, wCls, wDesc);
      const wEv = state.evts[state.evts.length - 1];
      wEv.action = 'Wide'; wEv.side = side;
      pushUndo(wDesc, () => {});
      showRestartModal(side);
      return;
    }
    if (v.endsWith('-')) {
      closeScoreDrawer();
      if (v.startsWith('f')) { adjFootball(-2, side, null); }
      else { if (isUs) adjUs(v[0], -1, side, null); else adjOpp(v[0], -1, side, null); }
    } else {
      pendScoreAdj = {type: v[0], d: v.startsWith('f') ? 2 : 1, isFb: v.startsWith('f'), side};
      showScoreHowModal();
    }
  };
  document.getElementById('scrpanel').classList.add('open');
  document.getElementById('scrovly').classList.add('open');
}

function showScoreHowModal() {
  const {isFb, side} = pendScoreAdj;
  document.getElementById('scr-title').textContent = 'How scored?';
  const from65label = state.sport === 'football' ? 'From 45' : 'From 65';
  const opts = isFb ? ['From Play', 'From Free'] : ['From Play', 'From Free', from65label, 'From Penalty'];
  const body = document.getElementById('scr-body');
  // eslint-disable-next-line no-restricted-syntax -- safe: opts are static strings, side is 'us'|'opp'
  body.innerHTML =
    '<div class="ps-sub-nav">'
      + '<button class="ps-sub-back" onclick="openScoreModal(\'' + side + '\')"><i class="fas fa-chevron-left"></i></button>'
      + '<span class="ps-sub-title">How scored?</span>'
    + '</div>'
    + '<div class="ps-sub-opts">'
    + opts.map(o =>
        '<button class="ps-sub-opt" data-how="' + esc(o) + '">'
          + '<div style="flex:1;">' + esc(o) + '</div>'
          + '<i class="fas fa-chevron-right ps-sub-arrow"></i>'
        + '</button>'
      ).join('')
    + '</div>';
  body.onclick = e => {
    const btn = e.target.closest('[data-how]');
    if (!btn) return;
    body.onclick = null;
    closeScoreDrawer();
    completeScoreAdj(btn.getAttribute('data-how'));
  };
}

function completeScoreAdj(how) {
  const {type, d, isFb, side} = pendScoreAdj;
  if (isFb) { adjFootball(d, side, how); }
  else { if (side==='us') adjUs(type, d, side, how); else adjOpp(type, d, side, how); }
  pendScoreAdj = null;
}

function adjUs(t, d, side, how) {
  const prev = t==='g' ? state.goals : state.pts;
  const nxt  = Math.max(0, prev+d); if (nxt===prev) return;
  if (t==='g') setUsGoals(nxt); else setUsPts(nxt);
  upTot();
  const type = t==='g'?'Goal':'Point';
  let desc = state.usN+': '+type+' '+(d>0?'added':'removed');
  if (how && d>0) desc += ' · '+how;
  addRow(fmt(state.secs),'ADJ','badj',desc);
  const ct=t,cp=prev;
  pushUndo(desc,()=>{ if(ct==='g') setUsGoals(cp); else setUsPts(cp); upTot(); });
  if (d>0) showRestartModal(side||'us');
}

function adjOpp(t, d, side, how) {
  const prev = t==='g' ? state.og : state.op_;
  const nxt  = Math.max(0, prev+d); if (nxt===prev) return;
  const type = t==='g' ? 'Goal' : 'Point';
  if (t==='g') setOppGoals(nxt); else setOppPts(nxt);
  upTot();
  let desc = state.oppN+': '+type+' '+(nxt>prev?'added':'removed');
  if (how && nxt>prev) desc += ' · '+how;
  addRow(fmt(state.secs),'OPP','bopp',desc);
  const ct=t,cp=prev;
  pushUndo(desc,()=>{ if(ct==='g') setOppGoals(cp); else setOppPts(cp); upTot(); });
  if (d>0) showRestartModal(side||'opp');
}

function adjFootball(d, side, how) {
  const isUs = side==='us';
  const prev = isUs ? state.pts : state.op_;
  const nxt  = Math.max(0, prev+d); if (nxt===prev) return;
  if (isUs) setUsPts(nxt); else setOppPts(nxt);
  upTot();
  const team = isUs ? state.usN : state.oppN;
  let desc = team+': 2 Point '+(d>0?'added':'removed');
  if (how && d>0) desc += ' · '+how;
  addRow(fmt(state.secs),'ADJ','badj',desc);
  const cp=prev;
  pushUndo(desc,()=>{ if(isUs) setUsPts(cp); else setOppPts(cp); upTot(); });
  if (d>0) showRestartModal(side||'us');
}

// ─── RESTART ──────────────────────────────────────────────────────────────────
function closeRestartDrawer() {
  document.getElementById('rstpanel').classList.remove('open');
  document.getElementById('rstovly').classList.remove('open');
}

function showRestartModal(side) {
  const label = side==='us' ? "Opposition's Restart" : "Own Restart";
  const pick = (result) => {
    closeRestartDrawer();
    const desc = label+': '+result;
    addRow(fmt(state.secs),'RSTR','brstr',desc);
    pushUndo(desc,()=>{});
  };
  const body = document.getElementById('rst-body');
  // eslint-disable-next-line no-restricted-syntax -- safe: static HTML only
  body.innerHTML =
    '<div class="ps-poss">'
      +'<button class="ps-poss-btn ps-poss-won"><span class="ps-poss-icon"><i class="fas fa-thumbs-up"></i></span>Won</button>'
      +'<button class="ps-poss-btn ps-poss-lost"><span class="ps-poss-icon"><i class="fas fa-thumbs-down"></i></span>Lost</button>'
    +'</div>'
    +'<button class="ps-poss-btn" style="width:100%;background:var(--bg2);color:var(--t2);"><span class="ps-poss-icon" style="background:var(--bg3);"><i class="fas fa-circle-question"></i></span>Unclear</button>'
    +'<button class="ps-pers-btn"><span class="ps-pers-icon"><i class="fas fa-people-arrows"></i></span>Substitution<i class="fas fa-chevron-right" style="margin-left:auto;font-size:12px;color:var(--t3);"></i></button>';
  body.querySelector('.ps-poss-won').onclick    = () => pick('Won');
  body.querySelector('.ps-poss-lost').onclick   = () => pick('Lost');
  body.querySelectorAll('.ps-poss-btn')[2].onclick = () => pick('Unclear');
  body.querySelector('.ps-pers-btn').onclick    = () => startRestartSub(side);
  document.getElementById('rstpanel').classList.add('open');
  document.getElementById('rstovly').classList.add('open');
}

function startRestartSub(side) {
  closeRestartDrawer();
  const sz = state.teamSize || 15;
  const avail = [];
  (TEAM_SLOTS[sz]||TEAM_SLOTS[15]).forEach(s => {
    const pi = state.slotp[s];
    if (!pi) return;
    const n = gn(pi);
    avail.push({ val: String(s), label: n, num: pi, sub: SLOT_POS[s] || '' });
  });
  postSubCb = () => showRestartModal(side);
  showSubDrawer('Who comes off?', avail, slot => {
    subOff = parseInt(slot);
    pickSubOn();
  });
}
