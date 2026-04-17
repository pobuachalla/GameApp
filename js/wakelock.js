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
