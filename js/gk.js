'use strict';

// ─── GK SHOT-STOPPING ─────────────────────────────────────────────────────────

// ── Pure scoring functions ────────────────────────────────────────────────────
function gkBaseValue(intensity, saveScore) {
  return (intensity - 1) + (saveScore - 1);
}

function gkFinalValue(intensity, saveScore, secondary) {
  return gkBaseValue(intensity, saveScore) + (secondary != null ? secondary - 3 : 0);
}

// ── Session state ─────────────────────────────────────────────────────────────
let _gkFlow            = null; // 'save' | 'goal'
let _gkSlot            = null;
let _gkGoalEvtIdx      = null; // index into state.evts for the goal-against event
let _gkIntensity       = null;
let _gkSaveScore       = null;
let _gkSecondary       = null;
let _gkSecondaryVis    = false;

// Set by adjOpp so closeGKModal knows which restart drawer to open after goal flow
let _pendingRestartSide = null;

// ── Heatmap (bv 0–8): red-soft → neutral → green-deep ────────────────────────
const _GK_HEAT = [
  [245,200,194], // bv 0 — #f5c8c2
  [243,209,203],
  [241,219,211],
  [238,228,220],
  [236,237,229], // bv 4 — #ecede5 (expected diagonal)
  [185,197,184],
  [134,157,140],
  [83, 117, 96],
  [31,  77,  52], // bv 8 — #1f4d34
];

function _gkBg(bv)  { const [r,g,b] = _GK_HEAT[bv]||_GK_HEAT[0]; return `rgb(${r},${g},${b})`; }
function _gkFg(bv)  { return bv >= 6 ? '#fff' : '#1f1f1f'; }

// ── Labels ────────────────────────────────────────────────────────────────────
const _I_LBL  = ['','Easy','Low difficulty','Mid difficulty','Hard shot','Unstoppable'];
const _S_LBL  = ['','Beaten','Parried','Loose ball','Pushed clear','Full control'];
const _S2_LBL = ['','Scored rebound','Poor clearance','Neutral','Good clearance','Brilliant'];

// ── Open / close ──────────────────────────────────────────────────────────────
function openGKSaveFlow(slot) {
  _gkFlow = 'save'; _gkSlot = slot; _gkGoalEvtIdx = null;
  _gkIntensity = null; _gkSaveScore = null; _gkSecondary = null; _gkSecondaryVis = false;
  _gkRender();
  document.getElementById('gkovly').classList.add('open');
  document.getElementById('gkpanel').classList.add('open');
}

function openGKGoalFlow(evtIdx, restartSide) {
  _gkFlow = 'goal'; _gkSlot = 1; _gkGoalEvtIdx = evtIdx;
  _gkIntensity = null; _gkSaveScore = 1; _gkSecondary = null; _gkSecondaryVis = false;
  _pendingRestartSide = restartSide || null;
  _gkRender();
  document.getElementById('gkovly').classList.add('open');
  document.getElementById('gkpanel').classList.add('open');
}

function closeGKModal() {
  const wasGoalFlow  = _gkFlow === 'goal';
  const restartSide  = _pendingRestartSide;
  document.getElementById('gkovly').classList.remove('open');
  document.getElementById('gkpanel').classList.remove('open');
  _gkFlow = null; _gkSlot = null; _gkGoalEvtIdx = null;
  _gkIntensity = null; _gkSaveScore = null; _gkSecondary = null; _gkSecondaryVis = false;
  _pendingRestartSide = null;
  if (wasGoalFlow && restartSide != null) showRestartModal(restartSide);
}

