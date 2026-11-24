// Pieza publicitaria para Facebook Marketplace (1080 × 1080).
const fs = require('fs');
const path = require('path');
const B = require('./brand');
const { categorias: I, beneficios: BI } = require('./iconos');
const C = B.COLORS;

const fontFaces = (rel) => [
  ['Montserrat', 'montserrat', [500, 600, 700, 800]],
  ['Inter', 'inter', [400, 500, 600, 700]],
].map(([fam, pkg, ws]) => ws.map((w) =>
  `@font-face{font-family:'${fam}';font-weight:${w};font-display:block;src:url('${rel}/node_modules/@fontsource/${pkg}/files/${pkg}-latin-${w}-normal.woff2') format('woff2')}`
).join('\n')).join('\n');

const sep = '<i>|</i>';
// Cada fila es una línea fija (la pieza es estática: los cortes se deciden a mano)
const lines = (rows) => rows.map((r) => r.join(sep)).join('<br>');
const servicios = [
  ['01', 'Programación', [['Python', 'C++', 'JavaScript', 'SQL']], I.programacion()],
  ['02', 'Diseño técnico', [['AutoCAD', 'SketchUp'], ['Modelado 3D']], I.diseno()],
  ['03', 'Asesorías académicas', [['Matemáticas', 'Física', 'Estadística']], I.academicas()],
  ['04', 'Soluciones empresariales', [['Excel', 'Inventarios'], ['Reportes', 'Automatización']], I.empresariales()],
  ['05', 'Documentos digitales', [['Word', 'PowerPoint', 'PDF']], I.documentos()],
];

const beneficios = [
  [BI.linea(), 'Atención 100 % en línea'],
  [BI.precio(), 'Precios accesibles'],
  [BI.persona(), 'Atención personalizada'],
  [BI.cotizacion(), 'Cotizaciones sin compromiso'],
];

