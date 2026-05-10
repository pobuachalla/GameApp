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
