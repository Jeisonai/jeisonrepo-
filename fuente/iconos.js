// Iconografía NexoLab: trazo lineal 2.6 px (retícula 40), terminaciones redondeadas,
// un solo detalle en Dorado Lab por ícono.
const { COLORS: C } = require('./brand');

const wrap = (body, size = 40, stroke = C.navy, sw = 2.6) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;

const G = C.gold;

const categorias = {
  programacion: (s = C.navy) => wrap(`<path d="M13 12 5 20l8 8M27 12l8 8-8 8"/><path d="M23 8 17 32" stroke="${G}"/>`, 40, s),
  diseno: (s = C.navy) => wrap(`<path d="M20 5 33 12.5 20 20 7 12.5Z" fill="${G}" stroke="none"/><path d="M20 5 33 12.5V27.5L20 35 7 27.5V12.5ZM7 12.5 20 20 33 12.5M20 20V35"/>`, 40, s),
  academicas: (s = C.navy) => wrap(`<path d="M7 5V33H35"/><path d="M11 31Q21.5 -13 32 31" stroke="${G}"/><circle cx="17.3" cy="12.6" r="2.6" fill="${s}" stroke="none"/>`, 40, s),
  empresariales: (s = C.navy) => wrap(`<path d="M5 34H35"/><rect x="8.5" y="22" width="6" height="12" rx="1"/><rect x="17.5" y="15" width="6" height="19" rx="1"/><rect x="26.5" y="7" width="6" height="27" rx="1" fill="${G}" stroke="none"/>`, 40, s),
  documentos: (s = C.navy) => wrap(`<path d="M11 5h13l7 7v23H11Z"/><path d="M24 5v7h7"/><path d="M16 19h10M16 24h10"/><path d="M16 29h6" stroke="${G}"/>`, 40, s),
  mensaje: (s = C.navy) => wrap(`<path d="M6 10a3 3 0 0 1 3-3h22a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3H17l-7 6v-6H9a3 3 0 0 1-3-3Z"/><path d="M13 17h.01M20 17h.01M27 17h.01" stroke-width="3.6"/>`, 40, s),
};

const beneficios = {
  linea: (s = C.gold) => wrap(`<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 2.6 4 5.6 4 9s-1 6.4-4 9c-3-2.6-4-5.6-4-9s1-6.4 4-9Z"/>`, 24, s, 1.9),
  precio: (s = C.gold) => wrap(`<path d="M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1 1 0 0 1 0 1.4l-7.7 7.7a1 1 0 0 1-1.4 0Z"/><circle cx="8.5" cy="8.5" r="1.4"/>`, 24, s, 1.9),
  persona: (s = C.gold) => wrap(`<circle cx="12" cy="8" r="4"/><path d="M4 20.5c.9-4 4.2-6 8-6s7.1 2 8 6"/>`, 24, s, 1.9),
  cotizacion: (s = C.gold) => wrap(`<path d="M6 3h9l4 4v14H6Z"/><path d="m9.5 13.5 2 2 4-4.2"/>`, 24, s, 1.9),
  flecha: (s = C.navy) => wrap(`<path d="M5 12h14M13 6l6 6-6 6"/>`, 24, s, 2.2),
};

module.exports = { categorias, beneficios };
