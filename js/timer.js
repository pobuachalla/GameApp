'use strict';

// ─── PERIOD LABELS ────────────────────────────────────────────────────────────
const periodLabel = n => ['1st Half','2nd Half','1st Half ET','2nd Half ET'][n-1] || ('Period '+n);
const periodBadge = n => ['1H','2H','ET1','ET2'][n-1] || ('P'+n);

// ─── STATE MACHINE ────────────────────────────────────────────────────────────
function transition(newState) {
  const allowed = VALID_TRANSITIONS[state.matchState];
  if (!allowed || !allowed.includes(newState)) return;
  const prev = state.matchState;
  state.matchState = newState;
  applyStateEffects(prev, newState);
  renderTimerUI();
  saveState();
}

function applyStateEffects(prev, next) {
  const now = new Date();
  const clockStr = pad(now.getHours())+':'+pad(now.getMinutes());

  switch (next) {
    case 'RUNNING_FIRST_HALF':
      if (prev === 'PRE_MATCH') {
        state.period = 1;
        state.secs = 0;
        state.tWallStart = Date.now();
        state.tPausedAt = 0;
        state.startSlotp   = Object.assign({}, state.slotp);
        state.startCaptain = state.captain;
        tRun = true;
        startInterval();
        el['timer-display'].textContent = '00:00';
        el['timer-display'].classList.remove('overtime','muted');
        addRow('00:00','1H','bperiod','1st Half started at '+clockStr);
        pushUndo('1st Half started',()=>{});
        setGrid(true);
      } else {
        state.tWallStart = Date.now() - state.tPausedAt * 1000;
        tRun = true;
        startInterval();
        el['timer-display'].classList.remove('muted');
        setGrid(true);
      }
      break;

    case 'PAUSED_FIRST_HALF':
      if (state.tWallStart) {
        state.tPausedAt = Math.floor((Date.now() - state.tWallStart) / 1000);
        state.secs = state.tPausedAt;
      }
      tRun = false;
      stopInterval();
      break;

    case 'HALF_TIME':
      if (state.tWallStart) {
        state.tPausedAt = Math.floor((Date.now() - state.tWallStart) / 1000);
        state.secs = state.tPausedAt;
      }
      tRun = false;
      stopInterval();
      state.tWallStart = null;
      state.htGoals = state.goals; state.htPts = state.pts;
      state.htOg    = state.og;    state.htOp  = state.op_;
      el['timer-display'].classList.add('muted');
      el['timer-display'].classList.remove('overtime');
      addRow(fmt(state.secs),'1H','bperiod','1st Half ended at '+clockStr);
      pushUndo('1st Half ended',()=>{});
      setGrid(true);
      showHalfTimeReport();
      break;

    case 'RUNNING_SECOND_HALF':
      if (prev === 'HALF_TIME') {
        state.period = 2;
        state.secs = 0;
        state.tWallStart = Date.now();
        state.tPausedAt = 0;
        tRun = true;
        startInterval();
        el['timer-display'].textContent = '00:00';
        el['timer-display'].classList.remove('overtime','muted');
        addRow('00:00','2H','bperiod','2nd Half started at '+clockStr);
        pushUndo('2nd Half started',()=>{});
        setGrid(true);
      } else {
        state.tWallStart = Date.now() - state.tPausedAt * 1000;
        tRun = true;
        startInterval();
        el['timer-display'].classList.remove('muted');
        setGrid(true);
      }
      break;

    case 'PAUSED_SECOND_HALF':
      if (state.tWallStart) {
        state.tPausedAt = Math.floor((Date.now() - state.tWallStart) / 1000);
        state.secs = state.tPausedAt;
      }
      tRun = false;
      stopInterval();
      break;

    case 'FULL_TIME':
      if (state.tWallStart) {
        state.tPausedAt = Math.floor((Date.now() - state.tWallStart) / 1000);
        state.secs = state.tPausedAt;
      }
      tRun = false;
      stopInterval();
      state.tWallStart = null;
      state.ftGoals = state.goals; state.ftPts = state.pts;
      state.ftOg    = state.og;    state.ftOp  = state.op_;
      el['timer-display'].classList.add('muted');
      setGrid(false);
      showFullTimeResult();
      break;
  }
}

