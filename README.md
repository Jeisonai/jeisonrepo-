# Tareita | Soluciones Digitales — Identidad visual

> Conectamos tus ideas con soluciones.

Identidad visual completa de Tareita: logotipo, manual de marca, publicidad para
Facebook Marketplace y textos comerciales.

## Entregables

| Carpeta | Contenido |
|---|---|
| `01-logotipo/svg` | Logotipos vectoriales (texto convertido a trazos, no requieren fuentes) |
| `01-logotipo/png` | Los mismos logotipos en PNG con fondo transparente |
| `02-manual-de-marca` | `Tareita-manual-de-marca.pdf`: manual de identidad de 11 páginas |
| `03-publicidad-marketplace` | Anuncio **vertical 1080 × 1350** (foto principal) y **cuadrado 1080 × 1080** (segunda foto); cada uno también en `@2x` |
| `04-redes-sociales` | Foto de perfil 1080 × 1080 (Facebook la recorta en círculo) |
| `05-textos` | `publicacion-marketplace.md`: título, descripción, versión corta y respuestas rápidas |
| `fuente` | Archivos editables y scripts que generan todo lo anterior |

### Versiones del logotipo

- **Horizontal (principal):** `tareita-horizontal-color`, `-negativo`, `-azul`, `-blanco` y `-negro`
- **Horizontal simplificada** (sin descriptor, para tamaños pequeños): `tareita-horizontal-simple-*`
- **Vertical:** `tareita-vertical-color` y `-negativo`
- **Compacta** (perfil, ícono o favicon): `tareita-compacto`, `-circular` y `-claro`
- **Símbolo solo:** `tareita-simbolo-color`, `-negativo` y `-azul`

## Concepto

*Tareita* es el diminutivo de *tarea*. El símbolo es una **t** minúscula cuya
cola sube y se convierte en un **visto bueno ✓** amarillo: recibimos tu tarea y
te la entregamos resuelta. El punto de la *i* del logotipo repite ese amarillo.

## Sistema básico

| Color | HEX | Uso |
|---|---|---|
| Azul Tinta | `#0B1F3A` | Principal |
| Amarillo Lápiz | `#F2B01E` | Acento: precios, llamadas a la acción, el ✓ |
| Blanco | `#FFFFFF` | Base |
| Azul Cuaderno | `#1E4A84` | Secundario |
| Gris Papel | `#EEF2F7` | Fondos de tarjetas |
| Gris Grafito | `#5A6A80` | Textos secundarios |

**Tipografía:** Poppins (titulares y logotipo) + Inter (textos). Ambas son gratuitas en Google Fonts.

## Editar y regenerar

Los textos, colores y medidas están en `fuente/` (`brand.js`, `anuncio.js` y `manual.js`).
Para regenerar todos los archivos:

```bash
cd fuente
npm install
npm i -D playwright && npx playwright install chromium   # solo la primera vez
npm run build
```

Para abrir los HTML editables (`anuncio-marketplace-vertical.html`,
`anuncio-marketplace-cuadrado.html` y `manual-de-marca.html`) en el navegador con
sus fuentes, antes hay que ejecutar `npm install` en `fuente/`.
