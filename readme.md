# Konnie Lab — The playable workshop

Static portfolio for https://konnie-lab.github.io/playables/.

The home page presents two live projects inside the same workshop: Castle Duels and COURTSIDE. Translucent chevrons at the left/right edges of the scene switch the background, characters, project description and playable together; the compact top panel shows the current project name, 01 / 02 counter, and previous/next arrows. On narrow phones, the arrows sit beside the upper part of the phone; reserved side gutters keep their touch areas clear of the game. The top panel uses the same translucent workshop styling with a small green status light. Switching is manual, with a soft artwork fade; the previous app is destroyed before the iframe is replaced. Sound preference survives switching and restart. The player supports restart, an expanded portrait/landscape view, keyboard Escape and automatic pause when off screen or in a hidden tab. Workshop ambience respects reduced-motion preferences.

The compact introduction keeps one headline, “Ideas into play.” The duplicate headline, extra introduction links and merge instruction have been removed. The workshop footer reads “HANDCRAFTED WITH CODE & MAGIC”. Header plus introduction occupy approximately 200px at 1440px width, 197px at 390px width and 146px in 844×390 landscape.

## COURTSIDE workshop

- `portfolio-projects.css` contains the compact header, project navigation and basketball layers. The original Castle Duels artwork and animations remain available as the first project.
- `assets/basketball-workshop/background-gold.png` is the active ImageGen edit; `background-gold.webp` is its optimized 1536×1024 runtime version (263,694 bytes). All machine energy, tubes and chamber rings are gold. The earlier mixed-color background remains available. Original prompt: `prompts.json`; final gold edit: `polish-prompts.json`.
- The background preserves the workshop geometry while replacing the monitor content, devices and miniature with basketball, adding a small court inside the glass cylinder and amber energy pipes. Existing animated gears, rings and arrows retain their alignment.
- `conveyor-cast.png` is a new transparent ImageGen sheet authored for the belt: captain holding a ball, seated coach with clipboard/chair, and freestanding hoop. Reference identities come from the playable; the newly rendered perspective and warm/cool lighting match the workshop. Prompt: `conveyor-prompt.json`. `npm run prepare:basketball-cast` extracts the three nonoverlapping alpha islands and produces `belt-captain.webp`, `belt-coach.webp`, `belt-hoop.webp` at 600px high with quality 88 and full alpha quality. Contact points follow the upper belt plane. The coach uses two complementary CSS masks so her upper body leans while the chair and feet remain fixed. The active captain is now `captain-balanced.png` / `captain-balanced.webp`: natural proportions, both hands holding the ball, no pointing pose. He breathes visibly but gently over 3.4 seconds with fixed feet and no skew or rocking. The coach and hoop are spaced apart along the belt, keeping their ground contacts aligned. The chamber ball is smaller, positioned before the rim, and spins continuously over 2.6 seconds. Edge arrows use thicker translucent strokes; the compact name/counter panel provides a second pair of navigation arrows. `prepare:basketball-cast` also reproduces the active captain WebP. Earlier sprites remain as unused references; the final player prompt is in `polish-prompts.json`.
- The chamber dunk and ball are copied unchanged from the playable. The six active runtime basketball images total 469,932 bytes. Generated source PNGs are not loaded by the page.
- Workshop motion now uses shorter cycles: gears 9.5/11.3s linear, arrows 2s, rings 4.8s, character gestures around 2.6–4.2s. A short local RAF sample showed median 6.3ms and p95 14.8ms after the update; this is a local observation, not a device performance guarantee. CSS ambience pause, reduced motion and hidden/offscreen handling still apply to all layers.
- `basketball/index.html` is the verified standalone export from `Konnie-Lab/playables/clients/konnie-lab/basketball-first-core/dist/basketball-first-core_default.html` (4,985,883 bytes). Refresh by running that project's check first, then copying the resulting HTML here. No game logic is modified in the portfolio copy.
- `script.js` supports Castle Duels' in-game sound button and COURTSIDE's shared audio service. Project links remain relative for GitHub Pages under `/playables/`.

Verification: `scripts/verify-portfolio.playwright.js` runs through Playwright MCP's `browser_run_code_unsafe` filename argument against the local preview. It checks six viewport sizes, switching/restarting with persisted mute, rapid repeated switching, expanded landscape, Escape, reduced motion, offscreen pause/resume and local resource/page errors. The current pass has no page exceptions or failed local resources. A separate real-input pass completed COURTSIDE's first match inside the iframe, 80:79. The copied basketball export also passed its 12 source-project gameplay checks. GitHub publication is a separate step; these changes are local.

## Saved versions

- `workshop-v1` / commit `76eef5b`: approved original workshop with sunflower, sheep, holograms, brighter arrows and rotating gears. Preserved on `main`.
- `workshop-castle-v1` / commit `226fb76`: first Castle Duels themed workshop, with characters travelling along the conveyor.
- `experiment/castle-workshop`: current Castle Duels workshop. Characters stand on the belt: the orange mage sways, the blue mage occasionally hops, and the bear shifts its weight. Conveyor spells drift at constant opacity; the chamber spell keeps constant opacity and emits a star geyser. The chamber pairs an orange mage riding a bear with a VORTEX level-4 mage rendered from the game's upgraded model reference, plus a larger spell with orbit rings. Source images and prompts are in `assets/castle-workshop/prompts-v2.json`. The chamber uses an asymmetric composition: upgraded mage on the left, bear rider on the right, spell between them and Summon below. Character motions have a slightly quicker cadence. Expanded play uses the available viewport height. Updated personal portfolio copy includes a compact credibility section.

