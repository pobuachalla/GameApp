# GAA Match Tracker — Design System

> Status: **Documentation** (pre-codification).  
> This document captures the design language as it exists in the codebase today. Gaps and inconsistencies are noted inline. The intent is to agree on canonical values here before extracting them into shared tokens.

---

## 1. Colour

### 1.1 Semantic colour matrix

The app uses a four-signal semantic system: **success (green), danger (red), warning (amber), info (blue)**. Each signal has four token roles: background tint, border, text, and a solid fill for reverse (white-on-colour) contexts.

| Role | Success | Danger | Warning | Info |
|------|---------|--------|---------|------|
| **Background tint** | `#DFF3E3` / `#E8F5E9` | `#F8D7D7` / `#FFEBEE` | `#FFF1D6` / `#FFF8E1` | `#e6f1fb` / `#E3F2FD` |
| **Border** | `rgba(46,125,50,0.3)` | `rgba(198,40,40,0.18)` | `rgba(217,119,6,0.35)` | `rgba(55,138,221,0.8)` |
| **Text** | `#2E7D32` | `#C62828` / `#991B1B` | `#D97706` / `#B45309` | `#0c447c` |
| **Solid fill** | `#2E7D32` | `#C62828` | `#F59E0B` | `#378add` |

### 1.2 Neutrals

| Token (style.css) | Value | Role |
|-------------------|-------|------|
| `--bg1` | `#FFFFFF` | Card / panel surface |
| `--bg2` | `#F4F5F2` | Page background; secondary surface |
| `--bg3` | `#E2E4DE` | Tertiary surface; toggle tracks |
| `--t1` | `#1F1F1F` | Primary text |
| `--t2` | `#6B6F66` | Secondary text; labels |
| `--t3` | `#9A9E99` | Placeholder; muted text |
| `--b` | `rgba(0,0,0,0.10)` | Subtle border / divider |
| `--bm` | `rgba(0,0,0,0.18)` | Medium border; input outlines |

### 1.3 Brand greens

| Value | Usage |
|-------|-------|
| `#2E7D32` | Primary action fill; captain badge; score tally |
| `#1B5E20` | Hover / dark state; print heading rule |
| `#1F5B3A` | Active tab underline |
| `#5C9B5E` | Bottom-bar button label; panel heading text |

### 1.4 Card (discipline) colours

| Token | Value | Meaning |
|-------|-------|---------|
| `--card-yellow` | `#FDD835` | Yellow card |
| `--card-black` | `#2c2c2a` | Black card |
| `--card-red` | `#E53935` | Red card |

### 1.5 Event badge palette

Each event type in the log carries a pill with a background + text pair. These are not yet tokenised.

| Class | Background | Text | Event |
|-------|-----------|------|-------|
| `.bg` | `#DFF3E3` | `#2E7D32` | Goal |
| `.bp` | `#FFFFFF` | `#1F1F1F` | Point (white with border) |
| `.bw` | `#EBEBEB` | `#4A4A4A` | Wide |
| `.bc` | `#FFF9E6` | `#8A6A00` | Black card |
| `.br` | `#FFEBEE` | `#E53935` | Red card |
| `.by` | `#FFFDE7` | `#F9A825` | Yellow card |
| `.bs` | `#e8f8ed` | `#1a7a3c` | Sub on |
| `.bo` / `.badj` | `--bg2` | `--t2` | Other / adjustment |
| `.bopp` | `#FFF1D6` | `#B45309` | Opposition score |
| `.brstr` | `#e1f5ee` | `#0f6e56` | Restart |
| `.bperiod` | `#e6f1fb` | `#0c447c` | Period marker |
| `.bgk` | `#0277BD` | `#fff` | Goalkeeper event |

### 1.6 GK save-score gradient

The goalkeeper rating rubric uses five colour steps rendered as CSS gradients:

| Score | Gradient |
|-------|----------|
| 1 (worst) | `#d96b5e → #c75146` |
| 2 | `#e89767 → #d4793f` |
| 3 | `#e8b961 → #c49030` |
| 4 | `#8fb89a → #5a9472` |
| 5 (best) | `#4a8a64 → #1f4d34` |

### 1.7 Inconsistencies — colour

