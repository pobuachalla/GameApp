'use strict';

function exportMatchJSON() {
  const opp = (state.oppN || 'match').replace(/[^a-z0-9]/gi, '-').toLowerCase();
  const date = new Date().toISOString().slice(0, 10);
  const filename = `gaa-${opp}-${date}.json`;
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
