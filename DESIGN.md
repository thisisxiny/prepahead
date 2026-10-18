---
name: PrepAhead
description: A pre-order add-on concept for Cates, drawn as quiet canteen stall signboards so the features lead (prototype, sample data).
colors:
  ground: "#eceef1"
  panel: "#ffffff"
  panel-2: "#f4f5f7"
  ink: "#1b1d20"
  ink-2: "#3a3e44"
  on-ink: "#ffffff"
  muted: "#555b62"
  line: "#e0e3e7"
  line-strong: "#8f959c"
  sign: "#b53930"
  sign-ink: "#ffffff"
  sign-zh: "#fbe7b0"
  strip: "#faf0cf"
  strip-ink: "#1b1d20"
  strip-line: "#d8bb5a"
  go: "#1e7a43"
  go-ink: "#ffffff"
  bad: "#b53930"
  bad-ink: "#ffffff"
  bad-text: "#a8322a"
  off: "#7a8087"
  topbar: "#ffffff"
  topbar-ink: "#1b1d20"
  topbar-muted: "#555b62"
  brand-accent: "#b53930"
  phone: "#1b1d20"
  plate: "#ffffff"
  plate-ink: "#1b1d20"
  chart-prepared: "#c9ced4"
  chart-sold: "#56606b"
typography:
  display:
    fontFamily: "Archivo Local, Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(3.25rem, 9cqi, 5rem)"
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: "-0.03em"
    fontFeature: "\"tnum\""
  numerals:
    fontFamily: "Archivo Local, Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "2.2rem"
    fontWeight: 800
    letterSpacing: "0.18em"
    fontFeature: "\"tnum\""
  headline:
    fontFamily: "Archivo Local, Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.6rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.015em"
  strip-title:
    fontFamily: "Archivo Local, Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.4rem"
    fontWeight: 700
    lineHeight: 1.1
  brand:
    fontFamily: "Archivo Local, Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.35rem"
    fontWeight: 800
    letterSpacing: "-0.01em"
    fontVariation: "\"wdth\" 110"
  slot-time:
    fontFamily: "Archivo Local, Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.2rem"
    fontWeight: 700
    fontFeature: "\"tnum\""
  sign-name:
    fontFamily: "Archivo Local, Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.05rem"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "0.02em"
    fontVariation: "\"wdth\" 108"
  sign-zh:
    fontFamily: "Noto Sans SC Stalls, Noto Sans SC, PingFang SC, Microsoft YaHei, sans-serif"
    fontSize: "0.98rem"
    fontWeight: 900
    lineHeight: 1.25
  title:
    fontFamily: "Archivo Local, Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 700
  body:
    fontFamily: "Archivo Local, Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.45
  body-small:
    fontFamily: "Archivo Local, Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 400
  secondary:
    fontFamily: "Archivo Local, Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
  label:
    fontFamily: "Archivo Local, Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    letterSpacing: "0.01em"
rounded:
  xs: "3px"
  tag: "4px"
  sm: "6px"
  md: "10px"
  switch: "14px"
  tablet: "16px"
  phone-screen: "31px"
  phone: "40px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-ink}"
    rounded: "{rounded.sm}"
    padding: "11px 18px"
  button-primary-hover:
    backgroundColor: "{colors.ink-2}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "11px 18px"
  button-ghost-hover:
    backgroundColor: "{colors.panel-2}"
  button-small:
    padding: "7px 12px"
  signboard-face:
    backgroundColor: "{colors.sign}"
    textColor: "{colors.sign-ink}"
    typography: "{typography.sign-name}"
    padding: "9px 12px 8px"
  signboard-plate:
    backgroundColor: "{colors.plate}"
    textColor: "{colors.plate-ink}"
    width: "48px"
  signboard-strip:
    backgroundColor: "{colors.strip}"
    textColor: "{colors.strip-ink}"
    padding: "6px 12px"
  card:
    backgroundColor: "{colors.panel}"
    rounded: "{rounded.md}"
    padding: "16px"
  slot:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "10px 0"
  slot-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-ink}"
  tag-pending:
    backgroundColor: "{colors.strip}"
    textColor: "{colors.strip-ink}"
    typography: "{typography.label}"
    padding: "1px 7px"
  tag-ready:
    backgroundColor: "{colors.go}"
    textColor: "{colors.go-ink}"
    typography: "{typography.label}"
    padding: "1px 7px"
  tag-problem:
    backgroundColor: "{colors.bad}"
    textColor: "{colors.bad-ink}"
    typography: "{typography.label}"
    padding: "1px 7px"
  banner:
    backgroundColor: "{colors.strip}"
    textColor: "{colors.strip-ink}"
    rounded: "{rounded.sm}"
    padding: "10px 12px"
