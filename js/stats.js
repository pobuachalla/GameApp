'use strict';

// ─── SCORE TIMELINE ───────────────────────────────────────────────────────────
function buildTimelineHTML() {
  const toSecs = s => { const p=(s||'0:00').split(':'); return parseInt(p[0]||0)*60+(parseInt(p[1]||0)); };
  let usG=0,usP=0,oppG=0,oppP=0,halfSecs=0,inH2=false;
  const data = [{secs:0,us:0,opp:0}];
  const subs=[], reds=[], blacks=[], markers=[];

  state.evts.forEach(ev => {
    let t = toSecs(ev.time);
    if (ev.badge==='1H') { halfSecs=t; return; }
    if (ev.badge==='2H') { inH2=true; return; }
    if (inH2) t += halfSecs;
    const prevUs=usG*3+usP, prevOpp=oppG*3+oppP;
    let mType=null, mTeam='us';
    if      (ev.action==='Goal')       { usG++; mType='Goal'; mTeam='us'; }
    else if (ev.action==='Point')      { usP++; mType='Point'; mTeam='us'; }
    else if (ev.action==='2 Point')    { usP+=2; mType='2 Point'; mTeam='us'; }
    else if (ev.action==='Wide')       { mType='Wide'; mTeam=(ev.badge==='OPP')?'opp':'us'; }
    else if (ev.badge==='OPP') {
      const d=ev.desc||'';
      if      (d.includes('Goal added'))     { oppG++; mType='Goal'; mTeam='opp'; }
      else if (d.includes('2 Point added'))  { oppP+=2; mType='2 Point'; mTeam='opp'; }
      else if (d.includes('Point added'))    { oppP++; mType='Point'; mTeam='opp'; }
      else if (d.includes('Goal removed'))   oppG=Math.max(0,oppG-1);
      else if (d.includes('Point removed'))  oppP=Math.max(0,oppP-1);
    } else if (ev.badge==='ADJ') {
      const d=ev.desc||'';
      if      (d.includes('Goal added'))     { usG++; mType='Goal'; mTeam='us'; }
      else if (d.includes('2 Point added'))  { usP+=2; mType='2 Point'; mTeam='us'; }
      else if (d.includes('Point added'))    { usP++; mType='Point'; mTeam='us'; }
      else if (d.includes('Goal removed'))   usG=Math.max(0,usG-1);
      else if (d.includes('Point removed'))  usP=Math.max(0,usP-1);
    } else if (ev.action==='sub')        { subs.push({secs:t}); }
      else if (ev.action==='Red Card')   { reds.push({secs:t}); }
      else if (ev.action==='Black Card') { blacks.push({secs:t}); }
    const curUs=usG*3+usP, curOpp=oppG*3+oppP;
    if (mType) markers.push({secs:t, team:mTeam, type:mType, usScore:curUs, oppScore:curOpp});
    if (curUs!==prevUs||curOpp!==prevOpp||mType==='Wide') data.push({secs:t,us:curUs,opp:curOpp});
  });

  if (data.length < 2) return '';

  const totalSecs = Math.max(data[data.length-1].secs, halfSecs||1);
  data.push({secs:totalSecs, us:usG*3+usP, opp:oppG*3+oppP});
  const maxPts = Math.max(...data.map(d=>Math.max(d.us,d.opp)),1);

  const W=272,H=100,PL=24,PR=8,PT=8,PB=18;
  const cw=W-PL-PR, ch=H-PT-PB;
  const x=s=>(PL+(s/totalSecs)*cw).toFixed(1);
  const y=p=>(PT+ch-(p/maxPts)*ch).toFixed(1);
  const usLine  = data.map(d=>x(d.secs)+','+y(d.us)).join(' ');
  const oppLine = data.map(d=>x(d.secs)+','+y(d.opp)).join(' ');
  const yMid=Math.round(maxPts/2);

  let svg=`<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="width:100%;display:block;">`;
  svg+=`<line x1="${PL}" y1="${PT+ch}" x2="${PL+cw}" y2="${PT+ch}" stroke="var(--b)" stroke-width="1"/>`;
  svg+=`<text x="${PL-4}" y="${y(0)+4}" text-anchor="end" font-size="9" fill="var(--t3)">0</text>`;
  svg+=`<text x="${PL-4}" y="${parseFloat(y(yMid))+4}" text-anchor="end" font-size="9" fill="var(--t3)">${yMid}</text>`;
  svg+=`<text x="${PL-4}" y="${parseFloat(y(maxPts))+4}" text-anchor="end" font-size="9" fill="var(--t3)">${maxPts}</text>`;
  svg+=`<text x="${PL}" y="${H-2}" text-anchor="middle" font-size="9" fill="var(--t3)">0'</text>`;
  if (halfSecs>0) {
    svg+=`<line x1="${x(halfSecs)}" y1="${PT}" x2="${x(halfSecs)}" y2="${PT+ch}" stroke="var(--bm)" stroke-width="1" stroke-dasharray="3 2"/>`;
    svg+=`<text x="${x(halfSecs)}" y="${H-2}" text-anchor="middle" font-size="9" fill="var(--t3)">HT</text>`;
  }
  svg+=`<text x="${x(totalSecs)}" y="${H-2}" text-anchor="middle" font-size="9" fill="var(--t3)">${Math.round(totalSecs/60)}'</text>`;
  subs.forEach(e   => { const sx=x(e.secs); svg+=`<line x1="${sx}" y1="${PT}" x2="${sx}" y2="${PT+ch}" stroke="#F59E0B" stroke-width="1.5" stroke-dasharray="2 2"/>`; });
  reds.forEach(e   => { const sx=x(e.secs); svg+=`<line x1="${sx}" y1="${PT}" x2="${sx}" y2="${PT+ch}" stroke="#E53935" stroke-width="1.5" stroke-dasharray="2 2"/>`; });
  blacks.forEach(e => { const sx=x(e.secs); svg+=`<line x1="${sx}" y1="${PT}" x2="${sx}" y2="${PT+ch}" stroke="#2c2c2a" stroke-width="1.5" stroke-dasharray="2 2"/>`; });
  svg+=`<polyline points="${oppLine}" fill="none" stroke="#C62828" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;
  svg+=`<polyline points="${usLine}"  fill="none" stroke="#2E7D32" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;
  markers.forEach(m => {
    const cx=x(m.secs), cy=y(m.team==='us'?m.usScore:m.oppScore);
    if      (m.type==='Goal')    svg+=`<circle cx="${cx}" cy="${cy}" r="3.5" fill="#2E7D32" stroke="#fff" stroke-width="1.2"/>`;
    else if (m.type==='2 Point') svg+=`<circle cx="${cx}" cy="${cy}" r="3"   fill="#F59E0B" stroke="#fff" stroke-width="1.2"/>`;
    else if (m.type==='Point')   svg+=`<circle cx="${cx}" cy="${cy}" r="3"   fill="#fff"    stroke="#9A9E99" stroke-width="1.2"/>`;
    else if (m.type==='Wide')    svg+=`<circle cx="${cx}" cy="${cy}" r="2"   fill="#9E9E9E" stroke="none"/>`;
  });
  svg+='</svg>';

  let h='<div class="stat-section"><div class="stat-section-title">Score Timeline</div><div class="stat-card" style="padding:10px 8px 8px;">';
  h+=svg;
  h+='<div style="display:flex;gap:16px;justify-content:center;margin-top:6px;flex-wrap:wrap;">';
  h+=`<span style="font-size:11px;color:var(--t2);display:flex;align-items:center;gap:4px;"><span style="display:inline-block;width:16px;height:2px;background:#2E7D32;border-radius:1px;vertical-align:middle;"></span>${esc(state.usN)}</span>`;
  h+=`<span style="font-size:11px;color:var(--t2);display:flex;align-items:center;gap:4px;"><span style="display:inline-block;width:16px;height:2px;background:#C62828;border-radius:1px;vertical-align:middle;"></span>${esc(state.oppN)}</span>`;
  if (subs.length)   h+=`<span style="font-size:11px;color:var(--t2);display:flex;align-items:center;gap:4px;"><span style="display:inline-block;width:14px;height:0;border-top:2px dashed #F59E0B;vertical-align:middle;"></span>Sub</span>`;
  if (reds.length)   h+=`<span style="font-size:11px;color:var(--t2);display:flex;align-items:center;gap:4px;"><span style="display:inline-block;width:14px;height:0;border-top:2px dashed #E53935;vertical-align:middle;"></span>Red</span>`;
  if (blacks.length) h+=`<span style="font-size:11px;color:var(--t2);display:flex;align-items:center;gap:4px;"><span style="display:inline-block;width:14px;height:0;border-top:2px dashed #2c2c2a;vertical-align:middle;"></span>Black</span>`;
  h+='</div></div></div>';
  return h;
}

