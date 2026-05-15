/* ── clubs.js ── */
'use strict';

// ─── MEATH GAA CLUB DIRECTORY ─────────────────────────────────────────────────
const MEATH_CLUBS = [
  {name:"Ballinabrackey",pitch:"Ballinabrackey GFC",crest:"crests/ballinabrackey.png"},
  {name:"Ballinlough",pitch:"Ballinlough, Kells, Co. Meath.",crest:"crests/ballinlough.png"},
  {name:"Ballivor",pitch:"Kinnegad Road, Ballivor, Co. Meath.",crest:"crests/ballivor.png"},
  {name:"Bective",pitch:"Cannistown, Navan, Co. Meath.",crest:"crests/bective.png"},
  {name:"Blackhall Gaels",pitch:"Batterstown, Co. Meath.",crest:"crests/blackhall_gaels.png"},
  {name:"Boardsmill",pitch:"Kilmurray, Trim, Co. Meath.",crest:"crests/boardsmill.png"},
  {name:"Carnaross",pitch:"Carnaross, Kells, Co. Meath.",crest:"crests/carnaross.jpg"},
  {name:"Castletown",pitch:"Knock, Castletown, Navan, Co. Meath.",crest:"crests/castletown.jpeg"},
  {name:"Clann na nGael",pitch:"O'Growney Park, Kells Road, Athboy, Co. Meath.",crest:"crests/clann_na_ngael.png"},
  {name:"Clonard",pitch:"Towlaght, Clonard, Co. Meath.",crest:"crests/clonard.png"},
  {name:"Cortown",pitch:"Páirc Naomh Baoithin, Cortown, Kells, Co. Meath.",crest:"crests/cortown.jpg"},
  {name:"Curraha",pitch:"Joe McDermott Park, Kilbrew, Ashbourne, Co. Meath.",crest:"crests/curraha.png"},
  {name:"Donaghmore / Ashbourne",pitch:"Killegland, Ashbourne, Co. Meath.",crest:"crests/donaghmore__ashbourne.png"},
  {name:"Drumbaragh Emmets",pitch:"Drumbaragh, Kells, Co. Meath.",crest:"crests/drumbaragh_emmets.png"},
  {name:"Drumconrath",pitch:"Birdhill, Drumconrath, Co. Meath.",crest:"crests/drumconrath.png"},
  {name:"Drumree",pitch:"Knockmark, Drumree, Co. Meath.",crest:"crests/drumree.png"},
  {name:"Duleek / Bellewstown",pitch:"Navan Road, Duleek, Co. Meath.",crest:"crests/duleek__bellewstown.jpg"},
  {name:"Dunderry",pitch:"Dunderry, Navan, Co. Meath.",crest:"crests/dunderry.png"},
  {name:"Dunsany",pitch:"Páirc na nGael, Dunsany, Co. Meath.",crest:"crests/dunsany.png"},
  {name:"Dunshaughlin",pitch:"Drumree Road, Dunshaughlin, Co. Meath.",crest:"crests/dunshaughlin.png"},
  {name:"Eastern Gaels",pitch:"Eastern Gaels GFC",crest:"crests/eastern_gaels.jpg"},
  {name:"Gaeil Colmcille",pitch:"Gardenrath Road, Kells, Co. Meath.",crest:"crests/gaeil_colmcille.png"},
  {name:"Kilbride",pitch:"Priestown, Kilbride, Co. Meath.",crest:"crests/kilbride.png"},
  {name:"Kildalkey",pitch:"Cloneylogan, Kildalkey, Co. Meath.",crest:"crests/kildalkey.png"},
  {name:"Killyon",pitch:"Killyon, Longwood, Co. Meath.",crest:"crests/killyon.png"},
  {name:"Kilmainham",pitch:"Kilmainham, Kells, Co. Meath.",crest:"crests/kilmainham.png"},
  {name:"Kilmainhamwood",pitch:"Kilmainhamwood, Kells, Co. Meath.",crest:"crests/kilmainhamwood.jpeg"},
  {name:"Kilmessan",pitch:"Ringlestown, Kilmessan, Co. Meath.",crest:"crests/kilmessan.png"},
  {name:"Kilskyre",pitch:"Kilskyre, Kells, Co. Meath.",crest:"crests/kilskyre.jpg"},
  {name:"Kiltale",pitch:"Kiltale Hurling Club",crest:"crests/kiltale.png"},
  {name:"Longwood",pitch:"Longwood, Co. Meath.",crest:"crests/longwood.png"},
  {name:"Meath Hill",pitch:"Meath Hill GFC",crest:"crests/meath_hill.jpeg"},
  {name:"Moylagh",pitch:"Moylagh, Co. Meath.",crest:"crests/moylagh.png"},
  {name:"Moynalty",pitch:"Moynalty GFC",crest:"crests/moynalty.png"},
  {name:"Moynalvey",pitch:"Moynalvey GFC",crest:"crests/moynalvey.jpg"},
  {name:"Na Fianna",pitch:"Na Fianna, Enfield, Co. Meath.",crest:"crests/na_fianna.png"},
  {name:"Nobber",pitch:"Nobber GFC",crest:"crests/nobber.png"},
  {name:"O’Mahony’s",pitch:"",crest:"crests/omahonys.png"},
  {name:"Oldcastle",pitch:"Oldcastle GFC",crest:"crests/oldcastle.png"},
  {name:"Rathkenny",pitch:"Rathkenny GFC",crest:"crests/rathkenny.png"},
  {name:"Rathmolyon",pitch:"Rathmolyon, Co. Meath.",crest:"crests/rathmolyon.jpg"},
  {name:"Ratoath",pitch:"Ratoath, Co. Meath.",crest:"crests/ratoath.png"},
  {name:"Seneschalstown",pitch:"Seneschalstown GFC",crest:"crests/seneschalstown.png"},
  {name:"Simonstown Gaels",pitch:"Simonstown Gaels GFC",crest:"crests/simonstown_gaels.png"},
  {name:"Skryne",pitch:"Skryne GFC",crest:"crests/skryne.png"},
  {name:"Slane",pitch:"Slane GFC",crest:"crests/slane.jpg"},
  {name:"St. Brigid’s",pitch:"",crest:"crests/st_brigids.jpg"},
  {name:"St. Colmcille’s",pitch:"",crest:"crests/st_colmcilles.png"},
  {name:"St. Mary’s",pitch:"",crest:"crests/st_marys.png"},
  {name:"St. Michael’s",pitch:"",crest:"crests/st_michaels.png"},
  {name:"St. Patrick’s",pitch:"",crest:"crests/st_patricks.jpg"},
  {name:"St. Paul’s",pitch:"",crest:"crests/st_pauls.png"},
  {name:"St. Peter’s Dunboyne",pitch:"Dunboyne, Co. Meath.",crest:"crests/st_peters_dunboyne.png"},
  {name:"St. Ultan’s",pitch:"",crest:"crests/st_ultans.png"},
  {name:"St. Vincent’s",pitch:"",crest:"crests/st_vincents.png"},
  {name:"Summerhill",pitch:"Clonmahon, Summerhill, Co. Meath.",crest:"crests/summerhill.jpg"},
  {name:"Syddan",pitch:"Lobinstown, Co. Meath.",crest:"crests/syddan.png"},
  {name:"Trim",pitch:"St. Loman's Park, Newhaggard Road, Trim, Co. Meath.",crest:"crests/trim.png"},
  {name:"Walterstown",pitch:"Oldtown, Garlow Cross, Navan, Co. Meath.",crest:"crests/walterstown.jpg"},
  {name:"Wolfe Tones",pitch:"Kilberry, Navan, Co. Meath.",crest:"crests/wolfe_tones.png"},
];

// ─── COUNTY CRESTS ────────────────────────────────────────────────────────────
const COUNTIES = [
  'Antrim','Armagh','Carlow','Cavan','Clare','Cork','Derry','Donegal','Down',
  'Dublin','Fermanagh','Galway','Kerry','Kildare','Kilkenny','Laois','Leitrim',
  'Limerick','Longford','Louth','Mayo','Meath','Monaghan','Offaly','Roscommon',
  'Sligo','Tipperary','Tyrone','Waterford','Westmeath','Wexford','Wicklow',
];

function findCountyCrest(name) {
  if (!name) return null;
  const n = name.toLowerCase();
  const county = COUNTIES.find(c => n.includes(c.toLowerCase()));
  return county ? 'crests/' + county.toLowerCase() + '.png' : null;
}

function findClub(name) {
  if (!name) return null;
  const norm = s => s.toLowerCase().replaceAll(/\s*[-\/\u2013]\s*/g, '/').replaceAll(/[\u0027\u2018\u2019.]/g, '').replaceAll(/\s+/g, ' ').trim();
  const n = norm(name);
  const exact = MEATH_CLUBS.find(c => norm(c.name) === n);
  if (exact) return exact;
  return MEATH_CLUBS.find(c => n.includes(norm(c.name))) || null;
}

// Ensures any "/" separator in a club name is surrounded by single spaces.
// e.g. "Rathmolyon/Boardsmill" → "Rathmolyon / Boardsmill"
function fmtClubName(name) {
  if (!name) return name;
  return name.split('/').map(p => p.trim()).join(' / ');
}

// Returns [clubA, clubB] when name is an ad-hoc amalgamation of two distinct MEATH_CLUBS
// (e.g. "Rathmolyon / Boardsmill"). Returns null if the name is already a registered
// combined club (e.g. "Donaghmore / Ashbourne") or if either half is unrecognised.
function findAmalgamPair(name) {
  if (!name?.includes('/')) return null;
  // findClub fuzzy-matches substrings, so "Rathmolyon / Boardsmill" would falsely
  // match the Rathmolyon entry. Only skip if the returned club itself has "/" in its
  // registered name — i.e. it truly IS a combined club (e.g. "Donaghmore / Ashbourne").
  if (findClub(name)?.name.includes('/')) return null;
  const parts = name.split('/').map(p => p.trim()).filter(Boolean);
  if (parts.length !== 2) return null;
  const a = findClub(parts[0]);
  const b = findClub(parts[1]);
  if (a && b && a !== b) return [a, b];
  return null;
}

/* ── pitch-svg.js ── */
'use strict';

// ─── PITCH SVG ────────────────────────────────────────────────────────────────
// Shared between index.html (zone picker) and review.html (shot plot).
const PITCH_SVG_INNER = `<rect width="320" height="400" fill="#4C9A3A" rx="10"/><rect x="0" y="10" width="320" height="44" fill="#52a83f" opacity="0.5"/><rect x="0" y="98" width="320" height="44" fill="#52a83f" opacity="0.5"/><rect x="0" y="186" width="320" height="28" fill="#52a83f" opacity="0.5"/><rect x="0" y="258" width="320" height="44" fill="#52a83f" opacity="0.5"/><rect x="0" y="346" width="320" height="44" fill="#52a83f" opacity="0.5"/><rect x="10" y="10" width="300" height="380" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="2"/><line x1="10" y1="132" x2="310" y2="132" stroke="rgba(255,255,255,0.55)" stroke-width="1.4"/><line x1="10" y1="268" x2="310" y2="268" stroke="rgba(255,255,255,0.55)" stroke-width="1.4"/><line x1="10" y1="64" x2="310" y2="64" stroke="rgba(255,255,255,0.65)" stroke-width="1.6"/><line x1="10" y1="336" x2="310" y2="336" stroke="rgba(255,255,255,0.65)" stroke-width="1.6"/><line x1="10" y1="45" x2="310" y2="45" stroke="rgba(255,255,255,0.5)" stroke-width="1.3"/><line x1="10" y1="355" x2="310" y2="355" stroke="rgba(255,255,255,0.5)" stroke-width="1.3"/><line x1="10" y1="200" x2="310" y2="200" stroke="rgba(255,255,255,0.65)" stroke-width="1.6" stroke-dasharray="12 12"/><line x1="10" y1="185" x2="310" y2="185" stroke="rgba(255,255,255,0.5)" stroke-width="1.3"/><line x1="10" y1="215" x2="310" y2="215" stroke="rgba(255,255,255,0.5)" stroke-width="1.3"/><circle cx="160" cy="200" r="2.5" fill="rgba(255,255,255,0.6)"/><rect x="127" y="10" width="66" height="35" fill="none" stroke="rgba(255,255,255,0.65)" stroke-width="1.6"/><rect x="127" y="355" width="66" height="35" fill="none" stroke="rgba(255,255,255,0.65)" stroke-width="1.6"/><rect x="135" y="10" width="50" height="12" fill="none" stroke="rgba(255,255,255,0.65)" stroke-width="1.6"/><rect x="135" y="378" width="50" height="12" fill="none" stroke="rgba(255,255,255,0.65)" stroke-width="1.6"/><path d="M 114,64 A 46,35 0 0,0 206,64" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="1.5"/><path d="M 114,336 A 46,35 0 0,1 206,336" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="1.5"/><path d="M 38,64 A 141,108 0 0,0 282,64" fill="none" stroke="rgba(255,255,255,0.55)" stroke-width="1.4"/><path d="M 38,336 A 141,108 0 0,1 282,336" fill="none" stroke="rgba(255,255,255,0.55)" stroke-width="1.4"/><circle cx="160" cy="40" r="2.5" fill="rgba(255,255,255,0.6)"/><circle cx="160" cy="360" r="2.5" fill="rgba(255,255,255,0.6)"/><line x1="149" y1="0" x2="149" y2="12" stroke="rgba(255,255,255,0.8)" stroke-width="2.5"/><line x1="171" y1="0" x2="171" y2="12" stroke="rgba(255,255,255,0.8)" stroke-width="2.5"/><line x1="147" y1="3" x2="173" y2="3" stroke="rgba(255,255,255,0.8)" stroke-width="2.5"/><line x1="149" y1="388" x2="149" y2="400" stroke="rgba(255,255,255,0.8)" stroke-width="2.5"/><line x1="171" y1="388" x2="171" y2="400" stroke="rgba(255,255,255,0.8)" stroke-width="2.5"/><line x1="147" y1="397" x2="173" y2="397" stroke="rgba(255,255,255,0.8)" stroke-width="2.5"/>`;

/* ── constants.js ── */
'use strict';

// ─── ACTION CONSTANTS ─────────────────────────────────────────────────────────
const ACTS  = ['Goal','Point','2 Point','Wide','Short','Saved','Free','Mark','Advanced','Card','Substitution','Turnover Won','Turnover Lost'];
const SSEC  = ['From Play','From Free','From Sideline','From Penalty','From 65'];
const FSEC  = ['Push','Chop','Steps','Tackle','Pickup','Throw','Other'];
const NS    = {Goal:SSEC,Point:SSEC,'2 Point':SSEC,Wide:SSEC,Short:SSEC,Saved:SSEC,Free:FSEC};

// ─── SAVE KEY / DEFAULTS ──────────────────────────────────────────────────────
const SAVE_KEY   = 'gaa_match_v1';
const DEFAULT_US = 'Donaghmore / Ashbourne';

// ─── CARD COLOURS ─────────────────────────────────────────────────────────────
// Single source for card colours used in JS-generated SVG/HTML strings.
// CSS rules use var(--card-yellow/black/red) defined in style.css :root.
const CARD_YELLOW = '#FDD835';
const CARD_BLACK  = '#2c2c2a';
const CARD_RED    = '#E53935';

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

// ─── TEAM COLOURS ─────────────────────────────────────────────────────────────
// Primary brand colours for "us" (green) and opponent (red). Used in JS-built
// SVG/HTML; CSS counterparts are --green / --red in style.css.
const TEAM_US_COLOR  = '#2E7D32';
const TEAM_OPP_COLOR = '#C62828';

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
  'Goal':        {cls:'score-btn-goal', icon:'<i class="fas fa-flag"></i>'},
  'Point':       {cls:'score-btn-point',icon:'<i class="far fa-flag"></i>'},
  '2 Point':     {cls:'score-btn-2p',   icon:'<i class="fas fa-flag"></i>'},
  'Wide':        {cls:'action-btn-wide',icon:'<i class="fa-solid fa-child-reaching"></i>'},
  'Short':       {cls:'action-btn-wide',icon:'<i class="fas fa-arrow-down"></i>'},
  'Saved':       {cls:'action-btn-wide',icon:'<span style="display:inline-flex;gap:2px;align-items:center;"><i class="fas fa-hand" style="font-size:.8em;display:inline-block;transform:rotate(315deg) scaleX(-1);"></i><i class="fas fa-hand" style="font-size:.8em;display:inline-block;transform:rotate(45deg);"></i></span>'},
  'Free':        {cls:'action-btn-neutral',icon:'<i class="fa-regular fa-whistle"></i>'},
  'Advanced':    {cls:'action-btn-neutral',icon:'<i class="fas fa-right-from-line"></i>'},
  'Card':        {cls:'action-btn-neutral',icon:`<span style="display:inline-flex;gap:2px;align-items:center;"><i class="fas fa-square" style="font-size:10px;color:${CARD_YELLOW};"></i><i class="fas fa-square" style="font-size:10px;color:${CARD_BLACK};"></i><i class="fas fa-square" style="font-size:10px;color:${CARD_RED};"></i></span>`},
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

/* ── state.js ── */
'use strict';

// ─── PERSISTENT STATE (single source of truth) ───────────────────────────────
const state = {
  goals:0, pts:0, og:0, op_:0,
  htGoals:null, htPts:null, htOg:null, htOp:null,
  ftGoals:null, ftPts:null, ftOg:null, ftOp:null,
  period:1, secs:0,
  matchState:'PRE_MATCH',
  tWallStart:null, tPausedAt:0,
  usN:DEFAULT_US, oppN:'Opposition', location:'', referee:'',
  competition:'', matchDate:'', ageGrade:'',
  matchNotes:'',
  teamAssessment:{ effort:0, skill:0, tactics:0, intensity:0, discipline:0, spirit:0, notes:'' },
  pnames:{}, slotp:{}, ubench:{}, suboff:{}, preGameSubs:{},
  rcarded:{}, ycarded:{}, bcarded:{}, bcardedAt:{},
  maxB:17,
  evts:[],   // {time, desc, badge, cls, slot?, action?}
  sport:'hurling', // 'hurling' or 'football'
  teamSize:15,     // 15 or 13
  captain:null,    // slot number of captain, or null
  trackGameTime:true,
  trackShotLocations:false,
  showPlayerNumbers:true,
  trackTurnovers:false,
  trackGKPerformance:false,
  trackOppScorers:false,
  sidelineCards:[],  // [{time, name, type:'Yellow'|'Red'|'AdvFree'}]
};
for (let i = 1; i <= 15; i++) state.slotp[i] = i;

// ─── SESSION STATE (not persisted) ────────────────────────────────────────────
let undos   = [];
let selMode = false;
let selSlot = null, pendAct = null, subOff = null, swapSlot = null;
let pendScoreAdj = null; // {type, d, side} for pending score adjustment
// Zone picker session state
let pendActSaved = null, pendSecVal = null, pendSlotSaved = null;
let zoneSelectedId = null, zoneSelectedCoords = null;
// Shot map filter state
let shotMapTeamFilter = 'all', shotMapHalfFilter = 'all', shotMapPlayerFilter = 'all';
let tInt    = null;
let tRun    = false;
let initialsCache = {};
let postSubCb = null;

// ─── DOM CACHE ────────────────────────────────────────────────────────────────
const el = {};
function initEl() {
  ['timer-display','gc','pc','og','op','utotal','ototal','uslbl','opplbl',
   'evlog','logempty','lcnt','lbdg','toast',
   'period-badge','status-chip','sport-pill','timer-primary-btn','timer-secondary-btn',
   'pgrid','logpanel','setpanel','sharpanel','plysheet','seltoggle',
   'removebar','removelbl','sun','son','pslist','bslist','tpllist','tni','starting-lbl'
  ].forEach(id => { el[id] = document.getElementById(id); });
}

// ─── SCORE SETTERS ────────────────────────────────────────────────────────────
// Always use these instead of writing state.goals/pts/og/op_ directly — they
// keep the scoreboard DOM in sync with state as a single operation.
function setUsGoals(n) { state.goals = n; el.gc.textContent = n; }
function setUsPts(n)   { state.pts   = n; el.pc.textContent = n; }
function setOppGoals(n){ state.og    = n; el.og.textContent = n; }
function setOppPts(n)  { state.op_   = n; el.op.textContent = n; }

// Derived score totals (goals*3 + points)
const usTotal  = () => state.goals * 3 + state.pts;
const oppTotal = () => state.og    * 3 + state.op_;

// ─── UTILS ────────────────────────────────────────────────────────────────────
const pad = n => String(n).padStart(2,'0');
const fmt = s => pad(Math.floor(s/60))+':'+pad(s%60);
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const gn  = i => (state.pnames[i]||'').trim();
const pl  = i => { const n=gn(i); return n ? n+' (#'+i+')' : '#'+i; };

/* ── wakelock.js ── */
'use strict';

// ─── SCREEN WAKE LOCK ─────────────────────────────────────────────────────────
let wakeLock = null;

async function acquireWakeLock() {
  if (!('wakeLock' in navigator)) return;
  try {
    wakeLock = await navigator.wakeLock.request('screen');
  } catch(e) {}
}

function releaseWakeLock() {
  if (wakeLock) { wakeLock.release(); wakeLock = null; }
}

// Re-acquire after visibility returns (OS releases wake lock when screen sleeps)
async function reacquireWakeLock() {
  if (!tRun || wakeLock) return;
  await acquireWakeLock();
}

/* ── persistence.js ── */
'use strict';

// ─── PERSISTENCE ──────────────────────────────────────────────────────────────
let saveStateTimeoutId = null;

function serializeState() {
  const {goals,pts,og,op_,htGoals,htPts,htOg,htOp,ftGoals,ftPts,ftOg,ftOp,
         period,secs,matchState,tPausedAt,tWallStart,
         usN,oppN,location,referee,competition,matchDate,ageGrade,matchNotes,teamAssessment,
         pnames,slotp,ubench,suboff,preGameSubs,rcarded,ycarded,bcarded,bcardedAt,
         maxB,evts,sport,teamSize,captain,startSlotp,startCaptain,trackGameTime,trackShotLocations,showPlayerNumbers,trackTurnovers,trackGKPerformance,trackOppScorers,sidelineCards} = state;
  return {goals,pts,og,op_,htGoals,htPts,htOg,htOp,ftGoals,ftPts,ftOg,ftOp,
          period,secs,matchState,tPausedAt,tWallStart,
          usN,oppN,location,referee,competition,matchDate,ageGrade,matchNotes,teamAssessment,
          pnames,slotp,ubench,suboff,preGameSubs,rcarded,ycarded,bcarded,bcardedAt,
          maxB,evts,sport,teamSize,captain,startSlotp,startCaptain,trackGameTime,trackShotLocations,showPlayerNumbers,trackTurnovers,trackGKPerformance,trackOppScorers,sidelineCards};
}

function saveState() {
  if (saveStateTimeoutId) clearTimeout(saveStateTimeoutId);
  saveStateTimeoutId = setTimeout(() => {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(serializeState())); } catch(e) {}
    saveStateTimeoutId = null;
  }, 500);
}

function loadSavedState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return false;
    const saved = JSON.parse(raw);
    if (saved.usN)  saved.usN  = fmtClubName(saved.usN);
    if (saved.oppN) saved.oppN = fmtClubName(saved.oppN);
    if (!Array.isArray(saved.sidelineCards)) saved.sidelineCards = [];
    if (typeof saved.bcardedAt !== 'object' || Array.isArray(saved.bcardedAt)) saved.bcardedAt = {};
    Object.assign(state, saved);
    return true;
  } catch(e) { return false; }
}

const clearSavedState = () => { try { localStorage.removeItem(SAVE_KEY); } catch(e) {} };

function saveStateImmediate() {
  if (saveStateTimeoutId) { clearTimeout(saveStateTimeoutId); saveStateTimeoutId = null; }
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(serializeState())); } catch(e) {}
}

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    if (tRun && state.tWallStart) {
      state.secs = Math.floor((Date.now() - state.tWallStart) / 1000);
    }
    saveStateImmediate();
    // Stop interval while screen is off — tWallStart keeps time accurately
    if (tRun) stopInterval();
  } else {
    // Screen back on — resync display immediately then restart interval
    if (tRun) { tick(); startInterval(); }
    reacquireWakeLock();
  }
});

/* ── ui-core.js ── */
'use strict';

// ─── SAFE HTML TEMPLATE TAG ───────────────────────────────────────────────────
// Usage:  html`<span>${playerName}</span>`
// All interpolated values are HTML-escaped automatically; literal parts pass through.
// Use html.safe(trustedFragment) to embed already-escaped sub-templates without
// double-escaping: html`<div>${html.safe(innerHtml)}</div>`
function html(strings, ...vals) {
  let out = '';
  strings.forEach((s, i) => {
    out += s;
    if (i < vals.length) {
      const v = vals[i];
      out += (v != null && typeof v === 'object' && '__safe' in v)
        ? v.__safe
        : esc(String(v ?? ''));
    }
  });
  return out;
}
html.safe = v => ({ __safe: String(v) });

