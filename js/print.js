'use strict';

// ─── PRINT ────────────────────────────────────────────────────────────────────
function buildPrintTimelineHTML() {
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
    if      (ev.action==='Goal')      { usG++; mType='Goal'; mTeam='us'; }
    else if (ev.action==='Point')     { usP++; mType='Point'; mTeam='us'; }
    else if (ev.action==='2 Point')   { usP+=2; mType='2 Point'; mTeam='us'; }
    else if (ev.action==='Wide')      { mType='Wide'; mTeam=(ev.badge==='OPP')?'opp':'us'; }
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

  const W=560,H=120,PL=28,PR=10,PT=10,PB=22;
  const cw=W-PL-PR, ch=H-PT-PB;
  const x=s=>(PL+(s/totalSecs)*cw).toFixed(1);
  const y=p=>(PT+ch-(p/maxPts)*ch).toFixed(1);
  const usLine  = data.map(d=>x(d.secs)+','+y(d.us)).join(' ');
  const oppLine = data.map(d=>x(d.secs)+','+y(d.opp)).join(' ');
  const yMid=Math.round(maxPts/2);

  let svg=`<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="width:100%;display:block;">`;
  svg+=`<line x1="${PL}" y1="${PT+ch}" x2="${PL+cw}" y2="${PT+ch}" stroke="#E2E4DE" stroke-width="1"/>`;
  svg+=`<text x="${PL-4}" y="${parseFloat(y(0))+4}" text-anchor="end" font-size="9" fill="#9A9E99">0</text>`;
  svg+=`<text x="${PL-4}" y="${parseFloat(y(yMid))+4}" text-anchor="end" font-size="9" fill="#9A9E99">${yMid}</text>`;
  svg+=`<text x="${PL-4}" y="${parseFloat(y(maxPts))+4}" text-anchor="end" font-size="9" fill="#9A9E99">${maxPts}</text>`;
  svg+=`<text x="${PL}" y="${H-4}" text-anchor="middle" font-size="9" fill="#9A9E99">0'</text>`;
  if (halfSecs>0) {
    svg+=`<line x1="${x(halfSecs)}" y1="${PT}" x2="${x(halfSecs)}" y2="${PT+ch}" stroke="#9A9E99" stroke-width="1" stroke-dasharray="3 2"/>`;
    svg+=`<text x="${x(halfSecs)}" y="${H-4}" text-anchor="middle" font-size="9" fill="#9A9E99">HT</text>`;
  }
  svg+=`<text x="${x(totalSecs)}" y="${H-4}" text-anchor="middle" font-size="9" fill="#9A9E99">${Math.round(totalSecs/60)}'</text>`;
  subs.forEach(e   => { const sx=x(e.secs); svg+=`<line x1="${sx}" y1="${PT}" x2="${sx}" y2="${PT+ch}" stroke="#F59E0B" stroke-width="1.5" stroke-dasharray="2 2"/>`; });
  reds.forEach(e   => { const sx=x(e.secs); svg+=`<line x1="${sx}" y1="${PT}" x2="${sx}" y2="${PT+ch}" stroke="#E53935" stroke-width="1.5" stroke-dasharray="2 2"/>`; });
  blacks.forEach(e => { const sx=x(e.secs); svg+=`<line x1="${sx}" y1="${PT}" x2="${sx}" y2="${PT+ch}" stroke="#2c2c2a" stroke-width="1.5" stroke-dasharray="2 2"/>`; });
  svg+=`<polyline points="${oppLine}" fill="none" stroke="#C62828" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;
  svg+=`<polyline points="${usLine}"  fill="none" stroke="#2E7D32" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;
  markers.forEach(m => {
    const cx=x(m.secs), cy=y(m.team==='us'?m.usScore:m.oppScore);
    if      (m.type==='Goal')    svg+=`<circle cx="${cx}" cy="${cy}" r="4"   fill="#2E7D32" stroke="#fff" stroke-width="1.5"/>`;
    else if (m.type==='2 Point') svg+=`<circle cx="${cx}" cy="${cy}" r="3.5" fill="#F59E0B" stroke="#fff" stroke-width="1.5"/>`;
    else if (m.type==='Point')   svg+=`<circle cx="${cx}" cy="${cy}" r="3.5" fill="#fff"    stroke="#9A9E99" stroke-width="1.5"/>`;
    else if (m.type==='Wide')    svg+=`<circle cx="${cx}" cy="${cy}" r="2.5" fill="#9E9E9E" stroke="none"/>`;
  });
  svg+='</svg>';

  let h=svg;
  h+=`<div style="display:flex;gap:20px;justify-content:center;margin-top:6px;font-size:11px;color:#6B6F66;flex-wrap:wrap;">`;
  h+=html`<span style="display:flex;align-items:center;gap:5px;"><span style="display:inline-block;width:18px;height:2px;background:#2E7D32;border-radius:1px;vertical-align:middle;"></span>${state.usN}</span>`;
  h+=html`<span style="display:flex;align-items:center;gap:5px;"><span style="display:inline-block;width:18px;height:2px;background:#C62828;border-radius:1px;vertical-align:middle;"></span>${state.oppN}</span>`;
  if (subs.length)   h+=`<span style="display:flex;align-items:center;gap:5px;"><span style="display:inline-block;width:14px;height:0;border-top:2px dashed #F59E0B;vertical-align:middle;"></span>Sub</span>`;
  if (reds.length)   h+=`<span style="display:flex;align-items:center;gap:5px;"><span style="display:inline-block;width:14px;height:0;border-top:2px dashed #E53935;vertical-align:middle;"></span>Red</span>`;
  if (blacks.length) h+=`<span style="display:flex;align-items:center;gap:5px;"><span style="display:inline-block;width:14px;height:0;border-top:2px dashed #2c2c2a;vertical-align:middle;"></span>Black</span>`;
  h+=`</div>`;
  return h;
}

