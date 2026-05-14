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