// ─── HOW-TAKEN / HOW-SCORED GRID ─────────────────────────────────────────────
// Shared template for both the player sheet and the team adjustments drawer.
// backOnclick is a trusted internal JS expression (not user input).
function buildHowGrid(title, opts, backOnclick) {
  // eslint-disable-next-line no-restricted-syntax -- backOnclick is a trusted internal JS expression
  return '<div class="ps-sub-nav">'
    + '<button class="ps-sub-back" onclick="' + backOnclick + '"><i class="fas fa-chevron-left"></i></button>'
    + '<span class="ps-sub-title">' + esc(title) + '</span>'
    + '</div>'
    + '<div class="ps-sub-grid">'
    + opts.map(o => {
        const val   = typeof o === 'string' ? o : o.val;
        const label = typeof o === 'string' ? o : o.label;
        const pre   = typeof o === 'object' && o.pre ? o.pre : '';
        // eslint-disable-next-line no-restricted-syntax -- pre is trusted static HTML (card icon tags)
        return '<button class="ps-sub-card" data-v="' + esc(val) + '">' + pre + esc(label) + '</button>';
      }).join('')
    + '</div>';
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
function toast(m) {
  el.toast.textContent = m; el.toast.classList.add('show');
  setTimeout(() => el.toast.classList.remove('show'), 2200);
}

// ─── SYNC META ────────────────────────────────────────────────────────────────
function syncMeta() {
  const n = state.evts.length;
  el.lcnt.textContent = n+' event'+(n!==1?'s':'');
  if (n>0) { el.lbdg.textContent=n; el.lbdg.style.display='inline'; } else el.lbdg.style.display='none';
  const ub = document.getElementById('undobtn');
  if (ub) ub.disabled = undos.length === 0;
}

// ─── TOTALS ───────────────────────────────────────────────────────────────────
function upTot() {
  const u = usTotal(), o = oppTotal();
  el.utotal.textContent = '('+u+')';
  el.ototal.textContent = '('+o+')';
  const uc = u>o?'var(--ts)':u<o?'var(--td)':'var(--t2)';
  const oc = o>u?'var(--ts)':o<u?'var(--td)':'var(--t2)';
  el.utotal.style.color = uc;
  el.ototal.style.color = oc;
}

// ─── GRID OPACITY ─────────────────────────────────────────────────────────────
function setGrid(on) {
  const isActive  = on || state.matchState === 'PRE_MATCH';
  const isVisible = isActive || state.matchState === 'FULL_TIME';
  el.pgrid.style.opacity       = isVisible ? '1' : '.3';
  el.pgrid.style.pointerEvents = isActive  ? 'auto' : 'none';
}

// ─── INITIALS CACHE ───────────────────────────────────────────────────────────
function buildInitialsCache() {
  initialsCache = {};
  const all = Object.keys(state.pnames).map(Number);
  all.forEach(i => { initialsCache[i] = computeInitials(i, all); });
}

function computeInitials(i, all) {
  const nm = gn(i); if (!nm) return String(i);
  const p = nm.split(/\s+/), fi = p[0][0].toUpperCase();
  if (p.length === 1) return fi;
  const surname = p[p.length-1];
  let surnameKey = '', hasO = false;
  if (/^[OÓ]'/i.test(surname)) {
    surnameKey = surname[0].toUpperCase() + surname.substring(2).toUpperCase(); hasO = true;
  } else if (p.length >= 3 && /^[OÓ]$/i.test(p[p.length-2])) {
    surnameKey = p[p.length-2].toUpperCase() + surname.toUpperCase(); hasO = true;
  } else {
    surnameKey = surname.toUpperCase();
  }
  const minEx = hasO && surnameKey.length >= 2 ? 2 : 1;
  for (let ex = 1; ex <= surnameKey.length; ex++) {
    const c = fi + surnameKey.substring(0, ex);
    let clash = false;
    for (const oi of all) {
      if (oi === i) continue;
      const on = gn(oi); if (!on) continue;
      const op2 = on.split(/\s+/); if (op2.length < 2) continue;
      const oSn = op2[op2.length-1];
      let oKey = '';
      if (/^[OÓ]'/i.test(oSn)) oKey = oSn[0].toUpperCase()+oSn.substring(2).toUpperCase();
      else if (op2.length>=3 && /^[OÓ]$/i.test(op2[op2.length-2])) oKey = op2[op2.length-2].toUpperCase()+oSn.toUpperCase();
      else oKey = oSn.toUpperCase();
      if (op2[0][0].toUpperCase()+oKey.substring(0,ex) === c) { clash=true; break; }
    }
    if (!clash && ex >= minEx) return c;
  }
  return fi + surnameKey.substring(0, Math.min(2, surnameKey.length));
}

const gi = i => initialsCache[i] !== undefined ? initialsCache[i] : String(i);

// ─── PLAYER SCORE (derived from evts) ────────────────────────────────────────
function playerScore(pi) {
  let g = 0, p = 0;
  for (const ev of state.evts) {
    if (!ev.action || ev.slot == null) continue;
    const evPi = ev.pi != null ? ev.pi : state.slotp[ev.slot];
    if (evPi !== pi) continue;
    if (ev.action === 'Goal') g++;
    else if (ev.action === 'Point') p++;
    else if (ev.action === '2 Point') p += 2;
  }
  return {g, p};
}

// ─── PLAYER BUTTON (targeted rebuild) ────────────────────────────────────────
function refBtn(s) {
  const b = document.querySelector('[data-s="'+s+'"]'); if (!b) return;
  const pi = state.slotp[s], ini = gi(pi);
  while (b.firstChild) b.removeChild(b.firstChild);
  if (state.ycarded[pi]) { const e=document.createElement('span'); e.className='card-y'; b.appendChild(e); }
  if (state.bcarded[pi]) { const e=document.createElement('span'); e.className='card-b'; b.appendChild(e); }
  if (state.rcarded[pi]) { b.classList.add('rc'); const e=document.createElement('span'); e.className='card-r'; b.appendChild(e); }
  else { b.classList.remove('rc'); }
  if (state.bcardedAt && state.bcardedAt[pi] != null) {
    const remaining=(state.bcardedAt[pi]+600)-state.secs;
    const pct=Math.max(0,Math.min(1,remaining/600));
    const offset=(157.08*(1-pct)).toFixed(1);
    const tmp=document.createElement('div');
    tmp.innerHTML=`<svg class="bc-ring" data-bc-pi="${pi}" width="56" height="56" viewBox="0 0 56 56"><circle cx="28" cy="28" r="25" fill="none" stroke="#2c2c2a" stroke-width="3" stroke-dasharray="157.08" stroke-dashoffset="${offset}" transform="rotate(-90 28 28)" stroke-linecap="round"/></svg>`;
    b.appendChild(tmp.firstChild);
    b.classList.add('bc');
  }
  if (state.ubench[pi]) { const e=document.createElement('span'); e.className='subdot'; b.appendChild(e); }
  if (state.captain === s) { const e=document.createElement('i'); e.className='fa-regular fa-copyright cap-badge'; b.appendChild(e); }
  const hasName = !!gn(pi);
  const showNum = hasName && state.showPlayerNumbers !== false;
  const wrap = document.createElement('span');
  wrap.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:0;line-height:1;';
  const iniSpan = document.createElement('span');
  if (showNum) {
    iniSpan.textContent = pi;
    iniSpan.style.cssText = 'font-size:14px;font-weight:700;';
  } else {
    iniSpan.textContent = ini;
    iniSpan.style.fontSize = ini.length>=4?'10px':ini.length===3?'11px':ini.length===2?'12px':'14px';
  }
  iniSpan.style.color = TEAM_US_COLOR;
  wrap.appendChild(iniSpan);
  const {g, p: p_} = playerScore(pi);
  if (g > 0 || p_ > 0) {
    const sc = document.createElement('span');
    sc.textContent = g+'-'+p_;
    sc.style.cssText = 'font-size:9px;font-weight:400;opacity:0.75;margin-top:1px;';
    wrap.appendChild(sc);
  }
  b.appendChild(wrap);
}
const refAllBtns = () => { const sz=state.teamSize||15; (TEAM_SLOTS[sz]||TEAM_SLOTS[15]).forEach(s=>refBtn(s)); };

function updateBCCountdowns() {
  if (!state.bcardedAt) return;
  const CIRC = 157.08;
  document.querySelectorAll('[data-bc-pi]').forEach(el => {
    const pi = +el.dataset.bcPi;
    if (state.bcardedAt[pi] == null) return;
    const remaining = (state.bcardedAt[pi] + 600) - state.secs;
    const pct = Math.max(0, Math.min(1, remaining / 600));
    if (el.tagName.toLowerCase() === 'svg') {
      const c = el.querySelector('circle');
      if (c) c.setAttribute('stroke-dashoffset', (CIRC * (1 - pct)).toFixed(1));
      if (remaining <= 0) {
        const slot = Object.keys(state.slotp).find(k => +state.slotp[k] === pi);
        if (slot) { const btn=document.querySelector('[data-s="'+slot+'"]'); if(btn) btn.classList.remove('bc'); }
      }
    }
  });
  // Update bc-pill next to the sport pill
  const pill = document.getElementById('bc-pill');
  if (!pill) return;
  const active = Object.entries(state.bcardedAt)
    .map(([pi, issuedAt]) => ({ pi: +pi, remaining: (issuedAt + 600) - state.secs }))
    .filter(e => e.remaining > 0)
    .sort((a, b) => a.remaining - b.remaining);
  if (active.length === 0) {
    pill.style.display = 'none';
  } else {
    pill.style.display = '';
    pill.innerHTML = active.map(e =>
      `<span>${esc(gi(e.pi))} ${fmt(e.remaining)}</span>`
    ).join('<span style="opacity:.4;margin:0 2px;">·</span>');
  }
}

/* ── modal.js ── */
'use strict';

// ─── MODAL ────────────────────────────────────────────────────────────────────
function handleModalClick(e) {
  const btn = e.target.closest('[data-v]');
  if (btn && modalHandlerRef) {
    modalHandlerRef(btn.getAttribute('data-v'));
  }
}

function showOpts(title, opts, handler, rich) {
  el.mtitle.textContent = title;
  let html = '';
  if (rich) {
    html += '<div class="opts-grid">';
    opts.forEach(o => html += '<button class="abtn" data-v="'+esc(String(o.val))+'" style="text-align:left;"><div class="sarow"><span style="font-size:15px;color:var(--t1);">'+esc(o.label)+'</span>'+(o.sub?'<span style="font-size:11px;color:var(--t2);">'+esc(o.sub)+'</span>':'')+'</div></button>');
    html += '</div>';
  } else {
    const optsSet = new Set(opts);
    const rendered = new Set();
    ACTION_GROUPS.forEach(group => {
      const groupItems = group.items.filter(i => optsSet.has(i));
      if (!groupItems.length) return;
      html += '<div class="action-group"><div class="action-group-label">'+group.label+'</div><div class="opts-grid">';
      groupItems.forEach(o => {
        rendered.add(o);
        const meta = ACTION_META[o] || {cls:'', icon:''};
        html += '<button class="abtn '+meta.cls+'" data-v="'+esc(o)+'">'+meta.icon+esc(o)+'</button>';
      });
      html += '</div></div>';
    });
    // Fallback for any opts not in groups (e.g. Won/Lost/result screens)
    const ungrouped = opts.filter(o => !rendered.has(o));
    if (ungrouped.length) {
      html += '<div class="opts-grid">';
      ungrouped.forEach(o => {
        let icon = '';
        let btnStyle = '';
        if (o==='Won'||o==='Win')   { icon = '<i class="fas fa-thumbs-up"></i>';   btnStyle = 'background:#2E7D32;color:#fff;border-color:#2E7D32;'; }
        if (o==='Lost'||o==='Loss') { icon = '<i class="fas fa-thumbs-down"></i>'; btnStyle = 'background:#C62828;color:#fff;border-color:#C62828;'; }
        html += '<button class="abtn" data-v="'+esc(o)+'" style="'+btnStyle+'">'+icon+esc(o)+'</button>';
      });
      html += '</div>';
    }
  }
  // eslint-disable-next-line no-restricted-syntax -- safe: html is built by callers using static strings and esc()
  el.mopts.innerHTML = html;
  el.modal.style.display = 'block';
  modalHandlerRef = (v) => { handler(v); };
  el.mopts.addEventListener('click', handleModalClick);
}

function closeMod() {
  el.modal.dataset.cancelAction = '';
  el.modal.style.display = 'none';
  modalHandlerRef = null;
  el.mopts.removeEventListener('click', handleModalClick);
  selSlot=null; pendAct=null; subOff=null; postSubCb=null;
  // Reset cancel button text
  const cancelBtn = el.modal.querySelector('button[onclick="closeMod()"]');
  if (cancelBtn) cancelBtn.textContent = 'Cancel';
}

/* ── timer.js ── */
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
      showScoreGraphic('HT');
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
      if (tRun && state.tWallStart) {
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

  // Sport pill
  el['sport-pill'].textContent = state.sport || 'football';

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
    sc.innerHTML='<i class="fas fa-clock" aria-hidden="true"></i> Live';
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
    // eslint-disable-next-line no-restricted-syntax -- safe: pc.icon is a static string from primMap
    primBtn.innerHTML='<i class="fas '+pc.icon+'" id="timer-primary-icon" aria-hidden="true"></i>';
  } else {
    primBtn.style.visibility='hidden';
  }

  // Secondary button
  const secBtn = el['timer-secondary-btn'];
  if (inFirst) {
    secBtn.style.visibility='';
    secBtn.className='timer-secondary-btn end-half';
    // eslint-disable-next-line no-restricted-syntax -- safe: static HTML only
    secBtn.innerHTML='<i class="fas fa-hourglass-half" id="timer-secondary-icon" aria-hidden="true"></i><span id="timer-secondary-label">End Half</span>';
  } else if (inSecond) {
    secBtn.style.visibility='';
    secBtn.className='timer-secondary-btn end-match';
    // eslint-disable-next-line no-restricted-syntax -- safe: static HTML only
    secBtn.innerHTML='<i class="fas fa-flag-checkered" id="timer-secondary-icon" aria-hidden="true"></i><span id="timer-secondary-label">End Match</span>';
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
  showConfirmDrawer(
    'End First Half?',
    'Start half-time and stop the timer.',
    'Confirm End Half',
    false,
    () => transition('HALF_TIME')
  );
}

function handleEndMatch() {
  showConfirmDrawer(
    'End Match?',
    'Mark the game as full-time and stop the timer.',
    'Confirm End Match',
    false,
    () => transition('FULL_TIME')
  );
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
  updateBCCountdowns();
}

/* ── events.js ── */
'use strict';

// ─── EVENT LOG ────────────────────────────────────────────────────────────────
const tail = () => { el.evlog.scrollTop = el.evlog.scrollHeight; };

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
function pushUndo(lbl, fn) { undos.push({label:lbl, revert:fn}); syncMeta(); }

function undoLast() {
  if (!undos.length) return;
  const op = undos.pop(); op.revert();
  state.evts.pop();
  if (selMode) {
    selMode = false;
    el.seltoggle.classList.remove('active');
    el.removebar.classList.remove('show');
  }
  const rows = el.evlog.querySelectorAll('.ev-row');
  if (rows.length) rows[rows.length-1].remove();
  if (!state.evts.length) el.logempty.style.display='';
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
  if (!state.evts.length) el.logempty.style.display='';
  selMode=false; el.seltoggle.classList.remove('active'); el.removebar.classList.remove('show');
  syncMeta(); saveState();
  toast('Removed '+toRemove.length+' event'+(toRemove.length!==1?'s':''));
}

/* ── scoring.js ── */
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
    ub.innerHTML='<i class="fas fa-arrows-rotate" aria-hidden="true"></i>New Game';
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
    '<button class="cfm-btn' + (isDanger ? ' cfm-btn-danger' : ' btn-primary') + '">' + esc(btnLabel) + '</button>';
  body.querySelector('.cfm-btn').onclick = () => { closeConfirmDrawer(); onConfirm(); };
  document.getElementById('cfmpanel').classList.add('open');
  document.getElementById('cfmovly').classList.add('open');
}

// ─── RESET ────────────────────────────────────────────────────────────────────
function resetMatch() {
  showConfirmDrawer(
    'New Game?',
    'All scores, events and cards will be cleared. Team and player settings are kept.',
    'Start New Game',
    false,
    doReset
  );
}

function doReset() {
  setUsGoals(0); setUsPts(0); setOppGoals(0); setOppPts(0);
  upTot();
  state.evts=[]; undos=[];
  state.matchNotes=''; const _mn=document.getElementById('match-notes-input'); if(_mn)_mn.value='';
  state.teamAssessment={ effort:0, skill:0, tactics:0, intensity:0, discipline:0, spirit:0, notes:'' };
  // eslint-disable-next-line no-restricted-syntax -- safe: static HTML only
  el.evlog.innerHTML = '<div id="logempty" style="text-align:center;padding:48px 20px 24px;color:var(--t3);"><i class="fas fa-clipboard-list" style="font-size:30px;display:block;margin-bottom:12px;opacity:.35;"></i><span style="font-size:14px;">No events recorded yet</span></div>';
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
  state.rcarded={}; state.ycarded={}; state.bcarded={}; state.bcardedAt={}; state.sidelineCards=[];
  const _bcp=document.getElementById('bc-pill'); if(_bcp) _bcp.style.display='none';
  const sz = state.teamSize || 15;
  (TEAM_SLOTS[sz]||TEAM_SLOTS[15]).forEach(s=>{state.slotp[s]=s;});
  renderPGrid();
  state.ubench={}; state.suboff={}; state.preGameSubs={}; state.maxB=17;
  state.startSlotp=undefined; state.startCaptain=null;
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
      + '<button class="ps-poss-btn ps-poss-goal" data-act="g+"><span class="ps-poss-icon"><i class="fas fa-flag"></i></span>+ Goal</button>'
      + '<button class="ps-poss-btn ps-poss-lost" data-act="g-"><span class="ps-poss-icon"><i class="fas fa-minus"></i></span>Goal</button>'
    + '</div>'
    + (state.sport === 'football'
      ? '<div class="ps-poss">'
          + '<button class="ps-poss-btn ps-poss-2p" data-act="f+"><span class="ps-poss-icon"><i class="fas fa-flag"></i></span>+ 2 Point</button>'
          + '<button class="ps-poss-btn ps-poss-lost" data-act="f-"><span class="ps-poss-icon"><i class="fas fa-minus"></i></span>2 Point</button>'
        + '</div>'
      : '')
    + '<div class="ps-poss">'
      + '<button class="ps-poss-btn ps-poss-point" data-act="p+"><span class="ps-poss-icon"><i class="far fa-flag"></i></span>+ Point</button>'
      + '<button class="ps-poss-btn ps-poss-lost" data-act="p-"><span class="ps-poss-icon"><i class="fas fa-minus"></i></span>Point</button>'
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
      showWideHowModal(side, isUs);
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
  const from65label = state.sport === 'football' ? 'From 45' : 'From 65';
  const opts = isFb
    ? ['From Play', 'From Free', 'From Sideline']
    : SSEC.map(o => o === 'From 65' ? from65label : o);
  const body = document.getElementById('scr-body');
  // eslint-disable-next-line no-restricted-syntax -- side is 'us'|'opp'
  body.innerHTML = buildHowGrid('How scored?', opts, "openScoreModal('" + side + "')");
  body.onclick = e => {
    const btn = e.target.closest('[data-v]');
    if (!btn) return;
    body.onclick = null;
    completeScoreAdj(btn.dataset.v);
    closeScoreDrawer();
  };
}

function showWideHowModal(side, isUs) {
  const from65label = state.sport === 'football' ? 'From 45' : 'From 65';
  const opts = SSEC.map(o => o === 'From 65' ? from65label : o);
  const body = document.getElementById('scr-body');
  // eslint-disable-next-line no-restricted-syntax -- side is 'us'|'opp'
  body.innerHTML = buildHowGrid('Wide — how taken?', opts, "openScoreModal('" + side + "')");
  body.onclick = e => {
    const btn = e.target.closest('[data-v]');
    if (!btn) return;
    body.onclick = null;
    const how = btn.dataset.v;
    const wTeam  = isUs ? state.usN : state.oppN;
    const wBadge = isUs ? 'ADJ' : 'OPP';
    const wCls   = isUs ? 'badj' : 'bopp';
    const wDesc  = wTeam + ': Wide · ' + how;
    addRow(fmt(state.secs), wBadge, wCls, wDesc);
    const wEv = state.evts[state.evts.length - 1];
    wEv.action = 'Wide'; wEv.sec = how; wEv.side = side;
    pushUndo(wDesc, () => {});
    closeScoreDrawer();
    showRestartModal(side);
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
  if (d>0 && how) state.evts[state.evts.length-1].sec = how;
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
  if (nxt>prev) { state.evts[state.evts.length-1].action = type; if (how) state.evts[state.evts.length-1].sec = how; }
  const ct=t,cp=prev;
  pushUndo(desc,()=>{ if(ct==='g') setOppGoals(cp); else setOppPts(cp); upTot(); });
  if (d>0 && t==='g' && state.trackGKPerformance) openGKGoalFlow(state.evts.length - 1, side||'opp');
  else if (d>0 && state.trackOppScorers) openOscModal(state.evts.length - 1, () => showRestartModal(side||'opp'));
  else if (d>0) showRestartModal(side||'opp');
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
  if (nxt>prev) {
    const ev2pt = state.evts[state.evts.length-1];
    if (!isUs) ev2pt.action = '2 Point';
    if (how) ev2pt.sec = how;
  }
  const cp=prev;
  pushUndo(desc,()=>{ if(isUs) setUsPts(cp); else setOppPts(cp); upTot(); });
  if (d>0 && !isUs && state.trackOppScorers) openOscModal(state.evts.length - 1, () => showRestartModal(side||'us'));
  else if (d>0) showRestartModal(side||'us');
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
    if (!pi || state.rcarded[pi]) return;
    const n = gn(pi);
    avail.push({ val: String(s), label: n, num: pi, sub: SLOT_POS[s] || '' });
  });
  postSubCb = () => showRestartModal(side);
  showSubDrawer('Who comes off?', avail, slot => {
    subOff = parseInt(slot);
    pickSubOn();
  });
}

/* ── players.js ── */
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

/* ── ai-config.js ── */
'use strict';

// ─── AI ANALYSIS CONFIG ───────────────────────────────────────────────────────
// Edit this file to change the analysis prompt or add/remove AI targets.

