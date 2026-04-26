'use strict';

// ─── TEMPLATES ────────────────────────────────────────────────────────────────
function saveTpl() {
  const name = el.tni.value.trim(); if(!name){toast('Enter a template name');return;}
  const data = {usName:el.sun.value.trim()||state.usN, playerNames:{}, captain:state.captain};
  for(let i=1;i<=state.maxB+2;i++){const inp=document.getElementById('sn'+i);if(inp&&inp.value.trim())data.playerNames[i]=inp.value.trim();}
  try{localStorage.setItem('tpl:'+name,JSON.stringify(data));toast('Saved "'+name+'"');el.tni.value='';renderTpls();}catch(e){toast('Save failed');}
}

function loadTpl(name) {
  try{
    const raw=localStorage.getItem('tpl:'+name); if(!raw)return;
    const data=JSON.parse(raw);
    if(data.usName)el.sun.value=data.usName;
    state.maxB=17; // reset so stale slots don't accumulate
    if(data.playerNames){
      // Update starting players via DOM (always rendered)
      for(let i=1;i<=15;i++){
        state.pnames[i]=data.playerNames[i]||'';
        const inp=document.getElementById('sn'+i); if(inp)inp.value=state.pnames[i];
      }
      // Update bench slots in state and compute correct maxB before re-rendering
      for(let i=16;i<=30;i++){
        state.pnames[i]=data.playerNames[i]||'';
        if(state.pnames[i]&&i>=state.maxB)state.maxB=i+1;
      }
      renderBench();
    }
    if('captain' in data) {
      state.captain = data.captain;
      document.querySelectorAll('.cap-btn').forEach(b => {
        const s = parseInt(b.dataset.cap);
        const isCap = state.captain === s;
        b.className = 'cap-btn ' + (isCap ? 'active' : 'inactive');
        b.querySelector('i').className = 'fa-regular ' + (isCap ? 'fa-copyright' : 'fa-circle');
      });
    }
    toast('Loaded "'+name+'"');
  }catch(e){toast('Load failed');}
}

function delTpl(name){try{localStorage.removeItem('tpl:'+name);renderTpls();toast('Deleted');}catch(e){}}

function updateTpl(name) {
  const data = {usName:el.sun.value.trim()||state.usN, playerNames:{}, captain:state.captain};
  for(let i=1;i<=state.maxB+2;i++){const inp=document.getElementById('sn'+i);if(inp&&inp.value.trim())data.playerNames[i]=inp.value.trim();}
  try{localStorage.setItem('tpl:'+name,JSON.stringify(data));toast('Updated "'+name+'"');}catch(e){toast('Update failed');}
}

function clearAllNames() {
  const sz = state.teamSize || 15;
  for (let i = 1; i <= sz; i++) { const inp=document.getElementById('sn'+i); if(inp) inp.value=''; }
  for (let i = 16; i <= state.maxB; i++) { const inp=document.getElementById('sn'+i); if(inp) inp.value=''; }
  flushSettings();
  toast('Names cleared');
}

function renderTpls(){
  const keys=[];
  for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.startsWith('tpl:'))keys.push(k);}
  if(!keys.length){el.tpllist.innerHTML='<div style="font-size:13px;color:var(--t3);padding:4px 0;">No saved templates</div>';return;}
  el.tpllist.innerHTML=keys.map(k=>{
    const n=k.replace('tpl:','');
    return '<div class="tplrow"><span style="flex:1;font-size:14px;color:var(--t1);">'+esc(n)+'</span>'
      +'<button class="tpl-icon-btn" onclick="loadTpl(\''+esc(n)+'\')" title="Load"><i class="fas fa-file-import"></i></button>'
      +'<button class="tpl-icon-btn save" onclick="updateTpl(\''+esc(n)+'\')" title="Save current squad to this template"><i class="fas fa-floppy-disk"></i></button>'
      +'<button class="tpl-icon-btn del" onclick="delTpl(\''+esc(n)+'\')" title="Delete"><i class="fas fa-trash-can"></i></button>'
      +'</div>';
  }).join('');
}

