'use strict';
// ── Age grade — single source of truth ────────────────────────────────────────
// Derive a player's age grade from their birth year using the club convention:
//   grade number = reference year − birth year
// e.g. a player born in 2012 is U14 in 2026, whatever their date of birth that
// year. Shared by the roster manager (roster.html), the Bronco tracker
// (bronco.html) and the live-tracker lineup (js/settings.js, via bundle.js) so
// the formula lives in exactly one place and the three can never drift apart.
// refYear is optional and defaults to the current calendar year; returns ''
// when the birth year is missing or not a number.
function ageGradeFor(birthYear, refYear) {
  const by = Number(birthYear);
  if (!Number.isFinite(by)) return '';
  const yr = Number.isFinite(refYear) ? refYear : new Date().getFullYear();
  return 'U' + (yr - by);
}
