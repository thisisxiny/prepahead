---
name: PrepAhead
description: A pre-order add-on concept for Cates, drawn as canteen stall signboards (prototype, sample data).
colors:
  ground: "#e4e6e9"
  panel: "#ffffff"
  panel-2: "#f1f2f4"
  ink: "#141414"
  ink-2: "#333333"
  on-ink: "#ffffff"
  muted: "#4a4f55"
  line: "#cdd1d6"
  line-strong: "#8a9097"
  sign: "#c8231b"
  sign-ink: "#ffffff"
  sign-zh: "#ffd21f"
  strip: "#ffd21f"
  strip-ink: "#141414"
  go: "#17803d"
  go-ink: "#ffffff"
  bad: "#c8231b"
  bad-ink: "#ffffff"
  bad-text: "#b01d16"
  off: "#6d7379"
  topbar: "#141414"
  topbar-ink: "#ffffff"
  topbar-muted: "#b8bdc3"
  plate: "#ffffff"
  plate-ink: "#141414"
  chart-prepared: "#b9bec4"
typography:
  display:
    fontFamily: "Archivo Local, Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(5rem, 16.5cqi, 9rem)"
    fontWeight: 900
    lineHeight: 0.8
    letterSpacing: "-0.04em"
    fontFeature: "\"tnum\""
  headline:
    fontFamily: "Archivo Local, Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.85rem"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.01em"
    fontVariation: "\"wdth\" 112"
  sign-name:
    fontFamily: "Archivo Local, Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.3rem"
    fontWeight: 900
    lineHeight: 1.05
    letterSpacing: "0.01em"
    fontVariation: "\"wdth\" 118"
  sign-zh:
    fontFamily: "Noto Sans SC Stalls, Noto Sans SC, PingFang SC, Microsoft YaHei, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 900
    lineHeight: 1.25
  title:
    fontFamily: "Archivo Local, Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.02rem"
    fontWeight: 800
    letterSpacing: "0.03em"
    fontVariation: "\"wdth\" 112"
  body:
    fontFamily: "Archivo Local, Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.45
  label:
    fontFamily: "Archivo Local, Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.78rem"
    fontWeight: 800
    letterSpacing: "0.04em"
rounded:
  sm: "6px"
  md: "10px"
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
    padding: "12px 18px"
  button-primary-hover:
    backgroundColor: "{colors.ink-2}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "12px 18px"
  button-ghost-hover:
    backgroundColor: "{colors.panel-2}"
  button-small:
    padding: "7px 12px"
  signboard-face:
    backgroundColor: "{colors.sign}"
    textColor: "{colors.sign-ink}"
    typography: "{typography.sign-name}"
    padding: "10px 14px 9px"
  signboard-plate:
    backgroundColor: "{colors.plate}"
    textColor: "{colors.plate-ink}"
    width: "56px"
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
    padding: "2px 8px"
  tag-ready:
    backgroundColor: "{colors.go}"
    textColor: "{colors.go-ink}"
    typography: "{typography.label}"
    padding: "2px 8px"
  tag-problem:
    backgroundColor: "{colors.bad}"
    textColor: "{colors.bad-ink}"
    typography: "{typography.label}"
    padding: "2px 8px"
  banner:
    backgroundColor: "{colors.strip}"
    textColor: "{colors.strip-ink}"
    rounded: "{rounded.sm}"
    padding: "10px 12px"
---

# Design System: PrepAhead

All values below live as CSS variables in `style.css`. Style only through those variables so light and dark mode both keep working. Every figure on screen is sample data and stays labelled that way.

## Overview

**Creative North Star: "The Canteen Lightbox"**

PrepAhead looks like the row of lit stall signboards above an NTU canteen counter. Each stall is a red signboard with a white numbered plate, its English name in heavy, wide white capitals, its Chinese name in yellow, and a yellow strip underneath that carries the stall's one number. Everything that is not a signboard is a plain white panel with an ink frame, sitting on a cool grey wall.

