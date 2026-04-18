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
  el.mtitle.textContent = 'Full Time';
  el.mopts.innerHTML =
    '<p style="font-size:15px;font-weight:500;color:var(--t1);padding:6px 0 4px;">'+esc(state.usN)+'</p>'
   +'<p style="font-size:32px;font-weight:500;color:var(--t1);padding:0 0 4px;line-height:1;">'+state.goals+'-'+state.pts+' <span style="font-size:16px;color:var(--t2);">('+u+')</span></p>'
   +'<p style="font-size:15px;font-weight:500;color:var(--t1);padding:4px 0;">'+esc(state.oppN)+'</p>'
   +'<p style="font-size:32px;font-weight:500;color:var(--t1);padding:0 0 16px;line-height:1;">'+state.og+'-'+state.op_+' <span style="font-size:16px;color:var(--t2);">('+o+')</span></p>'
   +'<p style="font-size:18px;font-weight:500;padding:0 0 16px;color:'+(result==='Win'?'var(--ts)':result==='Loss'?'var(--td)':'var(--t2)')+';">'+result+'</p>'
   +(()=>{
     const scorers = buildScorerSummary();
     if (!scorers.length) return '';
     return '<div style="border-top:.5px solid var(--b);padding-top:12px;">'
       +'<div style="font-size:10px;font-weight:600;letter-spacing:.07em;color:var(--t2);text-transform:uppercase;margin-bottom:8px;">Scorers</div>'
       +scorers.map(s=>'<div style="display:flex;flex-direction:column;padding:6px 0;border-bottom:.5px solid var(--b);font-size:13px;color:var(--t1);">'+formatScorer(s)+'</div>').join('')
       +'</div>';
   })();
  el.modal.style.display = 'block';
  el.modal.dataset.cancelAction = 'dismiss';
  const cancelBtn = el.modal.querySelector('button[onclick="closeMod()"]');
  if (cancelBtn) cancelBtn.textContent = 'Okay';
  const ub = document.getElementById('undobtn');
  if (ub) {
    ub.id='resetbtn'; ub.disabled=false; ub.classList.remove('danger');
    ub.innerHTML='<i class="fas fa-arrows-rotate" aria-hidden="true"></i>Reset';
    ub.onclick=resetMatch;
  }
}

// ─── RESET ────────────────────────────────────────────────────────────────────
function resetMatch() {
  el.mtitle.textContent = 'Reset match?';
  el.mopts.innerHTML = '<p style="font-size:14px;color:var(--t2);padding:4px 0 14px;line-height:1.5;">All scores, events and cards will be cleared. Team and player settings are kept.</p>'
    +'<button class="abtn" style="color:var(--td);border-color:var(--bd);">Clear everything and reset</button>';
  el.modal.style.display = 'block';
  el.mopts.querySelector('.abtn').addEventListener('click', () => { closeMod(); doReset(); });
}

function doReset() {
  setUsGoals(0); setUsPts(0); setOppGoals(0); setOppPts(0);
  upTot();
  state.evts=[]; undos=[];
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
  for (let s=1; s<=sz; s++) state.slotp[s]=s;
  renderPGrid();
  state.ubench={}; state.suboff={}; state.maxB=17;
  const rb = document.getElementById('resetbtn');
  if (rb) {
    rb.id='undobtn'; rb.classList.add('danger');
    rb.innerHTML='<i class="fas fa-rotate-left" aria-hidden="true"></i>Undo';
    rb.onclick=undoLast; rb.disabled=true;
  }
  refAllBtns();
  clearSavedState();
  toast('Match reset');
}

