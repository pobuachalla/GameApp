'use strict';

// ─── AI ANALYSIS CONFIG ───────────────────────────────────────────────────────
// Edit this file to change the analysis prompt or add/remove AI targets.

const AI_CONFIG = {

  // ── Targets ─────────────────────────────────────────────────────────────────
  targets: [
    {
      id:     'claude',
      label:  'Claude',
      url:    'https://claude.ai/new',
      appUrl: 'claude://',
      img:    'claude-logo.svg',
      bg:     '#F3E5F5',
      fg:     '#6A1B9A'
    },
    {
      id:     'chatgpt',
      label:  'ChatGPT',
      url:    'https://chatgpt.com/',
      appUrl: 'chatgpt://',
      img:    'openai-logo.svg',
      bg:     '#E8F5E9',
      fg:     '#1B5E20'
    }
  ],

  // ── Age-grade guidance ────────────────────────────────────────────────────────
  // Returns a block of age-specific instructions to inject into the prompt,
  // or null if no age grade is set or it cannot be classified.
  _ageGradeGuidance(ag) {
    if (!ag) return null;
    const s = ag.toLowerCase().replace(/[^a-z0-9]/g, '');
    const m = s.match(/u(\d+)/) || s.match(/under(\d+)/);
    const age    = m ? parseInt(m[1]) : null;
    const minor  = s.includes('minor');
    const adult  = s.includes('junior') || s.includes('senior') || s.includes('adult');

    if (age !== null && age <= 14) {
      return `AGE GRADE CONTEXT (${ag}):
At this age, building confidence to shoot is the priority. Do not treat wides as a negative \
pattern — a player willing to shoot from distance is showing exactly the right instinct. \
Frame all scoring pattern analysis around shooting frequency and willingness rather than \
efficiency. A high wide count from an active scorer is a positive sign at this grade and \
should be framed as such. Do not set or imply conversion rate targets.`;
    }
    if (age === 16) {
      return `AGE GRADE CONTEXT (${ag}):
At U16, shot selection is becoming relevant but conversion rate is not yet the primary concern. \
Flag wides that came from poor positions — acute angles from the end line or sideline, or \
shots taken under immediate pressure with a better option available — as decision-making issues \
to address. Wides from reasonable positions, even at distance, should be framed positively as \
a willingness to shoot. Do not apply a hard conversion rate target; focus the scoring pattern \
analysis on where attempts were taken from rather than how many were missed.`;
    }
    if (minor || adult || (age !== null && age >= 17)) {
      return `AGE GRADE CONTEXT (${ag}):
At this grade, scoring efficiency is a meaningful metric. A conversion rate below 70% \
(scores as a proportion of all scoring attempts including wides and shots saved) warrants \
direct comment in the scoring pattern analysis. Distinguish between wides caused by poor \
shot selection (bad position, rushed decision) and those caused by poor execution under \
reasonable pressure — these require different interventions. Frame the scoring section \
around decision quality and efficiency, and be direct if the team is leaving scoreable \
chances behind.`;
    }
    return '';
  },

  // ── Tone guidance ─────────────────────────────────────────────────────────────
  // Returns the closing tone instruction for the prompt — calibrated to age grade.
  // Younger = constructive and encouraging. Older = direct, no cushioning.
  _toneGuidance(ag) {
    if (!ag) return 'Keep the tone direct — this report will be used in a coaching session, not published.';
    const s = ag.toLowerCase().replaceAll(/[^a-z0-9]/g, '');
    const m = s.match(/u(\d+)/) || s.match(/under(\d+)/);
    const age   = m ? Number.parseInt(m[1]) : null;
    const minor = s.includes('minor');
    const adult = s.includes('junior') || s.includes('senior') || s.includes('adult');

    if (age !== null && age <= 14) {
      return `TONE: This report may be shared with young players in a team setting. \
Lead every section with what the team did well before identifying areas for improvement. \
Use constructive, encouraging language throughout — do not frame turnovers, wides, or free \
concessions as failures, but as specific and solvable learning moments. The overall tone \
should leave players feeling capable and motivated, not criticised.`;
    }
    if (age !== null && age <= 16) {
      return `TONE: This is a developmental coaching report. Acknowledge what the team executed \
well, then be clear and specific about patterns that need to change. Avoid harsh or deflating \
language, but do not bury problems in qualifications. A coach and young players will read this \
together — be honest but supportive. Do not over-praise, and do not over-criticise.`;
    }
    if (minor || adult || (age !== null && age >= 17)) {
      return `TONE: This is a competitive report for experienced coaches. Be direct. Do not \
soften negative findings with positive framing, do not use "however" or "despite" to cushion a \
problem, and do not open paragraphs with praise before arriving at the issue. If an area of \
play was poor, say so plainly and without qualification. Coaches at this level need accurate \
analysis, not encouragement.`;
    }
    return 'Keep the tone direct — this report will be used in a coaching session, not published.';
  },

  // ── Prompt template ──────────────────────────────────────────────────────────
  // Receives the match payload object and returns the full prompt string.
  buildPrompt(payload) {
    const ageCtx = this._ageGradeGuidance(payload.ageGrade);
    let prompt = `You are an expert GAA (Gaelic Athletic Association) match analyst. Your job is to identify \
patterns, turning points, and momentum shifts — not to narrate what happened. A coach reading this \
already knows the result; they need to understand the underlying dynamics that produced it.

Write in clear, analytical prose with short paragraph headings. Do not narrate individual events \
(e.g. avoid "In the 14th minute, Player X scored"). Instead identify when momentum shifted, what \
triggered it, and whether the same dynamic repeated across the match. Every section should answer \
"why" and "how often" — not just "what".

GAELIC GAMES CONTEXT:
- Goal = 3 points (ball into the net under the crossbar)
- Point = 1 point (ball over the crossbar between the posts)
- Score notation: Goals-Points (total in brackets), e.g. 2-14 (20pts)
- Sports: Football and Hurling. Hurling uses a hurley and sliotar.
- Kickout (football) / Puck-out (hurling): restart after a score or wide, taken by the goalkeeper.
- Turnover Won: our team regains possession. Turnover Lost: opposition regains possession.
- Free: a foul by our team conceding a free kick/puck to the opposition.

PITCH ZONE GUIDE:
Where shot location is tagged, each event includes a [pitch zone] label. The pitch is divided \
into a 7-row × 5-column grid. Row 0 is the defensive end (goalkeeper's own goal area); \
row 6 is the attacking end (directly in front of the opposition goal). Columns run left (0) \
to right (4), with column 2 being the centre of the pitch.

Use the following framework to evaluate shot selection quality:

PRIME ZONE — rows 5–6, columns 1–3 (inside the 45, between the wide channels):
Any attempt from this zone is a sound shooting decision regardless of outcome. Wides from \
here are execution misses, not selection errors.

ACUTE ANGLE — rows 5–6, columns 0 or 4 (wing positions close to goal):
These are shots taken from the end line or tight sideline angle. The scoring arc is severely \
reduced. In open play these represent poor shot selection — the correct decision is almost \
always to work the ball back to a central position or draw a foul. Flag these as selection \
errors when they appear as wides or saved shots.

LONG RANGE CENTRAL — rows 3–4, columns 1–3 (45m to 65m line, central corridor):
Reasonable attempts for quality forwards, particularly from placed balls. Flag as marginal \
in open play if the player had an option to advance. A wide from here is not automatically \
a selection error but warrants comment if it recurs.

LONG RANGE WIDE — rows 3–4, columns 0 or 4 (45m–65m, wing positions):
Long distance combined with a wide angle. Almost always poor selection in open play. \
Flag consistently.

OWN HALF — rows 0–2 (any column):
Shots from the team's own half are very long range. In open play these are poor decisions \
unless the player is an exceptional long-range specialist. Flag as selection errors.

When shot location data is present, apply this framework to every wide, saved shot, and \
missed attempt in the event log. Identify whether misses cluster in a particular zone \
category and distinguish selection errors from execution misses in your analysis.

${ageCtx ? ageCtx + '\n\n' : ''}COVER THE FOLLOWING — in analytical prose with short paragraph headings:

Momentum Map
Divide the match into its natural phases. For each phase state the direction of momentum and \
identify the specific trigger that ended it — a scoring run, a turnover cluster, a discipline \
lapse, a substitution, a restart. Name the single most decisive momentum swing in the match \
and explain what caused it.

Scoring Patterns
Identify scoring runs, drought periods, and the events that bookend them. Are there repeating \
conditions — a restart type, a particular player, a phase of play — that precede scoring bursts \
or droughts? How was scoring distributed across halves, and did the team's efficiency change \
as the match progressed? Where shot location data is available, classify missed attempts by \
zone category (prime zone, acute angle, long range central, long range wide, own half) and \
state clearly whether wides and misses were selection errors or execution misses. If a player \
or pattern of attempts repeatedly comes from a poor zone, name it explicitly.

Possession & Pressure Patterns
Where and when did possession break down? Look for chained turnovers (won turnover immediately \
followed by a lost one — failure to capitalise), pressure clusters (multiple turnovers and frees \
conceded in a short window), and any recurring pitch position or phase of play where the team \
struggled to retain the ball. Quantify how often each pattern appeared.

Restarts
Did either team establish a repeating advantage from kickouts or puck-outs? Identify which \
restart type showed a structural pattern and whether it directly preceded scoring sequences. \
Avoid listing individual restart outcomes.

Discipline
Did frees or cards cluster around specific time windows, pitch zones, or game situations? \
Identify whether this represents a structural risk or an isolated incident. Name players \
where the pattern repeats.

Substitutions
For each change, note the scoreline and momentum context at the time. Is there evidence — \
positive or negative — of a shift in the minutes that followed? Be specific about what changed \
in the event sequence, not just the score.

Individual Patterns
Rather than listing standout performers, identify players whose actions show a repeating \
pattern across the match — a player whose turnovers clustered in a particular half, a forward \
whose scoring came in one short window, a player who drew or conceded repeated frees. \
Note both positive and negative patterns.

Coaching Priorities
Three specific, actionable session priorities derived directly from the patterns identified \
above. Write as clear directives, not observations.

NAMING & TIMING STYLE:
Refer to players by full name on first mention, then First Initial. Surname \
(e.g. "Ciarán Kearney" → "C. Kearney") thereafter. Express time as "early/late in the \
first/second half" or "the opening ten minutes" rather than quoting raw timestamps. \
Where several similar events cluster, describe them as a group in one sentence.

Ground every observation in actual sequences from the event log. \
${this._toneGuidance(payload.ageGrade)}

End the report with the following disclaimer, reproduced exactly and in full:

---
Data & AI Notice: This analysis was generated by an AI model based on match data captured \
manually by a sideline operator during live play. Reactive, real-time data collection of \
this kind is subject to human factors including missed events, timing inaccuracies, \
misattributed actions, and incomplete sequences — particularly during periods of high \
intensity or congestion. Observations and patterns identified in this report should be \
treated as analytical prompts for discussion rather than definitive conclusions. Coaches \
are encouraged to cross-reference with video footage and their own match observations \
before acting on any finding. This report was produced by an AI assistant and does not \
constitute professional coaching advice.
---

---
FIXTURE:
${payload.fixture}

FINAL SCORE:
${payload.result}

SQUAD (position number → player name):
${payload.squad}

EVENT LOG (time  player  action  sub-type  [pitch zone if tagged]):
${payload.eventLog}`;
    if (payload.gkContext) {
      prompt += '\n\nGOALKEEPER PERFORMANCE (mention only where relevant — do not dedicate a section to this unless it was decisive):\n' + payload.gkContext;
    }
    if (payload.oppScorerContext) {
      prompt += '\n\nOPPOSITION SCORING THREAT (only comment on this if the data shows a clear standout — do not mention it if scoring was evenly spread across positions):\n' + payload.oppScorerContext;
    }
    if (payload.assessContext) {
      prompt += '\n\nCOACH ASSESSMENT (subjective 1–5 ratings entered by the coach after the match — use these as context for the coach\'s own read of the game, but ground every observation in the event log rather than accepting these ratings uncritically; note any significant divergence between the coach\'s assessment and what the data shows):\n' + payload.assessContext;
    }
    return prompt;
  },

  // ── Zone label ────────────────────────────────────────────────────────────────
  // Converts a zone object {id:'z-row-col'} to a plain-English pitch location.
  // Grid is 7 rows (row 0 = defensive end, row 6 = attacking goalmouth) × 5 cols.
  _zoneLabel(zone) {
    if (!zone || !zone.id) return null;
    const parts = zone.id.split('-');
    const r = parseInt(parts[1]), c = parseInt(parts[2]);
    const rowLabels = [
      'own defensive zone', // row 0
      'own 20m area',       // row 1
      'own half',           // row 2
      '65m line',           // row 3
      '45m zone',           // row 4
      'inside the 45',      // row 5
      'goalmouth / inside the 20m', // row 6
    ];
    const colLabels = ['left wing', 'left channel', 'centre', 'right channel', 'right wing'];
    const row = rowLabels[r] || ('row ' + r);
    const col = colLabels[c] || ('col ' + c);
    return col === 'centre' ? `${row}, centre` : `${row}, ${col}`;
  },

  // ── Event log formatter ───────────────────────────────────────────────────────
  // Converts raw events into a human-readable line per event.
  buildEventLog(state) {
    const pnames = state.pnames || {};
    const slotp  = state.slotp  || {};
    const fullName = pi => (pnames[pi] || '').trim() || `#${pi}`;
    const playerOf = ev => {
      const pi = ev.pi != null ? ev.pi : (ev.slot != null ? slotp[ev.slot] : null);
      return pi != null ? fullName(pi) : null;
    };

    return (state.evts || []).map(ev => {
      const t = ev.time || '??:??';
      if (ev.badge === '1H')  return `${t}  ───  HALF TIME`;
      if (ev.badge === '2H')  return `${t}  ───  SECOND HALF BEGINS`;
      if (ev.badge === 'END') return `${t}  ───  FULL TIME`;
      if (ev.badge === 'OPP') return `${t}  Opposition        ${ev.desc || ''}`;
      if (ev.badge === 'ADJ') {
        const adjDesc = ev.desc || '';
        return `${t}  Score adjustment  ${adjDesc}`;
      }
      if (ev.badge === 'RSTR') return `${t}  Restart           ${ev.desc || ''}`;
      const player  = (playerOf(ev) || '—').padEnd(22);
      const action  = ev.action || ev.badge || '?';
      const sub     = ev.sec ? ` (${ev.sec})` : '';
      const zoneLbl = ev.zone ? `  [${this._zoneLabel(ev.zone)}]` : '';
      const extra   = ev.action === 'sub'     ? `  ${ev.desc || ''}`
                    : ev.action === 'GK Save' ? `  [I·${ev.gkIntensity} S·${ev.gkSaveScore} V·${ev.gkFinalValue}${ev.gkSecondary != null ? ' S2·' + ev.gkSecondary : ''}]`
                    : '';
      return `${t}  ${player}  ${action}${sub}${zoneLbl}${extra}`;
    }).join('\n');
  },

  // ── Payload builder ──────────────────────────────────────────────────────────
  // Extracts the relevant match data from state to keep the prompt focused.
  buildPayload(state) {
    const squadLines = Object.entries(state.slotp || {})
      .sort(([a], [b]) => +a - +b)
      .map(([slot, pi]) => `  #${slot}: ${(state.pnames && state.pnames[pi]) || `#${pi}`}`)
      .join('\n');

    const fixture = [
      `  Teams:       ${state.usN || '?'} vs ${state.oppN || '?'}`,
      `  Sport:       ${state.sport || 'football'}`,
      state.competition ? `  Competition: ${state.competition}` : null,
      state.location    ? `  Location:    ${state.location}`    : null,
      state.matchDate   ? `  Date:        ${state.matchDate}`   : null,
      state.ageGrade    ? `  Age grade:   ${state.ageGrade}`    : null,
    ].filter(Boolean).join('\n');

    // GK context — only include when the keeper had a notably good or bad game (outside the average band)
    let gkContext = null;
    if (state.trackGKPerformance) {
      const gkEvts = (state.evts || []).filter(e => e.gkOutcome != null && e.gkFinalValue != null);
      if (gkEvts.length >= 3) {
        let wSum = 0, wTot = 0, saves = 0, goals = 0;
        gkEvts.forEach(e => {
          const wt = 1 + ((e.gkIntensity || 3) - 1) * 0.4;
          wSum += (e.gkFinalValue - 4) * wt;
          wTot += wt;
          if (e.gkOutcome === 'save') saves++; else goals++;
        });
        const rating = Math.round(50 + (Math.max(-4, Math.min(4, wTot > 0 ? wSum / wTot : 0)) / 4) * 50);
        const label  = rating >= 80 ? 'Outstanding' : rating >= 65 ? 'Very Good' : rating >= 55 ? 'Good'
          : rating >= 45 ? 'Average' : rating >= 35 ? 'Below Average' : rating >= 20 ? 'Poor' : 'Very Poor';
        if (rating >= 65 || rating <= 35) {
          const shots    = saves + goals;
          const gkPi     = (state.slotp || {})[1];
          const gkName   = (state.pnames && gkPi && state.pnames[gkPi]) ? state.pnames[gkPi].trim() : 'Goalkeeper';
          const hardSaves = gkEvts.filter(e => e.gkOutcome === 'save' && (e.gkIntensity || 0) >= 4).length;
          gkContext = `${gkName} rated ${rating}/100 (${label}) across ${shots} tracked shots (${saves} saves, ${goals} goals conceded).`;
          if (rating >= 65 && hardSaves > 0) gkContext += ` Made ${hardSaves} save${hardSaves !== 1 ? 's' : ''} from difficult or exceptional shots.`;
          if (rating <= 35) gkContext += ` Conceded ${goals} goal${goals !== 1 ? 's' : ''} including from shots rated as preventable.`;
        }
      }
    }

    // Opposition scorer context — only surface when one position is a standout threat
    let oppScorerContext = null;
    if (state.trackOppScorers) {
      const oscEvts = (state.evts || []).filter(e => e.oppScorer);
      if (oscEvts.length > 0) {
        const oscMap = {};
        oscEvts.forEach(e => {
          const s = e.oppScorer;
          const key = s.label + ' (' + s.num + ')';
          if (!oscMap[key]) oscMap[key] = { num: s.num, label: s.label, goals: 0, pts: 0 };
          const a = e.action || '';
          if (a === 'Goal') oscMap[key].goals++;
          else if (a === '2 Point') oscMap[key].pts += 2;
          else oscMap[key].pts++;
        });
        const oscRows = Object.values(oscMap)
          .map(r => ({ ...r, total: r.goals * 3 + r.pts }))
          .sort((a, b) => b.total - a.total);
        const grandTotal = oscRows.reduce((s, r) => s + r.total, 0);
        const top = oscRows[0];
        // Flag as standout if top scorer contributed ≥40% of tracked opp scoring, or scored a goal
        const isStandout = grandTotal > 0 && (top.goals > 0 || top.total / grandTotal >= 0.4);
        if (isStandout) {
          const scoreStr = top.goals + '-' + top.pts + ' (' + top.total + 'pts)';
          const pct = Math.round(top.total / grandTotal * 100);
          oppScorerContext = `${top.label} (#${top.num}) was the primary scoring threat for ${state.oppN || 'the opposition'}, contributing ${scoreStr} — ${pct}% of tracked opposition scoring.`;
          if (oscRows.length > 1) {
            const others = oscRows.slice(1).map(r => r.label + ' (#' + r.num + ') ' + r.goals + '-' + r.pts).join(', ');
            oppScorerContext += ` Other recorded scorers: ${others}.`;
          }
        }
      }
    }

    // Coach team assessment context
    let assessContext = null;
    const ta = state.teamAssessment;
    if (ta) {
      const DIMS = [
        { key:'effort',    label:'Effort'     },
        { key:'skill',     label:'Skill'      },
        { key:'tactics',   label:'Tactics'    },
        { key:'intensity', label:'Intensity'  },
        { key:'discipline',label:'Discipline' },
        { key:'spirit',    label:'Spirit'     },
      ];
      const rated = DIMS.filter(d => (ta[d.key] || 0) > 0);
      if (rated.length > 0) {
        const lines = rated.map(d => `  ${d.label}: ${ta[d.key]}/5`).join('\n');
        const avg   = (rated.reduce((s, d) => s + ta[d.key], 0) / rated.length).toFixed(1);
        const dimWord = rated.length === 1 ? 'dimension' : 'dimensions';
        assessContext = `${lines}\n  Overall (${rated.length} ${dimWord} rated): ${avg}/5`;
        if (ta.notes && ta.notes.trim()) {
          assessContext += `\n  Coach observations: ${ta.notes.trim()}`;
        }
      }
    }

    return {
      fixture,
      ageGrade:   state.ageGrade || '',
      result:     `  ${state.usN || 'Us'}: ${state.goals}-${state.pts} (${state.goals * 3 + state.pts}pts)` +
                  `\n  ${state.oppN || 'Opposition'}: ${state.og}-${state.op_} (${state.og * 3 + state.op_}pts)`,
      squad:      squadLines,
      eventLog:   this.buildEventLog(state),
      gkContext,
      oppScorerContext,
      assessContext,
    };
  }

};
