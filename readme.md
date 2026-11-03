# Konnie Lab — The playable workshop

Static portfolio for https://konnie-lab.github.io/playables/.

The home page presents a workshop scene and a live Castle Duels demo inside a responsive phone. The player supports restart, an expanded view, keyboard Escape and automatic pause when off screen or in a hidden tab. Workshop ambience respects reduced-motion preferences.

## Saved versions

- `workshop-v1` / commit `76eef5b`: approved original workshop with sunflower, sheep, holograms, brighter arrows and rotating gears. Preserved on `main`.
- `workshop-castle-v1` / commit `226fb76`: first Castle Duels themed workshop, with characters travelling along the conveyor.
- `experiment/castle-workshop`: current Castle Duels workshop. Characters stand on the belt: the orange mage sways, the blue mage occasionally hops, and the bear shifts its weight. Spells drift and flicker. The chamber pairs an orange mage riding a bear with a VORTEX level-4 mage rendered from the game's upgraded model reference, plus a larger spell with orbit rings. Source images and prompts are in `assets/castle-workshop/prompts-v2.json`. Sparse chamber sparks rise and fade, inspired by the supplied SparkleFX3D effect, implemented in CSS. Expanded play uses the available viewport height. Updated personal portfolio copy includes a compact credibility section.

These are local Git versions; no publication is implied. Use a separate checkout/worktree of `workshop-v1` to compare without replacing ongoing edits.

## Files

- `index.html`, `styles.css`, `script.js`: portfolio.
- `castle-workshop.css`: experimental themed characters, conveyor travel, spell and chamber animation.
- `assets/castle-workshop/`: native character reference renders exported from the playable, a gameplay screenshot, ImageGen character/background/spell PNGs, optimized WebP copies and generation prompts. The game's source models and textures remain unchanged.
- `assets/workshop.webp`: previous static workshop artwork.
- `assets/workshop-layers/`: ImageGen backgrounds, transparent sunflower/sheep/star/arrow/cube/rig/gear sprites, full-size PNG originals, optimized WebP copies and the generation prompts (`prompts.json`, `prompts-v2.json`). The website uses WebP and `background-gears.webp`, with the two front wheels removed for animated overlays. Sprite positions share the background's 1536 × 1024 coordinate system; `layoutWorkshop()` keeps them aligned when the scene is cropped on mobile. The wheels rotate inside fixed perspective transforms; arrow centers are positioned individually from the original reference.
- `castle-duels/index.html`: standalone production build from `Konnie-Lab/playables/clients/myGames/castle-duels`.
- `old_playables/`: previous portfolio and demos, preserved but not linked from the current site. This is an archive, not private storage; files remain accessible by direct URL if published.

## Refresh the playable

From `C:\JS\Konnie-Lab`, run `npm run check -- clients/myGames/castle-duels`. After checks pass, copy that project's `dist/castle-duels_default.html` to this repository's `castle-duels/index.html`. The source project enables gzip for models and quality-90 WebP compression for images, preserving the HP mask in its original format.

## Local preview

Run `node preview.mjs` and open http://127.0.0.1:4178. No install or build step is needed for the portfolio. Keep relative asset paths so GitHub Pages works under `/playables/`.

## Optimize workshop images

Run `npm ci` once, then `npm run optimize:images`. Sharp regenerates the ten active raster assets from their original PNG/JPG files, preserving full-quality alpha and choosing dimensions for approximately 2x display resolution. Originals and unused version-one assets stay available for future edits but are not loaded by the current page. The site remains buildless; Sharp is a development-only dependency and webpack is not required.

The active workshop WebPs total **399,490 bytes**, including the 2,458-byte Summon decoration (original texture from Castle Duels `assets/images/button_summon.jpg`). The previous nine images were reduced from **661,798** to **397,032 bytes** (40% less). This measures workshop images only, excluding the playable, fonts and page code. The existing 4.7 MB standalone playable already uses WebP textures and compressed models; it is unchanged by this optimization.

Spell trails and small 12-second geyser bursts use 36 fixed CSS particles across three spell sprites, inspired by the supplied TrailFX and GeyserFX3D references. They need no additional images or rendering libraries and respect ambience pause, offscreen pause, and reduced motion. Summon inside the artwork is decorative; the interactive game's mechanics are unchanged.
