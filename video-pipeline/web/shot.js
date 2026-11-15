// uso: node shot.js out_prefix t1 t2 t3 ...   (tiempos globales en segundos)
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const mime={'.html':'text/html','.js':'text/javascript','.json':'application/json'};
const srv=http.createServer((q,s)=>{let p=path.join(__dirname,decodeURIComponent(q.url.split('?')[0]));fs.readFile(p,(e,d)=>{if(e){s.writeHead(404);s.end();return}s.writeHead(200,{'content-type':mime[path.extname(p)]||'application/octet-stream'});s.end(d)})}).listen(0,async()=>{
 const port=srv.address().port,[,,prefix,...ts]=process.argv;
 const b=await chromium.launch({args:['--use-angle=swiftshader','--use-gl=angle','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const pg=await b.newPage({viewport:{width:1280,height:720}});
 pg.on('console',m=>console.log('[page]',m.text()));pg.on('pageerror',e=>console.log('[err]',e.message));
 let t0=Date.now();await pg.goto(`http://localhost:${port}/${process.env.PAGE||'index.html'}`);await pg.waitForFunction('window.ready',null,{timeout:180000});console.log('load ms',Date.now()-t0);
 for(const t of ts){t0=Date.now();await pg.evaluate(`setTime(${t})`);await pg.screenshot({path:`${prefix}_${t}.png`});console.log('shot',t,Date.now()-t0,'ms')}
 await b.close();srv.close()});