// ─── SETTINGS PANEL ───────────────────────────────────────────────────────────
function openSettings(){
  el.sun.value=state.usN;
  el.son.value=state.oppN==='Opposition'?'':state.oppN;
  document.getElementById('sloc').value=state.location||'';
  document.getElementById('sref').value=state.referee||'';
  const isFootball = state.sport === 'football';
  const is13 = state.teamSize === 13;
  document.getElementById('sport-chk').checked = isFootball;
  document.getElementById('size-chk').checked = is13;
  const shotlocIcon = document.getElementById('shotloc-icon');
  if (shotlocIcon) {
    shotlocIcon.className = state.trackShotLocations ? 'fas fa-toggle-on' : 'fas fa-toggle-off';
    shotlocIcon.style.color = state.trackShotLocations ? '#2E7D32' : 'var(--t3)';
  }
  el['starting-lbl'].textContent = 'STARTING '+(state.teamSize||15);
  el.pslist.innerHTML='';
  const sz = state.teamSize || 15;
  for(let i=1;i<=sz;i++) el.pslist.appendChild(buildPlayerRow(i));
  renderBench(); renderTpls();
  document.getElementById('setovly').classList.add('open');
  el.setpanel.classList.add('open');
  _initTypeahead(el.sun);
  _initTypeahead(el.son);
}

function closeSettings(){ flushSettings(); document.getElementById('setovly').classList.remove('open'); el.setpanel.classList.remove('open'); }

function renderBench(){
  // Ensure maxB reflects all named bench slots in case of any desync
  for(let i=16;i<=30;i++){ if(state.pnames[i])state.maxB=Math.max(state.maxB,i+1); }
  el.bslist.innerHTML='';
  for(let i=16;i<=state.maxB;i++) addBRow(el.bslist,i);
}

function addBRow(c,idx){
  const row=document.createElement('div'); row.className='prow'; row.id='br'+idx;
  row.innerHTML='<span class="drag-handle" title="Drag to swap player"><i class="fas fa-grip-vertical"></i></span><div class="pbadge sub">'+idx+'</div><input class="sinput" id="sn'+idx+'" type="text" placeholder="'+(idx===16?'Sub GK':'Sub #'+idx)+'" maxlength="30" value="'+esc(gn(idx)||'')+'">';
  c.appendChild(row);
  attachDragHandle(row);
  document.getElementById('sn'+idx).addEventListener('input',function(){
    const ti=parseInt(this.id.replace('sn',''));
    if(this.value.trim()&&ti>=state.maxB){
      state.maxB=ti+1;
      if(!document.getElementById('br'+state.maxB)) addBRow(el.bslist,state.maxB);
    }
  });
}

function flushSettings() {
  state.usN     = el.sun.value.trim()||DEFAULT_US;
  state.oppN    = el.son.value.trim()||'Opposition';
  state.location= (document.getElementById('sloc').value||'').trim();
  state.referee = (document.getElementById('sref').value||'').trim();
  el.uslbl.textContent=state.usN.toUpperCase();
  el.opplbl.textContent=state.oppN.toUpperCase();
  for(let i=1;i<=state.maxB+2;i++){const inp=document.getElementById('sn'+i);if(inp)state.pnames[i]=inp.value.trim();}
  buildInitialsCache();
  refAllBtns();
  saveState();
}

function onSportToggle(checked) {
  flushSettings();
  state.sport = checked ? 'football' : 'hurling';
  saveState();
}

function renderPGrid() {
  const layout = GRID_LAYOUTS[state.teamSize] || GRID_LAYOUTS[15];
  el.pgrid.innerHTML = layout.map(row =>
    '<div class="p-row">'+row.map(s =>
      '<button class="pbtn" data-s="'+s+'" onclick="sel('+s+')">'+s+'</button>'
    ).join('')+'</div>'
  ).join('');
  // Re-apply card/sub/hev classes
  refAllBtns();
}

