# Business Requirements Document — GAA Match Tracker

**Version:** 1.0  
**Date:** May 2026  
**Status:** Current

---

## 1. Purpose

The GAA Match Tracker is a mobile-first progressive web application that enables coaches, selectors, and statisticians to record match events in real time during Gaelic games, then generate analysis and shareable content immediately after the final whistle. It operates entirely offline in the browser and requires no app installation.

---

## 2. Business Objectives

| ID | Objective |
|----|-----------|
| BO-1 | Reduce the time from final whistle to post-match analysis from hours to minutes |
| BO-2 | Provide coaches with event-level evidence to underpin tactical decisions |
| BO-3 | Enable accurate score and event records that replace manual paper tracking |
| BO-4 | Allow AI-assisted coaching reports calibrated to the team's age grade |
| BO-5 | Support Meath GAA club structures including registered combined clubs and ad-hoc amalgamations |

---

## 3. Scope

### In Scope
- Real-time match event capture via a touch-optimised UI
- Gaelic Football (15-a-side and 13-a-side) and Hurling
- Age grades from Go Games (U8) through Senior
- Score, player action, discipline, substitution, and restart tracking
- Optional advanced modules: GK performance, opposition scorer profiling, shot location zones, turnover categorisation
- Post-match statistics panel and printable report
- Share graphics (score card, lineup card) for WhatsApp and social media
- AI analysis via Claude or ChatGPT, with age-grade-sensitive tone
- Match data export/import (JSON) and merge utility
- Meath GAA club directory with crest lookup, including amalgam pair detection

### Out of Scope
- Multi-device synchronisation / cloud storage
- Video integration
- Referee or official-facing views
- Opponent squad management

---

## 4. Users

| Persona | Description | Primary Goal |
|---------|-------------|--------------|
| Sideline Operator | Coach or selector operating the app during the game | Accurate, fast event capture without disrupting their coaching role |
| Team Manager | Reviews output after the match | Quickly understand patterns and priorities |
| Coach (AI user) | Generates AI coaching report | Evidence-based session priorities |
| Administrator | Manages squad templates | Efficient setup before each game |

---

## 5. Functional Requirements

### 5.1 Match Setup

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-1 | User must be able to record home team name, opposition name, competition, date, and age grade before the match | Must |
| FR-2 | Team name typeahead must suggest Meath GAA clubs and Irish counties with crest previews | Should |
| FR-3 | Opposition name with "/" must be detected as either a registered combined club (single crest) or an ad-hoc amalgamation (dual stacked crests) | Should |
| FR-4 | Age grade must be selectable from a defined list: U8, U10, U12, U14, U16, Minor, U20, Junior, Senior | Must |
| FR-5 | Age grade selection must display a category badge: Go Games (U8–U12), Juvenile (U14–Minor), Adult (U20–Senior) | Should |
| FR-6 | All fields must be optional; the app must function without any setup data | Must |
| FR-7 | Squad templates must be saveable and loadable by name | Should |
| FR-8 | Player names must support Irish characters and may be reordered by drag-and-drop within the settings panel | Should |

### 5.2 Match Timer

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-9 | Timer must progress through a defined state machine: PRE_MATCH → RUNNING_FIRST_HALF → PAUSED_FIRST_HALF → HALF_TIME → RUNNING_SECOND_HALF → PAUSED_SECOND_HALF → FULL_TIME | Must |
| FR-10 | Timer display must show MM:SS elapsed and update every second while running | Must |
| FR-11 | Ending a half or match must require a confirmation dialog | Must |
| FR-12 | Ending a half or match must immediately display a score graphic | Must |
| FR-13 | Screen must remain on while the timer is running (Wake Lock API, where supported) | Should |

### 5.3 Scoring

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-14 | Scores must be displayed in GAA format: Goals–Points (Total) for both teams | Must |
| FR-15 | A Goal must add 3 points to the total; a Point must add 1; a 2-Point (hurling) must add 2 | Must |
| FR-16 | Scores must be recordable via player actions or via direct score adjustment buttons | Must |
| FR-17 | Opposition scores must be adjustable independently of player actions | Must |
| FR-18 | Score adjustments must not drive scores below zero | Must |
| FR-19 | Half-time and full-time scores must be captured at the moment of state transition | Must |

### 5.4 Player Actions

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-20 | Player buttons must be tappable to open a contextual action sheet | Must |
| FR-21 | Action sheet must offer: Goal, Point, 2 Point (hurling), Wide, Short, Saved, Turnover Won, Turnover Lost, Free Conceded, Card, Substitution | Must |
| FR-22 | Scoring actions (Goal/Point/Wide) must capture how the score was taken (From Play, From Free, From '45/'65, From Sideline, etc.) | Must |
| FR-23 | Scoring actions must capture the restart outcome (Won/Lost/Unclear) | Should |
| FR-24 | If shot location tracking is enabled, scoring actions must prompt for a pitch zone | Should |
| FR-25 | Cards must be recorded as Yellow, Black, or Red against the individual player | Must |
| FR-26 | Red-carded players must be visually marked and prevented from recording further actions | Must |
| FR-27 | Substitutions must update the player button to reflect the new player | Must |
| FR-28 | A captain designation must be displayable on the score graphic | Should |
| FR-29 | Up to two subs per bench slot must be supported (chain substitutions) | Should |