// ─── SUBSTITUTIONS TABLE ──────────────────────────────────────────────────────
function buildSubTableHTML() {
  const hasSubs = state.evts.some(ev=>ev.action==='sub');
  if (!hasSubs) return '';

  let usG=0,usP=0,oppG=0,oppP=0;
  const scoreAt=[];
  state.evts.forEach(ev => {
    if      (ev.action==='Goal')      usG++;
    else if (ev.action==='Point')     usP++;
    else if (ev.action==='2 Point')   usP+=2;
    else if (ev.badge==='OPP') {
      const d=ev.desc||'';
      if      (d.includes('Goal added'))    oppG++;
      else if (d.includes('2 Point added')) oppP+=2;
      else if (d.includes('Point added'))   oppP++;
      else if (d.includes('Goal removed'))  oppG=Math.max(0,oppG-1);
      else if (d.includes('Point removed')) oppP=Math.max(0,oppP-1);
    } else if (ev.badge==='ADJ') {
      const d=ev.desc||'';
      if      (d.includes('Goal added'))   usG++;
      else if (d.includes('2 Point added'))usP+=2;
      else if (d.includes('Point added'))  usP++;
      else if (d.includes('Goal removed')) usG=Math.max(0,usG-1);
      else if (d.includes('Point removed'))usP=Math.max(0,usP-1);
    }
    scoreAt.push({usG,usP,oppG,oppP});
  });

  const fUsG=usG,fUsP=usP,fOppG=oppG,fOppP=oppP;

  let h='<div class="stat-section"><div class="stat-section-title">Substitutions</div><div class="stat-card" style="padding:0;overflow:hidden;">';
  h+='<div style="display:flex;align-items:center;padding:7px 12px;background:var(--bg3);border-bottom:.5px solid var(--b);gap:6px;">';
  h+='<span style="font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--t3);min-width:38px;">Time</span>';
  h+='<span style="font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--t3);flex:1;">On</span>';
  h+='<span style="font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--t3);flex:1;">Off</span>';
  h+='<span style="font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--t3);min-width:60px;text-align:right;">Score</span>';
  h+='</div>';

  state.evts.forEach((ev,i)=>{
    if (ev.action!=='sub') return;
    const at=scoreAt[i]||{usG:0,usP:0,oppG:0,oppP:0};
    const aUG=fUsG-at.usG, aUP=fUsP-at.usP, aOG=fOppG-at.oppG, aOP=fOppP-at.oppP;
    const m=ev.desc.match(/Sub: (.+) off \/ (.+) on \(pos (\d+)\)/);
    const offName=m?m[1]:'?', onName=m?m[2]:'?', pos=m?m[3]:'';
    const scoreNow=at.usG+'-'+at.usP+' v '+at.oppG+'-'+at.oppP;
    const afterUs='+'+aUG+'-'+aUP, afterOpp='+'+aOG+'-'+aOP;
    h+='<div style="display:flex;align-items:flex-start;padding:8px 12px;border-bottom:.5px solid var(--b);gap:6px;">';
    h+='<span style="font-size:12px;color:var(--t3);min-width:38px;padding-top:1px;">'+ev.time+'</span>';
    h+='<div style="flex:1;min-width:0;">';
    h+='<div style="font-size:13px;font-weight:500;color:var(--t1);">'+esc(onName)+'</div>';
    if (pos) h+='<div style="font-size:10px;color:var(--t3);">Pos '+pos+'</div>';
    h+='</div>';
    h+='<div style="flex:1;min-width:0;">';
    h+='<div style="font-size:13px;color:var(--t2);">'+esc(offName)+'</div>';
    h+='</div>';
    h+='<div style="min-width:60px;text-align:right;">';
    h+='<div style="font-size:11px;color:var(--t3);">'+scoreNow+'</div>';
    h+='<div style="font-size:10px;color:var(--t3);margin-top:2px;"><span style="color:#2E7D32;">'+afterUs+'</span> / <span style="color:#C62828;">'+afterOpp+'</span></div>';
    h+='</div>';
    h+='</div>';
  });

  h+='<div style="padding:7px 12px;font-size:10px;color:var(--t3);">After = goals-pts scored from sub on ('+esc(state.usN)+' / '+esc(state.oppN)+')</div>';
  h+='</div></div>';
  return h;
}

