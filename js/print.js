'use strict';

// ─── PRINT ────────────────────────────────────────────────────────────────────
function buildPrintTimelineHTML() {
  let usG=0,usP=0,oppG=0,oppP=0,halfSecs=0,inH2=false;
  const data = [{secs:0,us:0,opp:0}];
  const subs=[], reds=[], blacks=[], markers=[];

  state.evts.forEach(ev => {
    let t = toSeconds(ev.time);
    if (ev.badge==='1H') { halfSecs=t; return; }
    if (ev.badge==='2H') { inH2=true; return; }
    if (inH2) t += halfSecs;
    const sc = {usG, usP, oppG, oppP};
    const prevUs=usG*3+usP, prevOpp=oppG*3+oppP;
    const _res = applyScoreBadge(ev, sc, state.oppN);
    const mType = _res ? _res.mType : null, mTeam = _res ? _res.mTeam : 'us';
    ({usG, usP, oppG, oppP} = sc);
    if (!_res) {
      if      (ev.action === 'sub')        subs.push({secs:t});
      else if (ev.action === 'Red Card')   reds.push({secs:t});
      else if (ev.action === 'Black Card') blacks.push({secs:t});
    }
    const curUs=usG*3+usP, curOpp=oppG*3+oppP;
    const placed = isPlacedBall(ev);
    if (mType) markers.push({secs:t, team:mTeam, type:mType, usScore:curUs, oppScore:curOpp, placed});
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
  reds.forEach(e   => { const sx=x(e.secs); svg+=`<line x1="${sx}" y1="${PT}" x2="${sx}" y2="${PT+ch}" stroke="${CARD_RED}" stroke-width="1.5" stroke-dasharray="2 2"/>`; });
  blacks.forEach(e => { const sx=x(e.secs); svg+=`<line x1="${sx}" y1="${PT}" x2="${sx}" y2="${PT+ch}" stroke="${CARD_BLACK}" stroke-width="1.5" stroke-dasharray="2 2"/>`; });
  svg+=`<polyline points="${oppLine}" fill="none" stroke="${TEAM_OPP_COLOR}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;
  svg+=`<polyline points="${usLine}"  fill="none" stroke="${TEAM_US_COLOR}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;
  markers.forEach(m => {
    const cx=x(m.secs), cy=y(m.team==='us'?m.usScore:m.oppScore);
    const mcol=m.team==='us'?TEAM_US_COLOR:TEAM_OPP_COLOR;
    const dotCol=m.type==='Wide'?'#9E9E9E':m.type==='2 Point'?'#F59E0B':mcol;
    const dotR=m.type==='Goal'?4:m.type==='2 Point'?3.5:m.type==='Point'?3.5:2.5;
    if(m.placed)svg+=`<circle cx="${cx}" cy="${cy}" r="${dotR+3.5}" fill="none" stroke="${dotCol}" stroke-width="1.5" opacity="0.7"/>`;
    if      (m.type==='Goal')    svg+=`<circle cx="${cx}" cy="${cy}" r="4"   fill="${TEAM_US_COLOR}" stroke="#fff" stroke-width="1.5"/>`;
    else if (m.type==='2 Point') svg+=`<circle cx="${cx}" cy="${cy}" r="3.5" fill="#F59E0B" stroke="#fff" stroke-width="1.5"/>`;
    else if (m.type==='Point')   svg+=`<circle cx="${cx}" cy="${cy}" r="3.5" fill="#fff"    stroke="#9A9E99" stroke-width="1.5"/>`;
    else if (m.type==='Wide')    svg+=`<circle cx="${cx}" cy="${cy}" r="2.5" fill="#9E9E9E" stroke="none"/>`;
  });
  svg+='</svg>';

  let h=svg;
  h+=`<div style="display:flex;gap:20px;justify-content:center;margin-top:6px;font-size:11px;color:#6B6F66;flex-wrap:wrap;">`;
  h+=html`<span style="display:flex;align-items:center;gap:5px;"><span style="display:inline-block;width:18px;height:2px;background:${TEAM_US_COLOR};border-radius:1px;vertical-align:middle;"></span>${state.usN}</span>`;
  h+=html`<span style="display:flex;align-items:center;gap:5px;"><span style="display:inline-block;width:18px;height:2px;background:${TEAM_OPP_COLOR};border-radius:1px;vertical-align:middle;"></span>${state.oppN}</span>`;
  if (subs.length)   h+=`<span style="display:flex;align-items:center;gap:5px;"><span style="display:inline-block;width:14px;height:0;border-top:2px dashed #F59E0B;vertical-align:middle;"></span>Sub</span>`;
  if (reds.length)   h+=`<span style="display:flex;align-items:center;gap:5px;"><span style="display:inline-block;width:14px;height:0;border-top:2px dashed ${CARD_RED};vertical-align:middle;"></span>Red</span>`;
  if (blacks.length) h+=`<span style="display:flex;align-items:center;gap:5px;"><span style="display:inline-block;width:14px;height:0;border-top:2px dashed ${CARD_BLACK};vertical-align:middle;"></span>Black</span>`;
  h+=`</div>`;
  return h;
}

function buildPrintLineupHTML() {
  const layout = GRID_LAYOUTS[state.teamSize] || GRID_LAYOUTS[15];
  const prTitle = (text) => '<div style="font-size:11px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:#1F1F1F;margin-bottom:10px;padding:3px 0 3px 9px;border-left:3px solid '+TEAM_US_COLOR+';">'+text+'</div>';

  const snapSlotp   = state.startSlotp   || state.slotp;
  const snapCaptain = state.startCaptain != null ? state.startCaptain : state.captain;

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
      const bg = isGK ? CARD_YELLOW : TEAM_US_COLOR;
      const numCol = isGK ? TEAM_US_COLOR : '#ffffff';
      formation += '<div style="display:flex;flex-direction:column;align-items:center;width:48px;">';
      formation += '<div style="position:relative;width:34px;height:34px;">';
      formation += shirt(pi, bg, numCol, 34);
      if (isCap) formation += '<span style="position:absolute;top:-3px;right:-3px;background:#fff;border:1px solid #E2E4DE;border-radius:50%;width:12px;height:12px;font-size:7px;font-weight:700;color:'+TEAM_US_COLOR+';display:flex;align-items:center;justify-content:center;line-height:1;">C</span>';
      formation += '</div>';
      formation += html`<div style="font-size:7.5px;font-weight:600;color:#1F1F1F;text-align:center;margin-top:2px;line-height:1.25;word-break:break-word;">${name||'—'}</div>`;
      formation += '</div>';
    });
    formation += '</div>';
  });
  formation += '</div>';

  // Exclude any bench player who started (pre-game sub)
  const startingPis = new Set(Object.values(snapSlotp).map(Number));
  const subs = [];
  for (let i = 16; i <= (state.maxB || 16); i++) {
    const n = gn(i);
    if (n && !startingPis.has(i)) subs.push({idx:i, name:n});
  }
  // Include pre-game replaced players (still part of the squad)
  Object.values(state.preGameSubs || {}).forEach(pi => {
    const n = gn(pi);
    if (n) subs.push({idx:pi, name:n});
  });
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

  // Right column: personnel events (subs + cards), ruled fallback if none yet
  const CARD_COLS = {'Yellow Card': CARD_YELLOW, 'Black Card': CARD_BLACK, 'Red Card': CARD_RED};
  const personnelEvts = state.evts.filter(ev => ev.action === 'sub' || ev.action in CARD_COLS);
  let personnelRows = '';
  if (!personnelEvts.length) {
    personnelRows = Array.from({length:14}, () =>
      '<div style="border-bottom:1px solid #E2E4DE;height:22px;"></div>'
    ).join('');
  } else {
    personnelEvts.forEach(ev => {
      const cardColor = CARD_COLS[ev.action];
      personnelRows += '<div style="display:flex;align-items:flex-start;gap:7px;padding:5px 0;border-bottom:1px solid #E2E4DE;">';
      personnelRows += `<span style="font-size:9px;color:#9A9E99;min-width:30px;padding-top:1px;">${ev.time}</span>`;
      if (ev.action === 'sub') {
        personnelRows += '<span style="color:#F59E0B;font-size:11px;line-height:1.3;flex-shrink:0;">&#x21C4;</span>';
      } else {
        personnelRows += `<span style="display:inline-block;width:8px;height:11px;background:${cardColor};border-radius:1px;flex-shrink:0;margin-top:2px;"></span>`;
      }
      personnelRows += html`<span style="font-size:10px;color:#1F1F1F;flex:1;line-height:1.4;">${ev.desc}</span>`;
      personnelRows += '</div>';
    });
  }
  const personnelCol =
    '<div style="flex:1;min-width:0;">' +
      prTitle('Personnel') +
      personnelRows +
    '</div>';

  // Notes — full width below, only rendered when content exists
  const notesSection = state.matchNotes && state.matchNotes.trim()
    ? '<div style="margin-bottom:28px;">' +
        prTitle('Match Notes') +
        html`<div style="font-size:11px;color:#1F1F1F;line-height:1.6;white-space:pre-wrap;">${state.matchNotes.trim()}</div>` +
      '</div>'
    : '';

  let h = '<div style="display:flex;gap:24px;align-items:flex-start;margin-bottom:' + (notesSection ? '16' : '28') + 'px;">';
  h += '<div style="flex:1;min-width:0;">';
  h += prTitle(html`Starting Line-up — ${state.usN}`);
  h += formation;
  h += '</div>';
  h += personnelCol;
  h += '</div>';
  h += notesSection;
  return h;
}