function buildPrintLineupHTML() {
  const layout = GRID_LAYOUTS[state.teamSize] || GRID_LAYOUTS[15];
  const prTitle = (text) => '<div style="font-size:11px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:#1F1F1F;margin-bottom:10px;padding:3px 0 3px 9px;border-left:3px solid #2E7D32;">'+text+'</div>';

  const snapSlotp   = state.startSlotp   || state.slotp;
  const snapCaptain = state.startSlotp   ? state.startCaptain : state.captain;

  const shirt = (num, bg, numColor, size) => {
    const s = size || 36;
    return `<svg width="${s}" height="${s}" viewBox="0 0 36 36" style="display:block;">
      <path d="M4,8 L10,4 Q13,2 14,6 Q18,10 22,6 Q23,2 26,4 L32,8 L28,14 L25,12 L25,32 L11,32 L11,12 L8,14 Z"
            fill="${bg}" stroke="rgba(0,0,0,0.12)" stroke-width="0.8"/>
      <text x="18" y="24" text-anchor="middle" font-size="10" font-weight="700"
            fill="${numColor}" font-family="-apple-system,BlinkMacSystemFont,sans-serif">${num}</text>
    </svg>`;
  };

  let formation = '';
  formation += '<div style="display:flex;flex-direction:column;gap:10px;align-items:center;padding:4px 0 14px;">';
  layout.forEach(row => {
    formation += '<div style="display:flex;gap:10px;">';
    row.forEach(slot => {
      const pi = snapSlotp ? (snapSlotp[slot] || slot) : slot;
      const name = gn(pi) || '';
      const isCap = snapCaptain === slot;
      const isGK = slot === 1;
      const bg = isGK ? '#FDD835' : '#2E7D32';
      const numCol = isGK ? '#2E7D32' : '#ffffff';
      formation += '<div style="display:flex;flex-direction:column;align-items:center;width:48px;">';
      formation += '<div style="position:relative;width:34px;height:34px;">';
      formation += shirt(slot, bg, numCol, 34);
      if (isCap) formation += '<span style="position:absolute;top:-3px;right:-3px;background:#fff;border:1px solid #E2E4DE;border-radius:50%;width:12px;height:12px;font-size:7px;font-weight:700;color:#2E7D32;display:flex;align-items:center;justify-content:center;line-height:1;">C</span>';
      formation += '</div>';
      formation += html`<div style="font-size:7.5px;font-weight:600;color:#1F1F1F;text-align:center;margin-top:2px;line-height:1.25;word-break:break-word;">${name||'—'}</div>`;
      formation += '</div>';
    });
    formation += '</div>';
  });
  formation += '</div>';

  const subs = [];
  for (let i = 16; i <= (state.maxB || 16); i++) {
    const n = gn(i);
    if (n) subs.push({idx:i, name:n});
  }
  if (subs.length > 0) {
    formation += '<div style="padding-top:8px;border-top:1px solid #E2E4DE;">';
    formation += prTitle('Subs');
    formation += '<div style="display:flex;flex-wrap:wrap;gap:6px;">';
    subs.forEach(s => {
      formation += '<div style="display:flex;flex-direction:column;align-items:center;width:40px;">';
      formation += '<div style="position:relative;width:26px;height:26px;">'+shirt(s.idx,'#9E9E9E','#fff',26)+'</div>';
      formation += html`<div style="font-size:7px;color:#1F1F1F;text-align:center;margin-top:2px;line-height:1.25;word-break:break-word;">${s.name}</div>`;
      formation += '</div>';
    });
    formation += '</div></div>';
  }

  const notesContent = state.matchNotes && state.matchNotes.trim()
    ? html`<div style="font-size:11px;color:#1F1F1F;line-height:1.6;white-space:pre-wrap;">${state.matchNotes.trim()}</div>`
    : '';
  const ruledLines = Array.from({length:18}, () =>
    '<div style="border-bottom:1px solid #E2E4DE;height:22px;"></div>'
  ).join('');
  const notesCol =
    '<div style="display:flex;flex-direction:column;flex:1;min-height:340px;">' +
      prTitle('Match Notes') +
      (notesContent || ruledLines) +
    '</div>';

  let h = '<div style="display:flex;gap:24px;align-items:flex-start;margin-bottom:28px;">';
  h += '<div style="flex:1;min-width:0;">';
  h += prTitle(html`Starting Line-up — ${state.usN}`);
  h += formation;
  h += '</div>';
  h += notesCol;
  h += '</div>';
  return h;
}

