import * as THREE from 'three';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {ShaderPass} from 'three/addons/postprocessing/ShaderPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {Flame,GLOW} from './flame.js';

const sm=x=>{x=Math.min(1,Math.max(0,x));return x*x*(3-2*x)};const pr=(a,b,t)=>Math.min(1,Math.max(0,(t-a)/(b-a)));const ez=(a,b,t)=>sm(pr(a,b,t));const lerp=(a,b,x)=>a+(b-a)*x;
const $=id=>document.getElementById(id);
// ---------- render ----------
const R=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});R.setSize(1280,720);R.setPixelRatio(1);R.outputColorSpace=THREE.SRGBColorSpace;R.toneMapping=THREE.NoToneMapping;$('stage').appendChild(R.domElement);
const scene=new THREE.Scene();scene.background=new THREE.Color(0);const cam=new THREE.PerspectiveCamera(40,16/9,.01,100);
const D=1/Math.tan(20*Math.PI/180),AS=16/9,OV=1.14;
const comp=new EffectComposer(R);comp.addPass(new RenderPass(scene,cam));
const bloom=new UnrealBloomPass(new THREE.Vector2(640,360),.42,.45,.86);comp.addPass(bloom);
const grade=new ShaderPass({uniforms:{tDiffuse:{value:null},uT:{value:0},uVig:{value:.55},uFade:{value:0}},vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
 fragmentShader:`uniform sampler2D tDiffuse;uniform float uT,uVig;varying vec2 vUv;float h(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
 void main(){vec3 c=max(texture2D(tDiffuse,vUv).rgb,0.);vec3 k=step(.78,c);c=mix(c,.78+.22*(1.-exp(-(c-.78)/.22)),k);c=clamp(c,0.,1.);c=c*c*(3.-2.*c)*.25+c*.75;vec2 v=vUv-.5;c*=1.-dot(v,v)*uVig*1.6;c+=(h(vUv*vec2(1280.,720.)+fract(uT*7.))-.5)*.016;gl_FragColor=vec4(c,1.);}`});
comp.addPass(grade);comp.addPass(new OutputPass());
// ---------- datos ----------
const cues=await (await fetch('llama/cues.json')).json();
const shots=await (await fetch('llama/shots.json')).json();
const FX=(await import('./shotfx.js')).FX;
const load=(u,srgb)=>new Promise(r=>new THREE.TextureLoader().load(u,t=>{t.colorSpace=srgb?THREE.SRGBColorSpace:THREE.NoColorSpace;t.minFilter=THREE.LinearFilter;r(t)}));
const plateGeo=new THREE.PlaneGeometry(2*AS*OV,2*OV,240,136);
const VS=`uniform sampler2D uDep;uniform float uK;varying vec2 vUv;void main(){vUv=uv;vec3 p=position;float d=texture2D(uDep,uv).r;p.z=d*uK;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`;
const PFS=`uniform sampler2D uTex;uniform float uExp,uRel,uRelR,uSat;uniform vec2 uFl;uniform vec3 uTint,uRelC;varying vec2 vUv;
 void main(){vec3 c=texture2D(uTex,vUv).rgb;c*=uExp*uTint;float l=dot(c,vec3(.299,.587,.114));c=mix(vec3(l),c,uSat);
  vec2 d=(vUv-uFl)*vec2(${AS.toFixed(4)},1.);float g=exp(-dot(d,d)/(uRelR*uRelR));c+=uRelC*g*uRel*(.35+c*1.4);gl_FragColor=vec4(c,1.);}`;
const SH={};
for(const s of shots){const [tex,dep]=await Promise.all([load(`llama/plates/${s.id}.jpg`,true),load(`llama/plates/${s.id}_d.png`,false)]);
  const img=dep.image;const cv=document.createElement('canvas');cv.width=img.width;cv.height=img.height;const g=cv.getContext('2d');g.drawImage(img,0,0);const dd=g.getImageData(0,0,img.width,img.height);
  const u={uTex:{value:tex},uDep:{value:dep},uK:{value:.24},uExp:{value:1},uRel:{value:0},uRelR:{value:.25},uSat:{value:1},uFl:{value:new THREE.Vector2(.5,.4)},uTint:{value:new THREE.Color(1,1,1)},uRelC:{value:new THREE.Color(1,.55,.2)}};
  const m=new THREE.Mesh(plateGeo,new THREE.ShaderMaterial({uniforms:u,vertexShader:VS,fragmentShader:PFS}));m.visible=false;scene.add(m);
  SH[s.id]={...s,mesh:m,u,depthAt:(x,y)=>{const px=Math.min(img.width-1,Math.max(0,Math.round(x*(img.width-1)))),py=Math.min(img.height-1,Math.max(0,Math.round((1-y)*(img.height-1))));return dd.data[(py*img.width+px)*4]/255}}}
