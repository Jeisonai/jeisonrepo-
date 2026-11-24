// Genera todas las versiones del logotipo en SVG (texto en trazos).
const fs = require('fs');
const path = require('path');
const B = require('./brand');
const C = B.COLORS;

const OUT = path.join(__dirname, '..', '01-logotipo', 'svg');
fs.mkdirSync(OUT, { recursive: true });
const SUB_NEG = '#AFC0D6'; // descriptor sobre fondo oscuro

const files = {
  // Principal horizontal
  'tareita-horizontal-color.svg': B.horizontal({ fg: C.navy, accent: C.gold, sub: C.slate }),
  'tareita-horizontal-negativo.svg': B.horizontal({ fg: C.white, accent: C.gold, sub: SUB_NEG }),
  'tareita-horizontal-azul.svg': B.horizontal({ fg: C.navy, accent: C.navy, sub: C.navy }),
  'tareita-horizontal-blanco.svg': B.horizontal({ fg: C.white, accent: C.white, sub: C.white }),
  'tareita-horizontal-negro.svg': B.horizontal({ fg: C.black, accent: C.black, sub: C.black }),
  // Horizontal simplificado (tamaños pequeños)
  'tareita-horizontal-simple-color.svg': B.horizontalSimple({ fg: C.navy, accent: C.gold }),
  'tareita-horizontal-simple-negativo.svg': B.horizontalSimple({ fg: C.white, accent: C.gold }),
  // Vertical
  'tareita-vertical-color.svg': B.vertical({ fg: C.navy, accent: C.gold, sub: C.slate }),
  'tareita-vertical-negativo.svg': B.vertical({ fg: C.white, accent: C.gold, sub: SUB_NEG }),
  // Compacto (contenedor)
  'tareita-compacto.svg': B.compact({ box: C.navy, fg: C.white, accent: C.gold }),
  'tareita-compacto-circular.svg': B.compact({ box: C.navy, fg: C.white, accent: C.gold, shape: 'circle' }),
  'tareita-compacto-claro.svg': B.compact({ box: C.mist, fg: C.navy, accent: C.gold }),
  // Símbolo solo
  'tareita-simbolo-color.svg': B.symbolOnly({ fg: C.navy, accent: C.gold }),
  'tareita-simbolo-negativo.svg': B.symbolOnly({ fg: C.white, accent: C.gold }),
  'tareita-simbolo-azul.svg': B.symbolOnly({ fg: C.navy, accent: C.navy }),
};

if (require.main === module || process.env.WRITE_LOGOS !== '0') {
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });
  for (const [name, svg] of Object.entries(files)) fs.writeFileSync(path.join(OUT, name), svg);
  console.log(`SVG: ${Object.keys(files).length} archivos en 01-logotipo/svg`);
}
module.exports = files;
