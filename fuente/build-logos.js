// Genera todas las versiones del logotipo en SVG (texto en trazos).
const fs = require('fs');
const path = require('path');
const B = require('./brand');
const C = B.COLORS;

const OUT = path.join(__dirname, '..', '01-logotipo', 'svg');
fs.mkdirSync(OUT, { recursive: true });

const files = {
  // Principal horizontal
  'nexolab-horizontal-color.svg': B.horizontal({ fg: C.navy, accent: C.gold, sub: C.slate }),
  'nexolab-horizontal-negativo.svg': B.horizontal({ fg: C.white, accent: C.gold, sub: '#AFC0D6' }),
  'nexolab-horizontal-azul.svg': B.horizontal({ fg: C.navy, accent: C.navy, sub: C.navy }),
  'nexolab-horizontal-blanco.svg': B.horizontal({ fg: C.white, accent: C.white, sub: C.white }),
  'nexolab-horizontal-negro.svg': B.horizontal({ fg: C.black, accent: C.black, sub: C.black }),
  // Horizontal simplificado (tamaños pequeños)
  'nexolab-horizontal-simple-color.svg': B.horizontalSimple({ fg: C.navy, accent: C.gold }),
  'nexolab-horizontal-simple-negativo.svg': B.horizontalSimple({ fg: C.white, accent: C.gold }),
  // Vertical
  'nexolab-vertical-color.svg': B.vertical({ fg: C.navy, accent: C.gold, sub: C.slate }),
  'nexolab-vertical-negativo.svg': B.vertical({ fg: C.white, accent: C.gold, sub: '#AFC0D6' }),
  // Compacto (contenedor)
  'nexolab-compacto.svg': B.compact({ box: C.navy, fg: C.white, accent: C.gold }),
  'nexolab-compacto-circular.svg': B.compact({ box: C.navy, fg: C.white, accent: C.gold, shape: 'circle' }),
  'nexolab-compacto-claro.svg': B.compact({ box: C.mist, fg: C.navy, accent: C.gold }),
  // Símbolo solo
  'nexolab-simbolo-color.svg': B.symbolOnly({ fg: C.navy, accent: C.gold }),
  'nexolab-simbolo-negativo.svg': B.symbolOnly({ fg: C.white, accent: C.gold }),
  'nexolab-simbolo-azul.svg': B.symbolOnly({ fg: C.navy, accent: C.navy }),
};

for (const [name, svg] of Object.entries(files)) fs.writeFileSync(path.join(OUT, name), svg);
console.log(`SVG: ${Object.keys(files).length} archivos en ${path.relative(process.cwd(), OUT)}`);
module.exports = files;