// shots -> tiempos absolutos
const SC={};cues.scenes.forEach(s=>SC[s.id]=s);
const list=shots.map((s,i)=>{const sc=SC[s.scene];const nx=shots[i+1];const dur=sc.end-sc.start;const end=(nx&&nx.scene===s.scene)?nx.from:1;return {...s,t0:sc.start+s.from*dur,t1:sc.start+end*dur,sc}});
// ---------- personaje y efectos ----------
const flame=new Flame(scene);flame.light.visible=false;flame.light.castShadow=false;
const NDU=500,dg=new THREE.BufferGeometry();dg.setAttribute('position',new THREE.BufferAttribute(new Float32Array(NDU*3),3));
const dust=new THREE.Points(dg,new THREE.PointsMaterial({map:GLOW(),size:.012,color:0xffd7a0,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,opacity:0}));dust.frustumCulled=false;scene.add(dust);
const rainU={uT:{value:0},uA:{value:0}};
const rain=new THREE.Mesh(new THREE.PlaneGeometry(2,2),new THREE.ShaderMaterial({transparent:true,depthTest:false,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:rainU,
 vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}',
 fragmentShader:`uniform float uT,uA;varying vec2 vUv;float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
 void main(){float r=0.;for(int i=0;i<3;i++){float fi=float(i);vec2 uv=vUv*vec2(70.+fi*40.,2.+fi);uv.x+=uv.y*.08;uv.y+=uT*(2.6+fi);vec2 id=floor(uv);float rn=h(id+fi*13.);
 float x=fract(uv.x)-.5+(rn-.5)*.7;float y=fract(uv.y+rn*7.);r+=smoothstep(.05,0.,abs(x))*smoothstep(0.,.4,y)*smoothstep(1.,.5,y)*step(.62,rn)*(.9-fi*.25);}
 gl_FragColor=vec4(vec3(.55,.65,.85)*r*uA*.5,1.);}`}));rain.renderOrder=10;rain.frustumCulled=false;scene.add(rain);
const ring=new THREE.Mesh(new THREE.RingGeometry(.9,1,96),new THREE.MeshBasicMaterial({color:0xffb050,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,opacity:0,toneMapped:false}));scene.add(ring);
// ---------- HUD ----------
const ov=$('ov');const H={el(html,cls,css){const d=document.createElement('div');d.className=cls||'abs';Object.assign(d.style,css||{});d.innerHTML=html;ov.appendChild(d);return d},flash:$('flash')};
const capData=cues.scenes.flatMap(s=>s.sentences.map(q=>({text:q.text,a:q.start,b:q.end})));
function chunks(s,mx=86){const ps=s.split(/(?<=[.,:;?!…])\s+/);const o=[];let c='';for(const p of ps){if(c&&(c+' '+p).length>mx){o.push(c);c=p}else c=(c+' '+p).trim()}if(c)o.push(c);return o}
capData.forEach(c=>{const ch=chunks(c.text),tot=ch.reduce((a,b)=>a+b.length,0);let acc=c.a;c.parts=ch.map(t=>{const d=(c.b-c.a)*t.length/tot,r={t,a:acc,b:acc+d};acc+=d;return r})});
const ctx={THREE,flame,dust,rainU,ring,H,cam,sm,pr,ez,lerp,D,AS,OV,SH};
for(const k in FX)FX[k].init&&FX[k].init(ctx);
const v=new THREE.Vector3();
window.setTime=(T)=>{
  for(const id in SH)SH[id].mesh.visible=false;flame.g.visible=false;dust.material.opacity=0;rainU.uA.value=0;rainU.uT.value=T;ring.material.opacity=0;H.flash.style.opacity=0;
  for(const k in FX)FX[k].hide&&FX[k].hide(ctx);
  const sh=list.find(s=>T>=s.t0&&T<s.t1);const sc=cues.scenes.find(s=>T>=s.start&&T<s.end)||cues.scenes[cues.scenes.length-1];
  const t=T-sc.start,S=sc.sentences.map(q=>[q.start-sc.start,q.end-sc.start]);
  cam.position.set(0,0,D);cam.fov=40;cam.lookAt(0,0,0);
  if(sh){const P=SH[sh.id];P.mesh.visible=true;const u=pr(sh.t0,sh.t1,T),f=FX[sh.id]||{};
    const place=(fu,fv,lift=0)=>{const z=P.depthAt(fu,fv)*P.u.uK.value;return new THREE.Vector3((fu-.5)*2*AS*OV,(fv-.5)*2*OV+lift,z+.02)};
    const c=f.cam?f.cam(u,t,S):{z:D*.92};cam.position.set(c.x||0,c.y||0,c.z??D);cam.lookAt(c.lx||0,c.ly||0,0);cam.fov=c.fov||40;
    if(c.shake){cam.position.x+=c.shake*Math.sin(T*61)*Math.cos(T*17);cam.position.y+=c.shake*Math.sin(T*53)*Math.cos(T*23)}
    cam.updateProjectionMatrix();
    P.u.uExp.value=1;P.u.uRel.value=0;P.u.uTint.value.setRGB(1,1,1);P.u.uSat.value=1;
    f.update&&f.update({...ctx,P,place,u,t,T,S,sh,sc});
  }else{cam.updateProjectionMatrix();(FX[sc.id]&&FX[sc.id].update)&&FX[sc.id].update({...ctx,t,T,S,sc,u:pr(sc.start,sc.end,T)})}
  // subtítulos
  let html='',o=0;for(const c of capData){if(T<c.a-.05||T>c.b+.3)continue;for(let k=0;k<c.parts.length;k++){const p=c.parts[k],last=k===c.parts.length-1;if(T>=p.a-.02&&T<p.b+(last?.3:0)){o=sm((T-p.a)/.15)*(last?1-sm((T-c.b-.05)/.25):1);html=p.t}}}
  $('cap').textContent=html;$('cap').style.opacity=o;
  grade.uniforms.uT.value=T;
  $('fade').style.opacity=Math.max(1-sm(T/.7),sm((T-(cues.duration-1.6))/1.4));
  comp.render();return true};
window.getInfo=()=>({duration:cues.duration});window.getEvents=()=>[];
window.ready=true;
