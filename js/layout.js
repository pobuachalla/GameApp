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
