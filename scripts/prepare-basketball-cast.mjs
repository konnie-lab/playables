import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const root = new URL('../assets/basketball-workshop/', import.meta.url);
// Active captain replacement; keep the earlier sheet extraction reproducible below.
await sharp(fileURLToPath(new URL('captain-balanced.png', root)))
  .trim({ threshold: 10 })
  .resize({ height: 600 })
  .webp({ quality: 88, alphaQuality: 100, effort: 6 })
  .toFile(fileURLToPath(new URL('captain-balanced.webp', root)));
const source = fileURLToPath(new URL('conveyor-cast.png', root));
const { data, info } = await sharp(source).raw().toBuffer({ resolveWithObject: true });
// The captain's pointing hand extends into the upper gutter. Below it, the
// coach's chair extends left. This stepped cut follows empty alpha between them.
const islands = [
  ['belt-captain', (x, y) => x < (y < 400 ? 600 : 520)],
  ['belt-coach', (x, y) => x >= (y < 400 ? 600 : 520) && x < 1040],
  ['belt-hoop', x => x >= 1040],
];
for (const [name, keep] of islands) {
  const pixels = Buffer.from(data);
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      if (!keep(x, y)) pixels[(y * info.width + x) * 4 + 3] = 0;
    }
  }
  await sharp(pixels, { raw: info })
    .trim({ threshold: 10 })
    .resize({ height: 600, withoutEnlargement: true })
    .webp({ quality: 88, alphaQuality: 100, effort: 6 })
    .toFile(fileURLToPath(new URL(`${name}.webp`, root)));
}
