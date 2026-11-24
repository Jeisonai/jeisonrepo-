// Tareita | Soluciones Digitales — núcleo de la identidad
// Geometría del símbolo, colores y construcción de los logotipos con texto
// convertido a trazos (los SVG finales no dependen de fuentes instaladas).
const fs = require('fs');
const path = require('path');
const opentype = require('opentype.js');

// Paleta inspirada en los útiles de una tarea: tinta, lápiz, cuaderno, papel y grafito.
const COLORS = {
  navy: '#0B1F3A',   // Azul Tinta — color principal
  blue: '#1E4A84',   // Azul Cuaderno — secundario
  gold: '#F2B01E',   // Amarillo Lápiz — acento
  white: '#FFFFFF',  // Blanco
  mist: '#EEF2F7',   // Gris Papel — fondos
  slate: '#5A6A80',  // Gris Grafito — textos secundarios
  black: '#000000',
};
const NAMES = {
  navy: 'Azul Tinta', blue: 'Azul Cuaderno', gold: 'Amarillo Lápiz',
  white: 'Blanco', mist: 'Gris Papel', slate: 'Gris Grafito',
};

const r2 = (x) => +x.toFixed(2);

// ---------- símbolo: la "t" que se convierte en ✓ ----------
// Retícula de 80 × 80 con trazo w = 16 y terminaciones redondas.
//   · Asta de la t:   (20, 8) → (20, 72)
//   · Travesaño:      (8, 26) → (38, 26)   brazo izquierdo corto, como una t minúscula
//   · Cola / ✓:       (20, 72) → (72, 20), exactamente a 45°
// La cola de la t sube como el trazo largo de un visto bueno: tarea hecha.
const GRID = { w: 16, size: 80, stem: [[20, 8], [20, 72]], bar: [[8, 26], [38, 26]], check: [[20, 72], [72, 20]] };

// Cápsula (trazo con extremos redondos) como figura rellena
function capsule([x1, y1], [x2, y2], r) {
  const l = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / l, uy = (y2 - y1) / l;
  const nx = -uy * r, ny = ux * r;
  return `M${r2(x1 + nx)} ${r2(y1 + ny)}L${r2(x2 + nx)} ${r2(y2 + ny)}A${r} ${r} 0 0 0 ${r2(x2 - nx)} ${r2(y2 - ny)}L${r2(x1 - nx)} ${r2(y1 - ny)}A${r} ${r} 0 0 0 ${r2(x1 + nx)} ${r2(y1 + ny)}Z`;
}

function symbolParts(g = GRID) {
  const r = g.w / 2;
  return { w: g.size, h: g.size, stem: capsule(...g.stem, r), bar: capsule(...g.bar, r), check: capsule(...g.check, r) };
}

// fg: color de la t; accent: color del ✓
function symbolSVG(fg, accent, transform = '') {
  const s = symbolParts();
  return `<g${transform ? ` transform="${transform}"` : ''}><path fill="${accent}" d="${s.check}"/><path fill="${fg}" d="${s.stem}"/><path fill="${fg}" d="${s.bar}"/></g>`;
}

// ---------- tipografía ----------
const fontCache = {};
function font(family, weight) {
  const key = family + weight;
  if (fontCache[key]) return fontCache[key];
  const file = path.join(__dirname, 'node_modules', '@fontsource', family, 'files', `${family}-latin-${weight}-normal.woff`);
  const b = fs.readFileSync(file);
  return (fontCache[key] = opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.length)));
}

function textPath(str, f, size, x, y, letterSpacing = 0) {
  const p = f.getPath(str, x, y, size, { kerning: true, letterSpacing });
  return { d: p.toPathData(2), bb: p.getBoundingBox() };
}

// Separa un glifo en contornos (para colorear el punto de la i)
function contours(p) {
  const out = []; let cur = [];
  for (const c of p.commands) { if (c.type === 'M' && cur.length) { out.push(cur); cur = []; } cur.push(c); }
  if (cur.length) out.push(cur);
  return out;
}
const cmdsToD = (cmds) => cmds.map((c) => c.type === 'M' || c.type === 'L' ? `${c.type}${r2(c.x)} ${r2(c.y)}`
  : c.type === 'Q' ? `Q${r2(c.x1)} ${r2(c.y1)} ${r2(c.x)} ${r2(c.y)}`
    : c.type === 'C' ? `C${r2(c.x1)} ${r2(c.y1)} ${r2(c.x2)} ${r2(c.y2)} ${r2(c.x)} ${r2(c.y)}` : 'Z').join('');

// Palabra "tareita": Poppins Bold 700 en minúsculas, tracking -0.02em.
// El punto de la i va en Amarillo Lápiz (en las versiones a una tinta, del mismo color).
const WORD = 'tareita';
function wordmark(size, x, y) {
  const f = font('poppins', 700);
  const paths = f.getPaths(WORD, x, y, size, { kerning: true, letterSpacing: -0.02 });
  let body = '', dot = '';
  paths.forEach((p, i) => {
    if (WORD[i] !== 'i') { body += p.toPathData(2); return; }
    const cs = contours(p);
    const top = (cs2) => Math.min(...cs2.filter((c) => c.y !== undefined).map((c) => c.y));
    const di = cs.reduce((best, c, k) => (top(c) < top(cs[best]) ? k : best), 0);
    cs.forEach((c, k) => { if (k === di) dot += cmdsToD(c); else body += cmdsToD(c); });
  });
  const bbs = paths.map((p) => p.getBoundingBox());
  const x0 = Math.min(...bbs.map((b) => b.x1)), x1 = Math.max(...bbs.map((b) => b.x2));
  const top = Math.min(...bbs.map((b) => b.y1)), bottom = Math.max(...bbs.map((b) => b.y2));
  return { body, dot, x0, x1, width: x1 - x0, top, bottom };
}
const wmPaths = (wm, fg, dotColor) => `<path fill="${fg}" d="${wm.body}"/><path fill="${dotColor}" d="${wm.dot}"/>`;

