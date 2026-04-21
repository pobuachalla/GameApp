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
      const allKeys = new Set([...Object.keys(state), ...Object.keys(data)]);
      allKeys.forEach(k => { if (k in data) state[k] = data[k]; else delete state[k]; });
      buildInitialsCache();
      el.evlog.innerHTML = '';
      renderPGrid();
      restoreUI();
      // Close settings panel directly — closeSettings() calls flushSettings() which
      // would overwrite the freshly-imported state.pnames with stale DOM input values.
      document.getElementById('setovly').classList.remove('open');
      el.setpanel.classList.remove('open');
      saveState();
      toast('Loaded: ' + (state.oppN || 'match'));
    } catch (err) {
      toast('Failed to load file');
    }
  };
  reader.readAsText(file);
  input.value = '';
}
