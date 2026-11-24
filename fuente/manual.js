// Manual de identidad visual (páginas 1600 × 900 → PDF).
const fs = require('fs');
const path = require('path');
const B = require('./brand');
const { categorias: I, beneficios: BI } = require('./iconos');
const C = B.COLORS;

const fontFaces = (rel) => [
  ['Montserrat', 'montserrat', [400, 500, 600, 700, 800]],
  ['Inter', 'inter', [400, 500, 600, 700]],
].map(([fam, pkg, ws]) => ws.map((w) =>
  `@font-face{font-family:'${fam}';font-weight:${w};font-display:block;src:url('${rel}/node_modules/@fontsource/${pkg}/files/${pkg}-latin-${w}-normal.woff2') format('woff2')}`
).join('\n')).join('\n');

const strip = (svg) => svg.replace(/ width="[\d.]+" height="[\d.]+"/, '');
const L = {
  hColor: strip(B.horizontal({ fg: C.navy, accent: C.gold, sub: C.slate })),
  hNeg: strip(B.horizontal({ fg: C.white, accent: C.gold, sub: '#AFC0D6' })),
  hNavy: strip(B.horizontal({ fg: C.navy, accent: C.navy, sub: C.navy })),
  hWhite: strip(B.horizontal({ fg: C.white, accent: C.white, sub: C.white })),
  hBlack: strip(B.horizontal({ fg: C.black, accent: C.black, sub: C.black })),
  sColor: strip(B.horizontalSimple({ fg: C.navy, accent: C.gold })),
  vColor: strip(B.vertical({ fg: C.navy, accent: C.gold, sub: C.slate })),
  cBox: strip(B.compact({ box: C.navy, fg: C.white, accent: C.gold })),
  cCircle: strip(B.compact({ box: C.navy, fg: C.white, accent: C.gold, shape: 'circle' })),
  symColor: strip(B.symbolOnly({ fg: C.navy, accent: C.gold })),
  symNeg: strip(B.symbolOnly({ fg: C.white, accent: C.gold })),
};

// ---------- conversión de color ----------
const hexRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
function cmyk(h) {
  const [r, g, b] = hexRgb(h).map((v) => v / 255);
  const k = 1 - Math.max(r, g, b);
  if (k === 1) return [0, 0, 0, 100];
  return [(1 - r - k) / (1 - k), (1 - g - k) / (1 - k), (1 - b - k) / (1 - k), k].map((v) => Math.round(v * 100));
}

