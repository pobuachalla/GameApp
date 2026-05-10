# User Stories — GAA Match Tracker

**Version:** 1.0  
**Date:** May 2026

Stories follow the format: *As a [persona], I want [goal] so that [benefit].*  
Acceptance criteria are in bullet form beneath each story.

---

## Epic 1 — Match Setup

**US-1.1** As a coach, I want to enter the team names, opponent, competition, date, and venue before a match so that all reports and graphics are correctly attributed.
- Team name, opponent, competition, date, location, and referee fields are present in the setup panel
- Saving closes the panel and updates the scoreboard labels immediately
- All fields are optional — the app works if none are filled in

**US-1.2** As a coach, I want the team name field to suggest clubs from the Meath GAA directory as I type so that I can find the correct club quickly without free-typing.
- Typeahead activates after 1 character
- Suggestions show the club crest alongside the name
- Selecting a suggestion fills the field and saves immediately

**US-1.3** As a coach, I want the opposition name field to recognise amalgamation combinations (e.g. "Rathmolyon / Boardsmill") and display both club crests stacked so that the graphic correctly represents a combined team.
- Typing "ClubA / ClubB" in the typeahead offers combined suggestions
- If both names are distinct Meath clubs, both crests appear in the graphic (top-left / bottom-right)
- If the "/" name is a registered combined club (e.g. "Donaghmore / Ashbourne"), a single crest is shown

**US-1.4** As a coach, I want to select an age grade from a scrollable pill row so that I can see at a glance what category the game falls into.
- Pills: — (not set), U8, U10, U12, U14, U16, Minor, U20, Junior, Senior
- Selecting a pill highlights it in green
- A category badge appears below the pills: "Go Games" (U8–U12), "Juvenile" (U14–Minor), "Adult" (U20–Senior)
- "—" clears the category badge

**US-1.5** As a coach, I want to save the current squad as a named template so that I don't need to re-enter player names each week.
- Templates store the home team name, all player names, and the captain designation
- Templates can be loaded, overwritten, or deleted from the template list

**US-1.6** As a coach, I want to drag player rows to swap their positions in the squad list so that I can quickly adjust numbering.
- Drag handles are present on each player row
- Releasing over a target row swaps the two names
- If one of the swapped players is captain, the captain designation follows the name

---

## Epic 2 — Match Timer

**US-2.1** As a sideline operator, I want a single tap to start the match timer so that I can focus on the game immediately.
- Tapping the primary button from PRE_MATCH starts the timer and shows a "Running" chip
- The secondary button appears, labelled "End Half"

**US-2.2** As a sideline operator, I want to pause and resume the timer so that I can handle interruptions (injuries, delays) without losing elapsed time.
- Tapping the primary button while running pauses the timer; chip changes to "Paused"
- Tapping again resumes from the same time

**US-2.3** As a sideline operator, I want a confirmation step before ending a half or the match so that I don't trigger it by accident.
- Tapping "End Half" / "End Match" shows a confirmation drawer
- Dismissing the drawer returns to the running state

**US-2.4** As a sideline operator, I want a score graphic to appear automatically at half time and full time so that I can share the result without any extra steps.
- After confirming half time or full time, the score graphic panel opens
- A "Continue" button closes the graphic

**US-2.5** As a sideline operator, I want the phone screen to stay on while the timer is running so that the app is always ready to record the next event.
- Wake Lock is acquired when the timer starts
- Wake Lock is released when the timer is paused or the match ends
- If Wake Lock is unsupported (iOS Safari), the app degrades gracefully with no error

---

## Epic 3 — Live Scoring

**US-3.1** As a sideline operator, I want to tap a player's button to open their action sheet so that I can record what they did.
- Tapping a player button opens the player sheet drawer
- The sheet shows all available actions for the current sport and tracking configuration

**US-3.2** As a sideline operator, I want to record a goal or point for a player so that the scoreboard updates immediately.
- Selecting Goal or Point increments the scoreboard and player tally
- The restart drawer opens after a score to capture the outcome

**US-3.3** As a sideline operator, I want to record a wide or saved shot so that the shot efficiency is captured without affecting the score.
- Wide/Saved are available actions; selecting one records the event without changing the score

**US-3.4** As a sideline operator, I want to manually adjust the score if I record an event incorrectly so that the scoreboard stays accurate.
- Score adjustment buttons (± icons) are visible on the scoreboard for both teams
- Adjustments go through the same how-scored flow so the event log stays consistent
- Score cannot go below zero

**US-3.5** As a sideline operator, I want to undo the last recorded action so that I can quickly correct a mis-tap.
- An undo button is always visible; it is disabled when there is nothing to undo
- Undo reverses the score, state flags (cards, sub), and removes the event row

---

## Epic 4 — Player Management

**US-4.1** As a coach, I want to record yellow, black, and red cards against individual players so that the discipline log is accurate.
- Card type selection is available in the player action sheet
- Yellow adds to the yellow card count; Black to the black card count; Red marks the player as sent off
- Sent-off players are visually distinguished and cannot receive further actions

**US-4.2** As a coach, I want to make a substitution and see which player came on so that the lineup reflects reality.
- Selecting Substitution opens the substitution drawer listing available bench players
- After selecting the replacement, the pitch button updates to the new player's name/initials

**US-4.3** As a coach, I want to designate a team captain so that the captain's name appears on score graphics.
- A captain button is present on each player row in settings
- Only one captain may be active at a time; tapping again clears the designation

---

## Epic 5 — Advanced Tracking

