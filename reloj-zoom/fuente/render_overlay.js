const { chromium } = require('playwright'); const { spawn } = require('child_process'); const fs = require('fs');
const lang = process.argv[2] || 'en';
const anchors = {}; for (let f = 0; f < 930; f++) { const p = `out/anchors/f${String(f).padStart(4, '0')}.json`; if (fs.existsSync(p)) anchors[f] = JSON.parse(fs.readFileSync(p)); }
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  p.on('pageerror', e => console.log('[err]', e.message));
  await p.goto('http://localhost:8765/overlay.html?s=' + (process.env.OS || 1)); await p.waitForFunction(() => window.__ready === true);
  await p.evaluate(() => document.fonts.load('900 76px Inter'));
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', '30', '-c:v', 'png', '-i', '-', '-c:v', 'qtrle', `out/overlay_${lang}.mov`], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let f = 0; f < 930; f++) {
    const u = await p.evaluate(([t, a, l]) => window.drawOverlay(t, a, l), [f / 30, anchors[f] || {}, lang]);
    const buf = Buffer.from(u.split(',')[1], 'base64');
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await b.close(); console.log('overlay done', lang);
})();