function html(rel = '.') {
  const logo = B.horizontal({ fg: C.white, accent: C.gold, sub: '#AFC0D6' });
  const mark = B.symbolOnly({ fg: C.white, accent: C.gold });
  return `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><title>NexoLab — Marketplace</title>
<style>
${fontFaces(rel)}
:root{--navy:${C.navy};--blue:${C.blue};--gold:${C.gold};--mist:${C.mist};--slate:${C.slate}}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1080px;height:1080px}
body{background:#fff;font-family:'Inter',sans-serif;color:var(--navy);position:relative;overflow:hidden;-webkit-font-smoothing:antialiased}
svg{display:block}

/* ---------- Encabezado ---------- */
.hero{position:absolute;inset:0 0 auto 0;height:446px;background:var(--navy);padding:48px 56px 0;overflow:hidden}
.hero .band{position:absolute;left:770px;top:0;width:70px;height:446px;background:rgba(255,255,255,.045);transform:skewX(35.8deg);transform-origin:top left}
.hero > *:not(.band){position:relative}
.hero .logo svg{height:46px;width:auto}
h1{font:800 64px/1.02 'Montserrat';color:#fff;letter-spacing:-.015em;margin-top:44px}
.sol{font:800 33px/1 'Montserrat';color:var(--gold);letter-spacing:.005em;margin-top:20px}
.lead{font:400 21px/1.45 'Inter';color:rgba(255,255,255,.84);width:600px;margin-top:16px}

/* ---------- Precio ---------- */
.price{position:absolute;right:56px;top:222px;width:262px;background:var(--gold);border-radius:6px;padding:20px 22px 16px;color:var(--navy)}
.price .k{font:800 15px/1 'Montserrat';letter-spacing:.12em}
.price .row{display:flex;align-items:flex-end;gap:12px;margin-top:20px}
.price .amt{font:800 100px/.74 'Montserrat';letter-spacing:-.035em}
.price .cur{font:800 15px/1 'Montserrat';letter-spacing:.12em;padding-bottom:2px}
.price .note{font:500 13.5px/1.35 'Inter';border-top:1.5px solid rgba(11,31,58,.22);padding-top:9px;margin-top:15px}

/* ---------- Servicios ---------- */
.grid{position:absolute;left:56px;top:474px;width:968px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));grid-auto-rows:203px;gap:14px}
.card{background:var(--mist);border-radius:8px;padding:20px 22px 18px}
.card .top{display:flex;justify-content:space-between;align-items:flex-start}
.card .top svg{width:44px;height:44px}
.card .n{font:700 15px/1 'Montserrat';color:var(--blue);letter-spacing:.1em;padding-top:2px}
.card h3{font:800 21px/1.14 'Montserrat';letter-spacing:.015em;text-transform:uppercase;margin-top:14px}
.card p{font:500 16.5px/1.45 'Inter';color:var(--slate);margin-top:7px;white-space:nowrap}
.card p i{font-style:normal;color:#AEBACB;padding:0 5px}
.cta{background:var(--gold);display:flex;flex-direction:column}
.cta .top svg{width:42px;height:42px}
.cta h3{font-size:23px;line-height:1.12;letter-spacing:.005em;margin-top:14px}
.cta .go{margin-top:auto;display:flex;align-items:center;gap:8px;font:700 16px/1 'Inter'}
.cta .go svg{width:20px;height:20px}

/* ---------- Franja inferior ---------- */
.foot{position:absolute;left:0;bottom:0;width:1080px;height:166px;background:var(--navy);padding:0 56px}
.benefits{display:flex;justify-content:space-between;height:86px;align-items:center;border-bottom:1px solid rgba(255,255,255,.14)}
.benefits div{display:flex;align-items:center;gap:9px;font:600 16.5px/1 'Inter';color:#fff;letter-spacing:-.005em}
.benefits svg{width:24px;height:24px;flex:none}
.slogan{height:80px;display:flex;align-items:center;justify-content:center;gap:14px;font:500 18px/1 'Inter';color:rgba(255,255,255,.82)}
.slogan svg{height:22px;width:auto}
.slogan b{font:800 18px/1 'Montserrat';color:#fff;letter-spacing:.01em}
.slogan em{font-style:normal;color:var(--gold);font-weight:600}
</style></head>
<body>
  <section class="hero">
    <div class="band"></div>
    <div class="logo">${logo}</div>
    <h1>¿NECESITAS AYUDA CON<br>TUS PROYECTOS?</h1>
    <p class="sol">¡TENEMOS LA SOLUCIÓN!</p>
    <p class="lead">Soluciones académicas, tecnológicas y digitales para estudiantes, profesionales y emprendedores.</p>
  </section>

  <aside class="price">
    <div class="k">SERVICIOS DESDE</div>
    <div class="row"><span class="amt">$5</span><span class="cur">DÓLARES</span></div>
    <div class="note">El precio final depende del servicio y de su complejidad.</div>
  </aside>

  <section class="grid">
${servicios.map(([n, t, items, icon]) => `    <article class="card"><div class="top">${icon}<span class="n">${n}</span></div><h3>${t}</h3><p>${lines(items)}</p></article>`).join('\n')}
    <article class="card cta"><div class="top">${I.mensaje()}</div><h3>¡ESCRÍBENOS Y COTIZA TU PROYECTO!</h3><div class="go">Envíanos un mensaje privado ${BI.flecha()}</div></article>
  </section>

  <footer class="foot">
    <div class="benefits">${beneficios.map(([ic, t]) => `<div>${ic}${t}</div>`).join('')}</div>
    <div class="slogan">${mark}<span><b>NexoLab</b> <em>|</em> Conectamos tus ideas con soluciones.</span></div>
  </footer>
</body></html>
`;
}

module.exports = { html };

if (require.main === module) {
  const out = path.join(__dirname, 'anuncio-marketplace.html');
  fs.writeFileSync(out, html('.'));
  console.log('HTML:', out);
}
