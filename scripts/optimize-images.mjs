import sharp from 'sharp';
import { stat, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = new URL('../assets/', import.meta.url);
// Regenerate from full-quality PNGs, never from an already compressed WebP.
// Sprites retain approximately 2x their maximum displayed size.
const assets = [
  ['castle-workshop/background', 1536, 84],
  ['basketball-workshop/background-gold', 1536, 84],
  ['castle-workshop/mage-orange', 512, 84],
  ['castle-workshop/mage-blue', 512, 84],
  ['castle-workshop/bear', 512, 84],
  ['castle-workshop/bear-rider', 256, 86],
  ['castle-workshop/mage-upgraded', 224, 86],
  ['castle-workshop/spell', 256, 84],
  ['workshop-layers/gear', 192, 86],
  ['workshop-layers/arrow', 144, 86],
  ['castle-workshop/summon', 224, 86, 'jpg'],
];

let beforeTotal = 0;
let afterTotal = 0;
for (const [name, width, quality, extension = 'png'] of assets) {
  const source = fileURLToPath(new URL(`${name}.${extension}`, root));
  const destination = new URL(`${name}.webp`, root);
  const before = await stat(destination).then(s => s.size).catch(error => {
    if (error.code === 'ENOENT') return 0;
    throw error;
  });
  const encoded = await sharp(source)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality, alphaQuality: 100, effort: 6 })
    .toBuffer();
  await writeFile(destination, encoded);
  beforeTotal += before;
  afterTotal += encoded.length;
  console.log(`${name}: ${before} -> ${encoded.length} bytes`);
}
console.log(`Total: ${beforeTotal} -> ${afterTotal} bytes`);
