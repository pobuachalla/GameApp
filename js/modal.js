'use strict';

// ─── MODAL ────────────────────────────────────────────────────────────────────
function handleModalClick(e) {
  const btn = e.target.closest('.abtn');
  if (btn && modalHandlerRef) {
    modalHandlerRef(btn.getAttribute('data-v'));
  }
}

function showOpts(title, opts, handler, rich) {
  el.mtitle.textContent = title;
  let html = '';
  if (rich) {
    html += '<div class="opts-grid">';
    opts.forEach(o => html += '<button class="abtn" data-v="'+esc(String(o.val))+'" style="text-align:left;"><div class="sarow"><span style="font-size:15px;color:var(--t1);">'+esc(o.label)+'</span>'+(o.sub?'<span style="font-size:11px;color:var(--t2);">'+esc(o.sub)+'</span>':'')+'</div></button>');
    html += '</div>';
  } else {
    const optsSet = new Set(opts);
    const rendered = new Set();
    ACTION_GROUPS.forEach(group => {
      const groupItems = group.items.filter(i => optsSet.has(i));
      if (!groupItems.length) return;
      html += '<div class="action-group"><div class="action-group-label">'+group.label+'</div><div class="opts-grid">';
      groupItems.forEach(o => {
        rendered.add(o);
        const meta = ACTION_META[o] || {cls:'', icon:''};
        html += '<button class="abtn '+meta.cls+'" data-v="'+esc(o)+'">'+meta.icon+esc(o)+'</button>';
      });
      html += '</div></div>';
    });
    // Fallback for any opts not in groups (e.g. Won/Lost/result screens)
    const ungrouped = opts.filter(o => !rendered.has(o));
    if (ungrouped.length) {
      html += '<div class="opts-grid">';
      ungrouped.forEach(o => {
        let icon = '';
        let btnStyle = '';
        if (o==='Won'||o==='Win')   { icon = '<i class="fas fa-thumbs-up"></i>';   btnStyle = 'background:#2E7D32;color:#fff;border-color:#2E7D32;'; }
        if (o==='Lost'||o==='Loss') { icon = '<i class="fas fa-thumbs-down"></i>'; btnStyle = 'background:#C62828;color:#fff;border-color:#C62828;'; }
        html += '<button class="abtn" data-v="'+esc(o)+'" style="'+btnStyle+'">'+icon+esc(o)+'</button>';
      });
      html += '</div>';
    }
  }
  el.mopts.innerHTML = html;
  el.modal.style.display = 'block';
  modalHandlerRef = (v) => { handler(v); };
  el.mopts.addEventListener('click', handleModalClick);
}

function closeMod() {
  el.modal.dataset.cancelAction = '';
  el.modal.style.display = 'none';
  modalHandlerRef = null;
  el.mopts.removeEventListener('click', handleModalClick);
  selSlot=null; pendAct=null; subOff=null;
  // Reset cancel button text
  const cancelBtn = el.modal.querySelector('button[onclick="closeMod()"]');
  if (cancelBtn) cancelBtn.textContent = 'Cancel';
}