// ---------- diagrama de construcción ----------
const r = (v) => +v.toFixed(2);
function construction() {
  const s = B.symbolParts();
  const k = 5.2, ox = 120, oy = 70; // escala y origen
  const X = (v) => ox + v * k, Y = (v) => oy + v * k;
  const g = B.GRID;
  const xs = [0, g.stem, g.stem + g.gap, g.stem * 2 + g.gap, s.w];
  const ys = [0, g.v, g.h - g.v, g.h - g.stem, g.h];
  const guide = '#C9D2DE';
  let lines = '';
  xs.forEach((x) => { lines += `<line x1="${X(x)}" y1="${oy - 26}" x2="${X(x)}" y2="${Y(g.h) + 26}" stroke="${guide}" stroke-width="1" stroke-dasharray="4 4"/>`; });
  ys.forEach((y) => { lines += `<line x1="${ox - 26}" y1="${Y(y)}" x2="${X(s.w) + 26}" y2="${Y(y)}" stroke="${guide}" stroke-width="1" stroke-dasharray="4 4"/>`; });
  const dim = (x1, x2, y, label) => `<line x1="${X(x1)}" y1="${y}" x2="${X(x2)}" y2="${y}" stroke="${C.slate}" stroke-width="1.2"/><line x1="${X(x1)}" y1="${y - 6}" x2="${X(x1)}" y2="${y + 6}" stroke="${C.slate}" stroke-width="1.2"/><line x1="${X(x2)}" y1="${y - 6}" x2="${X(x2)}" y2="${y + 6}" stroke="${C.slate}" stroke-width="1.2"/><text x="${(X(x1) + X(x2)) / 2}" y="${y - 10}" text-anchor="middle">${label}</text>`;
  const dimV = (y1, y2, x, label) => `<line x1="${x}" y1="${Y(y1)}" x2="${x}" y2="${Y(y2)}" stroke="${C.slate}" stroke-width="1.2"/><line x1="${x - 6}" y1="${Y(y1)}" x2="${x + 6}" y2="${Y(y1)}" stroke="${C.slate}" stroke-width="1.2"/><line x1="${x - 6}" y1="${Y(y2)}" x2="${x + 6}" y2="${Y(y2)}" stroke="${C.slate}" stroke-width="1.2"/><text x="${x - 12}" y="${(Y(y1) + Y(y2)) / 2 + 5}" text-anchor="end">${label}</text>`;
  const ang = Math.round(Math.atan((g.h - g.v) / g.gap) * 180 / Math.PI);
  return `<svg viewBox="0 0 640 520" class="constr" font-family="Inter" font-size="15" fill="${C.slate}">
  ${lines}
  <g transform="translate(${ox} ${oy}) scale(${k})"><path fill="${C.navy}" d="${s.left}"/><path fill="${C.navy}" d="${s.right}"/><path fill="${C.gold}" d="${s.diag}"/></g>
  ${dim(0, g.stem, Y(g.h) + 52, 'x')}
  ${dim(g.stem, g.stem + g.gap, Y(g.h) + 52, '1.86x')}
  ${dim(g.stem + g.gap, g.stem * 2 + g.gap, Y(g.h) + 52, 'x')}
  ${dim(g.stem * 2 + g.gap, s.w, Y(g.h) + 52, '1.29x')}
  ${dimV(0, g.h, ox - 44, '4.29x')}
  ${(() => { const cx = X(g.stem), cy = Y(0), R = 58, a = ang * Math.PI / 180; return `<path d="M${cx + R} ${cy} A ${R} ${R} 0 0 1 ${r(cx + R * Math.cos(a))} ${r(cy + R * Math.sin(a))}" fill="none" stroke="${C.slate}" stroke-width="1.2"/><text x="${r(cx + (R + 16) * Math.cos(a / 2))}" y="${r(cy + (R + 16) * Math.sin(a / 2) + 5)}">${ang}°</text>`; })()}
  <text x="${ox}" y="${Y(g.h) + 96}">x = ancho del trazo vertical · retícula 72 × 60</text>
</svg>`;
}

function nl() {
  const s = B.symbolParts();
  const one = (lit, op) => `<svg viewBox="-4 -4 80 68"><path fill="${C.navy}" opacity="${lit.includes('l') ? 1 : op}" d="${s.left}"/><path fill="${C.navy}" opacity="${lit.includes('r') ? 1 : op}" d="${s.right}"/><path fill="${lit.includes('d') ? C.gold : C.navy}" opacity="${lit.includes('d') ? 1 : op}" d="${s.diag}"/></svg>`;
  const g = B.GRID, x2 = g.stem + g.gap;
  const stemN = B.roundedPath([[x2, 0], [x2 + g.stem, 0], [x2 + g.stem, g.h], [x2, g.h]], [g.r, g.r, g.r, 0]);
  return { n: one('ld', 1).replace(`d="${s.right}"`, `d="${stemN}"`), l: `<svg viewBox="-4 -4 80 68"><path fill="${C.navy}" d="${s.right}"/></svg>`, all: one('lrd', 1) };
}

// ---------- páginas ----------
const pages = [];
const page = (cls, body, n) => pages.push({ cls, body, n });
const head = (num, title, kicker) => `<header class="ph"><span class="num">${num}</span><div><p class="kick">${kicker}</p><h2>${title}</h2></div></header>`;

// 1 · Portada
page('cover', `
  <div class="band"></div>
  <div class="cover-logo">${L.hNeg}</div>
  <div class="cover-foot">
    <p class="t">Manual de identidad visual</p>
    <p class="m">Versión 1.0 · Noviembre 2026</p>
  </div>
  <p class="cover-slogan">Conectamos tus ideas con soluciones.</p>`);