// Descriptor "SOLUCIONES DIGITALES" justificado al ancho indicado.
function descriptor(size, x, y, targetWidth, weight = 600) {
  const f = font('poppins', weight);
  const str = 'SOLUCIONES DIGITALES';
  const probe = textPath(str, f, size, 0, 0, 0);
  const inkW = probe.bb.x2 - probe.bb.x1;
  const ls = (targetWidth - inkW) / (str.length - 1) / size; // em
  const t = textPath(str, f, size, x - probe.bb.x1, y, ls);
  return { d: t.d, ls };
}

// Proporciones de la palabra respecto a su cuerpo (tinta sobre la línea base)
function wmRatios() {
  const p = wordmark(100, 0, 0);
  return { top: -p.top / 100, x0: p.x0 / 100, width: p.width / 100 };
}

// ---------- construcciones del logotipo ----------
const bgRect = (bg, vb) => bg ? `<rect x="${vb[0]}" y="${vb[1]}" width="${vb[2]}" height="${vb[3]}" fill="${bg}"/>` : '';

// Horizontal: símbolo (80) + palabra + descriptor alineado al pie del símbolo
function horizontal({ fg, accent, sub, dot = accent, bg = null, pad = 0 }) {
  const S = symbolParts(), R = wmRatios();
  const gapX = 22, dsize = 12.4, dcap = dsize * 0.705, gapY = 13;
  const base = S.h - dcap - gapY;           // línea base de la palabra
  const size = base / R.top;                // la tinta superior toca el borde del símbolo
  const wx = S.w + gapX;
  const wm = wordmark(size, wx - R.x0 * size, base);
  const ds = descriptor(dsize, wx, S.h, wm.x1 - wx);
  const W = wm.x1, H = S.h;
  const vb = [-pad, -pad, W + pad * 2, H + pad * 2];
  return svgDoc(vb, `${bgRect(bg, vb)}${symbolSVG(fg, accent)}${wmPaths(wm, fg, dot)}<path fill="${sub}" d="${ds.d}"/>`);
}

// Horizontal simplificado (sin descriptor) para tamaños pequeños
function horizontalSimple({ fg, accent, dot = accent, bg = null, pad = 0 }) {
  const S = symbolParts(), R = wmRatios();
  const gapX = 20, inkH = S.h * 0.8;
  const size = inkH / R.top;
  const base = (S.h + inkH) / 2;
  const wx = S.w + gapX;
  const wm = wordmark(size, wx - R.x0 * size, base);
  const W = wm.x1, H = S.h;
  const vb = [-pad, -pad, W + pad * 2, H + pad * 2];
  return svgDoc(vb, `${bgRect(bg, vb)}${symbolSVG(fg, accent)}${wmPaths(wm, fg, dot)}`);
}

// Vertical: símbolo centrado sobre la palabra y el descriptor
function vertical({ fg, accent, sub, dot = accent, bg = null, pad = 0 }) {
  const S = symbolParts(), R = wmRatios();
  const size = 62;
  const W = R.width * size;
  const sx = (W - S.w) / 2;
  const base = S.h + 24 + R.top * size;
  const wm = wordmark(size, -R.x0 * size, base);
  const dsize = 10.4, dy = base + 22 + dsize * 0.705;
  const ds = descriptor(dsize, 0, dy, W);
  const H = dy;
  const vb = [-pad, -pad, W + pad * 2, H + pad * 2];
  return svgDoc(vb, `${bgRect(bg, vb)}${symbolSVG(fg, accent, `translate(${r2(sx)} 0)`)}${wmPaths(wm, fg, dot)}<path fill="${sub}" d="${ds.d}"/>`);
}

// Compacto: símbolo dentro de un contenedor (perfil, ícono de app, favicon)
function compact({ box, fg, accent, shape = 'rounded', size = 120 }) {
  const S = symbolParts();
  const scale = (size * 0.54) / S.w;
  const tx = (size - S.w * scale) / 2, ty = (size - S.h * scale) / 2;
  const container = shape === 'circle'
    ? `<circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="${box}"/>`
    : shape === 'square'
      ? `<rect width="${size}" height="${size}" fill="${box}"/>`
      : `<rect width="${size}" height="${size}" rx="${size * 0.22}" fill="${box}"/>`;
  return svgDoc([0, 0, size, size], `${container}${symbolSVG(fg, accent, `translate(${r2(tx)} ${r2(ty)}) scale(${r2(scale * 1000) / 1000})`)}`, 0);
}

function symbolOnly({ fg, accent, pad = 0 }) {
  const S = symbolParts();
  return svgDoc([-pad, -pad, S.w + pad * 2, S.h + pad * 2], symbolSVG(fg, accent));
}

function svgDoc(vb, body, bleed = 0.6) {
  const [x, y, w, h] = [vb[0] - bleed, vb[1] - bleed, vb[2] + bleed * 2, vb[3] + bleed * 2].map(r2);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${w} ${h}" width="${r2(w * 4)}" height="${r2(h * 4)}">${body}</svg>\n`;
}

module.exports = { COLORS, NAMES, GRID, capsule, symbolParts, symbolSVG, horizontal, horizontalSimple, vertical, compact, symbolOnly, wordmark, descriptor, font, textPath };
