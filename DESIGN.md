---
name: PrepAhead
description: A pre-order add-on concept for Cates drawn as one green line, with stalls as stops and the one number that matters in black flip tiles (prototype, sample data).
colors:
  ground: "#eef0ee"
  panel: "#ffffff"
  panel-2: "#f5f6f4"
  ink: "#151715"
  ink-2: "#303530"
  on-ink: "#ffffff"
  muted: "#545a55"
  line: "#dde1dd"
  line-strong: "#8b928c"
  board: "#151715"
  tile-top: "#2b2f2b"
  tile-bottom: "#111311"
  tile-split: "#000000"
  paint: "#f4f4ef"
  paint-dim: "#b9beb9"
  green: "#1fa463"
  green-text: "#0b7a3f"
  green-ink: "#151715"
  lamp: "#ffc400"
  lamp-soft: "#fff1bf"
  lamp-edge: "#c79800"
  bad: "#c8321f"
  bad-ink: "#ffffff"
  off: "#a3a9a4"
  focus: "#151715"
  chart-prepared: "#c9cec9"
  chart-sold: "#1fa463"
  chart-leftover: "#c8321f"
typography:
  display:
    fontFamily: "Big Shoulders Local, Big Shoulders Display, Archivo Local, Archivo, Arial Narrow, sans-serif"
    fontSize: "2.9rem"
    fontWeight: 900
    lineHeight: 0.88
    letterSpacing: "0.02em"
  headline:
    fontFamily: "Big Shoulders Local, Big Shoulders Display, Archivo Local, Archivo, Arial Narrow, sans-serif"
    fontSize: "2rem"
    fontWeight: 900
    lineHeight: 0.95
    letterSpacing: "0.02em"
  title:
    fontFamily: "Big Shoulders Local, Big Shoulders Display, Archivo Local, Archivo, Arial Narrow, sans-serif"
    fontSize: "1.1rem"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "0.06em"
  numeral:
    fontFamily: "Big Shoulders Local, Big Shoulders Display, Archivo Local, Archivo, Arial Narrow, sans-serif"
    fontSize: "1.65rem"
    fontWeight: 800
    lineHeight: 1
    fontFeature: "tnum"
  body:
    fontFamily: "Archivo Local, Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.45
  body-small:
    fontFamily: "Archivo Local, Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.45
  label:
    fontFamily: "Big Shoulders Local, Big Shoulders Display, Archivo Local, Archivo, Arial Narrow, sans-serif"
    fontSize: "0.85rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.08em"
  clock:
    fontFamily: "Archivo Local, Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.35rem"
    fontWeight: 700
    lineHeight: 1
    fontFeature: "tnum"
  stall-zh:
    fontFamily: "Noto Sans SC, Noto Sans SC Stalls, PingFang SC, Microsoft YaHei, sans-serif"
    fontSize: "0.85rem"
    fontWeight: 500
rounded:
  tab: "3px"
  control: "4px"
  panel: "8px"
  phone-screen: "35px"
  phone: "44px"
  full: "50%"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "20px"
  xl: "24px"
  2xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-ink}"
    rounded: "{rounded.control}"
    padding: "11px 18px"
  button-primary-hover:
    backgroundColor: "{colors.ink-2}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "11px 18px"
  button-ghost-hover:
    backgroundColor: "{colors.panel-2}"
  button-small:
    padding: "7px 12px"
  code-tab:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paint}"
    typography: "{typography.label}"
    rounded: "{rounded.tab}"
    padding: "3px 6px 2px"
  code-tab-board:
    backgroundColor: "{colors.green}"
    textColor: "{colors.green-ink}"
    rounded: "{rounded.tab}"
    padding: "5px 9px 4px"
  flip-tile:
    backgroundColor: "{colors.tile-bottom}"
    textColor: "{colors.paint}"
    width: "0.78em"
    height: "1.32em"
  slot:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "9px 0"
  slot-selected:
    backgroundColor: "{colors.tile-bottom}"
    textColor: "{colors.paint}"
  stepper-button:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    size: "36px"
  view-switch-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-ink}"
    padding: "6px 14px"
  notice-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-ink}"
    rounded: "{rounded.control}"
    padding: "10px 12px 10px 31px"
  board-header:
    backgroundColor: "{colors.board}"
    textColor: "{colors.paint}"
    padding: "14px 20px"
  type-tag:
    backgroundColor: "transparent"
    textColor: "{colors.paint}"
    rounded: "{rounded.tab}"
    padding: "4px 8px 3px"
