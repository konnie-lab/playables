# Konnie Lab — The playable workshop

Static portfolio for https://konnie-lab.github.io/playables/.

The home page presents a workshop scene and a live Castle Duels demo inside a responsive phone. The player supports restart, an expanded view, keyboard Escape and automatic pause when off screen or in a hidden tab. Workshop ambience respects reduced-motion preferences.

## Files

- `index.html`, `styles.css`, `script.js`: portfolio.
- `assets/workshop.webp`: previous static workshop artwork.
- `assets/workshop-layers/`: ImageGen backgrounds, transparent sunflower/sheep/star/arrow/cube/rig/gear sprites, full-size PNG originals, optimized WebP copies and the generation prompts (`prompts.json`, `prompts-v2.json`). The website uses WebP and `background-gears.webp`, with the two front wheels removed for animated overlays. Sprite positions share the background's 1536 × 1024 coordinate system; `layoutWorkshop()` keeps them aligned when the scene is cropped on mobile. The wheels rotate inside fixed perspective transforms; arrow centers are positioned individually from the original reference.
- `castle-duels/index.html`: standalone production build from `Konnie-Lab/playables/clients/myGames/castle-duels`.
- `old_playables/`: previous portfolio and demos, preserved but not linked from the current site. This is an archive, not private storage; files remain accessible by direct URL if published.

## Refresh the playable

From `C:\JS\Konnie-Lab`, run `npm run check -- clients/myGames/castle-duels`. After checks pass, copy that project's `dist/castle-duels_default.html` to this repository's `castle-duels/index.html`. The source project enables gzip for models and quality-90 WebP compression for images, preserving the HP mask in its original format.

## Local preview

Run `node preview.mjs` and open http://127.0.0.1:4178. No install or build step is needed for the portfolio. Keep relative asset paths so GitHub Pages works under `/playables/`.
