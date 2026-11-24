// Piezas publicitarias para Facebook Marketplace.
//   vertical: 1080 × 1350 (4:5, formato principal)
//   cuadrado: 1080 × 1080 (1:1, segunda foto de la publicación)
const fs = require('fs');
const path = require('path');
const B = require('./brand');
const { categorias: I, beneficios: BI } = require('./iconos');
const C = B.COLORS;

const FORMATS = { vertical: { w: 1080, h: 1350 }, cuadrado: { w: 1080, h: 1080 } };

const fontFaces = (rel) => [
  ['Poppins', 'poppins', [500, 600, 700, 800]],
  ['Inter', 'inter', [400, 500, 600, 700]],
].map(([fam, pkg, ws]) => ws.map((w) =>
  `@font-face{font-family:'${fam}';font-weight:${w};font-display:block;src:url('${rel}/node_modules/@fontsource/${pkg}/files/${pkg}-latin-${w}-normal.woff2') format('woff2')}`
).join('\n')).join('\n');

const sep = '<i>|</i>';
// Cada fila es una línea fija (la pieza es estática: los cortes se deciden a mano)
const lines = (rows) => rows.map((r) => r.join(sep)).join('<br>');
const SERVICIOS = {
  vertical: [
    ['01', 'Programación', [['Python', 'C++', 'JavaScript', 'SQL']], I.programacion()],
    ['02', 'Diseño técnico', [['AutoCAD', 'SketchUp', 'Modelado 3D']], I.diseno()],
    ['03', 'Asesorías académicas', [['Matemáticas', 'Física', 'Estadística']], I.academicas()],
    ['04', 'Soluciones empresariales', [['Excel', 'Inventarios', 'Reportes'], ['Automatización']], I.empresariales()],
    ['05', 'Documentos digitales', [['Word', 'PowerPoint', 'PDF']], I.documentos()],
  ],
  cuadrado: [
    ['01', 'Programación', [['Python', 'C++', 'JavaScript', 'SQL']], I.programacion()],
    ['02', 'Diseño técnico', [['AutoCAD', 'SketchUp'], ['Modelado 3D']], I.diseno()],
    ['03', 'Asesorías académicas', [['Matemáticas', 'Física', 'Estadística']], I.academicas()],
    ['04', 'Soluciones empresariales', [['Excel', 'Inventarios'], ['Reportes', 'Automatización']], I.empresariales()],
    ['05', 'Documentos digitales', [['Word', 'PowerPoint', 'PDF']], I.documentos()],
  ],
};

const beneficios = [
  [BI.linea(), 'Atención 100 % en línea'],
  [BI.precio(), 'Precios accesibles'],
  [BI.persona(), 'Atención personalizada'],
  [BI.cotizacion(), 'Cotizaciones sin compromiso'],
];

// Estilos comunes
const base = (W, H) => `
:root{--navy:${C.navy};--blue:${C.blue};--gold:${C.gold};--mist:${C.mist};--slate:${C.slate}}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${W}px;height:${H}px}
body{background:#fff;font-family:'Inter',sans-serif;color:var(--navy);position:relative;overflow:hidden;-webkit-font-smoothing:antialiased}
svg{display:block}
.hero{position:absolute;inset:0 0 auto 0;background:var(--navy);overflow:hidden}
.hero .band{position:absolute;top:0;background:rgba(255,255,255,.045);transform:skewX(-45deg);transform-origin:bottom left}
.hero > *:not(.band){position:relative}
.logo svg{width:auto}
h1{font-family:'Poppins';font-weight:700;color:#fff;letter-spacing:-.008em}
.sol{font-family:'Poppins';font-weight:800;color:var(--gold);line-height:1}
.lead{font-family:'Inter';font-weight:400;color:rgba(255,255,255,.84)}
.price{position:absolute;background:var(--gold);border-radius:8px;color:var(--navy)}
.price .k,.price .cur{font-family:'Poppins';font-weight:700;letter-spacing:.1em;line-height:1}
.price .row{display:flex;align-items:flex-end;gap:12px}
.price .amt{font-family:'Poppins';font-weight:800;line-height:.74;letter-spacing:-.03em}
.price .note{font-family:'Inter';font-weight:500;line-height:1.35;border-top:1.5px solid rgba(11,31,58,.22)}
.grid{position:absolute;display:grid;gap:16px}
.card{background:var(--mist);border-radius:10px}
.card .top{display:flex;justify-content:space-between;align-items:flex-start}
.card .n{font-family:'Poppins';font-weight:700;color:var(--blue);letter-spacing:.1em;line-height:1;padding-top:2px}
.card h3{font-family:'Poppins';font-weight:800;line-height:1.12;letter-spacing:.01em;text-transform:uppercase}
.card p{font-family:'Inter';font-weight:500;color:var(--slate);white-space:nowrap}
.card p i{font-style:normal;color:#AEBACB;padding:0 5px}
.cta{background:var(--gold);display:flex;flex-direction:column}
.cta h3{margin-top:0}
.cta .go{margin-top:auto;display:flex;align-items:center;gap:10px;font-family:'Inter';font-weight:700;line-height:1}
.cta .go svg:first-child{width:36px;height:36px}
.foot{position:absolute;left:0;bottom:0;width:${W}px;background:var(--navy)}
.benefits{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,255,255,.14)}
.benefits div{display:flex;align-items:center;gap:9px;font-family:'Inter';font-weight:600;line-height:1;color:#fff;letter-spacing:-.005em}
.benefits svg{width:24px;height:24px;flex:none}
.slogan{display:flex;align-items:center;justify-content:center;gap:14px;font-family:'Inter';font-weight:500;line-height:1;color:rgba(255,255,255,.82)}
.slogan b{font-family:'Poppins';font-weight:700;color:#fff}
.slogan em{font-style:normal;color:var(--gold);font-weight:600}
`;