// 2 · La marca
page('', `${head('01', 'La marca', 'Quiénes somos')}
  <div class="cols c2">
    <div>
      <p class="lead">NexoLab ofrece servicios académicos, tecnológicos y digitales, brindando asesoría, acompañamiento y soluciones personalizadas a estudiantes, profesionales y pequeños negocios.</p>
      <div class="facts">
        <div><span>Nombre</span><b>NexoLab</b></div>
        <div><span>Descriptor</span><b>Soluciones Digitales</b></div>
        <div><span>Eslogan</span><b>Conectamos tus ideas con soluciones.</b></div>
        <div><span>Modalidad</span><b>100 % en línea</b></div>
        <div><span>Público</span><b>Estudiantes de bachillerato y universidad, profesionales, emprendedores y pequeños negocios.</b></div>
      </div>
    </div>
    <div>
      <h4>Personalidad</h4>
      <div class="traits">
        ${[['Moderna', 'Lenguaje visual actual, sin adornos.'], ['Tecnológica', 'Geometría precisa, construida sobre retícula.'], ['Minimalista', 'Pocos elementos, cada uno con función.'], ['Comercial', 'Mensajes claros: qué hacemos y cuánto cuesta.'], ['Profesional', 'Consistencia en color, tipografía y espacios.'], ['Cercana', 'Tuteo, esquinas suaves, explicaciones simples.']].map(([t, d]) => `<div><b>${t}</b><span>${d}</span></div>`).join('')}
      </div>
      <h4 style="margin-top:34px">Tono de comunicación</h4>
      <div class="tone">
        <div class="yes"><p class="lbl">Así hablamos</p><p>“Te ayudamos a organizar tu inventario en Excel.”</p><p>“Cuéntanos tu proyecto y te enviamos una cotización.”</p></div>
        <div class="no"><p class="lbl">Así no</p><p>“Revolucionamos el futuro de tu negocio.”</p><p>“¡¡¡La mejor oferta del universo!!!”</p></div>
      </div>
    </div>
  </div>`);

// 3 · Símbolo
const parts = nl();
page('', `${head('02', 'El símbolo', 'Concepto y construcción')}
  <div class="cols c2 sym">
    <div>
      <div class="eq">
        <figure>${parts.n}<figcaption>N de Nexo</figcaption></figure><span>+</span>
        <figure>${parts.l}<figcaption>L de Lab</figcaption></figure><span>=</span>
        <figure>${parts.all}<figcaption>NexoLab</figcaption></figure>
      </div>
      <p class="body">El monograma une la <b>N</b> de Nexo y la <b>L</b> de Lab en una sola pieza: el trazo derecho de la N es, al mismo tiempo, el trazo vertical de la L. Las dos palabras comparten un elemento, como un proyecto comparte la idea del cliente y la solución del equipo.</p>
      <p class="body">La <b>diagonal dorada</b> es el nexo: une el lado de la idea (izquierda) con el lado de la solución (derecha). Es el único elemento en color de acento y resume el eslogan: <i>Conectamos tus ideas con soluciones</i>.</p>
      <p class="body muted">Construcción geométrica sobre una retícula modular. Esquinas exteriores con radio suave (0.18x) para una lectura cercana; uniones internas en arista viva para mantener precisión técnica.</p>
    </div>
    <div class="constr-wrap">${construction()}</div>
  </div>`);

// 4 · Versiones
page('', `${head('03', 'Versiones del logotipo', 'Arquitectura')}
  <div class="versions">
    <div class="v big"><div class="art">${L.hColor}</div><p><b>Horizontal · principal</b>Uso preferente: encabezados, documentos, publicidad, firma de correo.</p></div>
    <div class="v"><div class="art">${L.vColor}</div><p><b>Vertical</b>Formatos cuadrados o verticales, portadas y piezas centradas.</p></div>
    <div class="v"><div class="art">${L.sColor}</div><p><b>Simplificada</b>Sin descriptor, para tamaños pequeños (menos de 180 px de ancho).</p></div>
    <div class="v"><div class="art row">${L.cBox}${L.cCircle}</div><p><b>Compacta</b>Foto de perfil, ícono de aplicación, favicon y marcas de agua.</p></div>
  </div>`);

// 5 · Color
page('', `${head('04', 'Versiones de color', 'Positivo, negativo y una tinta')}
  <div class="colorv">
    <div style="background:#fff;border:1px solid #DCE3EC"><div class="art">${L.hColor}</div><p>Positivo a color</p></div>
    <div style="background:${C.navy}"><div class="art">${L.hNeg}</div><p class="w">Negativo a color</p></div>
    <div style="background:${C.mist}"><div class="art">${L.hNavy}</div><p>Una tinta · Azul Nexo</p></div>
    <div style="background:${C.blue}"><div class="art">${L.hWhite}</div><p class="w">Una tinta · Blanco</p></div>
    <div style="background:${C.gold}"><div class="art">${L.hNavy}</div><p>Una tinta sobre Dorado Lab</p></div>
    <div style="background:#fff;border:1px solid #DCE3EC"><div class="art">${L.hBlack}</div><p>Una tinta · Negro (fotocopias, sellos)</p></div>
  </div>`);