---

# Design System: PrepAhead

## Overview

**Creative North Star: "The Lunch Line"**

PrepAhead is one green line. Each stall is a stop on it (NS01 to NS04), every order rides it from placed to collected, and the single number a screen exists to tell you (trays to cook on the stall tablet, the 10:00 cut-off on the phone, the collection time on the ticket) sits in black split-flap tiles like a departures board. Everything else is a light, ruled transit map: porcelain ground, white work panels, hairlines, and tall condensed signage capitals over a plain reading face.

The density is a working tool, not a showcase poster. Sections inside a panel are separated by a heavy ink rule and a signage title rather than boxed into cards; lists are rows on hairlines; status reads by line form (solid done, dashed to come, ring for now) and by a word, never by colour alone. Colour is rationed into three jobs: green draws the line, a yellow lamp marks "now" and "new", red marks a problem. The page is light only and looks the same on any laptop.

The world refuses white food-app cards with dish photos, a KPI-tile dashboard, and cute rounded stickers. It never borrows Cates' logo or styling: PrepAhead is a concept add-on, not affiliated.

**Key Characteristics:**
- One saturated green line carries stops, progress and the lunch timeline.
- Black flip tiles hold exactly one number per screen; every other number is plain signage or body numerals.
- Big Shoulders Display signage capitals for headings, codes and numerals; Archivo for everything you read.
- Ruled, not boxed: heavy ink rules and hairlines organise the panel.
- Yellow lamp for now/new, red for problems, nothing else coloured.
- One motion moment: tiles flip, the order arrives, its stop grows.

## Colors

A near-monochrome porcelain-and-ink map with one line green, a small yellow lamp, and a problem red.

### Primary
- **Line Green** (green): the line itself. The stop line on the phone, done segments and filled stops on progress lines, the lunch-line rail, cooked tray stops, the meter fill, the demo clock slider, the green NS tab on the board, and the "Sold" chart bars. Shapes only; it is too light to be text on white.
- **Line Green, Text** (green-text): green when it has to be words on white: "Saved 40 this week (sample)", the "On shelf" status word, the input caret.

### Secondary
- **Lamp Yellow** (lamp) with **Lamp Edge** (lamp-edge): a 9px lamp dot for "now" and "new" only: the early-bird lamp line, the cut-off countdown, the NEW status mark, the current progress stop of a new order, the current slot on the lunch line. The edge keeps a small lamp holding its shape on white.
- **Lamp Glow** (lamp-soft): the pale flash when a new order arrives on the tablet, and text selection.

### Tertiary
- **Problem Red** (bad / bad-ink): no-show, uncollected, leftover, the extra-tray stop, the "Stop pre-orders" switch when on, error text, the "Leftover" chart bars. Nothing decorative is ever red.

### Neutral
- **Porcelain Ground** (ground): the wall behind the phone and the tablet.
- **Panel White** (panel): the phone screen, the tablet, the top bar.
- **Quiet Fill** (panel-2): one-line notes and banners inside a panel, hover fill on ghost controls.
- **Line Ink** (ink, board, focus, green-ink): text, primary buttons, heavy section rules, rings, the black tablet header, code tabs, focus outlines.
- **Ink Hover** (ink-2): primary button hover.
- **Paint** (paint) and **Paint Dim** (paint-dim): numerals on tiles and text on the black board; secondary text on the board.
- **Tile Top / Tile Bottom / Tile Split** (tile-top, tile-bottom, tile-split): the two halves of a split-flap tile and the hairline between them.
- **Muted Text** (muted): secondary text, labels, past times.
- **Hairline** (line) and **Control Edge** (line-strong): row dividers; edges that mark a control and the dashed "still to come" segments.
- **Closed Stop** (off): a closed stall's line segment and ring.
- **Chart Prepared** (chart-prepared): the neutral "Prepared" bars.

