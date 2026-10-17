---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: ["style.css","student.js","vendor.js"]
---

# Surface brief: PrepAhead showcase prototype (index.html)

Scope: the whole prototype page: top bar with demo controls, the student phone app (student.js) and the stall counter tablet (vendor.js), in Both / Student / Stall views. Visitor mode: Operate. Two depicted tasks: a student pre-orders lunch; a stall decides how much to cook and handles orders.

Audience and job: graders and classmates at the Week 10 showcase, watching over the presenter's shoulder on a laptop. They must follow one order from phone to tablet and see the cooking number change. Must stay readable from a step behind the screen.

Constraints: keep the side-by-side Both view and the phone + tablet framing; plain HTML/CSS/vanilla JS, no build; every figure stays labelled sample data; light and dark both work.

Unresolved: final survey numbers (not in the project); stall numbers 01–04 are sample identifiers.

## Direction contract

THESIS: Every stall is its own lit signboard, and its one number for today, trays to cook, is printed on that signboard's yellow strip. Refuses white food-app cards with dish photos and a KPI-tile dashboard.

OWN-WORLD: Canteen lightbox signage. Signboard-red panels with white heavy expanded Archivo caps and Noto Sans SC Chinese names, numbered white stall plates, yellow price and number strips in ink, ink frames and an ink top bar, white lightbox panels on a cool grey ground. Status tags are rectangular stickers; state reads by fill versus outline, and red off the signboard means a problem.

STORY: A visitor sees a student pick a signboard, choose a time and pay; the order lands under the same stall's signboard on the tablet and the strip's tray count updates. They grasp that pre-orders tell the stall how much to cook before it cooks.

FIRST VIEWPORT: Ink top bar: PrepAhead, demo clock in large yellow numerals, view switch, Reset demo. Left: phone with "Skip the lunch queue" and four stacked stall signboards. Right: tablet whose header is the Mixed Veg Rice signboard (plate 01, name, 杂菜饭, type tag, stall select); under it a full-width yellow strip, "9 trays to cook · 135 portions"; then forecast and controls left, pre-orders with Accept all new right.

FORM: Hawker Signboard, my first-ranked grounded candidate, chosen as Impeccable's pick. seed: none (this CLI version printed no SEED REFERENCE line for the roll). Signature interaction: a new order slides into the stall's list wearing a yellow NEW sticker, and the strip's tray number ticks over.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