### 5.5 Event Log

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-30 | Every action must append a timestamped event row to the event log | Must |
| FR-31 | The last action must be undoable at any time; undo must reverse all score and state side-effects | Must |
| FR-32 | Events must be selectable in bulk and deletable | Should |

### 5.6 Statistics

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-33 | Stats panel must be accessible during and after the match | Must |
| FR-34 | Stats must include: score timeline, scoring runs, player tally, substitution table with scores at time of change, play time per player, discipline summary | Must |
| FR-35 | If GK performance tracking is enabled, the stats panel must include a GK save heatmap and rating summary | Should |
| FR-36 | If opposition scorer tracking is enabled, the stats panel must show a scoring profile by opposition position | Should |
| FR-37 | If shot location tracking is enabled, the stats panel must render an interactive shot map with team/half/player filters | Should |
| FR-38 | Match notes (free text) must be saveable within the stats panel Stats tab; ratings autosave on every interaction with no explicit save action required | Should |
| FR-38a | The stats panel must provide an Assess tab where the coach can rate team performance across six dimensions (Effort, Skill, Tactics, Intensity, Discipline, Spirit) on a 1–5 scale using a cumulative green-gradient dot selector | Should |
| FR-38b | The Assess tab must display an overall rating calculated as the average of all rated dimensions, updating live as ratings are entered | Should |
| FR-38c | The Assess tab must include a free-text coach notes field separate from match notes | Should |
| FR-38d | Team assessment data must persist to localStorage and be included in JSON export/import | Should |

### 5.7 Sharing and Export

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-39 | Score graphic must be shareable for current score, half-time, and full-time | Must |
| FR-40 | Lineup graphic must display shirt positions, player names, and team crests | Should |
| FR-41 | Score graphic must list scorers (up to 6 lines, last scorer first) | Should |
| FR-42 | Event log must be exportable as CSV | Should |
| FR-43 | Event log must be shareable via WhatsApp | Should |
| FR-44 | Match data must be exportable as a JSON file for offline backup | Should |
| FR-45 | A previously exported JSON file must be importable to restore state | Should |
| FR-46 | Two match JSON files must be mergeable via a dedicated merge utility | Could |
| FR-47 | A printable match report must be generatable, covering timeline, lineup, stats, and substitutions | Should |

### 5.8 AI Analysis

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-48 | The app must construct an AI prompt from the match event log, squad, and metadata | Should |
| FR-49 | The prompt must be copyable to clipboard for pasting into Claude or ChatGPT | Should |
| FR-50 | The analysis tone must be calibrated by age grade: encouraging (≤U14), honest-but-supportive (U15/U16), direct (≥U17/Adult) | Should |
| FR-51 | Where GK performance data exists, it must be appended to the AI context | Could |
| FR-52 | Where opposition scorer data exists, it must be appended to the AI context | Could |
| FR-53a | Where team assessment ratings exist, they must be appended to the AI context with an instruction to cross-reference against the event log rather than accept them uncritically | Could |

### 5.9 Persistence

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-53 | All persistent state must survive a full browser refresh with no data loss | Must |
| FR-54 | State must be written to localStorage with a 500 ms debounce; an immediate write must occur on page hide | Must |
| FR-55 | The app must handle missing or partial saved state gracefully on load | Must |

---

## 6. Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| NFR-1 | The app must be fully functional on iOS Safari 15+ and Chrome on Android |
| NFR-2 | All user-supplied strings rendered into innerHTML must be HTML-escaped |
| NFR-3 | `eval` and implied eval (`Function`, `setTimeout` with string) are forbidden |
| NFR-4 | The app must load and be interactive within 3 seconds on a 4G connection |
| NFR-5 | No build step — the app must be serveable as static files from any HTTP server |
| NFR-6 | The app must operate without a network connection after initial load |
| NFR-7 | All match data is stored client-side only; no personal data is transmitted to a server |

---

## 7. Constraints

- Single-file HTML + vanilla JS architecture; no framework or bundler
- Globals are shared across script files loaded via `<script>` tags in order
- iOS Safari does not support the Wake Lock API; graceful degradation required
- Font Awesome 6 is loaded from CDN; app degrades gracefully if CDN is unavailable

---

## 8. Glossary

| Term | Definition |
|------|------------|
| Goal | Ball played into the net under the crossbar; worth 3 points |
| Point | Ball played over the crossbar; worth 1 point |
| 2-Point | Hurling-specific score from a designated arc; worth 2 points |
| Wide | Attempt that missed; does not score |
| Kickout / Puck-out | Goalkeeper restart after a score or wide |
| Turnover | Change of possession (Won = we gained it; Lost = they gained it) |
| GK | Goalkeeper |
| OSC | Opposition Scorer profile |
| Go Games | Non-competitive development format for U8–U12 |
| Amalgamation | Two or more clubs combining players to field a team |
| HT / FT | Half Time / Full Time |
