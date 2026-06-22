import { test } from '@playwright/test';
import * as fs from 'fs';

const pagesToTest = [
  { name: 'Home', url: '/' },
  { name: 'Soluciones', url: '/servicios' },
  { name: 'Demos', url: '/casos' },
  { name: 'Proceso', url: '/proceso' },
  { name: 'Contacto', url: '/contacto' },
  { name: 'Demo_Automation', url: '/demo/lead-to-ops' },
  { name: 'Demo_B2B', url: '/demo/b2b-saas-platform' },
];

const viewports = [
  { name: 'Mobile', width: 375, height: 812 },
  { name: 'Desktop', width: 1280, height: 720 }
];

const report = {
  startedAt: new Date().toISOString(),
  pages: [] as any[],
  consoleErrors: [] as any[],
  networkErrors: [] as any[],
  brokenLinks: [] as any[],
  overflows: [] as any[]
};

test.afterAll(() => {
  fs.writeFileSync('audit-results.json', JSON.stringify(report, null, 2));
});

for (const p of pagesToTest) {
  for (const vp of viewports) {
    test(`Audit ${p.name} on ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });

      page.on('console', msg => {
        if (msg.type() === 'error' || msg.type() === 'warning') {
          report.consoleErrors.push({ page: p.name, vp: vp.name, type: msg.type(), text: msg.text() });
        }
      });

      page.on('requestfailed', request => {
        report.networkErrors.push({ page: p.name, vp: vp.name, url: request.url(), error: request.failure()?.errorText });
      });

      const response = await page.goto(p.url, { waitUntil: 'load' });
      
      const payload: any = { name: p.name, vp: vp.name, url: p.url, status: response?.status() };
      
      // Basic check for empty sections
      const emptySections = await page.$$eval('section', (sections) => {
         return sections.filter((s: HTMLElement) => s.innerText.trim().length === 0).length;
      });
      if (emptySections > 0) {
         payload.emptySections = emptySections;
      }

      report.pages.push(payload);

      // Take screenshot
      await page.waitForTimeout(500); // Wait for initial reveals
      
      // Scroll to trigger other reveals and take full page
      await page.evaluate(async () => {
         const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
         for (let i = 0; i < document.body.scrollHeight; i += 500) {
            window.scrollTo(0, i);
            await delay(100);
         }
         window.scrollTo(0, 0);
      });
      
      await page.waitForTimeout(500);
      
      await page.screenshot({ path: `screenshots/${p.name}_${vp.name}.png`, fullPage: true });

      // Empty links check
      const emptyLinks = await page.$$eval('a', (els) => els.map((a: HTMLAnchorElement) => a.getAttribute('href')).filter(href => !href || href === '' || href.endsWith('#')));
      if (emptyLinks.length > 0) {
        report.brokenLinks.push({ page: p.name, vp: vp.name, count: emptyLinks.length });
      }

      // Overflow check (horizontal scroll)
      const hasOverflow = await page.evaluate(() => {
        return document.body.scrollWidth > window.innerWidth;
      });
      if (hasOverflow) {
        report.overflows.push({ page: p.name, vp: vp.name });
      }
    });
  }
}
