import * as THREE from 'three';
import {createWorld} from './world.js';
import {SCENES} from './scenes.js';

const renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});
renderer.setSize(1280,720);renderer.setPixelRatio(1);
renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;renderer.outputColorSpace=THREE.SRGBColorSpace;
document.getElementById('stage').appendChild(renderer.domElement);
const W=createWorld(renderer);
const cues=await (await fetch('cues.json')).json();
const $=id=>document.getElementById(id);
const cap=$('cap'),tagEl=$('tag'),fade=$('fade'),prog=$('prog'),layers=$('layers');
const v3=new THREE.Vector3();
const H={proj(p){v3.copy(p).project(W.cam);return {x:(v3.x*.5+.5)*1280,y:(-v3.y*.5+.5)*720,z:v3.z}},
  place(el,x,y){el.style.left=x+'px';el.style.top=y+'px'}};

// escenas: tiempos globales -> locales
const sc=cues.scenes.filter(s=>SCENES.find(d=>d.id===s.id)).map((s,i)=>({...s,def:SCENES.find(d=>d.id===s.id),S:s.sentences.map(q=>[q.start-s.start,q.end-s.start])}));
sc.forEach(s=>{s.layer=document.createElement('div');s.layer.className='layer';layers.appendChild(s.layer);s.def.init&&s.def.init(s.layer,W,H)});

function chunks(sentence,mx=92){const parts=sentence.split(/(?<=[.,:;?!])\s+/);const out=[];let cur='';for(const p of parts){if(cur&&(cur+' '+p).length>mx){out.push(cur);cur=p}else cur=(cur+' '+p).trim()}if(cur)out.push(cur);return out}
const sm=x=>{x=Math.min(1,Math.max(0,x));return x*x*(3-2*x)};
const capData=sc.flatMap(s=>s.sentences.map(q=>({text:q.text,a:q.start,b:q.end})));
capData.forEach(c=>{c.ch=chunks(c.text);const tot=c.ch.reduce((a,b)=>a+b.length,0);let acc=c.a;c.parts=c.ch.map(t=>{const d=(c.b-c.a)*t.length/tot;const r={t,a:acc,b:acc+d};acc+=d;return r})});

window.setTime=(T)=>{
  const i=Math.max(0,sc.findIndex(s=>T>=s.start&&T<s.end));const s=sc[i<0?sc.length-1:i];
  const t=T-s.start,dur=s.end-s.start;
  W.reset();W.starMat.uniforms.uT.value=T;
  sc.forEach(o=>o.layer.style.display=o===s?'block':'none');
  tagEl.querySelector('span').textContent=(s.def.tag||'').toUpperCase();tagEl.querySelector('i').style.width=(36*sm(t/.7))+'px';tagEl.style.opacity=sm(t/.6);
  s.def.update(t,s.S,W,H,{T,dur,start:s.start});
  W.renderer.render(W.scene,W.cam);
  // subtítulos
  let html='',o=0;
  for(const c of capData){if(T<c.a-.05||T>c.b+.3)continue;
    for(let k=0;k<c.parts.length;k++){const p=c.parts[k],last=k===c.parts.length-1;
      if(T>=p.a-.02&&T<p.b+(last?.3:0)){o=sm((T-p.a)/.18)*(last?1-sm((T-c.b-.05)/.25):1);html=p.t;}}}
  cap.textContent=html;cap.style.opacity=o;
  // fundido
  const fi=1-sm(t/.45),fo=sm((t-(dur-.4))/.4);
  fade.style.opacity=Math.max(i===0?1-sm(T/.8):fi,i===sc.length-1?sm((t-(dur-1.6))/1.4):fo);
  prog.style.width=(T/cues.duration*1280)+'px';
  return true;
};
window.getEvents=()=>sc.flatMap(s=>(s.def.sfx?s.def.sfx(s.S,s.end-s.start):[]).map(e=>({...e,t:s.start+e.t})));
window.getInfo=()=>({duration:cues.duration,scenes:sc.map(s=>({id:s.id,start:s.start,end:s.end}))});
window.ready=true;
