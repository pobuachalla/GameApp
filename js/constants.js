'use strict';

// ─── ACTION CONSTANTS ─────────────────────────────────────────────────────────
const ACTS  = ['Goal','Point','2 Point','Wide','Short','Saved','Free','Mark','Advanced','Card','Substitution','Turnover Won','Turnover Lost'];
const SSEC  = ['From Play','From Free','From Sideline','From Penalty','From 65'];
const FSEC  = ['Push','Chop','Steps','Tackle','Pickup','Throw','Other'];
const NS    = {Goal:SSEC,Point:SSEC,'2 Point':SSEC,Wide:SSEC,Short:SSEC,Saved:SSEC,Free:FSEC};

// ─── SAVE KEY / DEFAULTS ──────────────────────────────────────────────────────
const SAVE_KEY   = 'gaa_match_v1';
const DEFAULT_US = 'Donaghmore / Ashbourne';

// ─── PITCH SVG ────────────────────────────────────────────────────────────────
const PITCH_SVG_INNER = `<rect width="320" height="400" fill="#4C9A3A" rx="10"/><rect x="0" y="10" width="320" height="44" fill="#52a83f" opacity="0.5"/><rect x="0" y="98" width="320" height="44" fill="#52a83f" opacity="0.5"/><rect x="0" y="186" width="320" height="28" fill="#52a83f" opacity="0.5"/><rect x="0" y="258" width="320" height="44" fill="#52a83f" opacity="0.5"/><rect x="0" y="346" width="320" height="44" fill="#52a83f" opacity="0.5"/><rect x="10" y="10" width="300" height="380" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="2"/><line x1="10" y1="132" x2="310" y2="132" stroke="rgba(255,255,255,0.55)" stroke-width="1.4"/><line x1="10" y1="268" x2="310" y2="268" stroke="rgba(255,255,255,0.55)" stroke-width="1.4"/><line x1="10" y1="64" x2="310" y2="64" stroke="rgba(255,255,255,0.65)" stroke-width="1.6"/><line x1="10" y1="336" x2="310" y2="336" stroke="rgba(255,255,255,0.65)" stroke-width="1.6"/><line x1="10" y1="45" x2="310" y2="45" stroke="rgba(255,255,255,0.5)" stroke-width="1.3"/><line x1="10" y1="355" x2="310" y2="355" stroke="rgba(255,255,255,0.5)" stroke-width="1.3"/><line x1="10" y1="200" x2="310" y2="200" stroke="rgba(255,255,255,0.65)" stroke-width="1.6" stroke-dasharray="12 12"/><line x1="10" y1="185" x2="310" y2="185" stroke="rgba(255,255,255,0.5)" stroke-width="1.3"/><line x1="10" y1="215" x2="310" y2="215" stroke="rgba(255,255,255,0.5)" stroke-width="1.3"/><circle cx="160" cy="200" r="2.5" fill="rgba(255,255,255,0.6)"/><rect x="127" y="10" width="66" height="35" fill="none" stroke="rgba(255,255,255,0.65)" stroke-width="1.6"/><rect x="127" y="355" width="66" height="35" fill="none" stroke="rgba(255,255,255,0.65)" stroke-width="1.6"/><rect x="135" y="10" width="50" height="12" fill="none" stroke="rgba(255,255,255,0.65)" stroke-width="1.6"/><rect x="135" y="378" width="50" height="12" fill="none" stroke="rgba(255,255,255,0.65)" stroke-width="1.6"/><path d="M 114,64 A 46,35 0 0,0 206,64" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="1.5"/><path d="M 114,336 A 46,35 0 0,1 206,336" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="1.5"/><path d="M 38,64 A 141,108 0 0,0 282,64" fill="none" stroke="rgba(255,255,255,0.55)" stroke-width="1.4"/><path d="M 38,336 A 141,108 0 0,1 282,336" fill="none" stroke="rgba(255,255,255,0.55)" stroke-width="1.4"/><circle cx="160" cy="40" r="2.5" fill="rgba(255,255,255,0.6)"/><circle cx="160" cy="360" r="2.5" fill="rgba(255,255,255,0.6)"/><line x1="149" y1="0" x2="149" y2="12" stroke="rgba(255,255,255,0.8)" stroke-width="2.5"/><line x1="171" y1="0" x2="171" y2="12" stroke="rgba(255,255,255,0.8)" stroke-width="2.5"/><line x1="147" y1="3" x2="173" y2="3" stroke="rgba(255,255,255,0.8)" stroke-width="2.5"/><line x1="149" y1="388" x2="149" y2="400" stroke="rgba(255,255,255,0.8)" stroke-width="2.5"/><line x1="171" y1="388" x2="171" y2="400" stroke="rgba(255,255,255,0.8)" stroke-width="2.5"/><line x1="147" y1="397" x2="173" y2="397" stroke="rgba(255,255,255,0.8)" stroke-width="2.5"/>`;