function setCaptain(slot) {
  state.captain = (state.captain === slot) ? null : slot;
  // Refresh all cap buttons in settings
  document.querySelectorAll('.cap-btn').forEach(b => {
    const s = parseInt(b.dataset.cap);
    const isCap = state.captain === s;
    b.className = 'cap-btn ' + (isCap ? 'active' : 'inactive');
    b.querySelector('i').className = 'fa-regular ' + (isCap ? 'fa-copyright' : 'fa-circle');
  });
  refAllBtns();
  saveState();
}

// ─── DRAG-TO-SWAP PLAYER NAMES ───────────────────────────────────────────────
let _drag = null;

function _dragMove(e) {
  if (!_drag) return;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  _drag.ghost.style.top = (clientY - _drag.offsetY) + 'px';
  _drag.ghost.style.visibility = 'hidden';
  const under = document.elementFromPoint(clientX, clientY);
  _drag.ghost.style.visibility = '';
  const targetRow = under && under.closest('.prow');
  if (_drag.over && _drag.over !== targetRow) _drag.over.classList.remove('drag-over');
  _drag.over = null;
  if (targetRow && targetRow !== _drag.row && targetRow.parentElement === _drag.row.parentElement) {
    targetRow.classList.add('drag-over');
    _drag.over = targetRow;
  }
}

function _dragEnd() {
  if (!_drag) return;
  const { row, over, ghost } = _drag;
  if (over) {
    over.classList.remove('drag-over');
    const srcIn = row.querySelector('.sinput');
    const tgtIn = over.querySelector('.sinput');
    const tmp = srcIn.value; srcIn.value = tgtIn.value; tgtIn.value = tmp;
    // Swap captain designation so it follows the player name
    const srcSlot = parseInt(srcIn.id.replace('sn',''));
    const tgtSlot = parseInt(tgtIn.id.replace('sn',''));
    if (state.captain === srcSlot) state.captain = tgtSlot;
    else if (state.captain === tgtSlot) state.captain = srcSlot;
    document.querySelectorAll('.cap-btn').forEach(b => {
      const s = parseInt(b.dataset.cap);
      const isCap = state.captain === s;
      b.className = 'cap-btn '+(isCap?'active':'inactive');
      b.querySelector('i').className = 'fa-regular '+(isCap?'fa-copyright':'fa-circle');
    });
  }
  row.classList.remove('dragging');
  ghost.remove();
  _drag = null;
  document.removeEventListener('mousemove', _dragMove);
  document.removeEventListener('mouseup', _dragEnd);
  document.removeEventListener('touchmove', _dragMove);
  document.removeEventListener('touchend', _dragEnd);
}

function _dragStart(e, row) {
  e.preventDefault();
  const rect = row.getBoundingClientRect();
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  const ghost = row.cloneNode(true);
  ghost.style.cssText = 'position:fixed;pointer-events:none;z-index:9999;width:'+rect.width+'px;opacity:0.9;background:var(--bg1);border-radius:var(--r);box-shadow:0 4px 20px rgba(0,0,0,0.18);left:'+rect.left+'px;top:'+rect.top+'px;padding:7px 0;';
  document.body.appendChild(ghost);
  row.classList.add('dragging');
  _drag = { row, ghost, offsetY: clientY - rect.top, over: null };
  document.addEventListener('mousemove', _dragMove);
  document.addEventListener('mouseup', _dragEnd);
  document.addEventListener('touchmove', _dragMove, {passive:false});
  document.addEventListener('touchend', _dragEnd);
}

function attachDragHandle(row) {
  const h = row.querySelector('.drag-handle');
  if (!h) return;
  h.addEventListener('mousedown', e => _dragStart(e, row));
  h.addEventListener('touchstart', e => _dragStart(e, row), {passive:false});
}

function buildPlayerRow(i) {
  const isCap = state.captain === i;
  const row = document.createElement('div'); row.className='prow';
  row.innerHTML = '<span class="drag-handle" title="Drag to swap player"><i class="fas fa-grip-vertical"></i></span>'
    +'<div class="pbadge'+(i===1?' gk':'')+'">'+i+'</div>'
    +'<input class="sinput" id="sn'+i+'" type="text" placeholder="'+(i===1?'Goalkeeper':'Player '+i)+'" maxlength="30" value="'+esc(gn(i)||'')+'">'
    +'<button type="button" class="cap-btn '+(isCap?'active':'inactive')+'" data-cap="'+i+'" onclick="setCaptain('+i+')" title="Set captain"><i class="fa-regular '+(isCap?'fa-copyright':'fa-circle')+'"></i></button>';
  attachDragHandle(row);
  return row;
}