| Issue | Detail |
|-------|--------|
| Three separate `:root` blocks | `style.css`, `review.html`, `season.html` each define their own tokens with different names and values |
| `--t1` diverges | `#1F1F1F` (style.css) vs `#1A2E1A` (review/season — green-tinted) |
| `--t2`, `--t3` diverge | Both are darker/greener in review/season |
| `--bg` naming collision | `--bg2` (`#F4F5F2`) in style.css is the page background; `--bg` (`#EEF0EA`) in review/season is a slightly different shade |
| `--r` diverges | `8px` in style.css, `16px` in review/season — same token name, opposite meaning |
| Borders are alpha in style.css but solid hex in review/season | Causes visual drift when both are used near each other |
| ~40% of colour values are inline hex | Not reachable via token update |

---

## 2. Typography

### 2.1 Font stack

```
-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
```

`Roboto` is appended in review.html and season.html but not in style.css. All pages set `font-family: inherit` on interactive elements so the stack propagates correctly.

### 2.2 Type scale (current, unnamed)

The app has no named type scale. The following sizes are in use — grouped here by apparent role:

| Role | Size(s) | Weight | Usage example |
|------|---------|--------|---------------|
| Display | `52px`, `44px` | 500 | Timer display |
| Heading large | `36px`, `28px` | 700–800 | Score totals, stat big numbers |
| Heading | `26px`, `22px`, `20px`, `18px` | 600–700 | Landing titles, team name |
| Body large | `17px`, `16px`, `15px` | 400–600 | Panel items, action buttons |
| Body | `14px`, `13px` | 400–500 | Rows, event log, descriptions |
| Label / caption | `12px`, `11px`, `10px` | 500–700 | Section headers, pill labels |
| Micro | `9px`, `8px` | 400–700 | Countdown, ring labels, bc-countdown |

### 2.3 Font weights in use

`300` · `400` · `500` · `600` · `700` · `800`

Weight 800 appears in display contexts (`rv-bignum`, `gk-sec-num-big`, `gk-int-n`). Weight 300 appears only in score separators.

### 2.4 Line heights

| Value | Context |
|-------|---------|
| `1` | All compact / numeric displays |
| `1.1` | Player button text |
| `1.2` | Player sheet name |
| `1.3` | Share option label; sub-name |
| `1.35` | Layout player name (2-line clamp) |
| `1.4` | Tracking card description |
| `1.45` | GK intensity rows |
| `1.5` | Tracking hint, settings notes |
| `1.6` | Landing sub-text, GK help |

### 2.5 Letter spacing

| Value | Context |
|-------|---------|
| `-2px` / `-1.5px` | Timer display, score display (tabular nums) |
| `.02em` | Momentum basis |
| `.03em` | Sideline button |
| `.04em` | Bottom-bar label; GK tags |
| `.05em` | Team label |
| `.06em` | Section titles (`.stitle`, `.sport-pill`, `.period-badge`) |
| `.07em` | Many section headers |
| `.08em` | Setup card label, assess labels |
| `.09em` | Review card title |

`font-variant-numeric: tabular-nums` is set on the timer display to prevent digit-width jitter.

---

## 3. Spacing

### 3.1 Base unit

The app uses an informal **2px base grid**. The dominant increments in practice are **8px and multiples thereof**, with occasional 10px, 14px, and 12px values.

### 3.2 Gap / padding scale (observed)

| Value | Primary usage |
|-------|---------------|
| `2px` | Icon / badge fine-tuning |
| `4px` | Bar-btn icon gap; small tag padding |
| `5px` | Score label margin; badge gap |
| `6px` | Pill padding-y; tab padding-y |
| `7px` | Event row padding; zone chip padding-y |
| `8px` | Standard gap (grids, rows, headers) |
| `10px` | Card internal padding; scroll padding-y |
| `12px` | Panel scroll padding; hint internal padding |
| `14px` | Card padding (primary); drawer scroll padding |
| `16px` | Stats/assess section padding |
| `18px` | Toast horizontal padding |
| `24px` | Print card padding |
| `32px` | Scroll area bottom padding (safe area buffer) |

### 3.3 Component sizing