// ─── HALF-TIME REPORT ─────────────────────────────────────────────────────────
function showHalfTimeReport() {
  let scores=0,wides=0;
  const pstats={};
  for (const ev of state.evts) {
    if (ev.badge==='1H' && (ev.desc||'').includes('ended')) break;
    if (!ev.action) continue;
    if      (ev.action==='Goal')     scores++;
    else if (ev.action==='Point')    scores++;
    else if (ev.action==='2 Point')  scores++;
    else if (ev.action==='Wide')     wides++;
    if (!ev.slot) continue;
    const pi = ev.pi != null ? ev.pi : state.slotp[ev.slot]; if (!pi) continue;
    if (!pstats[pi]) pstats[pi]={name:gn(pi)||('#'+pi),g:0,p:0};
    if (ev.action==='Goal') pstats[pi].g++;
    if (ev.action==='Point'||ev.action==='2 Point') pstats[pi].p++;
  }
  const attempts=scores+wides;
  const eff=attempts>0?Math.round(scores/attempts*100)+'%':'—';
  const top=Object.values(pstats).filter(s=>s.g+s.p>0).sort((a,b)=>(b.g*3+b.p)-(a.g*3+a.p));
  const usPts=state.goals*3+state.pts, oppPts=state.og*3+state.op_;
  const lead=usPts>oppPts?esc(state.usN)+' lead by '+(usPts-oppPts)+' pt'+(usPts-oppPts!==1?'s':'')
            :usPts<oppPts?esc(state.oppN)+' lead by '+(oppPts-usPts)+' pt'+(oppPts-usPts!==1?'s':'')
            :'Level';
  const row=(l,v)=>'<div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:.5px solid var(--b);">'
    +'<span style="font-size:13px;color:var(--t2);">'+l+'</span>'
    +'<span style="font-size:13px;font-weight:600;color:var(--t1);">'+v+'</span></div>';

  el.mtitle.textContent='Half Time';
  let h = html`<div style="display:flex;justify-content:space-around;align-items:center;padding:8px 0 14px;border-bottom:.5px solid var(--b);margin-bottom:12px;">`;
  h += html`<div style="text-align:center;"><div style="font-size:11px;color:var(--t2);margin-bottom:4px;">${state.usN}</div>`;
  h += `<div style="font-size:30px;font-weight:600;color:var(--ts);line-height:1;">${state.goals}-${state.pts}</div>`;
  h += `<div style="font-size:11px;color:var(--t3);">(${usPts}pts)</div></div>`;
  h += `<div style="font-size:12px;color:var(--t3);text-align:center;max-width:70px;">${lead}</div>`;
  h += html`<div style="text-align:center;"><div style="font-size:11px;color:var(--t2);margin-bottom:4px;">${state.oppN}</div>`;
  h += `<div style="font-size:30px;font-weight:600;color:var(--t1);line-height:1;">${state.og}-${state.op_}</div>`;
  h += `<div style="font-size:11px;color:var(--t3);">(${oppPts}pts)</div></div>`;
  h += '</div>';
  h += row('Shooting Efficiency', eff);
  h += row('Scores / Attempts', scores+' / '+attempts);
  if (top.length) h += row('Top Scorer', html`${top[0].name} (${top[0].g}-${top[0].p})`);
  if (top.length>1) h += html`<div style="font-size:11px;color:var(--t3);padding:5px 0 0;">Also: ${top.slice(1,4).map(s=>`${esc(s.name)} ${s.g}-${s.p}`).join(', ')}</div>`;

  el.mopts.innerHTML=h;
  el.modal.style.display='block';
  el.modal.dataset.cancelAction='dismiss';
  const cancelBtn=el.modal.querySelector('button[onclick="closeMod()"]');
  if (cancelBtn) cancelBtn.textContent='Continue';
}