The page is a demo seen from a step behind a laptop, so it is bold and big rather than delicate: thick 2px ink frames, heavy type, one very large number per stall (trays to cook). It is built from flat colour blocks, not photos. PrepAhead is a concept add-on to Cates and is not affiliated with it, so it never borrows Cates' logo or styling.

**Key Characteristics:**
- Red signboard + white plate + yellow strip is the unit every stall is drawn with, on the phone and on the tablet.
- Ink (near-black) does the structural work: text, frames, the top bar, primary buttons.
- Yellow means "look here": the strip, prices, the demo clock, the pickup code, new orders.
- Red away from a signboard means a problem.
- Status is shown by fill versus outline, never by colour alone.

## Colors

Three loud signage colours (signboard red, strip yellow, ink) over a quiet cool-grey and white base, plus one green for "ready".

### Primary
- **Signboard Red** (`--sign`): the face of every stall signboard and the tablet header. Also the "Leftover" bars in the week chart, because leftover food is the problem being solved.
- **Strip Yellow** (`--strip`): the strip under each signboard, discounted prices, the early-bird banner, the demo clock numerals, the pickup code, the "New" status tag, text selection, and the arrival flash. The Chinese stall name (`--sign-zh`) uses the same yellow.
- **Counter Ink** (`--ink`): body text, all 2px frames, primary buttons, the selected time slot, "Sold" bars in the chart. Hover darkens/lightens to `--ink-2`.

### Secondary
- **Shelf Green** (`--go`): only for "On shelf" (ready to collect).
- **Problem Red** (`--bad`, same red as the signboard): no-show and uncollected tags, the "stop pre-orders" switch when it is on. On a white panel, error text uses the deeper `--bad-text` so it stays readable.