function onSizeToggle(checked) {
  flushSettings();
  const size = checked ? 13 : 15;
  state.teamSize = size;
  el['starting-lbl'].textContent = 'STARTING ' + size;
  renderPGrid();
  // Rebuild player list in settings panel
  el.pslist.innerHTML='';
  for(let i=1;i<=size;i++) el.pslist.appendChild(buildPlayerRow(i));
  saveState();
}

function onShotLocToggle() {
  state.trackShotLocations = !state.trackShotLocations;
  saveState();
  const icon = document.getElementById('shotloc-icon');
  if (icon) {
    icon.className = state.trackShotLocations ? 'fas fa-toggle-on' : 'fas fa-toggle-off';
    icon.style.color = state.trackShotLocations ? '#2E7D32' : 'var(--t3)';
  }
}

// ─── TEAM NAME TYPEAHEAD ──────────────────────────────────────────────────────
const _TA_ITEMS = [
  ...MEATH_CLUBS.map(c => ({name: c.name, crest: c.crest})),
  ...COUNTIES.map(n => ({name: n, crest: 'crests/' + n.toLowerCase() + '.png'})),
];

function _initTypeahead(input) {
  if (input._taInit) return;
  input._taInit = true;

  if (!document.getElementById('ta-style')) {
    const s = document.createElement('style');
    s.id = 'ta-style';
    s.textContent = '.ta-item:hover,.ta-item:active{background:var(--bg2);}';
    document.head.appendChild(s);
  }

  const drop = document.createElement('div');
  drop.style.cssText = 'position:fixed;z-index:9999;background:var(--bg1);border:.5px solid var(--bm);'
    + 'border-radius:var(--r);overflow-y:auto;max-height:220px;display:none;'
    + 'box-shadow:0 4px 16px rgba(0,0,0,0.14);-webkit-overflow-scrolling:touch;';
  document.body.appendChild(drop);

  const pos = () => {
    const r = input.getBoundingClientRect();
    drop.style.left  = r.left + 'px';
    drop.style.top   = (r.bottom + 2) + 'px';
    drop.style.width = r.width + 'px';
  };

  const close = () => { drop.style.display = 'none'; };

  const pick = (name) => {
    input.value = name;
    flushSettings();
    close();
  };

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (q.length < 1) { close(); return; }

    const starts   = _TA_ITEMS.filter(i => i.name.toLowerCase().startsWith(q));
    const contains = _TA_ITEMS.filter(i => !i.name.toLowerCase().startsWith(q) && i.name.toLowerCase().includes(q));
    const matches  = [...starts, ...contains].slice(0, 8);

    if (!matches.length) { close(); return; }

    drop.innerHTML = matches.map(item =>
      `<div class="ta-item" data-name="${esc(item.name)}" `
      + `style="display:flex;align-items:center;gap:10px;padding:9px 12px;cursor:pointer;font-size:14px;color:var(--t1);">`
      + `<img src="${esc(item.crest)}" style="width:26px;height:26px;object-fit:contain;flex-shrink:0;" onerror="this.style.display='none'">`
      + `<span>${esc(item.name)}</span></div>`
    ).join('');

    drop.querySelectorAll('.ta-item').forEach(row => {
      row.addEventListener('mousedown', e => { e.preventDefault(); pick(row.dataset.name); });
      row.addEventListener('touchend',  e => { e.preventDefault(); pick(row.dataset.name); });
    });

    pos();
    drop.style.display = 'block';
  });

  input.addEventListener('blur',    () => setTimeout(close, 200));
  input.addEventListener('keydown', e  => { if (e.key === 'Escape') { close(); input.blur(); } });
}
