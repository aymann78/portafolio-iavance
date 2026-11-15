// uso: node still.js <salida.png> '<json cfg>'
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const mime={'.html':'text/html','.js':'text/javascript','.json':'application/json'};
const srv=http.createServer((q,s)=>{let p=path.join(__dirname,decodeURIComponent(q.url.split('?')[0]));fs.readFile(p,(e,d)=>{if(e){s.writeHead(404);s.end();return}s.writeHead(200,{'content-type':mime[path.extname(p)]||'application/octet-stream'});s.end(d)})}).listen(0,async()=>{
 const b=await chromium.launch({args:['--use-angle=swiftshader','--use-gl=angle','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const pg=await b.newPage({viewport:{width:1280,height:720},deviceScaleFactor:1});pg.on('pageerror',e=>console.log('[err]',e.message));pg.on('console',m=>console.log('[page]',m.text()));
 await pg.goto(`http://localhost:${srv.address().port}/flame.html`);await pg.waitForFunction('window.ready',null,{timeout:60000});
 await pg.evaluate(`setup(${process.argv[3]})`);await pg.screenshot({path:process.argv[2]});await b.close();srv.close()});