// ─── STATS HELPERS ────────────────────────────────────────────────────────────
function rstBlock(label, won, lost, unclear, total) {
  let out = '<div class="stat-sub-hdr" style="margin-top:0;">'+label+'</div>';
  if (total === 0) {
    out += '<div style="font-size:13px;color:var(--t3);padding:2px 0 10px;">None recorded</div>';
  } else {
    const pct = Math.round(won / total * 100);
    out += '<div class="stat-split-bar"><div class="stat-split-won" style="width:'+pct+'%"></div></div>';
    out += '<div class="stat-split-labels">';
    out += '<span style="color:#2E7D32;font-weight:600;">'+won+' won <span style="font-weight:400;">('+pct+'%)</span></span>';
    out += '<span style="color:#C62828;font-weight:600;">'+lost+' lost'+(unclear?' <span style="font-weight:400;color:var(--t2);">+'+unclear+' unclear</span>':'')+'</span>';
    out += '</div>';
  }
  return out;
}

// ─── STATS PANEL ──────────────────────────────────────────────────────────────
function openStats() {
  renderStats();
  document.getElementById('match-notes-input').value = state.matchNotes || '';
  document.getElementById('statsoverlay').classList.add('open');
  document.getElementById('statspanel').classList.add('open');
}

function closeStats() {
  document.getElementById('statsoverlay').classList.remove('open');
  document.getElementById('statspanel').classList.remove('open');
}

function renderStats() {
  document.getElementById('stats-content').innerHTML = buildStatsHTML();
}