// ── Render ────────────────────────────────────────────────────────────────────
function _gkRender() {
  const isGoal = _gkFlow === 'goal';
  const pi     = state.slotp[_gkSlot];

  // Title + subtitle
  document.getElementById('gk-panel-title').textContent = isGoal ? 'Rate the goal' : 'Rate the save';
  document.getElementById('gk-subtitle').textContent = isGoal
    ? 'Save score is locked at 1 — pick how preventable this was.'
    : 'Pick the cell that matches shot intensity and how well it was dealt with.';

  // Goal-against context banner
  const banner = document.getElementById('gk-goal-banner');
  if (isGoal && _gkGoalEvtIdx != null) {
    const ev = state.evts[_gkGoalEvtIdx];
    // eslint-disable-next-line no-restricted-syntax -- safe: esc() on ev.desc
    banner.innerHTML = '<i class="fas fa-shield-halved" aria-hidden="true"></i> ' + esc(ev ? ev.desc : '');
    banner.style.display = '';
  } else {
    banner.style.display = 'none';
  }

  // Player header
  const ini  = gi(pi);
  const name = gn(pi) || ('#' + pi);
  // eslint-disable-next-line no-restricted-syntax -- safe: esc() on all user values; slot is a number
  document.getElementById('gk-player-hdr').innerHTML =
    '<div class="gk-plr-bubble">' +
      '<span class="gk-plr-ini">' + esc(ini) + '</span>' +
      '<span class="gk-plr-num">' + _gkSlot + '</span>' +
    '</div>' +
    '<div class="gk-plr-info">' +
      '<div class="gk-plr-name">' + esc(name) + '</div>' +
      '<div class="gk-plr-pos">Goalkeeper <span class="gk-tag">GK</span></div>' +
    '</div>';

  // Lock pills — goal flow shows intensity pill that updates live
  const pills = document.getElementById('gk-lock-pills');
  if (isGoal) {
    _gkUpdatePills();
    pills.style.display = '';
  } else {
    pills.style.display = 'none';
  }

  _gkRenderMatrix();
  _gkUpdateReadout();
  _gkUpdateSecondary();
  _gkUpdateSubmitBtn();

  // Footer
  const cancelBtn = document.getElementById('gk-cancel-btn');
  const submitBtn = document.getElementById('gk-submit-btn');
  if (isGoal) {
    cancelBtn.textContent = 'Skip';
    cancelBtn.onclick = gkSkip;
    submitBtn.textContent = 'Log goal event';
    submitBtn.className = 'btn-primary gk-submit-danger';
  } else {
    cancelBtn.textContent = 'Cancel';
    cancelBtn.onclick = closeGKModal;
    submitBtn.textContent = 'Log save event';
    submitBtn.className = 'btn-primary';
  }
}

function _gkUpdatePills() {
  // eslint-disable-next-line no-restricted-syntax -- safe: static HTML; _gkIntensity is a number|null
  document.getElementById('gk-lock-pills').innerHTML =
    '<span class="gk-pill gk-pill-locked">Save score: 1 🔒</span>' +
    '<span class="gk-pill">Intensity: ' + (_gkIntensity != null ? _gkIntensity : '?') + '</span>';
}

function _gkRenderMatrix() {
  const isGoal = _gkFlow === 'goal';
  const matrix = document.getElementById('gk-matrix');
  let html = '';

  // Header row: corner cell + save score labels 1–5
  html += '<span class="gk-corner" aria-hidden="true"></span>';
  for (let s = 1; s <= 5; s++) {
    const dim = isGoal ? s !== 1 : s === 1; // dim unavailable columns
    html += '<span class="gk-col-hdr' + (dim ? ' gk-hdr-dim' : '') + '">' + s + '</span>';
  }

  // Data rows: intensity 5 → 1
  for (let i = 5; i >= 1; i--) {
    html += '<span class="gk-row-hdr">' + i + '</span>';
    for (let s = 1; s <= 5; s++) {
      const bv       = gkBaseValue(i, s);
      const disabled = isGoal ? s !== 1 : s === 1;
      const onDiag   = (i + s === 6);
      const selected = (_gkIntensity === i && _gkSaveScore === s);
      let cls = 'gk-cell';
      if (disabled) cls += ' gk-cell-dis';
      if (onDiag && !disabled) cls += ' gk-cell-diag';
      if (selected) cls += ' gk-cell-sel';
      const style = disabled ? '' : `background:${_gkBg(bv)};color:${_gkFg(bv)};`;
      const click  = disabled ? '' : `onclick="gkCellTap(${i},${s})"`;
      const title  = `I\xB7${i} S\xB7${s} → V\xB7${bv}`;
      html +=
        `<button class="${cls}" style="${style}" ${click} ` +
        `${disabled ? 'disabled' : ''} title="${title}" aria-label="${title}">` +
        `<span class="gk-cell-val">${bv}</span>` +
        `</button>`;
    }
  }

  // eslint-disable-next-line no-restricted-syntax -- safe: all values are numbers / computed strings
  matrix.innerHTML = html;
}