### Named Rules
**The Three Jobs Rule.** Green is the line, yellow is now/new, red is a problem. A colour outside its job is a bug.

**The Shapes-Not-Text Rule.** Line Green fills shapes only. When green must be read as words, use Line Green, Text.

**The Variables-Only Rule.** Every colour comes from a custom property in style.css; the page is light only (color-scheme: light), no dark variant.

## Typography

**Display Font:** Big Shoulders Display (self-hosted as "Big Shoulders Local", weights 700 to 900), falling back to Archivo squeezed narrow (font-stretch 72%), then Arial Narrow.
**Body Font:** Archivo (self-hosted as "Archivo Local", variable weight and width), with Helvetica Neue and Arial.
**Chinese stall names:** Noto Sans SC, with a self-hosted subset ("Noto Sans SC Stalls") covering the four stall names.

**Character:** Tall condensed station-signage capitals do the announcing (headings, stall codes, slot times, prices, tile numerals); Archivo does the explaining at a comfortable 16px. Signage is always uppercase and tracked slightly open.

### Hierarchy
- **Display** (900, 2.9rem, 0.88): the phone's screen title ("Skip the lunch queue"). One per phone screen.
- **Headline** (900, 2rem, 0.95): stall names on their own screen (2.2rem), "Trays to cook" beside the tiles, ticket headings (1.5rem).
- **Title** (800, 1.1rem, 1.1, 0.06em): ruled section titles ("Pre-orders", "How the number is worked out", "Batch stalls close").
- **Numeral** (800, 1.3 to 1.9rem, 1, tabular): slot times in order rows, prices, stepper values, slot buttons, cooked count. Signage numerals, not tiles.
- **Flip-tile numeral** (800, sized by the tile font-size: 2.2rem default, 2.3rem cut-off, 3.6rem ticket, clamp(3.4rem, 9cqi, 5.4rem) tablet hero).
- **Body** (400, 16px, 1.45): all reading text; rows run at 0.95rem; secondary text at 0.82 to 0.9rem in Muted Text.
- **Label** (700, 0.85rem, 0.08em, uppercase): status words, code tabs, type tag, lunch-line times, the "Cooked so far" label.
- **Clock** (Archivo 700, 1.35rem, tabular): the demo time, deliberately plain numerals.

### Named Rules
**The Signage Announces Rule.** Big Shoulders is for short uppercase announcements and numerals only; any sentence a person reads goes in Archivo.

**The Tabular Numbers Rule.** Every number that can change (prices, counts, times, codes) uses tabular figures so updates never shift the layout.

## Layout

A sticky white top bar (max 1280px inner width) holds the mark and wordmark, the demo clock, the Both / Student / Stall switch and Reset demo. Below it, the stage is a two-column grid: the student phone at a fixed 390px on the left, the stall tablet filling the rest (32px gap, 24px top and 48px bottom padding). Each pane carries a small label row above it naming the device and "Sample data".

The phone is a black bezel (10px) around a white screen that scrolls internally; content stacks in a single column at 16px gap. The tablet is a container-query panel: black header, hero row, lunch line, then a two-column grid (1fr / 1.25fr, 24px gap, 20px inset) of ruled sections. Under a 760px container the columns stack with pre-orders first; under 560px the header and hero reflow and insets drop to 14px.

Below 760px viewport the phone loses its bezel and becomes a plain bordered panel, the "Both" view is hidden, and the page opens on Student. Between 761 and 1180px the tagline and clock label hide so the top bar stays one row.

Spacing runs on a 4px base, mostly 8, 12 and 20: 12px row padding on hairline lists, 20px panel inset, 24 to 26px between ruled sections.

