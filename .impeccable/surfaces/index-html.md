---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: ["style.css","student.js","vendor.js"]
---

# Surface brief: PrepAhead showcase prototype (index.html)

Scope: the whole prototype page: top bar with demo controls, the student phone app (student.js) and the stall counter tablet (vendor.js), in Both / Student / Stall views. Visitor mode: Operate. Two depicted tasks: a student pre-orders lunch; a stall decides how much to cook and handles orders.

Audience and job: graders and classmates at the Week 10 showcase, watching over the presenter's shoulder on a laptop. They must follow one order from phone to tablet and see the cooking number change. Must stay readable from a step behind the screen.

Constraints: keep the side-by-side Both view and the phone + tablet framing; plain HTML/CSS/vanilla JS, no build; every figure stays labelled sample data; light only (looks the same when the computer is in dark mode). User steer for this world: "simple yet definitive", "something with an identity", between a departures board and a line map; not kiddy.

Unresolved: final survey numbers (not in the project); stall codes NS01–NS04 are sample identifiers; per-slot capacity and the two-way forecast are separate later items on the group's list.

## Direction contract

THESIS: PrepAhead is one green line. Stalls are stops on it, every order rides it from placed to collected, and the one number per screen that matters (trays to cook, the cut-off, your collection time) clacks over in black flip tiles. Refuses white food-app cards with dish photos, a KPI-tile dashboard, and cute rounded stickers.

OWN-WORLD: Light porcelain ground and white work panels; one saturated line green for the line, stops and progress; black split-flap tiles with paint-white numerals for the one number per screen; a yellow lamp only for "now" and "new"; red only for problems. Tall condensed signage capitals (Big Shoulders Display) for headings, codes and numerals over Archivo for reading text. Stall code tabs (NS01) in black chips. Progress reads by line form: solid done, dashed to come, ring for where it is.

STORY: A visitor sees the student pick a stop on the green line before the 10:00 flip tiles run out, choose a time and pay; the order lands on that stall's tablet as a new stop on its lunch line and its own four-stop progress line, and the trays-to-cook tiles flip over. They grasp that pre-orders tell the stall how much to cook before it cooks.

FIRST VIEWPORT: White top bar: line-and-stop mark, PREPAHEAD in signage caps, tagline, demo clock with the time as plain numerals (user's call: keep the demo time simple), view switch, Reset demo. Left: phone with SKIP THE LUNCH QUEUE in tall caps and "@ North Spine Canteen" under it (user's copy), "Batch stalls close" with 10:00 in flip tiles, early-bird lamp line, then stalls NS01–NS04 as stops on a vertical green line. Right: tablet with a black header (green NS01 tab, MIXED VEG RICE, 杂菜饭, type tag, stall picker), then 09 in large flip tiles beside TRAYS TO COOK, cooked-so-far stops with +1 tray cooked; under it the lunch line 11:30–13:30 whose stops grow with portions due; then the worked-out number left and pre-orders right, each with its own progress line.

FORM: The Lunch Line, the user's steered blend of the split-flap concourse board and the metro line diagram (line-led), chosen over a board-led alternate in re-roll round 2. seed: none (the rolls ran, but this CLI version printed no SEED REFERENCE line for any of them; the direction itself was pinned by the user's steer, not dealt). Signature interaction: when a pre-order changes the forecast, the tray tiles flip over to the new number and the order arrives as a new stop on the lunch line. Raised: stops grow with portions due; list head names the span in view; solid/dashed progress; code tabs; the collection ticket owns the phone screen.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
