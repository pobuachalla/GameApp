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

// Formation rows: each inner array is jersey numbers displayed on that row
const OSC_ROWS = [
  [1],
  [2, 3, 4],
  [5, 6, 7],
  [8, 9],
  [10, 11, 12],
  [13, 14, 15],
];

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
  let html = '<div class="osc-formation">';

  OSC_ROWS.forEach(row => {
    html += '<div class="osc-row">';
    row.forEach(num => {
      const pos = OSC_POSITIONS[num];
      html +=
        '<button class="osc-pos-btn" onclick="oscSelectPos(' + num + ')">' +
          '<span class="osc-pos-num">' + num + '</span>' +
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