const CSS = {
  vertical: `
.hero{height:552px;padding:50px 60px 0}
.hero .band{left:640px;width:84px;height:552px}
.logo svg{height:62px}
h1{font-size:78px;line-height:1.02;margin-top:36px}
.sol{font-size:40px;margin-top:20px}
.lead{font-size:23px;line-height:1.42;width:640px;margin-top:14px}
.price{right:60px;top:236px;width:300px;padding:24px 26px 20px}
.price .k{font-size:17px}.price .cur{font-size:17px;padding-bottom:2px}
.price .row{margin-top:22px}
.price .amt{font-size:118px}
.price .note{font-size:15px;padding-top:11px;margin-top:18px}
.grid{left:60px;top:580px;width:960px;grid-template-columns:repeat(2,minmax(0,1fr));grid-auto-rows:186px}
.card{padding:22px 26px 20px}
.card .top svg{width:48px;height:48px}
.card .n{font-size:16px}
.card h3{font-size:23px;margin-top:14px}
.card p{font-size:18.5px;line-height:1.42;margin-top:6px}
.cta h3{font-size:31px;line-height:1.12}
.cta .go{font-size:17.5px}.cta .go svg{width:22px;height:22px}
.foot{height:152px;padding:0 60px}
.benefits{height:80px}
.benefits div{font-size:16.5px}
.slogan{height:72px;font-size:19px}
.slogan svg{height:26px;width:auto}
.slogan b{font-size:20px}
`,
  cuadrado: `
.hero{height:446px;padding:48px 56px 0}
.hero .band{left:600px;width:70px;height:446px}
.logo svg{height:50px}
h1{font-size:60px;line-height:1.04;margin-top:42px}
.sol{font-size:32px;margin-top:20px}
.lead{font-size:21px;line-height:1.45;width:600px;margin-top:14px}
.price{right:56px;top:222px;width:262px;padding:20px 22px 16px}
.price .k{font-size:15px}.price .cur{font-size:15px;padding-bottom:2px}
.price .row{margin-top:20px}
.price .amt{font-size:100px}
.price .note{font-size:13.5px;padding-top:9px;margin-top:15px}
.grid{left:56px;top:474px;width:968px;grid-template-columns:repeat(3,minmax(0,1fr));grid-auto-rows:203px;gap:14px}
.card{padding:20px 22px 18px}
.card .top svg{width:44px;height:44px}
.card .n{font-size:15px}
.card h3{font-size:20px;margin-top:14px}
.card p{font-size:16.5px;line-height:1.45;margin-top:7px}
.cta h3{font-size:25px;line-height:1.1}
.cta .go{font-size:16px;white-space:nowrap}.cta .go svg{width:20px;height:20px}.cta .go svg:first-child{display:none}
.foot{height:166px;padding:0 56px}
.benefits{height:86px}
.benefits div{font-size:16.5px}
.slogan{height:80px;font-size:18px}
.slogan svg{height:24px;width:auto}
.slogan b{font-size:19px}
`,
};

function html(format = 'vertical', rel = '.') {
  const { w: W, h: H } = FORMATS[format];
  const logo = B.horizontal({ fg: C.white, accent: C.gold, sub: '#AFC0D6' });
  const mark = B.symbolOnly({ fg: C.white, accent: C.gold });
  const cta = format === 'vertical' ? '¡ESCRÍBENOS Y COTIZA<br>TU PROYECTO!' : '¡ESCRÍBENOS<br>Y COTIZA TU<br>PROYECTO!';
  const h1 = format === 'vertical' ? '¿NECESITAS AYUDA<br>CON TUS<br>PROYECTOS?' : '¿NECESITAS AYUDA CON<br>TUS PROYECTOS?';
  return `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><title>Tareita — Marketplace ${format}</title>
<style>
${fontFaces(rel)}
${base(W, H)}
${CSS[format]}
</style></head>
<body>
  <section class="hero">
    <div class="band"></div>
    <div class="logo">${logo}</div>
    <h1>${h1}</h1>
    <p class="sol">¡TENEMOS LA SOLUCIÓN!</p>
    <p class="lead">Soluciones académicas, tecnológicas y digitales para estudiantes, profesionales y emprendedores.</p>
  </section>

  <aside class="price">
    <div class="k">SERVICIOS DESDE</div>
    <div class="row"><span class="amt">$5</span><span class="cur">DÓLARES</span></div>
    <div class="note">El precio final depende del servicio y de su complejidad.</div>
  </aside>

  <section class="grid">
${SERVICIOS[format].map(([n, t, items, icon]) => `    <article class="card"><div class="top">${icon}<span class="n">${n}</span></div><h3>${t}</h3><p>${lines(items)}</p></article>`).join('\n')}
    <article class="card cta"><h3>${cta}</h3><div class="go">${I.mensaje()}<span>Envíanos un mensaje privado</span>${BI.flecha()}</div></article>
  </section>

  <footer class="foot">
    <div class="benefits">${beneficios.map(([ic, t]) => `<div>${ic}${t}</div>`).join('')}</div>
    <div class="slogan">${mark}<span><b>Tareita</b> <em>|</em> Conectamos tus ideas con soluciones.</span></div>
  </footer>
</body></html>
`;
}

module.exports = { html, FORMATS };

if (require.main === module) {
  for (const f of Object.keys(FORMATS)) {
    const out = path.join(__dirname, `anuncio-marketplace-${f}.html`);
    fs.writeFileSync(out, html(f, '.'));
    console.log('HTML:', path.basename(out));
  }
}