**US-5.1** As a coach, I want to rate the goalkeeper's performance on each save and conceded goal so that I have objective data for post-match review.
- A 5×5 intensity/quality matrix is shown for each shot-stopping moment
- A secondary (rebound) modifier is available
- The collected data feeds the GK section of the stats panel and the AI prompt

**US-5.2** As a coach, I want to tag which opposition position scored so that I can identify the attacking threats we face.
- After recording an opposition score, an optional picker shows the formation grid
- The selected position is stored with the event and aggregated in the stats panel

**US-5.3** As a coach, I want shot locations tagged on a pitch zone grid so that I can analyse shot selection quality in the stats panel.
- If shot location tracking is enabled, a 5×7 zone picker opens after a scoring action
- Zone data is visualised on the shot map in the stats panel, filterable by team, half, and player

**US-5.4** As a coach, I want to track turnovers by category (tackle, hook, first to ball, etc.) so that possession patterns are visible in the stats.
- If turnover tracking is enabled, a secondary action picker opens after Turnover Won/Lost

---

## Epic 6 — Statistics

**US-6.1** As a coach, I want to open the statistics panel at any point during or after the match so that I can see the running picture.
- The stats panel is accessible via a bottom-bar button at all times
- Content renders immediately from the current event log

**US-6.2** As a coach, I want to see a score timeline so that I can identify scoring runs and drought periods.
- The timeline shows goals and points as markers over time, for both teams
- Momentum phases are identifiable by visual clustering

**US-6.3** As a coach, I want to see a player-by-player scoring tally, discipline count, and play time so that individual contributions are visible.
- Each player row shows: scores, cards, substitution in/out times, total minutes played

**US-6.4** As a coach, I want to save free-text match notes within the stats panel so that my observations are stored alongside the data.
- A textarea in the stats panel Stats tab saves to `state.matchNotes` on input
- Notes persist across reloads and are included in the printed report

**US-6.5** As a coach, I want to rate my team's performance across key dimensions after the match so that I have a structured subjective record alongside the objective event data.
- An Assess tab in the stats panel offers six dimensions: Effort, Skill, Tactics, Intensity, Discipline, Spirit
- Each dimension is rated 1–5 using a cumulative green-gradient dot selector; the colour itself encodes the score so the row is readable at a glance without counting dots
- Tapping the active dot clears that dimension's rating
- An overall rating (average of all rated dimensions) updates live
- A free-text coach notes field captures qualitative observations separately from match notes
- All ratings autosave on every interaction; there is no separate save action
- Assessment data persists across reloads and is included in JSON export

---

## Epic 7 — Sharing

**US-7.1** As a coach, I want to share a score card graphic via WhatsApp so that the result reaches the group chat within seconds of the final whistle.
- Score graphic shows team names, crests, score in goals-points format, and up to 6 scorers
- Sharing opens the native share sheet or WhatsApp directly

**US-7.2** As a coach, I want to share a team lineup graphic so that supporters and media can see the starting fifteen.
- Lineup graphic shows all 15 (or 13) positions with shirt icons, names, and team crests
- Bench players appear below the formation

**US-7.3** As a coach, I want to export the event log as a CSV so that I can analyse it in a spreadsheet.
- CSV contains columns: time, badge, player, action, secondary action, zone

**US-7.4** As a coach, I want to print a full match report so that I have a paper record for the file.
- The printed report includes: score timeline, starting lineup, substitutions, player stats, and match notes

---

## Epic 8 — AI Analysis

**US-8.1** As a coach, I want to generate an AI coaching report from the match data with one tap so that I get structured analysis without manual work.
- A "Copy AI Prompt" button is available in the share menu for both Claude and ChatGPT
- The prompt includes fixture, result, squad, event log, GK context (if tracked), opposition scorer context (if tracked), and team assessment ratings (if any dimension was rated)
- When assessment ratings are included, the AI is instructed to cross-reference them against the event log rather than accept them uncritically, and to note any significant divergence between the coach's read and what the data shows

**US-8.2** As a coach, I want the AI tone to match the age grade of my team so that the report is appropriate for young players or experienced seniors.
- ≤U14: encouraging, leads with positives, frames issues as solvable learning moments
- U15/U16: honest but supportive, avoids deflating language
- ≥U17 / Minor / Junior / Senior: direct, no softening, coaches at this level need accurate analysis

---

## Epic 9 — Data Management

**US-9.1** As a coach, I want match data to survive a phone lock or browser refresh so that an interruption doesn't lose the game record.
- All persistent state is written to localStorage; a page reload restores the exact state
- A 500 ms debounce prevents write thrashing; an immediate write fires on page hide

**US-9.2** As a coach, I want to export the full match as a JSON file so that I have a backup and can review it later.
- Export creates a timestamped `.json` file with the full state
- Import restores the state, normalising any legacy fields from older versions

**US-9.3** As a coach, I want to merge two match JSON files (e.g. from two sideline operators) so that one complete record can be produced.
- The merge utility accepts multiple files and produces a merged event log with conflict resolution

---

## Acceptance Test Coverage Map

| Epic | Selenium Tests | Unit Tests |
|------|---------------|------------|
| Match Setup | test_06_settings.py | — |
| Age Grade | test_06_settings.py (US-1.4) | — |
| Timer | test_02_timer.py | — |
| Scoring | test_03_scoring.py | playerScore() in utils.test.js |
| Players | test_04_players.py | — |
| Event Log | test_05_events.py | — |
| Statistics | test_08_stats.py | — |
| Team Assessment (US-6.5) | — | — |
| Sharing | test_07_share.py | — |
| Persistence | test_09_persistence.py | serializeState() in utils.test.js |
| AI Analysis | — | — |
| GK Performance | — | — |
| Opposition Scorer | — | — |
| Shot Map | — | — |