---

# Design System: PrepAhead

All values below live as CSS variables in `style.css`. Style only through those variables. The page is light only: it looks the same when the computer is in dark mode. Every figure on screen is sample data and stays labelled that way.

## Overview

**Creative North Star: "The Canteen Lightbox, dimmed"**

PrepAhead still looks like the row of stall signboards above an NTU canteen counter: each stall has a white numbered plate, a red face with its English name in wide capitals and its Chinese name in pale gold, and a strip underneath. But the signs are dimmed so the prototype's features (cut-offs, early bird, slots, the prep number, pre-orders, resale, leftovers) are what visitors look at during the showcase, not the styling.

Quiet means: colour is an accent, not a background; type is medium-weight, not black; structure comes from thin grey lines, not thick black frames. The one big number per stall (trays to cook) is still the largest thing on the tablet, but it no longer shouts. It is built from flat colour blocks, not photos. PrepAhead is a concept add-on to Cates and is not affiliated with it, so it never borrows Cates' logo or styling.

**Key Characteristics:**
- Plate + red face + pale strip is the unit every stall is drawn with, on the phone and on the tablet.
- Ink (near-black) does the text and the primary buttons. Lines are thin and grey.
- Pale yellow means "look here": the strip, discounted prices, the early-bird banner, the pickup code, new orders.
- Red away from a signboard means a problem.
- Status is shown by fill versus outline plus the word, never by colour alone.

## Colors

Softened signage colours (a muted brick red, a pale yellow tint) used as accents over a light cool-grey and white base, plus one green for "ready".

### Primary
- **Signboard Red** (`--sign`, softened from a pure red): the face of every stall signboard and the tablet header. Also the "Leftover" bars in the week chart, because leftover food is the problem being solved. The brand's "Ahead" uses `--brand-accent` (the same red).
- **Strip Yellow** (`--strip`, a pale tint): the strip under each signboard, the tablet's tray-number strip, discounted prices, the early-bird banner, the pickup code, the "New" tag, the arrival flash and text selection. Small yellow markers get a thin `--strip-line` edge so they hold their shape on white. The Chinese stall name uses `--sign-zh`, a pale gold that stays readable on the red.
- **Counter Ink** (`--ink`): body text, primary buttons, the selected time slot and the pressed view button. Hover moves to `--ink-2`.

### Secondary
- **Shelf Green** (`--go`): only for "On shelf" (ready to collect).
- **Problem Red** (`--bad`, same red as the signboard): no-show and uncollected tags, the "stop pre-orders" switch when it is on. On a panel, error text uses the deeper `--bad-text`.
- **Chart** : `--chart-prepared` (light grey), `--chart-sold` (slate, also the pre-order limit meter), `--sign` for leftover.

