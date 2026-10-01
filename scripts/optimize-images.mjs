// Gera as versões web (WebP) a partir dos PNGs originais em design/source/images.
// Os PNGs continuam sendo as fontes; rode `npm run images` sempre que um deles mudar.
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const SRC = 'design/source/images';
const OUT = 'src/assets/room';
const LAYERS = ['03-floor', '04-architecture', '05-rug', '06-sofa', '07-table', '08-ceiling'];

const webp = { quality: 80, alphaQuality: 90, effort: 6, smartSubsample: true };

await mkdir(OUT, { recursive: true });

async function write(input, file, pipeline = (img) => img) {
  const info = await pipeline(sharp(input)).webp(webp).toFile(path.join(OUT, file));
  console.log(`${file.padEnd(32)} ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`);
}

// Sala montada: abertura do hero, #approach e alternativa estática.
await write(`${SRC}/01-room-assembled.png`, 'room-assembled-1254.webp');
await write(`${SRC}/01-room-assembled.png`, 'room-assembled-720.webp', (img) => img.resize(720));

// Seis camadas do hero (carregadas só no desktop com movimento).
for (const id of LAYERS) {
  await write(`${SRC}/${id}.png`, `layer-${id.slice(3)}.webp`);
}

// Detalhe discreto da sala para o bloco de orçamento.
await write(`${SRC}/07-table.png`, 'detail-table.webp', (img) => img.trim({ threshold: 10 }).resize(640));

// Provisória para #about até chegar a foto real da equipe: recorte do interior da sala montada.
await write(`${SRC}/01-room-assembled.png`, 'about-placeholder.webp', (img) =>
  img.extract({ left: 150, top: 330, width: 900, height: 675 }).flatten({ background: '#0A2C5C' }).resize(900),
);
