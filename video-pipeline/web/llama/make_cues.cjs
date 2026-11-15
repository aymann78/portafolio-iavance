// Tiempos ESTIMADOS (sin voz). Con ElevenLabs se sustituyen por los tiempos reales.
const S=require('./script.json');const fs=require('fs');
let t=0.3;const out={estimated:true,scenes:[]};
for(const sc of S){const start=t;t+=sc.pre||0;const sentences=[];
  for(const l of sc.lines){const w=l.split(/\s+/).length;const pauses=(l.match(/[.,…?:]/g)||[]).length;const d=w/2.25+pauses*.18+.3;sentences.push({text:l,start:t,end:t+d});t+=d+.45}
  t+=sc.hold||.8;out.scenes.push({id:sc.id,tag:sc.tag,start,end:t,sentences})}
out.duration=t;fs.writeFileSync(__dirname+'/cues.json',JSON.stringify(out,null,1));
console.log('duración estimada',t.toFixed(1),'s');out.scenes.forEach(s=>console.log(s.id.padEnd(11),s.start.toFixed(1),'→',s.end.toFixed(1)));
