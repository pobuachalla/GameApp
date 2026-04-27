import js from '@eslint/js';
import globals from 'globals';

// Globals shared across all script files (window-scope equivalents)
const appGlobals = {
  // ── state.js ──
  state: 'writable',
  el: 'writable',
  undos: 'writable',
  selMode: 'writable',
  selSlot: 'writable',
  pendAct: 'writable',
  subOff: 'writable',
  pendScoreAdj: 'writable',
  pendActSaved: 'writable',
  pendSecVal: 'writable',
  pendSlotSaved: 'writable',
  zoneSelectedId: 'writable',
  zoneSelectedCoords: 'writable',
  shotMapTeamFilter: 'writable',
  shotMapHalfFilter: 'writable',
  shotMapPlayerFilter: 'writable',
  tInt: 'writable',
  tRun: 'writable',
  modalHandlerRef: 'writable',
  initialsCache: 'writable',
  setUsGoals: 'writable',
  setUsPts: 'writable',
  setOppGoals: 'writable',
  setOppPts: 'writable',
  usTotal: 'writable',
  oppTotal: 'writable',
  pad: 'writable',
  fmt: 'writable',
  esc: 'writable',
  gn: 'writable',
  pl: 'writable',
  initEl: 'writable',

  // ── constants.js ──
  ACTS: 'writable',
  SSEC: 'writable',
  FSEC: 'writable',
  NS: 'writable',
  SAVE_KEY: 'writable',
  DEFAULT_US: 'writable',
  PITCH_SVG_INNER: 'writable',
  ZONE_COLS: 'writable',
  ZONE_ROWS: 'writable',
  ZONE_SCHEME: 'writable',
  ZPX: 'writable',
  ZPY: 'writable',
  ZPW: 'writable',
  ZPH: 'writable',
  ZCW: 'writable',
  ZCH: 'writable',
  PLACED_BALL: 'writable',
  GRID_LAYOUTS: 'writable',
  VALID_TRANSITIONS: 'writable',
  ACTION_GROUPS: 'writable',
  ACTION_META: 'writable',
  ZONE_ACTS: 'writable',

  // ── wakelock.js ──
  wakeLock: 'writable',
  acquireWakeLock: 'writable',
  releaseWakeLock: 'writable',
  reacquireWakeLock: 'writable',

  // ── persistence.js ──
  saveStateTimeoutId: 'writable',
  serializeState: 'writable',
  saveState: 'writable',
  loadSavedState: 'writable',
  clearSavedState: 'writable',
  saveStateImmediate: 'writable',

  // ── ui-core.js ──
  html: 'writable',
  toast: 'writable',
  syncMeta: 'writable',
  upTot: 'writable',
  setGrid: 'writable',
  buildInitialsCache: 'writable',
  computeInitials: 'writable',
  gi: 'writable',
  playerScore: 'writable',
  refBtn: 'writable',
  refAllBtns: 'writable',

  // ── modal.js ──
  handleModalClick: 'writable',
  showOpts: 'writable',
  closeMod: 'writable',

  // ── timer.js ──
  periodLabel: 'writable',
  periodBadge: 'writable',
  transition: 'writable',
  applyStateEffects: 'writable',
  renderTimerUI: 'writable',
  timerPrimaryAction: 'writable',
  timerSecondaryAction: 'writable',
  handleEndHalf: 'writable',
  handleEndMatch: 'writable',
  startInterval: 'writable',
  stopInterval: 'writable',
  tick: 'writable',

  // ── events.js ──
  tail: 'writable',
  addRow: 'writable',
  pushUndo: 'writable',
  undoLast: 'writable',
  toggleSelMode: 'writable',
  toggleRow: 'writable',
  updateRemoveBar: 'writable',
  clearSelection: 'writable',
  removeSelected: 'writable',

  // ── scoring.js ──
  buildScorerSummary: 'writable',
  formatScorer: 'writable',
  showFullTimeResult: 'writable',
  resetMatch: 'writable',
  doReset: 'writable',
  openScoreModal: 'writable',
  showScoreHowModal: 'writable',
  completeScoreAdj: 'writable',
  adjUs: 'writable',
  adjOpp: 'writable',
  adjFootball: 'writable',
  showRestartModal: 'writable',

  // ── players.js ──
  sel: 'writable',
  actCb: 'writable',
  secCb: 'writable',
  showZonePicker: 'writable',
  getZonePreselect: 'writable',
  getZonePreselectCoords: 'writable',
  getZoneCellCoords: 'writable',
  buildZoneSVG: 'writable',
  selectZoneCell: 'writable',
  closeZone: 'writable',
  confirmZone: 'writable',
  skipZone: 'writable',
  badgeCls: 'writable',
  logEv: 'writable',
  pickSubOn: 'writable',
  execSub: 'writable',

  // ── clubs.js ──
  MEATH_CLUBS: 'writable',
  COUNTIES: 'writable',
  findCountyCrest: 'writable',
  findClub: 'writable',

  // ── share.js ──
  shareWA: 'writable',
  shareCSV: 'writable',
  openLog: 'writable',
  closeLog: 'writable',
  showScoreGraphic: 'writable',
  closeScoreGraphic: 'writable',
  openCurrentScoreCard: 'writable',
  showLineupGraphic: 'writable',
  openShareMenu: 'writable',

  // ── settings.js ──
  saveTpl: 'writable',
  loadTpl: 'writable',
  delTpl: 'writable',
  updateTpl: 'writable',
  renderTpls: 'writable',
  openSettings: 'writable',
  closeSettings: 'writable',
  renderBench: 'writable',
  addBRow: 'writable',
  flushSettings: 'writable',
  onSportToggle: 'writable',
  renderPGrid: 'writable',
  setCaptain: 'writable',
  attachDragHandle: 'writable',
  buildPlayerRow: 'writable',
  onSizeToggle: 'writable',
  onShotLocToggle: 'writable',
  onPlayerNumToggle: 'writable',
  switchSetupTab: 'writable',
  clearAllNames: 'writable',

  // ── layout.js ──
  _teamCrest: 'writable',
  openLayout: 'writable',
  closeLayout: 'writable',
  renderLayout: 'writable',

  // ── stats.js ──
  buildTimelineHTML: 'writable',
  buildSubTableHTML: 'writable',
  showHalfTimeReport: 'writable',
  rstBlock: 'writable',
  openStats: 'writable',
  closeStats: 'writable',
  renderStats: 'writable',
  buildStatsHTML: 'writable',
  buildShotMapHTML: 'writable',
  setShotMapFilter: 'writable',

  // ── print.js ──
  buildPrintTimelineHTML: 'writable',
  buildPrintLineupHTML: 'writable',
  buildPrintHTML: 'writable',
  buildPrintShotMapHTML: 'writable',
  printStats: 'writable',

  // ── app.js ──
  restoreUI: 'writable',
  init: 'writable',
};