function buildStatsHTML() {
  let goalCount=0, ptCount=0, twoPtCount=0, wideCount=0;
  let placedGoals=0, placedPts=0, placedTwoPts=0, placedWides=0;
  let ownWon=0, ownLost=0, ownUnclear=0;
  let oppWon=0, oppLost=0, oppUnclear=0;
  let turnoversWon=0, turnoversLost=0;
  const pstats = {};

  state.evts.forEach(ev => {
    if (ev.badge === 'RSTR') {
      const d = ev.desc || '';
      const won = d.includes(': Won'), lost = d.includes(': Lost');
      if (d.startsWith('Own Restart')) {
        if (won) ownWon++; else if (lost) ownLost++; else ownUnclear++;
      } else if (d.startsWith("Opposition")) {
        if (won) oppWon++; else if (lost) oppLost++; else oppUnclear++;
      }
      return;
    }
    if (!ev.action || !ev.slot) return;
    const pi = ev.pi != null ? ev.pi : state.slotp[ev.slot];
    if (!pi) return;
    const placed = PLACED_BALL.has(ev.sec);
    if (!pstats[pi]) pstats[pi] = {name:pl(pi),gPlay:0,gPlaced:0,pPlay:0,pPlaced:0,wides:0,yc:0,rc:0,bc:0,twon:0,tlost:0,frees:{}};
    const ps = pstats[pi];
    if (ev.action === 'Goal')     { goalCount++;   placed ? (placedGoals++,  ps.gPlaced++) : ps.gPlay++; }
    else if (ev.action === 'Point')    { ptCount++;    placed ? (placedPts++,   ps.pPlaced++) : ps.pPlay++; }
    else if (ev.action === '2 Point')  { twoPtCount++; placed ? (placedTwoPts++,ps.pPlaced+=2) : ps.pPlay+=2; }
    else if (ev.action === 'Wide')     { wideCount++;  ps.wides++; if (placed) placedWides++; }
    else if (ev.action === 'Yellow Card') ps.yc++;
    else if (ev.action === 'Red Card')   ps.rc++;
    else if (ev.action === 'Black Card') ps.bc++;
    else if (ev.action === 'Turnover Won')  { turnoversWon++;  ps.twon++; }
    else if (ev.action === 'Turnover Lost') { turnoversLost++; ps.tlost++; }
    else if (ev.action === 'Free') { const ft = ev.sec || 'Other'; ps.frees[ft] = (ps.frees[ft]||0) + 1; }
  });

  const totalScoreActions = goalCount + ptCount + twoPtCount;
  const totalAttempts = totalScoreActions + wideCount;
  const scorePct = totalAttempts > 0 ? Math.round(totalScoreActions / totalAttempts * 100) : 0;
  const totalPts = goalCount*3 + ptCount + twoPtCount*2;
  const displayPts = ptCount + twoPtCount*2;
  const placedScoreCount = placedGoals + placedPts + placedTwoPts;
  const placedAttempts = placedScoreCount + placedWides;
  const placedPct = placedAttempts > 0 ? Math.round(placedScoreCount / placedAttempts * 100) : 0;
  const totalTurnovers = turnoversWon + turnoversLost;
  const ownTotal = ownWon + ownLost + ownUnclear;
  const oppTotal = oppWon + oppLost + oppUnclear;

  if (!totalAttempts && !ownTotal && !oppTotal && !state.og && !state.op_) {
    return '<div style="text-align:center;padding:48px 0 20px;font-size:14px;color:var(--t2);">No stats to show yet<br><span style="font-size:12px;">Start recording events to see stats here.</span></div>';
  }

  // Momentum calculation
  const usMom  = (state.goals*3 + state.pts)  + (ownWon  + oppWon)  * 2 + turnoversWon;
  const oppMom = (state.og*3   + state.op_)   + (ownLost + oppLost) * 2 + turnoversLost;
  const momTotal = usMom + oppMom;
  const usPct  = momTotal > 0 ? Math.round(usMom  / momTotal * 100) : 50;
  const oppPct = momTotal > 0 ? 100 - usPct : 50;
  const dominant = usPct > oppPct ? state.usN : usPct < oppPct ? state.oppN : null;

  let h = '';
  h += buildTimelineHTML();

  // Momentum bar
  h += '<div class="stat-section"><div class="stat-section-title">Momentum</div>';
  h += '<div class="momentum-card">';
  h += '<div class="momentum-bar">';
  h += '<div class="momentum-us" style="width:'+usPct+'%"></div>';
  h += '<div class="momentum-opp"></div>';
  h += '</div>';
  h += '<div class="momentum-feet">';
  h += html`<div class="momentum-team">`;
  h += html`<span class="momentum-name" style="color:#2E7D32;">${state.usN}</span>`;
  h += `<span class="momentum-pct" style="color:#2E7D32;">${usPct}%</span>`;
  h += '</div>';
  h += html`<div class="momentum-team right">`;
  h += html`<span class="momentum-name">${state.oppN}</span>`;
  h += `<span class="momentum-pct" style="color:#6B6F66;">${oppPct}%</span>`;
  h += '</div>';
  h += '</div>';
  const basisNote = (ownTotal+oppTotal > 0 && totalTurnovers > 0) ? 'Scores + restarts + turnovers'
    : (ownTotal+oppTotal > 0) ? 'Scores + restarts won'
    : totalTurnovers > 0 ? 'Scores + turnovers'
    : 'Based on scores';
  const domNote = dominant ? ' &mdash; '+esc(dominant)+' dominant' : '';
  h += '<div class="momentum-basis">'+basisNote+domNote+'</div>';
  h += '</div></div>';

  // Scoring
  h += '<div class="stat-section"><div class="stat-section-title">Scoring</div><div class="stat-card">';
  h += '<div class="stat-big">'+goalCount+'-'+displayPts+' <span style="font-size:15px;font-weight:500;color:var(--t2);">('+totalPts+'pts)</span></div>';
  h += '<div class="stat-big-sub">'+totalScoreActions+' score'+(totalScoreActions!==1?'s':'')+' from '+totalAttempts+' attempt'+(totalAttempts!==1?'s':'')+' &mdash; '+scorePct+'% conversion</div>';
  if (totalAttempts > 0) {
    const bt = totalAttempts;
    const gw = goalCount/bt*100, tw = twoPtCount/bt*100, pw = ptCount/bt*100, ww = wideCount/bt*100;
    h += '<div class="stat-attempt-bar">';
    if (gw > 0) h += '<div class="stat-attempt-seg" style="width:'+gw+'%;background:#2E7D32;"></div>';
    if (tw > 0) h += '<div class="stat-attempt-seg" style="width:'+tw+'%;background:#D97706;"></div>';
    if (pw > 0) h += '<div class="stat-attempt-seg" style="width:'+pw+'%;background:#C8CAC4;"></div>';
    if (ww > 0) h += '<div class="stat-attempt-seg" style="width:'+ww+'%;background:#9E9E9E;"></div>';
    h += '</div>';
    h += '<div class="stat-legend">';
    if (goalCount > 0)  h += '<span class="stat-legend-item"><span class="stat-legend-dot" style="background:#2E7D32;"></span>'+goalCount+' goal'+(goalCount!==1?'s':'')+'</span>';
    if (twoPtCount > 0) h += '<span class="stat-legend-item"><span class="stat-legend-dot" style="background:#D97706;"></span>'+twoPtCount+' 2-ptr'+(twoPtCount!==1?'s':'')+'</span>';
    if (ptCount > 0)    h += '<span class="stat-legend-item"><span class="stat-legend-dot" style="background:#C8CAC4;border:.5px solid var(--b);"></span>'+ptCount+' point'+(ptCount!==1?'s':'')+'</span>';
    if (wideCount > 0)  h += '<span class="stat-legend-item"><span class="stat-legend-dot" style="background:#9E9E9E;"></span>'+wideCount+' wide'+(wideCount!==1?'s':'')+'</span>';
    h += '</div>';
  }
  h += '</div></div>';

  // Placed balls
  h += '<div class="stat-section"><div class="stat-section-title">Placed Balls</div><div class="stat-card">';
  if (placedAttempts === 0) {
    h += '<div style="font-size:13px;color:var(--t2);padding:4px 0;">No placed ball attempts recorded</div>';
  } else {
    const ringGrad = 'conic-gradient(#2E7D32 '+placedPct+'%, var(--bg3) 0%)';
    h += '<div class="stat-ring-wrap">';
    h += '<div class="stat-ring" style="background:'+ringGrad+';">';
    h += '<div class="stat-ring-inner"><div class="stat-ring-pct">'+placedPct+'%</div><div class="stat-ring-lbl">conv.</div></div>';
    h += '</div>';
    h += '<div style="flex:1;">';
    h += '<div style="font-size:16px;font-weight:700;color:#2E7D32;line-height:1.2;">'+placedScoreCount+' converted</div>';
    h += '<div style="font-size:12px;color:var(--t2);margin-top:2px;">from '+placedAttempts+' attempt'+(placedAttempts!==1?'s':'')+'</div>';
    if (placedWides > 0) h += '<div style="font-size:12px;color:var(--t2);margin-top:6px;">'+placedWides+' placed ball wide'+(placedWides!==1?'s':'')+'</div>';
    h += '</div>';
    h += '</div>';
  }
  h += '</div></div>';

  // Restarts
  const rstLabel = state.sport === 'hurling' ? 'Puck Out' : 'Kickout';
  h += '<div class="stat-section"><div class="stat-section-title">Restarts</div><div class="stat-card">';
  h += rstBlock('Own '+rstLabel+'s', ownWon, ownLost, ownUnclear, ownTotal);
  h += '<div style="border-top:.5px solid var(--b);margin:6px 0 10px;"></div>';
  h += rstBlock('Opposition '+rstLabel+'s', oppWon, oppLost, oppUnclear, oppTotal);
  h += '</div></div>';

  // Turnovers
  if (totalTurnovers > 0) {
    const wonPct = Math.round(turnoversWon / totalTurnovers * 100);
    h += '<div class="stat-section"><div class="stat-section-title">Turnovers</div><div class="stat-card">';
    h += '<div style="display:flex;gap:12px;align-items:center;padding:4px 0 10px;">';
    h += '<div style="flex:1;text-align:center;"><div style="font-size:24px;font-weight:700;color:#2E7D32;line-height:1;">'+turnoversWon+'</div><div style="font-size:11px;color:var(--t2);margin-top:2px;">Won</div></div>';
    h += '<div style="flex:1;text-align:center;"><div style="font-size:24px;font-weight:700;color:#C62828;line-height:1;">'+turnoversLost+'</div><div style="font-size:11px;color:var(--t2);margin-top:2px;">Lost</div></div>';
    h += '</div>';
    h += '<div class="stat-split-bar"><div class="stat-split-won" style="width:'+wonPct+'%"></div></div>';
    h += '<div class="stat-split-labels"><span style="color:#2E7D32;font-weight:600;">'+wonPct+'% won</span><span style="color:#C62828;font-weight:600;">'+(100-wonPct)+'% lost</span></div>';
    const twPlayers = Object.values(pstats).filter(p=>p.twon+p.tlost>0).sort((a,b)=>(b.twon-b.tlost)-(a.twon-a.tlost)||a.name.localeCompare(b.name));
    if (twPlayers.length) {
      h += '<div style="border-top:.5px solid var(--b);margin-top:10px;padding-top:6px;">';
      twPlayers.forEach(p => {
        h += html`<div class="stat-prow"><div class="stat-pname">${p.name}</div><div class="stat-ptags">`;
        if (p.twon  > 0) h += `<span class="stat-tag green">+${p.twon}</span>`;
        if (p.tlost > 0) h += `<span class="stat-tag red">-${p.tlost}</span>`;
        h += '</div></div>';
      });
      h += '</div>';
    }
    h += '</div></div>';
  }

  // Player breakdown
  const scorers = Object.values(pstats).filter(p =>
    p.gPlay+p.gPlaced+p.pPlay+p.pPlaced+p.wides > 0
  ).sort((a,b) => {
    const ta = (a.gPlay+a.gPlaced)*3+(a.pPlay+a.pPlaced);
    const tb = (b.gPlay+b.gPlaced)*3+(b.pPlay+b.pPlaced);
    return tb !== ta ? tb - ta : a.name.localeCompare(b.name);
  });

  const disciplined = Object.values(pstats).filter(p =>
    p.yc+p.bc+p.rc > 0
  ).sort((a,b) =>
    (b.rc*100 + b.bc*10 + b.yc) - (a.rc*100 + a.bc*10 + a.yc) || a.name.localeCompare(b.name)
  );

  const freePlayers = Object.values(pstats).filter(p =>
    Object.keys(p.frees).length > 0
  ).sort((a,b) => {
    const ta = Object.values(a.frees).reduce((s,n)=>s+n,0);
    const tb = Object.values(b.frees).reduce((s,n)=>s+n,0);
    return tb - ta || a.name.localeCompare(b.name);
  });

  if (scorers.length > 0 || disciplined.length > 0 || freePlayers.length > 0) {
    h += '<div class="stat-section"><div class="stat-section-title">Player Breakdown</div>';
    if (scorers.length > 0) {
      h += '<div class="stat-sub-hdr" style="margin-top:0;">Scoring</div>';
      h += '<div class="stat-card">';
      scorers.forEach(p => {
        const g = p.gPlay+p.gPlaced, pts = p.pPlay+p.pPlaced, total = g*3+pts;
        h += html`<div class="stat-prow"><div class="stat-pname">${p.name}</div>`;
        h += '<div class="stat-ptags">';
        if (g > 0 || pts > 0) h += `<span class="stat-tag green">${g}-${pts} (${total})</span>`;
        if (p.wides > 0) h += `<span class="stat-tag grey">${p.wides} wide${p.wides!==1?'s':''}</span>`;
        h += '</div></div>';
      });
      h += '</div>';
    }
    if (disciplined.length > 0) {
      h += '<div class="stat-sub-hdr">Cards</div>';
      h += '<div class="stat-card">';
      disciplined.forEach(p => {
        h += html`<div class="disc-row"><div class="stat-pname">${p.name}</div>`;
        h += '<div class="disc-chips">';
        for (let i=0; i<p.yc; i++) h += '<span class="disc-chip" style="background:#FDD835;" title="Yellow Card"></span>';
        for (let i=0; i<p.bc; i++) h += '<span class="disc-chip" style="background:#2c2c2a;" title="Black Card"></span>';
        for (let i=0; i<p.rc; i++) h += '<span class="disc-chip" style="background:#E53935;" title="Red Card"></span>';
        h += '</div></div>';
      });
      h += '</div>';
    }
    if (freePlayers.length > 0) {
      h += '<div class="stat-sub-hdr">Frees Conceded</div>';
      h += '<div class="stat-card">';
      freePlayers.forEach(p => {
        const total = Object.values(p.frees).reduce((s,n)=>s+n,0);
        h += html`<div class="stat-prow"><div class="stat-pname">${p.name}</div>`;
        h += '<div class="stat-ptags">';
        h += `<span class="stat-tag grey">${total} total</span>`;
        Object.entries(p.frees).sort((a,b)=>b[1]-a[1]).forEach(([type,n]) => {
          h += `<span class="stat-tag grey">${esc(type)}${n>1?' ×'+n:''}</span>`;
        });
        h += '</div></div>';
      });
      h += '</div>';
    }
    h += '</div>';
  }

  h += buildSubTableHTML();

  if (state.trackShotLocations) {
    const smHtml = buildShotMapHTML();
    if (smHtml) h += smHtml;
  }

  return h;
}