// 6 · Protección y tamaño mínimo
const clr = () => {
  const xs = 14; // x en unidades del símbolo
  const pad = xs * 2;
  const svgH = B.horizontal({ fg: C.navy, accent: C.gold, sub: C.slate });
  const vb = svgH.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number);
  const W = vb[2], H = vb[3];
  const body = svgH.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
  const sq = (x, y) => `<rect x="${x}" y="${y}" width="${xs}" height="${xs}" fill="${C.gold}" opacity=".35"/>`;
  return `<svg viewBox="${-pad - 4} ${-pad - 4} ${W + pad * 2 + 8} ${H + pad * 2 + 8}" class="clear">
    <rect x="${-pad}" y="${-pad}" width="${W + pad * 2}" height="${H + pad * 2}" fill="none" stroke="${C.slate}" stroke-width=".6" stroke-dasharray="3 3"/>
    <rect x="0" y="0" width="${W}" height="${H}" fill="none" stroke="#C9D2DE" stroke-width=".5"/>
    ${sq(-pad, 0)}${sq(-xs, 0)}${sq(W + xs, 0)}${sq(W, 0)}${sq(0, -pad)}${sq(0, -xs)}${sq(0, H)}${sq(0, H + xs)}
    ${body}</svg>`;
};
page('', `${head('05', 'Área de protección y tamaño mínimo', 'Reglas de uso')}
  <div class="cols c2">
    <div>
      <div class="clear-wrap">${clr()}</div>
      <p class="body">Alrededor del logotipo se reserva un espacio libre de <b>2x</b>, donde <b>x</b> es el ancho del trazo vertical del símbolo. Ningún texto, borde o imagen debe invadir esta zona.</p>
    </div>
    <div>
      <h4>Tamaños mínimos</h4>
      <div class="mins">
        <div><div class="art" style="width:180px">${L.hColor}</div><p><b>Horizontal</b>180 px · 45 mm</p></div>
        <div><div class="art" style="width:100px">${L.sColor}</div><p><b>Simplificada</b>100 px · 25 mm</p></div>
        <div><div class="art" style="width:120px">${L.vColor}</div><p><b>Vertical</b>120 px · 30 mm</p></div>
        <div><div class="art" style="width:24px">${L.cBox}</div><p><b>Compacta</b>16 px · 6 mm</p></div>
      </div>
      <p class="body muted" style="margin-top:28px">Por debajo de 180 px de ancho el descriptor “Soluciones Digitales” pierde legibilidad: use la versión simplificada.</p>
    </div>
  </div>`);

// 7 · Paleta
const sw = (name, hex, role, big) => {
  const [r, g, b] = hexRgb(hex); const [c, m, y, k] = cmyk(hex);
  const dark = ['#0B1F3A', '#1E4A84', '#5A6A80'].includes(hex);
  return `<div class="sw${big ? ' big' : ''}" style="background:${hex};color:${dark ? '#fff' : C.navy};${hex === '#FFFFFF' ? 'border:1px solid #DCE3EC' : ''}">
    <p class="nm">${name}</p><p class="rl">${role}</p>
    <dl><dt>HEX</dt><dd>${hex}</dd><dt>RGB</dt><dd>${r} · ${g} · ${b}</dd><dt>CMYK*</dt><dd>${c} · ${m} · ${y} · ${k}</dd></dl></div>`;
};
page('', `${head('06', 'Paleta de colores', 'Color')}
  <div class="pal">
    ${sw('Azul Nexo', C.navy, 'Principal · confianza y profesionalismo', 1)}
    ${sw('Dorado Lab', C.gold, 'Acento · energía e innovación', 1)}
    ${sw('Blanco', C.white, 'Base · limpieza y claridad', 1)}
    ${sw('Azul Enlace', C.blue, 'Secundario · detalles y enlaces')}
    ${sw('Gris Niebla', C.mist, 'Fondos de tarjetas y secciones')}
    ${sw('Gris Pizarra', C.slate, 'Textos secundarios')}
  </div>
  <div class="prop"><span style="flex:55;background:${C.navy}">55 %</span><span style="flex:25;background:#fff;color:${C.navy};border:1px solid #DCE3EC">25 %</span><span style="flex:12;background:${C.mist};color:${C.navy}">12 %</span><span style="flex:8;background:${C.gold};color:${C.navy}">8 %</span></div>
  <p class="note">Proporción recomendada en una pieza. El dorado es acento: precios, llamadas a la acción y la diagonal del símbolo. No usar texto dorado sobre fondo blanco (contraste insuficiente). · *CMYK aproximado: confirmar con prueba de impresión.</p>`);

