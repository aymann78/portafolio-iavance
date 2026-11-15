// uso: node render.js <in.svg> <out.png> [size] [transparent]
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const [,,inp,out,size='2048',tr]=process.argv;const b=await chromium.launch();const S=+size;
 const pg=await b.newPage({viewport:{width:1000,height:1000},deviceScaleFactor:S/1000});
 await pg.setContent(`<body style="margin:0;background:${tr?'transparent':'#0b0d18'}">${fs.readFileSync(inp,'utf8')}</body>`);
 await pg.screenshot({path:out,omitBackground:!!tr,clip:{x:0,y:0,width:1000,height:1000}});await b.close()})();
