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
  pnames:{}, slotp:{}, ubench:{}, suboff:{},
  rcarded:{}, ycarded:{}, bcarded:{},
  maxB:17,
  evts:[],   // {time, desc, badge, cls, slot?, action?}
  sport:'hurling', // 'hurling' or 'football'
  teamSize:15,     // 15 or 13
  captain:null,    // slot number of captain, or null
  trackShotLocations:false,
  showPlayerNumbers:true,
};
for (let i = 1; i <= 15; i++) state.slotp[i] = i;

// ─── SESSION STATE (not persisted) ────────────────────────────────────────────
let undos   = [];
let selMode = false;
let selSlot = null, pendAct = null, subOff = null;
let pendScoreAdj = null; // {type, d, side} for pending score adjustment
// Zone picker session state
let pendActSaved = null, pendSecVal = null, pendSlotSaved = null;
let zoneSelectedId = null, zoneSelectedCoords = null;
// Shot map filter state
let shotMapTeamFilter = 'all', shotMapHalfFilter = 'all', shotMapPlayerFilter = 'all';
let tInt    = null;
let tRun    = false;
let modalHandlerRef = null;
let initialsCache = {};

// ─── DOM CACHE ────────────────────────────────────────────────────────────────
const el = {};
function initEl() {
  ['timer-display','gc','pc','og','op','utotal','ototal','uslbl','opplbl',
   'evlog','logempty','lcnt','lbdg','toast','modal','mtitle','mopts',
   'period-badge','status-chip','timer-primary-btn','timer-secondary-btn',
   'pgrid','logpanel','setpanel','seltoggle',
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
