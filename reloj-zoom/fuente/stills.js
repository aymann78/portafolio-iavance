const { chromium } = require('playwright'); const fs=require('fs');
const times = process.argv.slice(2).map(Number);
(async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  p.on('pageerror', e => console.log('[err]', e.message)); p.on('console', m => console.log('[page]', m.text()));
  let t0=Date.now(); await p.goto('http://localhost:8765/index.html?s=' + (process.env.SS || 1) + (process.env.Q || ''));
  await p.waitForFunction(() => window.__ready === true, null, { timeout: 180000 }); console.log('setup', (Date.now()-t0)/1000);
  fs.mkdirSync('stills',{recursive:true});
  for (const t of times) { t0=Date.now(); await p.evaluate(t => window.renderAt(t), t); const u = await p.evaluate(() => window.grab('image/jpeg',0.85)); fs.writeFileSync(`stills/s_${t}.jpg`, Buffer.from(u.split(',')[1],'base64')); console.log(t, (Date.now()-t0)/1000+'s'); }
  await b.close();
})();