| Component | Size |
|-----------|------|
| Player button (`.pbtn`) | `56 × 56px` |
| Score adj button | `52 × 52px` |
| Player avatar (`.ply-avatar`) | `46 × 46px` |
| Back / close button | `36 × 36px` or `32 × 32px` |
| Toggle switch | `48 × 28px` |
| Toggle knob | `20 × 20px` |
| Player badge (`.pbadge`) | `32 × 32px` |
| Bottom-bar divider | `0.5px wide` |
| Drawer handle | `40 × 4px` |
| Sub-number badge | `40px wide` |
| GK save score column | `52px wide` |

---

## 4. Border Radius

| Token / Value | Usage |
|---------------|-------|
| `--r: 8px` (style.css) | Default radius — inputs, cards, small panels |
| `--rl: 12px` (style.css) | Large radius — timer card, scoreboard border-radius on panel corners, toggle track |
| `--r: 16px` (review/season) | Card radius on document pages (inconsistent with style.css `--r`) |
| `18px` | Drawer panels, scoreboard |
| `20px` | Age-grade pill |
| `24px` | Landing card (review/season) |
| `10px` | Setup card, print card |
| `12px` | Tracking card, score-adj-btn, share-opt |
| `14px` | Assess card, player sheet button |
| `50%` / `999px` | Circles and pills |
| `2px` | Drawer handle, card indicator |
| `4px` | GK cell, small badge |
| `5px` | Momentum bar, attempt bar |
| `6px` | GK matrix cell |

**Gap to close:** `--r` conflicts between pages. The tracker uses 8px as the default small radius; the document pages use 16px as the default card radius. These should be two distinct named tokens.

---

## 5. Elevation / Shadow

No shadow tokens exist in style.css. Only review.html and season.html define `--shadow`.

| Context | Value |
|---------|-------|
| Document card (`--shadow`) | `0 2px 14px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)` |
| Scoreboard | `0 3px 16px rgba(0,0,0,0.13)` |
| Player button | `0 3px 8px rgba(0,0,0,0.18)` |
| Sideline button | `0 3px 8px rgba(0,0,0,0.18)` |
| Swap pill | `0 2px 10px rgba(0,0,0,0.28)` |
| Swap-source glow ring | `0 0 0 3px rgba(230,107,27,0.28), 0 3px 8px rgba(0,0,0,0.18)` |
| Toggle knob | `0 1px 6px rgba(0,0,0,0.18)` |
| Toggle switch thumb | `0 1px 3px rgba(0,0,0,0.2)` |
| GK cell selected | `0 0 0 2px #F59E0B` (focus ring) |
| GK caught glow | `0 0 12px #e9c46a` |
| GK slider thumb | `0 1px 5px rgba(0,0,0,0.22)` |

**Proposed elevation scale for design system:**
- Level 0: no shadow (flat)
- Level 1: `0 1px 3px rgba(0,0,0,0.18)` (knobs, small badges)
- Level 2: `0 3px 8px rgba(0,0,0,0.18)` (buttons, pills)
- Level 3: `0 3px 16px rgba(0,0,0,0.13)` (scoreboard)
- Level 4: `0 2px 14px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)` (document cards)
- Level 5: `0 2px 10px rgba(0,0,0,0.28)` (swap pill, overlays)

---

## 6. Motion

### 6.1 Duration tiers

| Tier | Duration | Usage |
|------|----------|-------|
| Fast | `0.1s` | Button press (transform/opacity) |
| Default | `0.15s–0.2s` | Colour, background, border transitions |
| Slow | `0.25s–0.3s` | Toggle knob slide, drawer open/close |
| Very slow | `0.4s–0.5s` | Momentum bar width, split bar width |

### 6.2 Easing

| Curve | Usage |
|-------|-------|
| `linear` (default) | Most colour/opacity transitions |
| `cubic-bezier(.32,.72,0,1)` | Drawer slide (iOS-style deceleration) |
| `cubic-bezier(.4,0,.2,1)` | Momentum bar (Material-style ease) |
| `ease-in-out` | Overtime flash animation |

### 6.3 Animations

| Name | Definition | Usage |
|------|-----------|-------|
| `flash-red` | `0%,100% opacity:1` → `50% opacity:0.2` at 1s | Overtime clock; runs 3 iterations |
| `gk-pulse` | Scale 1→1.15 + opacity 1→0.7 at 1.5s | GK caught-ball glow; runs `infinite` |