## Elevation & Depth

Flat by default. Depth comes from ink: the black tablet header, the black phone bezel, the split-flap tiles. Exactly two objects lift off the porcelain ground, because they are the two devices on the table.

### Shadow Vocabulary
- **Device lift** (`box-shadow: 0 1px 2px rgb(16 24 16 / 0.06), 0 14px 30px -18px rgb(16 24 16 / 0.3)`): the phone and the tablet only. Removed on small screens where the phone loses its bezel.

### Named Rules
**The Two Devices Rule.** Only the phone and the tablet cast a shadow. Sections, rows, notes and buttons are flat.

## Shapes

Small, firm corners: 3px on tabs and tags, 4px on buttons, slots, steppers, notes and banners, 8px on panels; 44px / 35px only for the phone bezel and screen. Circles belong to the line: stop rings (4px ink border), progress stops (14px, 18px for "here"), lunch-line stops sized by portions, lamps, status marks, and the switch thumb. The line itself is a thick bar (8px on the phone, 6px rounded on the lunch line, 4px on progress) with dashed 2px hairlines for what is still to come. Borders are 1.5px ink for controls, 1px hairlines for rows, 3px ink rules to open a section.

## Components

### Buttons
- **Shape:** firm corners (4px), 1.5px ink border.
- **Primary:** ink fill, white text, 600 weight, 11px 18px padding; small size 7px 12px at 0.9rem. One primary per row.
- **Hover / Focus:** fill shifts to Ink Hover over 0.15s; focus is a 3px ink outline offset 2px (Lamp Yellow on the black board). Disabled drops to 40% opacity.
- **Ghost:** transparent with ink border and text; hover fills Quiet Fill.
- **Link action:** an underlined text button (0.9rem, 600) for the rarer choice in a row ("Can't make it", "Reset demo"); hover goes muted.

### Code Tabs and Tags
- **Stall code tab:** NS01 to NS04 in small ink chips with paint signage numerals (3px corners); on the black board the tab turns Line Green with ink text.
- **Type tag:** an outlined paint-dim tag on the board ("Batch-cooked").
- **Status words:** uppercase signage labels led by a 9px mark that reads by shape: lamp-filled for new, hollow ring for accepted, green-filled for on shelf, muted-filled for collected, dashed ring for declined / cancelled / voucher, red-filled for no-show.

### Ruled Sections (Cards / Containers)
- **Corner Style:** none; sections are not boxed.
- **Background:** the parent panel.
- **Shadow Strategy:** none (see The Two Devices Rule).
- **Border:** a 3px ink rule on top, then a signage title, then content at 12px gap.
- **Calc list:** label / value rows on hairlines; a 2px ink rule above the "Suggested" sum row and the final "Rounded up to whole trays" row, which carry the weight.

### Inputs / Fields
- **Stepper:** 36px square ghost buttons (1.5px Control Edge border) around a signage numeral; empty state reads "Not counted" in muted Archivo instead of a zero.
- **Code check input:** 1.5px Control Edge border, 4px corners, wide letter-spacing; focus darkens the border to ink.
- **Slots:** a three-column grid of outlined signage times; the chosen slot turns into a flip tile (tile gradient, paint numerals); a full slot is dashed, muted and struck through.
- **Switch:** 50 by 28px pill, ink thumb; when on (stop pre-orders) it fills Problem Red with a white thumb.
- **Meter:** a 6px hairline track filled Line Green.

### Navigation
- **Top bar:** white with a hairline foot. The mark is a short green line arriving at an ink-ringed stop, then PREPAHEAD in 900 signage caps with a muted tagline. The demo clock is a green-accented range slider with the time as plain Archivo numerals.
- **View switch:** a segmented control in a 1.5px ink frame; the pressed segment fills ink with white text, others hover Quiet Fill.
- **Back:** a plain text button that underlines on hover.