function renderTimerUI() {
  const s = state.matchState;
  const isRunning = s==='RUNNING_FIRST_HALF' || s==='RUNNING_SECOND_HALF';
  const isPaused  = s==='PAUSED_FIRST_HALF'  || s==='PAUSED_SECOND_HALF';
  const inFirst   = s==='RUNNING_FIRST_HALF' || s==='PAUSED_FIRST_HALF';
  const inSecond  = s==='RUNNING_SECOND_HALF'|| s==='PAUSED_SECOND_HALF';

  // Period badge
  const pb = el['period-badge'];
  pb.classList.remove('halftime','fulltime');
  if      (s==='HALF_TIME')  { pb.textContent='Half-Time'; pb.classList.add('halftime'); }
  else if (s==='FULL_TIME')  { pb.textContent='Full-Time'; pb.classList.add('fulltime'); }
  else if (inSecond)         { pb.textContent='2nd Half'; }
  else                       { pb.textContent='1st Half'; }

  // Status chip
  const sc = el['status-chip'];
  if (isRunning) {
    sc.style.display='';
    sc.className='status-chip running';
    // eslint-disable-next-line no-restricted-syntax -- safe: static HTML only
    sc.innerHTML='<i class="fas fa-clock" aria-hidden="true"></i> Running';
  } else if (isPaused) {
    sc.style.display='';
    sc.className='status-chip paused';
    // eslint-disable-next-line no-restricted-syntax -- safe: static HTML only
    sc.innerHTML='<i class="fas fa-circle-pause" aria-hidden="true"></i> Paused';
  } else {
    sc.style.display='none';
  }

  // Primary button
  const primBtn = el['timer-primary-btn'];
  const primIcon = document.getElementById('timer-primary-icon');
  const primMap  = {
    PRE_MATCH:           {icon:'fa-play',    cls:'green'},
    RUNNING_FIRST_HALF:  {icon:'fa-pause',   cls:'amber'},
    PAUSED_FIRST_HALF:   {icon:'fa-play',    cls:'blue'},
    HALF_TIME:           {icon:'fa-forward', cls:'green'},
    RUNNING_SECOND_HALF: {icon:'fa-pause',   cls:'amber'},
    PAUSED_SECOND_HALF:  {icon:'fa-play',    cls:'blue'},
  };
  const pc = primMap[s];
  if (pc) {
    primBtn.style.visibility='';
    primBtn.className='timer-primary-btn '+pc.cls;
    primIcon.className='fas '+pc.icon;
  } else {
    primBtn.style.visibility='hidden';
  }

  // Secondary button
  const secBtn  = el['timer-secondary-btn'];
  const secIcon = document.getElementById('timer-secondary-icon');
  const secLbl  = document.getElementById('timer-secondary-label');
  if (inFirst) {
    secBtn.style.visibility='';
    secBtn.className='timer-secondary-btn end-half';
    secIcon.className='fas fa-hourglass-half';
    secLbl.textContent='End Half';
  } else if (inSecond) {
    secBtn.style.visibility='';
    secBtn.className='timer-secondary-btn end-match';
    secIcon.className='fas fa-flag-checkered';
    secLbl.textContent='End Match';
  } else {
    secBtn.style.visibility='hidden';
    secBtn.className='timer-secondary-btn';
  }
}

function timerPrimaryAction() {
  switch (state.matchState) {
    case 'PRE_MATCH':           transition('RUNNING_FIRST_HALF');  break;
    case 'RUNNING_FIRST_HALF':  transition('PAUSED_FIRST_HALF');   break;
    case 'PAUSED_FIRST_HALF':   transition('RUNNING_FIRST_HALF');  break;
    case 'HALF_TIME':           transition('RUNNING_SECOND_HALF'); break;
    case 'RUNNING_SECOND_HALF': transition('PAUSED_SECOND_HALF');  break;
    case 'PAUSED_SECOND_HALF':  transition('RUNNING_SECOND_HALF'); break;
  }
}

function timerSecondaryAction() {
  const s = state.matchState;
  if (s==='RUNNING_FIRST_HALF' || s==='PAUSED_FIRST_HALF')   handleEndHalf();
  else if (s==='RUNNING_SECOND_HALF' || s==='PAUSED_SECOND_HALF') handleEndMatch();
}

function handleEndHalf() {
  el.mtitle.textContent = 'End First Half?';
  // eslint-disable-next-line no-restricted-syntax -- safe: static HTML only
  el.mopts.innerHTML =
    '<p style="font-size:14px;color:var(--t2);padding:4px 0 14px;line-height:1.5;">Start half-time and stop the timer.</p>'
   +'<button class="abtn confirm-action-btn" style="font-weight:600;border-color:var(--bm);"><i class="fas fa-triangle-exclamation" aria-hidden="true"></i> Confirm End Half</button>';
  el.modal.style.display = 'block';
  el.mopts.querySelector('.confirm-action-btn').addEventListener('click', () => { closeMod(); transition('HALF_TIME'); });
}

function handleEndMatch() {
  el.mtitle.textContent = 'End Match?';
  // eslint-disable-next-line no-restricted-syntax -- safe: static HTML only
  el.mopts.innerHTML =
    '<p style="font-size:14px;color:var(--t2);padding:4px 0 14px;line-height:1.5;">Mark the game as full-time and stop the timer.</p>'
   +'<button class="abtn confirm-action-btn" style="font-weight:600;border-color:var(--bm);"><i class="fas fa-triangle-exclamation" aria-hidden="true"></i> Confirm End Match</button>';
  el.modal.style.display = 'block';
  el.mopts.querySelector('.confirm-action-btn').addEventListener('click', () => { closeMod(); transition('FULL_TIME'); });
}

function startInterval() {
  stopInterval();
  tInt = setInterval(tick, 1000);
  acquireWakeLock();
}

function stopInterval() {
  if (tInt) { clearInterval(tInt); tInt = null; }
  releaseWakeLock();
}

function tick() {
  if (!state.tWallStart) return;
  const elapsed = Math.floor((Date.now() - state.tWallStart) / 1000);
  state.secs = elapsed;
  const td = el['timer-display'];
  td.textContent = fmt(elapsed);
  if (elapsed >= 1800 && !td.classList.contains('overtime')) td.classList.add('overtime');
  if (elapsed % 30 === 0) saveState();
}
