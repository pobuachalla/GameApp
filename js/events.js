'use strict';

// ─── EVENT LOG ────────────────────────────────────────────────────────────────
const tail = () => {
  if (!el.logpanel || !el.logpanel.classList.contains('open')) return;
  el.evlog.scrollTop = el.evlog.scrollHeight;
};

function addRow(time, badge, cls, desc) {
  state.evts.push({time, badge, cls, desc});
  el.logempty.style.display = 'none';
  const r = document.createElement('div');
  r.className = 'ev-row'+(selMode?' sel-mode':'');
  r.dataset.evIdx = state.evts.length - 1;
  // eslint-disable-next-line no-restricted-syntax -- safe: time/cls are internal computed values; badge and desc pass through esc()
  r.innerHTML = '<div class="ev-check"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--ti)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="display:none"><polyline points="20 6 9 17 4 12"/></svg></div>'
    +'<span class="ev-time">'+time+'</span>'
    +'<span class="ev-bdg '+cls+'">'+esc(badge)+'</span>'
    +'<span style="color:var(--t1);font-size:13px;flex:1;">'+esc(desc)+'</span>';
  r.addEventListener('click', () => toggleRow(r));
  el.evlog.appendChild(r);
  tail(); syncMeta(); saveState();
}

// ─── UNDO ─────────────────────────────────────────────────────────────────────
// Contract: every undo entry that owns an event-log row (hasEvent, the default)
// must be pushed by the same action that called addRow, so the entry and the
// row stay paired LIFO. Actions that log no row pass {hasEvent:false}; actions
// that log a row no one may undo past (period markers) call clearUndos().
function pushUndo(lbl, fn, opts = {}) {
  undos.push({label:lbl, revert:fn, hasEvent: opts.hasEvent !== false});
  syncMeta();
}

function clearUndos() { undos = []; syncMeta(); }

function undoLast() {
  if (!undos.length) return;
  const op = undos.pop(); op.revert();
  if (op.hasEvent) {
    state.evts.pop();
    const rows = el.evlog.querySelectorAll('.ev-row');
    if (rows.length) rows[rows.length-1].remove();
    if (!state.evts.length) el.logempty.style.display='';
  }
  if (selMode) {
    selMode = false;
    el.seltoggle.classList.remove('active');
    el.removebar.classList.remove('show');
  }
  syncMeta(); saveState(); toast('Undone: '+op.label);
}

// ─── SELECTION ────────────────────────────────────────────────────────────────
function toggleSelMode() {
  selMode = !selMode;
  el.evlog.querySelectorAll('.ev-row').forEach(r => {
    r.classList.toggle('sel-mode', selMode);
    if (!selMode) r.classList.remove('selected');
  });
  el.seltoggle.classList.toggle('active', selMode);
  if (!selMode) el.removebar.classList.remove('show');
  updateRemoveBar();
}

function toggleRow(rowEl) {
  if (!selMode) return;
  rowEl.classList.toggle('selected');
  const chk = rowEl.querySelector('.ev-check svg');
  if (chk) chk.style.display = rowEl.classList.contains('selected') ? 'block' : 'none';
  updateRemoveBar();
}

function updateRemoveBar() {
  const n = el.evlog.querySelectorAll('.ev-row.selected').length;
  el.removelbl.textContent = n+' selected';
  el.removebar.classList.toggle('show', selMode && n>0);
}

function clearSelection() {
  el.evlog.querySelectorAll('.ev-row.selected').forEach(r => {
    r.classList.remove('selected');
    const chk = r.querySelector('.ev-check svg'); if (chk) chk.style.display='none';
  });
  updateRemoveBar();
}

function removeSelected() {
  const rows = Array.from(el.evlog.querySelectorAll('.ev-row'));
  const toRemove = rows.map((r,i) => r.classList.contains('selected')?i:-1).filter(i=>i>=0);
  for (let i=toRemove.length-1; i>=0; i--) { rows[toRemove[i]].remove(); state.evts.splice(toRemove[i],1); }
  undos = [];
  // Re-number surviving rows so data-ev-idx lookups (OSC/GK enrichment) stay correct
  Array.from(el.evlog.querySelectorAll('.ev-row')).forEach((r,i) => { r.dataset.evIdx = i; });
  // Replay the surviving events so the scoreboard matches what stats/exports recompute
  const scores = {usG:0, usP:0, oppG:0, oppP:0};
  state.evts.forEach(ev => applyScoreBadge(ev, scores, state.oppN));
  setUsGoals(scores.usG); setUsPts(scores.usP); setOppGoals(scores.oppG); setOppPts(scores.oppP);
  upTot();
  if (!state.evts.length) el.logempty.style.display='';
  selMode=false; el.seltoggle.classList.remove('active'); el.removebar.classList.remove('show');
  syncMeta(); saveState();
  toast('Removed '+toRemove.length+' event'+(toRemove.length!==1?'s':''));
}