function buildPrintHTML() {
  const {
    pstats, wonCategories, lostCategories,
    goalCount, ptCount, twoPtCount, wideCount,
    placedGoals, placedPts, placedTwoPts, placedWides,
    turnoversWon, turnoversLost, freesWon,
    ownWon, ownLost, ownUnclear, oppWon, oppLost, oppUnclear,
    freesConc, freesScored,
  } = aggregateMatchStats(state.evts, state.trackTurnovers, state.slotp, pl);

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

  const scorers = getScorers(pstats);
  const discPlayers = getDiscPlayers(pstats);

  const usScore = state.goals+'-'+state.pts+' ('+((state.goals*3)+state.pts)+'pts)';
  const oppScore = state.og+'-'+state.op_+' ('+(state.og*3+state.op_)+'pts)';
  const matchDate = matchDisplayDate().toLocaleDateString('en-IE',{day:'numeric',month:'long',year:'numeric'});

  const usClub   = findClub(state.usN);
  const oppClub  = findClub(state.oppN);
  const oppPair  = findAmalgamPair(state.oppN);
  const venuePitch = state.location || usClub?.pitch || oppClub?.pitch || '';

  const crestImg = (src, label) => {
    if (!src) return '';
    return `<img src="${esc(src)}" alt="${esc(label)}" style="width:44px;height:44px;object-fit:contain;flex-shrink:0;" onerror="this.style.display='none'">`;
  };
  const crestImgPair = (src1, src2, label) => {
    const n = esc(label);
    return '<div style="position:relative;width:44px;height:44px;flex-shrink:0;">'
      + `<img src="${esc(src1)}" alt="${n}" style="position:absolute;top:0;left:0;width:28px;height:28px;object-fit:contain;" onerror="this.style.display='none'">`
      + `<img src="${esc(src2)}" alt="${n}" style="position:absolute;bottom:0;right:0;width:32px;height:32px;object-fit:contain;" onerror="this.style.display='none'">`
      + '</div>';
  };

  const usCrest    = usClub?.crest || findCountyCrest(state.usN) || '';
  const oppCrestEl = oppPair
    ? crestImgPair(oppPair[0].crest, oppPair[1].crest, state.oppN)
    : crestImg(oppClub?.crest || findCountyCrest(state.oppN) || '', state.oppN);

  let h = '';

  h += '<div class="pr-hdr">';
  h += '<div class="pr-title">Match Report</div>';
  h += '<div style="display:flex;align-items:center;justify-content:center;gap:12px;">';
  h += crestImg(usCrest, state.usN);
  h += html`<div class="pr-score">${state.usN} ${html.safe(usScore)}<br>${state.oppN} ${html.safe(oppScore)}</div>`;
  h += oppCrestEl;
  h += '</div>';
  h += '<div class="pr-teams">';
  h += '<span>'+matchDate+'</span>';
  if (venuePitch) h += html`<span>${venuePitch}</span>`;
  if (state.referee) h += html`<span>Ref: ${state.referee}</span>`;
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

  const {usPct: _usPct, oppPct: _oppPct, momTotal} = calculateMomentum(state.goals, state.pts, state.og, state.op_, ownWon, oppWon, ownLost, oppLost, turnoversWon, turnoversLost);
  if (momTotal > 0) {
    const usPct = _usPct, oppPct = _oppPct;
    const dominant = usPct > oppPct ? state.usN : usPct < oppPct ? state.oppN : null;
    const prBasisNote = (ownTotal+oppTotal > 0 && totalTurnovers > 0) ? 'Scores + restarts + turnovers'
      : (ownTotal+oppTotal > 0) ? 'Scores + restarts won'
      : totalTurnovers > 0 ? 'Scores + turnovers'
      : 'Based on scores';
    h += '<div class="pr-section">';
    h += '<div class="pr-section-title">Momentum</div>';
    h += '<div class="pr-card">';
    h += '<div style="height:10px;border-radius:5px;overflow:hidden;display:flex;margin-bottom:8px;">';
    h += '<div style="width:'+usPct+'%;background:'+TEAM_US_COLOR+';"></div>';
    h += '<div style="flex:1;background:'+TEAM_OPP_COLOR+';"></div>';
    h += '</div>';
    h += '<div style="display:flex;justify-content:space-between;font-size:13px;">';
    h += html`<span style="color:${TEAM_US_COLOR};font-weight:600;">${state.usN} <span style="font-weight:400;">${usPct}%</span></span>`;
    h += html`<span style="color:${TEAM_OPP_COLOR};font-weight:600;">${state.oppN} <span style="font-weight:400;">${oppPct}%</span></span>`;
    h += '</div>';
    if (dominant) h += html`<div style="font-size:11px;color:#6B6F66;margin-top:4px;">${dominant} dominant &mdash; ${html.safe(prBasisNote)}</div>`;
    h += '</div></div>';
  }

  // Scoring + Placed Balls
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
  if (placedAttempts > 0) {
    h += '<div style="border-top:1px solid #E2E4DE;margin:12px 0 10px;"></div>';
    h += '<div style="font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#6B6F66;margin-bottom:8px;">Placed Balls</div>';
    h += '<div class="pr-big" style="font-size:22px;">'+placedPct+'% <span style="font-size:14px;font-weight:500;color:#6B6F66;">conversion</span></div>';
    h += '<div class="pr-sub">'+placedScoreCount+' converted from '+placedAttempts+' attempt'+(placedAttempts!==1?'s':'')+(placedWides?' · '+placedWides+' wide'+(placedWides!==1?'s':''):'')+'</div>';
  }
  h += '</div></div>';

  // Player Scoring
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

  // Shot Map
  if (state.trackShotLocations) {
    const smPrint = buildPrintShotMapHTML();
    if (smPrint) h += smPrint;
  }

  // Turnovers
  if (totalTurnovers > 0) {
    const wonPct = Math.round(turnoversWon / totalTurnovers * 100);
    h += '<div class="pr-section">';
    h += '<div class="pr-section-title">Turnovers</div>';
    h += '<div class="pr-card">';
    h += '<div style="display:flex;gap:24px;align-items:center;margin-bottom:10px;">';
    h += '<span style="font-size:18px;font-weight:700;color:'+TEAM_US_COLOR+';">'+turnoversWon+' won</span>';
    h += '<span style="font-size:18px;font-weight:700;color:'+TEAM_OPP_COLOR+';">'+turnoversLost+' lost</span>';
    h += '</div>';
    h += '<div style="height:10px;border-radius:5px;overflow:hidden;display:flex;margin-bottom:6px;background:#F8D7D7;">';
    h += '<div style="width:'+wonPct+'%;background:'+TEAM_US_COLOR+';"></div>';
    h += '</div>';
    h += '<div class="pr-row"><span>Won</span><span style="color:'+TEAM_US_COLOR+';font-weight:600;">'+turnoversWon+' ('+wonPct+'%)</span></div>';
    h += '<div class="pr-row"><span>Lost</span><span style="color:'+TEAM_OPP_COLOR+';font-weight:600;">'+turnoversLost+' ('+(100-wonPct)+'%)</span></div>';
    const twPlayers = Object.values(pstats).filter(p=>p.twon+p.tlost>0).sort((a,b)=>(b.twon-b.tlost)-(a.twon-a.tlost)||a.name.localeCompare(b.name));
    twPlayers.forEach(p => {
      h += html`<div class="pr-row"><span>${p.name}</span><span>`;
      if (p.twon  > 0) h += `<span class="pr-tag" style="margin-right:4px;">+${p.twon}</span>`;
      if (p.tlost > 0) h += `<span class="pr-tag" style="background:#F8D7D7;color:#991B1B;">-${p.tlost}</span>`;
      h += '</span></div>';
      if (state.trackTurnovers) {
        const wonSecs  = Object.entries(p.twonSec).sort((a,b)=>b[1]-a[1]);
        const lostSecs = Object.entries(p.tlostSec).sort((a,b)=>b[1]-a[1]);
        if (wonSecs.length || lostSecs.length) {
          h += '<div style="display:flex;gap:5px;flex-wrap:wrap;padding:2px 0 4px 2px;">';
          wonSecs.forEach(([cat,n])  => h += `<span class="pr-tag" style="font-size:10px;background:#DFF3E3;color:${TEAM_US_COLOR};">${esc(cat)}${n>1?' ×'+n:''}</span>`);
          lostSecs.forEach(([cat,n]) => h += `<span class="pr-tag" style="font-size:10px;background:#F8D7D7;color:#991B1B;">${esc(cat)}${n>1?' ×'+n:''}</span>`);
          h += '</div>';
        }
      }
    });
    if (state.trackTurnovers) {
      const wonEntries  = Object.entries(wonCategories);
      const lostEntries = Object.entries(lostCategories);
      if (wonEntries.length || lostEntries.length) {
        const WON_COLORS  = {'First to the Ball':'#1B5E20','Tackle Turnover':'#388E3C','Block':'#66BB6A','Hook':'#00897B','Defensive Pressure':'#A5D6A7'};
        const LOST_COLORS = {'Poor Pass':'#B71C1C','Lost in Tackle':CARD_RED,'Second to the Ball':'#EF9A9A','Over Played':'#E65100','Isolated':'#FFAB91'};
        h += '<div style="border-top:1px solid #E2E4DE;margin-top:10px;padding-top:12px;display:flex;gap:8px;justify-content:space-around;flex-wrap:wrap;">';
        if (wonEntries.length)  h += buildTurnoverDonut('Won by type',  wonEntries,  WON_COLORS,  TEAM_US_COLOR);
        if (lostEntries.length) h += buildTurnoverDonut('Lost by type', lostEntries, LOST_COLORS, TEAM_OPP_COLOR);
        h += '</div>';
      }
    }
    h += '</div></div>';
  }

  // Frees Won
  if (freesWon > 0) {
    const fwPlayers = Object.values(pstats).filter(p=>p.freesWon>0).sort((a,b)=>b.freesWon-a.freesWon||a.name.localeCompare(b.name));
    h += '<div class="pr-section"><div class="pr-section-title">Frees Won</div><div class="pr-card">';
    h += '<div style="display:flex;gap:24px;align-items:center;margin-bottom:10px;">';
    h += '<span style="font-size:18px;font-weight:700;color:'+TEAM_US_COLOR+';">'+freesWon+' frees won</span>';
    h += '</div>';
    fwPlayers.forEach(p => { h += html`<div class="pr-row"><span>${p.name}</span><span class="pr-tag">${p.freesWon}</span></div>`; });
    h += '</div></div>';
  }

  // Restarts
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

  // Goalkeeper Performance
  if (state.trackGKPerformance) {
    const prGkEvts = state.evts.filter(e => e.gkOutcome != null && e.gkFinalValue != null);
    if (prGkEvts.length > 0) {
      const _prGk = calculateGKRating(prGkEvts, state.ageGrade);
      const prRating = _prGk ? _prGk.rating : 50;
      const prLabel = _prGk ? _prGk.label : 'Average';
      const prRatingCol = _prGk ? _prGk.ratingColor : '#F59E0B';
      const prSaves = _prGk ? _prGk.saves : 0;
      const prGoals = _prGk ? _prGk.goals : 0;
      const prGkName = gn(1) || 'Goalkeeper';
      const prShots = prSaves + prGoals;
      const prSaveRate = prShots > 0 ? Math.round(prSaves / prShots * 100) : 0;
      const prIntLabels = ['', 'Routine', 'Moderate', 'Challenging', 'Difficult', 'Exceptional'];
      h += '<div class="pr-section">';
      h += '<div class="pr-section-title">Goalkeeper Performance</div>';
      h += '<div class="pr-card">';
      h += html`<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;"><span style="font-size:14px;font-weight:600;color:#1F1F1F;">${prGkName}</span><span style="font-size:12px;color:#6B6F66;">${prSaves} save${prSaves!==1?'s':''} / ${prGoals} goal${prGoals!==1?'s':''} conceded (${prSaveRate}%)</span></div>`;
      h += `<div style="display:flex;align-items:baseline;gap:8px;margin-bottom:10px;">`;
      h += `<span style="font-size:36px;font-weight:800;color:${prRatingCol};line-height:1;">${prRating}</span>`;
      h += `<span style="font-size:14px;font-weight:700;color:${prRatingCol};">${prLabel}</span>`;
      h += `<span style="font-size:11px;color:#9A9E99;margin-left:auto;">/ 100</span>`;
      h += `</div>`;
      h += `<div style="position:relative;height:10px;margin-bottom:4px;">`;
      h += `<div style="height:10px;border-radius:5px;background:linear-gradient(to right,#C62828 0%,#F59E0B 45%,#4CAF50 100%);"></div>`;
      h += `<div style="position:absolute;top:-3px;left:${prRating}%;width:4px;height:16px;background:${prRatingCol};border-radius:2px;transform:translateX(-50%);box-shadow:0 1px 3px rgba(0,0,0,.35);"></div>`;
      h += `</div>`;
      h += `<div style="display:flex;justify-content:space-between;font-size:10px;color:#9A9E99;margin-bottom:4px;"><span>Struggling</span><span>Average</span><span>Excellent</span></div>`;
      if (prGkEvts.length >= 3) {
        const prLevels = [5, 4, 3, 2, 1].filter(i => prGkEvts.some(e => (e.gkIntensity || 3) === i));
        if (prLevels.length) {
          h += `<div style="border-top:1px solid #E2E4DE;margin-top:10px;padding-top:8px;">`;
          h += `<div style="font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#6B6F66;margin-bottom:8px;">By shot difficulty</div>`;
          prLevels.forEach(intensity => {
            const lvl = prGkEvts.filter(e => (e.gkIntensity || 3) === intensity);
            const sv = lvl.filter(e => e.gkOutcome === 'save').length;
            const pct = Math.round(sv / lvl.length * 100);
            const bc = pct >= 70 ? '#2E7D32' : pct >= 40 ? '#E65100' : '#C62828';
            h += `<div style="display:flex;align-items:center;gap:8px;padding:3px 0;">`;
            h += html`<div style="font-size:12px;color:#4A4A4A;min-width:96px;">${prIntLabels[intensity]}</div>`;
            h += `<div style="flex:1;background:#E8EAE5;border-radius:3px;overflow:hidden;height:6px;"><div style="background:${bc};width:${pct}%;height:100%;border-radius:3px;"></div></div>`;
            h += `<div style="font-size:12px;font-weight:600;color:${bc};min-width:36px;text-align:right;">${sv}/${lvl.length}</div>`;
            h += `</div>`;
          });
          h += `</div>`;
        }
      }
      h += '</div></div>';
    }
  }

  // Opposition Scoring Profile
  if (state.trackOppScorers) {
    const prOscEvts = state.evts.filter(e => e.oppScorer);
    if (prOscEvts.length > 0) {
      const prOscMap = {};
      prOscEvts.forEach(e => {
        const s = e.oppScorer;
        const key = s.label + ' (' + s.num + ')';
        if (!prOscMap[key]) prOscMap[key] = { num: s.num, label: s.label, goals: 0, pts: 0 };
        const a = e.action || '';
        if (a === 'Goal') prOscMap[key].goals++;
        else if (a === '2 Point') prOscMap[key].pts += 2;
        else prOscMap[key].pts++;
      });
      const prOscRows = Object.values(prOscMap).sort((a, b) => {
        const ta = a.goals * 3 + a.pts, tb = b.goals * 3 + b.pts;
        return tb !== ta ? tb - ta : a.num - b.num;
      });
      h += '<div class="pr-section">';
      h += '<div class="pr-section-title">Opposition Scoring Profile</div>';
      h += '<div class="pr-card">';
      prOscRows.forEach(r => {
        const total = r.goals * 3 + r.pts;
        h += html`<div class="pr-row"><span>#${r.num} ${r.label}</span><span class="pr-tag" style="background:#EDE7F6;color:#4A148C;">${r.goals}-${r.pts} (${total}pts)</span></div>`;
      });
      h += '</div></div>';
    }
  }

  const slCards = state.sidelineCards || [];
  if (discPlayers.length > 0 || freesConc > 0 || slCards.length > 0) {
    h += '<div class="pr-section">';
    h += '<div class="pr-section-title">Discipline</div>';
    h += '<div class="pr-card">';
    if (freesConc > 0) {
      h += '<div style="font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#6B6F66;margin-bottom:8px;">Frees Conceded</div>';
      h += `<div class="pr-row" style="margin-bottom:6px;"><span>Total</span><span style="font-weight:600;">${freesConc}</span></div>`;
      if (freesScored > 0) h += `<div class="pr-row" style="margin-bottom:${discPlayers.length>0?'12':'4'}px;"><span>Scored by opposition</span><span style="color:${TEAM_OPP_COLOR};font-weight:600;">${freesScored}</span></div>`;
    }
    if (discPlayers.length > 0) {
      if (freesConc > 0) h += '<div style="font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#6B6F66;margin-bottom:8px;">By Player</div>';
      discPlayers.forEach(p => {
        const freeTotal = Object.values(p.frees).reduce((s,n)=>s+n,0);
        h += '<div class="pr-row" style="align-items:center;gap:6px;">';
        if (p.yc+p.bc+p.rc > 0) {
          const _syc=p.syc||0, _syY=p.yc-2*_syc;
          h += '<span style="display:flex;gap:2px;flex-shrink:0;align-items:center;">';
          for (let i=0;i<_syY;i++) h+=`<span style="display:inline-block;width:9px;height:13px;background:${CARD_YELLOW};border-radius:2px;border:.5px solid rgba(0,0,0,.2);"></span>`;
          for (let i=0;i<_syc;i++) h+=`<span style="display:inline-flex;gap:1px;align-items:center;" title="Second Yellow"><span style="display:inline-block;width:9px;height:13px;background:${CARD_YELLOW};border-radius:2px;border:.5px solid rgba(0,0,0,.2);"></span><span style="display:inline-block;width:9px;height:13px;background:${CARD_YELLOW};border-radius:2px;border:.5px solid rgba(0,0,0,.2);"></span><span style="font-size:8px;color:#9A9E99;margin:0 1px;">→</span><span style="display:inline-block;width:9px;height:13px;background:${CARD_RED};border-radius:2px;"></span></span>`;
          for (let i=0;i<p.bc;i++) h+=`<span style="display:inline-block;width:9px;height:13px;background:${CARD_BLACK};border-radius:2px;"></span>`;
          for (let i=0;i<p.rc;i++) h+=`<span style="display:inline-block;width:9px;height:13px;background:${CARD_RED};border-radius:2px;"></span>`;
          h += '</span>';
        }
        h += html`<span style="flex:1;font-size:13px;">${p.name}</span>`;
        if (freeTotal > 0) {
          h += `<span style="font-size:11px;color:#6B6F66;">${freeTotal} free${freeTotal!==1?'s':''}`;
          const types = Object.entries(p.frees).sort((a,b)=>b[1]-a[1]).map(([t,n])=>esc(t)+(n>1?' ×'+n:'')).join(', ');
          h += ` &mdash; ${types}</span>`;
        }
        h += '</div>';
      });
    }
    if (slCards.length > 0) {
      if (freesConc > 0 || discPlayers.length > 0) h += '<div style="border-top:1px solid #E2E4DE;margin:10px 0;"></div>';
      h += '<div style="font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#6B6F66;margin-bottom:8px;">Sideline</div>';
      slCards.forEach(sc => {
        h += '<div class="pr-row" style="align-items:center;gap:6px;">';
        if (sc.type !== 'AdvFree') {
          const bg = sc.type === 'Yellow' ? CARD_YELLOW : CARD_RED;
          h += `<span style="display:inline-block;width:9px;height:13px;background:${bg};border-radius:2px;${sc.type==='Yellow'?'border:.5px solid rgba(0,0,0,.2);':''}flex-shrink:0;"></span>`;
        } else {
          h += `<span style="font-size:10px;font-weight:700;color:#92400E;background:#FEF3C7;padding:1px 5px;border-radius:3px;flex-shrink:0;">ADV FREE</span>`;
        }
        h += html`<span style="flex:1;font-size:13px;">${sc.name||'Coach/Manager'}</span>`;
        h += `<span style="font-size:11px;color:#6B6F66;">${esc(sc.time)}</span>`;
        h += '</div>';
      });
    }
    h += '</div></div>';
  }

  const subEvts = state.evts.filter(ev => ev.action === 'sub');
  if (subEvts.length > 0) {
    const _psSc={usG:0,usP:0,oppG:0,oppP:0};
    const psScoreAt=[];
    state.evts.forEach(ev => {
      applyScoreBadge(ev, _psSc, state.oppN);
      psScoreAt.push({usG:_psSc.usG,usP:_psSc.usP,oppG:_psSc.oppG,oppP:_psSc.oppP});
    });
    const fPsUsG=_psSc.usG,fPsUsP=_psSc.usP,fPsOppG=_psSc.oppG,fPsOppP=_psSc.oppP;

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
      h += '<div style="font-size:10px;color:#9A9E99;margin-top:1px;"><span style="color:'+TEAM_US_COLOR+';">+'+aUG+'-'+aUP+'</span> / <span style="color:'+TEAM_OPP_COLOR+';">+'+aOG+'-'+aOP+'</span></div>';
      h += '</div>';
      h += '</div>';
    });
    h += html`<div style="padding:6px 14px;font-size:10px;color:#9A9E99;">After = goals-pts scored from sub on (${state.usN} / ${state.oppN})</div>`;
    h += '</div></div>';
  }

  // Play Time
  if (state.trackGameTime) {
    const { ptMap: prPtMap } = computePlayTimes();
    const prPtRows = Object.entries(prPtMap)
      .map(([pi, t]) => ({pi:+pi, name:gn(+pi), t}))
      .filter(r => r.name)
      .sort((a, b) => b.t - a.t || a.name.localeCompare(b.name));
    if (prPtRows.length) {
      const prStartPis = new Set(Object.values(state.startSlotp||{}).map(Number));
      const prMaxT = prPtRows[0].t || 1;
      h += '<div class="pr-section pr-section-flow">';
      h += '<div class="pr-section-title">Play Time</div>';
      h += '<div class="pr-card">';
      prPtRows.forEach(r => {
        const pct = Math.round(r.t / prMaxT * 100);
        const isSub = !prStartPis.has(r.pi);
        h += '<div style="display:flex;align-items:center;gap:10px;padding:4px 0;">';
        h += `<div style="font-size:12px;font-weight:${isSub?'400':'600'};color:#1F1F1F;min-width:120px;white-space:nowrap;">${esc(r.name)}</div>`;
        h += `<div style="flex:1;background:#E8EAE5;border-radius:3px;overflow:hidden;height:7px;"><div style="background:${TEAM_US_COLOR};opacity:${isSub?'.5':'1'};width:${pct}%;height:100%;border-radius:3px;"></div></div>`;
        h += `<div style="font-size:12px;font-weight:700;color:${TEAM_US_COLOR};min-width:38px;text-align:right;">${formatSeconds(r.t)}</div>`;
        h += `<div style="font-size:10px;color:#9A9E99;min-width:22px;">${isSub?'Sub':''}</div>`;
        h += '</div>';
      });
      h += '</div></div>';
    }
  }

  h += '<div class="pr-footer">Generated by GAA Match Tracker</div>';
  return h;
}

