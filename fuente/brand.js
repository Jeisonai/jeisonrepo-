// NexoLab | Soluciones Digitales — núcleo de la identidad
// Geometría del símbolo, colores y construcción de los logotipos con texto
// convertido a trazos (los SVG finales no dependen de fuentes instaladas).
const fs = require('fs');
const path = require('path');
const opentype = require('opentype.js');

const COLORS = {
  navy: '#0B1F3A',   // Azul Nexo — color principal
  blue: '#1E4A84',   // Azul Enlace — secundario
  gold: '#F2B01E',   // Dorado Lab — acento
  white: '#FFFFFF',  // Blanco
  mist: '#EEF2F7',   // Gris Niebla — fondos
  slate: '#5A6A80',  // Gris Pizarra — textos secundarios
  black: '#000000',
};

// ---------- utilidades ----------
const r2 = (x) => +x.toFixed(2);

// Polígono con esquinas redondeadas por vértice (radio 0 = esquina viva)
function roundedPath(points, radii, k = 0.5523) {
  const n = points.length;
  let d = '';
  const norm = (v) => { const l = Math.hypot(v[0], v[1]); return [v[0] / l, v[1] / l]; };
  for (let i = 0; i < n; i++) {
    const p0 = points[(i - 1 + n) % n], p1 = points[i], p2 = points[(i + 1) % n];
    const r = (radii && radii[i]) || 0;
    const cmd = i ? 'L' : 'M';
    if (!r) { d += `${cmd}${r2(p1[0])} ${r2(p1[1])}`; continue; }
    const u1 = norm([p0[0] - p1[0], p0[1] - p1[1]]);
    const u2 = norm([p2[0] - p1[0], p2[1] - p1[1]]);
    const th = Math.acos(Math.max(-1, Math.min(1, u1[0] * u2[0] + u1[1] * u2[1])));
    const t = r / Math.tan(th / 2);
    const a = [p1[0] + u1[0] * t, p1[1] + u1[1] * t];
    const b = [p1[0] + u2[0] * t, p1[1] + u2[1] * t];
    d += `${cmd}${r2(a[0])} ${r2(a[1])}`;
    d += `C${r2(a[0] + (p1[0] - a[0]) * k)} ${r2(a[1] + (p1[1] - a[1]) * k)} ${r2(b[0] + (p1[0] - b[0]) * k)} ${r2(b[1] + (p1[1] - b[1]) * k)} ${r2(b[0])} ${r2(b[1])}`;
  }
  return d + 'Z';
}

// ---------- símbolo: monograma N + L ----------
// Retícula: trazo 14, alto 60, contraforma 26, pie de la L 18 → 72 × 60 unidades.
// El vástago derecho de la N es también el vástago de la L (las dos letras
// comparten un trazo). La diagonal dorada es el "nexo" entre ambos lados.
const GRID = { stem: 14, gap: 26, foot: 18, h: 60, v: 24, r: 2.5 };

function symbolParts(g = GRID) {
  const { stem, gap, foot, h, v, r } = g;
  const x1 = stem, x2 = stem + gap, x3 = x2 + stem, x4 = x3 + foot, fy = h - stem;
  return {
    w: x4, h,
    left: roundedPath([[0, 0], [x1, 0], [x1, h], [0, h]], [r, 0, r, r]),
    right: roundedPath([[x2, 0], [x3, 0], [x3, fy], [x4, fy], [x4, h], [x2, h]], [r, r, 0, r, r, 0]),
    diag: roundedPath([[x1, 0], [x2, h - v], [x2, h], [x1, v]], [0, 0, 0, 0]),
  };
}

// fill: color de los vástagos; accent: color de la diagonal
function symbolSVG(fill, accent, transform = '') {
  const s = symbolParts();
  return `<g${transform ? ` transform="${transform}"` : ''}><path fill="${fill}" d="${s.left}"/><path fill="${fill}" d="${s.right}"/><path fill="${accent}" d="${s.diag}"/></g>`;
}

// ---------- tipografía ----------
const fontCache = {};
function font(family, weight) {
  const key = family + weight;
  if (fontCache[key]) return fontCache[key];
  const pkg = family === 'inter' ? 'inter' : 'montserrat';
  const file = path.join(__dirname, 'node_modules', '@fontsource', pkg, 'files', `${pkg}-latin-${weight}-normal.woff`);
  const b = fs.readFileSync(file);
  return (fontCache[key] = opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.length)));
}

function textPath(str, f, size, x, y, letterSpacing = 0) {
  const p = f.getPath(str, x, y, size, { kerning: true, letterSpacing });
  const bb = p.getBoundingBox();
  const adv = f.getAdvanceWidth(str, size, { kerning: true, letterSpacing });
  return { d: p.toPathData(2), bb, adv };
}