function _gkUpdateReadout() {
  const readout = document.getElementById('gk-readout');
  if (_gkIntensity == null || _gkSaveScore == null) { readout.style.display = 'none'; return; }
  const fv      = gkFinalValue(_gkIntensity, _gkSaveScore, _gkSecondary);
  const outcome = _gkSaveScore === 1 ? 'conceded' : 'saved';
  const text    = _I_LBL[_gkIntensity] + ' \xB7 ' + _S_LBL[_gkSaveScore] + ' \xB7 ' + outcome;
  const vColor  = fv <= 1 ? '#C62828' : fv <= 3 ? '#B45309' : fv <= 5 ? '#5c6200' : '#2E7D32';
  const s2Part  = _gkSecondary != null ? ' S2\xB7' + _gkSecondary : '';
  // eslint-disable-next-line no-restricted-syntax -- safe: text is from static arrays; esc() applied; fv is a number
  readout.innerHTML =
    '<span class="gk-readout-text">' + esc(text) + '</span>' +
    '<span class="gk-readout-code">I\xB7' + _gkIntensity + ' S\xB7' + _gkSaveScore + s2Part +
    ' <span class="gk-readout-v" style="color:' + vColor + '">V\xB7' + fv + '</span></span>';
  readout.style.display = '';
}

function _gkUpdateSecondary() {
  const wrap   = document.getElementById('gk-secondary-wrap');
  const toggle = document.getElementById('gk-secondary-toggle');
  // No secondary for goal flow (saveScore locked at 1), or for saveScore 1 / 5
  if (_gkSaveScore == null || _gkSaveScore === 1 || _gkSaveScore === 5 || _gkFlow === 'goal') {
    wrap.style.display   = 'none';
    toggle.style.display = 'none';
    return;
  }
  if (_gkSaveScore === 4) {
    if (_gkSecondaryVis) {
      toggle.style.display = 'none';
      wrap.style.display   = '';
    } else {
      toggle.style.display = '';
      wrap.style.display   = 'none';
    }
  } else {
    // saveScore 2 or 3: mandatory
    toggle.style.display = 'none';
    wrap.style.display   = '';
  }
  if (wrap.style.display !== 'none') _gkRenderSecondary();
}

function _gkRenderSecondary() {
  const row = document.getElementById('gk-secondary-row');
  let html  = '';
  for (let s = 1; s <= 5; s++) {
    const sel = _gkSecondary === s;
    html +=
      '<button class="gk-sec-btn' + (sel ? ' gk-sec-btn-sel' : '') + '" onclick="gkSecTap(' + s + ')">' +
      '<span class="gk-sec-num">' + s + '</span>' +
      '<span class="gk-sec-lbl">' + _S2_LBL[s] + '</span>' +
      '</button>';
  }
  // eslint-disable-next-line no-restricted-syntax -- safe: all computed from numbers / static arrays
  row.innerHTML = html;
}

function _gkUpdateSubmitBtn() {
  const btn = document.getElementById('gk-submit-btn');
  let ok = false;
  if (_gkFlow === 'goal') {
    ok = _gkIntensity != null;
  } else {
    ok = _gkIntensity != null && _gkSaveScore != null &&
      (_gkSaveScore !== 2 && _gkSaveScore !== 3 || _gkSecondary != null);
  }
  btn.disabled = !ok;
}