// ─── SCORE ADJUST ─────────────────────────────────────────────────────────────
function openScoreModal(side) {
  const isUs = side==='us';
  const name = isUs ? state.usN : state.oppN;
  el.mtitle.textContent = esc(name)+' — adjust score';
  let html = '<div class="action-group"><div class="action-group-label">Scores</div><div class="opts-grid">';
  html += '<button class="abtn score-btn-goal" data-v="g+"><i class="fas fa-flag fa-beat-fade"></i>+ Goal</button>';
  html += '<button class="abtn action-btn-neutral" data-v="g-">− Goal</button>';
  if (state.sport==='football') {
    html += '<button class="abtn score-btn-2p" data-v="f+"><i class="fas fa-flag fa-beat-fade"></i>+ 2 Point</button>';
    html += '<button class="abtn action-btn-neutral" data-v="f-">− 2 Point</button>';
  }
  html += '<button class="abtn score-btn-point" data-v="p+"><i class="far fa-flag fa-beat-fade"></i>+ Point</button>';
  html += '<button class="abtn action-btn-neutral" data-v="p-">− Point</button>';
  html += '<button class="abtn action-btn-wide" data-v="w+" style="grid-column:1 / -1;"><i class="fa-solid fa-child-reaching"></i>Wide</button>';
  html += '</div></div>';
  el.mopts.innerHTML = html;
  el.modal.style.display = 'block';
  modalHandlerRef = (v) => {
    closeMod();
    if (v==='w+') {
      const wTeam = isUs ? state.usN : state.oppN;
      const wBadge = isUs ? 'ADJ' : 'OPP';
      const wCls   = isUs ? 'badj' : 'bopp';
      const wDesc  = wTeam + ': Wide';
      addRow(fmt(state.secs), wBadge, wCls, wDesc);
      const wEv = state.evts[state.evts.length - 1];
      wEv.action = 'Wide';
      wEv.side = side;
      pushUndo(wDesc, () => {});
      return showRestartModal(side);
    }
    if (v.endsWith('-')) {
      if (v.startsWith('f')) { adjFootball(-2, side, null); }
      else { if (isUs) adjUs(v[0], -1, side, null); else adjOpp(v[0], -1, side, null); }
    } else {
      pendScoreAdj = {type: v[0], d: v.startsWith('f') ? 2 : 1, isFb: v.startsWith('f'), side};
      showScoreHowModal();
    }
  };
  el.mopts.addEventListener('click', handleModalClick);
}

function showScoreHowModal() {
  const isFb = pendScoreAdj.isFb;
  el.mtitle.textContent = 'How scored?';
  let opts;
  if (isFb) {
    opts = ['From Play', 'From Free'];
  } else {
    const from65label = state.sport==='football' ? 'From 45' : 'From 65';
    opts = ['From Play', 'From Free', from65label, 'From Penalty'];
  }
  let html = '<div class="opts-grid">';
  opts.forEach(o => {
    html += '<button class="abtn" data-v="'+esc(o)+'">'+esc(o)+'</button>';
  });
  html += '</div>';
  el.mopts.innerHTML = html;
  el.modal.style.display = 'block';
  modalHandlerRef = (how) => {
    closeMod();
    completeScoreAdj(how);
  };
  el.mopts.addEventListener('click', handleModalClick);
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
function showRestartModal(side) {
  const label = side==='us' ? "Opposition's Restart" : "Own Restart";
  el.mtitle.textContent = 'Restart won?';
  el.mopts.innerHTML = '<div class="opts-grid">'
    +'<button class="abtn" data-v="Won"     style="background:#2E7D32;color:#fff;border-color:#2E7D32;"><i class="fas fa-thumbs-up"></i>Won</button>'
    +'<button class="abtn" data-v="Lost"    style="background:#C62828;color:#fff;border-color:#C62828;"><i class="fas fa-thumbs-down"></i>Lost</button>'
    +'<button class="abtn" data-v="Unclear" style="grid-column:1 / -1;">Unclear</button>'
    +'</div>';
  el.modal.style.display = 'block';
  modalHandlerRef = (result) => {
    closeMod();
    const desc = label+': '+result;
    addRow(fmt(state.secs),'RSTR','brstr',desc);
    pushUndo(desc,()=>{});
  };
  el.mopts.addEventListener('click', handleModalClick);
}