These are local Git versions; no publication is implied. Use a separate checkout/worktree of `workshop-v1` to compare without replacing ongoing edits.

## Files

- `index.html`, `styles.css`, `script.js`: portfolio.
- `spark-burst.js`: lightweight Canvas2D adaptation of the native Pixi SparkBurstFX particle effect.
- `castle-workshop.css`: themed characters, idle motions, spell and chamber animation.
- `assets/castle-workshop/`: native character reference renders exported from the playable, a gameplay screenshot, ImageGen character/background/spell PNGs, optimized WebP copies and generation prompts. The game's source models and textures remain unchanged.
- `assets/workshop.webp`: previous static workshop artwork.
- `assets/workshop-layers/`: ImageGen backgrounds, transparent sunflower/sheep/star/arrow/cube/rig/gear sprites, full-size PNG originals, optimized WebP copies and the generation prompts (`prompts.json`, `prompts-v2.json`). The website uses WebP and `background-gears.webp`, with the two front wheels removed for animated overlays. Sprite positions share the background's 1536 × 1024 coordinate system; `layoutWorkshop()` keeps them aligned when the scene is cropped on mobile. The wheels rotate inside fixed perspective transforms; arrow centers are positioned individually from the original reference.
- `castle-duels/index.html`: standalone production build from `Konnie-Lab/playables/clients/myGames/castle-duels`.
- `old_playables/`: previous portfolio and demos, preserved but not linked from the current site. This is an archive, not private storage; files remain accessible by direct URL if published.

## Refresh the playable

From `C:\JS\Konnie-Lab`, run `npm run check -- clients/myGames/castle-duels`. After checks pass, copy that project's `dist/castle-duels_default.html` to this repository's `castle-duels/index.html`. The source project enables gzip for models and quality-90 WebP compression for images, preserving the HP mask in its original format.

The current export includes the Fight camera fix: event predicates respond only in their owning active state, and the second battle no longer starts a duplicate camera transition. Both Fight clicks are regression-checked in development and production alongside the complete gameplay sequence.

## Local preview

From the portfolio folder, run:

```powershell
cd C:\JS\playables-main
npm run dev
```

Open http://127.0.0.1:4178/playables/. `npm run preview` is an equivalent command. Node.js is required; no dependency installation or build step is needed just to preview the portfolio. Refresh the browser after editing files. Stop the server with Ctrl+C. If port 4178 is already occupied by this preview, use the existing browser URL or stop the old server before starting a new one. Keep relative asset paths so GitHub Pages works under `/playables/`.

## Optimize workshop images

Run `npm ci` once, then `npm run optimize:images`. Sharp regenerates the ten active raster assets from their original PNG/JPG files, preserving full-quality alpha and choosing dimensions for approximately 2x display resolution. Originals and unused version-one assets stay available for future edits but are not loaded by the current page. The site remains buildless; Sharp is a development-only dependency and webpack is not required.

The eleven active workshop WebPs total **409,816 bytes**, including the 2,458-byte Summon decoration (original texture from Castle Duels `assets/images/button_summon.jpg`). The original 10,326-byte `star_fx_yellow.webp` from `Konnie-Lab/playables/blanks/pixi-blank/assets/images/fx/` is copied unchanged and is not reprocessed by Sharp. The previous nine images were reduced from **661,798** to **397,032 bytes** (40% less). This measures workshop images only, excluding the playable, fonts and page code. The existing 4.7 MB standalone playable already uses WebP textures and compressed models; it is unchanged by this optimization.

Spell sparks now use the original `pixi-blank/src/fx/SparkBurstFX.js` behavior and its star texture: 46 particles per burst, randomized launch, drag, gravity, rotation and cubic fade, scaled to the artwork. Three small Canvas2D layers emit sparks from both conveyor spells and the chamber spell. They replace all previous CSS spark/trail particles; no Pixi runtime is loaded by the portfolio. Bursts are staggered and followed by an eight-second idle interval on the conveyor and five seconds in the chamber, with no rendering loop between bursts. Effects respect ambience pause, offscreen/hidden-tab pause and reduced motion. Summon inside the artwork is decorative; the interactive game's mechanics are unchanged.

The Process navigation targets the three steps. Merge/summon FX use explicit default animation lists in the original merge and smoke_circle atlases; frame images are unchanged. The refreshed export passes all four project browser scenarios, including rendered FX playback and completion.

The paper sticker has been removed from both scenes to leave the workshop art clear. The project selector stays in the scene. The chamber athlete floats on a gentle closed path: two compositor transform animations, each 4.8 seconds, with horizontal and vertical motion offset by a quarter cycle. There is no rotation. A local 5.2-second RAF sample measured median 8.3ms, p95 12.6ms and no gaps above 33ms; performance depends on the device.