---

## 7. Components

### 7.1 Player button (`.pbtn`)

`56×56px` circle. The primary interactive element on the pitch grid.

| State | Visual |
|-------|--------|
| Default | White bg, white border, green text |
| Highlighted / has events (`.hev`) | Blue tint bg, blue border |
| Swap source (`.swap-src`) | Orange bg tint, thick orange border, orange glow ring |
| Swap target (`.swap-tgt`) | White bg, dashed green border |
| Red carded (`.rc`) | Red tint bg, red text, 55% opacity |
| Black carded (`.bc`) | Near-white bg, dark border, countdown ring SVG |
| Substitute slot (`.sub`) | Dashed border |

**Overlaid indicators** (absolutely positioned within `.pbtn`):

| Class | Position | Meaning |
|-------|----------|---------|
| `.card-y` | top-left | Yellow card chip (5×8px, `#FDD835`) |
| `.card-b` | top-left offset | Black card chip (5×8px, `#2c2c2a`) |
| `.card-r` | top-left | Red card chip (5×8px, `#E53935`) |
| `.subdot` | top-right | Sub-on indicator (8×8px, `#25D366` green) |
| `.cap-badge` | top-right | Captain icon (13×13px, white bg, green `©` icon) |
| `.bc-ring` | full coverage | SVG countdown ring |

**Content** (flex column, centred):
- Jersey number: `9px`, `700`, 70% opacity (when player has a name and `showPlayerNumbers` is on)
- Initials: `10–14px` (size scales with character count: 4+→10px, 3→11px, 2→12px, 1→14px)
- Score tally: `9px`, `400`, 75% opacity (when player has scored)

### 7.2 Drawers / bottom sheets

The app uses a consistent bottom-sheet pattern with the following anatomy:

```
[overlay .drw-overlay z:72]
[panel .drw-panel z:73]
  [handle .drw-handle]
  [header .drw-hdr]
  [scroll area .drw-scroll]
```

- Panel: `border-radius: 18px 18px 0 0`, slides in with `cubic-bezier(.32,.72,0,1)` over 300ms
- Overlay: `rgba(0,0,0,0.42)`, fades in over 280ms
- Handle: `40×4px`, `rgba(0,0,0,0.18)`, centred

**Named drawer instances:**

| Panel ID | z-index | Max height | Purpose |
|----------|---------|-----------|---------|
| `#sldpanel` | 73 | auto | Sideline / maor actions |
| `#drwpanel` (settings) | 73 | 100% − 220px | Settings (Setup / Tracking / History) |
| `#statspanel` | 71 | 100% − 220px | Match stats |
| `#gkpanel` | 78 | 100% | GK shot-stopping |
| `.ps-panel` (player sheet) | 41 | 100% − 220px | Per-player actions |
| `#cfmpanel` | 76+ | auto | Confirmation dialogs |
| `#layoutpanel` | 60 | full | Formation layout view |

### 7.3 Buttons

| Class | Shape | Bg | Usage |
|-------|-------|----|-------|
| `.btn-primary` | `--rl` radius, full-width | `#2E7D32` + white text | Confirm / primary actions |
| `.btn-secondary` | `8px` radius | `--bg2` | Secondary / icon-label buttons |
| `.t-btn` | `999px` pill | Varies | Timer actions |
| `.timer-primary-btn` | `--rl`, `88px` wide | Green / amber / blue | Start/pause timer |
| `.timer-secondary-btn` | `--rl`, `88px` wide | `--bg2` / red / amber | End half / end match |
| `.abtn` | `999px`, full-width | `--bg1` | Action list items (share, event types) |
| `.cfm-btn` | `--rl`, full-width | `--bg2` / danger | Confirm drawer actions |
| `.rst-btn` | `--rl`, full-width | `--bg2` / green / red | Result / restart recording |
| `.sld-action-btn` | `--r`, full-width | `--bg2` | Sideline action items |
| `.ps-btn-big` | `12px`, grid | `--bg2` | Player sheet primary actions |
| `.ps-btn-sm` | `12px`, grid | `--bg2` | Player sheet secondary actions |
| `.zone-chip` | `999px` | `--bg2` / info tint | Zone filter pills |
| `.age-grade-pill` | `20px` | `--bg3` / green | Age grade selector |
| `.tplbtn` | `999px` | `--bg1` | Template actions |
| `.sel-toggle` | `999px` | none / `#E8F5E9` | Log select mode |
| `.trk-preset-btn` | `8px` | transparent / green | Tracking preset selector |
| `.setup-save-btn` | `--rl` | `#2E7D32` | Save setup |
| `.bar-btn` | none | transparent | Bottom-bar navigation |
| `.back-btn` | `50%` circle | `--bg1` | Panel close/back |
| `.sideline-btn` | `999px` | `--bg2` | Floating pitch button |
| `.score-adj-btn` | `12px` | `--bg1` | Score edit button |

