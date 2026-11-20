// resumable renderer: node render_frames.js <start> <end> <step>  -> out/frames/fNNNN.png + out/anchors/fNNNN.json
const { chromium } = require('playwright'); const fs = require('fs');
const [,, s0 = '0', s1 = '930', st = '1'] = process.argv;
fs.mkdirSync('out/frames', { recursive: true }); fs.mkdirSync('out/anchors', { recursive: true });
const name = (f) => String(f).padStart(4, '0');
(async () => {
  const todo = []; for (let f = +s0; f < +s1; f += +st) if (!fs.existsSync(`out/anchors/f${name(f)}.json`)) todo.push(f);
  console.log('todo', todo.length);
  if (!todo.length) return;
  const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  page.on('pageerror', (e) => console.log('[err]', e.message));
  await page.goto('http://localhost:8765/index.html?s=' + (process.env.SS || 1));
  await page.waitForFunction(() => window.__ready === true, null, { timeout: 120000 });
  const t0 = Date.now(); let n = 0;
  for (const f of todo) {
    const a = await page.evaluate((t) => window.renderAt(t), f / 30);
    const url = await page.evaluate(() => window.grab());
    fs.writeFileSync(`out/frames/f${name(f)}.png.tmp`, Buffer.from(url.split(',')[1], 'base64'));
    fs.renameSync(`out/frames/f${name(f)}.png.tmp`, `out/frames/f${name(f)}.png`);
    fs.writeFileSync(`out/anchors/f${name(f)}.json`, JSON.stringify(a));
    n++; if (n % 10 === 0) console.log(`frame ${f} ${((Date.now() - t0) / 1000 / n).toFixed(2)}s/frame, done ${n}/${todo.length}`);
  }
  await browser.close(); console.log('DONE');
})();
