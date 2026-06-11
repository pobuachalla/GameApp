'use strict';

// ─── SCREEN WAKE LOCK ─────────────────────────────────────────────────────────
let wakeLock = null;

async function acquireWakeLock() {
  if (!('wakeLock' in navigator)) return;
  try {
    wakeLock = await navigator.wakeLock.request('screen');
    // The OS releases the lock when the screen sleeps / app backgrounds;
    // null the handle so reacquireWakeLock() knows to request a new one.
    wakeLock.addEventListener('release', () => { wakeLock = null; });
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