// 8 · Tipografía
page('', `${head('07', 'Tipografía', 'Familias tipográficas')}
  <div class="cols c2 type">
    <div>
      <p class="fam">Montserrat</p>
      <p class="aa" style="font-family:Montserrat;font-weight:800">Aa</p>
      <p class="role">Titulares, logotipo, etiquetas y cifras.</p>
      <p class="weights" style="font-family:Montserrat"><span style="font-weight:500">Medium 500</span><span style="font-weight:600">SemiBold 600</span><span style="font-weight:700">Bold 700</span><span style="font-weight:800">ExtraBold 800</span></p>
      <p class="glyphs" style="font-family:Montserrat;font-weight:700">ABCDEFGHIJKLMNÑOPQRSTUVWXYZ<br>abcdefghijklmnñopqrstuvwxyz<br>0123456789 ¿? ¡! $ % áéíóú</p>
    </div>
    <div>
      <p class="fam">Inter</p>
      <p class="aa" style="font-family:Inter;font-weight:600">Aa</p>
      <p class="role">Textos de lectura, listas, notas y botones.</p>
      <p class="weights" style="font-family:Inter"><span style="font-weight:400">Regular 400</span><span style="font-weight:500">Medium 500</span><span style="font-weight:600">SemiBold 600</span><span style="font-weight:700">Bold 700</span></p>
      <div class="scale">
        <p style="font:800 34px/1.05 Montserrat;letter-spacing:-.01em">TITULAR EN MAYÚSCULAS</p>
        <p style="font:800 20px/1.2 Montserrat;color:${C.navy};letter-spacing:.02em">SUBTÍTULO DE SECCIÓN</p>
        <p style="font:400 17px/1.5 Inter;color:${C.slate}">Texto de lectura en Inter Regular. Frases cortas, claras y en segunda persona.</p>
        <p style="font:700 13px/1 Montserrat;letter-spacing:.16em;color:${C.blue}">ETIQUETA · DESCRIPTOR</p>
      </div>
    </div>
  </div>
  <p class="note">Ambas familias son gratuitas (licencia SIL Open Font License) y están disponibles en Google Fonts. Alternativa en Office/Canva: Montserrat + Inter, o Poppins + Inter.</p>`);

// 9 · Iconografía y recursos
page('', `${head('08', 'Iconografía y recursos gráficos', 'Sistema visual')}
  <div class="cols c2">
    <div>
      <h4>Íconos de servicio</h4>
      <div class="icons">
        ${[['programacion', 'Programación'], ['diseno', 'Diseño técnico'], ['academicas', 'Asesorías académicas'], ['empresariales', 'Soluciones empresariales'], ['documentos', 'Documentos digitales'], ['mensaje', 'Contacto']].map(([k, t]) => `<div>${I[k]()}<span>${t}</span></div>`).join('')}
      </div>
      <p class="body muted">Trazo lineal uniforme, terminaciones redondeadas y un solo detalle en Dorado Lab por ícono. Sin sombras, degradados ni volúmenes.</p>
    </div>
    <div>
      <h4>Recursos</h4>
      <div class="res">
        <div class="r1"><div class="diag"></div><p><b>La diagonal</b>Franja inclinada a ${Math.round(Math.atan((60 - 24) / 26) * 180 / Math.PI)}°, el mismo ángulo del símbolo. Se usa como fondo sutil, nunca como decoración repetida.</p></div>
        <div class="r2"><div class="pricetag"><span class="k">SERVICIOS DESDE</span><span class="a">$5</span></div><p><b>Bloque de precio</b>Siempre acompañado de “desde” y de una nota: el precio final depende del servicio.</p></div>
        <div class="r3"><div class="card"><span class="n">01</span><b>PROGRAMACIÓN</b><small>Python | C++ | JavaScript | SQL</small></div><p><b>Tarjeta de servicio</b>Fondo Gris Niebla, número de categoría, título en Montserrat y detalle en Inter.</p></div>
      </div>
    </div>
  </div>`);

