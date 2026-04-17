'use strict';

// ─── SHARE ────────────────────────────────────────────────────────────────────
function shareWA() {
  const u=usTotal(), o=oppTotal();
  const lines=['*'+state.usN+': '+state.goals+'-'+state.pts+' ('+u+') v '+state.oppN+': '+state.og+'-'+state.op_+' ('+o+')*','*Time: '+fmt(state.secs)+'*',''];
  state.evts.forEach(e => lines.push(e.time+'  '+e.desc));
  window.open('https://wa.me/?text='+encodeURIComponent(lines.join('\n')),'_blank');
}

function shareCSV() {
  const csvEsc = v => '"' + String(v||'').replace(/"/g,'""') + '"';
  const rows = [['Time','Event','Description','zone_id','zone_x','zone_y']];
  state.evts.forEach(e => rows.push([e.time, e.badge, e.desc, e.zone?e.zone.id:'', e.zone?e.zone.coords.x.toFixed(4):'', e.zone?e.zone.coords.y.toFixed(4):'']));
  const csv = rows.map(r => r.map(csvEsc).join(',')).join('\r\n');
  const date = new Date().toISOString().slice(0,10);
  const safe = (state.usN||'match').replace(/[^a-z0-9]/gi,'_');
  const filename = safe+'_'+date+'.csv';
  const blob = new Blob([csv], {type:'text/csv'});
  if (navigator.share && navigator.canShare && navigator.canShare({files:[new File([blob],filename,{type:'text/csv'})]})) {
    navigator.share({files:[new File([blob],filename,{type:'text/csv'})], title:filename})
      .catch(()=>{});
  } else {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    setTimeout(()=>URL.revokeObjectURL(a.href),10000);
  }
}

// ─── LOG PANEL ────────────────────────────────────────────────────────────────
function openLog()  { document.getElementById('logovly').classList.add('open'); el.logpanel.classList.add('open'); tail(); }
function closeLog() { document.getElementById('logovly').classList.remove('open'); el.logpanel.classList.remove('open'); }