function buildPrintShotMapHTML() {
  const shotActs = new Set(['Goal','Point','2 Point','Wide','Short','Saved']);
  let inH2 = false;
  const shots = [];
  state.evts.forEach(ev => {
    if (ev.badge === '1H') { if ((ev.desc||'').includes('ended')) inH2 = true; return; }
    if (!shotActs.has(ev.action) || !ev.zone) return;
    const pi = ev.pi != null ? ev.pi : (ev.slot != null ? state.slotp[ev.slot] : null);
    shots.push({ action: ev.action, zone: ev.zone, half: inH2 ? 'h2' : 'h1', pi, placed: PLACED_BALL.has(ev.sec), sec: ev.sec });
  });
  if (shots.length === 0) return '';

  const { dots, thirds } = computeShotDots(shots, pi => gi(pi));
  let h = '<div class="pr-section pr-break">';
  h += '<div class="pr-section-title">Shot Map</div>';
  h += '<div class="pr-card" style="padding:0;overflow:hidden;">';
  h += `<svg viewBox="0 0 320 400" xmlns="http://www.w3.org/2000/svg" style="width:100%;display:block;" preserveAspectRatio="xMidYMid meet">${PITCH_SVG_INNER}${dots}</svg>`;
  h += '<div style="padding:10px 14px;">';
  h += '<div style="display:flex;gap:14px;margin-bottom:10px;font-size:11px;color:#4A4A4A;align-items:center;">';
  h += '<span style="display:flex;align-items:center;gap:4px;"><svg width="12" height="12"><circle cx="6" cy="6" r="5" fill="'+TEAM_US_COLOR+'" opacity=".82"/></svg>Score</span>';
  h += '<span style="display:flex;align-items:center;gap:4px;"><svg width="12" height="12"><circle cx="6" cy="6" r="5" fill="'+TEAM_OPP_COLOR+'" opacity=".82"/></svg>Wide</span>';
  h += '<span style="display:flex;align-items:center;gap:4px;"><svg width="12" height="12"><circle cx="6" cy="6" r="5" fill="#9E9E9E" opacity=".82"/></svg>Short</span>';
  h += '<span style="display:flex;align-items:center;gap:4px;"><svg width="12" height="12"><circle cx="6" cy="6" r="5" fill="#F97316" opacity=".82"/></svg>Saved</span>';
  h += '<span style="display:flex;align-items:center;gap:4px;"><svg width="14" height="14"><circle cx="7" cy="7" r="6" fill="'+TEAM_US_COLOR+'" opacity=".82" stroke="white" stroke-width="1"/></svg>Goal</span>';
  h += '<span style="display:flex;align-items:center;gap:4px;"><svg width="18" height="18"><circle cx="9" cy="9" r="8" fill="none" stroke="'+TEAM_US_COLOR+'" stroke-width="1.5" opacity=".7"/><circle cx="9" cy="9" r="5" fill="'+TEAM_US_COLOR+'" opacity=".82" stroke="white" stroke-width="1"/></svg>Placed</span>';
  h += '</div>';
  const thirdRows = [['Attacking third',thirds.att],['Middle third',thirds.mid],['Defensive third',thirds.def]];
  if (thirdRows.some(([,d]) => d.shots > 0)) {
    h += '<table style="width:100%;font-size:12px;border-collapse:collapse;">';
    h += '<tr style="color:#6B6F66;font-size:11px;"><th style="text-align:left;padding:4px 0;font-weight:500;">Zone</th><th style="text-align:center;font-weight:500;">Shots</th><th style="text-align:center;font-weight:500;">Scores</th><th style="text-align:center;font-weight:500;">Conv%</th></tr>';
    thirdRows.forEach(([label,d]) => {
      if (d.shots === 0) return;
      h += `<tr><td style="padding:3px 0;color:#4A4A4A;">${label}</td><td style="text-align:center;color:#1F1F1F;">${d.shots}</td><td style="text-align:center;color:#1F1F1F;">${d.scores}</td><td style="text-align:center;font-weight:600;color:${TEAM_US_COLOR};">${pct(d.scores,d.shots)}</td></tr>`;
    });
    h += '</table>';
  }
  h += '</div></div></div>';
  return h;
}

function printStats() {
  const area = document.getElementById('print-area');
  // eslint-disable-next-line no-restricted-syntax -- safe: buildPrintHTML() passes all user data through esc()
  area.innerHTML = buildPrintHTML();
  const imgs = Array.from(area.querySelectorAll('img'));
  if (!imgs.length) { window.print(); return; }
  let pending = imgs.length;
  const done = () => { if (--pending === 0) window.print(); };
  imgs.forEach(img => {
    if (img.complete) { done(); }
    else { img.addEventListener('load', done); img.addEventListener('error', done); }
  });
}
