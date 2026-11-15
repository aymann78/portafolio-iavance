// uso: node render.js <chunk> <nChunks> <outDir> [fps]
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path'),{spawn}=require('child_process');
const [,,ci,nc,out,fpsA]=process.argv,CI=+ci,NC=+nc,FPS=+(fpsA||24);
const mime={'.html':'text/html','.js':'text/javascript','.json':'application/json'};
const srv=http.createServer((q,s)=>{let p=path.join(__dirname,decodeURIComponent(q.url.split('?')[0]));fs.readFile(p,(e,d)=>{if(e){s.writeHead(404);s.end();return}s.writeHead(200,{'content-type':mime[path.extname(p)]||'application/octet-stream'});s.end(d)})}).listen(0,async()=>{
 const port=srv.address().port;
 const b=await chromium.launch({args:['--use-angle=swiftshader','--use-gl=angle','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const pg=await b.newPage({viewport:{width:1280,height:720}});pg.on('pageerror',e=>console.log('[err]',e.message));
 await pg.goto(`http://localhost:${port}/${process.env.PAGE||'index.html'}`);await pg.waitForFunction('window.ready',null,{timeout:180000});
 const info=await pg.evaluate('getInfo()');const total=Math.ceil(info.duration*FPS);
 if(CI===0){fs.writeFileSync(path.join(out,'events.json'),JSON.stringify(await pg.evaluate('getEvents()')));fs.writeFileSync(path.join(out,'info.json'),JSON.stringify({...info,fps:FPS,frames:total}))}
 const a=Math.floor(total*CI/NC),z=Math.floor(total*(CI+1)/NC);
 const ff=spawn('ffmpeg',['-y','-loglevel','error','-f','image2pipe','-framerate',String(FPS),'-c:v','mjpeg','-i','-','-c:v','libx264','-preset','veryfast','-crf','20','-pix_fmt','yuv420p',path.join(out,`chunk_${CI}.mp4`)],{stdio:['pipe','inherit','inherit']});
 const t0=Date.now();
 for(let f=a;f<z;f++){await pg.evaluate(`setTime(${(f/FPS).toFixed(4)})`);const buf=await pg.screenshot({type:'jpeg',quality:92});if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r));
  if((f-a)%200===0)console.log(`chunk ${CI}: ${f-a}/${z-a} (${((Date.now()-t0)/1000).toFixed(0)}s)`)}
 ff.stdin.end();await new Promise(r=>ff.on('close',r));console.log(`chunk ${CI} listo en ${((Date.now()-t0)/1000).toFixed(0)}s`);await b.close();srv.close()});
