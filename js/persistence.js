'use strict';

// ─── PERSISTENCE ──────────────────────────────────────────────────────────────
let saveStateTimeoutId = null;

function serializeState() {
  const {goals,pts,og,op_,htGoals,htPts,htOg,htOp,ftGoals,ftPts,ftOg,ftOp,
         period,secs,matchState,tPausedAt,tWallStart,
         usN,oppN,location,referee,competition,matchDate,ageGrade,matchNotes,teamAssessment,
         pnames,slotp,ubench,suboff,preGameSubs,rcarded,ycarded,bcarded,
         maxB,evts,sport,teamSize,captain,startSlotp,startCaptain,trackGameTime,trackShotLocations,showPlayerNumbers,trackTurnovers,trackGKPerformance,trackOppScorers,sidelineCards} = state;
  return {goals,pts,og,op_,htGoals,htPts,htOg,htOp,ftGoals,ftPts,ftOg,ftOp,
          period,secs,matchState,tPausedAt,tWallStart,
          usN,oppN,location,referee,competition,matchDate,ageGrade,matchNotes,teamAssessment,
          pnames,slotp,ubench,suboff,preGameSubs,rcarded,ycarded,bcarded,
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