function buildPrintHTML() {
  let goalCount=0, ptCount=0, twoPtCount=0, wideCount=0;
  let placedGoals=0, placedPts=0, placedTwoPts=0, placedWides=0;
  let ownWon=0, ownLost=0, ownUnclear=0;
  let oppWon=0, oppLost=0, oppUnclear=0;
  let freesConc=0, freesScored=0;
  let turnoversWon=0, turnoversLost=0;
  const pstats = {};

  for (let i = 0; i < state.evts.length; i++) {
    const ev = state.evts[i];
    if (ev.action !== 'Free') continue;
    freesConc++;
    for (let j = i + 1; j < state.evts.length; j++) {
      const next = state.evts[j];
      if (next.badge === 'RSTR') continue;
      if (next.badge === 'OPP') freesScored++;
      break;
    }
  }

  state.evts.forEach(ev => {
    if (ev.badge === 'RSTR') {
      const d = ev.desc || '';
      const won = d.includes(': Won'), lost = d.includes(': Lost');
      if (d.startsWith('Own Restart')) {
        if (won) ownWon++; else if (lost) ownLost++; else ownUnclear++;
      } else if (d.startsWith('Opposition')) {
        if (won) oppWon++; else if (lost) oppLost++; else oppUnclear++;
      }
      return;
    }
    if (!ev.action || !ev.slot) return;
    const pi = state.slotp[ev.slot];
    if (!pi) return;
    const placed = PLACED_BALL.has(ev.sec);
    if (!pstats[pi]) pstats[pi] = {name:pl(pi),gPlay:0,gPlaced:0,pPlay:0,pPlaced:0,wides:0,yc:0,rc:0,bc:0,twon:0,tlost:0};
    const ps = pstats[pi];
    if (ev.action === 'Goal')        { goalCount++;   placed ? (placedGoals++,  ps.gPlaced++) : ps.gPlay++; }
    else if (ev.action === 'Point')       { ptCount++;    placed ? (placedPts++,   ps.pPlaced++) : ps.pPlay++; }
    else if (ev.action === '2 Point')     { twoPtCount++; placed ? (placedTwoPts++,ps.pPlaced+=2) : ps.pPlay+=2; }
    else if (ev.action === 'Wide')        { wideCount++;  ps.wides++; if (placed) placedWides++; }
    else if (ev.action === 'Yellow Card') ps.yc++;
    else if (ev.action === 'Red Card')    ps.rc++;
    else if (ev.action === 'Black Card')  ps.bc++;
    else if (ev.action === 'Turnover Won')  { turnoversWon++;  ps.twon++; }
    else if (ev.action === 'Turnover Lost') { turnoversLost++; ps.tlost++; }
  });

  const totalScoreActions = goalCount + ptCount + twoPtCount;
  const totalAttempts = totalScoreActions + wideCount;
  const scorePct = totalAttempts > 0 ? Math.round(totalScoreActions / totalAttempts * 100) : 0;
  const totalPts = goalCount*3 + ptCount + twoPtCount*2;
  const displayPts = ptCount + twoPtCount*2;
  const placedScoreCount = placedGoals + placedPts + placedTwoPts;
  const placedAttempts = placedScoreCount + placedWides;
  const placedPct = placedAttempts > 0 ? Math.round(placedScoreCount / placedAttempts * 100) : 0;
  const rstLabel = state.sport === 'hurling' ? 'Puck Out' : 'Kickout';
  const totalTurnovers = turnoversWon + turnoversLost;
  const ownTotal = ownWon + ownLost + ownUnclear;
  const oppTotal = oppWon + oppLost + oppUnclear;

  const scorers = Object.values(pstats).filter(p =>
    p.gPlay+p.gPlaced+p.pPlay+p.pPlaced+p.wides > 0
  ).sort((a,b) => {
    const ta=(a.gPlay+a.gPlaced)*3+(a.pPlay+a.pPlaced);
    const tb=(b.gPlay+b.gPlaced)*3+(b.pPlay+b.pPlaced);
    return tb !== ta ? tb - ta : a.name.localeCompare(b.name);
  });

  const disciplined = Object.values(pstats).filter(p =>
    p.yc+p.bc+p.rc > 0
  ).sort((a,b) => (b.rc*100+b.bc*10+b.yc)-(a.rc*100+a.bc*10+a.yc)||a.name.localeCompare(b.name));

  const usScore = state.goals+'-'+state.pts+' ('+((state.goals*3)+state.pts)+'pts)';
  const oppScore = state.og+'-'+state.op_+' ('+(state.og*3+state.op_)+'pts)';
  const matchDate = new Date().toLocaleDateString('en-IE',{day:'numeric',month:'long',year:'numeric'});

  let h = '';

  h += '<div class="pr-hdr">';
  h += '<div class="pr-title">Match Report</div>';
  h += html`<div class="pr-score">${state.usN} ${html.safe(usScore)}<br>${state.oppN} ${html.safe(oppScore)}</div>`;
  h += '<div class="pr-teams">';
  h += '<span>'+matchDate+'</span>';
  if (state.location) h += html`<span>${state.location}</span>`;
  if (state.referee)  h += html`<span>Ref: ${state.referee}</span>`;
  h += '</div>';
  h += '</div>';

  h += buildPrintLineupHTML();

  const timelineHTML = buildPrintTimelineHTML();
  if (timelineHTML) {
    h += '<div class="pr-section pr-break">';
    h += '<div class="pr-section-title">Score Timeline</div>';
    h += '<div class="pr-card">'+timelineHTML+'</div>';
    h += '</div>';
  }

  const usMom  = (state.goals*3 + state.pts)  + (ownWon  + oppWon)  * 2 + turnoversWon;
  const oppMom = (state.og*3   + state.op_)   + (ownLost + oppLost) * 2 + turnoversLost;
  const momTotal = usMom + oppMom;
  if (momTotal > 0) {
    const usPct  = Math.round(usMom  / momTotal * 100);
    const oppPct = 100 - usPct;
    const dominant = usPct > oppPct ? state.usN : usPct < oppPct ? state.oppN : null;
    const prBasisNote = (ownTotal+oppTotal > 0 && totalTurnovers > 0) ? 'Scores + restarts + turnovers'
      : (ownTotal+oppTotal > 0) ? 'Scores + restarts won'
      : totalTurnovers > 0 ? 'Scores + turnovers'
      : 'Based on scores';
    h += '<div class="pr-section">';
    h += '<div class="pr-section-title">Momentum</div>';
    h += '<div class="pr-card">';
    h += '<div style="height:10px;border-radius:5px;overflow:hidden;display:flex;margin-bottom:8px;">';
    h += '<div style="width:'+usPct+'%;background:#2E7D32;"></div>';
    h += '<div style="flex:1;background:#C62828;"></div>';
    h += '</div>';
    h += '<div style="display:flex;justify-content:space-between;font-size:13px;">';
    h += html`<span style="color:#2E7D32;font-weight:600;">${state.usN} <span style="font-weight:400;">${usPct}%</span></span>`;
    h += html`<span style="color:#C62828;font-weight:600;">${state.oppN} <span style="font-weight:400;">${oppPct}%</span></span>`;
    h += '</div>';
    if (dominant) h += html`<div style="font-size:11px;color:#6B6F66;margin-top:4px;">${dominant} dominant &mdash; ${html.safe(prBasisNote)}</div>`;
    h += '</div></div>';
  }

  h += '<div class="pr-section">';
  h += '<div class="pr-section-title">Scoring</div>';
  h += '<div class="pr-card">';
  h += '<div class="pr-big">'+goalCount+'-'+displayPts+' <span style="font-size:16px;font-weight:500;color:#6B6F66;">('+totalPts+'pts)</span></div>';
  h += '<div class="pr-sub">'+totalScoreActions+' score'+(totalScoreActions!==1?'s':'')+' from '+totalAttempts+' attempt'+(totalAttempts!==1?'s':'')+' — '+scorePct+'% conversion</div>';
  if (goalCount||ptCount||twoPtCount||wideCount) {
    h += '<div style="margin-top:8px;font-size:13px;color:#1F1F1F;">';
    if (goalCount)  h += '<span style="margin-right:14px;">'+goalCount+' goal'+(goalCount!==1?'s':'')+'</span>';
    if (twoPtCount) h += '<span style="margin-right:14px;">'+twoPtCount+' 2-ptr'+(twoPtCount!==1?'s':'')+'</span>';
    if (ptCount)    h += '<span style="margin-right:14px;">'+ptCount+' point'+(ptCount!==1?'s':'')+'</span>';
    if (wideCount)  h += '<span style="color:#6B6F66;">'+wideCount+' wide'+(wideCount!==1?'s':'')+'</span>';
    h += '</div>';
  }
  h += '</div></div>';

  if (placedAttempts > 0) {
    h += '<div class="pr-section">';
    h += '<div class="pr-section-title">Placed Balls</div>';
    h += '<div class="pr-card">';
    h += '<div class="pr-big" style="font-size:22px;">'+placedPct+'% <span style="font-size:14px;font-weight:500;color:#6B6F66;">conversion</span></div>';
    h += '<div class="pr-sub">'+placedScoreCount+' converted from '+placedAttempts+' attempt'+(placedAttempts!==1?'s':'')+(placedWides?' · '+placedWides+' wide'+(placedWides!==1?'s':''):'')+'</div>';
    h += '</div></div>';
  }

  if (ownTotal > 0 || oppTotal > 0) {
    h += '<div class="pr-section">';
    h += '<div class="pr-section-title">Restarts</div>';
    h += '<div class="pr-card">';
    if (ownTotal > 0) {
      const pct=Math.round(ownWon/ownTotal*100);
      h+='<div class="pr-row"><span>Own '+rstLabel+'s</span><span>'+ownWon+' won / '+ownLost+' lost'+(ownUnclear?' / '+ownUnclear+' unclear':'')+' — <strong>'+pct+'%</strong></span></div>';
    }
    if (oppTotal > 0) {
      const pct=Math.round(oppWon/oppTotal*100);
      h+='<div class="pr-row"><span>Opposition '+rstLabel+'s</span><span>'+oppWon+' won / '+oppLost+' lost'+(oppUnclear?' / '+oppUnclear+' unclear':'')+' — <strong>'+pct+'%</strong></span></div>';
    }
    h += '</div></div>';
  }

  if (totalTurnovers > 0) {
    const wonPct = Math.round(turnoversWon / totalTurnovers * 100);
    h += '<div class="pr-section">';
    h += '<div class="pr-section-title">Turnovers</div>';
    h += '<div class="pr-card">';
    h += '<div style="display:flex;gap:24px;align-items:center;margin-bottom:10px;">';
    h += '<span style="font-size:18px;font-weight:700;color:#2E7D32;">'+turnoversWon+' won</span>';
    h += '<span style="font-size:18px;font-weight:700;color:#C62828;">'+turnoversLost+' lost</span>';
    h += '</div>';
    h += '<div style="height:10px;border-radius:5px;overflow:hidden;display:flex;margin-bottom:6px;background:#F8D7D7;">';
    h += '<div style="width:'+wonPct+'%;background:#2E7D32;"></div>';
    h += '</div>';
    h += '<div class="pr-row"><span>Won</span><span style="color:#2E7D32;font-weight:600;">'+turnoversWon+' ('+wonPct+'%)</span></div>';
    h += '<div class="pr-row"><span>Lost</span><span style="color:#C62828;font-weight:600;">'+turnoversLost+' ('+(100-wonPct)+'%)</span></div>';
    const twPlayers = Object.values(pstats).filter(p=>p.twon+p.tlost>0).sort((a,b)=>(b.twon-b.tlost)-(a.twon-a.tlost)||a.name.localeCompare(b.name));
    twPlayers.forEach(p => {
      h += html`<div class="pr-row"><span>${p.name}</span><span>`;
      if (p.twon  > 0) h += `<span class="pr-tag" style="margin-right:4px;">+${p.twon}</span>`;
      if (p.tlost > 0) h += `<span class="pr-tag" style="background:#F8D7D7;color:#991B1B;">-${p.tlost}</span>`;
      h += '</span></div>';
    });
    h += '</div></div>';
  }

  if (scorers.length > 0) {
    h += '<div class="pr-section pr-section-flow">';
    h += '<div class="pr-section-title">Player Scoring</div>';
    h += '<div class="pr-card">';
    scorers.forEach(p => {
      const g=p.gPlay+p.gPlaced, pts=p.pPlay+p.pPlaced, total=g*3+pts;
      h += html`<div class="pr-row"><span>${p.name}</span>`;
      h += '<span>';
      if (g > 0 || pts > 0) h += `<span class="pr-tag">${g}-${pts} (${total})</span> `;
      if (p.wides > 0) h += `<span class="pr-tag-grey">${p.wides} wide${p.wides!==1?'s':''}</span>`;
      h += '</span></div>';
    });
    h += '</div></div>';
  }

  const subEvts = state.evts.filter(ev => ev.action === 'sub');
  if (subEvts.length > 0) {
    let psUsG=0,psUsP=0,psOppG=0,psOppP=0;
    const psScoreAt=[];
    state.evts.forEach(ev => {
      if      (ev.action==='Goal')      psUsG++;
      else if (ev.action==='Point')     psUsP++;
      else if (ev.action==='2 Point')   psUsP+=2;
      else if (ev.badge==='OPP') {
        const d=ev.desc||'';
        if      (d.includes('Goal added'))    psOppG++;
        else if (d.includes('2 Point added')) psOppP+=2;
        else if (d.includes('Point added'))   psOppP++;
        else if (d.includes('Goal removed'))  psOppG=Math.max(0,psOppG-1);
        else if (d.includes('Point removed')) psOppP=Math.max(0,psOppP-1);
      } else if (ev.badge==='ADJ') {
        const d=ev.desc||'';
        if      (d.includes('Goal added'))   psUsG++;
        else if (d.includes('2 Point added'))psUsP+=2;
        else if (d.includes('Point added'))  psUsP++;
        else if (d.includes('Goal removed')) psUsG=Math.max(0,psUsG-1);
        else if (d.includes('Point removed'))psUsP=Math.max(0,psUsP-1);
      }
      psScoreAt.push({usG:psUsG,usP:psUsP,oppG:psOppG,oppP:psOppP});
    });
    const fPsUsG=psUsG,fPsUsP=psUsP,fPsOppG=psOppG,fPsOppP=psOppP;

    h += '<div class="pr-section pr-section-flow">';
    h += '<div class="pr-section-title">Substitutions</div>';
    h += '<div class="pr-card" style="padding:0;overflow:hidden;">';
    h += '<div style="display:flex;align-items:center;padding:6px 14px;background:#E8EAE5;border-bottom:1px solid #E2E4DE;gap:8px;">';
    h += '<span style="font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#6B6F66;min-width:42px;">Time</span>';
    h += '<span style="font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#6B6F66;flex:1;">On</span>';
    h += '<span style="font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#6B6F66;flex:1;">Off</span>';
    h += '<span style="font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#6B6F66;min-width:72px;text-align:right;">Score / After</span>';
    h += '</div>';
    state.evts.forEach((ev,i) => {
      if (ev.action !== 'sub') return;
      const at = psScoreAt[i] || {usG:0,usP:0,oppG:0,oppP:0};
      const aUG=fPsUsG-at.usG, aUP=fPsUsP-at.usP, aOG=fPsOppG-at.oppG, aOP=fPsOppP-at.oppP;
      const m = ev.desc.match(/Sub: (.+) off \/ (.+) on \(pos (\d+)\)/);
      const offName=m?m[1]:'?', onName=m?m[2]:'?', pos=m?m[3]:'';
      h += '<div class="pr-row" style="display:flex;align-items:flex-start;padding:7px 14px;border-bottom:1px solid #E2E4DE;gap:8px;font-size:13px;">';
      h += '<span style="min-width:42px;color:#6B6F66;padding-top:1px;">'+ev.time+'</span>';
      h += html`<div style="flex:1;"><div style="font-weight:600;color:#1F1F1F;">${onName}</div>${html.safe(pos?'<div style="font-size:10px;color:#9A9E99;">Pos '+pos+'</div>':'')}</div>`;
      h += html`<div style="flex:1;color:#4A4A4A;">${offName}</div>`;
      h += '<div style="min-width:72px;text-align:right;">';
      h += '<div style="font-size:11px;color:#6B6F66;">'+at.usG+'-'+at.usP+' v '+at.oppG+'-'+at.oppP+'</div>';
      h += '<div style="font-size:10px;color:#9A9E99;margin-top:1px;"><span style="color:#2E7D32;">+'+aUG+'-'+aUP+'</span> / <span style="color:#C62828;">+'+aOG+'-'+aOP+'</span></div>';
      h += '</div>';
      h += '</div>';
    });
    h += html`<div style="padding:6px 14px;font-size:10px;color:#9A9E99;">After = goals-pts scored from sub on (${state.usN} / ${state.oppN})</div>`;
    h += '</div></div>';
  }

  if (disciplined.length > 0 || freesConc > 0) {
    h += '<div class="pr-section">';
    h += '<div class="pr-section-title">Discipline</div>';

    if (freesConc > 0) {
      const freesNotScored = freesConc - freesScored;
      h += '<div class="pr-card" style="margin-bottom:8px;">';
      h += '<div style="font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#6B6F66;margin-bottom:8px;">Frees Conceded</div>';
      h += '<div class="pr-row"><span>Total frees conceded</span><span><strong>'+freesConc+'</strong></span></div>';
      if (freesScored > 0)    h += '<div class="pr-row"><span>Opposition scored from free</span><span style="color:#C62828;font-weight:600;">'+freesScored+'</span></div>';
      if (freesNotScored > 0) h += '<div class="pr-row"><span>Not scored</span><span style="color:#6B6F66;">'+freesNotScored+'</span></div>';
      h += '</div>';
    }

    if (disciplined.length > 0) {
      h += '<div class="pr-card">';
      h += '<div style="font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#6B6F66;margin-bottom:8px;">Cards</div>';
      disciplined.forEach(p => {
        h += html`<div class="pr-row"><span>${p.name}</span><span>`;
        for (let i=0;i<p.yc;i++) h+='<span style="display:inline-block;width:10px;height:14px;background:#FDD835;border-radius:2px;border:.5px solid rgba(0,0,0,.2);margin:0 1px;"></span>';
        for (let i=0;i<p.bc;i++) h+='<span style="display:inline-block;width:10px;height:14px;background:#2c2c2a;border-radius:2px;margin:0 1px;"></span>';
        for (let i=0;i<p.rc;i++) h+='<span style="display:inline-block;width:10px;height:14px;background:#E53935;border-radius:2px;margin:0 1px;"></span>';
        h += '</span></div>';
      });
      h += '</div>';
    }

    h += '</div>';
  }

  if (state.trackShotLocations) {
    const smPrint = buildPrintShotMapHTML();
    if (smPrint) h += smPrint;
  }

  h += '<div class="pr-footer">Generated by GAA Match Tracker</div>';
  return h;
}

