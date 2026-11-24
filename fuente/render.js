// Renderiza HTML/SVG a PNG o PDF con Playwright (Chromium).
const path = require('path');
let chromium;
try { ({ chromium } = require('playwright')); } catch (e) {
  console.error('Se requiere Playwright: npm i -D playwright && npx playwright install chromium');
  process.exit(1);
}

let browser;
async function getBrowser() { return browser || (browser = await chromium.launch()); }

async function png(file, out, { width, height, scale = 1, transparent = false } = {}) {
  const b = await getBrowser();
  const page = await b.newPage({ viewport: { width, height }, deviceScaleFactor: scale });
  await page.goto('file://' + path.resolve(file));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(120);
  await page.screenshot({ path: out, omitBackground: transparent, clip: { x: 0, y: 0, width, height } });
  await page.close();
}

async function pngFromHTML(html, out, opts) {
  const b = await getBrowser();
  const page = await b.newPage({ viewport: { width: opts.width, height: opts.height }, deviceScaleFactor: opts.scale || 1 });
  await page.setContent(html);
  await page.waitForTimeout(60);
  await page.screenshot({ path: out, omitBackground: !!opts.transparent, clip: { x: 0, y: 0, width: opts.width, height: opts.height } });
  await page.close();
}

async function pdf(file, out, { width, height }) {
  const b = await getBrowser();
  const page = await b.newPage();
  await page.goto('file://' + path.resolve(file));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(200);
  await page.pdf({ path: out, width: `${width}px`, height: `${height}px`, printBackground: true, pageRanges: '' });
  await page.close();
}

async function close() { if (browser) await browser.close(); browser = null; }

module.exports = { png, pngFromHTML, pdf, close };