const AI_CONFIG = {

  // ── Targets ─────────────────────────────────────────────────────────────────
  targets: [
    {
      id:     'claude',
      label:  'Claude',
      url:    'https://claude.ai/new',
      appUrl: 'claude://',
      img:    'claude-logo.svg',
      bg:     '#F3E5F5',
      fg:     '#6A1B9A'
    },
    {
      id:     'chatgpt',
      label:  'ChatGPT',
      url:    'https://chatgpt.com/',
      appUrl: 'chatgpt://',
      img:    'openai-logo.svg',
      bg:     '#E8F5E9',
      fg:     '#1B5E20'
    }
  ],

  // ── Age-grade guidance ────────────────────────────────────────────────────────
  // Returns a block of age-specific instructions to inject into the prompt,
  // or null if no age grade is set or it cannot be classified.
  _ageGradeGuidance(ag) {
    if (!ag) return null;
    const s = ag.toLowerCase().replace(/[^a-z0-9]/g, '');
    const m = s.match(/u(\d+)/) || s.match(/under(\d+)/);
    const age    = m ? parseInt(m[1]) : null;
    const minor  = s.includes('minor');
    const adult  = s.includes('junior') || s.includes('intermediate') || s.includes('senior') || s.includes('adult');

    if (age !== null && age <= 14) {
      return `AGE GRADE CONTEXT (${ag}):
At this age, building confidence to shoot is the priority. Do not treat wides as a negative \
pattern — a player willing to shoot from distance is showing exactly the right instinct. \
Frame all scoring pattern analysis around shooting frequency and willingness rather than \
efficiency. A high wide count from an active scorer is a positive sign at this grade and \
should be framed as such. Do not set or imply conversion rate targets.`;
    }
    if (age === 16) {
      return `AGE GRADE CONTEXT (${ag}):
At U16, open-play shot selection is becoming relevant but conversion rate is not the primary concern. Flag wides from poor open-play positions — acute angles, shots taken under pressure with a clear better option — as decision-making issues. Wides from reasonable open-play positions should be framed positively as willingness to shoot. Placed ball attempts inside the 65m line are always the right call regardless of outcome — frame these as positive, never question them. Do not set conversion rate targets.`;
    }
    if (minor || adult || (age !== null && age >= 17)) {
      return `AGE GRADE CONTEXT (${ag}):
At this grade, scoring efficiency is a meaningful metric. A conversion rate below 70% \
(scores as a proportion of all scoring attempts including wides and shots saved) warrants \
direct comment in the scoring pattern analysis. Distinguish between wides caused by poor \
shot selection (bad position, rushed decision) and those caused by poor execution under \
reasonable pressure — these require different interventions. Frame the scoring section \
around decision quality and efficiency, and be direct if the team is leaving scoreable \
chances behind.`;
    }
    return '';
  },

  // ── Tone guidance ─────────────────────────────────────────────────────────────
  // Returns the closing tone instruction for the prompt — calibrated to age grade.
  // Younger = constructive and encouraging. Older = direct, no cushioning.
  _toneGuidance(ag) {
    if (!ag) return 'Keep the tone direct — this report will be used in a coaching session, not published.';
    const s = ag.toLowerCase().replaceAll(/[^a-z0-9]/g, '');
    const m = s.match(/u(\d+)/) || s.match(/under(\d+)/);
    const age   = m ? Number.parseInt(m[1]) : null;
    const minor = s.includes('minor');
    const adult = s.includes('junior') || s.includes('senior') || s.includes('adult');

    if (age !== null && age <= 14) {
      return `TONE: This report may be shared with young players in a team setting. \
Lead every section with what the team did well before identifying areas for improvement. \
Use constructive, encouraging language throughout — do not frame turnovers, wides, or free \
concessions as failures, but as specific and solvable learning moments. The overall tone \
should leave players feeling capable and motivated, not criticised.`;
    }
    if (age !== null && age <= 16) {
      return `TONE: This is a developmental coaching report. Acknowledge what the team executed \
well, then be clear and specific about patterns that need to change. Avoid harsh or deflating \
language, but do not bury problems in qualifications. A coach and young players will read this \
together — be honest but supportive. Do not over-praise, and do not over-criticise.`;
    }
    if (minor || adult || (age !== null && age >= 17)) {
      return `TONE: This is a competitive report for experienced coaches. Be direct. Do not \
soften negative findings with positive framing, do not use "however" or "despite" to cushion a \
problem, and do not open paragraphs with praise before arriving at the issue. If an area of \
play was poor, say so plainly and without qualification. Coaches at this level need accurate \
analysis, not encouragement.`;
    }
    return 'Keep the tone direct — this report will be used in a coaching session, not published.';
  },

  // ── Prompt template ──────────────────────────────────────────────────────────
  // Receives the match payload object and returns the full prompt string.
  buildPrompt(payload) {
    const ageCtx = this._ageGradeGuidance(payload.ageGrade);
    let prompt = `You are an expert GAA match analyst. Identify patterns, turning points, and momentum shifts — not individual events. A coach already knows the result; they need the underlying dynamics.

Write in analytical prose with short paragraph headings. Never narrate events ("In the 14th minute…"). Every section must answer "why" and "how often", not just "what".

OUTPUT LENGTH: Your entire response must not exceed 4000 characters. Be concise — prioritise the most significant patterns and omit minor observations if space requires it. Do not pad or repeat points to fill space.

GAA CONTEXT:
Goal = 3pts (net). Point = 1pt (over bar). Notation: G-P (total), e.g. 2-14 (20). Turnover Won = our possession regained. Turnover Lost = opposition regains. Free = foul conceded by our team. Kickout/Puck-out = goalkeeper restart.

SHOT SELECTION:
Apply different standards to placed ball and in-play attempts.

PLACED BALL (free, 45/65, sideline cut, penalty):
Placed ball attempts from inside the 65m line (rows 3–6 of the pitch grid) are controlled, uncontested opportunities — do not apply shot selection scrutiny to any of these. From U14 upward, taking these shots on is the correct decision and should be reinforced, never questioned. Wides and saves from placed balls at this range are execution misses only — never flag as selection errors.

IN-PLAY (open or transition play) — pitch is a 7-row × 5-col grid, row 0 = defensive end, row 6 = attacking goalmouth, col 0/4 = wings, col 2 = centre:
PRIME ZONE (rows 5–6, cols 1–3) — inside 45, central: always a sound decision.
ACUTE ANGLE (rows 5–6, cols 0/4) — end-line/tight sideline: poor selection; flag wides and saves.
LONG RANGE CENTRAL (rows 3–4, cols 1–3) — 45–65m, central: marginal in open play; flag if recurring.
LONG RANGE WIDE (rows 3–4, cols 0/4) — distance + angle: flag consistently.
OWN HALF (rows 0–2): poor decision unless specialist.

${ageCtx ? ageCtx + '\n\n' : ''}COVER THE FOLLOWING (analytical prose, short paragraph headings):

Momentum Map — phases, triggers, and the single most decisive swing and what caused it.
Scoring Patterns — runs and droughts, their triggers. Classify in-play wides/saves by zone; distinguish selection errors from execution misses. Never flag placed ball wides as selection errors.
Possession & Pressure — chained turnovers, pressure clusters, recurring breakdown zones. Quantify.
Restarts — structural patterns and link to scoring sequences.
Discipline — time/zone/situation clusters; name repeating individuals.
Substitutions — scoreline and momentum context; evidence of impact in event sequence.
Individual Patterns — repeating positive and negative patterns across the match.
Coaching Priorities — three specific, actionable session directives from the patterns above.

Players: full name first, then Initial. Surname. Times: "early/late first/second half." Group similar events into one sentence. Ground every claim in the event log.

${this._toneGuidance(payload.ageGrade)}

End the report with this disclaimer, reproduced exactly:

---
Data & AI Notice: This analysis was generated by an AI model based on match data captured manually by a sideline operator during live play. Reactive, real-time data collection of this kind is subject to human factors including missed events, timing inaccuracies, misattributed actions, and incomplete sequences — particularly during periods of high intensity or congestion. Observations and patterns identified in this report should be treated as analytical prompts for discussion rather than definitive conclusions. Coaches are encouraged to cross-reference with video footage and their own match observations before acting on any finding. This report was produced by an AI assistant and does not constitute professional coaching advice.
---

---
FIXTURE:
${payload.fixture}

FINAL SCORE:
${payload.result}

SQUAD (position number → player name):
${payload.squad}

EVENT LOG (time  player  action  sub-type  [pitch zone if tagged]):
${payload.eventLog}`;
    if (payload.gkContext) {
      prompt += '\n\nGOALKEEPER PERFORMANCE (mention only where relevant — do not dedicate a section to this unless it was decisive):\n' + payload.gkContext;
    }
    if (payload.oppScorerContext) {
      prompt += '\n\nOPPOSITION SCORING THREAT (only comment on this if the data shows a clear standout — do not mention it if scoring was evenly spread across positions):\n' + payload.oppScorerContext;
    }
    if (payload.assessContext) {
      prompt += '\n\nCOACH ASSESSMENT (subjective 1–5 ratings entered by the coach after the match — use these as context for the coach\'s own read of the game, but ground every observation in the event log rather than accepting these ratings uncritically; note any significant divergence between the coach\'s assessment and what the data shows):\n' + payload.assessContext;
    }
    return prompt;
  },

  // ── Zone label ────────────────────────────────────────────────────────────────
  // Converts a zone object {id:'z-row-col'} to a plain-English pitch location.
  // Grid is 7 rows (row 0 = defensive end, row 6 = attacking goalmouth) × 5 cols.
  _zoneLabel(zone) {
    if (!zone || !zone.id) return null;
    const parts = zone.id.split('-');
    const r = parseInt(parts[1]), c = parseInt(parts[2]);
    const rowLabels = [
      'own defensive zone', // row 0
      'own 20m area',       // row 1
      'own half',           // row 2
      '65m line',           // row 3
      '45m zone',           // row 4
      'inside the 45',      // row 5
      'goalmouth / inside the 20m', // row 6
    ];
    const colLabels = ['left wing', 'left channel', 'centre', 'right channel', 'right wing'];
    const row = rowLabels[r] || ('row ' + r);
    const col = colLabels[c] || ('col ' + c);
    return col === 'centre' ? `${row}, centre` : `${row}, ${col}`;
  },

  // ── Event log formatter ───────────────────────────────────────────────────────
  // Converts raw events into a human-readable line per event.
  buildEventLog(state) {
    const pnames = state.pnames || {};
    const slotp  = state.slotp  || {};
    const fullName = pi => (pnames[pi] || '').trim() || `#${pi}`;
    const playerOf = ev => {
      const pi = ev.pi != null ? ev.pi : (ev.slot != null ? slotp[ev.slot] : null);
      return pi != null ? fullName(pi) : null;
    };

    return (state.evts || []).map(ev => {
      const t = ev.time || '??:??';
      if (ev.badge === '1H')  return `${t}  ───  HALF TIME`;
      if (ev.badge === '2H')  return `${t}  ───  SECOND HALF BEGINS`;
      if (ev.badge === 'END') return `${t}  ───  FULL TIME`;
      if (ev.badge === 'OPP') return `${t}  Opposition        ${ev.desc || ''}`;
      if (ev.badge === 'ADJ') {
        const adjDesc = ev.desc || '';
        return `${t}  Score adjustment  ${adjDesc}`;
      }
      if (ev.badge === 'RSTR') return `${t}  Restart           ${ev.desc || ''}`;
      const player  = (playerOf(ev) || '—').padEnd(22);
      const action  = ev.action || ev.badge || '?';
      const sub     = ev.sec ? ` (${ev.sec})` : '';
      const zoneLbl = ev.zone ? `  [${this._zoneLabel(ev.zone)}]` : '';
      const extra   = ev.action === 'sub'     ? `  ${ev.desc || ''}`
                    : ev.action === 'GK Save' ? `  [I·${ev.gkIntensity} S·${ev.gkSaveScore} V·${ev.gkFinalValue}${ev.gkSecondary != null ? ' S2·' + ev.gkSecondary : ''}]`
                    : '';
      return `${t}  ${player}  ${action}${sub}${zoneLbl}${extra}`;
    }).join('\n');
  },

  // ── Payload builder ──────────────────────────────────────────────────────────
  // Extracts the relevant match data from state to keep the prompt focused.
  buildPayload(state) {
    const squadLines = Object.entries(state.slotp || {})
      .sort(([a], [b]) => +a - +b)
      .map(([slot, pi]) => `  #${slot}: ${(state.pnames && state.pnames[pi]) || `#${pi}`}`)
      .join('\n');

    const fixture = [
      `  Teams:       ${state.usN || '?'} vs ${state.oppN || '?'}`,
      `  Sport:       ${state.sport || 'football'}`,
      state.competition ? `  Competition: ${state.competition}` : null,
      state.location    ? `  Location:    ${state.location}`    : null,
      state.matchDate   ? `  Date:        ${state.matchDate}`   : null,
      state.ageGrade    ? `  Age grade:   ${state.ageGrade}`    : null,
    ].filter(Boolean).join('\n');

    // GK context — only include when the keeper had a notably good or bad game (outside the average band)
    let gkContext = null;
    if (state.trackGKPerformance) {
      const gkEvts = (state.evts || []).filter(e => e.gkOutcome != null && e.gkFinalValue != null);
      if (gkEvts.length >= 3) {
        let wSum = 0, wTot = 0, saves = 0, goals = 0;
        gkEvts.forEach(e => {
          const wt = 1 + ((e.gkIntensity || 3) - 1) * 0.4;
          wSum += (e.gkFinalValue - 4) * wt;
          wTot += wt;
          if (e.gkOutcome === 'save') saves++; else goals++;
        });
        const rating = Math.round(50 + (Math.max(-4, Math.min(4, wTot > 0 ? wSum / wTot : 0)) / 4) * 50);
        const label  = rating >= 80 ? 'Outstanding' : rating >= 65 ? 'Very Good' : rating >= 55 ? 'Good'
          : rating >= 45 ? 'Average' : rating >= 35 ? 'Below Average' : rating >= 20 ? 'Poor' : 'Very Poor';
        if (rating >= 65 || rating <= 35) {
          const shots    = saves + goals;
          const gkPi     = (state.slotp || {})[1];
          const gkName   = (state.pnames && gkPi && state.pnames[gkPi]) ? state.pnames[gkPi].trim() : 'Goalkeeper';
          const hardSaves = gkEvts.filter(e => e.gkOutcome === 'save' && (e.gkIntensity || 0) >= 4).length;
          gkContext = `${gkName} rated ${rating}/100 (${label}) across ${shots} tracked shots (${saves} saves, ${goals} goals conceded).`;
          if (rating >= 65 && hardSaves > 0) gkContext += ` Made ${hardSaves} save${hardSaves !== 1 ? 's' : ''} from difficult or exceptional shots.`;
          if (rating <= 35) gkContext += ` Conceded ${goals} goal${goals !== 1 ? 's' : ''} including from shots rated as preventable.`;
        }
      }
    }

    // Opposition scorer context — only surface when one position is a standout threat
    let oppScorerContext = null;
    if (state.trackOppScorers) {
      const oscEvts = (state.evts || []).filter(e => e.oppScorer);
      if (oscEvts.length > 0) {
        const oscMap = {};
        oscEvts.forEach(e => {
          const s = e.oppScorer;
          const key = s.label + ' (' + s.num + ')';
          if (!oscMap[key]) oscMap[key] = { num: s.num, label: s.label, goals: 0, pts: 0 };
          const a = e.action || '';
          if (a === 'Goal') oscMap[key].goals++;
          else if (a === '2 Point') oscMap[key].pts += 2;
          else oscMap[key].pts++;
        });
        const oscRows = Object.values(oscMap)
          .map(r => ({ ...r, total: r.goals * 3 + r.pts }))
          .sort((a, b) => b.total - a.total);
        const grandTotal = oscRows.reduce((s, r) => s + r.total, 0);
        const top = oscRows[0];
        // Flag as standout if top scorer contributed ≥40% of tracked opp scoring, or scored a goal
        const isStandout = grandTotal > 0 && (top.goals > 0 || top.total / grandTotal >= 0.4);
        if (isStandout) {
          const scoreStr = top.goals + '-' + top.pts + ' (' + top.total + 'pts)';
          const pct = Math.round(top.total / grandTotal * 100);
          oppScorerContext = `${top.label} (#${top.num}) was the primary scoring threat for ${state.oppN || 'the opposition'}, contributing ${scoreStr} — ${pct}% of tracked opposition scoring.`;
          if (oscRows.length > 1) {
            const others = oscRows.slice(1).map(r => r.label + ' (#' + r.num + ') ' + r.goals + '-' + r.pts).join(', ');
            oppScorerContext += ` Other recorded scorers: ${others}.`;
          }
        }
      }
    }

    // Coach team assessment context
    let assessContext = null;
    const ta = state.teamAssessment;
    if (ta) {
      const DIMS = [
        { key:'effort',    label:'Effort'     },
        { key:'skill',     label:'Skill'      },
        { key:'tactics',   label:'Tactics'    },
        { key:'intensity', label:'Intensity'  },
        { key:'discipline',label:'Discipline' },
        { key:'spirit',    label:'Spirit'     },
      ];
      const rated = DIMS.filter(d => (ta[d.key] || 0) > 0);
      if (rated.length > 0) {
        const lines = rated.map(d => `  ${d.label}: ${ta[d.key]}/5`).join('\n');
        const avg   = (rated.reduce((s, d) => s + ta[d.key], 0) / rated.length).toFixed(1);
        const dimWord = rated.length === 1 ? 'dimension' : 'dimensions';
        assessContext = `${lines}\n  Overall (${rated.length} ${dimWord} rated): ${avg}/5`;
        if (ta.notes && ta.notes.trim()) {
          assessContext += `\n  Coach observations: ${ta.notes.trim()}`;
        }
      }
    }

    return {
      fixture,
      ageGrade:   state.ageGrade || '',
      result:     `  ${state.usN || 'Us'}: ${state.goals}-${state.pts} (${state.goals * 3 + state.pts}pts)` +
                  `\n  ${state.oppN || 'Opposition'}: ${state.og}-${state.op_} (${state.og * 3 + state.op_}pts)`,
      squad:      squadLines,
      eventLog:   this.buildEventLog(state),
      gkContext,
      oppScorerContext,
      assessContext,
    };
  }

};

/* ── share.js ── */
'use strict';

// ─── SHARE ────────────────────────────────────────────────────────────────────
function shareWA() {
  const u=usTotal(), o=oppTotal();
  const lines=['*'+state.usN+': '+state.goals+'-'+state.pts+' ('+u+') v '+state.oppN+': '+state.og+'-'+state.op_+' ('+o+')*','*Time: '+fmt(state.secs)+'*',''];
  state.evts.forEach(e => lines.push(e.time+'  '+e.desc));
  window.open('https://wa.me/?text='+encodeURIComponent(lines.join('\n')),'_blank');
}

function shareCSV() {
  const csvEsc = v => '"' + String(v||'').replace(/"/g,'""') + '"';
  const rows = [['Time','Event','Description','Action','Type','zone_id','zone_x','zone_y','gk_outcome','gk_intensity','gk_save_score','gk_final_value']];
  state.evts.forEach(e => rows.push([
    e.time, e.badge, e.desc,
    e.action||'', e.sec||'',
    e.zone?e.zone.id:'', e.zone?e.zone.coords.x.toFixed(4):'', e.zone?e.zone.coords.y.toFixed(4):'',
    e.gkOutcome||'', e.gkIntensity??'', e.gkSaveScore??'', e.gkFinalValue??''
  ]));
  if (state.trackGameTime) {
    const { ptMap } = computePlayTimes();
    const ptRows = Object.entries(ptMap)
      .map(([pi, t]) => ({pi:+pi, name:gn(+pi), t}))
      .filter(r => r.name)
      .sort((a, b) => b.t - a.t || a.name.localeCompare(b.name));
    if (ptRows.length) {
      const startPis = new Set(Object.values(state.startSlotp || {}).map(Number));
      rows.push([]);
      rows.push(['player','role','minutes_played','seconds_played','','','','','','','','']);
      ptRows.forEach(r => rows.push([r.name, startPis.has(r.pi) ? 'starter' : 'sub', formatSeconds(r.t), r.t, '','','','','','','','']));
    }
  }
  const csv = rows.map(r => r.map(csvEsc).join(',')).join('\r\n');
  const filename = _buildFilenameBase() + '.csv';
  const blob = new Blob([csv], {type:'text/csv'});
  if (navigator.share && navigator.canShare && navigator.canShare({files:[new File([blob],filename,{type:'text/csv'})]})) {
    navigator.share({files:[new File([blob],filename,{type:'text/csv'})], title:filename})
      .catch(()=>{});
  } else {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    setTimeout(()=>URL.revokeObjectURL(a.href),10000);
  }
}

// ─── SCORE GRAPHIC ────────────────────────────────────────────────────────────
function _scorerGraphicLine(evts) {
  evts = evts || state.evts;
  const scorers = {};
  evts.forEach(ev => {
    if (!ev.slot || !ev.action) return;
    const a = ev.action;
    if (a !== 'Goal' && a !== 'Point' && a !== '2 Point') return;
    const pi = ev.pi != null ? ev.pi : state.slotp[ev.slot];
    if (!pi) return;
    if (!scorers[pi]) scorers[pi] = {name: gn(pi) || ('#' + pi), g: 0, p: 0};
    if (a === 'Goal')    scorers[pi].g++;
    if (a === 'Point')   scorers[pi].p++;
    if (a === '2 Point') scorers[pi].p += 2;
  });
  return Object.values(scorers)
    .filter(s => s.g + s.p > 0)
    .sort((a, b) => (b.g * 3 + b.p) - (a.g * 3 + a.p))
    .map(s => esc(s.name) + ' ' + s.g + '–' + pad(s.p))
    .join(' · ');
}

function _firstHalfEvts() {
  const out = [];
  for (const ev of state.evts) {
    if (ev.badge === '1H' && (ev.desc || '').includes('ended')) break;
    out.push(ev);
  }
  return out;
}

function _scoreOutcome(label, u, o) {
  const diff = Math.abs(u - o);
  const pts = diff + ' pt' + (diff !== 1 ? 's' : '');
  const verb = label === 'FT' ? ' win' : ' lead';
  if (u > o) return esc(state.usN) + verb + ' by ' + pts;
  if (o > u) return esc(state.oppN) + verb + ' by ' + pts;
  return label === 'FT' ? 'Draw' : 'Level';
}

function _crestEl(src, name) {
  const initials = (name || '').split(/[\s/-]+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?';
  const fbStyle = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;'
    + 'font-size:18px;font-weight:700;color:#BBBBB4;font-family:Arial,sans-serif;';
  const wrap = 'position:relative;width:60px;height:60px;flex-shrink:0;';
  if (!src) return `<div style="${wrap}"><div style="${fbStyle}">${esc(initials)}</div></div>`;
  return `<div style="${wrap}"><div style="${fbStyle}">${esc(initials)}</div>`
    + `<img src="${esc(src)}" alt="${esc(name)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;" onerror="this.style.display='none'"></div>`;
}

// Pair variant for amalgam clubs — two crests stacked inside the same 60×60 container.
function _crestElPair(src1, src2, name) {
  const initials = (name || '').split(/[\s/-]+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?';
  const fbStyle = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;'
    + 'font-size:18px;font-weight:700;color:#BBBBB4;font-family:Arial,sans-serif;';
  const wrap = 'position:relative;width:60px;height:60px;flex-shrink:0;';
  const n = esc(name);
  return `<div style="${wrap}"><div style="${fbStyle}">${esc(initials)}</div>`
    + `<img src="${esc(src1)}" alt="${n}" style="position:absolute;top:0;left:0;width:38px;height:38px;object-fit:contain;" onerror="this.style.display='none'">`
    + `<img src="${esc(src2)}" alt="${n}" style="position:absolute;bottom:0;right:0;width:42px;height:42px;object-fit:contain;" onerror="this.style.display='none'">`
    + '</div>';
}

function _teamCrestEl(name) {
  const pair = name ? findAmalgamPair(name) : null;
  if (pair) return _crestElPair(pair[0].crest, pair[1].crest, name);
  return _crestEl(_teamCrest(name || '') || null, name || '');
}

function _htmlNameFS(name) {
  const l = (name || '').length;
  if (l <= 8)  return '16px';
  if (l <= 13) return '13px';
  return '11px';
}

function _buildScoreGraphicHTML(label) {
  const isHT = label === 'HT';
  const isFT = label === 'FT';
  const isTime = !isHT && !isFT;

  // Use score snapshots for HT/FT so second-half scoring doesn't bleed in
  let g, p, og, op;
  if (isHT) {
    g = state.htGoals ?? state.goals; p  = state.htPts ?? state.pts;
    og = state.htOg   ?? state.og;    op = state.htOp  ?? state.op_;
  } else if (isFT) {
    g = state.ftGoals ?? state.goals; p  = state.ftPts ?? state.pts;
    og = state.ftOg   ?? state.og;    op = state.ftOp  ?? state.op_;
  } else {
    g = state.goals; p = state.pts; og = state.og; op = state.op_;
  }
  const usT = g * 3 + p, oppT = og * 3 + op;
  const usFmt  = g  + '–' + pad(p);
  const oppFmt = og + '–' + pad(op);
  const outcome    = _scoreOutcome(label, usT, oppT);
  const scorerLine = _scorerGraphicLine(isHT ? _firstHalfEvts() : state.evts);

  const dateStr  = matchDisplayDate().toLocaleDateString('en-IE', {weekday:'long', day:'numeric', month:'long', year:'numeric'}).toUpperCase();
  const compHtml = state.competition
    ? `<div style="font-size:13px;font-weight:700;color:#1F5B3A;margin-bottom:3px;">${esc(state.competition)}</div>` : '';
  const venueHtml = state.location
    ? `<div style="font-size:13px;color:#888;margin-top:2px;">${esc(state.location)}</div>` : '';

  const teamCol = (name, scoreFmt, total) =>
    `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:6px;min-width:0;">`
    + _teamCrestEl(name)
    + `<div style="font-size:${_htmlNameFS(name)};font-weight:800;color:#1F2A24;text-align:center;`
    + `letter-spacing:0.5px;text-transform:uppercase;line-height:1.2;word-break:break-word;">${esc(name || '')}</div>`
    + `<div style="font-size:40px;font-weight:900;color:#111;line-height:1;">${scoreFmt}</div>`
    + `<div style="font-size:15px;font-weight:600;color:#8B8B84;">(${total})</div></div>`;

  const labelFS = isTime ? (label.length > 3 ? '20px' : '24px') : '28px';
  let periodHtml = `<div style="font-size:${labelFS};font-weight:800;color:#3E4A42;line-height:1;">${esc(label)}</div>`;
  if (isHT) {
    periodHtml += `<div style="font-size:8px;letter-spacing:2px;color:#AAA;text-transform:uppercase;">HALF</div>`
      + `<div style="font-size:8px;letter-spacing:2px;color:#AAA;text-transform:uppercase;">TIME</div>`;
  } else if (isFT) {
    periodHtml += `<div style="font-size:8px;letter-spacing:2px;color:#AAA;text-transform:uppercase;">FULL</div>`
      + `<div style="font-size:8px;letter-spacing:2px;color:#AAA;text-transform:uppercase;">TIME</div>`;
  } else {
    periodHtml += `<div style="font-size:8px;letter-spacing:2px;color:#AAA;text-transform:uppercase;">MINS</div>`;
  }

  const scorersHtml = scorerLine
    ? `<div style="border-top:1px solid #EBEBEB;padding-top:10px;margin-top:2px;">`
      + `<div style="font-size:10px;font-weight:800;letter-spacing:2px;color:#1F2A24;text-transform:uppercase;margin-bottom:5px;">Scorers</div>`
      + `<div style="font-size:14px;color:#333;line-height:1.5;">${scorerLine}</div></div>`
    : '';

  return `<div style="background:#fff;border-radius:20px;padding:20px;box-shadow:0 2px 24px rgba(0,0,0,0.10);overflow:hidden;">`
    + `<div style="text-align:center;margin-bottom:16px;padding-bottom:14px;border-bottom:1px solid #EBEBEB;">`
    + compHtml
    + `<div style="font-size:11px;font-weight:700;letter-spacing:1.5px;color:#AAA;text-transform:uppercase;">${dateStr}</div>`
    + venueHtml + `</div>`
    + `<div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:16px;">`
    + teamCol(state.usN, usFmt, usT)
    + `<div style="flex-shrink:0;width:52px;display:flex;flex-direction:column;align-items:center;gap:2px;padding-top:16px;">`
    + periodHtml + `</div>`
    + teamCol(state.oppN, oppFmt, oppT)
    + `</div>`
    + `<div style="background:#F3F3EF;border-radius:14px;padding:10px 14px;text-align:center;margin-bottom:${scorerLine ? '12px' : '0'};">`
    + `<div style="font-size:14px;font-weight:700;color:#333;overflow-wrap:break-word;">${outcome}</div></div>`
    + scorersHtml
    + `<div style="margin:14px -20px -20px;height:8px;background:#1F5B3A;"></div></div>`;
}

function showScoreGraphic(label) {
  // eslint-disable-next-line no-restricted-syntax -- safe: all user values through esc() inside builder
  document.getElementById('score-graphic-wrap').innerHTML = _buildScoreGraphicHTML(label);
  document.getElementById('score-graphic-panel').classList.add('open');
}

function closeScoreGraphic() {
  document.getElementById('score-graphic-panel').classList.remove('open');
}

function openCurrentScoreCard() {
  const secs = state.secs + (state.period === 2 ? 1800 : 0);
  showScoreGraphic(Math.floor(secs / 60) + "'");
}

// ─── LINEUP GRAPHIC ───────────────────────────────────────────────────────────
function _buildLineupGraphicHTML() {
  const layout = GRID_LAYOUTS[state.teamSize] || GRID_LAYOUTS[15];
  const slotp   = state.startSlotp   || state.slotp;
  const captain = state.startCaptain != null ? state.startCaptain : state.captain;

  // Header — same content and structure as openLayout()
  const oppName  = state.oppN && state.oppN !== 'Opposition' ? state.oppN : '';
  const dateStr  = matchDisplayDate().toLocaleDateString('en-IE', {weekday:'long', day:'numeric', month:'long', year:'numeric'});

  const usCrestHtml  = _resolveCrestHTML(state.usN);
  const oppCrestHtml = _resolveCrestHTML(oppName);

  let vsHtml = oppName ? `vs ${esc(oppName)}<br>` : '';
  vsHtml += `<span style="font-size:11px;">${esc(dateStr)}</span>`;
  if (state.location) vsHtml += `<br><span style="font-size:11px;">${esc(state.location)}</span>`;

  const header = `<div class="layout-team-hdr">`
    + `<div class="layout-hdr-crest">${usCrestHtml}</div>`
    + `<div class="layout-hdr-center">`
    +   `<div class="layout-team-name">${esc(state.usN || '')}</div>`
    +   `<div class="layout-vs">${vsHtml}</div>`
    + `</div>`
    + `<div class="layout-hdr-crest">${oppCrestHtml}</div>`
    + `</div>`;

  // Formation — same structure and CSS classes as renderLayout()
  let formation = '<div class="layout-formation">';
  layout.forEach(row => {
    formation += '<div class="layout-row">';
    row.forEach(slot => {
      const pi    = slotp ? (slotp[slot] || slot) : slot;
      const name  = gn(pi) || '';
      const isCap = captain === slot;
      const isGK  = slot === 1;
      formation += '<div class="layout-player">';
      formation += '<div class="layout-shirt-wrap">';
      if (isCap) formation += '<span class="layout-cap-badge">C</span>';
      formation += `<i class="fa-solid fa-shirt layout-shirt-icon" style="color:${isGK ? CARD_YELLOW : TEAM_US_COLOR};"></i>`;
      formation += `<span class="layout-shirt-num" style="color:${isGK ? TEAM_US_COLOR : '#fff'};">${pi}</span>`;
      formation += '</div>';
      formation += `<div class="layout-player-name">${esc(name || '—')}</div>`;
      formation += '</div>';
    });
    formation += '</div>';
  });
  formation += '</div>';

  // Subs — same structure as renderLayout()
  let subsHtml = '';
  // Exclude any bench player who started (pre-game sub)
  const startingPis = new Set(Object.values(slotp).map(Number));
  const subs = [];
  for (let i = 16; i <= (state.maxB || 16); i++) { const n = gn(i); if (n && !startingPis.has(i)) subs.push({idx: i, name: n}); }
  // Include pre-game replaced players (still part of the squad)
  Object.values(state.preGameSubs || {}).forEach(pi => { const n = gn(pi); if (n) subs.push({idx: pi, name: n}); });
  if (subs.length) {
    subsHtml += '<div class="layout-subs-wrap">';
    subsHtml += '<div class="layout-subs-title">Subs</div>';
    subsHtml += '<div class="layout-subs-grid">';
    subs.forEach(s => {
      subsHtml += '<div class="layout-sub-player">';
      subsHtml += '<div class="layout-sub-shirt-wrap">';
      subsHtml += '<i class="fa-solid fa-shirt layout-sub-shirt"></i>';
      subsHtml += `<span class="layout-sub-num">${s.idx}</span>`;
      subsHtml += '</div>';
      subsHtml += `<div class="layout-sub-name">${esc(s.name)}</div>`;
      subsHtml += '</div>';
    });
    subsHtml += '</div></div>';
  }

  return `<div style="background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 2px 24px rgba(0,0,0,0.10);">`
    + header
    + formation + subsHtml
    + `<div style="height:8px;background:#1F5B3A;"></div></div>`;
}

function showLineupGraphic() {
  // eslint-disable-next-line no-restricted-syntax -- safe: all user values through esc() inside builder
  document.getElementById('score-graphic-wrap').innerHTML = _buildLineupGraphicHTML();
  document.getElementById('score-graphic-panel').classList.add('open');
}

function openShareMenu() {
  document.getElementById('sharovly').classList.add('open');
  el.sharpanel.classList.add('open');
  renderShareMainOpts();
}

function renderShareMainOpts() {
  const hasHT    = state.evts.some(ev => ev.badge === '1H' && (ev.desc || '').includes('ended'));
  const hasFT    = state.matchState === 'FULL_TIME';
  const hasEvts  = state.evts.length > 0;

  const opts = [
    { v:'lu',   icon:'fa-solid fa-shirt',       label:'Starting Line-up',     bg:'#E8F5E9', fg:TEAM_US_COLOR },
    { v:'curr', icon:'fas fa-clock',             label:'Current Score Card',   bg:'#E3F2FD', fg:'#1565C0' },
    { v:'ht',   icon:'fas fa-hourglass-half',    label:'Half Time Score Card', bg:'#FFFDE7', fg:'#E65100', guard:hasHT },
    { v:'ft',   icon:'fas fa-flag-checkered',    label:'Full Time Score Card', bg:'#FFEBEE', fg:TEAM_OPP_COLOR, guard:hasFT },
    { v:'ai',   icon:'fas fa-brain',             label:'Analyse with AI',      bg:'#EDE7F6', fg:'#6A1B9A', guard:hasEvts },
  ];

  let h = '<div class="share-opts">';
  opts.forEach(o => {
    if (o.guard === false) return;
    h += `<button class="share-opt" data-v="${o.v}">`;
    h += `<span class="share-opt-icon" style="background:${o.bg};color:${o.fg};"><i class="${o.icon}"></i></span>`;
    h += `<span class="share-opt-label">${o.label}</span>`;
    h += `<i class="fas fa-chevron-right share-opt-arrow"></i>`;
    h += `</button>`;
  });
  h += '</div>';

  const wrap = document.getElementById('share-opts-wrap');
  // eslint-disable-next-line no-restricted-syntax -- safe: all option values are static strings
  wrap.innerHTML = h;
  wrap.onclick = e => {
    const btn = e.target.closest('[data-v]');
    if (!btn) return;
    const v = btn.dataset.v;
    if (v === 'ai')   { renderAITargetOpts(); return; }
    closeShareMenu();
    if (v === 'lu')   showLineupGraphic();
    if (v === 'curr') openCurrentScoreCard();
    if (v === 'ht')   showScoreGraphic('HT');
    if (v === 'ft')   showScoreGraphic('FT');
  };
}

function renderAITargetOpts() {
  let h = '<div class="share-opts">';
  AI_CONFIG.targets.forEach(t => {
    h += `<button class="share-opt" data-v="${t.id}">`;
    const iconHtml = t.img ? `<img src="${t.img}" width="20" height="20" style="display:block;opacity:0.85;">` : `<i class="${t.icon}"></i>`;
    h += `<span class="share-opt-icon" style="background:${t.bg};color:${t.fg};">${iconHtml}</span>`;
    h += `<span class="share-opt-label">${t.label}</span>`;
    h += `<i class="fas fa-chevron-right share-opt-arrow"></i>`;
    h += `</button>`;
  });
  h += '<div style="font-size:11px;color:var(--t3);line-height:1.5;padding:10px 4px 2px;">The match prompt and data will be copied to your clipboard. Paste it into the chat to begin analysis.</div>';
  h += '</div>';

  const wrap = document.getElementById('share-opts-wrap');
  // eslint-disable-next-line no-restricted-syntax -- safe: all option values are static strings
  wrap.innerHTML = h;
  wrap.onclick = e => {
    const btn = e.target.closest('[data-v]');
    if (!btn) return;
    const v = btn.dataset.v;
    if (v === '__back') { renderShareMainOpts(); return; }
    shareWithAI(v);
  };
}

function shareWithAI(targetId) {
  const target = AI_CONFIG.targets.find(t => t.id === targetId);
  if (!target) return;
  const text = AI_CONFIG.buildPrompt(AI_CONFIG.buildPayload(state));

  const launch = () => {
    closeShareMenu();
    if (!target.appUrl || !/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) {
      window.open(target.url, '_blank');
      return;
    }
    // Try native app; fall back to web if app not installed
    let appOpened = false;
    const onHide = () => { appOpened = true; };
    document.addEventListener('visibilitychange', onHide, { once: true });
    window.location.href = target.appUrl;
    setTimeout(() => {
      document.removeEventListener('visibilitychange', onHide);
      if (!appOpened) window.open(target.url, '_blank');
    }, 1200);
  };

  navigator.clipboard.writeText(text)
    .then(() => { toast('Prompt copied — paste into ' + target.label); launch(); })
    .catch(() => { toast('Open ' + target.label + ' and paste your data'); launch(); });
}

function closeShareMenu() {
  document.getElementById('sharovly').classList.remove('open');
  el.sharpanel.classList.remove('open');
}

// ─── LOG PANEL ────────────────────────────────────────────────────────────────
function openLog()  { document.getElementById('logovly').classList.add('open'); el.logpanel.classList.add('open'); tail(); }
function closeLog() { document.getElementById('logovly').classList.remove('open'); el.logpanel.classList.remove('open'); }

/* ── settings.js ── */
'use strict';

// ─── AGE GRADE PILLS ──────────────────────────────────────────────────────────
function _ageCategory(val) {
  if (['U8', 'U10', 'U12'].includes(val))          return ['Go Games',  'go-games'];
  if (['U14', 'U16', 'Minor'].includes(val))        return ['Juvenile',  'juvenile'];
  if (['U20', 'Junior', 'Intermediate', 'Senior'].includes(val))    return ['Adult',     'adult'];
  return null;
}

function _syncAgeCategoryLabel(val) {
  const el = document.getElementById('sage-category');
  if (!el) return;
  const cat = _ageCategory(val);
  el.textContent = cat ? cat[0] : '';
  el.className = 'age-grade-category' + (cat ? ' ' + cat[1] : '');
}

function ageGradePick(btn) {
  document.querySelectorAll('#sage-pills .age-grade-pill').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  _syncAgeCategoryLabel(btn.dataset.val);
}

// ─── SHARED HELPERS ───────────────────────────────────────────────────────────
function _renderCapBtns() {
  document.querySelectorAll('.cap-btn').forEach(b => {
    const s = Number.parseInt(b.dataset.cap);
    const isCap = state.captain === s;
    b.className = 'cap-btn ' + (isCap ? 'active' : 'inactive');
    // eslint-disable-next-line no-restricted-syntax -- safe: static HTML only
    b.innerHTML = '<i class="fa-regular ' + (isCap ? 'fa-copyright' : 'fa-circle') + '"></i>';
  });
}

function _buildTplData() {
  const data = {usName: el.sun.value.trim() || state.usN, playerNames: {}, captain: state.captain};
  for (let i = 1; i <= state.maxB + 2; i++) {
    const inp = document.getElementById('sn' + i);
    if (inp && inp.value.trim()) data.playerNames[i] = inp.value.trim();
  }
  return data;
}

// ─── SETUP TABS ───────────────────────────────────────────────────────────────
function switchSetupTab(name) {
  document.querySelectorAll('.set-tab').forEach(b => b.classList.toggle('active', b.dataset.tab === name));
  document.querySelectorAll('.set-tab-pane').forEach(p => p.classList.toggle('active', p.dataset.tab === name));
}

// ─── TEMPLATES ────────────────────────────────────────────────────────────────
function saveTpl() {
  const name = el.tni.value.trim(); if(!name){toast('Enter a template name');return;}
  const data = _buildTplData();
  try{localStorage.setItem('tpl:'+name,JSON.stringify(data));toast('Saved "'+name+'"');el.tni.value='';renderTpls();}catch(e){toast('Save failed');}
}

function loadTpl(name) {
  try{
    const raw=localStorage.getItem('tpl:'+name); if(!raw)return;
    const data=JSON.parse(raw);
    if(data.usName)el.sun.value=data.usName;
    state.maxB=17; // reset so stale slots don't accumulate
    if(data.playerNames){
      // Update starting players via DOM (always rendered)
      for(let i=1;i<=15;i++){
        state.pnames[i]=data.playerNames[i]||'';
        const inp=document.getElementById('sn'+i); if(inp)inp.value=state.pnames[i];
      }
      // Update bench slots in state and compute correct maxB before re-rendering
      for(let i=16;i<=30;i++){
        state.pnames[i]=data.playerNames[i]||'';
        if(state.pnames[i]&&i>=state.maxB)state.maxB=i+1;
      }
      renderBench();
    }
    if('captain' in data) {
      state.captain = data.captain;
      _renderCapBtns();
    }
    toast('Loaded "'+name+'"');
  }catch(e){toast('Load failed');}
}

function delTpl(name){try{localStorage.removeItem('tpl:'+name);renderTpls();toast('Deleted');}catch(e){}}

function updateTpl(name) {
  const data = _buildTplData();
  try{localStorage.setItem('tpl:'+name,JSON.stringify(data));toast('Updated "'+name+'"');}catch(e){toast('Update failed');}
}

function clearAllNames() {
  const sz = state.teamSize || 15;
  for (let i = 1; i <= sz; i++) { const inp=document.getElementById('sn'+i); if(inp) inp.value=''; }
  for (let i = 16; i <= state.maxB; i++) { const inp=document.getElementById('sn'+i); if(inp) inp.value=''; }
  flushSettings();
  toast('Names cleared');
}

function renderTpls(){
  const keys=[];
  for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.startsWith('tpl:'))keys.push(k);}
  // eslint-disable-next-line no-restricted-syntax -- safe: name displayed via esc(); onclick reads from data-tplname (no user data in JS string)
  if(!keys.length){el.tpllist.innerHTML='<div style="font-size:13px;color:var(--t3);padding:4px 0;">No saved templates</div>';return;}
  // eslint-disable-next-line no-restricted-syntax -- safe: name in data-tplname via esc(); onclick reads dataset at runtime, not embedded string
  el.tpllist.innerHTML=keys.map(k=>{
    const n=k.replace('tpl:','');
    return '<div class="tplrow" data-tplname="'+esc(n)+'"><span style="flex:1;font-size:14px;color:var(--t1);">'+esc(n)+'</span>'
      +'<button class="tpl-icon-btn" onclick="loadTpl(this.closest(\'.tplrow\').dataset.tplname)" title="Load"><i class="fas fa-file-import"></i></button>'
      +'<button class="tpl-icon-btn save" onclick="updateTpl(this.closest(\'.tplrow\').dataset.tplname)" title="Save current squad to this template"><i class="fas fa-floppy-disk"></i></button>'
      +'<button class="tpl-icon-btn del" onclick="delTpl(this.closest(\'.tplrow\').dataset.tplname)" title="Delete"><i class="fas fa-trash-can"></i></button>'
      +'</div>';
  }).join('');
}

// ─── SETTINGS PANEL ───────────────────────────────────────────────────────────
function openSettings(){
  el.sun.value=state.usN;
  el.son.value=state.oppN==='Opposition'?'':state.oppN;
  document.getElementById('sloc').value=state.location||'';
  document.getElementById('sref').value=state.referee||'';
  document.getElementById('scomp').value=state.competition||'';
  document.getElementById('smdate').value=state.matchDate||'';
  const _ageVal = (state.ageGrade || '').toLowerCase();
  let _ageMatched = false;
  document.querySelectorAll('#sage-pills .age-grade-pill').forEach(b => {
    const match = b.dataset.val.toLowerCase() === _ageVal;
    b.classList.toggle('active', match);
    if (match) _ageMatched = true;
  });
  if (!_ageMatched) document.querySelector('#sage-pills .age-grade-pill').classList.add('active');
  _syncAgeCategoryLabel(_ageMatched ? (state.ageGrade || '') : '');
  const isFootball = state.sport === 'football';
  const is13 = state.teamSize === 13;
  document.getElementById('sport-chk').checked = isFootball;
  document.getElementById('size-chk').checked = is13;
  syncTrackingUI();
  updatePresetUI();
  el['starting-lbl'].textContent = 'STARTING '+(state.teamSize||15);
  // eslint-disable-next-line no-restricted-syntax -- safe: clears element, no user data
  el.pslist.innerHTML='';
  const sz = state.teamSize || 15;
  (TEAM_SLOTS[sz]||TEAM_SLOTS[15]).forEach(i => el.pslist.appendChild(buildPlayerRow(i)));
  renderBench(); renderTpls();
  document.getElementById('setovly').classList.add('open');
  el.setpanel.classList.add('open');
  _initTypeahead(el.sun);
  _initTypeahead(el.son);
}

function closeSettings(){ flushSettings(); document.getElementById('setovly').classList.remove('open'); el.setpanel.classList.remove('open'); }

function renderBench(){
  // Ensure maxB reflects all named bench slots in case of any desync
  for(let i=16;i<=30;i++){ if(state.pnames[i])state.maxB=Math.max(state.maxB,i+1); }
  // eslint-disable-next-line no-restricted-syntax -- safe: clears element, no user data
  el.bslist.innerHTML='';
  for(let i=16;i<=state.maxB;i++) addBRow(el.bslist,i);
}

function addBRow(c,idx){
  const row=document.createElement('div'); row.className='prow'; row.id='br'+idx;
  // eslint-disable-next-line no-restricted-syntax -- safe: idx is numeric, player name through esc()
  row.innerHTML='<span class="drag-handle" title="Drag to swap player"><i class="fas fa-grip-vertical"></i></span><div class="pbadge sub">'+idx+'</div><input class="sinput" id="sn'+idx+'" type="text" placeholder="'+(idx===16?'Sub GK':'Sub #'+idx)+'" maxlength="30" value="'+esc(gn(idx)||'')+'">';
  c.appendChild(row);
  attachDragHandle(row);
  document.getElementById('sn'+idx).addEventListener('input',function(){
    const ti=Number.parseInt(this.id.replace('sn',''));
    if(this.value.trim()&&ti>=state.maxB){
      state.maxB=ti+1;
      if(!document.getElementById('br'+state.maxB)) addBRow(el.bslist,state.maxB);
    }
  });
}

function flushSettings() {
  state.usN  = fmtClubName(el.sun.value.trim()) || DEFAULT_US;
  state.oppN = fmtClubName(el.son.value.trim()) || 'Opposition';
  state.location   = (document.getElementById('sloc').value||'').trim();
  state.referee    = (document.getElementById('sref').value||'').trim();
  state.competition= (document.getElementById('scomp').value||'').trim();
  state.matchDate  = (document.getElementById('smdate').value||'').trim();
  const _agePill = document.querySelector('#sage-pills .age-grade-pill.active');
  state.ageGrade   = _agePill ? _agePill.dataset.val : '';
  el.uslbl.textContent=state.usN.toUpperCase();
  el.opplbl.textContent=state.oppN.toUpperCase();
  for(let i=1;i<=state.maxB+2;i++){const inp=document.getElementById('sn'+i);if(inp)state.pnames[i]=inp.value.trim();}
  buildInitialsCache();
  refAllBtns();
  saveState();
}

function onSportToggle(checked) {
  flushSettings();
  state.sport = checked ? 'football' : 'hurling';
  saveState();
  renderTimerUI();
}

function renderPGrid() {
  const layout = GRID_LAYOUTS[state.teamSize] || GRID_LAYOUTS[15];
  // eslint-disable-next-line no-restricted-syntax -- safe: slot numbers are internal integers, no user data
  el.pgrid.innerHTML = layout.map(row =>
    '<div class="p-row">'+row.map(s =>
      '<button class="pbtn" data-s="'+s+'" onclick="sel('+s+')">'+s+'</button>'
    ).join('')+'</div>'
  ).join('');
  // Re-apply card/sub/hev classes
  refAllBtns();
}

function setCaptain(slot) {
  state.captain = (state.captain === slot) ? null : slot;
  _renderCapBtns();
  refAllBtns();
  saveState();
}

// ─── DRAG-TO-SWAP PLAYER NAMES ───────────────────────────────────────────────
let _drag = null;

function _dragMove(e) {
  if (!_drag) return;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  _drag.ghost.style.top = (clientY - _drag.offsetY) + 'px';
  _drag.ghost.style.visibility = 'hidden';
  const under = document.elementFromPoint(clientX, clientY);
  _drag.ghost.style.visibility = '';
  const targetRow = under && under.closest('.prow');
  if (_drag.over && _drag.over !== targetRow) _drag.over.classList.remove('drag-over');
  _drag.over = null;
  if (targetRow && targetRow !== _drag.row && targetRow.parentElement === _drag.row.parentElement) {
    targetRow.classList.add('drag-over');
    _drag.over = targetRow;
  }
}

function _dragEnd() {
  if (!_drag) return;
  const { row, over, ghost } = _drag;
  if (over) {
    over.classList.remove('drag-over');
    const srcIn = row.querySelector('.sinput');
    const tgtIn = over.querySelector('.sinput');
    const tmp = srcIn.value; srcIn.value = tgtIn.value; tgtIn.value = tmp;
    // Swap captain designation so it follows the player name
    const srcSlot = Number.parseInt(srcIn.id.replace('sn',''));
    const tgtSlot = Number.parseInt(tgtIn.id.replace('sn',''));
    if (state.captain === srcSlot) state.captain = tgtSlot;
    else if (state.captain === tgtSlot) state.captain = srcSlot;
    _renderCapBtns();
  }
  row.classList.remove('dragging');
  ghost.remove();
  _drag = null;
  document.removeEventListener('mousemove', _dragMove);
  document.removeEventListener('mouseup', _dragEnd);
  document.removeEventListener('touchmove', _dragMove);
  document.removeEventListener('touchend', _dragEnd);
}

function _dragStart(e, row) {
  e.preventDefault();
  const rect = row.getBoundingClientRect();
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  const ghost = row.cloneNode(true);
  ghost.style.cssText = 'position:fixed;pointer-events:none;z-index:9999;width:'+rect.width+'px;opacity:0.9;background:var(--bg1);border-radius:var(--r);box-shadow:0 4px 20px rgba(0,0,0,0.18);left:'+rect.left+'px;top:'+rect.top+'px;padding:7px 0;';
  document.body.appendChild(ghost);
  row.classList.add('dragging');
  _drag = { row, ghost, offsetY: clientY - rect.top, over: null };
  document.addEventListener('mousemove', _dragMove);
  document.addEventListener('mouseup', _dragEnd);
  document.addEventListener('touchmove', _dragMove, {passive:false});
  document.addEventListener('touchend', _dragEnd);
}

function attachDragHandle(row) {
  const h = row.querySelector('.drag-handle');
  if (!h) return;
  h.addEventListener('mousedown', e => _dragStart(e, row));
  h.addEventListener('touchstart', e => _dragStart(e, row), {passive:false});
}

function buildPlayerRow(i) {
  const isCap = state.captain === i;
  const row = document.createElement('div'); row.className='prow';
  // eslint-disable-next-line no-restricted-syntax -- safe: i is numeric, player name through esc()
  row.innerHTML = '<span class="drag-handle" title="Drag to swap player"><i class="fas fa-grip-vertical"></i></span>'
    +'<div class="pbadge'+(i===1?' gk':'')+'">'+i+'</div>'
    +'<input class="sinput" id="sn'+i+'" type="text" placeholder="'+(SLOT_POS[i]||'Player '+i)+'" maxlength="30" value="'+esc(gn(i)||'')+'">'
    +'<button type="button" class="cap-btn '+(isCap?'active':'inactive')+'" data-cap="'+i+'" onclick="setCaptain('+i+')" title="Set captain"><i class="fa-regular '+(isCap?'fa-copyright':'fa-circle')+'"></i></button>';
  attachDragHandle(row);
  return row;
}

function onSizeToggle(checked) {
  flushSettings();
  const size = checked ? 13 : 15;
  state.teamSize = size;
  el['starting-lbl'].textContent = 'STARTING ' + size;
  renderPGrid();
  // Rebuild player list in settings panel
  // eslint-disable-next-line no-restricted-syntax -- safe: clears element, no user data
  el.pslist.innerHTML='';
  (TEAM_SLOTS[size]||TEAM_SLOTS[15]).forEach(i => el.pslist.appendChild(buildPlayerRow(i)));
  saveState();
}

function onGameTimeToggle(checked) {
  state.trackGameTime = checked;
  updatePresetUI();
  saveState();
}

function onShotLocToggle(checked) {
  state.trackShotLocations = checked;
  updatePresetUI();
  saveState();
}

function onPlayerNumToggle(checked) {
  state.showPlayerNumbers = checked;
  updatePresetUI();
  refAllBtns();
  saveState();
}

function onTurnoverToggle(checked) {
  state.trackTurnovers = checked;
  updatePresetUI();
  saveState();
}

function onGKPerfToggle(checked) {
  state.trackGKPerformance = checked;
  updatePresetUI();
  saveState();
}

function onOppScorerToggle(checked) {
  state.trackOppScorers = checked;
  updatePresetUI();
  saveState();
}

// ─── TRACKING PRESET HELPERS ─────────────────────────────────────────────────
const _TRK_PRESETS = {
  quick:    {trackGameTime: false, showPlayerNumbers: false, trackShotLocations: false, trackTurnovers: false, trackGKPerformance: false, trackOppScorers: false},
  standard: {trackGameTime: true,  showPlayerNumbers: true,  trackShotLocations: true,  trackTurnovers: false, trackGKPerformance: false, trackOppScorers: false},
  detailed: {trackGameTime: true,  showPlayerNumbers: true,  trackShotLocations: true,  trackTurnovers: true,  trackGKPerformance: true,  trackOppScorers: true},
};
const _TRK_DESCS = {
  quick:    'Scores only — no jersey numbers, game time, shot locations, or turnover detail.',
  standard: 'Captures scores, jersey numbers, game time, and shot locations.',
  detailed: 'Full tracking — everything in Standard plus turnover breakdowns, goalkeeper performance, and opposition scorers.',
};

function applyTrackingPreset(mode) {
  const p = _TRK_PRESETS[mode]; if (!p) return;
  Object.assign(state, p);
  syncTrackingUI();
  updatePresetUI();
  refAllBtns();
  saveState();
}

function syncTrackingUI() {
  const gt = document.getElementById('gametime-chk');
  if (gt) gt.checked = state.trackGameTime !== false;
  const pnum = document.getElementById('pnum-chk');
  if (pnum) pnum.checked = state.showPlayerNumbers !== false;
  const shot = document.getElementById('shotloc-chk');
  if (shot) shot.checked = !!state.trackShotLocations;
  const turn = document.getElementById('turnover-chk');
  if (turn) turn.checked = !!state.trackTurnovers;
  const gkCard = document.getElementById('gkperf-card');
  const gkChk  = document.getElementById('gkperf-chk');
  if (gkCard) gkCard.style.display = '';
  if (gkChk)  gkChk.checked = !!state.trackGKPerformance;
  const oscChk = document.getElementById('oppscorer-chk');
  if (oscChk) oscChk.checked = !!state.trackOppScorers;
}

function updatePresetUI() {
  const gt    = state.trackGameTime !== false;
  const pnum  = state.showPlayerNumbers !== false;
  const shot  = !!state.trackShotLocations;
  const turn  = !!state.trackTurnovers;
  const gkp   = !!state.trackGKPerformance;
  const osc   = !!state.trackOppScorers;
  let active = null;
  if (!gt && !pnum && !shot && !turn && !gkp && !osc) active = 'quick';
  else if (gt && pnum && shot && !turn && !gkp && !osc) active = 'standard';
  else if (gt && pnum && shot &&  turn &&  gkp &&  osc) active = 'detailed';
  else active = 'custom';
  document.querySelectorAll('.trk-preset-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.preset === active);
  });
  const desc = document.getElementById('trk-preset-desc');
  if (desc) desc.textContent = _TRK_DESCS[active] || 'Custom mix of tracking options.';
}

// ─── TEAM NAME TYPEAHEAD ──────────────────────────────────────────────────────
const _TA_ITEMS = [
  ...MEATH_CLUBS.map(c => ({name: c.name, crest: c.crest})),
  ...COUNTIES.map(n => ({name: n, crest: 'crests/' + n.toLowerCase() + '.png'})),
];

function _initTypeahead(input) {
  if (input._taInit) return;
  input._taInit = true;

  if (!document.getElementById('ta-style')) {
    const s = document.createElement('style');
    s.id = 'ta-style';
    s.textContent = '.ta-item:hover,.ta-item:active{background:var(--bg2);}';
    document.head.appendChild(s);
  }

  // Use position:absolute inside the input's parent so the dropdown stays
  // attached to the field on iOS when the keyboard shifts the visual viewport.
  const anchor = input.parentElement;
  anchor.style.position = 'relative';

  const drop = document.createElement('div');
  drop.style.cssText = 'position:absolute;z-index:9999;background:var(--bg1);border:.5px solid var(--bm);'
    + 'border-radius:var(--r);overflow-y:auto;max-height:220px;display:none;'
    + 'box-shadow:0 4px 16px rgba(0,0,0,0.14);-webkit-overflow-scrolling:touch;'
    + 'top:100%;left:0;width:100%;';
  anchor.appendChild(drop);

  const close = () => { drop.style.display = 'none'; };

  const pick = (name) => {
    input.value = name;
    flushSettings();
    close();
  };

  input.addEventListener('input', () => {
    const raw = input.value;
    const slashAt = raw.indexOf(' / ');
    let matches;

    if (slashAt >= 0) {
      // Amalgam mode: "Club A / <typing second club>"
      const prefixName = raw.slice(0, slashAt).trim();
      const prefixClub = MEATH_CLUBS.find(c => c.name.toLowerCase() === prefixName.toLowerCase());
      const q2 = raw.slice(slashAt + 3).trim().toLowerCase();
      if (prefixClub && q2.length >= 1) {
        const norm2 = prefixClub.name.toLowerCase();
        const pool = MEATH_CLUBS.filter(c => c.name.toLowerCase() !== norm2);
        const s = pool.filter(c => c.name.toLowerCase().startsWith(q2));
        const con = pool.filter(c => !c.name.toLowerCase().startsWith(q2) && c.name.toLowerCase().includes(q2));
        matches = [...s, ...con].slice(0, 6).map(c => ({
          name: prefixName + ' / ' + c.name,
          crest1: prefixClub.crest,
          crest2: c.crest,
          pair: true,
        }));
      } else {
        close(); return;
      }
    } else {
      const q = raw.trim().toLowerCase();
      if (q.length < 1) { close(); return; }
      const exact    = _TA_ITEMS.filter(i => i.name.toLowerCase() === q);
      const starts   = _TA_ITEMS.filter(i => i.name.toLowerCase() !== q && i.name.toLowerCase().startsWith(q));
      const contains = _TA_ITEMS.filter(i => !i.name.toLowerCase().startsWith(q) && i.name.toLowerCase().includes(q));
      matches = [...exact, ...starts, ...contains].slice(0, 8).map(i => ({ ...i, pair: false }));
    }

    if (!matches.length) { close(); return; }

    // eslint-disable-next-line no-restricted-syntax -- safe: all user values through esc()
    drop.innerHTML = matches.map(item => {
      const crestHtml = item.pair
        ? '<div style="position:relative;width:26px;height:26px;flex-shrink:0;">'
          + `<img src="${esc(item.crest1)}" style="position:absolute;top:0;left:0;width:17px;height:17px;object-fit:contain;" onerror="this.style.display='none'">`
          + `<img src="${esc(item.crest2)}" style="position:absolute;bottom:0;right:0;width:19px;height:19px;object-fit:contain;" onerror="this.style.display='none'">`
          + '</div>'
        : `<img src="${esc(item.crest)}" style="width:26px;height:26px;object-fit:contain;flex-shrink:0;" onerror="this.style.display='none'">`;
      return `<div class="ta-item" data-name="${esc(item.name)}" `
        + `style="display:flex;align-items:center;gap:10px;padding:9px 12px;cursor:pointer;font-size:14px;color:var(--t1);">`
        + crestHtml
        + `<span>${esc(item.name)}</span></div>`;
    }).join('');

    drop.querySelectorAll('.ta-item').forEach(row => {
      row.addEventListener('mousedown', e => { e.preventDefault(); pick(row.dataset.name); });
      row.addEventListener('touchend',  e => { e.preventDefault(); pick(row.dataset.name); });
    });

    drop.style.display = 'block';
  });

  input.addEventListener('blur',    () => setTimeout(close, 200));
  input.addEventListener('keydown', e  => { if (e.key === 'Escape') { close(); input.blur(); } });
}

/* ── layout.js ── */
'use strict';

// ─── LAYOUT PANEL ─────────────────────────────────────────────────────────────
function _teamCrest(name) {
  const club = findClub(name);
  return club?.crest || findCountyCrest(name) || null;
}

const _crestImg = (src, alt) =>
  src ? `<img src="${esc(src)}" alt="${esc(alt)}" onerror="this.style.display='none'">` : '';

// Two crests stacked: top-left (smaller, behind) + bottom-right (larger, in front).
// Both images sit inside the existing .layout-hdr-crest container (52×52 px effective area).
function _crestImgPair(src1, src2, alt) {
  const a = esc(alt);
  return '<div style="position:relative;width:52px;height:52px;">'
    + `<img src="${esc(src1)}" alt="${a}" style="position:absolute;top:0;left:0;width:33px;height:33px;object-fit:contain;" onerror="this.style.display='none'">`
    + `<img src="${esc(src2)}" alt="${a}" style="position:absolute;bottom:0;right:0;width:37px;height:37px;object-fit:contain;z-index:1;" onerror="this.style.display='none'">`
    + '</div>';
}

// Returns the full crest HTML for a team name — single img or stacked pair as appropriate.
function _resolveCrestHTML(name) {
  const pair = name ? findAmalgamPair(name) : null;
  if (pair) return _crestImgPair(pair[0].crest, pair[1].crest, name);
  return _crestImg(_teamCrest(name || ''), name || '');
}

function openLayout() {
  closeSettings();

  const oppName = state.oppN && state.oppN !== 'Opposition' ? state.oppN : '';

  // eslint-disable-next-line no-restricted-syntax -- safe: _resolveCrestHTML() passes all values through esc()
  document.getElementById('layout-us-crest').innerHTML  = _resolveCrestHTML(state.usN);
  // eslint-disable-next-line no-restricted-syntax -- safe: _resolveCrestHTML() passes all values through esc()
  document.getElementById('layout-opp-crest').innerHTML = _resolveCrestHTML(oppName);
  document.getElementById('layout-team-name').textContent = state.usN;

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IE', {weekday:'long', day:'numeric', month:'long', year:'numeric'});
  // eslint-disable-next-line no-restricted-syntax -- safe: all user values through esc()
  document.getElementById('layout-vs').innerHTML =
    (oppName ? 'vs ' + esc(oppName) + '<br>' : '') +
    '<span style="font-size:11px;">' + esc(dateStr) + '</span>';

  renderLayout();
  document.getElementById('layoutpanel').classList.add('open');
}

function closeLayout() {
  document.getElementById('layoutpanel').classList.remove('open');
  openSettings();
}

function renderLayout() {
  const layout = GRID_LAYOUTS[state.teamSize] || GRID_LAYOUTS[15];
  let h = '<div class="layout-formation">';

  layout.forEach(row => {
    h += '<div class="layout-row">';
    row.forEach(slot => {
      const pi = state.slotp ? (state.slotp[slot] || slot) : slot;
      const name = gn(pi) || '';
      const isCap = state.captain === slot;
      h += '<div class="layout-player">';
      h += '<div class="layout-shirt-wrap">';
      if (isCap) h += '<span class="layout-cap-badge">C</span>';
      h += `<i class="fa-solid fa-shirt layout-shirt-icon" style="color:${slot===1?CARD_YELLOW:TEAM_US_COLOR};"></i>`;
      h += '<span class="layout-shirt-num" style="color:'+(slot===1?TEAM_US_COLOR:'#fff')+';">'+pi+'</span>';
      h += '</div>';
      h += '<div class="layout-player-name">'+esc(name || '—')+'</div>';
      h += '</div>';
    });
    h += '</div>';
  });

  h += '</div>';

  // Subs — exclude any bench player who started (pre-game sub)
  const startingPis = new Set(Object.values(state.slotp).map(Number));
  const subs = [];
  for (let i = 16; i <= (state.maxB || 16); i++) {
    const n = gn(i);
    if (n && !startingPis.has(i)) subs.push({idx: i, name: n});
  }
  // Include pre-game replaced players (still part of the squad)
  Object.values(state.preGameSubs || {}).forEach(pi => {
    const n = gn(pi);
    if (n) subs.push({idx: pi, name: n});
  });
  if (subs.length > 0) {
    h += '<div class="layout-subs-wrap">';
    h += '<div class="layout-subs-title">Subs</div>';
    h += '<div class="layout-subs-grid">';
    subs.forEach(s => {
      h += '<div class="layout-sub-player">';
      h += '<div class="layout-sub-shirt-wrap">';
      h += '<i class="fa-solid fa-shirt layout-sub-shirt"></i>';
      h += '<span class="layout-sub-num">'+s.idx+'</span>';
      h += '</div>';
      h += '<div class="layout-sub-name">'+esc(s.name)+'</div>';
      h += '</div>';
    });
    h += '</div></div>';
  }

  // eslint-disable-next-line no-restricted-syntax -- safe: all user data through esc() in the builder above
  document.getElementById('layout-content').innerHTML = h;
}

/* ── game-utils.js ── */
'use strict';

// ─── TIME UTILITIES ───────────────────────────────────────────────────────────
function toSeconds(s) {
  const p = (s || '0:00').split(':');
  return parseInt(p[0] || 0) * 60 + parseInt(p[1] || 0);
}

function formatSeconds(secs) {
  const m = Math.floor(secs / 60), sc = Math.round(secs % 60);
  return m + ':' + (sc < 10 ? '0' : '') + sc;
}

// Returns a Date for the match: state.matchDate (ISO string from Setup) if set,
// otherwise today. Use this wherever a display date is needed so share/print
// screens reflect the actual match day rather than always showing today.
function matchDisplayDate() {
  if (state.matchDate) {
    const d = new Date(state.matchDate + 'T12:00:00');
    if (!isNaN(d)) return d;
  }
  return new Date();
}

// ─── SCORE BADGE PROCESSING ───────────────────────────────────────────────────
// Applies an OPP, ADJ, Goal, Point, 2 Point, or Wide event to a running scores
// object {usG, usP, oppG, oppP}. Returns {mType, mTeam} or null.
function applyScoreBadge(ev, scores, oppN) {
  let mType = null, mTeam = 'us';
  if (ev.badge === 'OPP') {
    const d = ev.desc || '';
    if      (d.includes('Goal added'))     { scores.oppG++; mType = 'Goal';    mTeam = 'opp'; }
    else if (d.includes('2 Point added'))  { scores.oppP += 2; mType = '2 Point'; mTeam = 'opp'; }
    else if (d.includes('Point added'))    { scores.oppP++; mType = 'Point';   mTeam = 'opp'; }
    else if (d.includes('Goal removed'))   scores.oppG = Math.max(0, scores.oppG - 1);
    else if (d.includes('Point removed'))  scores.oppP = Math.max(0, scores.oppP - 1);
  } else if (ev.badge === 'ADJ') {
    const d = ev.desc || '';
    const adjOpp = d.startsWith(oppN);
    if      (d.includes('Goal added'))    { if(adjOpp){scores.oppG++;mType='Goal';mTeam='opp';}else{scores.usG++;mType='Goal';mTeam='us';} }
    else if (d.includes('2 Point added')) { if(adjOpp){scores.oppP+=2;mType='2 Point';mTeam='opp';}else{scores.usP+=2;mType='2 Point';mTeam='us';} }
    else if (d.includes('Point added'))   { if(adjOpp){scores.oppP++;mType='Point';mTeam='opp';}else{scores.usP++;mType='Point';mTeam='us';} }
    else if (d.includes('Goal removed'))  { if(adjOpp) scores.oppG=Math.max(0,scores.oppG-1); else scores.usG=Math.max(0,scores.usG-1); }
    else if (d.includes('Point removed')) { if(adjOpp) scores.oppP=Math.max(0,scores.oppP-1); else scores.usP=Math.max(0,scores.usP-1); }
  } else if (ev.action === 'Goal')    { scores.usG++;    mType = 'Goal';    mTeam = 'us'; }
    else if (ev.action === 'Point')   { scores.usP++;    mType = 'Point';   mTeam = 'us'; }
    else if (ev.action === '2 Point') { scores.usP += 2; mType = '2 Point'; mTeam = 'us'; }
    else if (ev.action === 'Wide')    {                   mType = 'Wide';    mTeam = 'us'; }
  return mType ? { mType, mTeam } : null;
}

// ─── MATCH STATISTICS AGGREGATION ────────────────────────────────────────────
// Aggregates per-player and team stats from an events array.
// slotp: slot→pi mapping. getPlayerName: pi => string.
// References PLACED_BALL from global scope (defined in constants.js / review.html).
function aggregateMatchStats(evts, trackTurnovers, slotp, getPlayerName) {
  let goalCount=0, ptCount=0, twoPtCount=0, wideCount=0;
  let placedGoals=0, placedPts=0, placedTwoPts=0, placedWides=0;
  let ownWon=0, ownLost=0, ownUnclear=0, oppWon=0, oppLost=0, oppUnclear=0;
  let turnoversWon=0, turnoversLost=0, freesWon=0;
  const wonCategories = {}, lostCategories = {};
  const pstats = {};

  evts.forEach(ev => {
    if (ev.badge === 'RSTR') {
      const d = ev.desc || '';
      const won = d.includes(': Won'), lost = d.includes(': Lost');
      if (d.startsWith('Own Restart'))  { if(won)ownWon++; else if(lost)ownLost++; else ownUnclear++; }
      else if (d.startsWith('Opposition')) { if(won)oppWon++; else if(lost)oppLost++; else oppUnclear++; }
      return;
    }
    if (!ev.action || !ev.slot) return;
    const pi = ev.pi != null ? ev.pi : slotp[ev.slot];
    if (!pi) return;
    const placed = PLACED_BALL.has(ev.sec);
    if (!pstats[pi]) pstats[pi] = {name:getPlayerName(pi),gPlay:0,gPlaced:0,pPlay:0,pPlaced:0,wides:0,yc:0,syc:0,rc:0,bc:0,twon:0,tlost:0,freesWon:0,twonSec:{},tlostSec:{},frees:{}};
    const ps = pstats[pi];
    if      (ev.action === 'Goal')        { goalCount++;   placed ? (placedGoals++,  ps.gPlaced++) : ps.gPlay++; }
    else if (ev.action === 'Point')       { ptCount++;     placed ? (placedPts++,    ps.pPlaced++) : ps.pPlay++; }
    else if (ev.action === '2 Point')     { twoPtCount++;  placed ? (placedTwoPts++, ps.pPlaced+=2) : ps.pPlay+=2; }
    else if (ev.action === 'Wide')        { wideCount++;   ps.wides++; if (placed) placedWides++; }
    else if (ev.action === 'Yellow Card')        ps.yc++;
    else if (ev.action === 'Second Yellow Card') { ps.yc++; ps.syc++; }
    else if (ev.action === 'Red Card')           ps.rc++;
    else if (ev.action === 'Black Card')  ps.bc++;
    else if (ev.action === 'Free Won')       { freesWon++; ps.freesWon++; }
    else if (ev.action === 'Turnover Won')  {
      turnoversWon++;  ps.twon++;
      if (trackTurnovers && ev.sec) { wonCategories[ev.sec]=(wonCategories[ev.sec]||0)+1; ps.twonSec[ev.sec]=(ps.twonSec[ev.sec]||0)+1; }
    }
    else if (ev.action === 'Turnover Lost') {
      turnoversLost++; ps.tlost++;
      if (trackTurnovers && ev.sec) { lostCategories[ev.sec]=(lostCategories[ev.sec]||0)+1; ps.tlostSec[ev.sec]=(ps.tlostSec[ev.sec]||0)+1; }
    }
    else if (ev.action === 'Free') { const ft = ev.sec || 'Other'; ps.frees[ft] = (ps.frees[ft]||0) + 1; }
  });

  let freesConc = 0, freesScored = 0;
  for (let i = 0; i < evts.length; i++) {
    if (evts[i].action !== 'Free') continue;
    freesConc++;
    for (let j = i + 1; j < evts.length; j++) {
      const next = evts[j];
      if (next.badge === 'RSTR') continue;
      if (next.badge === 'OPP') freesScored++;
      break;
    }
  }

  return {
    pstats, wonCategories, lostCategories,
    goalCount, ptCount, twoPtCount, wideCount,
    placedGoals, placedPts, placedTwoPts, placedWides,
    turnoversWon, turnoversLost, freesWon,
    ownWon, ownLost, ownUnclear, oppWon, oppLost, oppUnclear,
    freesConc, freesScored,
  };
}

// ─── PLAYER FILTERING ─────────────────────────────────────────────────────────
function getScorers(pstats) {
  return Object.values(pstats).filter(p =>
    p.gPlay+p.gPlaced+p.pPlay+p.pPlaced+p.wides > 0
  ).sort((a, b) => {
    const ta = (a.gPlay+a.gPlaced)*3+(a.pPlay+a.pPlaced);
    const tb = (b.gPlay+b.gPlaced)*3+(b.pPlay+b.pPlaced);
    return tb !== ta ? tb - ta : a.name.localeCompare(b.name);
  });
}

function getDiscPlayers(pstats) {
  return Object.values(pstats).filter(p =>
    p.yc+p.bc+p.rc > 0 || Object.keys(p.frees).length > 0
  ).sort((a, b) => {
    const ca = a.rc*100+a.bc*10+a.yc, cb = b.rc*100+b.bc*10+b.yc;
    if (cb !== ca) return cb - ca;
    const fa = Object.values(a.frees).reduce((s,n)=>s+n,0);
    const fb = Object.values(b.frees).reduce((s,n)=>s+n,0);
    return fb - fa || a.name.localeCompare(b.name);
  });
}

// ─── MOMENTUM ─────────────────────────────────────────────────────────────────
function calculateMomentum(usGoals, usPts, ogGoals, ogPts, ownWon, oppWon, ownLost, oppLost, turnoversWon, turnoversLost) {
  const usMom  = (usGoals*3 + usPts) + (ownWon  + oppWon)  * 2 + turnoversWon;
  const oppMom = (ogGoals*3 + ogPts) + (ownLost + oppLost) * 2 + turnoversLost;
  const momTotal = usMom + oppMom;
  const usPct  = momTotal > 0 ? Math.round(usMom  / momTotal * 100) : 50;
  const oppPct = momTotal > 0 ? 100 - usPct : 50;
  return { usMom, oppMom, momTotal, usPct, oppPct };
}

// ─── SHOT MAP COMPUTATION ────────────────────────────────────────────────────
// Deterministic jitter so dots don't overlap.
function shotJitter(seed, range) {
  const x = Math.sin(seed) * 43758.5453;
  return (x - Math.floor(x) - 0.5) * range;
}

// Builds SVG dot markup and thirds breakdown from a filtered shots array.
// getInitials(pi): returns the text label to render inside each dot.
function computeShotDots(shots, getInitials) {
  const placed_arr = [];
  let dots = '';
  shots.forEach((s, i) => {
    const isSideline = s.sec === 'From Sideline';
    const is45       = s.sec === 'From 45';
    const is65       = s.sec === 'From 65';
    const isPenalty  = s.sec === 'From Penalty';
    const baseCx = isPenalty ? 160 : isSideline ? (s.zone.coords.x < 0.5 ? ZPX : ZPX + ZPW) : ZPX + s.zone.coords.x * ZPW;
    const baseCy = isPenalty ? 360 : is45 ? 268 : is65 ? 215 : ZPY + s.zone.coords.y * ZPH;
    const isScore = s.action !== 'Wide' && s.action !== 'Short' && s.action !== 'Saved';
    const isGoal  = s.action === 'Goal';
    const isShort = s.action === 'Short';
    const isSaved = s.action === 'Saved';
    const r = isGoal ? 9 : 6;
    let cx, cy, jRange = 16;
    let bestCx = baseCx, bestCy = baseCy, bestOverlap = Infinity;
    for (let attempt = 0; attempt < 15; attempt++) {
      const tryX = baseCx + (isSideline || isPenalty ? 0 : shotJitter(i * 2.1 + 1 + attempt * 17.3, jRange));
      const tryY = baseCy + (is45 || is65 || isPenalty ? 0 : shotJitter(i * 2.1 + 2 + attempt * 17.3, jRange));
      const maxOverlap = placed_arr.reduce((m, p) => Math.max(m, r + p.r + 4 - Math.hypot(tryX - p.cx, tryY - p.cy)), 0);
      if (maxOverlap <= 0) { cx = tryX; cy = tryY; break; }
      if (maxOverlap < bestOverlap) { bestOverlap = maxOverlap; bestCx = tryX; bestCy = tryY; }
      jRange += 8;
    }
    if (cx == null) { cx = bestCx; cy = bestCy; }
    placed_arr.push({cx, cy, r});
    const cxS = cx.toFixed(1), cyS = cy.toFixed(1);
    const fill = isShort ? '#9E9E9E' : isSaved ? '#F97316' : isScore ? TEAM_US_COLOR : TEAM_OPP_COLOR;
    if (s.placed) dots += `<circle cx="${cxS}" cy="${cyS}" r="${r+3.5}" fill="none" stroke="${fill}" stroke-width="1.5" opacity="0.7"/>`;
    dots += `<circle cx="${cxS}" cy="${cyS}" r="${r}" fill="${fill}" opacity="0.82" stroke="white" stroke-width="1.2"/>`;
    if (s.pi != null) {
      const ini = getInitials(s.pi);
      const fs = isGoal ? 7 : (ini.length >= 4 ? 4.5 : 5.5);
      dots += `<text x="${cxS}" y="${cyS}" text-anchor="middle" dominant-baseline="central" font-size="${fs}" font-weight="700" fill="white" font-family="-apple-system,BlinkMacSystemFont,sans-serif" style="pointer-events:none;">${ini}</text>`;
    }
  });

  const thirds = { att:{shots:0,scores:0}, mid:{shots:0,scores:0}, def:{shots:0,scores:0} };
  shots.forEach(s => {
    const t = s.zone.coords.y > 0.667 ? 'att' : s.zone.coords.y > 0.333 ? 'mid' : 'def';
    thirds[t].shots++;
    if (s.action !== 'Wide' && s.action !== 'Short' && s.action !== 'Saved') thirds[t].scores++;
  });

  return { dots, thirds };
}

// ─── PLACED BALL ─────────────────────────────────────────────────────────────
function isPlacedBall(ev) {
  return PLACED_BALL.has(ev.sec) ||
    (ev.sec == null && (ev.badge === 'OPP' || ev.badge === 'ADJ') &&
      [...PLACED_BALL].some(pb => (ev.desc || '').includes(pb)));
}

// ─── PERCENTAGE HELPER ────────────────────────────────────────────────────────
// Returns formatted percentage string or '—' for zero denominator.
function pct(n, d) { return d > 0 ? Math.round(n / d * 100) + '%' : '—'; }

// ─── TURNOVER DONUT ───────────────────────────────────────────────────────────
function buildTurnoverDonut(title, entries, colorMap, fallback) {
  const total = entries.reduce((s, [,n]) => s + n, 0);
  if (total === 0) return '';

  const CX = 54, CY = 54, R = 46, IR = 24;
  const GAP = 0.025;
  let svg = `<svg width="108" height="108" viewBox="0 0 108 108" style="display:block;margin:0 auto;">`;

  let angle = -Math.PI / 2;
  entries.forEach(([cat, n]) => {
    const sweep = (n / total) * 2 * Math.PI - (entries.length > 1 ? GAP : 0);
    const a1 = angle + (entries.length > 1 ? GAP / 2 : 0);
    const a2 = a1 + sweep;
    const x1 = CX + R  * Math.cos(a1), y1 = CY + R  * Math.sin(a1);
    const x2 = CX + R  * Math.cos(a2), y2 = CY + R  * Math.sin(a2);
    const ix1= CX + IR * Math.cos(a2), iy1= CY + IR * Math.sin(a2);
    const ix2= CX + IR * Math.cos(a1), iy2= CY + IR * Math.sin(a1);
    const large = sweep > Math.PI ? 1 : 0;
    const color = colorMap[cat] || fallback;
    svg += `<path d="M${x1} ${y1} A${R} ${R} 0 ${large} 1 ${x2} ${y2} L${ix1} ${iy1} A${IR} ${IR} 0 ${large} 0 ${ix2} ${iy2}Z" fill="${color}"/>`;
    if (sweep > 0.38) {
      const midA = a1 + sweep / 2;
      const lr = (R + IR) / 2;
      svg += `<text x="${(CX + lr * Math.cos(midA)).toFixed(1)}" y="${(CY + lr * Math.sin(midA) + 3).toFixed(1)}" text-anchor="middle" font-size="9" font-weight="600" fill="rgba(255,255,255,0.82)">${n}</text>`;
    }
    angle += (n / total) * 2 * Math.PI;
  });

  svg += `<text x="${CX}" y="${CY - 5}" text-anchor="middle" font-size="14" font-weight="700" fill="var(--t1)">${total}</text>`;
  svg += `<text x="${CX}" y="${CY + 9}" text-anchor="middle" font-size="8"  fill="var(--t2)">total</text>`;
  svg += '</svg>';

  let legend = '<div style="margin-top:6px;">';
  [...entries].sort((a, b) => b[1] - a[1]).forEach(([cat, n]) => {
    const p = Math.round(n / total * 100);
    const color = colorMap[cat] || fallback;
    legend += `<div style="display:flex;align-items:center;gap:5px;margin-bottom:3px;">
      <span style="width:9px;height:9px;border-radius:50%;background:${color};flex-shrink:0;"></span>
      <span style="font-size:10px;color:var(--t2);flex:1;line-height:1.3;">${esc(cat)}</span>
      <span style="font-size:10px;font-weight:700;color:var(--t1);">${p}%</span>
    </div>`;
  });
  legend += '</div>';

  return `<div style="flex:1;min-width:120px;max-width:160px;">
    <div style="font-size:11px;font-weight:700;color:var(--t2);text-align:center;margin-bottom:6px;text-transform:uppercase;letter-spacing:.4px;">${esc(title)}</div>
    ${svg}${legend}
  </div>`;
}

// ─── GK RATING ────────────────────────────────────────────────────────────────
// Returns null if no rated events. Otherwise returns rating data.
function calculateGKRating(evts, ageGrade) {
  const ratedEvts = evts.filter(e => e.gkOutcome != null && e.gkFinalValue != null);
  if (ratedEvts.length === 0) return null;

  let weightedDevSum = 0, totalWeight = 0, saves = 0, goals = 0;
  ratedEvts.forEach(e => {
    const dev = e.gkFinalValue - 4;
    const wt = 1 + ((e.gkIntensity || 3) - 1) * 0.4;
    weightedDevSum += dev * wt;
    totalWeight += wt;
    if (e.gkOutcome === 'save') saves++; else goals++;
  });

  const avgDev = totalWeight > 0 ? weightedDevSum / totalWeight : 0;
  const _ageBonus = ({U8:2.0,U10:1.75,U12:1.5,U14:1.2,U16:0.75,Minor:0.35})[ageGrade] || 0;
  const rating = Math.round(50 + (Math.max(-4, Math.min(4, avgDev + _ageBonus)) / 4) * 50);
  const label = rating >= 80 ? 'Outstanding' : rating >= 65 ? 'Very Good' : rating >= 55 ? 'Good'
    : rating >= 45 ? 'Average' : rating >= 35 ? 'Below Average' : rating >= 20 ? 'Poor' : 'Very Poor';
  const ratingColor = rating >= 65 ? '#2E7D32' : rating >= 45 ? '#F59E0B' : '#C62828';
  const shots = saves + goals;
  const saveRate = shots > 0 ? Math.round(saves / shots * 100) : 0;

  return { rating, label, ratingColor, saves, goals, shots, saveRate, ratedEvts };
}

/* ── stats.js ── */
'use strict';

// ─── SCORE TIMELINE ───────────────────────────────────────────────────────────
function buildTimelineHTML() {
  let usG=0,usP=0,oppG=0,oppP=0,halfSecs=0,inH2=false;
  const data = [{secs:0,us:0,opp:0}];
  const subs=[], reds=[], blacks=[], markers=[];

  state.evts.forEach(ev => {
    let t = toSeconds(ev.time);
    if (ev.badge==='1H') { halfSecs=t; return; }
    if (ev.badge==='2H') { inH2=true; return; }
    if (inH2) t += halfSecs;
    const sc = {usG, usP, oppG, oppP};
    const prevUs=usG*3+usP, prevOpp=oppG*3+oppP;
    const _res = applyScoreBadge(ev, sc, state.oppN);
    const mType = _res ? _res.mType : null, mTeam = _res ? _res.mTeam : 'us';
    ({usG, usP, oppG, oppP} = sc);
    if (!_res) {
      if      (ev.action === 'sub')        subs.push({secs:t});
      else if (ev.action === 'Red Card')   reds.push({secs:t});
      else if (ev.action === 'Black Card') blacks.push({secs:t});
    }
    const curUs=usG*3+usP, curOpp=oppG*3+oppP;
    const placed = isPlacedBall(ev);
    if (mType) markers.push({secs:t, team:mTeam, type:mType, usScore:curUs, oppScore:curOpp, placed});
    if (curUs!==prevUs||curOpp!==prevOpp||mType==='Wide') data.push({secs:t,us:curUs,opp:curOpp});
  });

  if (data.length < 2) return '';

  const totalSecs = Math.max(data[data.length-1].secs, halfSecs||1);
  data.push({secs:totalSecs, us:usG*3+usP, opp:oppG*3+oppP});
  const maxPts = Math.max(...data.map(d=>Math.max(d.us,d.opp)),1);

  const W=272,H=100,PL=24,PR=8,PT=8,PB=18;
  const cw=W-PL-PR, ch=H-PT-PB;
  const x=s=>(PL+(s/totalSecs)*cw).toFixed(1);
  const y=p=>(PT+ch-(p/maxPts)*ch).toFixed(1);
  const usLine  = data.map(d=>x(d.secs)+','+y(d.us)).join(' ');
  const oppLine = data.map(d=>x(d.secs)+','+y(d.opp)).join(' ');
  const yMid=Math.round(maxPts/2);

  let svg=`<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="width:100%;display:block;">`;
  svg+=`<line x1="${PL}" y1="${PT+ch}" x2="${PL+cw}" y2="${PT+ch}" stroke="var(--b)" stroke-width="1"/>`;
  svg+=`<text x="${PL-4}" y="${y(0)+4}" text-anchor="end" font-size="9" fill="var(--t3)">0</text>`;
  svg+=`<text x="${PL-4}" y="${parseFloat(y(yMid))+4}" text-anchor="end" font-size="9" fill="var(--t3)">${yMid}</text>`;
  svg+=`<text x="${PL-4}" y="${parseFloat(y(maxPts))+4}" text-anchor="end" font-size="9" fill="var(--t3)">${maxPts}</text>`;
  svg+=`<text x="${PL}" y="${H-2}" text-anchor="middle" font-size="9" fill="var(--t3)">0'</text>`;
  if (halfSecs>0) {
    svg+=`<line x1="${x(halfSecs)}" y1="${PT}" x2="${x(halfSecs)}" y2="${PT+ch}" stroke="var(--bm)" stroke-width="1" stroke-dasharray="3 2"/>`;
    svg+=`<text x="${x(halfSecs)}" y="${H-2}" text-anchor="middle" font-size="9" fill="var(--t3)">HT</text>`;
  }
  svg+=`<text x="${x(totalSecs)}" y="${H-2}" text-anchor="middle" font-size="9" fill="var(--t3)">${Math.round(totalSecs/60)}'</text>`;
  subs.forEach(e   => { const sx=x(e.secs); svg+=`<line x1="${sx}" y1="${PT}" x2="${sx}" y2="${PT+ch}" stroke="#F59E0B" stroke-width="1.5" stroke-dasharray="2 2"/>`; });
  reds.forEach(e   => { const sx=x(e.secs); svg+=`<line x1="${sx}" y1="${PT}" x2="${sx}" y2="${PT+ch}" stroke="${CARD_RED}" stroke-width="1.5" stroke-dasharray="2 2"/>`; });
  blacks.forEach(e => { const sx=x(e.secs); svg+=`<line x1="${sx}" y1="${PT}" x2="${sx}" y2="${PT+ch}" stroke="${CARD_BLACK}" stroke-width="1.5" stroke-dasharray="2 2"/>`; });
  svg+=`<polyline points="${oppLine}" fill="none" stroke="${TEAM_OPP_COLOR}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;
  svg+=`<polyline points="${usLine}"  fill="none" stroke="${TEAM_US_COLOR}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;
  markers.forEach(m => {
    const cx=x(m.secs), cy=y(m.team==='us'?m.usScore:m.oppScore);
    const mcol=m.team==='us'?TEAM_US_COLOR:TEAM_OPP_COLOR;
    const dotCol=m.type==='Wide'?'#9E9E9E':m.type==='2 Point'?'#F59E0B':mcol;
    const dotR=m.type==='Goal'?3.5:m.type==='2 Point'?3:m.type==='Point'?3:2;
    if(m.placed)svg+=`<circle cx="${cx}" cy="${cy}" r="${dotR+2}" fill="none" stroke="${dotCol}" stroke-width="1" opacity="0.7"/>`;
    if      (m.type==='Goal')    svg+=`<circle cx="${cx}" cy="${cy}" r="3.5" fill="${TEAM_US_COLOR}" stroke="#fff" stroke-width="1.2"/>`;
    else if (m.type==='2 Point') svg+=`<circle cx="${cx}" cy="${cy}" r="3"   fill="#F59E0B" stroke="#fff" stroke-width="1.2"/>`;
    else if (m.type==='Point')   svg+=`<circle cx="${cx}" cy="${cy}" r="3"   fill="#fff"    stroke="#9A9E99" stroke-width="1.2"/>`;
    else if (m.type==='Wide')    svg+=`<circle cx="${cx}" cy="${cy}" r="2"   fill="#9E9E9E" stroke="none"/>`;
  });
  svg+='</svg>';

  let h='<div class="stat-section"><div class="stat-section-title">Score Timeline</div><div class="stat-card" style="padding:10px 8px 8px;">';
  h+=svg;
  h+='<div style="display:flex;gap:16px;justify-content:center;margin-top:6px;flex-wrap:wrap;">';
  h+=`<span style="font-size:11px;color:var(--t2);display:flex;align-items:center;gap:4px;"><span style="display:inline-block;width:16px;height:2px;background:${TEAM_US_COLOR};border-radius:1px;vertical-align:middle;"></span>${esc(state.usN)}</span>`;
  h+=`<span style="font-size:11px;color:var(--t2);display:flex;align-items:center;gap:4px;"><span style="display:inline-block;width:16px;height:2px;background:${TEAM_OPP_COLOR};border-radius:1px;vertical-align:middle;"></span>${esc(state.oppN)}</span>`;
  if (subs.length)   h+=`<span style="font-size:11px;color:var(--t2);display:flex;align-items:center;gap:4px;"><span style="display:inline-block;width:14px;height:0;border-top:2px dashed #F59E0B;vertical-align:middle;"></span>Sub</span>`;
  if (reds.length)   h+=`<span style="font-size:11px;color:var(--t2);display:flex;align-items:center;gap:4px;"><span style="display:inline-block;width:14px;height:0;border-top:2px dashed ${CARD_RED};vertical-align:middle;"></span>Red</span>`;
  if (blacks.length) h+=`<span style="font-size:11px;color:var(--t2);display:flex;align-items:center;gap:4px;"><span style="display:inline-block;width:14px;height:0;border-top:2px dashed ${CARD_BLACK};vertical-align:middle;"></span>Black</span>`;
  h+='</div></div></div>';
  return h;
}

// ─── SUBSTITUTIONS TABLE ──────────────────────────────────────────────────────
function buildSubTableHTML() {
  const hasSubs = state.evts.some(ev=>ev.action==='sub');
  if (!hasSubs) return '';

  const _sc={usG:0,usP:0,oppG:0,oppP:0};
  const scoreAt=[];
  state.evts.forEach(ev => {
    applyScoreBadge(ev, _sc, state.oppN);
    scoreAt.push({usG:_sc.usG,usP:_sc.usP,oppG:_sc.oppG,oppP:_sc.oppP});
  });
  const fUsG=_sc.usG,fUsP=_sc.usP,fOppG=_sc.oppG,fOppP=_sc.oppP;

  let h='<div class="stat-section"><div class="stat-section-title">Substitutions</div><div class="stat-card" style="padding:0;overflow:hidden;">';
  h+='<div style="display:flex;align-items:center;padding:7px 12px;background:var(--bg3);border-bottom:.5px solid var(--b);gap:6px;">';
  h+='<span style="font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--t3);min-width:38px;">Time</span>';
  h+='<span style="font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--t3);flex:1;">On</span>';
  h+='<span style="font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--t3);flex:1;">Off</span>';
  h+='<span style="font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--t3);min-width:60px;text-align:right;">Score</span>';
  h+='</div>';

  state.evts.forEach((ev,i)=>{
    if (ev.action!=='sub') return;
    const at=scoreAt[i]||{usG:0,usP:0,oppG:0,oppP:0};
    const aUG=fUsG-at.usG, aUP=fUsP-at.usP, aOG=fOppG-at.oppG, aOP=fOppP-at.oppP;
    const m=ev.desc.match(/Sub: (.+) off \/ (.+) on \(pos (\d+)\)/);
    const offName=m?m[1]:'?', onName=m?m[2]:'?', pos=m?m[3]:'';
    const scoreNow=at.usG+'-'+at.usP+' v '+at.oppG+'-'+at.oppP;
    const afterUs='+'+aUG+'-'+aUP, afterOpp='+'+aOG+'-'+aOP;
    h+='<div style="display:flex;align-items:flex-start;padding:8px 12px;border-bottom:.5px solid var(--b);gap:6px;">';
    h+='<span style="font-size:12px;color:var(--t3);min-width:38px;padding-top:1px;">'+ev.time+'</span>';
    h+='<div style="flex:1;min-width:0;">';
    h+='<div style="font-size:13px;font-weight:500;color:var(--t1);">'+esc(onName)+'</div>';
    if (pos) h+='<div style="font-size:10px;color:var(--t3);">Pos '+pos+'</div>';
    h+='</div>';
    h+='<div style="flex:1;min-width:0;">';
    h+='<div style="font-size:13px;color:var(--t2);">'+esc(offName)+'</div>';
    h+='</div>';
    h+='<div style="min-width:60px;text-align:right;">';
    h+='<div style="font-size:11px;color:var(--t3);">'+scoreNow+'</div>';
    h+='<div style="font-size:10px;color:var(--t3);margin-top:2px;"><span style="color:'+TEAM_US_COLOR+';">'+afterUs+'</span> / <span style="color:'+TEAM_OPP_COLOR+';">'+afterOpp+'</span></div>';
    h+='</div>';
    h+='</div>';
  });

  h+='<div style="padding:7px 12px;font-size:10px;color:var(--t3);">After = goals-pts scored from sub on ('+esc(state.usN)+' / '+esc(state.oppN)+')</div>';
  h+='</div></div>';
  return h;
}

// ─── PLAY TIME ────────────────────────────────────────────────────────────────
function computePlayTimes() {
  const teamSz = state.teamSize || 15;
  const curSlotPi = {}, ptStart = {}, ptMap = {};

  (TEAM_SLOTS[teamSz]||TEAM_SLOTS[15]).forEach(sl => {
    const pi = (state.startSlotp||{})[sl];
    if (pi) { curSlotPi[sl] = pi; ptStart[pi] = 0; }
  });

  let halfSecs = 0, inH2 = false, lastSecs = 0;
  state.evts.forEach(ev => {
    let t = toSeconds(ev.time);
    if (ev.badge === '1H') { halfSecs = t; return; }
    if (ev.badge === '2H') { inH2 = true; return; }
    if (inH2) t += halfSecs;
    lastSecs = Math.max(lastSecs, t);
    if (ev.action === 'sub' && ev.slot != null) {
      const offPi = curSlotPi[ev.slot];
      const onM = (ev.desc||'').match(/\(#(\d+)\) on/);
      const onPi = onM ? +onM[1] : null;
      if (offPi != null && ptStart[offPi] != null) { ptMap[offPi] = (ptMap[offPi]||0) + (t - ptStart[offPi]); delete ptStart[offPi]; }
      if (onPi != null) { ptStart[onPi] = t; curSlotPi[ev.slot] = onPi; }
    }
  });

  const totalSecs = Math.max(lastSecs, halfSecs || 1);
  Object.entries(ptStart).forEach(([pi, start]) => { ptMap[+pi] = (ptMap[+pi]||0) + (totalSecs - start); });
  return { ptMap, totalSecs };
}

function buildPlayTimeHTML() {
  if (!state.trackGameTime) return '';
  if (!state.evts.some(ev => ev.action === 'sub')) return '';
  const { ptMap } = computePlayTimes();
  const startPis = new Set(Object.values(state.startSlotp||{}).map(Number));
  const rows = Object.entries(ptMap)
    .map(([pi, t]) => ({pi:+pi, name:gn(+pi), t}))
    .filter(r => r.name)
    .sort((a, b) => b.t - a.t || a.name.localeCompare(b.name));
  if (!rows.length) return '';

  const maxT = rows[0].t || 1;
  let h = '<div class="stat-section"><div class="stat-section-title">Play Time</div><div class="stat-card" style="padding:8px 12px;">';
  rows.forEach(r => {
    const pct = Math.round(r.t / maxT * 100);
    const isSub = !startPis.has(r.pi);
    h += '<div style="display:flex;align-items:center;gap:10px;padding:5px 0;">';
    h += `<div style="font-size:13px;font-weight:500;color:var(--t1);min-width:110px;white-space:nowrap;">${esc(r.name)}</div>`;
    h += `<div style="flex:1;background:var(--bg3);border-radius:4px;overflow:hidden;height:8px;"><div style="background:${TEAM_US_COLOR};opacity:${isSub?'.55':'1'};width:${pct}%;height:100%;border-radius:4px;"></div></div>`;
    h += `<div style="font-size:13px;font-weight:700;color:${TEAM_US_COLOR};min-width:40px;text-align:right;">${formatSeconds(r.t)}</div>`;
    h += `<div style="font-size:10px;color:var(--t3);min-width:24px;">${isSub?'Sub':''}</div>`;
    h += '</div>';
  });
  h += '</div></div>';
  return h;
}

// ─── STATS HELPERS ────────────────────────────────────────────────────────────
function rstBlock(label, won, lost, unclear, total) {
  let out = '<div class="stat-sub-hdr" style="margin-top:0;">'+label+'</div>';
  if (total === 0) {
    out += '<div style="font-size:13px;color:var(--t3);padding:2px 0 10px;">None recorded</div>';
  } else {
    const pct = Math.round(won / total * 100);
    out += '<div class="stat-split-bar"><div class="stat-split-won" style="width:'+pct+'%"></div></div>';
    out += '<div class="stat-split-labels">';
    out += '<span style="color:'+TEAM_US_COLOR+';font-weight:600;">'+won+' won <span style="font-weight:400;">('+pct+'%)</span></span>';
    out += '<span style="color:'+TEAM_OPP_COLOR+';font-weight:600;">'+lost+' lost'+(unclear?' <span style="font-weight:400;color:var(--t2);">+'+unclear+' unclear</span>':'')+'</span>';
    out += '</div>';
  }
  return out;
}

// ─── GOALKEEPER PERFORMANCE STAT ─────────────────────────────────────────────
function buildGKStatHTML() {
  if (!state.trackGKPerformance) return '';
  const _gk = calculateGKRating(state.evts, state.ageGrade);
  if (!_gk) return '';
  const { rating, label, ratingColor, saves, goals, shots, saveRate, ratedEvts } = _gk;
  const gkName = gn(1) || 'Goalkeeper';
  const intensityLabels = ['', 'Routine', 'Moderate', 'Challenging', 'Difficult', 'Exceptional'];

  let h = '<div class="stat-section"><div class="stat-section-title">Goalkeeper Performance</div>';
  h += '<div class="stat-card">';
  h += `<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">`;
  h += html`<div style="font-size:14px;font-weight:600;color:var(--t1);">${gkName}</div>`;
  h += `<div style="font-size:12px;color:var(--t3);">${saves} save${saves !== 1 ? 's' : ''} / ${goals} goal${goals !== 1 ? 's' : ''} conceded (${saveRate}%)</div>`;
  h += `</div>`;
  h += `<div style="display:flex;align-items:baseline;gap:8px;margin-bottom:12px;">`;
  h += `<div style="font-size:40px;font-weight:800;color:${ratingColor};line-height:1;">${rating}</div>`;
  h += `<div style="font-size:15px;font-weight:700;color:${ratingColor};">${label}</div>`;
  h += `<div style="font-size:11px;color:var(--t3);margin-left:auto;">/ 100</div>`;
  h += `</div>`;
  h += `<div class="gk-rating-bar-wrap"><div class="gk-rating-bar"></div>`;
  h += `<div class="gk-rating-marker" style="left:${rating}%;background:${ratingColor};"></div></div>`;
  h += `<div style="display:flex;justify-content:space-between;margin-top:4px;font-size:10px;color:var(--t3);">`;
  h += `<span>Struggling</span><span>Average</span><span>Excellent</span></div>`;

  if (ratedEvts.length >= 3) {
    const levels = [5, 4, 3, 2, 1].filter(i => ratedEvts.some(e => (e.gkIntensity || 3) === i));
    if (levels.length) {
      h += `<div style="border-top:.5px solid var(--b);margin-top:14px;padding-top:10px;">`;
      h += `<div class="stat-sub-hdr" style="margin-top:0;margin-bottom:8px;">By shot difficulty</div>`;
      levels.forEach(intensity => {
        const lvl = ratedEvts.filter(e => (e.gkIntensity || 3) === intensity);
        const sv = lvl.filter(e => e.gkOutcome === 'save').length;
        const pct = Math.round(sv / lvl.length * 100);
        const bc = pct >= 70 ? '#2E7D32' : pct >= 40 ? '#F59E0B' : '#C62828';
        h += `<div style="display:flex;align-items:center;gap:8px;padding:3px 0;">`;
        h += html`<div style="font-size:12px;color:var(--t2);min-width:96px;">${intensityLabels[intensity]}</div>`;
        h += `<div style="flex:1;background:var(--bg3);border-radius:3px;overflow:hidden;height:6px;"><div style="background:${bc};width:${pct}%;height:100%;border-radius:3px;"></div></div>`;
        h += `<div style="font-size:12px;font-weight:600;color:${bc};min-width:36px;text-align:right;">${sv}/${lvl.length}</div>`;
        h += `</div>`;
      });
      h += `</div>`;
    }
  }

  h += '</div></div>';
  return h;
}

// ─── OPPOSITION SCORING PROFILE ───────────────────────────────────────────────
function buildOppScorerHTML() {
  if (!state.trackOppScorers) return '';
  const scorerEvts = state.evts.filter(e => e.oppScorer);
  if (scorerEvts.length === 0) return '';

  // Aggregate by position label
  const map = {}; // label → { num, label, goals, pts }
  scorerEvts.forEach(e => {
    const s = e.oppScorer;
    const key = s.label + ' (' + s.num + ')';
    if (!map[key]) map[key] = { num: s.num, label: s.label, goals: 0, pts: 0 };
    const action = e.action || '';
    if (action === 'Goal')    map[key].goals++;
    else if (action === '2 Point') map[key].pts += 2;
    else                      map[key].pts++;
  });

  const rows = Object.values(map).sort((a, b) => {
    const ta = a.goals * 3 + a.pts, tb = b.goals * 3 + b.pts;
    return tb !== ta ? tb - ta : a.num - b.num;
  });

  let h = '<div class="stat-section"><div class="stat-section-title">Opposition Scoring Profile</div>';
  h += '<div class="stat-card" style="padding:0;overflow:hidden;">';

  rows.forEach((r, i) => {
    const total = r.goals * 3 + r.pts;
    const scoreStr = r.goals + '-' + r.pts;
    const border = i < rows.length - 1 ? 'border-bottom:.5px solid var(--b);' : '';
    h += `<div style="display:flex;align-items:center;gap:10px;padding:10px 14px;${border}">`;
    h += `<div style="width:28px;height:28px;border-radius:50%;background:#6A1B9A22;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:#6A1B9A;flex-shrink:0;">${r.num}</div>`;
    h += `<div style="flex:1;min-width:0;">`;
    h += `<div style="font-size:13px;font-weight:600;color:var(--t1);">${esc(r.label)}</div>`;
    h += `<div style="font-size:11px;color:var(--t2);">${scoreStr} &nbsp;·&nbsp; ${total} pt${total !== 1 ? 's' : ''}</div>`;
    h += `</div>`;
    // Mini bar scaled to max total
    const maxTot = rows[0].goals * 3 + rows[0].pts;
    const pct = maxTot > 0 ? Math.round(total / maxTot * 100) : 0;
    h += `<div style="width:60px;background:var(--bg3);border-radius:3px;overflow:hidden;height:6px;">`;
    h += `<div style="background:#6A1B9A;width:${pct}%;height:100%;border-radius:3px;"></div></div>`;
    h += `</div>`;
  });

  h += '</div></div>';
  return h;
}

// ─── STATS PANEL ──────────────────────────────────────────────────────────────
function openStats() {
  renderStats();
  document.getElementById('match-notes-input').value = state.matchNotes || '';
  _activateStatsTab('stats');
  document.getElementById('statsoverlay').classList.add('open');
  document.getElementById('statspanel').classList.add('open');
}

function closeStats() {
  document.getElementById('statsoverlay').classList.remove('open');
  document.getElementById('statspanel').classList.remove('open');
}

function _activateStatsTab(tab) {
  const isStats = tab === 'stats';
  document.querySelectorAll('.stats-tab').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  document.getElementById('stats-content').style.display   = isStats ? '' : 'none';
  document.getElementById('stats-notes-wrap').style.display = isStats ? '' : 'none';
  document.getElementById('assess-content').style.display  = isStats ? 'none' : '';
}

function switchStatsTab(tab) {
  _activateStatsTab(tab);
  if (tab === 'assess') renderAssessment();
}

function renderStats() {
  // eslint-disable-next-line no-restricted-syntax -- safe: buildStatsHTML() only uses internal counters, no user data interpolated
  document.getElementById('stats-content').innerHTML = buildStatsHTML();
}

function buildStatsHTML() {
  const {
    pstats, wonCategories, lostCategories,
    goalCount, ptCount, twoPtCount, wideCount,
    placedGoals, placedPts, placedTwoPts, placedWides,
    turnoversWon, turnoversLost, freesWon,
    ownWon, ownLost, ownUnclear, oppWon, oppLost, oppUnclear,
    freesConc, freesScored,
  } = aggregateMatchStats(state.evts, state.trackTurnovers, state.slotp, pl);

  const totalScoreActions = goalCount + ptCount + twoPtCount;
  const totalAttempts = totalScoreActions + wideCount;
  const scorePct = totalAttempts > 0 ? Math.round(totalScoreActions / totalAttempts * 100) : 0;
  const totalPts = goalCount*3 + ptCount + twoPtCount*2;
  const displayPts = ptCount + twoPtCount*2;
  const placedScoreCount = placedGoals + placedPts + placedTwoPts;
  const placedAttempts = placedScoreCount + placedWides;
  const placedPct = placedAttempts > 0 ? Math.round(placedScoreCount / placedAttempts * 100) : 0;
  const totalTurnovers = turnoversWon + turnoversLost;
  const ownTotal = ownWon + ownLost + ownUnclear;
  const oppTotal = oppWon + oppLost + oppUnclear;

  if (!totalAttempts && !ownTotal && !oppTotal && !state.og && !state.op_) {
    return '<div style="text-align:center;padding:48px 0 20px;font-size:14px;color:var(--t2);">No stats to show yet<br><span style="font-size:12px;">Start recording events to see stats here.</span></div>';
  }

  // Momentum calculation
  const {usPct, oppPct, momTotal} = calculateMomentum(state.goals, state.pts, state.og, state.op_, ownWon, oppWon, ownLost, oppLost, turnoversWon, turnoversLost);
  const dominant = usPct > oppPct ? state.usN : usPct < oppPct ? state.oppN : null;

  let h = '';
  h += buildTimelineHTML();

  // Momentum bar
  h += '<div class="stat-section"><div class="stat-section-title">Momentum</div>';
  h += '<div class="momentum-card">';
  h += '<div class="momentum-bar">';
  h += '<div class="momentum-us" style="width:'+usPct+'%"></div>';
  h += '<div class="momentum-opp"></div>';
  h += '</div>';
  h += '<div class="momentum-feet">';
  h += html`<div class="momentum-team">`;
  h += html`<span class="momentum-name" style="color:${TEAM_US_COLOR};">${state.usN}</span>`;
  h += `<span class="momentum-pct" style="color:${TEAM_US_COLOR};">${usPct}%</span>`;
  h += '</div>';
  h += html`<div class="momentum-team right">`;
  h += html`<span class="momentum-name">${state.oppN}</span>`;
  h += `<span class="momentum-pct" style="color:#6B6F66;">${oppPct}%</span>`;
  h += '</div>';
  h += '</div>';
  const basisNote = (ownTotal+oppTotal > 0 && totalTurnovers > 0) ? 'Scores + restarts + turnovers'
    : (ownTotal+oppTotal > 0) ? 'Scores + restarts won'
    : totalTurnovers > 0 ? 'Scores + turnovers'
    : 'Based on scores';
  const domNote = dominant ? ' &mdash; '+esc(dominant)+' dominant' : '';
  h += '<div class="momentum-basis">'+basisNote+domNote+'</div>';
  h += '</div></div>';

  // Scoring + Placed Balls
  h += '<div class="stat-section"><div class="stat-section-title">Scoring</div><div class="stat-card">';
  h += '<div class="stat-big">'+goalCount+'-'+displayPts+' <span style="font-size:15px;font-weight:500;color:var(--t2);">('+totalPts+'pts)</span></div>';
  h += '<div class="stat-big-sub">'+totalScoreActions+' score'+(totalScoreActions!==1?'s':'')+' from '+totalAttempts+' attempt'+(totalAttempts!==1?'s':'')+' &mdash; '+scorePct+'% conversion</div>';
  if (totalAttempts > 0) {
    const bt = totalAttempts;
    const gw = goalCount/bt*100, tw = twoPtCount/bt*100, pw = ptCount/bt*100, ww = wideCount/bt*100;
    h += '<div class="stat-attempt-bar">';
    if (gw > 0) h += '<div class="stat-attempt-seg" style="width:'+gw+'%;background:'+TEAM_US_COLOR+';"></div>';
    if (tw > 0) h += '<div class="stat-attempt-seg" style="width:'+tw+'%;background:#D97706;"></div>';
    if (pw > 0) h += '<div class="stat-attempt-seg" style="width:'+pw+'%;background:#C8CAC4;"></div>';
    if (ww > 0) h += '<div class="stat-attempt-seg" style="width:'+ww+'%;background:#9E9E9E;"></div>';
    h += '</div>';
    h += '<div class="stat-legend">';
    if (goalCount > 0)  h += '<span class="stat-legend-item"><span class="stat-legend-dot" style="background:'+TEAM_US_COLOR+';"></span>'+goalCount+' goal'+(goalCount!==1?'s':'')+'</span>';
    if (twoPtCount > 0) h += '<span class="stat-legend-item"><span class="stat-legend-dot" style="background:#D97706;"></span>'+twoPtCount+' 2-ptr'+(twoPtCount!==1?'s':'')+'</span>';
    if (ptCount > 0)    h += '<span class="stat-legend-item"><span class="stat-legend-dot" style="background:#C8CAC4;border:.5px solid var(--b);"></span>'+ptCount+' point'+(ptCount!==1?'s':'')+'</span>';
    if (wideCount > 0)  h += '<span class="stat-legend-item"><span class="stat-legend-dot" style="background:#9E9E9E;"></span>'+wideCount+' wide'+(wideCount!==1?'s':'')+'</span>';
    h += '</div>';
  }
  if (placedAttempts > 0) {
    h += '<div style="border-top:.5px solid var(--b);margin:12px 0 10px;"></div>';
    h += '<div class="stat-sub-hdr" style="margin-top:0;">Placed Balls</div>';
    const ringGrad = 'conic-gradient('+TEAM_US_COLOR+' '+placedPct+'%, var(--bg3) 0%)';
    h += '<div class="stat-ring-wrap">';
    h += '<div class="stat-ring" style="background:'+ringGrad+';">';
    h += '<div class="stat-ring-inner"><div class="stat-ring-pct">'+placedPct+'%</div><div class="stat-ring-lbl">conv.</div></div>';
    h += '</div>';
    h += '<div style="flex:1;">';
    h += '<div style="font-size:16px;font-weight:700;color:'+TEAM_US_COLOR+';line-height:1.2;">'+placedScoreCount+' converted</div>';
    h += '<div style="font-size:12px;color:var(--t2);margin-top:2px;">from '+placedAttempts+' attempt'+(placedAttempts!==1?'s':'')+'</div>';
    if (placedWides > 0) h += '<div style="font-size:12px;color:var(--t2);margin-top:6px;">'+placedWides+' placed ball wide'+(placedWides!==1?'s':'')+'</div>';
    h += '</div></div>';
  }
  h += '</div></div>';

  // Player Scoring
  const scorers = getScorers(pstats);
  if (scorers.length > 0) {
    h += '<div class="stat-section"><div class="stat-section-title">Player Scoring</div><div class="stat-card">';
    scorers.forEach(p => {
      const g = p.gPlay+p.gPlaced, pts = p.pPlay+p.pPlaced, total = g*3+pts;
      h += html`<div class="stat-prow"><div class="stat-pname">${p.name}</div>`;
      h += '<div class="stat-ptags">';
      if (g > 0 || pts > 0) h += `<span class="stat-tag green">${g}-${pts} (${total})</span>`;
      if (p.wides > 0) h += `<span class="stat-tag grey">${p.wides} wide${p.wides!==1?'s':''}</span>`;
      h += '</div></div>';
    });
    h += '</div></div>';
  }

  // Shot Map
  if (state.trackShotLocations) {
    const smHtml = buildShotMapHTML();
    if (smHtml) h += smHtml;
  }

  // Turnovers
  if (totalTurnovers > 0) {
    const wonPct = Math.round(turnoversWon / totalTurnovers * 100);
    h += '<div class="stat-section"><div class="stat-section-title">Turnovers</div><div class="stat-card">';
    h += '<div style="display:flex;gap:12px;align-items:center;padding:4px 0 10px;">';
    h += '<div style="flex:1;text-align:center;"><div style="font-size:24px;font-weight:700;color:'+TEAM_US_COLOR+';line-height:1;">'+turnoversWon+'</div><div style="font-size:11px;color:var(--t2);margin-top:2px;">Won</div></div>';
    h += '<div style="flex:1;text-align:center;"><div style="font-size:24px;font-weight:700;color:'+TEAM_OPP_COLOR+';line-height:1;">'+turnoversLost+'</div><div style="font-size:11px;color:var(--t2);margin-top:2px;">Lost</div></div>';
    h += '</div>';
    h += '<div class="stat-split-bar"><div class="stat-split-won" style="width:'+wonPct+'%"></div></div>';
    h += '<div class="stat-split-labels"><span style="color:'+TEAM_US_COLOR+';font-weight:600;">'+wonPct+'% won</span><span style="color:'+TEAM_OPP_COLOR+';font-weight:600;">'+(100-wonPct)+'% lost</span></div>';
    const twPlayers = Object.values(pstats).filter(p=>p.twon+p.tlost>0).sort((a,b)=>(b.twon-b.tlost)-(a.twon-a.tlost)||a.name.localeCompare(b.name));
    if (twPlayers.length) {
      h += '<div style="border-top:.5px solid var(--b);margin-top:10px;padding-top:6px;">';
      twPlayers.forEach(p => {
        h += html`<div class="stat-prow"><div class="stat-pname">${p.name}</div><div class="stat-ptags">`;
        if (p.twon  > 0) h += `<span class="stat-tag green">+${p.twon}</span>`;
        if (p.tlost > 0) h += `<span class="stat-tag red">-${p.tlost}</span>`;
        h += '</div></div>';
        if (state.trackTurnovers) {
          const wonSecs  = Object.entries(p.twonSec).sort((a,b)=>b[1]-a[1]);
          const lostSecs = Object.entries(p.tlostSec).sort((a,b)=>b[1]-a[1]);
          if (wonSecs.length || lostSecs.length) {
            h += '<div style="display:flex;gap:6px;flex-wrap:wrap;padding:2px 0 6px 2px;">';
            wonSecs.forEach(([cat,n])  => h += `<span class="stat-tag green" style="font-size:10px;">${esc(cat)}${n>1?' ×'+n:''}</span>`);
            lostSecs.forEach(([cat,n]) => h += `<span class="stat-tag red"   style="font-size:10px;">${esc(cat)}${n>1?' ×'+n:''}</span>`);
            h += '</div>';
          }
        }
      });
      h += '</div>';
    }
    // Donut charts — only when detailed tracking is on and there is categorised data
    if (state.trackTurnovers) {
      const wonEntries  = Object.entries(wonCategories);
      const lostEntries = Object.entries(lostCategories);
      if (wonEntries.length || lostEntries.length) {
        const WON_COLORS  = {'First to the Ball':'#1B5E20','Tackle Turnover':'#388E3C','Block':'#66BB6A','Hook':'#00897B','Defensive Pressure':'#A5D6A7'};
        const LOST_COLORS = {'Poor Pass':'#B71C1C','Lost in Tackle':CARD_RED,'Second to the Ball':'#EF9A9A','Over Played':'#E65100','Isolated':'#FFAB91'};
        h += '<div style="border-top:.5px solid var(--b);margin-top:12px;padding-top:12px;display:flex;gap:8px;justify-content:space-around;flex-wrap:wrap;">';
        if (wonEntries.length)  h += buildTurnoverDonut('Won by type',  wonEntries,  WON_COLORS,  TEAM_US_COLOR);
        if (lostEntries.length) h += buildTurnoverDonut('Lost by type', lostEntries, LOST_COLORS, TEAM_OPP_COLOR);
        h += '</div>';
      }
    }
    h += '</div></div>';
  }

  // Frees Won
  if (freesWon > 0) {
    const fwPlayers = Object.values(pstats).filter(p=>p.freesWon>0).sort((a,b)=>b.freesWon-a.freesWon||a.name.localeCompare(b.name));
    h += '<div class="stat-section"><div class="stat-section-title">Frees Won</div><div class="stat-card">';
    h += '<div style="padding:4px 0 10px;text-align:center;"><div style="font-size:32px;font-weight:700;color:'+TEAM_US_COLOR+';line-height:1;">'+freesWon+'</div><div style="font-size:11px;color:var(--t2);margin-top:3px;">frees won in match</div></div>';
    if (fwPlayers.length > 0) {
      h += '<div style="border-top:.5px solid var(--b);padding-top:6px;">';
      fwPlayers.forEach(p => { h += html`<div class="stat-prow"><div class="stat-pname">${p.name}</div><div class="stat-ptags"><span class="stat-tag green">${p.freesWon}</span></div></div>`; });
      h += '</div>';
    }
    h += '</div></div>';
  }

  // Restarts
  const rstLabel = state.sport === 'hurling' ? 'Puck Out' : 'Kickout';
  h += '<div class="stat-section"><div class="stat-section-title">Restarts</div><div class="stat-card">';
  h += rstBlock('Own '+rstLabel+'s', ownWon, ownLost, ownUnclear, ownTotal);
  h += '<div style="border-top:.5px solid var(--b);margin:6px 0 10px;"></div>';
  h += rstBlock('Opposition '+rstLabel+'s', oppWon, oppLost, oppUnclear, oppTotal);
  h += '</div></div>';

  // Goalkeeper Performance
  const gkStatHtml = buildGKStatHTML();
  if (gkStatHtml) h += gkStatHtml;

  // Opposition Scoring Profile
  const oscHtml = buildOppScorerHTML();
  if (oscHtml) h += oscHtml;

  // Discipline
  const discPlayers = getDiscPlayers(pstats);
  const slCards = state.sidelineCards || [];
  if (discPlayers.length > 0 || freesConc > 0 || slCards.length > 0) {
    h += '<div class="stat-section"><div class="stat-section-title">Discipline</div>';
    if (freesConc > 0) {
      h += '<div style="display:flex;gap:16px;padding:4px 0 10px;align-items:baseline;">';
      h += `<span style="font-size:13px;color:var(--t2);">Frees conceded: <strong style="color:var(--t1);">${freesConc}</strong></span>`;
      if (freesScored > 0) h += `<span style="font-size:13px;color:${TEAM_OPP_COLOR};font-weight:600;">${freesScored} scored by opposition</span>`;
      h += '</div>';
    }
    if (discPlayers.length > 0) {
      h += '<div class="stat-card">';
      discPlayers.forEach(p => {
        const freeTotal = Object.values(p.frees).reduce((s,n)=>s+n,0);
        h += '<div class="disc-row">';
        if (p.yc+p.bc+p.rc > 0) {
          const _syc=p.syc||0, _syY=p.yc-2*_syc;
          h += '<span style="display:flex;gap:3px;flex-shrink:0;align-items:center;">';
          for (let i=0;i<_syY;i++) h += `<span class="disc-chip" style="background:${CARD_YELLOW};" title="Yellow Card"></span>`;
          for (let i=0;i<_syc;i++) h += `<span style="display:inline-flex;gap:1px;align-items:center;" title="Second Yellow → Off"><span class="disc-chip" style="background:${CARD_YELLOW};"></span><span class="disc-chip" style="background:${CARD_YELLOW};"></span><span style="font-size:9px;color:var(--t3);margin:0 1px;">→</span><span class="disc-chip" style="background:${CARD_RED};"></span></span>`;
          for (let i=0;i<p.bc;i++) h += `<span class="disc-chip" style="background:${CARD_BLACK};" title="Black Card"></span>`;
          for (let i=0;i<p.rc;i++) h += `<span class="disc-chip" style="background:${CARD_RED};" title="Red Card"></span>`;
          h += '</span>';
        }
        h += html`<span class="stat-pname" style="flex:1;">${p.name}</span>`;
        if (freeTotal > 0) {
          h += '<span class="stat-ptags">';
          h += `<span class="stat-tag grey">${freeTotal} free${freeTotal!==1?'s':''}</span>`;
          Object.entries(p.frees).sort((a,b)=>b[1]-a[1]).forEach(([type,n]) => {
            h += `<span class="stat-tag grey">${esc(type)}${n>1?' ×'+n:''}</span>`;
          });
          h += '</span>';
        }
        h += '</div>';
      });
      h += '</div>';
    }
    if (slCards.length > 0) {
      h += '<div class="stat-card" style="margin-top:10px;">';
      h += '<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--t3);margin-bottom:8px;">Sideline</div>';
      slCards.forEach(sc => {
        h += '<div class="disc-row">';
        if (sc.type !== 'AdvFree') {
          const bg = sc.type === 'Yellow' ? CARD_YELLOW : CARD_RED;
          h += `<span class="disc-chip" style="background:${bg};${sc.type==='Yellow'?'border:.5px solid rgba(0,0,0,.15);':''}" title="${sc.type} Card"></span>`;
        } else {
          h += `<span class="stat-tag" style="background:#FEF3C7;color:#92400E;font-size:10px;padding:1px 5px;">Adv Free</span>`;
        }
        h += html`<span class="stat-pname" style="flex:1;">${sc.name||'Coach/Manager'}</span>`;
        h += `<span style="font-size:11px;color:var(--t3);">${esc(sc.time)}</span>`;
        h += '</div>';
      });
      h += '</div>';
    }
    h += '</div>';
  }

  // Substitutions
  h += buildSubTableHTML();

  // Play Time
  h += buildPlayTimeHTML();

  return h;
}

// ─── SHOT MAP ─────────────────────────────────────────────────────────────────
function buildShotMapHTML() {
  const shotActs = new Set(['Goal','Point','2 Point','Wide','Short','Saved']);
  let inH2 = false;
  const shots = [];
  state.evts.forEach(ev => {
    if (ev.badge === '1H') { if ((ev.desc||'').includes('ended')) inH2 = true; return; }
    if (!shotActs.has(ev.action) || !ev.zone) return;
    const pi = ev.pi != null ? ev.pi : (ev.slot != null ? state.slotp[ev.slot] : null);
    shots.push({ action: ev.action, zone: ev.zone, team: ev.slot != null ? 'us' : 'opp', half: inH2 ? 'h2' : 'h1', slot: ev.slot != null ? ev.slot : null, pi, placed: PLACED_BALL.has(ev.sec), sec: ev.sec });
  });

  if (shots.length === 0) return '';

  const seenPi = new Set();
  const playerList = [];
  shots.forEach(s => { if (s.pi != null && !seenPi.has(s.pi)) { seenPi.add(s.pi); playerList.push(s.pi); } });
  playerList.sort((a,b) => a - b);

  if (shotMapPlayerFilter !== 'all' && !seenPi.has(Number(shotMapPlayerFilter))) shotMapPlayerFilter = 'all';

  const filtered = shots.filter(s => {
    if (shotMapHalfFilter !== 'all' && s.half !== shotMapHalfFilter) return false;
    if (shotMapPlayerFilter !== 'all' && String(s.pi) !== String(shotMapPlayerFilter)) return false;
    return true;
  });

  const { dots, thirds } = computeShotDots(filtered, pi => esc(gi(pi)));
  const svg = `<svg viewBox="0 0 320 400" xmlns="http://www.w3.org/2000/svg" style="width:100%;border-radius:8px;" preserveAspectRatio="xMidYMid meet">${PITCH_SVG_INNER}${dots}</svg>`;

  const hChip = (val,label) => `<button class="zone-chip${shotMapHalfFilter===val?' active':''}" onclick="setShotMapFilter('half','${val}')">${label}</button>`;
  const pChip = (val,label) => `<button class="zone-chip${String(shotMapPlayerFilter)===String(val)?' active':''}" onclick="setShotMapFilter('player','${val}')">${label}</button>`;

  let h = '<div id="shot-map-section" class="stat-section">';
  h += '<div class="stat-section-title">Shot Map</div>';
  h += '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px;">';
  h += hChip('all','Full Match')+hChip('h1','H1')+hChip('h2','H2');
  h += '</div>';
  if (playerList.length > 0) {
    h += '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px;">';
    h += pChip('all','All');
    playerList.forEach(pi => { h += pChip(pi, esc(gi(pi))); });
    h += '</div>';
  }
  h += `<div style="border-radius:8px;overflow:hidden;margin-bottom:8px;">${svg}</div>`;
  h += '<div style="display:flex;gap:14px;flex-wrap:wrap;margin-bottom:10px;font-size:12px;color:var(--t2);align-items:center;">';
  h += '<span style="display:flex;align-items:center;gap:4px;"><svg width="12" height="12"><circle cx="6" cy="6" r="5" fill="'+TEAM_US_COLOR+'" opacity=".82"/></svg>Score</span>';
  h += '<span style="display:flex;align-items:center;gap:4px;"><svg width="12" height="12"><circle cx="6" cy="6" r="5" fill="'+TEAM_OPP_COLOR+'" opacity=".82"/></svg>Wide</span>';
  h += '<span style="display:flex;align-items:center;gap:4px;"><svg width="12" height="12"><circle cx="6" cy="6" r="5" fill="#9E9E9E" opacity=".82"/></svg>Short</span>';
  h += '<span style="display:flex;align-items:center;gap:4px;"><svg width="12" height="12"><circle cx="6" cy="6" r="5" fill="#F97316" opacity=".82"/></svg>Saved</span>';
  h += '<span style="display:flex;align-items:center;gap:4px;"><svg width="14" height="14"><circle cx="7" cy="7" r="6" fill="'+TEAM_US_COLOR+'" opacity=".82" stroke="white" stroke-width="1"/></svg>Goal</span>';
  h += '<span style="display:flex;align-items:center;gap:4px;"><svg width="18" height="18"><circle cx="9" cy="9" r="8" fill="none" stroke="'+TEAM_US_COLOR+'" stroke-width="1.5" opacity=".7"/><circle cx="9" cy="9" r="5" fill="'+TEAM_US_COLOR+'" opacity=".82" stroke="white" stroke-width="1"/></svg>Placed</span>';
  h += '</div>';

  const thirdRows = [['Attacking third',thirds.att],['Middle third',thirds.mid],['Defensive third',thirds.def]];
  const hasData = thirdRows.some(([,d]) => d.shots > 0);
  if (hasData) {
    h += '<table style="width:100%;font-size:12px;border-collapse:collapse;">';
    h += '<tr style="color:var(--t3);font-size:11px;"><th style="text-align:left;padding:4px 0;font-weight:500;">Zone</th><th style="text-align:center;font-weight:500;">Shots</th><th style="text-align:center;font-weight:500;">Scores</th><th style="text-align:center;font-weight:500;">Conv%</th></tr>';
    thirdRows.forEach(([label,d]) => {
      if (d.shots === 0) return;
      h += `<tr><td style="padding:3px 0;color:var(--t2);">${label}</td><td style="text-align:center;color:var(--t1);">${d.shots}</td><td style="text-align:center;color:var(--t1);">${d.scores}</td><td style="text-align:center;font-weight:600;color:var(--ti);">${pct(d.scores,d.shots)}</td></tr>`;
    });
    h += '</table>';
  }

  h += '</div>';
  return h;
}

function setShotMapFilter(key, val) {
  if (key === 'half') shotMapHalfFilter = val;
  if (key === 'player') shotMapPlayerFilter = val;
  const section = document.getElementById('shot-map-section');
  if (section) section.outerHTML = buildShotMapHTML();
}

// ─── TEAM ASSESSMENT ──────────────────────────────────────────────────────────
const _ASSESS_DIMS = [
  { key:'effort',     label:'Effort',     desc:'Workrate, hunger, off-the-ball running' },
  { key:'skill',      label:'Skill',      desc:'Basics: passing, kicking, first touch' },
  { key:'tactics',    label:'Tactics',    desc:'Shape, gameplan, set-piece execution' },
  { key:'intensity',  label:'Intensity',  desc:'Physicality, tackling, ball-winning' },
  { key:'discipline', label:'Discipline', desc:'Composure, frees conceded, cards' },
  { key:'spirit',     label:'Spirit',     desc:'Attitude, response to setbacks' },
];
const _ASSESS_COLOURS = ['#C8E6C9','#81C784','#4CAF50','#388E3C','#1B5E20'];

function assessRate(key, val) {
  if (!state.teamAssessment) state.teamAssessment = { effort:0, skill:0, tactics:0, intensity:0, discipline:0, spirit:0, notes:'' };
  state.teamAssessment[key] = (state.teamAssessment[key] === val) ? 0 : val;
  saveState();
  renderAssessment();
}

function renderAssessment() {
  if (!state.teamAssessment) state.teamAssessment = { effort:0, skill:0, tactics:0, intensity:0, discipline:0, spirit:0, notes:'' };
  const ta = state.teamAssessment;
  const rated = _ASSESS_DIMS.filter(d => (ta[d.key] || 0) > 0);
  const avg   = rated.length > 0
    ? (rated.reduce((s, d) => s + ta[d.key], 0) / rated.length).toFixed(1)
    : null;

  let h = '<div class="assess-wrap"><div class="assess-q">How did the team perform?</div>';
  h += '<div class="assess-card">';
  _ASSESS_DIMS.forEach((dim, i) => {
    const val = ta[dim.key] || 0;
    const border = i < _ASSESS_DIMS.length - 1 ? ' assess-row-border' : '';
    h += `<div class="assess-row${border}"><div class="assess-row-info">`;
    h += `<div class="assess-dim-name">${esc(dim.label)}</div>`;
    h += `<div class="assess-dim-desc">${esc(dim.desc)}</div></div>`;
    h += '<div class="assess-dots">';
    for (let v = 1; v <= 5; v++) {
      const colour = v <= val ? _ASSESS_COLOURS[v - 1] : '#D5D5D5';
      const sel    = v === val ? ' assess-dot-sel' : '';
      h += `<div class="assess-dot${sel}" style="background:${colour};" onclick="assessRate('${dim.key}',${v})"></div>`;
    }
    h += '</div></div>';
  });
  h += '</div>';

  h += '<div class="assess-card assess-notes-card">';
  h += '<div class="assess-notes-label">Coach notes (optional)</div>';
  h += `<textarea class="assess-notes-input" rows="3" placeholder="A line or two on the match — anything you’ll want to remember in 6 weeks…" oninput="if(!state.teamAssessment)state.teamAssessment={};state.teamAssessment.notes=this.value;saveState()">${esc(ta.notes || '')}</textarea>`;
  h += '</div>';

  h += '<div class="assess-card assess-overall-card">';
  h += '<div><div class="assess-overall-lbl">Overall rating</div>';
  const dimWord = rated.length === 1 ? 'dimension' : 'dimensions';
  h += `<div class="assess-overall-sub">Average of ${rated.length} ${dimWord} rated</div></div>`;
  h += `<div class="assess-overall-val">${avg !== null ? avg + '<span>/5</span>' : '—'}</div>`;
  h += '</div>';

  h += '</div>';

  // eslint-disable-next-line no-restricted-syntax -- safe: all user data passed through esc()
  document.getElementById('assess-content').innerHTML = h;
}

/* ── print.js ── */
'use strict';

// ─── PRINT ────────────────────────────────────────────────────────────────────
function buildPrintTimelineHTML() {
  let usG=0,usP=0,oppG=0,oppP=0,halfSecs=0,inH2=false;
  const data = [{secs:0,us:0,opp:0}];
  const subs=[], reds=[], blacks=[], markers=[];

  state.evts.forEach(ev => {
    let t = toSeconds(ev.time);
    if (ev.badge==='1H') { halfSecs=t; return; }
    if (ev.badge==='2H') { inH2=true; return; }
    if (inH2) t += halfSecs;
    const sc = {usG, usP, oppG, oppP};
    const prevUs=usG*3+usP, prevOpp=oppG*3+oppP;
    const _res = applyScoreBadge(ev, sc, state.oppN);
    const mType = _res ? _res.mType : null, mTeam = _res ? _res.mTeam : 'us';
    ({usG, usP, oppG, oppP} = sc);
    if (!_res) {
      if      (ev.action === 'sub')        subs.push({secs:t});
      else if (ev.action === 'Red Card')   reds.push({secs:t});
      else if (ev.action === 'Black Card') blacks.push({secs:t});
    }
    const curUs=usG*3+usP, curOpp=oppG*3+oppP;
    const placed = isPlacedBall(ev);
    if (mType) markers.push({secs:t, team:mTeam, type:mType, usScore:curUs, oppScore:curOpp, placed});
    if (curUs!==prevUs||curOpp!==prevOpp||mType==='Wide') data.push({secs:t,us:curUs,opp:curOpp});
  });

  if (data.length < 2) return '';
  const totalSecs = Math.max(data[data.length-1].secs, halfSecs||1);
  data.push({secs:totalSecs, us:usG*3+usP, opp:oppG*3+oppP});
  const maxPts = Math.max(...data.map(d=>Math.max(d.us,d.opp)),1);

  const W=560,H=120,PL=28,PR=10,PT=10,PB=22;
  const cw=W-PL-PR, ch=H-PT-PB;
  const x=s=>(PL+(s/totalSecs)*cw).toFixed(1);
  const y=p=>(PT+ch-(p/maxPts)*ch).toFixed(1);
  const usLine  = data.map(d=>x(d.secs)+','+y(d.us)).join(' ');
  const oppLine = data.map(d=>x(d.secs)+','+y(d.opp)).join(' ');
  const yMid=Math.round(maxPts/2);

  let svg=`<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="width:100%;display:block;">`;
  svg+=`<line x1="${PL}" y1="${PT+ch}" x2="${PL+cw}" y2="${PT+ch}" stroke="#E2E4DE" stroke-width="1"/>`;
  svg+=`<text x="${PL-4}" y="${parseFloat(y(0))+4}" text-anchor="end" font-size="9" fill="#9A9E99">0</text>`;
  svg+=`<text x="${PL-4}" y="${parseFloat(y(yMid))+4}" text-anchor="end" font-size="9" fill="#9A9E99">${yMid}</text>`;
  svg+=`<text x="${PL-4}" y="${parseFloat(y(maxPts))+4}" text-anchor="end" font-size="9" fill="#9A9E99">${maxPts}</text>`;
  svg+=`<text x="${PL}" y="${H-4}" text-anchor="middle" font-size="9" fill="#9A9E99">0'</text>`;
  if (halfSecs>0) {
    svg+=`<line x1="${x(halfSecs)}" y1="${PT}" x2="${x(halfSecs)}" y2="${PT+ch}" stroke="#9A9E99" stroke-width="1" stroke-dasharray="3 2"/>`;
    svg+=`<text x="${x(halfSecs)}" y="${H-4}" text-anchor="middle" font-size="9" fill="#9A9E99">HT</text>`;
  }
  svg+=`<text x="${x(totalSecs)}" y="${H-4}" text-anchor="middle" font-size="9" fill="#9A9E99">${Math.round(totalSecs/60)}'</text>`;
  subs.forEach(e   => { const sx=x(e.secs); svg+=`<line x1="${sx}" y1="${PT}" x2="${sx}" y2="${PT+ch}" stroke="#F59E0B" stroke-width="1.5" stroke-dasharray="2 2"/>`; });
  reds.forEach(e   => { const sx=x(e.secs); svg+=`<line x1="${sx}" y1="${PT}" x2="${sx}" y2="${PT+ch}" stroke="${CARD_RED}" stroke-width="1.5" stroke-dasharray="2 2"/>`; });
  blacks.forEach(e => { const sx=x(e.secs); svg+=`<line x1="${sx}" y1="${PT}" x2="${sx}" y2="${PT+ch}" stroke="${CARD_BLACK}" stroke-width="1.5" stroke-dasharray="2 2"/>`; });
  svg+=`<polyline points="${oppLine}" fill="none" stroke="${TEAM_OPP_COLOR}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;
  svg+=`<polyline points="${usLine}"  fill="none" stroke="${TEAM_US_COLOR}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;
  markers.forEach(m => {
    const cx=x(m.secs), cy=y(m.team==='us'?m.usScore:m.oppScore);
    const mcol=m.team==='us'?TEAM_US_COLOR:TEAM_OPP_COLOR;
    const dotCol=m.type==='Wide'?'#9E9E9E':m.type==='2 Point'?'#F59E0B':mcol;
    const dotR=m.type==='Goal'?4:m.type==='2 Point'?3.5:m.type==='Point'?3.5:2.5;
    if(m.placed)svg+=`<circle cx="${cx}" cy="${cy}" r="${dotR+3.5}" fill="none" stroke="${dotCol}" stroke-width="1.5" opacity="0.7"/>`;
    if      (m.type==='Goal')    svg+=`<circle cx="${cx}" cy="${cy}" r="4"   fill="${TEAM_US_COLOR}" stroke="#fff" stroke-width="1.5"/>`;
    else if (m.type==='2 Point') svg+=`<circle cx="${cx}" cy="${cy}" r="3.5" fill="#F59E0B" stroke="#fff" stroke-width="1.5"/>`;
    else if (m.type==='Point')   svg+=`<circle cx="${cx}" cy="${cy}" r="3.5" fill="#fff"    stroke="#9A9E99" stroke-width="1.5"/>`;
    else if (m.type==='Wide')    svg+=`<circle cx="${cx}" cy="${cy}" r="2.5" fill="#9E9E9E" stroke="none"/>`;
  });
  svg+='</svg>';

  let h=svg;
  h+=`<div style="display:flex;gap:20px;justify-content:center;margin-top:6px;font-size:11px;color:#6B6F66;flex-wrap:wrap;">`;
  h+=html`<span style="display:flex;align-items:center;gap:5px;"><span style="display:inline-block;width:18px;height:2px;background:${TEAM_US_COLOR};border-radius:1px;vertical-align:middle;"></span>${state.usN}</span>`;
  h+=html`<span style="display:flex;align-items:center;gap:5px;"><span style="display:inline-block;width:18px;height:2px;background:${TEAM_OPP_COLOR};border-radius:1px;vertical-align:middle;"></span>${state.oppN}</span>`;
  if (subs.length)   h+=`<span style="display:flex;align-items:center;gap:5px;"><span style="display:inline-block;width:14px;height:0;border-top:2px dashed #F59E0B;vertical-align:middle;"></span>Sub</span>`;
  if (reds.length)   h+=`<span style="display:flex;align-items:center;gap:5px;"><span style="display:inline-block;width:14px;height:0;border-top:2px dashed ${CARD_RED};vertical-align:middle;"></span>Red</span>`;
  if (blacks.length) h+=`<span style="display:flex;align-items:center;gap:5px;"><span style="display:inline-block;width:14px;height:0;border-top:2px dashed ${CARD_BLACK};vertical-align:middle;"></span>Black</span>`;
  h+=`</div>`;
  return h;
}

function buildPrintLineupHTML() {
  const layout = GRID_LAYOUTS[state.teamSize] || GRID_LAYOUTS[15];
  const prTitle = (text) => '<div style="font-size:11px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:#1F1F1F;margin-bottom:10px;padding:3px 0 3px 9px;border-left:3px solid '+TEAM_US_COLOR+';">'+text+'</div>';

  const snapSlotp   = state.startSlotp   || state.slotp;
  const snapCaptain = state.startCaptain != null ? state.startCaptain : state.captain;

  const shirt = (num, bg, numColor, size) => {
    const s = size || 36;
    return `<svg width="${s}" height="${s}" viewBox="0 0 36 36" style="display:block;">
      <path d="M4,8 L10,4 Q13,2 14,6 Q18,10 22,6 Q23,2 26,4 L32,8 L28,14 L25,12 L25,32 L11,32 L11,12 L8,14 Z"
            fill="${bg}" stroke="rgba(0,0,0,0.12)" stroke-width="0.8"/>
      <text x="18" y="24" text-anchor="middle" font-size="10" font-weight="700"
            fill="${numColor}" font-family="-apple-system,BlinkMacSystemFont,sans-serif">${num}</text>
    </svg>`;
  };

  let formation = '';
  formation += '<div style="display:flex;flex-direction:column;gap:10px;align-items:center;padding:4px 0 14px;">';
  layout.forEach(row => {
    formation += '<div style="display:flex;gap:10px;">';
    row.forEach(slot => {
      const pi = snapSlotp ? (snapSlotp[slot] || slot) : slot;
      const name = gn(pi) || '';
      const isCap = snapCaptain === slot;
      const isGK = slot === 1;
      const bg = isGK ? CARD_YELLOW : TEAM_US_COLOR;
      const numCol = isGK ? TEAM_US_COLOR : '#ffffff';
      formation += '<div style="display:flex;flex-direction:column;align-items:center;width:48px;">';
      formation += '<div style="position:relative;width:34px;height:34px;">';
      formation += shirt(pi, bg, numCol, 34);
      if (isCap) formation += '<span style="position:absolute;top:-3px;right:-3px;background:#fff;border:1px solid #E2E4DE;border-radius:50%;width:12px;height:12px;font-size:7px;font-weight:700;color:'+TEAM_US_COLOR+';display:flex;align-items:center;justify-content:center;line-height:1;">C</span>';
      formation += '</div>';
      formation += html`<div style="font-size:7.5px;font-weight:600;color:#1F1F1F;text-align:center;margin-top:2px;line-height:1.25;word-break:break-word;">${name||'—'}</div>`;
      formation += '</div>';
    });
    formation += '</div>';
  });
  formation += '</div>';

  // Exclude any bench player who started (pre-game sub)
  const startingPis = new Set(Object.values(snapSlotp).map(Number));
  const subs = [];
  for (let i = 16; i <= (state.maxB || 16); i++) {
    const n = gn(i);
    if (n && !startingPis.has(i)) subs.push({idx:i, name:n});
  }
  // Include pre-game replaced players (still part of the squad)
  Object.values(state.preGameSubs || {}).forEach(pi => {
    const n = gn(pi);
    if (n) subs.push({idx:pi, name:n});
  });
  if (subs.length > 0) {
    formation += '<div style="padding-top:8px;border-top:1px solid #E2E4DE;">';
    formation += prTitle('Subs');
    formation += '<div style="display:flex;flex-wrap:wrap;gap:6px;">';
    subs.forEach(s => {
      formation += '<div style="display:flex;flex-direction:column;align-items:center;width:40px;">';
      formation += '<div style="position:relative;width:26px;height:26px;">'+shirt(s.idx,'#9E9E9E','#fff',26)+'</div>';
      formation += html`<div style="font-size:7px;color:#1F1F1F;text-align:center;margin-top:2px;line-height:1.25;word-break:break-word;">${s.name}</div>`;
      formation += '</div>';
    });
    formation += '</div></div>';
  }

  // Right column: personnel events (subs + cards), ruled fallback if none yet
  const CARD_COLS = {'Yellow Card': CARD_YELLOW, 'Black Card': CARD_BLACK, 'Red Card': CARD_RED};
  const personnelEvts = state.evts.filter(ev => ev.action === 'sub' || ev.action in CARD_COLS);
  let personnelRows = '';
  if (!personnelEvts.length) {
    personnelRows = Array.from({length:14}, () =>
      '<div style="border-bottom:1px solid #E2E4DE;height:22px;"></div>'
    ).join('');
  } else {
    personnelEvts.forEach(ev => {
      const cardColor = CARD_COLS[ev.action];
      personnelRows += '<div style="display:flex;align-items:flex-start;gap:7px;padding:5px 0;border-bottom:1px solid #E2E4DE;">';
      personnelRows += `<span style="font-size:9px;color:#9A9E99;min-width:30px;padding-top:1px;">${ev.time}</span>`;
      if (ev.action === 'sub') {
        personnelRows += '<span style="color:#F59E0B;font-size:11px;line-height:1.3;flex-shrink:0;">&#x21C4;</span>';
      } else {
        personnelRows += `<span style="display:inline-block;width:8px;height:11px;background:${cardColor};border-radius:1px;flex-shrink:0;margin-top:2px;"></span>`;
      }
      personnelRows += html`<span style="font-size:10px;color:#1F1F1F;flex:1;line-height:1.4;">${ev.desc}</span>`;
      personnelRows += '</div>';
    });
  }
  const personnelCol =
    '<div style="flex:1;min-width:0;">' +
      prTitle('Personnel') +
      personnelRows +
    '</div>';

  // Notes — full width below, only rendered when content exists
  const notesSection = state.matchNotes && state.matchNotes.trim()
    ? '<div style="margin-bottom:28px;">' +
        prTitle('Match Notes') +
        html`<div style="font-size:11px;color:#1F1F1F;line-height:1.6;white-space:pre-wrap;">${state.matchNotes.trim()}</div>` +
      '</div>'
    : '';

  let h = '<div style="display:flex;gap:24px;align-items:flex-start;margin-bottom:' + (notesSection ? '16' : '28') + 'px;">';
  h += '<div style="flex:1;min-width:0;">';
  h += prTitle(html`Starting Line-up — ${state.usN}`);
  h += formation;
  h += '</div>';
  h += personnelCol;
  h += '</div>';
  h += notesSection;
  return h;
}

function buildPrintHTML() {
  const {
    pstats, wonCategories, lostCategories,
    goalCount, ptCount, twoPtCount, wideCount,
    placedGoals, placedPts, placedTwoPts, placedWides,
    turnoversWon, turnoversLost, freesWon,
    ownWon, ownLost, ownUnclear, oppWon, oppLost, oppUnclear,
    freesConc, freesScored,
  } = aggregateMatchStats(state.evts, state.trackTurnovers, state.slotp, pl);

  const totalScoreActions = goalCount + ptCount + twoPtCount;
  const totalAttempts = totalScoreActions + wideCount;
  const scorePct = totalAttempts > 0 ? Math.round(totalScoreActions / totalAttempts * 100) : 0;
  const totalPts = goalCount*3 + ptCount + twoPtCount*2;
  const displayPts = ptCount + twoPtCount*2;
  const placedScoreCount = placedGoals + placedPts + placedTwoPts;
  const placedAttempts = placedScoreCount + placedWides;
  const placedPct = placedAttempts > 0 ? Math.round(placedScoreCount / placedAttempts * 100) : 0;
  const rstLabel = state.sport === 'hurling' ? 'Puck Out' : 'Kickout';
  const totalTurnovers = turnoversWon + turnoversLost;
  const ownTotal = ownWon + ownLost + ownUnclear;
  const oppTotal = oppWon + oppLost + oppUnclear;

  const scorers = getScorers(pstats);
  const discPlayers = getDiscPlayers(pstats);

  const usScore = state.goals+'-'+state.pts+' ('+((state.goals*3)+state.pts)+'pts)';
  const oppScore = state.og+'-'+state.op_+' ('+(state.og*3+state.op_)+'pts)';
  const matchDate = matchDisplayDate().toLocaleDateString('en-IE',{day:'numeric',month:'long',year:'numeric'});

  const usClub   = findClub(state.usN);
  const oppClub  = findClub(state.oppN);
  const oppPair  = findAmalgamPair(state.oppN);
  const venuePitch = state.location || usClub?.pitch || oppClub?.pitch || '';

  const crestImg = (src, label) => {
    if (!src) return '';
    return `<img src="${esc(src)}" alt="${esc(label)}" style="width:44px;height:44px;object-fit:contain;flex-shrink:0;" onerror="this.style.display='none'">`;
  };
  const crestImgPair = (src1, src2, label) => {
    const n = esc(label);
    return '<div style="position:relative;width:44px;height:44px;flex-shrink:0;">'
      + `<img src="${esc(src1)}" alt="${n}" style="position:absolute;top:0;left:0;width:28px;height:28px;object-fit:contain;" onerror="this.style.display='none'">`
      + `<img src="${esc(src2)}" alt="${n}" style="position:absolute;bottom:0;right:0;width:32px;height:32px;object-fit:contain;" onerror="this.style.display='none'">`
      + '</div>';
  };

  const usCrest    = usClub?.crest || findCountyCrest(state.usN) || '';
  const oppCrestEl = oppPair
    ? crestImgPair(oppPair[0].crest, oppPair[1].crest, state.oppN)
    : crestImg(oppClub?.crest || findCountyCrest(state.oppN) || '', state.oppN);

  let h = '';

  h += '<div class="pr-hdr">';
  h += '<div class="pr-title">Match Report</div>';
  h += '<div style="display:flex;align-items:center;justify-content:center;gap:12px;">';
  h += crestImg(usCrest, state.usN);
  h += html`<div class="pr-score">${state.usN} ${html.safe(usScore)}<br>${state.oppN} ${html.safe(oppScore)}</div>`;
  h += oppCrestEl;
  h += '</div>';
  h += '<div class="pr-teams">';
  h += '<span>'+matchDate+'</span>';
  if (venuePitch) h += html`<span>${venuePitch}</span>`;
  if (state.referee) h += html`<span>Ref: ${state.referee}</span>`;
  h += '</div>';
  h += '</div>';

  h += buildPrintLineupHTML();

  const timelineHTML = buildPrintTimelineHTML();
  if (timelineHTML) {
    h += '<div class="pr-section pr-break">';
    h += '<div class="pr-section-title">Score Timeline</div>';
    h += '<div class="pr-card">'+timelineHTML+'</div>';
    h += '</div>';
  }

  const {usPct: _usPct, oppPct: _oppPct, momTotal} = calculateMomentum(state.goals, state.pts, state.og, state.op_, ownWon, oppWon, ownLost, oppLost, turnoversWon, turnoversLost);
  if (momTotal > 0) {
    const usPct = _usPct, oppPct = _oppPct;
    const dominant = usPct > oppPct ? state.usN : usPct < oppPct ? state.oppN : null;
    const prBasisNote = (ownTotal+oppTotal > 0 && totalTurnovers > 0) ? 'Scores + restarts + turnovers'
      : (ownTotal+oppTotal > 0) ? 'Scores + restarts won'
      : totalTurnovers > 0 ? 'Scores + turnovers'
      : 'Based on scores';
    h += '<div class="pr-section">';
    h += '<div class="pr-section-title">Momentum</div>';
    h += '<div class="pr-card">';
    h += '<div style="height:10px;border-radius:5px;overflow:hidden;display:flex;margin-bottom:8px;">';
    h += '<div style="width:'+usPct+'%;background:'+TEAM_US_COLOR+';"></div>';
    h += '<div style="flex:1;background:'+TEAM_OPP_COLOR+';"></div>';
    h += '</div>';
    h += '<div style="display:flex;justify-content:space-between;font-size:13px;">';
    h += html`<span style="color:${TEAM_US_COLOR};font-weight:600;">${state.usN} <span style="font-weight:400;">${usPct}%</span></span>`;
    h += html`<span style="color:${TEAM_OPP_COLOR};font-weight:600;">${state.oppN} <span style="font-weight:400;">${oppPct}%</span></span>`;
    h += '</div>';
    if (dominant) h += html`<div style="font-size:11px;color:#6B6F66;margin-top:4px;">${dominant} dominant &mdash; ${html.safe(prBasisNote)}</div>`;
    h += '</div></div>';
  }

  // Scoring + Placed Balls
  h += '<div class="pr-section">';
  h += '<div class="pr-section-title">Scoring</div>';
  h += '<div class="pr-card">';
  h += '<div class="pr-big">'+goalCount+'-'+displayPts+' <span style="font-size:16px;font-weight:500;color:#6B6F66;">('+totalPts+'pts)</span></div>';
  h += '<div class="pr-sub">'+totalScoreActions+' score'+(totalScoreActions!==1?'s':'')+' from '+totalAttempts+' attempt'+(totalAttempts!==1?'s':'')+' — '+scorePct+'% conversion</div>';
  if (goalCount||ptCount||twoPtCount||wideCount) {
    h += '<div style="margin-top:8px;font-size:13px;color:#1F1F1F;">';
    if (goalCount)  h += '<span style="margin-right:14px;">'+goalCount+' goal'+(goalCount!==1?'s':'')+'</span>';
    if (twoPtCount) h += '<span style="margin-right:14px;">'+twoPtCount+' 2-ptr'+(twoPtCount!==1?'s':'')+'</span>';
    if (ptCount)    h += '<span style="margin-right:14px;">'+ptCount+' point'+(ptCount!==1?'s':'')+'</span>';
    if (wideCount)  h += '<span style="color:#6B6F66;">'+wideCount+' wide'+(wideCount!==1?'s':'')+'</span>';
    h += '</div>';
  }
  if (placedAttempts > 0) {
    h += '<div style="border-top:1px solid #E2E4DE;margin:12px 0 10px;"></div>';
    h += '<div style="font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#6B6F66;margin-bottom:8px;">Placed Balls</div>';
    h += '<div class="pr-big" style="font-size:22px;">'+placedPct+'% <span style="font-size:14px;font-weight:500;color:#6B6F66;">conversion</span></div>';
    h += '<div class="pr-sub">'+placedScoreCount+' converted from '+placedAttempts+' attempt'+(placedAttempts!==1?'s':'')+(placedWides?' · '+placedWides+' wide'+(placedWides!==1?'s':''):'')+'</div>';
  }
  h += '</div></div>';

  // Player Scoring
  if (scorers.length > 0) {
    h += '<div class="pr-section pr-section-flow">';
    h += '<div class="pr-section-title">Player Scoring</div>';
    h += '<div class="pr-card">';
    scorers.forEach(p => {
      const g=p.gPlay+p.gPlaced, pts=p.pPlay+p.pPlaced, total=g*3+pts;
      h += html`<div class="pr-row"><span>${p.name}</span>`;
      h += '<span>';
      if (g > 0 || pts > 0) h += `<span class="pr-tag">${g}-${pts} (${total})</span> `;
      if (p.wides > 0) h += `<span class="pr-tag-grey">${p.wides} wide${p.wides!==1?'s':''}</span>`;
      h += '</span></div>';
    });
    h += '</div></div>';
  }

  // Shot Map
  if (state.trackShotLocations) {
    const smPrint = buildPrintShotMapHTML();
    if (smPrint) h += smPrint;
  }

  // Turnovers
  if (totalTurnovers > 0) {
    const wonPct = Math.round(turnoversWon / totalTurnovers * 100);
    h += '<div class="pr-section">';
    h += '<div class="pr-section-title">Turnovers</div>';
    h += '<div class="pr-card">';
    h += '<div style="display:flex;gap:24px;align-items:center;margin-bottom:10px;">';
    h += '<span style="font-size:18px;font-weight:700;color:'+TEAM_US_COLOR+';">'+turnoversWon+' won</span>';
    h += '<span style="font-size:18px;font-weight:700;color:'+TEAM_OPP_COLOR+';">'+turnoversLost+' lost</span>';
    h += '</div>';
    h += '<div style="height:10px;border-radius:5px;overflow:hidden;display:flex;margin-bottom:6px;background:#F8D7D7;">';
    h += '<div style="width:'+wonPct+'%;background:'+TEAM_US_COLOR+';"></div>';
    h += '</div>';
    h += '<div class="pr-row"><span>Won</span><span style="color:'+TEAM_US_COLOR+';font-weight:600;">'+turnoversWon+' ('+wonPct+'%)</span></div>';
    h += '<div class="pr-row"><span>Lost</span><span style="color:'+TEAM_OPP_COLOR+';font-weight:600;">'+turnoversLost+' ('+(100-wonPct)+'%)</span></div>';
    const twPlayers = Object.values(pstats).filter(p=>p.twon+p.tlost>0).sort((a,b)=>(b.twon-b.tlost)-(a.twon-a.tlost)||a.name.localeCompare(b.name));
    twPlayers.forEach(p => {
      h += html`<div class="pr-row"><span>${p.name}</span><span>`;
      if (p.twon  > 0) h += `<span class="pr-tag" style="margin-right:4px;">+${p.twon}</span>`;
      if (p.tlost > 0) h += `<span class="pr-tag" style="background:#F8D7D7;color:#991B1B;">-${p.tlost}</span>`;
      h += '</span></div>';
      if (state.trackTurnovers) {
        const wonSecs  = Object.entries(p.twonSec).sort((a,b)=>b[1]-a[1]);
        const lostSecs = Object.entries(p.tlostSec).sort((a,b)=>b[1]-a[1]);
        if (wonSecs.length || lostSecs.length) {
          h += '<div style="display:flex;gap:5px;flex-wrap:wrap;padding:2px 0 4px 2px;">';
          wonSecs.forEach(([cat,n])  => h += `<span class="pr-tag" style="font-size:10px;background:#DFF3E3;color:${TEAM_US_COLOR};">${esc(cat)}${n>1?' ×'+n:''}</span>`);
          lostSecs.forEach(([cat,n]) => h += `<span class="pr-tag" style="font-size:10px;background:#F8D7D7;color:#991B1B;">${esc(cat)}${n>1?' ×'+n:''}</span>`);
          h += '</div>';
        }
      }
    });
    if (state.trackTurnovers) {
      const wonEntries  = Object.entries(wonCategories);
      const lostEntries = Object.entries(lostCategories);
      if (wonEntries.length || lostEntries.length) {
        const WON_COLORS  = {'First to the Ball':'#1B5E20','Tackle Turnover':'#388E3C','Block':'#66BB6A','Hook':'#00897B','Defensive Pressure':'#A5D6A7'};
        const LOST_COLORS = {'Poor Pass':'#B71C1C','Lost in Tackle':CARD_RED,'Second to the Ball':'#EF9A9A','Over Played':'#E65100','Isolated':'#FFAB91'};
        h += '<div style="border-top:1px solid #E2E4DE;margin-top:10px;padding-top:12px;display:flex;gap:8px;justify-content:space-around;flex-wrap:wrap;">';
        if (wonEntries.length)  h += buildTurnoverDonut('Won by type',  wonEntries,  WON_COLORS,  TEAM_US_COLOR);
        if (lostEntries.length) h += buildTurnoverDonut('Lost by type', lostEntries, LOST_COLORS, TEAM_OPP_COLOR);
        h += '</div>';
      }
    }
    h += '</div></div>';
  }

  // Frees Won
  if (freesWon > 0) {
    const fwPlayers = Object.values(pstats).filter(p=>p.freesWon>0).sort((a,b)=>b.freesWon-a.freesWon||a.name.localeCompare(b.name));
    h += '<div class="pr-section"><div class="pr-section-title">Frees Won</div><div class="pr-card">';
    h += '<div style="display:flex;gap:24px;align-items:center;margin-bottom:10px;">';
    h += '<span style="font-size:18px;font-weight:700;color:'+TEAM_US_COLOR+';">'+freesWon+' frees won</span>';
    h += '</div>';
    fwPlayers.forEach(p => { h += html`<div class="pr-row"><span>${p.name}</span><span class="pr-tag">${p.freesWon}</span></div>`; });
    h += '</div></div>';
  }

  // Restarts
  if (ownTotal > 0 || oppTotal > 0) {
    h += '<div class="pr-section">';
    h += '<div class="pr-section-title">Restarts</div>';
    h += '<div class="pr-card">';
    if (ownTotal > 0) {
      const pct=Math.round(ownWon/ownTotal*100);
      h+='<div class="pr-row"><span>Own '+rstLabel+'s</span><span>'+ownWon+' won / '+ownLost+' lost'+(ownUnclear?' / '+ownUnclear+' unclear':'')+' — <strong>'+pct+'%</strong></span></div>';
    }
    if (oppTotal > 0) {
      const pct=Math.round(oppWon/oppTotal*100);
      h+='<div class="pr-row"><span>Opposition '+rstLabel+'s</span><span>'+oppWon+' won / '+oppLost+' lost'+(oppUnclear?' / '+oppUnclear+' unclear':'')+' — <strong>'+pct+'%</strong></span></div>';
    }
    h += '</div></div>';
  }

  // Goalkeeper Performance
  if (state.trackGKPerformance) {
    const prGkEvts = state.evts.filter(e => e.gkOutcome != null && e.gkFinalValue != null);
    if (prGkEvts.length > 0) {
      const _prGk = calculateGKRating(prGkEvts, state.ageGrade);
      const prRating = _prGk ? _prGk.rating : 50;
      const prLabel = _prGk ? _prGk.label : 'Average';
      const prRatingCol = _prGk ? _prGk.ratingColor : '#F59E0B';
      const prSaves = _prGk ? _prGk.saves : 0;
      const prGoals = _prGk ? _prGk.goals : 0;
      const prGkName = gn(1) || 'Goalkeeper';
      const prShots = prSaves + prGoals;
      const prSaveRate = prShots > 0 ? Math.round(prSaves / prShots * 100) : 0;
      const prIntLabels = ['', 'Routine', 'Moderate', 'Challenging', 'Difficult', 'Exceptional'];
      h += '<div class="pr-section">';
      h += '<div class="pr-section-title">Goalkeeper Performance</div>';
      h += '<div class="pr-card">';
      h += html`<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;"><span style="font-size:14px;font-weight:600;color:#1F1F1F;">${prGkName}</span><span style="font-size:12px;color:#6B6F66;">${prSaves} save${prSaves!==1?'s':''} / ${prGoals} goal${prGoals!==1?'s':''} conceded (${prSaveRate}%)</span></div>`;
      h += `<div style="display:flex;align-items:baseline;gap:8px;margin-bottom:10px;">`;
      h += `<span style="font-size:36px;font-weight:800;color:${prRatingCol};line-height:1;">${prRating}</span>`;
      h += `<span style="font-size:14px;font-weight:700;color:${prRatingCol};">${prLabel}</span>`;
      h += `<span style="font-size:11px;color:#9A9E99;margin-left:auto;">/ 100</span>`;
      h += `</div>`;
      h += `<div style="position:relative;height:10px;margin-bottom:4px;">`;
      h += `<div style="height:10px;border-radius:5px;background:linear-gradient(to right,#C62828 0%,#F59E0B 45%,#4CAF50 100%);"></div>`;
      h += `<div style="position:absolute;top:-3px;left:${prRating}%;width:4px;height:16px;background:${prRatingCol};border-radius:2px;transform:translateX(-50%);box-shadow:0 1px 3px rgba(0,0,0,.35);"></div>`;
      h += `</div>`;
      h += `<div style="display:flex;justify-content:space-between;font-size:10px;color:#9A9E99;margin-bottom:4px;"><span>Struggling</span><span>Average</span><span>Excellent</span></div>`;
      if (prGkEvts.length >= 3) {
        const prLevels = [5, 4, 3, 2, 1].filter(i => prGkEvts.some(e => (e.gkIntensity || 3) === i));
        if (prLevels.length) {
          h += `<div style="border-top:1px solid #E2E4DE;margin-top:10px;padding-top:8px;">`;
          h += `<div style="font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#6B6F66;margin-bottom:8px;">By shot difficulty</div>`;
          prLevels.forEach(intensity => {
            const lvl = prGkEvts.filter(e => (e.gkIntensity || 3) === intensity);
            const sv = lvl.filter(e => e.gkOutcome === 'save').length;
            const pct = Math.round(sv / lvl.length * 100);
            const bc = pct >= 70 ? '#2E7D32' : pct >= 40 ? '#E65100' : '#C62828';
            h += `<div style="display:flex;align-items:center;gap:8px;padding:3px 0;">`;
            h += html`<div style="font-size:12px;color:#4A4A4A;min-width:96px;">${prIntLabels[intensity]}</div>`;
            h += `<div style="flex:1;background:#E8EAE5;border-radius:3px;overflow:hidden;height:6px;"><div style="background:${bc};width:${pct}%;height:100%;border-radius:3px;"></div></div>`;
            h += `<div style="font-size:12px;font-weight:600;color:${bc};min-width:36px;text-align:right;">${sv}/${lvl.length}</div>`;
            h += `</div>`;
          });
          h += `</div>`;
        }
      }
      h += '</div></div>';
    }
  }

  // Opposition Scoring Profile
  if (state.trackOppScorers) {
    const prOscEvts = state.evts.filter(e => e.oppScorer);
    if (prOscEvts.length > 0) {
      const prOscMap = {};
      prOscEvts.forEach(e => {
        const s = e.oppScorer;
        const key = s.label + ' (' + s.num + ')';
        if (!prOscMap[key]) prOscMap[key] = { num: s.num, label: s.label, goals: 0, pts: 0 };
        const a = e.action || '';
        if (a === 'Goal') prOscMap[key].goals++;
        else if (a === '2 Point') prOscMap[key].pts += 2;
        else prOscMap[key].pts++;
      });
      const prOscRows = Object.values(prOscMap).sort((a, b) => {
        const ta = a.goals * 3 + a.pts, tb = b.goals * 3 + b.pts;
        return tb !== ta ? tb - ta : a.num - b.num;
      });
      h += '<div class="pr-section">';
      h += '<div class="pr-section-title">Opposition Scoring Profile</div>';
      h += '<div class="pr-card">';
      prOscRows.forEach(r => {
        const total = r.goals * 3 + r.pts;
        h += html`<div class="pr-row"><span>#${r.num} ${r.label}</span><span class="pr-tag" style="background:#EDE7F6;color:#4A148C;">${r.goals}-${r.pts} (${total}pts)</span></div>`;
      });
      h += '</div></div>';
    }
  }

  const slCards = state.sidelineCards || [];
  if (discPlayers.length > 0 || freesConc > 0 || slCards.length > 0) {
    h += '<div class="pr-section">';
    h += '<div class="pr-section-title">Discipline</div>';
    h += '<div class="pr-card">';
    if (freesConc > 0) {
      h += '<div style="font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#6B6F66;margin-bottom:8px;">Frees Conceded</div>';
      h += `<div class="pr-row" style="margin-bottom:6px;"><span>Total</span><span style="font-weight:600;">${freesConc}</span></div>`;
      if (freesScored > 0) h += `<div class="pr-row" style="margin-bottom:${discPlayers.length>0?'12':'4'}px;"><span>Scored by opposition</span><span style="color:${TEAM_OPP_COLOR};font-weight:600;">${freesScored}</span></div>`;
    }
    if (discPlayers.length > 0) {
      if (freesConc > 0) h += '<div style="font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#6B6F66;margin-bottom:8px;">By Player</div>';
      discPlayers.forEach(p => {
        const freeTotal = Object.values(p.frees).reduce((s,n)=>s+n,0);
        h += '<div class="pr-row" style="align-items:center;gap:6px;">';
        if (p.yc+p.bc+p.rc > 0) {
          const _syc=p.syc||0, _syY=p.yc-2*_syc;
          h += '<span style="display:flex;gap:2px;flex-shrink:0;align-items:center;">';
          for (let i=0;i<_syY;i++) h+=`<span style="display:inline-block;width:9px;height:13px;background:${CARD_YELLOW};border-radius:2px;border:.5px solid rgba(0,0,0,.2);"></span>`;
          for (let i=0;i<_syc;i++) h+=`<span style="display:inline-flex;gap:1px;align-items:center;" title="Second Yellow"><span style="display:inline-block;width:9px;height:13px;background:${CARD_YELLOW};border-radius:2px;border:.5px solid rgba(0,0,0,.2);"></span><span style="display:inline-block;width:9px;height:13px;background:${CARD_YELLOW};border-radius:2px;border:.5px solid rgba(0,0,0,.2);"></span><span style="font-size:8px;color:#9A9E99;margin:0 1px;">→</span><span style="display:inline-block;width:9px;height:13px;background:${CARD_RED};border-radius:2px;"></span></span>`;
          for (let i=0;i<p.bc;i++) h+=`<span style="display:inline-block;width:9px;height:13px;background:${CARD_BLACK};border-radius:2px;"></span>`;
          for (let i=0;i<p.rc;i++) h+=`<span style="display:inline-block;width:9px;height:13px;background:${CARD_RED};border-radius:2px;"></span>`;
          h += '</span>';
        }
        h += html`<span style="flex:1;font-size:13px;">${p.name}</span>`;
        if (freeTotal > 0) {
          h += `<span style="font-size:11px;color:#6B6F66;">${freeTotal} free${freeTotal!==1?'s':''}`;
          const types = Object.entries(p.frees).sort((a,b)=>b[1]-a[1]).map(([t,n])=>esc(t)+(n>1?' ×'+n:'')).join(', ');
          h += ` &mdash; ${types}</span>`;
        }
        h += '</div>';
      });
    }
    if (slCards.length > 0) {
      if (freesConc > 0 || discPlayers.length > 0) h += '<div style="border-top:1px solid #E2E4DE;margin:10px 0;"></div>';
      h += '<div style="font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#6B6F66;margin-bottom:8px;">Sideline</div>';
      slCards.forEach(sc => {
        h += '<div class="pr-row" style="align-items:center;gap:6px;">';
        if (sc.type !== 'AdvFree') {
          const bg = sc.type === 'Yellow' ? CARD_YELLOW : CARD_RED;
          h += `<span style="display:inline-block;width:9px;height:13px;background:${bg};border-radius:2px;${sc.type==='Yellow'?'border:.5px solid rgba(0,0,0,.2);':''}flex-shrink:0;"></span>`;
        } else {
          h += `<span style="font-size:10px;font-weight:700;color:#92400E;background:#FEF3C7;padding:1px 5px;border-radius:3px;flex-shrink:0;">ADV FREE</span>`;
        }
        h += html`<span style="flex:1;font-size:13px;">${sc.name||'Coach/Manager'}</span>`;
        h += `<span style="font-size:11px;color:#6B6F66;">${esc(sc.time)}</span>`;
        h += '</div>';
      });
    }
    h += '</div></div>';
  }

  const subEvts = state.evts.filter(ev => ev.action === 'sub');
  if (subEvts.length > 0) {
    const _psSc={usG:0,usP:0,oppG:0,oppP:0};
    const psScoreAt=[];
    state.evts.forEach(ev => {
      applyScoreBadge(ev, _psSc, state.oppN);
      psScoreAt.push({usG:_psSc.usG,usP:_psSc.usP,oppG:_psSc.oppG,oppP:_psSc.oppP});
    });
    const fPsUsG=_psSc.usG,fPsUsP=_psSc.usP,fPsOppG=_psSc.oppG,fPsOppP=_psSc.oppP;

    h += '<div class="pr-section pr-section-flow">';
    h += '<div class="pr-section-title">Substitutions</div>';
    h += '<div class="pr-card" style="padding:0;overflow:hidden;">';
    h += '<div style="display:flex;align-items:center;padding:6px 14px;background:#E8EAE5;border-bottom:1px solid #E2E4DE;gap:8px;">';
    h += '<span style="font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#6B6F66;min-width:42px;">Time</span>';
    h += '<span style="font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#6B6F66;flex:1;">On</span>';
    h += '<span style="font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#6B6F66;flex:1;">Off</span>';
    h += '<span style="font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#6B6F66;min-width:72px;text-align:right;">Score / After</span>';
    h += '</div>';
    state.evts.forEach((ev,i) => {
      if (ev.action !== 'sub') return;
      const at = psScoreAt[i] || {usG:0,usP:0,oppG:0,oppP:0};
      const aUG=fPsUsG-at.usG, aUP=fPsUsP-at.usP, aOG=fPsOppG-at.oppG, aOP=fPsOppP-at.oppP;
      const m = ev.desc.match(/Sub: (.+) off \/ (.+) on \(pos (\d+)\)/);
      const offName=m?m[1]:'?', onName=m?m[2]:'?', pos=m?m[3]:'';
      h += '<div class="pr-row" style="display:flex;align-items:flex-start;padding:7px 14px;border-bottom:1px solid #E2E4DE;gap:8px;font-size:13px;">';
      h += '<span style="min-width:42px;color:#6B6F66;padding-top:1px;">'+ev.time+'</span>';
      h += html`<div style="flex:1;"><div style="font-weight:600;color:#1F1F1F;">${onName}</div>${html.safe(pos?'<div style="font-size:10px;color:#9A9E99;">Pos '+pos+'</div>':'')}</div>`;
      h += html`<div style="flex:1;color:#4A4A4A;">${offName}</div>`;
      h += '<div style="min-width:72px;text-align:right;">';
      h += '<div style="font-size:11px;color:#6B6F66;">'+at.usG+'-'+at.usP+' v '+at.oppG+'-'+at.oppP+'</div>';
      h += '<div style="font-size:10px;color:#9A9E99;margin-top:1px;"><span style="color:'+TEAM_US_COLOR+';">+'+aUG+'-'+aUP+'</span> / <span style="color:'+TEAM_OPP_COLOR+';">+'+aOG+'-'+aOP+'</span></div>';
      h += '</div>';
      h += '</div>';
    });
    h += html`<div style="padding:6px 14px;font-size:10px;color:#9A9E99;">After = goals-pts scored from sub on (${state.usN} / ${state.oppN})</div>`;
    h += '</div></div>';
  }

  // Play Time
  if (state.trackGameTime) {
    const { ptMap: prPtMap } = computePlayTimes();
    const prPtRows = Object.entries(prPtMap)
      .map(([pi, t]) => ({pi:+pi, name:gn(+pi), t}))
      .filter(r => r.name)
      .sort((a, b) => b.t - a.t || a.name.localeCompare(b.name));
    if (prPtRows.length) {
      const prStartPis = new Set(Object.values(state.startSlotp||{}).map(Number));
      const prMaxT = prPtRows[0].t || 1;
      h += '<div class="pr-section pr-section-flow">';
      h += '<div class="pr-section-title">Play Time</div>';
      h += '<div class="pr-card">';
      prPtRows.forEach(r => {
        const pct = Math.round(r.t / prMaxT * 100);
        const isSub = !prStartPis.has(r.pi);
        h += '<div style="display:flex;align-items:center;gap:10px;padding:4px 0;">';
        h += `<div style="font-size:12px;font-weight:${isSub?'400':'600'};color:#1F1F1F;min-width:120px;white-space:nowrap;">${esc(r.name)}</div>`;
        h += `<div style="flex:1;background:#E8EAE5;border-radius:3px;overflow:hidden;height:7px;"><div style="background:${TEAM_US_COLOR};opacity:${isSub?'.5':'1'};width:${pct}%;height:100%;border-radius:3px;"></div></div>`;
        h += `<div style="font-size:12px;font-weight:700;color:${TEAM_US_COLOR};min-width:38px;text-align:right;">${formatSeconds(r.t)}</div>`;
        h += `<div style="font-size:10px;color:#9A9E99;min-width:22px;">${isSub?'Sub':''}</div>`;
        h += '</div>';
      });
      h += '</div></div>';
    }
  }

  h += '<div class="pr-footer">Generated by GAA Match Tracker</div>';
  return h;
}

function buildPrintShotMapHTML() {
  const shotActs = new Set(['Goal','Point','2 Point','Wide','Short','Saved']);
  let inH2 = false;
  const shots = [];
  state.evts.forEach(ev => {
    if (ev.badge === '1H') { if ((ev.desc||'').includes('ended')) inH2 = true; return; }
    if (!shotActs.has(ev.action) || !ev.zone) return;
    const pi = ev.pi != null ? ev.pi : (ev.slot != null ? state.slotp[ev.slot] : null);
    shots.push({ action: ev.action, zone: ev.zone, half: inH2 ? 'h2' : 'h1', pi, placed: PLACED_BALL.has(ev.sec), sec: ev.sec });
  });
  if (shots.length === 0) return '';

  const { dots, thirds } = computeShotDots(shots, pi => gi(pi));
  let h = '<div class="pr-section pr-break">';
  h += '<div class="pr-section-title">Shot Map</div>';
  h += '<div class="pr-card" style="padding:0;overflow:hidden;">';
  h += `<svg viewBox="0 0 320 400" xmlns="http://www.w3.org/2000/svg" style="width:100%;display:block;" preserveAspectRatio="xMidYMid meet">${PITCH_SVG_INNER}${dots}</svg>`;
  h += '<div style="padding:10px 14px;">';
  h += '<div style="display:flex;gap:14px;margin-bottom:10px;font-size:11px;color:#4A4A4A;align-items:center;">';
  h += '<span style="display:flex;align-items:center;gap:4px;"><svg width="12" height="12"><circle cx="6" cy="6" r="5" fill="'+TEAM_US_COLOR+'" opacity=".82"/></svg>Score</span>';
  h += '<span style="display:flex;align-items:center;gap:4px;"><svg width="12" height="12"><circle cx="6" cy="6" r="5" fill="'+TEAM_OPP_COLOR+'" opacity=".82"/></svg>Wide</span>';
  h += '<span style="display:flex;align-items:center;gap:4px;"><svg width="12" height="12"><circle cx="6" cy="6" r="5" fill="#9E9E9E" opacity=".82"/></svg>Short</span>';
  h += '<span style="display:flex;align-items:center;gap:4px;"><svg width="12" height="12"><circle cx="6" cy="6" r="5" fill="#F97316" opacity=".82"/></svg>Saved</span>';
  h += '<span style="display:flex;align-items:center;gap:4px;"><svg width="14" height="14"><circle cx="7" cy="7" r="6" fill="'+TEAM_US_COLOR+'" opacity=".82" stroke="white" stroke-width="1"/></svg>Goal</span>';
  h += '<span style="display:flex;align-items:center;gap:4px;"><svg width="18" height="18"><circle cx="9" cy="9" r="8" fill="none" stroke="'+TEAM_US_COLOR+'" stroke-width="1.5" opacity=".7"/><circle cx="9" cy="9" r="5" fill="'+TEAM_US_COLOR+'" opacity=".82" stroke="white" stroke-width="1"/></svg>Placed</span>';
  h += '</div>';
  const thirdRows = [['Attacking third',thirds.att],['Middle third',thirds.mid],['Defensive third',thirds.def]];
  if (thirdRows.some(([,d]) => d.shots > 0)) {
    h += '<table style="width:100%;font-size:12px;border-collapse:collapse;">';
    h += '<tr style="color:#6B6F66;font-size:11px;"><th style="text-align:left;padding:4px 0;font-weight:500;">Zone</th><th style="text-align:center;font-weight:500;">Shots</th><th style="text-align:center;font-weight:500;">Scores</th><th style="text-align:center;font-weight:500;">Conv%</th></tr>';
    thirdRows.forEach(([label,d]) => {
      if (d.shots === 0) return;
      h += `<tr><td style="padding:3px 0;color:#4A4A4A;">${label}</td><td style="text-align:center;color:#1F1F1F;">${d.shots}</td><td style="text-align:center;color:#1F1F1F;">${d.scores}</td><td style="text-align:center;font-weight:600;color:${TEAM_US_COLOR};">${pct(d.scores,d.shots)}</td></tr>`;
    });
    h += '</table>';
  }
  h += '</div></div></div>';
  return h;
}

function printStats() {
  const area = document.getElementById('print-area');
  // eslint-disable-next-line no-restricted-syntax -- safe: buildPrintHTML() passes all user data through esc()
  area.innerHTML = buildPrintHTML();
  const imgs = Array.from(area.querySelectorAll('img'));
  if (!imgs.length) { window.print(); return; }
  let pending = imgs.length;
  const done = () => { if (--pending === 0) window.print(); };
  imgs.forEach(img => {
    if (img.complete) { done(); }
    else { img.addEventListener('load', done); img.addEventListener('error', done); }
  });
}

/* ── transfer.js ── */
'use strict';

// Build a GAA-style filename base: e.g. "U16HL_2024-03-15_St-Patricks"
// grade + sport code + competition code + match date + opposition
function _buildFilenameBase() {
  const sport = (state.sport || 'football').toLowerCase();
  let sc;
  if      (sport.startsWith('hurling'))  sc = 'H';
  else if (sport.startsWith('camogie')) sc = 'C';
  else if (sport.includes('ladies'))    sc = 'LF';
  else                                  sc = 'F';

  const grade = (state.ageGrade || '').trim()
    .replace(/\bunder\b\s*/i, 'U')
    .replaceAll(/\s+/g, '')
    .replaceAll(/[^a-zA-Z0-9]/g, '');

  const comp = (state.competition || '').toLowerCase();
  let cc;
  if      (/\bleague\b/.test(comp))                 cc = 'L';
  else if (/\bchampionship\b/.test(comp))           cc = 'C';
  else if (/\bcup\b/.test(comp))                    cc = 'Cu';
  else if (/\bshield\b/.test(comp))                 cc = 'Sh';
  else if (/\bfriendly\b|\bchallenge\b/.test(comp)) cc = 'Fr';
  else if (/\btournament\b/.test(comp))             cc = 'T';
  else if (/\bblitz\b/.test(comp))                  cc = 'B';
  else                                              cc = '';

  const date = (state.matchDate || '').slice(0, 10) || new Date().toISOString().slice(0, 10);
  const opp = (state.oppN || 'match')
    .replaceAll(/[^a-z0-9]/gi, '-')
    .replaceAll(/-+/g, '-')
    .replaceAll(/^-|-$/g, '');

  const prefix = grade + sc + cc;
  return (prefix ? prefix + '_' : '') + date + '_' + opp;
}

function exportMatchJSON() {
  const filename = _buildFilenameBase() + '.json';
  const blob = new Blob([JSON.stringify(state, null, 2)], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
  toast('Exported: ' + filename);
}

function importMatchJSON(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      if (!Array.isArray(data.evts)) { toast('Not a valid match file'); return; }
      // Merge imported data over current state — Object.assign preserves any new
      // state fields (trackGKPerformance, etc.) that didn't exist in older exported files.
      if (data.usN)  data.usN  = fmtClubName(data.usN);
      if (data.oppN) data.oppN = fmtClubName(data.oppN);
      Object.assign(state, data);
      buildInitialsCache();
      // eslint-disable-next-line no-restricted-syntax -- safe: clears element, no user data
      el.evlog.innerHTML = '';
      renderPGrid();
      restoreUI();
      closeShareMenu();
      saveState();
      toast('Loaded: ' + (state.oppN || 'match'));
    } catch (err) {
      toast('Failed to load file');
    }
  };
  reader.readAsText(file);
  input.value = '';
}

/* ── gk.js ── */
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
const _S2_LBL    = ['','Scored rebound','Poor clearance','Neutral','Good clearance','Brilliant'];
const _S2_COLORS = ['','#C62828','#E57310','#888888','#388E3C','#1B5E20'];

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

function gkHelpOpen() {
  document.getElementById('gk-help-view').style.display = '';
}

function gkHelpClose() {
  document.getElementById('gk-help-view').style.display = 'none';
}

function closeGKModal() {
  const wasGoalFlow  = _gkFlow === 'goal';
  const restartSide  = _pendingRestartSide;
  const goalEvtIdx   = _gkGoalEvtIdx;
  document.getElementById('gkovly').classList.remove('open');
  document.getElementById('gkpanel').classList.remove('open');
  document.getElementById('gk-help-view').style.display = 'none';
  _gkFlow = null; _gkSlot = null; _gkGoalEvtIdx = null;
  _gkIntensity = null; _gkSaveScore = null; _gkSecondary = null; _gkSecondaryVis = false;
  _pendingRestartSide = null;
  if (wasGoalFlow && restartSide != null) {
    if (state.trackOppScorers) openOscModal(goalEvtIdx, () => showRestartModal(restartSide));
    else showRestartModal(restartSide);
  }
}

// ── Render ────────────────────────────────────────────────────────────────────
function _gkRender() {
  const isGoal = _gkFlow === 'goal';
  const pi     = state.slotp[_gkSlot];

  // Player header (same format as player sheet)
  const ini  = gi(pi);
  const name = gn(pi) || ('GK ' + _gkSlot);
  const gkEvts = state.evts.filter(e => e.gkOutcome != null);
  const saves  = gkEvts.filter(e => e.gkOutcome === 'save').length;
  const shots  = gkEvts.length;
  // eslint-disable-next-line no-restricted-syntax -- safe: esc() on all user values; numbers are ints
  document.getElementById('gk-ply-hdr').innerHTML =
    '<div class="ply-avatar">' + esc(ini) + '<span class="ply-avatar-num">' + _gkSlot + '</span></div>' +
    '<div class="ply-info"><div class="ply-name">' + esc(name) + '</div><div class="ply-pos">Goalkeeper</div></div>' +
    '<div class="ply-score"><div class="ply-score-val">' + saves + ' from ' + shots + '</div><div class="ply-score-lbl">saves</div></div>' +
    '<button class="gk-info-btn" onclick="gkHelpOpen()" aria-label="Save rating guide"><i class="fas fa-circle-info" aria-hidden="true"></i></button>' +
    '<button class="ply-close" onclick="closeGKModal()"><i class="fas fa-xmark" aria-hidden="true"></i></button>';

  // Subtitle
  document.getElementById('gk-subtitle').textContent = isGoal
    ? 'Save score is locked at 1 — pick how preventable this was.'
    : 'Pick the cell that matches shot intensity and how well it was dealt with.';

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
  if (_gkSecondary == null) {
    _gkSecondary = 3;
    _gkUpdateSubmitBtn();
  }
  const val   = _gkSecondary;
  const color = _S2_COLORS[val];
  // eslint-disable-next-line no-restricted-syntax -- safe: val is 1-5 integer, color/label from static arrays
  document.getElementById('gk-secondary-row').innerHTML =
    '<div class="gk-sec-slider-wrap">' +
      '<div class="gk-sec-display" id="gk-sec-display">' +
        '<span class="gk-sec-num-big" style="color:' + color + ';">' + val + '</span>' +
        '<span class="gk-sec-lbl-big" style="color:' + color + ';">' + _S2_LBL[val] + '</span>' +
      '</div>' +
      '<input type="range" class="gk-sec-slider" min="1" max="5" step="1" value="' + val + '" oninput="gkSecSlide(+this.value)">' +
      '<div class="gk-sec-ticks"><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span></div>' +
    '</div>';
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

function gkSecSlide(val) {
  _gkSecondary = val;
  const color   = _S2_COLORS[val];
  const display = document.getElementById('gk-sec-display');
  if (display) {
    // eslint-disable-next-line no-restricted-syntax -- safe: val is 1-5 integer, color/label from static arrays
    display.innerHTML =
      '<span class="gk-sec-num-big" style="color:' + color + ';">' + val + '</span>' +
      '<span class="gk-sec-lbl-big" style="color:' + color + ';">' + _S2_LBL[val] + '</span>';
  }
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

/* ── osc.js ── */
'use strict';

// ─── OPPOSITION SCORER TRACKING ───────────────────────────────────────────────

// GAA standard positions — index matches jersey number (index 0 unused)
const OSC_POSITIONS = [
  null,
  { num: 1,  label: 'Goalkeeper',          short: 'GK'  },
  { num: 2,  label: 'Left Corner-Back',    short: 'LCB' },
  { num: 3,  label: 'Full Back',           short: 'FB'  },
  { num: 4,  label: 'Right Corner-Back',   short: 'RCB' },
  { num: 5,  label: 'Left Wing-Back',      short: 'LWB' },
  { num: 6,  label: 'Centre Back',         short: 'CB'  },
  { num: 7,  label: 'Right Wing-Back',     short: 'RWB' },
  { num: 8,  label: 'Midfield',            short: 'MF'  },
  { num: 9,  label: 'Midfield',            short: 'MF'  },
  { num: 10, label: 'Left Wing-Forward',   short: 'LWF' },
  { num: 11, label: 'Centre Forward',      short: 'CF'  },
  { num: 12, label: 'Right Wing-Forward',  short: 'RWF' },
  { num: 13, label: 'Left Corner-Forward', short: 'LCF' },
  { num: 14, label: 'Full Forward',        short: 'FF'  },
  { num: 15, label: 'Right Corner-Forward',short: 'RCF' },
];

// Formation rows keyed by team size — mirrors GRID_LAYOUTS in constants.js
const OSC_ROWS = {
  15: [[1],[2,3,4],[5,6,7],[8,9],[10,11,12],[13,14,15]],
  13: [[1],[2,4],[5,6,7],[8,9],[10,11,12],[13,15]],
};

let _oscEvtIdx = null;
let _oscCb     = null;

function openOscModal(evtIdx, onDone) {
  _oscEvtIdx = evtIdx;
  _oscCb     = onDone;
  document.getElementById('osc-title').textContent = 'Who scored for ' + state.oppN + '?';
  _oscRenderBody();
  document.getElementById('oscopanel').classList.add('open');
}

function _oscClose() {
  document.getElementById('oscopanel').classList.remove('open');
}

function oscSkip() {
  _oscClose();
  const cb = _oscCb;
  _oscEvtIdx = null; _oscCb = null;
  if (cb) cb();
}

function oscSelectPos(num) {
  const pos = OSC_POSITIONS[num];
  if (!pos) return;
  // Enrich the event with scorer data and append to visible description
  if (_oscEvtIdx != null && _oscEvtIdx < state.evts.length) {
    const ev = state.evts[_oscEvtIdx];
    ev.oppScorer = { num: pos.num, label: pos.label };
    const scorerSuffix = ' \xB7 ' + pos.label + ' (#' + pos.num + ')';
    ev.desc += scorerSuffix;
    // Update the DOM row so the log reflects it immediately
    const row = el.evlog.querySelector('[data-ev-idx="' + _oscEvtIdx + '"]');
    if (row) {
      const descEl = row.querySelector('span:last-child');
      if (descEl) descEl.textContent = ev.desc;
    }
  }
  saveState();
  _oscClose();
  const cb = _oscCb;
  _oscEvtIdx = null; _oscCb = null;
  if (cb) cb();
}

function _oscRenderBody() {
  const body = document.getElementById('osc-body');

  // Tally goals and points by position number from existing events
  const tally = {};
  state.evts.forEach(ev => {
    if (!ev.oppScorer) return;
    const n = ev.oppScorer.num;
    if (!tally[n]) tally[n] = { g: 0, p: 0 };
    if (ev.action === 'Goal')        tally[n].g++;
    else if (ev.action === '2 Point') tally[n].p += 2;
    else                              tally[n].p++;
  });

  let html = '<div class="osc-formation">';

  const rows = OSC_ROWS[state.teamSize] || OSC_ROWS[15];
  rows.forEach(row => {
    html += '<div class="osc-row">';
    row.forEach(num => {
      const pos  = OSC_POSITIONS[num];
      const sc   = tally[num];
      const hasSc = sc && (sc.g > 0 || sc.p > 0);
      const bubbleCls = 'osc-bubble' + (hasSc ? ' osc-bubble-scored' : '');
      const scoreHtml = hasSc
        ? '<span class="osc-bubble-score">' + sc.g + '-' + sc.p + '</span>'
        : '';
      html +=
        '<button class="osc-pos-btn" onclick="oscSelectPos(' + num + ')">' +
          '<div class="' + bubbleCls + '">' +
            '<span class="osc-pos-num">' + num + '</span>' +
            scoreHtml +
          '</div>' +
          '<span class="osc-pos-lbl">' + esc(pos.label) + '</span>' +
        '</button>';
    });
    html += '</div>';
  });

  html += '</div>';
  html +=
    '<button class="ps-poss-btn" style="width:100%;background:var(--bg2);color:var(--t2);margin-top:4px;" onclick="oscSkip()">' +
      '<span class="ps-poss-icon" style="background:var(--bg3);"><i class="fas fa-forward"></i></span>Skip' +
    '</button>';

  // eslint-disable-next-line no-restricted-syntax -- safe: esc() on all user values; num is integer
  body.innerHTML = html;
}

/* ── sideline.js ── */
'use strict';

// ─── SIDELINE ─────────────────────────────────────────────────────────────────

function openSideline() {
  document.getElementById('sldovly').classList.add('open');
  document.getElementById('sldpanel').classList.add('open');
  setTimeout(() => document.getElementById('sld-name').focus(), 320);
}

function closeSideline() {
  document.getElementById('sldovly').classList.remove('open');
  document.getElementById('sldpanel').classList.remove('open');
}

function sidelineAction(type) {
  const name = (document.getElementById('sld-name').value || '').trim();
  const time  = fmt(state.secs);

  let badge, cls, desc;
  if (type === 'AdvFree') {
    badge = 'SL Adv';
    cls   = 'bo';
    desc  = 'Sideline: Advanced Free' + (name ? ' (' + name + ')' : '');
  } else {
    const label = type === 'Yellow' ? 'Yellow Card' : 'Red Card';
    badge = type === 'Yellow' ? 'SL YC' : 'SL RC';
    cls   = type === 'Yellow' ? 'by'    : 'br';
    desc  = 'Sideline: ' + (name || 'Coach/Manager') + ' — ' + label;
  }

  state.sidelineCards.push({time, name, type});
  addRow(time, badge, cls, desc);
  document.getElementById('sld-name').value = '';
  closeSideline();
  saveState();
}

/* ── app.js ── */
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
  setGrid(false); // applies PRE_MATCH interactive state
}

init();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