**Button active states:** All buttons use either `transform: scale(.91–.98)` or `opacity: .75–.85` on `:active`. Never both simultaneously except timer buttons.

### 7.4 Cards

| Class | Radius | Padding | Bg | Usage |
|-------|--------|---------|-----|-------|
| `.timer-card` | `--rl` | `14px` | `--bg1` | Timer container |
| `.scoreboard` | `18px` | — | `--bg1` | Score display |
| `.setup-card` | `12px` | `14px` | `--bg2` | Settings section group |
| `.trk-card` | `14px` | `14px` | `--bg1` | Tracking feature toggle card |
| `.stat-card` | `--rl` | `12–14px` | `--bg2` | Stats section |
| `.momentum-card` | `--rl` | `14px 14px 10px` | `--bg2` | Momentum bar card |
| `.assess-card` | `14px` | — | `--bg2` | Assessment section |
| `.modal-box` | `--rl` | `14px` | `--bg1` | Generic modal content |
| `.rv-card` (review) | `--r` (16px) | `24px` | `--card` | Review page section |

### 7.5 Chips / pills / badges

| Class | Shape | Usage |
|-------|-------|-------|
| `.period-badge` | `999px` | Current period (1st Half, HT, FT) |
| `.status-chip` | `999px` | Timer state (running/paused) |
| `.sport-pill` | `999px` | Sport indicator |
| `.bc-pill` | `999px` | Black card active indicator |
| `.ev-bdg` | `999px` | Event type label in log |
| `.stat-tag` | `5px` | Player stat tag (score, card, sub) |
| `.gk-tag` | `4px` | GK event label |
| `.gk-ht` | `3px` | GK heuristic tag |
| `.gk-pill` | `999px` | GK locked metric |
| `.disc-chip` | `2px` | Discipline mini icon (`11×15px`) |

### 7.6 Inputs

| Class | Font size | Usage |
|-------|-----------|-------|
| `.sinput` | `16px` | Generic text / date input |
| `.sld-name-input` | `16px` | Sideline name input |
| `.stats-notes-input` | `16px` | Stats panel notes textarea |
| `.assess-notes-input` | `16px` | Assessment notes textarea |

All text inputs are `16px` to prevent iOS auto-zoom. Focus states use `border-color: var(--bi/--bs)`.

### 7.7 Toggles

**GAA segmented toggle (`.gaa-toggle-wrap`):**  
Full-width 2-option selector with a sliding knob. Height `40px`, radius `--rl`. Active option: white text on green knob. Used for Sport (Hurling/Football) and Team Size (15/11).

**Tracking toggle (`.trk-toggle`):**  
iOS-style switch. `48×28px`. Off: `--bg3`. On: `#2E7D32`. Knob: `20×20px` white circle.

### 7.8 Event log row (`.ev-row`)

3px left border colour indicates event signal; background tints on selection. Contains: time, event badge pill, player name/description. Selection mode reveals a circular checkbox.

### 7.9 GK goalmouth visual

Inline SVG pitch with:
- Striped turf via `repeating-linear-gradient`
- Goal posts, goal area, small rect as white/semi-transparent overlays
- Danger zone radial gradients (high/medium/low)
- Animated keeper circle (`.gk-keeper`, `#e9c46a`)
- Shot trajectory `<path>` elements
- Flash overlay and conceded `×` indicator

### 7.10 Toast

