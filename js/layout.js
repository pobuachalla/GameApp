'use strict';

// ─── LAYOUT PANEL ─────────────────────────────────────────────────────────────
function _teamCrest(name) {
  const club = findClub(name);
  return (club && club.crest) || findCountyCrest(name) || null;
}

const _crestImg = (src, alt) =>
  src ? `<img src="${esc(src)}" alt="${esc(alt)}" onerror="this.style.display='none'">` : '';

function openLayout() {
  closeSettings();

  const usCrest = _teamCrest(state.usN);
  const oppName = state.oppN && state.oppN !== 'Opposition' ? state.oppN : '';
  const oppCrest = oppName ? _teamCrest(oppName) : null;

  document.getElementById('layout-us-crest').innerHTML  = _crestImg(usCrest, state.usN);
  document.getElementById('layout-opp-crest').innerHTML = _crestImg(oppCrest, oppName);
  document.getElementById('layout-team-name').textContent = state.usN;

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IE', {weekday:'long', day:'numeric', month:'long', year:'numeric'});
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
      h += '<i class="fa-solid fa-shirt layout-shirt-icon" style="color:'+(slot===1?'#FDD835':'#2E7D32')+';"></i>';
      h += '<span class="layout-shirt-num" style="color:'+(slot===1?'#2E7D32':'#fff')+';">'+slot+'</span>';
      h += '</div>';
      h += '<div class="layout-player-name">'+esc(name || '—')+'</div>';
      h += '</div>';
    });
    h += '</div>';
  });

  h += '</div>';

  // Subs
  const subs = [];
  for (let i = 16; i <= (state.maxB || 16); i++) {
    const n = gn(i);
    if (n) subs.push({idx: i, name: n});
  }
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

  document.getElementById('layout-content').innerHTML = h;
}
