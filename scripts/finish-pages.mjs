import { readFile, writeFile } from 'node:fs/promises';
const file = new URL('../dist-pages/manifest.webmanifest', import.meta.url);
const manifest = JSON.parse(await readFile(file, 'utf8'));
Object.assign(manifest, { id: './', start_url: './', scope: './' });
manifest.icons = manifest.icons.map((icon) => ({
  ...icon,
  src: '.' + icon.src,
}));
await writeFile(file, JSON.stringify(manifest, null, 2));
await writeFile(new URL('../dist-pages/.nojekyll', import.meta.url), '');