export default [
  js.configs.recommended,
  {
    files: ['js/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'script',
      globals: {
        ...globals.browser,
        ...appGlobals,
      },
    },
    rules: {
      // Only warn on unused vars inside functions; top-level globals are shared
      // across script files so ESLint can't see their usage from other files.
      'no-unused-vars': ['warn', { vars: 'local', args: 'after-used', caughtErrors: 'none' }],
      'no-undef': 'error',
      'eqeqeq': ['warn', 'smart'],
      // Every js/ file intentionally contributes globals consumed by other files.
      'no-implicit-globals': 'off',
      // Don't treat appGlobals entries as "built-in" — the file that defines a
      // function shouldn't error just because we also listed it in the config.
      'no-redeclare': ['error', { builtinGlobals: false }],
      'no-var': 'warn',
      // Empty catch blocks are used deliberately to swallow localStorage/WakeLock errors.
      'no-empty': ['error', { allowEmptyCatch: true }],
      // ── SAST: eval is forbidden — no dynamic code execution.
      'no-eval': 'error',
      'no-implied-eval': 'error',
      // ── SAST: every innerHTML assignment must pass through esc() or the html``
      // tagged template. Suppress with an explanatory eslint-disable comment once
      // each site has been audited. New sites must get the same treatment.
      'no-restricted-syntax': ['warn', {
        selector: 'AssignmentExpression[left.property.name="innerHTML"]',
        message: 'innerHTML assignment — ensure all interpolated values are passed through esc() or the html`` tagged template, then suppress with: // eslint-disable-next-line no-restricted-syntax -- safe: <reason>',
      }],
    },
  },
];