### Neutral
- **Canteen Wall** (`--ground`): the page background behind the phone and tablet.
- **Lightbox White** (`--panel`): phone screen, tablet, cards, order rows. `--panel-2` is the quiet fill inside a panel (the tablet's card area, notes, hover on outline buttons).
- **Muted Grey** (`--muted`): secondary text, chart labels. `--line` for hairlines between rows, `--line-strong` for quiet borders and dashed "off" states.
- **Switched-off Grey** (`--off`): a closed or sold-out stall's signboard face.
- **Plate White** (`--plate`): the stall number plate. It stays white in dark mode too.

### Dark mode
Dark mode swaps the neutrals (ground, panel, ink, muted, lines, off, chart-prepared, shadow) and turns the focus ring yellow. The signboard red, strip yellow, plate white and shelf green do not change: lit signs stay lit.

### Named Rules
**The Red Means Trouble Rule.** Red appears in two places only: on a signboard face, and on something that has gone wrong (no-show, uncollected, leftover, the stop switch on, error text). Don't use red for a normal action or decoration.

**The Yellow Points Rule.** Yellow sits under ink text (`--strip-ink`), never white text. Use it for the one thing on a screen the viewer should read first.

## Typography

**Display / UI Font:** Archivo (self-hosted as "Archivo Local", Google Fonts backup), variable width 62–125% and weight 400–900, falling back to Helvetica Neue / Arial.
**Chinese Font:** Noto Sans SC Black, self-hosted as a tiny subset with only the characters in the four stall names. Adding a stall with new characters needs the subset rebuilt (or it falls back to the Google Fonts copy / system Chinese font).

**Character:** One family does everything. Signboard lettering is Archivo pushed wide (118–125%) and black (900) in capitals; the rest of the UI is the same family at normal width.

### Hierarchy
- **Display** (900, clamp(5rem, 16.5cqi, 9rem), line-height 0.8): the tray number on the tablet's yellow strip. One per screen.
- **Big numerals** (900, 2.6rem with 0.2em spacing): the 4-digit pickup code on its yellow plate. The demo clock in the top bar is 800 at 1.75rem in yellow.
- **Headline** (800, 1.85rem, wide 112%): screen titles such as "Collection time". The brand wordmark is 900, 1.6rem, widest (125%), with "Ahead" in yellow.
- **Sign name** (900, 1.3rem, wide 118%, uppercase): English stall name on the signboard; the tablet's stall picker uses the same style, scaling up to 2.2rem.
- **Sign Chinese** (Noto Sans SC 900, 1.25rem, yellow): the Chinese name directly under the English one.
- **Title** (800, 1.02rem, wide 112%, uppercase, 0.03em): card headings on the tablet.
- **Body** (400, 16px, line-height 1.45). Item names are 700 at 1.02rem; secondary text is 0.875rem in muted grey.
- **Label** (800, 0.78rem, uppercase, 0.04em): status tags and stall-type tags.

### Named Rules
**The Tabular Numbers Rule.** Every time, price, count and code uses tabular figures (`.num` or `font-variant-numeric: tabular-nums`) so numbers don't jump when they change.

**The Wide Caps Belong to Signs Rule.** Wide, black, uppercase lettering is for signboards, the brand and card titles. Body text and buttons stay at normal width and in sentence case.

## Layout

A top bar (ink, sticky) holds the brand, demo clock, the Both / Student / Stall switch and Reset demo, inside a 1280px max width. Below it the stage is a two-column grid: the student phone at 390px on the left and the stall tablet filling the rest, 32px apart. Student-only view centres the phone; Stall-only view gives the tablet the full width.

The tablet is a container (`container-type: inline-size`): its header signboard, then the full-width yellow strip, then a two-column card grid (forecast and controls left, pre-orders right). Under 760px of tablet width the grid becomes one column with pre-orders first; under 520px the header stacks and the strip shrinks.

At page widths of 760px and below, the phone loses its black device frame and becomes a framed white panel, the Both view is hidden, and Student view is the default. Between 761px and 1180px the top bar stays on one row (the "Demo time" label is visually hidden there but kept for screen readers).

Spacing steps that repeat: 8px (small gaps, slot grid), 12px (list gaps, row padding), 16px (card padding, phone padding, grid gaps), 24px and 32px (stage padding and column gap). Safe-area insets are respected on the top bar and stage edges.

## Elevation & Depth

Mostly flat colour blocks separated by 2px ink frames. One soft shadow lifts the three "objects" off the wall: the phone, each stall signboard, and the tablet. Nothing else casts a shadow; cards and order rows inside a panel are flat.

### Shadow Vocabulary
- **Object lift** (`--shadow`: `0 1px 2px rgb(0 0 0 / 0.08), 0 14px 30px -16px rgb(0 0 0 / 0.38)`, stronger in dark mode): phone, signboards, tablet.

### Named Rules
**The Frames Not Shadows Rule.** Inside a panel, separate things with a border (2px ink for structure, 1px `--line` for rows), not with shadows.

## Shapes

Gently rounded rectangles. Panels and signboards use 10px (`--r`); buttons, slots, steppers, banners and the pickup code use 6px (`--r-sm`); tags are 4px rectangles ("stickers"), never pill-round. The tablet uses 16px and the phone 40px outer / 31px screen, as device shapes. The only fully round shape is the toggle switch.

Borders: 2px ink for frames, buttons, slots and the summary rule; 2px `--line` for cards and student order cards; 1px `--line` for row dividers. Disabled time slots use a dashed grey border with struck-through text.

## Components

### Buttons
- **Shape:** 6px corners, 2px border.
- **Primary:** ink fill, white text, 800 weight, 12px 18px padding. Hover moves to `--ink-2`. One primary per row.
- **Ghost:** same frame, transparent fill, ink text; hover fills `--panel-2`.
- **Small:** 7px 12px, 0.9rem, used inside order rows.
- **Text action:** underlined 700-weight text with no box, for the rarer choice beside a primary ("Can't make it", "Mark no-show", "Check code"). In the top bar, "Reset demo" uses the same style in white.
- **Disabled:** 40% opacity, not-allowed cursor.
- **Focus:** 3px solid outline 2px out, ink in light mode and yellow in dark mode and on the red/ink bars.

### Status tags (stickers)
- **Style:** 4px rectangle, 2px border, uppercase 800 label.
- **State by fill vs outline:** New = yellow fill with ink border; Accepted = ink outline only; On shelf = green fill; Collected = ink fill; Declined / Cancelled / Voucher = grey dashed outline; No-show / Uncollected = red fill.
- **Stall-type tag** on the red tablet header: white outline ("made to order") or white fill with red text ("batch cooked").

### Cards / Containers
- **Cards:** white panel, 2px `--line` border, 10px corners, 16px padding, 12px internal gap. Titles use the Title style.
- **Calculation list:** label left in muted grey, value right in tabular 700; the total row has a 2px ink rule above it.
- **Banner:** yellow strip with ink text, 6px corners; an ink variant exists for neutral notices.
- **Note:** `--panel-2` fill, 6px corners, small text.

### Inputs / Fields
- **Time slots:** 3-column grid of framed buttons; selected = ink fill; unavailable = dashed grey and struck through.
- **Steppers:** 38px square framed buttons around a large tabular number.
- **Code input:** framed, 2px ink, wide letter spacing, tabular; caret is signboard red.
- **Checkbox and range:** native controls tinted with `accent-color` (ink for the fee checkbox, yellow for the demo clock).
- **Switch:** 52 by 30 round toggle, ink frame; when on (pre-orders stopped) it turns red.

### Navigation
- **Top bar:** ink band, white text, muted grey secondary text. The view switch is a segmented control with a 2px white frame; the pressed button is yellow with ink text.
- **Back:** a bold ink text button with a chevron icon on student screens.

### Icons
Small inline SVG line icons from the `ICON` map in `data.js` (1.25em, 2.25 stroke, round caps, `currentColor`). Add new icons there in the same style.

### The Signboard (signature)
The unit for every stall. Grid of a 56px white number plate (2px ink right edge) and a red face with the English name and Chinese name, then a full-width yellow strip with a 2px ink top edge. Whole thing has a 2px ink frame, 10px corners and the object shadow. On the phone it is a button that lifts 2px on hover; an optional footer line below the strip holds small muted text. When a stall is closed or sold out the face turns `--off` grey, the Chinese name turns white, and the strip becomes a white placard with red uppercase text.

On the tablet the signboard becomes the header (84px plate at 2.4rem, stall picker as the name, type tag on the right), and its yellow strip grows into the full-width bar that carries the Display-size tray number with the portions and cut-off beside it.

### Order ticket (tablet)
Each pre-order row is a ticket: slot time (900, 1.35rem) and status sticker on the left in a 104px column; order ID, items and actions on the right; 1px line above. Orders placed from this device's phone get their slot time on a yellow plate.

### Motion
One motion moment only. When an order from the phone arrives on the tablet, the row slides in 16px from the left with a yellow background that fades out (1.1s), and the strip's tray number drops in (0.5s). Both use `cubic-bezier(0.16, 1, 0.3, 1)` and are added once per change by `vendor.js`. Signboard hover lift and the switch knob use the same curve at 0.18s. Reduced-motion turns all transitions and animations off.

## Do's and Don'ts

### Do:
- **Do** draw every stall as the signboard: number plate, red face, English caps plus Chinese name, yellow strip.
- **Do** put the one number that matters on the yellow strip, in ink, in tabular figures.
- **Do** use 2px ink frames for structure and 1px `--line` hairlines between list rows.
- **Do** show state by fill versus outline (plus the word), so it reads without colour.
- **Do** use only the CSS variables in `style.css`, and check both light and dark mode after a change.
- **Do** keep the "Sample data" labels visible wherever figures appear.
- **Do** use the `ICON` SVGs for icons and keep motion to the arrival flash and tray tick.

### Don't:
- **Don't** use red for normal actions or decoration; red off a signboard means a problem.
- **Don't** put white text on the yellow strip.
- **Don't** add dish photos or generic white food-app cards; the signboard is the stall's picture.
- **Don't** build the stall side as a grid of KPI tiles; the tablet leads with one number on the strip.
- **Don't** make status tags pill-round; they are 4px rectangular stickers.
- **Don't** add shadows to cards or rows inside a panel.
- **Don't** use Cates' logo, colours or styling.
