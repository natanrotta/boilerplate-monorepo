#!/usr/bin/env node
/**
 * Regenerates the raster companions of the brand mark from
 * `apps/web/public/favicon.svg` (the source of truth, also drawn by
 * `BrandMark`): `favicon.ico` (16 + 32) and `apple-touch-icon.png` (180), for
 * the web app and the site, plus the site's copy of the SVG.
 *
 *   yarn workspace @boilerplate/web gen:icons
 *
 * Rendered with the Playwright Chromium the e2e suite already installs.
 */
import { chromium } from "playwright";
import { copyFileSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const WEB_PUBLIC = resolve(dirname(fileURLToPath(import.meta.url)), "../public");
const SITE_PUBLIC = resolve(WEB_PUBLIC, "../../site/public");
const SOURCE = resolve(WEB_PUBLIC, "favicon.svg");

const svg = readFileSync(SOURCE, "utf8");
const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 1 });

async function png(size) {
  await page.setViewportSize({ width: size, height: size });
  const sized = svg.replace(/width="\d+" height="\d+"/, `width="${size}" height="${size}"`);
  await page.setContent(`<html><body style="margin:0;background:transparent">${sized}</body></html>`);
  return page.screenshot({ omitBackground: true });
}

/** An .ico is a directory of images; modern readers accept PNG payloads as-is. */
function ico(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = 6 + 16 * images.length;
  const entries = images.map(({ size, data }) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size, 0);
    entry.writeUInt8(size, 1);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += data.length;
    return entry;
  });
  return Buffer.concat([header, ...entries, ...images.map((image) => image.data)]);
}

const favicon = ico([
  { size: 16, data: await png(16) },
  { size: 32, data: await png(32) },
]);
const appleTouch = await png(180);
await browser.close();

for (const dir of [WEB_PUBLIC, SITE_PUBLIC]) {
  writeFileSync(resolve(dir, "favicon.ico"), favicon);
  writeFileSync(resolve(dir, "apple-touch-icon.png"), appleTouch);
}
copyFileSync(SOURCE, resolve(SITE_PUBLIC, "favicon.svg"));
process.stdout.write("icons written to apps/web/public and apps/site/public\n");