// 10 · Usos incorrectos
const wrong = [
  [`<div class="art" style="transform:scaleX(1.45)">${L.hColor}</div>`, 'No deformar ni estirar'],
  [`<div class="art" style="transform:rotate(-12deg)">${L.hColor}</div>`, 'No rotar'],
  [`<div class="art">${strip(B.horizontal({ fg: '#7B2CBF', accent: '#22C55E', sub: '#7B2CBF' }))}</div>`, 'No cambiar los colores'],
  [`<div class="art" style="filter:drop-shadow(6px 6px 4px rgba(0,0,0,.45))">${L.hColor}</div>`, 'No agregar sombras ni efectos'],
  [`<div class="art fake"><svg viewBox="0 0 72 60" style="height:62px;width:auto">${B.symbolSVG(C.navy, C.gold)}</svg><span>NexoLab</span></div>`, 'No cambiar la tipografía'],
  [`<div class="art" style="background:#3A5A80;padding:24px">${L.hColor}</div>`, 'No usar sobre fondos sin contraste'],
];
page('', `${head('09', 'Usos incorrectos', 'Qué evitar')}
  <div class="wrong">${wrong.map(([a, t]) => `<div><div class="box">${a}</div><p><span class="x">✕</span>${t}</p></div>`).join('')}</div>`);

// 11 · Aplicaciones
page('', `${head('10', 'Aplicaciones', 'Marca en uso')}
  <div class="apps">
    <figure class="ad"><img src="../03-publicidad-marketplace/NexoLab-marketplace-1080.png"><figcaption>Publicidad para Facebook Marketplace · 1080 × 1080 px</figcaption></figure>
    <div class="side">
      <figure class="profile"><div class="ph-mock"><div class="avatar">${L.cCircle}</div><div><b>NexoLab | Soluciones Digitales</b><span>Conectamos tus ideas con soluciones.</span></div></div><figcaption>Foto de perfil (versión compacta)</figcaption></figure>
      <figure class="sig"><div class="sig-mock"><div class="art">${L.sColor}</div><div class="sig-t"><b>Atención 100 % en línea</b><span>Programación · Diseño técnico · Asesorías · Excel · Documentos</span></div></div><figcaption>Firma de correo / encabezado de documentos</figcaption></figure>
    </div>
  </div>`);

