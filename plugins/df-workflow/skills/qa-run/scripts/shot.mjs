// Digitalfeet QA screenshot + page facts tool.
// Usage: node shot.mjs <url> <outDir> <label> [widths=1440,1024,767,375]
// For each width: full-page PNG <label>-<width>.png, plus <label>-facts.json with
// section ids/names, headings, images (alt, size), links, forms, console errors and
// elements wider than the viewport (horizontal overflow). Uses the installed Microsoft Edge.
import { chromium } from 'playwright-core';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const [url, outDir, label, widthsArg] = process.argv.slice(2);
if (!url || !outDir || !label) {
  console.error('Usage: node shot.mjs <url> <outDir> <label> [widths]');
  process.exit(1);
}
const widths = (widthsArg || '1440,1024,767,375').split(',').map(Number);
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ channel: 'msedge', headless: true });
const facts = { url, widths: {}, consoleErrors: [], failedRequests: [] };

for (const width of widths) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  if (width === widths[0]) {
    page.on('console', m => { if (m.type() === 'error') facts.consoleErrors.push(m.text().slice(0, 300)); });
    page.on('requestfailed', r => facts.failedRequests.push(`${r.url()} ${r.failure()?.errorText || ''}`));
    page.on('response', r => { if (r.status() >= 400) facts.failedRequests.push(`${r.status()} ${r.url()}`); });
  }
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 }).catch(e => facts.loadError = String(e));
  // Remove the Digitalfeet mockup review bar (review-guide.js) and the WP admin bar: not part of the design.
  await page.evaluate(() => { document.querySelectorAll('[data-rg], #wpadminbar').forEach(el => el.remove()); document.documentElement.style.marginTop = '0'; });
  // Scroll through the page so lazy images and entrance animations run, then wait for them.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: join(outDir, `${label}-${width}.png`), fullPage: true });

  facts.widths[width] = await page.evaluate((vw) => {
    const overflow = [...document.querySelectorAll('body *')]
      .filter(el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.right > vw + 1; })
      .slice(0, 15)
      .map(el => `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}.${[...el.classList].slice(0, 3).join('.')} right=${Math.round(el.getBoundingClientRect().right)}`);
    const cs = el => getComputedStyle(el);
    // Top-level sections: Elementor classic containers at the top of the content, or <section> in a mockup.
    const sections = [...document.querySelectorAll('.elementor > .e-con, .elementor > .elementor-section, section')]
      .filter((el, i, a) => a.indexOf(el) === i && !el.parentElement.closest('section, .e-con'))
      .slice(0, 60)
      .map(el => ({
        id: el.id || null,
        classes: [...el.classList].slice(0, 6).join(' '),
        padding: `${cs(el).paddingTop} ${cs(el).paddingRight} ${cs(el).paddingBottom} ${cs(el).paddingLeft}`,
        height: Math.round(el.getBoundingClientRect().height),
        firstHeading: el.querySelector('h1,h2,h3')?.textContent.trim().replace(/\s+/g, ' ').slice(0, 80) || null,
      }));
    return { pageHeight: document.body.scrollHeight, scrollWidth: document.documentElement.scrollWidth, overflow, sections };
  }, width);

  if (width === widths[0]) {
    Object.assign(facts, await page.evaluate(() => {
      const cs = el => getComputedStyle(el);
      return {
        title: document.title,
        metaDescription: document.querySelector('meta[name=description]')?.content || null,
        lang: document.documentElement.lang || null,
        headings: [...document.querySelectorAll('h1,h2,h3,h4')].map(h => `${h.tagName} ${h.textContent.trim().replace(/\s+/g, ' ').slice(0, 100)}`),
        text: document.body.innerText.replace(/\s+/g, ' ').slice(0, 20000),
        elementor: {
          htmlWidgets: document.querySelectorAll('.elementor-widget-html').length,
          classicContainers: document.querySelectorAll('.e-con').length,
          atomicElements: document.querySelectorAll('[class*="e-flexbox"],[class*="e-div-block"],[class*="e-grid"]').length,
          oldSections: document.querySelectorAll('.elementor-section').length,
        },
        images: [...document.images].map(i => ({ src: i.currentSrc || i.src, alt: i.getAttribute('alt'), natural: `${i.naturalWidth}x${i.naturalHeight}`, shown: `${Math.round(i.getBoundingClientRect().width)}x${Math.round(i.getBoundingClientRect().height)}`, broken: i.complete && i.naturalWidth === 0 })),
        links: [...document.querySelectorAll('a[href]')].map(a => ({ text: a.textContent.trim().replace(/\s+/g, ' ').slice(0, 60), href: a.getAttribute('href') })),
        forms: [...document.querySelectorAll('form')].map(f => ({ action: f.getAttribute('action'), onsubmit: f.getAttribute('onsubmit'), classes: f.className, fields: [...f.querySelectorAll('input,textarea,select')].map(x => `${x.tagName.toLowerCase()}[type=${x.type}] name=${x.name || '-'} required=${x.required} placeholder=${x.placeholder || '-'}`) })),
        animations: [...document.querySelectorAll('*')].filter(el => { const s = cs(el); return s.animationName !== 'none' || el.classList.contains('animated') || el.dataset.settings?.includes('animation'); }).slice(0, 30).map(el => `${el.tagName.toLowerCase()}.${[...el.classList].slice(0, 3).join('.')} ${cs(el).animationName}`),
        lottieOrVideo: document.querySelectorAll('lottie-player, .elementor-widget-lottie, video, img[src$=".gif"], img[src$=".webp"]').length,
      };
    }));
  }
  await page.close();
}
await browser.close();
writeFileSync(join(outDir, `${label}-facts.json`), JSON.stringify(facts, null, 2));
console.log(`Saved ${widths.length} screenshots and ${label}-facts.json to ${outDir}`);