// ── User interaction handlers ─────────────────────────────────────────────────
function gkCellTap(intensity, save) {
  if (_gkFlow === 'goal') {
    _gkIntensity = intensity;
    _gkUpdatePills();
  } else {
    if (_gkSaveScore !== save) { _gkSecondary = null; _gkSecondaryVis = false; }
    _gkIntensity = intensity;
    _gkSaveScore = save;
  }
  _gkRenderMatrix();
  _gkUpdateReadout();
  _gkUpdateSecondary();
  _gkUpdateSubmitBtn();
}

function gkSecTap(s) {
  _gkSecondary = s;
  _gkRenderSecondary();
  _gkUpdateReadout();
  _gkUpdateSubmitBtn();
}

function gkToggleSecondary() {
  _gkSecondaryVis = true;
  document.getElementById('gk-secondary-toggle').style.display = 'none';
  _gkUpdateSecondary();
}

function gkSkip() {
  // Goal flow only: close modal without rating (goal is already logged by adjOpp)
  if (_gkGoalEvtIdx != null && _gkGoalEvtIdx < state.evts.length) {
    state.evts[_gkGoalEvtIdx].gkSkipped = true;
  }
  closeGKModal();
  saveState();
}

function gkSubmit() {
  if (_gkFlow === 'save') _gkSubmitSave(); else _gkSubmitGoal();
}

function _gkSubmitSave() {
  const slot = _gkSlot;
  const pi   = state.slotp[slot];
  const I = _gkIntensity, S = _gkSaveScore, S2 = _gkSecondary;
  const bv   = gkBaseValue(I, S);
  const fv   = gkFinalValue(I, S, S2);
  const s2Pt = S2 != null ? ' S2\xB7' + S2 : '';
  const desc = pl(pi) + ': Save \xB7 I\xB7' + I + ' S\xB7' + S + s2Pt + ' V\xB7' + fv;

  addRow(fmt(state.secs), gi(pi), 'bgk', desc);
  const ev = state.evts[state.evts.length - 1];
  ev.slot = slot; ev.pi = pi; ev.action = 'GK Save';
  ev.gkIntensity = I; ev.gkSaveScore = S; ev.gkSecondary = S2;
  ev.gkBaseValue = bv; ev.gkFinalValue = fv; ev.gkOutcome = 'save';

  // Mark the GK button as having events (consistent with logEv)
  const btn = document.querySelector('[data-s="' + slot + '"]');
  if (btn && !btn.classList.contains('rc')) btn.classList.add('hev');

  pushUndo(desc, () => {
    const b = document.querySelector('[data-s="' + slot + '"]');
    if (b) {
      const still = state.evts.some(e => e.slot === slot);
      if (still) b.classList.add('hev'); else b.classList.remove('hev');
    }
  });

  closeGKModal();
}

function _gkSubmitGoal() {
  const idx = _gkGoalEvtIdx;
  if (idx == null || idx >= state.evts.length) { closeGKModal(); return; }
  const ev = state.evts[idx];
  const I  = _gkIntensity;
  const bv = gkBaseValue(I, 1);
  const fv = gkFinalValue(I, 1, null);

  // Enrich the existing opp-goal event with GK rating data
  ev.gkIntensity = I; ev.gkSaveScore = 1; ev.gkSecondary = null;
  ev.gkBaseValue = bv; ev.gkFinalValue = fv; ev.gkOutcome = 'goal';

  // Update the description and its DOM row so the log shows the rating
  const pi      = state.slotp[1];
  const gkName  = gn(pi) || ('GK #' + pi);
  ev.desc += ' \xB7 ' + esc(gkName) + ' I\xB7' + I + ' V\xB7' + fv;
  const row = el.evlog.querySelector('[data-ev-idx="' + idx + '"]');
  if (row) {
    const descEl = row.querySelector('span:last-child');
    if (descEl) descEl.textContent = ev.desc;
  }

  saveState();
  closeGKModal();
}