`.toast`: absolutely positioned, `bottom: 72px` (above bottom bar), pill shape (`999px`), `--t1` background, `--bg1` text, fades via `opacity` transition.

### 7.11 Layout / formation view

Shirt icon (`fa-kit fa-solid-h-circle-xmark` or similar) with number overlaid at `top: 12px`. Player name below shirt, 2-line clamped at `10px`. Sub player: smaller shirt (`32px`), `9px` number, `9px` name.

---

## 8. Layout

### 8.1 Main app container

`max-width: 460px`, full viewport height, flex-column. The content scroll area (`flex: 1, overflow-y: auto`) sits between the fixed timer card + scoreboard above and the bottom bar below.

### 8.2 Player grid

Rows of `.p-row` with `justify-content: space-around`. GK row is a single button; outfield rows vary by formation.

### 8.3 Bottom bar

Full-width, `flex` row. Four equal flex items separated by `0.5px` dividers. `env(safe-area-inset-bottom)` padding applied. `border-radius: --rl --rl 0 0`.

### 8.4 Responsive (review / season)

| Breakpoint | Rule |
|-----------|------|
| `max-width: 600px` | Season: stack player table columns |
| `min-width: 700px` | Review: two-column layout |
| `min-width: 1000px` | Season: wider multi-column |
| `min-width: 1100px` | Season: full desktop layout |

Review and season pages use `min(700px, 100vw)` for the side-panel width.

### 8.5 Safe area

`padding-bottom: env(safe-area-inset-bottom)` on the bottom bar only. The main scroll area uses a `32px` fixed bottom padding as a buffer.

---

## 9. Icons

**Library:** Font Awesome 6 (Pro kit `c0eed6f428` via `kit.fontawesome.com`) in `index.html`. Review and season use Font Awesome 6.5.1 Free via Cloudflare CDN as a CSS link.

**Custom icon:** One custom icon in the FA kit — appears to be used for the layout shirt (`fa-kit` class). Served from `kit-uploads.fontawesome.com`.

**WhatsApp share:** Custom inline SVG path (`M12 2C6.48...`), not from FA.

**Icon usage in navigation:**

| Icon | Usage |
|------|-------|
| `fa-play` / `fa-pause` | Timer start/stop |
| `fa-sliders` | Setup |
| `fa-share-nodes` | Share |
| `fa-chart-column` | Stats |
| `fa-rotate-left` | Undo |
| `fa-person-chalkboard` | Sideline |
| `fa-xmark` | Close |
| `fa-arrows-left-right` | Swap mode |
| `fa-copyright` (regular) | Captain badge |
| `fa-pen-to-square` (regular) | Score edit |

---

## 10. Gaps and recommendations

The following are ordered by impact.

| # | Issue | Recommendation |
|---|-------|---------------|
| 1 | Three separate `:root` definitions with conflicting values | Extract a single `tokens.css` file included by all three pages |
| 2 | `--r` is `8px` in the tracker, `16px` in review/season | Rename to `--radius-sm` (8px), `--radius-md` (12px), `--radius-lg` (16px), `--radius-card` (18px) |
| 3 | `--t1/--t2/--t3` have different values per page | Agree on one palette; green-tinting the text is a valid brand choice but it must be consistent |
| 4 | Shadow values are fully inline | Create `--shadow-1` through `--shadow-5` (or `--shadow-sm`, `--shadow-md`, `--shadow-lg`) |
| 5 | No named type scale | Define `--text-xs` through `--text-display` tokens; map current sizes to them |
| 6 | No spacing tokens | Define `--space-1` through `--space-8` on a 4px base (4, 8, 12, 16, 24, 32, 48, 64) |
| 7 | Event badge colours are unnamed inline values | Add them to the token set as `--ev-goal-bg`, `--ev-point-bg`, etc. |
| 8 | Motion durations are hardcoded | Define `--duration-fast: 100ms`, `--duration-base: 200ms`, `--duration-slow: 300ms` |
| 9 | `index.html` uses FA Kit; review/season use FA Free CDN | Standardise — Kit enables custom icon; extend to review/season or document the split |
| 10 | Button family has no shared size/intent API | Define size variants (sm/md/lg) and intent variants (primary/secondary/danger/ghost) as composable modifier classes |