function buildPrintShotMapHTML() {
  const shotActs = new Set(['Goal','Point','2 Point','Wide']);
  let inH2 = false;
  const shots = [];
  state.evts.forEach(ev => {
    if (ev.badge === '1H') { if ((ev.desc||'').includes('ended')) inH2 = true; return; }
    if (!shotActs.has(ev.action) || !ev.zone) return;
    const pi = ev.slot != null ? state.slotp[ev.slot] : null;
    shots.push({ action: ev.action, zone: ev.zone, half: inH2 ? 'h2' : 'h1', pi });
  });
  if (shots.length === 0) return '';

  const jitter = (seed, range) => { const x = Math.sin(seed) * 43758.5453; return (x - Math.floor(x) - 0.5) * range; };
  let dots = '';
  shots.forEach((s, i) => {
    const cx = (ZPX + s.zone.coords.x * ZPW + jitter(i * 2.1 + 1, 14)).toFixed(1);
    const cy = (ZPY + s.zone.coords.y * ZPH + jitter(i * 2.1 + 2, 14)).toFixed(1);
    const isGoal = s.action === 'Goal';
    const r = isGoal ? 9 : 6;
    const fill = s.action !== 'Wide' ? '#2E7D32' : '#C62828';
    dots += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" opacity="0.82" stroke="white" stroke-width="1.2"/>`;
    if (s.pi != null) {
      const ini = gi(s.pi);
      const fs = isGoal ? 7 : (ini.length >= 4 ? 4.5 : 5.5);
      dots += html`<text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="central" font-size="${fs}" font-weight="700" fill="white" font-family="-apple-system,BlinkMacSystemFont,sans-serif" style="pointer-events:none;">${ini}</text>`;
    }
  });

  const thirds = { att:{shots:0,scores:0}, mid:{shots:0,scores:0}, def:{shots:0,scores:0} };
  shots.forEach(s => {
    const y = s.zone.coords.y;
    const t = y > 0.667 ? 'att' : y > 0.333 ? 'mid' : 'def';
    thirds[t].shots++;
    if (s.action !== 'Wide') thirds[t].scores++;
  });
  const pct = (n,d) => d>0 ? Math.round(n/d*100)+'%' : '—';

  let h = '<div class="pr-section pr-break">';
  h += '<div class="pr-section-title">Shot Map</div>';
  h += '<div class="pr-card" style="padding:0;overflow:hidden;">';
  h += `<svg viewBox="0 0 320 400" xmlns="http://www.w3.org/2000/svg" style="width:100%;display:block;" preserveAspectRatio="xMidYMid meet">${PITCH_SVG_INNER}${dots}</svg>`;
  h += '<div style="padding:10px 14px;">';
  h += '<div style="display:flex;gap:14px;margin-bottom:10px;font-size:11px;color:#4A4A4A;align-items:center;">';
  h += '<span style="display:flex;align-items:center;gap:4px;"><svg width="12" height="12"><circle cx="6" cy="6" r="5" fill="#2E7D32" opacity=".82"/></svg>Score</span>';
  h += '<span style="display:flex;align-items:center;gap:4px;"><svg width="12" height="12"><circle cx="6" cy="6" r="5" fill="#C62828" opacity=".82"/></svg>Wide</span>';
  h += '<span style="display:flex;align-items:center;gap:4px;"><svg width="14" height="14"><circle cx="7" cy="7" r="6" fill="#2E7D32" opacity=".82" stroke="white" stroke-width="1"/></svg>Goal</span>';
  h += '</div>';
  const thirdRows = [['Attacking third',thirds.att],['Middle third',thirds.mid],['Defensive third',thirds.def]];
  if (thirdRows.some(([,d]) => d.shots > 0)) {
    h += '<table style="width:100%;font-size:12px;border-collapse:collapse;">';
    h += '<tr style="color:#6B6F66;font-size:11px;"><th style="text-align:left;padding:4px 0;font-weight:500;">Zone</th><th style="text-align:center;font-weight:500;">Shots</th><th style="text-align:center;font-weight:500;">Scores</th><th style="text-align:center;font-weight:500;">Conv%</th></tr>';
    thirdRows.forEach(([label,d]) => {
      if (d.shots === 0) return;
      h += `<tr><td style="padding:3px 0;color:#4A4A4A;">${label}</td><td style="text-align:center;color:#1F1F1F;">${d.shots}</td><td style="text-align:center;color:#1F1F1F;">${d.scores}</td><td style="text-align:center;font-weight:600;color:#2E7D32;">${pct(d.scores,d.shots)}</td></tr>`;
    });
    h += '</table>';
  }
  h += '</div></div></div>';
  return h;
}

function printStats() {
  document.getElementById('print-area').innerHTML = buildPrintHTML();
  window.print();
}