// Palabra "NexoLab": "Nexo" ExtraBold 800 + "Lab" Medium 500, tracking -0.01em.
function wordmark(size, x, y) {
  const fNexo = font('montserrat', 800), fLab = font('montserrat', 500);
  const ls = -0.01;
  const nexo = textPath('Nexo', fNexo, size, x, y, ls);
  const lab = textPath('Lab', fLab, size, x + nexo.adv + size * 0.012, y, ls);
  const x0 = nexo.bb.x1, x1 = lab.bb.x2;
  return { d: nexo.d + lab.d, x0, x1, width: x1 - x0, capTop: y - size * 0.7, top: Math.min(nexo.bb.y1, lab.bb.y1), bottom: Math.max(nexo.bb.y2, lab.bb.y2) };
}

// Descriptor "SOLUCIONES DIGITALES" justificado al ancho indicado.
function descriptor(size, x, y, targetWidth, weight = 600) {
  const f = font('montserrat', weight);
  const str = 'SOLUCIONES DIGITALES';
  const probe = textPath(str, f, size, 0, 0, 0);
  const inkW = probe.bb.x2 - probe.bb.x1;
  const ls = (targetWidth - inkW) / (str.length - 1) / size; // em
  const t = textPath(str, f, size, x - probe.bb.x1, y, ls);
  return { d: t.d, ls };
}

// ---------- construcciones del logotipo ----------
// Proporciones (unidades del símbolo, alto = 60):
//   palabra: altura de mayúscula 38.5 → cuerpo 55; descriptor: cuerpo 11.6
//   separación símbolo–palabra: 21 (1.5 × trazo)
function horizontal({ fg, accent, sub, bg = null, pad = 0 }) {
  const S = symbolParts();
  const gapX = 21, size = 55;
  const wx = S.w + gapX;
  const capH = size * 0.7;
  const wm = wordmark(size, 0, 0);
  const shift = wx - wm.x0; // alinear el borde de tinta con wx
  const wm2 = wordmark(size, shift, capH);
  const dsize = 11.6;
  const ds = descriptor(dsize, wx, S.h, wm2.x1 - wx);
  const top = Math.min(0, wm2.top);
  const W = wm2.x1, H = S.h - top;
  const vb = [-pad, top - pad, W + pad * 2, H + pad * 2];
  return svgDoc(vb, `${bg ? `<rect x="${vb[0]}" y="${vb[1]}" width="${vb[2]}" height="${vb[3]}" fill="${bg}"/>` : ''}${symbolSVG(fg, accent)}<path fill="${fg}" d="${wm2.d}"/><path fill="${sub}" d="${ds.d}"/>`);
}

// Horizontal simplificado (sin descriptor) para tamaños pequeños
function horizontalSimple({ fg, accent, bg = null, pad = 0 }) {
  const S = symbolParts();
  const gapX = 19, size = 54, capH = size * 0.7;
  const wm0 = wordmark(size, 0, 0);
  const wx = S.w + gapX;
  const wm = wordmark(size, wx - wm0.x0, (S.h - capH) / 2 + capH);
  const W = wm.x1, H = S.h;
  const vb = [-pad, -pad, W + pad * 2, H + pad * 2];
  return svgDoc(vb, `${bg ? `<rect x="${vb[0]}" y="${vb[1]}" width="${vb[2]}" height="${vb[3]}" fill="${bg}"/>` : ''}${symbolSVG(fg, accent)}<path fill="${fg}" d="${wm.d}"/>`);
}

function vertical({ fg, accent, sub, bg = null, pad = 0 }) {
  const S = symbolParts();
  const size = 46, capH = size * 0.7;
  const probe = wordmark(size, 0, 0);
  const W = probe.width;
  const sx = (W - S.w) / 2;
  const wy = S.h + 22 + capH;
  const wm = wordmark(size, -probe.x0, wy);
  const dy = wy + 22;
  const ds = descriptor(9.8, 0, dy, W);
  const H = dy;
  const vb = [-pad, -pad, W + pad * 2, H + pad * 2];
  return svgDoc(vb, `${bg ? `<rect x="${vb[0]}" y="${vb[1]}" width="${vb[2]}" height="${vb[3]}" fill="${bg}"/>` : ''}${symbolSVG(fg, accent, `translate(${r2(sx)} 0)`)}<path fill="${fg}" d="${wm.d}"/><path fill="${sub}" d="${ds.d}"/>`);
}

// Compacto: símbolo dentro de un contenedor (perfil, ícono de app, favicon)
function compact({ box, fg, accent, shape = 'rounded', size = 120 }) {
  const S = symbolParts();
  const scale = (size * 0.56) / S.w;
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
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${w} ${h}" width="${w * 4}" height="${h * 4}">${body}</svg>\n`;
}

module.exports = { COLORS, GRID, roundedPath, symbolParts, symbolSVG, horizontal, horizontalSimple, vertical, compact, symbolOnly, wordmark, descriptor, font, textPath };