// ─── SHOT MAP ─────────────────────────────────────────────────────────────────
function buildShotMapHTML() {
  const shotActs = new Set(['Goal','Point','2 Point','Wide']);
  let inH2 = false;
  const shots = [];
  state.evts.forEach(ev => {
    if (ev.badge === '1H') { if ((ev.desc||'').includes('ended')) inH2 = true; return; }
    if (!shotActs.has(ev.action) || !ev.zone) return;
    const pi = ev.pi != null ? ev.pi : (ev.slot != null ? state.slotp[ev.slot] : null);
    shots.push({ action: ev.action, zone: ev.zone, team: ev.slot != null ? 'us' : 'opp', half: inH2 ? 'h2' : 'h1', slot: ev.slot != null ? ev.slot : null, pi, placed: PLACED_BALL.has(ev.sec) });
  });

  if (shots.length === 0) return '';

  const seenPi = new Set();
  const playerList = [];
  shots.forEach(s => { if (s.pi != null && !seenPi.has(s.pi)) { seenPi.add(s.pi); playerList.push(s.pi); } });
  playerList.sort((a,b) => a - b);

  if (shotMapPlayerFilter !== 'all' && !seenPi.has(Number(shotMapPlayerFilter))) shotMapPlayerFilter = 'all';

  const filtered = shots.filter(s => {
    if (shotMapHalfFilter !== 'all' && s.half !== shotMapHalfFilter) return false;
    if (shotMapPlayerFilter !== 'all' && String(s.pi) !== String(shotMapPlayerFilter)) return false;
    return true;
  });

  const jitter = (seed, range) => { const x = Math.sin(seed) * 43758.5453; return (x - Math.floor(x) - 0.5) * range; };
  let dots = '';
  filtered.forEach((s, i) => {
    const baseCx = ZPX + s.zone.coords.x * ZPW;
    const baseCy = ZPY + s.zone.coords.y * ZPH;
    const cx = (baseCx + jitter(i * 2.1 + 1, 14)).toFixed(1);
    const cy = (baseCy + jitter(i * 2.1 + 2, 14)).toFixed(1);
    const isScore = s.action !== 'Wide';
    const isGoal = s.action === 'Goal';
    const r = isGoal ? 9 : 6;
    const fill = isScore ? '#2E7D32' : '#C62828';
    if (s.placed) dots += `<circle cx="${cx}" cy="${cy}" r="${r+3.5}" fill="none" stroke="${fill}" stroke-width="1.5" opacity="0.7"/>`;
    dots += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" opacity="0.82" stroke="white" stroke-width="1.2"/>`;
    if (s.pi != null) {
      const ini = esc(gi(s.pi));
      const fs = isGoal ? 7 : (ini.length >= 4 ? 4.5 : 5.5);
      dots += `<text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="central" font-size="${fs}" font-weight="700" fill="white" font-family="-apple-system,BlinkMacSystemFont,sans-serif" style="pointer-events:none;">${ini}</text>`;
    }
  });

  const svg = `<svg viewBox="0 0 320 400" xmlns="http://www.w3.org/2000/svg" style="width:100%;border-radius:8px;" preserveAspectRatio="xMidYMid meet">${PITCH_SVG_INNER}${dots}</svg>`;

  const thirds = { att:{shots:0,scores:0}, mid:{shots:0,scores:0}, def:{shots:0,scores:0} };
  filtered.forEach(s => {
    const y = s.zone.coords.y;
    const t = y > 0.667 ? 'att' : y > 0.333 ? 'mid' : 'def';
    thirds[t].shots++;
    if (s.action !== 'Wide') thirds[t].scores++;
  });

  const pct = (n,d) => d>0 ? Math.round(n/d*100)+'%' : '—';
  const hChip = (val,label) => `<button class="zone-chip${shotMapHalfFilter===val?' active':''}" onclick="setShotMapFilter('half','${val}')">${label}</button>`;
  const pChip = (val,label) => `<button class="zone-chip${String(shotMapPlayerFilter)===String(val)?' active':''}" onclick="setShotMapFilter('player','${val}')">${label}</button>`;

  let h = '<div id="shot-map-section" class="stat-section">';
  h += '<div class="stat-section-title">Shot Map</div>';
  h += '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px;">';
  h += hChip('all','Full Match')+hChip('h1','H1')+hChip('h2','H2');
  h += '</div>';
  if (playerList.length > 0) {
    h += '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px;">';
    h += pChip('all','All');
    playerList.forEach(pi => { h += pChip(pi, esc(gi(pi))); });
    h += '</div>';
  }
  h += `<div style="border-radius:8px;overflow:hidden;margin-bottom:8px;">${svg}</div>`;
  h += '<div style="display:flex;gap:14px;flex-wrap:wrap;margin-bottom:10px;font-size:12px;color:var(--t2);align-items:center;">';
  h += '<span style="display:flex;align-items:center;gap:4px;"><svg width="12" height="12"><circle cx="6" cy="6" r="5" fill="#2E7D32" opacity=".82"/></svg>Score</span>';
  h += '<span style="display:flex;align-items:center;gap:4px;"><svg width="12" height="12"><circle cx="6" cy="6" r="5" fill="#C62828" opacity=".82"/></svg>Wide</span>';
  h += '<span style="display:flex;align-items:center;gap:4px;"><svg width="14" height="14"><circle cx="7" cy="7" r="6" fill="#2E7D32" opacity=".82" stroke="white" stroke-width="1"/></svg>Goal</span>';
  h += '<span style="display:flex;align-items:center;gap:4px;"><svg width="18" height="18"><circle cx="9" cy="9" r="8" fill="none" stroke="#2E7D32" stroke-width="1.5" opacity=".7"/><circle cx="9" cy="9" r="5" fill="#2E7D32" opacity=".82" stroke="white" stroke-width="1"/></svg>Placed</span>';
  h += '</div>';

  const thirdRows = [['Attacking third',thirds.att],['Middle third',thirds.mid],['Defensive third',thirds.def]];
  const hasData = thirdRows.some(([,d]) => d.shots > 0);
  if (hasData) {
    h += '<table style="width:100%;font-size:12px;border-collapse:collapse;">';
    h += '<tr style="color:var(--t3);font-size:11px;"><th style="text-align:left;padding:4px 0;font-weight:500;">Zone</th><th style="text-align:center;font-weight:500;">Shots</th><th style="text-align:center;font-weight:500;">Scores</th><th style="text-align:center;font-weight:500;">Conv%</th></tr>';
    thirdRows.forEach(([label,d]) => {
      if (d.shots === 0) return;
      h += `<tr><td style="padding:3px 0;color:var(--t2);">${label}</td><td style="text-align:center;color:var(--t1);">${d.shots}</td><td style="text-align:center;color:var(--t1);">${d.scores}</td><td style="text-align:center;font-weight:600;color:var(--ti);">${pct(d.scores,d.shots)}</td></tr>`;
    });
    h += '</table>';
  }

  h += '</div>';
  return h;
}

function setShotMapFilter(key, val) {
  if (key === 'half') shotMapHalfFilter = val;
  if (key === 'player') shotMapPlayerFilter = val;
  const section = document.getElementById('shot-map-section');
  if (section) section.outerHTML = buildShotMapHTML();
}