// ─── ZONE GRID ────────────────────────────────────────────────────────────────
// 5 cols × 7 rows = 35 cells. At min 320px viewport (292px SVG width) cells
// are 58×52 px — both above the 44px minimum tap-target requirement.
// Attacking end is always at the bottom of the screen (row 6).
const ZONE_COLS   = 5;
const ZONE_ROWS   = 7;
const ZONE_SCHEME = 'fine-full-7x5';
// Playable pitch area in SVG viewBox coords (320×400)
const ZPX = 10, ZPY = 10, ZPW = 300, ZPH = 380;
const ZCW = ZPW / ZONE_COLS;   // 60 SVG units wide
const ZCH = ZPH / ZONE_ROWS;   // ≈54.3 SVG units tall

// ─── SCORING ──────────────────────────────────────────────────────────────────
const PLACED_BALL = new Set(['From Free','From Sideline','From Penalty','From 65','From 45']);

// ─── TEAM FORMATIONS ──────────────────────────────────────────────────────────
const GRID_LAYOUTS = {
  15: [[1],[2,3,4],[5,6,7],[8,9],[10,11,12],[13,14,15]],
  13: [[1],[2,4],[5,6,7],[8,9],[10,11,12],[13,15]],
};

// Flat ordered slot lists derived from GRID_LAYOUTS — use instead of for(1..teamSize)
const TEAM_SLOTS = {};
Object.keys(GRID_LAYOUTS).forEach(k => { TEAM_SLOTS[+k] = GRID_LAYOUTS[k].flat(); });

// ─── STATE MACHINE ────────────────────────────────────────────────────────────
const VALID_TRANSITIONS = {
  PRE_MATCH:            ['RUNNING_FIRST_HALF'],
  RUNNING_FIRST_HALF:   ['PAUSED_FIRST_HALF','HALF_TIME'],
  PAUSED_FIRST_HALF:    ['RUNNING_FIRST_HALF','HALF_TIME'],
  HALF_TIME:            ['RUNNING_SECOND_HALF'],
  RUNNING_SECOND_HALF:  ['PAUSED_SECOND_HALF','FULL_TIME'],
  PAUSED_SECOND_HALF:   ['RUNNING_SECOND_HALF','FULL_TIME'],
  FULL_TIME:            [],
};

// ─── ACTION UI METADATA ───────────────────────────────────────────────────────
const ACTION_GROUPS = [
  {label:'Scores',    items:['Goal','Wide','Point','Short','2 Point','Saved']},
  {label:'Possession',items:['Turnover Won','Turnover Lost']},
  {label:'Discipline',items:['Free','Advanced','Card','Yellow Card','Black Card','Red Card']},
  {label:'Personnel', items:['Substitution']},
];
const ACTION_META = {
  'Goal':        {cls:'score-btn-goal', icon:'<i class="fas fa-flag fa-beat-fade"></i>'},
  'Point':       {cls:'score-btn-point',icon:'<i class="far fa-flag fa-beat-fade"></i>'},
  '2 Point':     {cls:'score-btn-2p',   icon:'<i class="fas fa-flag fa-beat-fade"></i>'},
  'Wide':        {cls:'action-btn-wide',icon:'<i class="fa-solid fa-child-reaching"></i>'},
  'Short':       {cls:'action-btn-wide',icon:'<i class="fas fa-arrow-down"></i>'},
  'Saved':       {cls:'action-btn-wide',icon:'<i class="fas fa-hand"></i>'},
  'Free':        {cls:'action-btn-neutral',icon:'<i class="fas fa-whistle"></i>'},
  'Advanced':    {cls:'action-btn-neutral',icon:'<i class="fas fa-forward-step"></i>'},
  'Card':        {cls:'action-btn-neutral',icon:'<span style="display:inline-flex;gap:2px;align-items:center;"><i class="fas fa-square" style="font-size:10px;color:#FDD835;"></i><i class="fas fa-square" style="font-size:10px;color:#2c2c2a;"></i><i class="fas fa-square" style="font-size:10px;color:#E53935;"></i></span>'},
  'Red Card':    {cls:'action-btn-red',   icon:''},
  'Yellow Card': {cls:'action-btn-yellow',icon:''},
  'Black Card':  {cls:'action-btn-black', icon:''},
  'Substitution':  {cls:'action-btn-sub',          icon:'<i class="fas fa-people-arrows"></i>'},
  'Turnover Won':  {cls:'action-btn-turnover-won',  icon:'<i class="fas fa-turn-up"></i>'},
  'Turnover Lost': {cls:'action-btn-turnover-lost', icon:'<i class="fas fa-turn-down"></i>'},
  'Mark':          {cls:'action-btn-neutral',icon:'<i class="fas fa-hand-sparkles"></i>'},
};

// ─── SLOT POSITIONS ───────────────────────────────────────────────────────────
const SLOT_POS = [
  '',                     // 0 (unused)
  'Goalkeeper',           // 1
  'Left Corner-Back',     // 2
  'Full Back',            // 3
  'Right Corner-Back',    // 4
  'Left Wing-Back',       // 5
  'Centre Back',          // 6
  'Right Wing-Back',      // 7
  'Midfield',             // 8
  'Midfield',             // 9
  'Left Wing-Forward',    // 10
  'Centre Forward',       // 11
  'Right Wing-Forward',   // 12
  'Left Corner-Forward',  // 13
  'Full Forward',         // 14
  'Right Corner-Forward', // 15
];