function html(rel = '.') {
  const total = pages.length;
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>NexoLab — Manual de identidad</title><style>
${fontFaces(rel)}
@page{size:1600px 900px;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Inter,sans-serif;color:${C.navy};-webkit-font-smoothing:antialiased;background:#888}
svg{display:block}
.page{width:1600px;height:900px;position:relative;overflow:hidden;background:#fff;padding:72px 88px 64px;page-break-after:always;break-after:page}
.page:last-child{page-break-after:auto}
.pn{position:absolute;left:88px;right:88px;bottom:32px;display:flex;justify-content:space-between;font:500 12px/1 Inter;color:#93A1B4;letter-spacing:.04em}
.ph{display:flex;align-items:flex-start;gap:26px;margin-bottom:46px}
.ph .num{font:800 15px/1 Montserrat;color:${C.navy};background:${C.gold};padding:9px 10px;border-radius:4px;margin-top:6px}
.ph .kick{font:700 12px/1 Montserrat;letter-spacing:.18em;text-transform:uppercase;color:${C.slate}}
.ph h2{font:800 40px/1.1 Montserrat;letter-spacing:-.01em;margin-top:9px}
h4{font:700 13px/1 Montserrat;letter-spacing:.16em;text-transform:uppercase;color:${C.slate};margin-bottom:18px}
.cols{display:grid;gap:80px}.c2{grid-template-columns:1fr 1fr}
.lead{font:500 24px/1.45 Inter;color:${C.navy}}
.body{font:400 16.5px/1.6 Inter;color:#2B3B52;margin-top:18px;max-width:640px}
.muted{color:${C.slate}}
.note{position:absolute;left:88px;right:88px;bottom:62px;font:400 13px/1.5 Inter;color:${C.slate}}

/* portada */
.cover{background:${C.navy};padding:0}
.cover .band{position:absolute;left:1080px;top:0;width:150px;height:900px;background:rgba(255,255,255,.04);transform:skewX(35.8deg);transform-origin:top left}
.cover-logo{position:absolute;left:120px;top:300px;width:720px}
.cover-logo svg{width:100%;height:auto}
.cover-foot{position:absolute;left:120px;bottom:96px}
.cover-foot .t{font:700 26px/1 Montserrat;color:#fff}
.cover-foot .m{font:500 15px/1 Inter;color:#AFC0D6;margin-top:14px}
.cover-slogan{position:absolute;right:120px;bottom:96px;font:600 16px/1 Inter;color:${C.gold}}
.cover .pn{display:none}

/* marca */
.facts{margin-top:40px;border-top:1px solid #DCE3EC}
.facts div{display:grid;grid-template-columns:150px 1fr;padding:15px 0;border-bottom:1px solid #DCE3EC;font:400 16px/1.45 Inter}
.facts span{color:${C.slate};font-size:14px;padding-top:2px}
.facts b{font-weight:600}
.traits{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.traits div{background:${C.mist};border-radius:6px;padding:14px 16px}
.traits b{display:block;font:800 15px/1 Montserrat;letter-spacing:.02em}
.traits span{display:block;font:400 14px/1.4 Inter;color:${C.slate};margin-top:7px}
.tone{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.tone div{border-radius:6px;padding:16px;font:500 14.5px/1.45 Inter}
.tone p+p{margin-top:8px}
.tone .lbl{font:700 12px/1 Montserrat;letter-spacing:.14em;text-transform:uppercase;margin-bottom:12px}
.tone .yes{border:1.5px solid ${C.navy}}
.tone .no{border:1.5px dashed #C3CCD8;color:#8C99AB}
.tone .no p:not(.lbl){text-decoration:line-through}

/* símbolo */
.eq{display:flex;align-items:center;gap:22px;margin-bottom:34px}
.eq figure{text-align:center}
.eq svg{height:118px;width:auto}
.eq figcaption{font:600 13px/1 Inter;color:${C.slate};margin-top:12px}
.eq > span{font:600 30px/1 Inter;color:#AEBACB;margin-bottom:24px}
.constr-wrap{display:flex;align-items:center;justify-content:center}
.constr{width:640px;height:auto}

/* versiones */
.versions{display:grid;grid-template-columns:1.25fr 1fr 1fr;grid-template-rows:1fr 1fr;gap:18px;height:600px}
.versions .v{background:${C.mist};border-radius:8px;padding:28px;display:flex;flex-direction:column}
.versions .big{grid-row:span 2}
.v .art{flex:1;display:flex;align-items:center;justify-content:center}
.v.big .art svg{width:88%;height:auto}
.v .art svg{width:70%;height:auto;max-height:150px}
.v .art.row{gap:22px}.v .art.row svg{width:auto;height:120px}
.v p{font:400 14px/1.45 Inter;color:${C.slate}}
.v p b{display:block;font:700 15px/1.3 Montserrat;color:${C.navy};margin-bottom:4px}

/* color */
.colorv{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
.colorv > div{border-radius:8px;height:285px;display:flex;flex-direction:column;padding:24px}
.colorv .art{flex:1;display:flex;align-items:center;justify-content:center}
.colorv .art svg{width:76%;height:auto}
.colorv p{font:600 13.5px/1 Inter;color:${C.navy}}
.colorv p.w{color:#fff}

/* protección */
.clear-wrap{background:${C.mist};border-radius:8px;padding:28px;display:flex;justify-content:center}
.clear{width:100%;height:auto}
.mins{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.mins > div{border:1px solid #DCE3EC;border-radius:8px;padding:22px;height:170px;display:flex;flex-direction:column;justify-content:space-between}
.mins .art svg{width:100%;height:auto}
.mins p{font:400 13.5px/1.4 Inter;color:${C.slate}}
.mins p b{display:block;font:700 14px/1.3 Montserrat;color:${C.navy}}

/* paleta */
.pal{display:grid;grid-template-columns:repeat(6,1fr);gap:14px}
.sw{border-radius:8px;padding:20px 18px;height:300px;display:flex;flex-direction:column}
.sw.big{grid-column:span 2}
.sw:not(.big){grid-column:span 2;height:190px}
.sw .nm{font:800 20px/1 Montserrat}
.sw .rl{font:500 13px/1.35 Inter;opacity:.8;margin-top:8px}
.sw dl{margin-top:auto;display:grid;grid-template-columns:64px 1fr;row-gap:5px;font:500 13px/1.2 Inter}
.sw dt{opacity:.65;font-weight:600;letter-spacing:.06em;font-size:11px;padding-top:1px}
.pal{grid-template-rows:300px 190px}
.prop{display:flex;height:34px;margin-top:22px;border-radius:6px;overflow:hidden}
.prop span{display:flex;align-items:center;padding-left:12px;font:700 12px/1 Inter;color:#fff}

/* tipografía */
.type .fam{font:700 14px/1 Montserrat;letter-spacing:.16em;text-transform:uppercase;color:${C.slate}}
.type .aa{font-size:150px;line-height:1;margin:10px 0 4px;letter-spacing:-.02em}
.type .role{font:500 16px/1.4 Inter}
.type .weights{display:flex;flex-wrap:wrap;gap:8px 22px;margin-top:20px;font-size:18px}
.type .glyphs{font-size:19px;line-height:1.6;margin-top:22px;color:${C.slate};letter-spacing:.04em}
.scale{margin-top:26px;border-top:1px solid #DCE3EC;padding-top:22px;display:grid;gap:14px}

/* íconos y recursos */
.icons{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.icons div{background:${C.mist};border-radius:8px;height:128px;display:flex;flex-direction:column;align-items:flex-start;justify-content:space-between;padding:20px}
.icons svg{width:48px;height:48px}
.icons span{font:700 13.5px/1.2 Montserrat}
.res{display:grid;gap:14px}
.res > div{display:grid;grid-template-columns:250px 1fr;gap:24px;align-items:center}
.res p{font:400 14px/1.5 Inter;color:${C.slate}}
.res p b{display:block;font:700 15px/1.3 Montserrat;color:${C.navy};margin-bottom:3px}
.r1 .diag{height:110px;background:${C.navy};border-radius:8px;position:relative;overflow:hidden}
.r1 .diag::after{content:'';position:absolute;left:120px;top:0;width:40px;height:110px;background:rgba(255,255,255,.08);transform:skewX(35.8deg);transform-origin:top left}
.pricetag{background:${C.gold};border-radius:6px;padding:16px 18px;height:110px}
.pricetag .k{display:block;font:800 11px/1 Montserrat;letter-spacing:.12em}
.pricetag .a{display:block;font:800 60px/1 Montserrat;letter-spacing:-.03em;margin-top:6px}
.res .card{background:${C.mist};border-radius:8px;padding:16px 18px;height:110px;position:relative}
.res .card .n{position:absolute;right:16px;top:16px;font:700 11px/1 Montserrat;color:${C.blue};letter-spacing:.1em}
.res .card b{display:block;font:800 15px/1 Montserrat;margin-top:30px}
.res .card small{display:block;font:500 12px/1 Inter;color:${C.slate};margin-top:9px}

/* incorrectos */
.wrong{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
.wrong .box{height:230px;border:1px solid #DCE3EC;border-radius:8px;display:flex;align-items:center;justify-content:center;overflow:hidden}
.wrong .art{width:62%}
.wrong .art svg{width:100%;height:auto}
.wrong .fake{display:flex;align-items:center;gap:14px;width:auto}
.wrong .fake span{font:italic 700 48px/1 Georgia,serif;color:${C.navy}}
.wrong p{font:600 14.5px/1 Inter;margin-top:14px;display:flex;align-items:center;gap:10px}
.wrong .x{display:inline-grid;place-items:center;width:22px;height:22px;border-radius:50%;background:#D64545;color:#fff;font-size:12px}

/* aplicaciones */
.apps{display:grid;grid-template-columns:600px 1fr;gap:56px;align-items:start}
.apps figure img{width:600px;height:600px;display:block;border-radius:6px;box-shadow:0 0 0 1px #DCE3EC}
.apps figcaption{font:500 13px/1 Inter;color:${C.slate};margin-top:12px}
.side{display:grid;gap:34px}
.ph-mock{background:${C.mist};border-radius:10px;padding:28px;display:flex;align-items:center;gap:22px}
.avatar svg{width:120px;height:120px}
.ph-mock b{display:block;font:800 22px/1.2 Montserrat}
.ph-mock span{display:block;font:400 15px/1.4 Inter;color:${C.slate};margin-top:6px}
.sig-mock{border:1px solid #DCE3EC;border-radius:10px;padding:28px;display:flex;align-items:center;gap:26px}
.sig-mock .art{width:220px;padding-right:26px;border-right:1px solid #DCE3EC}
.sig-mock .art svg{width:100%;height:auto}
.sig-t b{display:block;font:700 15px/1.3 Montserrat}
.sig-t span{display:block;font:400 13.5px/1.45 Inter;color:${C.slate};margin-top:5px}
</style></head><body>
${pages.map((p, i) => `<section class="page ${p.cls}">${p.body}<div class="pn"><span>NexoLab · Manual de identidad visual</span><span>${String(i + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}</span></div></section>`).join('\n')}
</body></html>`;
}

module.exports = { html, pageCount: () => pages.length };

if (require.main === module) {
  fs.writeFileSync(path.join(__dirname, 'manual-de-marca.html'), html('.'));
  console.log('HTML manual: fuente/manual-de-marca.html');
}