### Neutral
- **Canteen Wall** (`--ground`): the page background behind the phone and tablet.
- **Lightbox White** (`--panel`): top bar, phone screen, tablet, cards, order rows. `--panel-2` is the quiet fill inside a panel (the tablet's card area, notes, hovers).
- **Muted Grey** (`--muted`): secondary text, chart labels. `--line` for hairlines around cards and between rows; `--line-strong` (3:1 on white) for the edges of controls: ghost buttons, slots, steppers, inputs, the switch.
- **Switched-off Grey** (`--off`): a closed or sold-out stall's signboard face.
- **Plate** (`--plate`): the stall number plate, white.

### Light only
There is no dark mode. `color-scheme: light` on `:root` keeps the page and the browser's own controls (slider, checkbox, scrollbar) light even when the computer is set to dark mode, so the showcase looks the same on any laptop. Don't add `prefers-color-scheme` overrides.

### Named Rules
**The Red Means Trouble Rule.** Red appears on a signboard face, the brand's "Ahead", and on something that has gone wrong (no-show, uncollected, leftover, the stop switch on, error text). Don't use red for a normal action or decoration.

**The Yellow Points Rule.** Yellow is a pale tint under ink text, never white text. Use it for the thing on a screen the viewer should read first, and keep it small.

**The Accent Not Background Rule.** No large block of saturated colour other than the signboard faces. Everything else is white or pale grey.

## Typography

**Display / UI Font:** Archivo (self-hosted as "Archivo Local", Google Fonts backup), variable width 62–125% and weight 400–900, falling back to Helvetica Neue / Arial.
**Chinese Font:** Noto Sans SC Black, self-hosted as a tiny subset with only the characters in the four stall names. Adding a stall with new characters needs the subset rebuilt (or it falls back to the Google Fonts copy / system Chinese font).

**Character:** One family does everything, at medium weights. Only signboard lettering and the brand are widened (108–110%) and in capitals; the rest of the UI is normal width and sentence case.

### Hierarchy
- **Display** (800, clamp(3.25rem, 9cqi, 5rem), line-height 0.9): the tray number on the tablet's strip. One per screen.
- **Numerals** (800, 2.2rem with 0.18em spacing): the 4-digit pickup code. The demo clock in the top bar is 700 at 1.4rem in ink.
- **Headline** (700, 1.6rem): screen titles such as "Collection time". The brand wordmark is 800, 1.35rem, 110% wide, with "Ahead" in the brand accent.
- **Strip title** (700, 1.4rem): "trays to cook" beside the display number.
- **Slot time** (700, 1.2rem): the time on each tablet order ticket.
- **Sign name** (800, 1.05rem, 108% wide, uppercase): English stall name on the signboard; the tablet's stall picker uses the same style, scaling up to 1.55rem.
- **Sign Chinese** (Noto Sans SC 900, 0.98rem, pale gold): the Chinese name directly under the English one.
- **Title** (700, 1rem, sentence case): card headings on the tablet.
- **Body** (400, 16px, line-height 1.45); 0.95rem inside cards and order rows. Item names are 600; secondary text is 0.875rem in muted grey.
- **Label** (600, 0.75rem, sentence case): status tags and stall-type tags.

### Named Rules
**The Tabular Numbers Rule.** Every time, price, count and code uses tabular figures (`.num` or `font-variant-numeric: tabular-nums`) so numbers don't jump when they change.

**The Wide Caps Belong to Signs Rule.** Wide uppercase lettering is for signboards and the brand only. Titles, body text, tags and buttons stay at normal width and in sentence case.

**The Weight Ceiling Rule.** 800 is the heaviest weight in the UI (signboards, brand, display number, code). Headings are 700, controls 600.

## Layout

A light top bar (sticky, 1px line underneath) holds the brand, demo clock, the Both / Student / Stall switch and Reset demo, inside a 1280px max width. It is demo chrome, so it stays quiet. Below it the stage is a two-column grid: the student phone at 390px on the left and the stall tablet filling the rest, 32px apart. Student-only view centres the phone; Stall-only view gives the tablet the full width.

The tablet is a container (`container-type: inline-size`): its header signboard, then the full-width strip, then a two-column card grid (forecast and controls left, pre-orders right). Under 760px of tablet width the grid becomes one column with pre-orders first; under 520px the header stacks and the strip shrinks.

At page widths of 760px and below, the phone loses its device frame and becomes a white panel with a thin line, the Both view is hidden, and Student view is the default. Between 761px and 1180px the top bar stays on one row (the "Demo time" label is visually hidden there but kept for screen readers).

Spacing steps that repeat: 8px (small gaps, slot grid), 12px (list gaps, row padding), 16px (card padding, phone padding, grid gaps), 24px and 32px (stage padding and column gap). Safe-area insets are respected on the top bar and stage edges.

## Elevation & Depth

Flat. Thin lines separate things. One soft shadow lifts the two device "objects" off the wall: the phone and the tablet. Stall signboards, cards and order rows are flat.

### Shadow Vocabulary
- **Object lift** (`--shadow`: `0 1px 2px rgb(16 24 40 / 0.06), 0 12px 28px -18px rgb(16 24 40 / 0.28)`): phone and tablet only.

### Named Rules
**The Lines Not Shadows Rule.** Inside a panel, separate things with a 1px line (`--line` for cards and rows, `--line-strong` for controls), not with shadows or thick frames.

## Shapes

Gently rounded rectangles. Panels and signboards use 10px (`--r`); buttons, slots, steppers, banners and the pickup code use 6px (`--r-sm`); tags are 4px rectangles ("stickers"), never pill-round; inline highlights (discounted price, the "locked" chip, a highlighted slot time) use 3px. The tablet uses 16px and the phone 40px outer / 31px screen, as device shapes. The only fully round shape is the toggle switch.

Borders are all 1px: `--line` for cards, signboards, the tablet and row dividers; `--line-strong` for control edges and the summary rule. Disabled time slots use a dashed `--line` border with struck-through text.

## Components

### Buttons
- **Shape:** 6px corners, 1px border.
- **Primary:** ink fill, white text, 600 weight, 11px 18px padding. Hover moves to `--ink-2`. One primary per row.
- **Ghost:** `--line-strong` edge, transparent fill, ink text; hover fills `--panel-2` and darkens the edge to ink.
- **Small:** 7px 12px, 0.9rem, used inside order rows.
- **Text action:** underlined 600-weight text with no box, for the rarer choice beside a primary ("Can't make it", "Mark no-show"). In the top bar, "Reset demo" uses the same style.
- **Disabled:** 40% opacity, not-allowed cursor.
- **Focus:** 3px solid outline 2px out: ink, except on the red tablet header where it is pale gold.

### Status tags (stickers)
- **Style:** 4px rectangle, 1px border, 600 sentence-case label.
- **State by fill vs outline:** New = pale yellow fill with a gold edge; Accepted = grey outline only; On shelf = green fill; Collected = pale grey fill; Declined / Cancelled / Voucher = grey dashed outline; No-show / Uncollected = red fill.
- **Stall-type tag** on the red tablet header: white outline ("made to order") or white fill with red text ("batch cooked").

### Cards / Containers
- **Cards:** white panel, 1px `--line` border, 10px corners, 16px padding, 12px internal gap. Titles use the Title style.
- **Calculation list:** label left in muted grey, value right in tabular 600; the total row has a 1px `--line-strong` rule above it and is 700.
- **Banner:** pale yellow with ink text, 6px corners; an ink variant exists for neutral notices.
- **Note:** `--panel-2` fill, 6px corners, small text.

### Inputs / Fields
- **Time slots:** 3-column grid of 1px-edged buttons; selected = ink fill; unavailable = dashed light line and struck through.
- **Steppers:** 36px square 1px-edged buttons around a tabular number.
- **Code input:** 1px `--line-strong` edge (ink on focus), wide letter spacing, tabular; caret is signboard red.
- **Checkbox and range:** native controls tinted with `accent-color: var(--ink)`.
- **Switch:** 50 by 28 round toggle with a 1px edge; when on (pre-orders stopped) it turns red.
- **Meter:** 6px bar on `--line`, filled with `--chart-sold`.

### Navigation
- **Top bar:** white with a 1px line underneath, ink text, muted secondary text. The view switch is a segmented control with a 1px edge; the pressed button is ink with white text.
- **Back:** a 600-weight ink text button with a chevron icon on student screens.

### Icons
Small inline SVG line icons from the `ICON` map in `data.js` (1.25em, 2px stroke, round caps, `currentColor`). Add new icons there in the same style.

### The Signboard (signature)
The unit for every stall. Grid of a 48px number plate and a red face with the English name and Chinese name, then a full-width pale strip. Whole thing has a 1px `--line` edge and 10px corners, no shadow. On the phone it is a button that lifts 1px and darkens its edge on hover; an optional footer line below the strip holds small muted text. When a stall is closed or sold out the face turns `--off` grey, the Chinese name turns white, and the strip turns pale grey with the reason in red.

On the tablet the signboard becomes the header (64px plate at 1.75rem, stall picker as the name, type tag on the right), and its strip grows into the full-width bar that carries the Display-size tray number with the portions and cut-off beside it.

### Order ticket (tablet)
Each pre-order row is a ticket: slot time (700, 1.2rem) and status sticker on the left in a 104px column; order ID, items and actions on the right; 1px line above. Orders placed from this device's phone get their slot time on a pale yellow highlight.

### Motion
One motion moment only. When an order from the phone arrives on the tablet, the row slides in 10px from the left with a pale yellow background that fades out (1.1s), and the strip's tray number drops in slightly (0.5s). Both use `cubic-bezier(0.16, 1, 0.3, 1)` and are added once per change by `vendor.js`. Signboard hover lift and the switch knob use the same curve at 0.18s. Reduced-motion turns all transitions and animations off.

## Do's and Don'ts

### Do:
- **Do** draw every stall as the signboard: number plate, red face, English caps plus Chinese name, pale strip.
- **Do** put the one number that matters on the strip, in ink, in tabular figures.
- **Do** use 1px lines: `--line` for cards and rows, `--line-strong` for control edges.
- **Do** show state by fill versus outline (plus the word), so it reads without colour.
- **Do** use only the CSS variables in `style.css`, and check the page with the computer in dark mode too (it should look identical).
- **Do** keep the "Sample data" labels visible wherever figures appear.
- **Do** use the `ICON` SVGs for icons and keep motion to the arrival flash and tray tick.

### Don't:
- **Don't** use red for normal actions or decoration; red off a signboard (and the brand) means a problem.
- **Don't** fill large areas with saturated colour; yellow is a pale tint and stays small.
- **Don't** put white text on the yellow strip.
- **Don't** go above weight 800, or use 2px+ black frames.
- **Don't** add dish photos or generic white food-app cards; the signboard is the stall's picture.
- **Don't** build the stall side as a grid of KPI tiles; the tablet leads with one number on the strip.
- **Don't** make status tags pill-round; they are 4px rectangular stickers.
- **Don't** add shadows to signboards, cards or rows.
- **Don't** use Cates' logo, colours or styling.
