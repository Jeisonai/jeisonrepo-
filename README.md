# NexoLab | Soluciones Digitales — Identidad visual

> Conectamos tus ideas con soluciones.

Identidad visual completa de NexoLab: logotipo, manual de marca, publicidad para
Facebook Marketplace y textos comerciales.

## Entregables

| Carpeta | Contenido |
|---|---|
| `01-logotipo/svg` | Logotipos vectoriales (texto convertido a trazos, no requieren fuentes) |
| `01-logotipo/png` | Los mismos logotipos en PNG con fondo transparente |
| `02-manual-de-marca` | `NexoLab-manual-de-marca.pdf`: manual de identidad de 11 páginas |
| `03-publicidad-marketplace` | Imagen para Marketplace: `-1080.png` para publicar y `-2160.png` en alta resolución |
| `04-redes-sociales` | Foto de perfil 1080 × 1080 (Facebook la recorta en círculo) |
| `05-textos` | `publicacion-marketplace.md`: título, descripción, versión corta y respuestas rápidas |
| `fuente` | Archivos editables y scripts que generan todo lo anterior |

### Versiones del logotipo

- **Horizontal (principal):** `nexolab-horizontal-color`, `-negativo`, `-azul`, `-blanco` y `-negro`
- **Horizontal simplificada** (sin descriptor, para tamaños pequeños): `nexolab-horizontal-simple-*`
- **Vertical:** `nexolab-vertical-color` y `-negativo`
- **Compacta** (perfil, ícono o favicon): `nexolab-compacto`, `-circular` y `-claro`
- **Símbolo solo:** `nexolab-simbolo-color`, `-negativo` y `-azul`

## Concepto

El símbolo es un monograma que une la **N** de *Nexo* y la **L** de *Lab*: el
trazo derecho de la N es también el trazo vertical de la L. La **diagonal dorada**
es el nexo entre el lado de la idea y el lado de la solución.

## Sistema básico

| Color | HEX | Uso |
|---|---|---|
| Azul Nexo | `#0B1F3A` | Principal |
| Dorado Lab | `#F2B01E` | Acento: precios, llamadas a la acción, diagonal |
| Blanco | `#FFFFFF` | Base |
| Azul Enlace | `#1E4A84` | Secundario |
| Gris Niebla | `#EEF2F7` | Fondos de tarjetas |
| Gris Pizarra | `#5A6A80` | Textos secundarios |

**Tipografía:** Montserrat (titulares y logotipo) + Inter (textos). Ambas son gratuitas en Google Fonts.

## Editar y regenerar

Los textos, colores y medidas están en `fuente/` (`brand.js`, `anuncio.js` y `manual.js`).
Para regenerar todos los archivos:

```bash
cd fuente
npm install
npm i -D playwright && npx playwright install chromium   # solo la primera vez
npm run build
```

Para abrir los HTML editables (`anuncio-marketplace.html` y `manual-de-marca.html`)
en el navegador con sus fuentes, antes hay que ejecutar `npm install` en `fuente/`.