### Flip Tiles (Signature)
One tile per character on a two-tone gradient (Tile Top over Tile Bottom) with a 1px black split across the middle, paint numerals in 800 signage, 0.07em corners, 0.1em gap; a colon stays plain. Size is set by one variable (tile font-size). The tiles are hidden from screen readers, which read the plain text. On a forecast change the tiles flip (rotateX from -88deg with a brightness flash, 0.5s, second tile 0.08s later).

### Stop Line (Signature)
On the phone, stalls hang off a vertical 8px green line through 28px white rings with 4px ink borders. Each stop shows its code tab, name, Chinese name, a muted meta line, a green "Saved" line, and a signage price. A closed stop greys its line segment and ring and gives the reason in red. Hover grows the ring 1.15x and underlines the name.

### Progress Line (Signature)
Four stops per order (new, accepted, on shelf, collected): solid green bar and filled stops for done, a dashed Control Edge hairline for still to come, a larger ink ring for "here" (lamp-filled while the order is new). The ticket version names every stop.

### Lunch Line (Signature)
A horizontal green rail across the tablet with one stop per collection slot, each ring sized by the portions pre-ordered for it and showing the count; batch stalls get a leading cut-off stop drawn as a tiny flip tile. The current slot carries a lamp; a slot that just grew scales up from 0.6.

### Tablet Header and Hero
The black board holds the green code tab, the stall picker as a borderless signage select with a paint chevron, the Chinese name in Paint Dim, and the type tag. The hero sets the trays-to-cook tiles beside a "Trays to cook" headline and its working, with "Cooked so far" on the right as a row of tray stops (green when cooked, red when an extra tray was cooked) above a "+1 tray cooked" button.

### Order Rows, Notices and Ticket
- **Order rows:** a 64px signage slot time on the left; what to make, the status word with its progress line, and the actions on the right; hairlines between rows. A newly arrived row slides in 10px with a Lamp Glow flash (1.1s).
- **Lamp line:** a lamp dot leading one ruled line (early bird); no box, no fill.
- **Notice:** a one-line Quiet Fill banner led by a lamp; the ink version (black fill, white text) is for collection reminders.
- **Cut-off panel:** heavy ink rule, "Batch stalls close" title with a lamp countdown, the cut-off in flip tiles on the right.
- **Collection ticket:** owns the phone screen, centred: "Collect at" with the time in 3.6rem tiles, where to collect, the named progress line, the QR on white, and the 4-digit code in a 2px ink frame at 2.6rem 900 signage with wide tracking.

### Motion
One moment only: when a pre-order changes the forecast, the tray tiles flip, the order row arrives with a lamp-glow flash, and its lunch-line stop grows. All on cubic-bezier(0.16, 1, 0.3, 1). Hover transitions run 0.15 to 0.18s. Under prefers-reduced-motion every transition and animation is off.

## Do's and Don'ts

### Do:
- **Do** draw every journey (stalls, an order's progress, the lunch timeline, trays cooked) as the green line with stops: solid done, dashed to come, ring for now.
- **Do** put exactly one number per screen in flip tiles: trays to cook on the tablet, the cut-off on the phone home, the collection time on the ticket. A chosen slot may turn into a tile because it becomes that screen's number.
- **Do** open sections with a 3px ink rule and a signage title instead of a box.
- **Do** pair every status colour with a shape and a word so it reads in greyscale.
- **Do** keep the demo clock as plain Archivo numerals.
- **Do** keep "Sample data" labels visible on both panes and on every chart.
- **Do** take every colour, font and radius from the custom properties in style.css.

### Don't:
- **Don't** use white food-app cards with dish photos, a KPI-tile dashboard, or cute rounded stickers.
- **Don't** put a second flip-tile number on a screen; other numbers are signage numerals.
- **Don't** use yellow for anything but now and new, or red for anything but a problem.
- **Don't** set Line Green as text on white; use Line Green, Text.
- **Don't** add shadows beyond the phone and the tablet.
- **Don't** use Cates' logo, colours or styling.
- **Don't** add a dark mode.
