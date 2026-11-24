// Construye todos los entregables: node build.js
const fs = require('fs');
const path = require('path');
const R = require('./render');
const B = require('./brand');
const C = B.COLORS;
const ROOT = path.join(__dirname, '..');
const dir = (d, clean = false) => {
  const p = path.join(ROOT, d);
  if (clean) fs.rmSync(p, { recursive: true, force: true });
  fs.mkdirSync(p, { recursive: true });
  return p;
};

(async () => {
  // 1 · Logotipos SVG
  const svgs = require('./build-logos');

  // 2 · Logotipos PNG (fondo transparente)
  const pngDir = dir('01-logotipo/png', true);
  const widthFor = (n) => n.includes('horizontal') ? 2400 : n.includes('vertical') ? 1600 : 1024;
  for (const [name, svg] of Object.entries(svgs)) {
    const [, , w, h] = svg.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number);
    const W = widthFor(name), H = Math.round(W * h / w);
    const inner = svg.replace(/ width="[\d.]+" height="[\d.]+"/, ` width="${W}" height="${H}"`);
    await R.pngFromHTML(`<html><body style="margin:0;background:transparent">${inner}</body></html>`,
      path.join(pngDir, name.replace('.svg', '.png')), { width: W, height: H, transparent: true });
  }
  console.log('PNG logotipos: listo');

  // 3 · Redes: foto de perfil (Facebook la recorta en círculo)
  const redes = dir('04-redes-sociales', true);
  const perfil = B.compact({ box: C.navy, fg: C.white, accent: C.gold, shape: 'square', size: 1080 })
    .replace(/ width="[\d.]+" height="[\d.]+"/, ' width="1080" height="1080"');
  await R.pngFromHTML(`<html><body style="margin:0">${perfil}</body></html>`, path.join(redes, 'Tareita-foto-perfil-1080.png'), { width: 1080, height: 1080 });
  console.log('Foto de perfil: listo');

  // 4 · Publicidad Marketplace: vertical (principal) y cuadrada
  const ad = require('./anuncio');
  const pub = dir('03-publicidad-marketplace', true);
  for (const [fmt, { w, h }] of Object.entries(ad.FORMATS)) {
    const file = path.join(__dirname, `anuncio-marketplace-${fmt}.html`);
    fs.writeFileSync(file, ad.html(fmt, '.'));
    const tag = fmt === 'vertical' ? `vertical-${w}x${h}` : `cuadrado-${w}x${h}`;
    await R.png(file, path.join(pub, `Tareita-marketplace-${tag}.png`), { width: w, height: h, scale: 1 });
    await R.png(file, path.join(pub, `Tareita-marketplace-${tag}@2x.png`), { width: w, height: h, scale: 2 });
  }
  console.log('Publicidad: listo');

  // 5 · Manual de marca (PDF)
  const man = require('./manual');
  const manHtml = path.join(__dirname, 'manual-de-marca.html');
  fs.writeFileSync(manHtml, man.html('.'));
  await R.pdf(manHtml, path.join(dir('02-manual-de-marca', true), 'Tareita-manual-de-marca.pdf'), { width: 1600, height: 900 });
  console.log('Manual PDF: listo');

  await R.close();
})().catch(async (e) => { console.error(e); await R.close(); process.exit(1); });
