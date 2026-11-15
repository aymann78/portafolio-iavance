import * as THREE from 'three';
import {rng,fbm} from './world.js';

// ---------- utilidades ----------
const sm=x=>{x=Math.min(1,Math.max(0,x));return x*x*(3-2*x)};
const pr=(a,b,t)=>Math.min(1,Math.max(0,(t-a)/(b-a)));
const ez=(a,b,t)=>sm(pr(a,b,t));
const lerp=(a,b,x)=>a+(b-a)*x;
const V=(a,b,c)=>new THREE.Vector3(a,b,c);
const fmt=(n,d=0)=>n.toLocaleString('de-DE',{minimumFractionDigits:d,maximumFractionDigits:d});
function K(t,keys){ if(t<=keys[0][0])return keys[0][1]; const n=keys.length; if(t>=keys[n-1][0])return keys[n-1][1];
  for(let i=0;i<n-1;i++){const [t0,a]=keys[i],[t1,b]=keys[i+1];if(t<=t1){const x=sm((t-t0)/(t1-t0));return Array.isArray(a)?a.map((v,j)=>lerp(v,b[j],x)):lerp(a,b,x)}}}
function el(layer,cls,css,html){const d=document.createElement('div');d.className='abs '+(cls||'');Object.assign(d.style,css||{});if(html!==undefined)d.innerHTML=html;layer.appendChild(d);return d}
function show(e,o,x,y){e.style.opacity=o;if(x!==undefined){e.style.left=x+'px';e.style.top=y+'px'}}
function svg(layer,css){const s=document.createElementNS('http://www.w3.org/2000/svg','svg');s.setAttribute('width',1280);s.setAttribute('height',720);Object.assign(s.style,css||{});layer.appendChild(s);return s}
function lineDom(e,p,q,th=3){const dx=q.x-p.x,dy=q.y-p.y,L=Math.hypot(dx,dy);Object.assign(e.style,{left:p.x+'px',top:(p.y-th/2)+'px',width:L+'px',height:th+'px',transformOrigin:'0 50%',transform:`rotate(${Math.atan2(dy,dx)}rad)`})}
function shake(W,amp,t){W.cam.position.x+=amp*Math.sin(t*61)*Math.cos(t*17);W.cam.position.y+=amp*Math.sin(t*53+1)*Math.cos(t*23);}
function P2(c){return (3*c*c-1)/2}
function flicker(t,t0,t1){ // visible? durante [t0,t1) parpadea con frecuencia creciente
  if(t<t0)return true; if(t>=t1)return false; const u=(t-t0)/(t1-t0); return Math.sin(t*(40+90*u))>-0.1+0.9*u*0}
function flashAt(W,pos,scale,op){W.flash.visible=op>0.001;W.flash.position.copy(pos);W.flash.scale.setScalar(scale);W.flash.material.opacity=Math.min(1,op)}
function shockAt(W,pos,scale,op){W.shock.visible=op>0.001;W.shock.position.copy(pos);W.shock.quaternion.copy(W.cam.quaternion);W.shock.scale.setScalar(scale);W.shock.material.opacity=op}
function setSun(W,pos,scale,glowK=1){W.sunObj.visible=true;W.sunObj.position.copy(pos);W.sunMesh.scale.setScalar(scale);
  W.sunGlow.scale.setScalar(scale*7);W.sunGlow2.scale.setScalar(scale*18);W.sunGlow.material.opacity=glowK;W.sunGlow2.material.opacity=.55*glowK;W.corona.scale.setScalar(scale*11)}
function groundCam(W,pos,look,fov=50){W.cam.fov=fov;W.cam.updateProjectionMatrix();W.cam.position.copy(pos);W.cam.lookAt(look)}
const bigTitle=(layer,txt,css)=>el(layer,'big',Object.assign({left:'0',width:'1280px',textAlign:'center',fontSize:'58px',opacity:0},css||{}),txt);
const EARTH_ROT=0.12;

// ---------- tabla del día ----------
const DAY=[[4500,5],[4000,7.5],[3000,14],[2000,18.7],[1000,19.4],[620,21.9],[400,22.2],[0,24]];
function dayHours(ma){for(let i=0;i<DAY.length-1;i++){const [a,ha]=DAY[i],[b,hb]=DAY[i+1];if(ma<=a&&ma>=b){return lerp(ha,hb,(a-ma)/(a-b))}}return 24}

// ---------- órbita de escombros (impacto) ----------
let DEBRIS=null;
function buildDebris(dur,N){
  const r=rng(31),steps=Math.ceil(dur*24)+2,GM=430;const C=V(4.1,.4,0);const pos=new Float32Array(steps*N*3);
  const p=[],v=[];for(let i=0;i<N;i++){const u=V(r()*2-1,r()*2-1,r()*2-1).normalize();const d=V(.55,.1,0).add(u.multiplyScalar(.9)).normalize();
    p.push(C.clone().add(V(r()-.5,r()-.5,r()-.5).multiplyScalar(1.4)));const sp=5+r()*10;const vv=d.multiplyScalar(sp);vv.add(V(0,0,1).multiplyScalar(2+r()*5*(r()<.5?1:-1)));v.push(vv)}
  const alive=new Uint8Array(N).fill(1);const sub=6,dt=1/24/sub;
  for(let s=0;s<steps;s++){for(let i=0;i<N;i++){const o=(s*N+i)*3;pos[o]=p[i].x;pos[o+1]=p[i].y;pos[o+2]=p[i].z}
    for(let k=0;k<sub;k++)for(let i=0;i<N;i++){if(!alive[i])continue;const q=p[i],d2=q.lengthSq(),d=Math.sqrt(d2);if(d<3.05){alive[i]=0;continue}
      const a=-GM/(d2*d);v[i].addScaledVector(q,a*dt);q.addScaledVector(v[i],dt)}}
  return {pos,N,steps};
}

// =====================================================================
export const SCENES=[

// ---------------------------------------------------------------- 1. HOOK
{id:'hook',tag:'Esta noche',
 init(L){this.clock=el(L,'mono amber',{right:'56px',top:'28px',fontSize:'46px',fontWeight:800,opacity:0});
  this.cnt=el(L,'mono',{left:'0',width:'1280px',textAlign:'center',top:'86px',fontSize:'34px',fontWeight:800,color:'#fff0c0',opacity:0});
  this.cnt2=el(L,'muted',{left:'0',width:'1280px',textAlign:'center',top:'56px',fontSize:'20px',letterSpacing:'4px',fontWeight:700,opacity:0},'ÚLTIMA LUZ DE LA LUNA VIAJANDO HACIA LA TIERRA');
  this.t1=bigTitle(L,'¿QUÉ PASARÍA SI',{top:'66px',fontSize:'60px'});this.t2=bigTitle(L,'<span class=red>LA LUNA DESAPARECIERA?</span>',{top:'136px',fontSize:'60px'});
  this.line=el(L,'',{left:'170px',top:'512px',width:'940px',height:'4px',background:'rgba(150,168,196,.35)',opacity:0});
  this.dot=el(L,'',{top:'503px',width:'22px',height:'22px',borderRadius:'50%',background:'#50e1cd',boxShadow:'0 0 18px #50e1cd',opacity:0});
  const names=['1,3 s','1ª noche','1ª semana','1 millón de años','MUCHO MÁS TARDE'];this.nodes=names.map((n,i)=>{const x=170+i*235;
    const e=el(L,'',{left:(x-90)+'px',top:'532px',width:'180px',textAlign:'center',fontSize:'18px',fontWeight:700,color:i==4?'#ff6060':'#96a8c4',opacity:0},n);return {e,x}})},
 cuesT(S){return {vanish:S[1][1]-.4,p0:S[2][0]+.8}},
 update(t,S,W){const {vanish,p0}=this.cuesT(S);
  W.earth.visible=W.moon.visible=true;W.setSunDir(V(.45,.12,.88));
  W.earthBody.rotation.y=t*EARTH_ROT;W.clouds.rotation.y=t*EARTH_ROT*1.3;
  const M=V(14,0,0);const sw=pr(0,vanish,t);
  W.moonMesh.visible=flicker(t,vanish-1.3,vanish);W.moonGlow.material.opacity=t<vanish?.28:0;W.moonGlow.scale.setScalar(3.8);W.moon.rotation.y=t*.03;
  let cp,la;
  if(t<vanish+.9){cp=V(14.4,.15,lerp(3.5,2.7,sw));la=M.clone();cp.x+=Math.sin(t*.5)*.1;cp.y+=Math.cos(t*.4)*.06}
  else{const f=ez(vanish+.9,S[3][0]-.5,t);cp=new THREE.Vector3().lerpVectors(V(14.4,.15,2.7),V(5.5,1.6,15.5),f);la=new THREE.Vector3().lerpVectors(M,V(1.2,1.4,0),f)}
  if(t>=S[3][0]-.5){const u=t-(S[3][0]-.5);cp=V(5.5+Math.sin(u*.12)*1.2,1.6+Math.sin(u*.17)*.5,15.5-u*.06);la=V(1.2,1.4,0)}
  W.cam.position.copy(cp);if(t>vanish)shake(W,.13*Math.exp(-(t-vanish)*3.2),t);W.cam.lookAt(la);
  if(t>=vanish){const u=t-vanish;flashAt(W,M,5*(1+u*1.2),.9*Math.pow(1-pr(0,.9,u),2));shockAt(W,M,.6+u*7,.9*(1-pr(0,1.7,u)))}
  const pa=pr(p0,p0+1.28,t);if(pa>0&&pa<1){W.pulse.visible=true;W.pulse.position.lerpVectors(M,V(3.15,0,0),pa);W.pulse.scale.setScalar(.8);W.pulse.material.opacity=1}
  if(t>=p0+1.28&&t<p0+2.2){const u=t-p0-1.28;flashAt(W,V(3.4,0,0),6*(1+u*2),.8*(1-pr(0,.9,u)))}
  // HUD
  const left=Math.max(0,S[0][1]-t),ck=this.clock;ck.style.opacity=ez(.3,.9,t)*(1-ez(S[2][0],S[2][0]+.5,t));
  ck.innerHTML=left>0?`23:59:${String(Math.max(0,Math.ceil(left)%60)).padStart(2,'0')}`:`<span class=red>00:00:00</span>`;
  const ca=t>=p0&&t<S[3][0]?1:0;this.cnt.style.opacity=ca*ez(p0,p0+.4,t);this.cnt2.style.opacity=ca*ez(p0,p0+.4,t);
  const el_=Math.min(1.28,Math.max(0,t-p0));this.cnt.innerHTML=`${fmt(el_,2)} s`+(el_>=1.28?'  <span class=red>FIN</span>':'');
  const s4=S[3][0]+.3,o1=ez(s4,s4+.7,t);this.t1.style.opacity=o1;this.t2.style.opacity=ez(s4+.5,s4+1.2,t);
  const ap=ez(s4+3.2,S[3][1]-.3,t);this.line.style.opacity=ez(s4+2.5,s4+3.2,t);this.dot.style.opacity=ez(s4+2.5,s4+3.2,t);this.dot.style.left=(159+ap*940)+'px';
  this.nodes.forEach((n,i)=>{n.e.style.opacity=ez(s4+2.6+i*.25,s4+3.3+i*.25,t)*(i==4?.6+.4*Math.sin(t*6):1)});
 },
 sfx(S,dur){const {vanish,p0}=this.cuesT(S);const e=[{k:'whoosh',t:.15,d:1.4,g:.6},{k:'hum',t:.4,d:vanish-.4,g:.5}];
  for(let s=1;s<=Math.floor(S[0][1]);s++)e.push({k:'tick',t:s*1,g:.7});
  e.push({k:'riser',t:vanish-3.2,d:3.2,g:.8},{k:'crackle',t:vanish-1.4,d:1.4,g:.6},{k:'boom',t:vanish,g:1.2},{k:'whoosh',t:vanish,d:1.6,g:.9},
   {k:'whoosh',t:vanish+1,d:2.4,g:.7},{k:'zap',t:p0,d:1.28,g:.7},{k:'ping',t:p0+1.28,g:.8},{k:'hit',t:S[3][0]+.3,g:1.1});
  for(let i=0;i<5;i++)e.push({k:'blip',t:S[3][0]+3.3+i*.25,g:.4,p:1+i*.12});return e}},

// ---------------------------------------------------------------- 2. ORIGEN
{id:'origen',tag:'Qué es la Luna',
 init(L,W,H){this.h=H;
  this.title=bigTitle(L,'LA LUNA',{top:'110px',fontSize:'74px'});this.sub=el(L,'muted',{left:'0',width:'1280px',textAlign:'center',top:'200px',fontSize:'26px',fontWeight:700,opacity:0},'EL SATÉLITE MÁS GRANDE PARA SU PLANETA');
  this.br1=el(L,'',{background:'#50e1cd',opacity:0});this.br2=el(L,'',{background:'#50e1cd',opacity:0});this.l1=el(L,'teal',{fontSize:'26px',fontWeight:800,opacity:0,textAlign:'center',width:'260px'});this.l2=el(L,'teal',{fontSize:'26px',fontWeight:800,opacity:0,textAlign:'center',width:'260px'});
  this.quarter=el(L,'big amber',{left:'0',width:'1280px',top:'120px',fontSize:'88px',opacity:0},'¼');
  this.cnt=el(L,'mono amber',{left:'0',width:'1280px',textAlign:'center',top:'86px',fontSize:'42px',fontWeight:800,opacity:0});
  this.cnt2=el(L,'big',{left:'0',width:'1280px',top:'142px',fontSize:'30px',opacity:0,color:'#50e1cd'});
  this.flash=el(L,'',{left:0,top:0,width:'1280px',height:'720px',background:'#fff',opacity:0});
  this.lbT=el(L,'',{fontSize:'22px',fontWeight:700,color:'#ffbe50',opacity:0,width:'320px',textAlign:'center'},'UN CUERPO DEL TAMAÑO DE MARTE');
  this.lbE=el(L,'',{fontSize:'22px',fontWeight:700,color:'#50e1cd',opacity:0,width:'260px',textAlign:'center'},'TIERRA RECIÉN NACIDA');
  this.when=el(L,'mono amber',{left:'0',width:'1280px',textAlign:'center',top:'70px',fontSize:'34px',fontWeight:800,opacity:0});
  this.born=el(L,'big',{left:'0',width:'1280px',top:'130px',fontSize:'60px',opacity:0,color:'#fff'},'NACE LA LUNA');
  const dur=40;DEBRIS=buildDebris(dur,1600)},
 cuesT(S){const a=S[2][0],b=S[2][1],d=b-a;return {A:S[1][0],B:S[1][0]+(S[1][1]-S[1][0])*.48,ti:a+d*.4,tc:a+d*.66,dur3:d}},
 update(t,S,W,H){const c=this.cuesT(S);const L=[this.br1,this.br2,this.l1,this.l2,this.quarter,this.cnt,this.cnt2,this.lbT,this.lbE,this.when,this.born,this.title,this.sub].forEach(e=>e.style.opacity=0);
  this.flash.style.opacity=0;
  W.earth.visible=false;W.moon.visible=true;
  if(t<S[1][0]){ // hero Luna
    W.setSunDir(V(-.7,.25,.8));W.moon.position.set(0,0,0);W.moonMesh.rotation.y=t*.12;const z=lerp(4.1,3.2,pr(0,S[1][0],t));
    W.cam.position.set(Math.sin(t*.15)*.5,.9,z+.5);W.cam.lookAt(0,.75,0);W.moon.scale.setScalar(1.0);
    this.title.style.opacity=ez(.3,1,t);this.sub.style.opacity=ez(1.5,2.3,t)*.9;this.title.style.top='62px';this.sub.style.top='148px';
  }else if(t<c.B){ // proporciones
    W.setSunDir(V(.3,.2,.9));W.earth.visible=true;W.earth.position.set(-4.2,0,0);W.moon.position.set(3.4,0,0);
    W.earthBody.rotation.y=t*EARTH_ROT;W.clouds.rotation.y=t*EARTH_ROT*1.3;W.moonMesh.rotation.y=t*.1;W.cam.position.set(0,0,15.5);W.cam.lookAt(0,0,0);
    const u=t-S[1][0];const p1=H.proj(V(-4.2,-3.0,0)),p2=H.proj(V(3.4,-R_M(),0));
    const a1=ez(.4,1.1,u),a2=ez(1.3,2.0,u);
    const e1=H.proj(V(-4.2,3.15,0)),e2=H.proj(V(-4.2,-3.15,0));
    Object.assign(this.br1.style,{left:(e1.x-250)+'px',top:e1.y+'px',width:'4px',height:(e2.y-e1.y)*a1+'px',opacity:a1});
    this.l1.style.cssText+=`;left:${e1.x-465}px;top:${(e1.y+e2.y)/2-14}px;opacity:${a1};text-align:right`;this.l1.textContent='Ø 12.742 km';
    const m1=H.proj(V(3.4,R_M(),0)),m2=H.proj(V(3.4,-R_M(),0));
    Object.assign(this.br2.style,{left:(m1.x+80)+'px',top:m1.y+'px',width:'4px',height:(m2.y-m1.y)*a2+'px',opacity:a2});
    this.l2.style.cssText+=`;left:${m1.x+95}px;top:${(m1.y+m2.y)/2-14}px;opacity:${a2};text-align:left`;this.l2.textContent='Ø 3.474 km';
    this.quarter.style.opacity=ez(2.6,3.3,u);this.quarter.style.top='150px';
  }else if(t<S[2][0]){ // distancia real
    W.setSunDir(V(.3,.35,.9));const u=pr(c.B,S[2][0]-.2,t);const f=ez(0,1,u);const camx=lerp(-9,181-12,f);
    W.earth.visible=true;W.earth.position.set(0,0,0);W.earthBody.rotation.y=t*EARTH_ROT;W.clouds.rotation.y=t*EARTH_ROT*1.3;
    W.moon.position.set(181.2,0,0);W.moon.scale.setScalar(1);
    W.cam.position.set(camx,9,24);W.cam.lookAt(camx+16,0,0);
    const n=Math.min(29,Math.floor(f*30));W.ghosts.forEach((g,i)=>{g.visible=i>=1&&i<=29;g.position.set(6*i,0,0);g.material.opacity=(i<=n&&i>=1)?.38:0});
    this.cnt.innerHTML=`${fmt(Math.floor(f*381200+3200))} km`;this.cnt.style.opacity=1;this.cnt.style.color='#ffbe50';
    this.cnt2.textContent=`${Math.min(30,Math.floor(f*30.2)+1)} Tierras cabrían entre las dos`;this.cnt2.style.opacity=1;
  }else{ // impacto
    const u=t-S[2][0],ti=c.ti-S[2][0],tc=c.tc-S[2][0],d3=c.dur3;W.setSunDir(V(-.3,.4,1));
    W.earth.visible=true;W.earth.position.set(0,0,0);W.earthBody.rotation.y=t*.04;W.clouds.visible=false;W.atmo.material.uniforms.uK.value=.3;
    const C=V(4.1,.4,0);W.cam.position.set(7+Math.sin(u*.12)*2.5,4.5,20-u*.12);W.cam.lookAt(5,0,0);
    // Theia
    W.theia.visible=u<ti+.5;const ap=pr(0,ti,u);W.theia.position.set(lerp(21,4.1,Math.pow(ap,1.5)),lerp(2.8,.4,ap),0);W.theia.scale.setScalar(u<ti?1:Math.max(0,1-(u-ti)/.45));W.theia.rotation.y=u*.5;
    // magma
    const mg=u<ti?0:lerp(.75,.1,pr(ti,d3*.9,u));W.magma.visible=true;W.magma.material.opacity=mg;
    if(u>=ti)shake(W,.35*Math.exp(-(u-ti)*2.2),u);
    if(u>=ti){const q=u-ti;flashAt(W,C,11*(1+q*.7),.95*Math.pow(1-pr(0,1.2,q),2));shockAt(W,C,1+q*4.5,.55*(1-pr(0,1.6,q)))}
    // escombros
    if(u>=ti){const q=Math.min(DEBRIS.steps-2,Math.floor((u-ti)*24)),fr=(u-ti)*24-q;W.debris.visible=true;
      const arr=W.debris.geometry.attributes.position.array,N=DEBRIS.N,w=ez(tc-ti,d3-ti-.6,u-ti);const MT=V(14,0,0);const r=rng(4);
      for(let i=0;i<N;i++){const o=(q*N+i)*3,o2=((q+1)*N+i)*3;let x=lerp(DEBRIS.pos[o],DEBRIS.pos[o2],fr),y=lerp(DEBRIS.pos[o+1],DEBRIS.pos[o2+1],fr),z=lerp(DEBRIS.pos[o+2],DEBRIS.pos[o2+2],fr);
        const a=r()*6.28,rr=Math.sqrt(r())*.8;const tx=MT.x+Math.cos(a)*rr,ty=(r()-.5)*1.4*Math.sqrt(r()),tz=Math.sin(a)*rr;
        // órbita intermedia (anillo) antes de unirse
        arr[i*3]=lerp(x,tx,w);arr[i*3+1]=lerp(y,ty,w);arr[i*3+2]=lerp(z,tz,w)}
      W.debris.geometry.attributes.position.needsUpdate=true;W.debrisMat.opacity=1-ez(d3-.9,d3-.2,u)*.0;W.debrisMat.color.setHex(0xffa050).lerp(new THREE.Color(0xb8b8c0),w);W.debrisMat.size=lerp(.16,.1,w)}
    // Luna nueva
    const ms=ez(d3*.78,d3*.96,u);W.moon.position.set(14,0,0);W.moon.scale.setScalar(Math.max(.001,ms));W.moon.visible=ms>0.01;
    W.moonGlow.material.opacity=0;
    if(u>ti+.5){W.orbit.visible=false}
    // HUD
    const A=H.proj(V(W.theia.position.x,W.theia.position.y+2.1,0));this.lbT.style.cssText+=`;left:${A.x-160}px;top:${A.y-10}px;opacity:${u<ti?ez(.3,.9,u):0}`;
    const B=H.proj(V(0,3.8,0));this.lbE.style.cssText+=`;left:${B.x-130}px;top:${B.y-30}px;opacity:${u<ti?ez(1.2,1.8,u):0}`;
    this.when.style.opacity=ez(0,.8,u);this.when.innerHTML=`HACE ${fmt(4500)} MILLONES DE AÑOS`;
    this.born.style.opacity=ez(d3*.93,d3*.99,u);
  }
 },
 sfx(S,dur){const c=this.cuesT(S);const e=[{k:'whoosh',t:.2,d:1.2,g:.6},{k:'blip',t:1.6,g:.5,p:1.1},{k:'blip',t:2.0,g:.5,p:1.3}];
  const a=S[1][0];e.push({k:'blip',t:a+.4,g:.5,p:1},{k:'blip',t:a+1.3,g:.5,p:1.2},{k:'hit',t:a+2.6,g:.8});
  e.push({k:'whoosh',t:c.B,d:1.2,g:.9});for(let i=1;i<=29;i++)e.push({k:'tick',t:c.B+.5+(S[2][0]-.2-c.B-.5)*(i/29)*.97,g:.35,p:1.5+i*.02});
  const a3=S[2][0];e.push({k:'rumble',t:a3,d:c.ti-a3+.3,g:.9},{k:'riser',t:c.ti-3.2,d:3.2,g:.8},{k:'boom',t:c.ti,g:1.5},{k:'hit',t:c.ti,g:1.2},{k:'crackle',t:c.ti,d:5,g:.8},
   {k:'whoosh',t:c.ti+.5,d:3,g:.8},{k:'sparkle',t:c.tc,d:S[2][1]-c.tc-.5,g:.7},{k:'ding',t:S[2][1]-1.3,g:.9});return e}},

// ---------------------------------------------------------------- 3. NOCHE
{id:'noche',tag:'La primera noche',
 init(L,W,H){this.h=H;
  this.title=bigTitle(L,'PRIMERA NOCHE',{top:'130px',fontSize:'62px'});
  this.p1=el(L,'',{left:'300px',top:'220px',width:'680px',opacity:0});
  this.bar1=el(L,'',{left:'0',top:'44px',height:'30px',background:'linear-gradient(90deg,#9fb4ff,#fff)',borderRadius:'6px',width:'0px'});this.bar2=el(L,'',{left:'0',top:'144px',height:'30px',background:'#ff6060',borderRadius:'6px',width:'0px'});
  this.p1.appendChild(this.bar1);this.p1.appendChild(this.bar2);
  this.lb1=el(L,'',{left:'300px',top:'250px',fontSize:'24px',fontWeight:800,opacity:0},'LUNA LLENA   ≈ 0,25 lux');this.lb2=el(L,'red',{left:'300px',top:'350px',fontSize:'24px',fontWeight:800,opacity:0},'SIN LUNA   ≈ 0,002 lux');
  this.nt=el(L,'muted',{left:'300px',top:'400px',fontSize:'17px',opacity:0},'(escala logarítmica · solo luz de estrellas)');
  this.cal=el(L,'',{left:'190px',top:'124px',width:'900px',opacity:0});
  this.dots=[];for(let i=0;i<29;i++){const d=el(this.cal,'',{left:(i*31)+'px',top:'0px',width:'18px',height:'18px',borderRadius:'50%',background:'#324060'});this.dots.push(d)}
  this.day=el(L,'mono teal',{left:'0',width:'1280px',textAlign:'center',top:'66px',fontSize:'30px',fontWeight:800,opacity:0});
  this.lab=el(L,'big',{left:'0',width:'1280px',top:'440px',fontSize:'30px',color:'#ffd2f0',opacity:0},'DESOVE SINCRONIZADO CON LA LUNA LLENA');
  this.nl=el(L,'big red',{left:'0',width:'1280px',top:'440px',fontSize:'34px',opacity:0},'SIN SEÑAL: EL CALENDARIO SE ROMPE');
  this.x400=el(L,'big amber',{left:'0',width:'1280px',top:'90px',fontSize:'110px',opacity:0},'400×');
  this.xs=el(L,'',{left:'0',width:'1280px',textAlign:'center',top:'215px',fontSize:'24px',fontWeight:700,opacity:0,color:'#e8f0ff'},'el Sol es 400 veces más grande · y 400 veces más lejos');
  this.nz=el(L,'big red',{left:'0',width:'1280px',top:'120px',fontSize:'42px',opacity:0},'FIN DE LOS ECLIPSES TOTALES');
 },
 cuesT(S){return {vS:S[0][0]+2.4,ph0:S[2][0]+.3,ph1:S[2][1]-3.2,eStart:S[3][0]+.5,eEnd:S[3][1]-4.3}},
 update(t,S,W,H){const c=this.cuesT(S);[this.title,this.p1,this.lb1,this.lb2,this.nt,this.cal,this.day,this.lab,this.nl,this.x400,this.xs,this.nz].forEach(e=>e.style.opacity=0);
  if(t<S[2][0]){ // paisaje
    W.land.visible=true;W.city.visible=false;W.moon.visible=true;
    const mv=t<c.vS?1:0;const intens=mv*(t<c.vS-1?1:.4+.6*(Math.sin(t*50)>0?1:.2));
    const dark=t>=c.vS?0:1;W.sun.color.set(0xb8cdff);W.sun.intensity=3.6*dark*(t<c.vS-1?1:Math.sin(t*55)>-.2?1:.2);W.amb.intensity=lerp(1.1,.14,ez(c.vS,c.vS+1.2,t));W.amb.color.set(0x35508a);
    W.setSunDir(V(.15,.38,.92));W.scene.fog=new THREE.FogExp2(0x05080f,.006);W.scene.background=new THREE.Color(0x03050c);
    W.starMat.uniforms.uGain.value=lerp(.8,1.9,ez(c.vS,c.vS+1.5,t));
    W.moon.position.set(4.6,5.2,-12);W.moon.scale.setScalar(2.1);W.moonMesh.visible=t<c.vS;W.moonGlow.material.opacity=t<c.vS?.3:0;W.moonGlow.scale.setScalar(9);
    W.moon.lookAt(W.cam.position);W.cam.position.set(Math.sin(t*.12)*.7,.2,0);W.cam.lookAt(1.5+Math.sin(t*.1),3.0,-14);W.cam.fov=52;W.cam.updateProjectionMatrix();
    if(t>=c.vS){const u=t-c.vS;flashAt(W,V(4.6,5.2,-12),9*(1+u),.7*Math.pow(1-pr(0,.9,u),2))}
    this.title.style.opacity=ez(.3,1,t)*(1-ez(5,5.8,t));
    // lux
    const u=t-S[1][0];if(u>-.2){this.p1.style.opacity=1;this.lb1.style.opacity=ez(.2,.8,u);this.lb2.style.opacity=ez(2.2,2.8,u);this.nt.style.opacity=ez(3,3.6,u);
      this.bar1.style.width=(660*ez(.3,1.5,u))+'px';this.bar2.style.width=(6*ez(2.4,3.0,u))+'px';this.p1.style.top='280px';this.lb1.style.top='250px';this.lb2.style.top='350px';this.bar2.style.top='80px';this.bar1.style.top='0px';this.bar2.style.top='100px';this.p1.style.top='282px'}
  }else if(t<S[3][0]){ // fases + desove
    W.setSunDir(V(0,0,1));W.moon.position.set(0,0,0);W.moon.scale.setScalar(1.5);W.moon.visible=true;W.cam.position.set(0,0,5.6);W.cam.lookAt(0,-.3,0);
    const u=t-c.ph0,tot=c.ph1-c.ph0;const ph=pr(0,tot,u);const a=Math.PI+ph*Math.PI*2;
    W.setSunDir(V(Math.sin(a),.12,Math.cos(a)));W.moon.rotation.y=0;W.moonMesh.rotation.y=.8;W.sun.color.set(0xfff6e8);
    const gone=t>=c.ph1;W.moon.visible=!gone||flicker(t,c.ph1,c.ph1+.3);W.moonMesh.visible=!(gone&&t>c.ph1+.3);
    W.amb.intensity=.3;W.amb.color.set(0x3a4f80);W.moonGlow.material.opacity=0;
    const full=.5;const day=Math.min(29,Math.floor(ph*29)+1);
    this.cal.style.opacity=ez(0,.8,u)*(gone?1:1);this.day.style.opacity=ez(0,.8,u);this.day.textContent=gone?'':`DÍA ${day} / 29`;
    this.dots.forEach((d,i)=>{d.style.background=gone?'#ff6060':(i<day-1?'#50e1cd':(i==day-1?'#ffffff':'#324060'));d.style.boxShadow=(i==day-1&&!gone)?'0 0 14px #fff':'none';d.style.opacity=gone?(.4+.3*Math.sin(t*5+i)):1});
    // huevos: nacen alrededor de la luna llena
    const tf=c.ph0+tot*full;const pos=W.dust.geometry.attributes.position.array,N=W.dustN;const r=rng(17);let vis=0;
    W.dust.visible=true;W.dustMat.color.setHex(0xffd2f0);W.dustMat.size=.16;
    for(let i=0;i<N;i++){const birth=tf-.2+r()*2.4,x=(r()-.5)*7,z=(r()-.5)*3-1,sp=.5+r()*.7,sw=r()*6.28;const age=t-birth;
      if(age<0||age>6||t>c.ph1){pos[i*3]=0;pos[i*3+1]=-50;pos[i*3+2]=0;continue}
      pos[i*3]=x+Math.sin(age*1.3+sw)*.25;pos[i*3+1]=-3.4+age*sp;pos[i*3+2]=z;vis++}
    W.dust.geometry.attributes.position.needsUpdate=true;W.dustMat.opacity=.95;
    this.lab.style.opacity=ez(tf,tf+.8,t)*(1-ez(c.ph1-.8,c.ph1,t));this.nl.style.opacity=ez(c.ph1+.5,c.ph1+1.2,t);
  }else{ // eclipse
    const u=t-c.eStart;W.moon.visible=true;W.cam.position.set(0,0,0);W.cam.lookAt(0,0,-1);W.cam.fov=4;W.cam.updateProjectionMatrix();
    W.setSunDir(V(0,0,-1));W.sun.intensity=3.2;W.amb.intensity=.02;setSun(W,V(0,0,-400),3.6,.9);W.sunGlow.scale.setScalar(26);W.sunGlow2.scale.setScalar(70);
    W.moon.visible=true;const cross=pr(0,c.eEnd-c.eStart,t-c.eStart);const w=cross*2-1;const xa=.055*Math.sign(w)*Math.pow(Math.abs(w),1.8);
    const rM=.0108,dM=10;const gone=t>=c.eEnd;W.moon.scale.setScalar(rM*dM/.818);W.moon.position.set(xa*dM,0,-dM);W.moonMesh.visible=!gone||flicker(t,c.eEnd,c.eEnd+.4);W.moonMesh.visible=!(gone&&t>c.eEnd+.4)&&true;
    W.moonGlow.material.opacity=0;
    const cover=(Math.abs(xa)<(rM-.009))?1:0;const cs=(Math.abs(xa)<(rM-.009+.004))?1:0;
    const k=Math.min(1,Math.max(0,(rM-.009+.0042-Math.abs(xa))/.0042));
    W.corona.visible=true;W.corona.material.opacity=(gone?0:1)*k*.85;W.corona.scale.setScalar(46);W.sunMesh.visible=true;
    W.sunGlow.material.opacity=lerp(.9,.15,k)*(gone?1:1);W.sunGlow2.material.opacity=lerp(.55,.0,k);
    W.starMat.uniforms.uGain.value=lerp(.3,1.4,k);W.scene.background=new THREE.Color(lerp(.05,0,k),lerp(.2,.002,k),lerp(.62,.015,k));
    this.x400.style.opacity=ez(1,1.8,u)*(1-ez(c.eEnd-.4,c.eEnd,t));this.xs.style.opacity=ez(1.6,2.4,u)*(1-ez(c.eEnd-.4,c.eEnd,t));
    this.nz.style.opacity=ez(c.eEnd+.6,c.eEnd+1.3,t);this.nz.style.top='460px';
    if(gone){const g=t-c.eEnd;flashAt(W,V(0,0,-10),.7,0)}
  }
 },
 sfx(S,dur){const c=this.cuesT(S);const e=[{k:'whoosh',t:.2,d:1.2,g:.6},{k:'wind',t:.4,d:S[2][0]-.4,g:.5},{k:'hit',t:.3,g:.7},
  {k:'crackle',t:c.vS-1,d:1,g:.5},{k:'boom',t:c.vS,g:1},{k:'sweep',t:c.vS,d:1.8,g:.7},{k:'blip',t:S[1][0]+.2,g:.5,p:1},{k:'blip',t:S[1][0]+2.2,g:.5,p:.7,},{k:'zap',t:S[1][0]+.3,d:1.2,g:.3},
  {k:'whoosh',t:S[2][0]-.2,d:1,g:.6},{k:'tick',t:S[2][0]+.5,g:.5}];
  for(let i=0;i<14;i++)e.push({k:'tick',t:c.ph0+(c.ph1-c.ph0)*i/14,g:.35,p:1.4});
  e.push({k:'sparkle',t:c.ph0+(c.ph1-c.ph0)*.5,d:3.2,g:.8},{k:'sweep',t:c.ph1,d:1.4,g:.8},{k:'boom',t:c.ph1+.1,g:.7},{k:'whoosh',t:S[3][0]-.2,d:1,g:.7},
   {k:'riser',t:c.eStart,d:S[3][0]+5.5-c.eStart,g:.6},{k:'hit',t:S[3][0]+(c.eEnd-c.eStart)/2+c.eStart-S[3][0]-.2,g:.9},{k:'hit',t:S[3][0]+1.5,g:.5},{k:'boom',t:c.eEnd,g:1},{k:'sweep',t:c.eEnd,d:1.6,g:.6});return e}},

// ---------------------------------------------------------------- 4. MAREAS
{id:'mareas',tag:'La primera semana',
 init(L,W,H){this.h=H;W.gline=new THREE.Line(new THREE.BufferGeometry().setFromPoints([V(0,0,0),V(1,0,0)]),new THREE.LineDashedMaterial({color:0x7ab4ff,dashSize:.4,gapSize:.3,transparent:true,opacity:.8}));W.scene.add(W.gline);W.hideList.push(W.gline);
  this.title=bigTitle(L,'LAS MAREAS',{top:'110px',fontSize:'64px'});
  this.pinL=el(L,'',{fontSize:'20px',fontWeight:800,color:'#ff8080',opacity:0},'COSTA');
  this.hi1=el(L,'teal',{fontSize:'20px',fontWeight:800,opacity:0,width:'200px',textAlign:'center'},'MAREA ALTA');this.hi2=el(L,'teal',{fontSize:'20px',fontWeight:800,opacity:0,width:'200px',textAlign:'center'},'MAREA ALTA');
  this.gauge=el(L,'',{left:'830px',top:'380px',width:'400px',height:'160px',border:'2px solid rgba(80,225,205,.5)',borderRadius:'10px',background:'rgba(6,14,28,.6)',opacity:0});
  this.gt=el(this.gauge,'muted',{left:'10px',top:'-28px',fontSize:'17px',fontWeight:700},'NIVEL DEL MAR EN LA COSTA');
  this.sv=svg(this.gauge,{left:'0px',top:'0px'});this.sv.setAttribute('width',400);this.sv.setAttribute('height',160);this.pl=document.createElementNS('http://www.w3.org/2000/svg','polyline');this.pl.setAttribute('fill','none');this.pl.setAttribute('stroke','#50e1cd');this.pl.setAttribute('stroke-width','3');this.sv.appendChild(this.pl);
  this.cmp=el(L,'',{left:'70px',top:'250px',width:'260px',opacity:0});
  this.cb1=el(this.cmp,'',{left:'0',top:'0',height:'34px',width:'0px',background:'#7ab4ff',borderRadius:'6px'});this.cb2=el(this.cmp,'',{left:'0',top:'70px',height:'34px',width:'0px',background:'#ffbe50',borderRadius:'6px'});
  this.ct1=el(this.cmp,'',{left:'0',top:'38px',fontSize:'20px',fontWeight:800},'CON LUNA · 100 %');this.ct2=el(this.cmp,'amber',{left:'0',top:'108px',fontSize:'20px',fontWeight:800},'SOLO SOL · ≈ 31 %');
  this.zone=el(L,'big teal',{fontSize:'24px',opacity:0,width:'360px',left:'0'},'ZONA INTERMAREAL');this.zl=el(L,'',{background:'#50e1cd',width:'4px',opacity:0});
  this.life=el(L,'big',{left:'0',width:'1280px',top:'110px',fontSize:'54px',opacity:0,color:'#c8f7e0'},'¿LA CUNA DE LA VIDA?');
 },
 cuesT(S){return {mv:S[2][0]+.9,coast:S[3][0]}},
 update(t,S,W,H){const c=this.cuesT(S);[this.title,this.pinL,this.hi1,this.hi2,this.gauge,this.cmp,this.zone,this.zl,this.life].forEach(e=>e.style.opacity=0);
  if(t<c.coast){
    W.earth.visible=true;W.tide.visible=true;W.pin.visible=true;W.gline.visible=true;W.clouds.visible=false;W.atmo.material.uniforms.uK.value=.5;
    W.setSunDir(V(.3,.35,.9));W.cityLights.visible=false;
    const rotE=t*.55;W.earthBody.rotation.y=rotE;
    const th=.35+.1*t;const mdir=V(Math.cos(th),0,Math.sin(th)),sdir=V(1,0,.35).normalize();
    const mf=t<c.mv?1:Math.max(0,1-(t-c.mv)/.4);const moonOn=t<c.mv+.4;W.moon.visible=moonOn&&(t<c.mv||flicker(t,c.mv,c.mv+.4)||false);W.moon.position.copy(mdir).multiplyScalar(10.5);
    const camP=K(t,[[0,[0,18,9]],[S[2][0],[0,18,9]],[c.coast,[0,19,10]]]);W.cam.position.set(...camP);W.cam.lookAt(.6,0,-.8);
    const amp=t<c.mv?1:K(t,[[c.mv,1],[c.mv+1.6,.31]]);const mS=t<c.mv?.69:K(t,[[c.mv,.69],[c.mv+1.6,0]]),sS=t<c.mv?.31:.31;
    const sp=W.sunObj;if(t>=S[2][0]-.3){setSun(W,V(17,0,3),1.5,.9);W.sunObj.visible=true}
    const g=W.tideGeo.attributes.position,b=W.tideBase,n=V(0,0,0);
    const level=(d)=>3.4+.95*(mS*P2(d.dot(mdir))+sS*P2(d.dot(sdir)));
    for(let i=0;i<g.count;i++){n.set(b[i*3],b[i*3+1],b[i*3+2]);const r=level(n);g.setXYZ(i,n.x*r,n.y*r,n.z*r)}g.needsUpdate=true;W.tide.geometry.computeVertexNormals();
    // línea de gravedad
    const gl=W.gline;gl.visible=moonOn&&t>=S[1][0];gl.scale.set(1,1,1);gl.geometry.setFromPoints([V(0,0,0),W.moon.position.clone()]);gl.computeLineDistances();gl.material.dashOffset=-t*1.4;
    // HUD
    this.title.style.opacity=ez(.2,.8,t)*(1-ez(S[0][1]-.3,S[0][1]+.3,t));
    const pdir=V(Math.cos(rotE),0,-Math.sin(rotE));const lv=level(pdir);const pw=V().copy(pdir).multiplyScalar(lv+.5);W.pin.position.copy(V(Math.cos(0),0,0).multiplyScalar(R_E()));W.pin.visible=true;
    const pp=H.proj(V().copy(pdir).multiplyScalar(lv+1.2));this.pinL.style.cssText+=`;left:${pp.x+8}px;top:${pp.y-26}px;opacity:${ez(S[1][0]+1,S[1][0]+1.8,t)}`;
    const e1=H.proj(mdir.clone().multiplyScalar(5.4)),e2=H.proj(mdir.clone().multiplyScalar(-5.4));
    if(t>S[1][0]+2&&t<c.mv){this.hi1.style.cssText+=`;left:${e1.x-100}px;top:${e1.y-34}px;opacity:${ez(S[1][0]+2,S[1][0]+2.8,t)}`;this.hi2.style.cssText+=`;left:${e2.x-100}px;top:${e2.y-34}px;opacity:${ez(S[1][0]+2.4,S[1][0]+3.2,t)}`}
    if(t>S[1][0]+1){this.gauge.style.opacity=ez(S[1][0]+1,S[1][0]+1.8,t);const pts=[];for(let k=0;k<=100;k++){const tt=t-9+k*.09;const rr=tt*.55;const lvv=level(V(Math.cos(rr),0,-Math.sin(rr)));
        const ampT=tt<c.mv?1:K(tt,[[c.mv,1],[c.mv+1.6,.31]]);const mm=tt<c.mv?.69:K(tt,[[c.mv,.69],[c.mv+1.6,0]]);const thh=.35+.1*tt;const md=V(Math.cos(thh),0,Math.sin(thh));
        const l2=3.4+.95*(mm*P2(V(Math.cos(rr),0,-Math.sin(rr)).dot(md))+.31*P2(V(Math.cos(rr),0,-Math.sin(rr)).dot(sdir)));
        pts.push(`${(k*4).toFixed(1)},${(150-(l2-3.0)/(1.5)*120).toFixed(1)}`)}this.pl.setAttribute('points',pts.join(' '))}
    if(t>=S[2][0]){const u=t-S[2][0];this.cmp.style.opacity=ez(.4,1,u);this.cb1.style.width=(250*ez(.6,1.6,u))+'px';this.cb2.style.width=(250*.31*ez(1.8,2.8,u))+'px'}
  }else{ // costa
    const u=t-c.coast,dur=S[3][1]-c.coast;W.coast.visible=true;W.pin.visible=false;
    W.scene.background=new THREE.Color(0x0e2a40);W.scene.fog=new THREE.Fog(0x0e2a40,30,80);W.sun.color.set(0xffe6c0);W.sun.intensity=1.9;W.amb.color.set(0x7aa8d8);W.amb.intensity=.9;W.setSunDir(V(-.5,.55,.6));W.starMat.uniforms.uGain.value=0;
    W.cam.position.set(K(u,[[0,[-15]],[dur,[-7]]])[0],K(u,[[0,[5.2]],[dur,[3.4]]])[0],K(u,[[0,[13]],[dur,[10]]])[0]);W.cam.lookAt(-1+u*.05,-1.6,-1);
    const wl=-.6+2.9*Math.sin(u*.9-1.1);const wp=W.waterGeo.attributes.position,wb=W.waterBase;
    for(let i=0;i<wp.count;i++){const x=wb[i*3],z=wb[i*3+2];wp.setXYZ(i,x,wl+.09*Math.sin(x*.7+u*2.2)+.06*Math.sin(z*.9-u*1.7),z)}wp.needsUpdate=true;W.waterGeo.computeVertexNormals();
    W.poolMeshes.forEach((m,i)=>{const [px,pz]=W.pools[i];const rim=W.coastH(px+3,pz)+.1;m.position.set(px,Math.min(rim,W.coastH(px,pz)+1.0)-.12,pz);m.visible=wl<m.position.y+.6});
    const tl=H.proj(V(-3.2,wl+.1,-5)),tr=H.proj(V(8.4,wl-.2,-5));
    const hiY=-.6+2.9,loY=-.6-2.9;const x1=H.proj(V(lerp(-2,14,pr(-1.6,3.4,hiY)),hiY,0)),x2=H.proj(V(5,loY,0));
    this.zone.style.cssText+=`;left:760px;top:120px;opacity:${ez(2,3,u)}`;
    // burbujas en las charcas
    const pos=W.dust.geometry.attributes.position.array,N=W.dustN,r=rng(8);W.dust.visible=true;W.dustMat.color.setHex(0xc8f7e0);W.dustMat.size=.1;
    const pa=ez(dur*.55,dur*.75,u);for(let i=0;i<N;i++){const k=i%W.pools.length,[px,pz,rr]=W.pools[k];const ph=r()*6.28,sp=.25+r()*.4,a=r()*6.28,q=Math.sqrt(r())*rr;
      const age=((u*sp+ph)%2.2);pos[i*3]=px+Math.cos(a)*q;pos[i*3+1]=W.coastH(px,pz)+.3+age*.8;pos[i*3+2]=pz+Math.sin(a)*q;if(i%3>0&&pa<.01){pos[i*3+1]=-50}}
    W.dust.geometry.attributes.position.needsUpdate=true;W.dustMat.opacity=pa;
    this.life.style.opacity=ez(dur*.62,dur*.72,u);this.life.style.top='96px';
  }
 },
 sfx(S,dur){const c=this.cuesT(S);const e=[{k:'whoosh',t:.1,d:1.2,g:.6},{k:'hit',t:.5,g:.6},{k:'blip',t:S[1][0]+1,g:.5,p:1},{k:'blip',t:S[1][0]+2.1,g:.5,p:1.2},{k:'blip',t:S[1][0]+2.5,g:.5,p:1.2},
  {k:'rumble',t:S[1][0]+.2,d:5,g:.45},{k:'whoosh',t:c.mv-.3,d:1,g:.7},{k:'crackle',t:c.mv,d:.4,g:.5},{k:'boom',t:c.mv+.4,g:.9},{k:'sweep',t:c.mv+.4,d:1.5,g:.6},
  {k:'blip',t:S[2][0]+1.3,g:.5,p:1.1},{k:'blip',t:S[2][0]+2.6,g:.5,p:.8},{k:'whoosh',t:c.coast-.3,d:1.2,g:.8},{k:'waves',t:c.coast,d:S[3][1]-c.coast,g:.9},
  {k:'blip',t:c.coast+2,g:.5,p:1},{k:'sparkle',t:c.coast+(S[3][1]-c.coast)*.55,d:6,g:.55},{k:'ding',t:c.coast+(S[3][1]-c.coast)*.64,g:.7}];return e}},

// ---------------------------------------------------------------- 5. DÍA
{id:'dia',tag:'El tiempo',
 init(L,W,H){this.h=H;this.title=bigTitle(L,'EL TIEMPO',{top:'110px',fontSize:'64px'});
  this.chart=el(L,'',{left:'70px',top:'130px',width:'600px',height:'350px',border:'2px solid rgba(80,225,205,.45)',borderRadius:'12px',background:'rgba(6,14,28,.62)',opacity:0});
  this.ct=el(this.chart,'muted',{left:'14px',top:'-30px',fontSize:'17px',fontWeight:700},'DURACIÓN DEL DÍA (estimación)');
  this.sv=document.createElementNS('http://www.w3.org/2000/svg','svg');this.sv.setAttribute('width',600);this.sv.setAttribute('height',350);this.chart.appendChild(this.sv);
  this.pl=document.createElementNS('http://www.w3.org/2000/svg','polyline');this.pl.setAttribute('fill','none');this.pl.setAttribute('stroke','#50e1cd');this.pl.setAttribute('stroke-width','4');this.sv.appendChild(this.pl);
  this.pt=document.createElementNS('http://www.w3.org/2000/svg','circle');this.pt.setAttribute('r',8);this.pt.setAttribute('fill','#fff');this.sv.appendChild(this.pt);
  for(const h of [0,6,12,18,24]){const y=320-h/26*290;const l=document.createElementNS('http://www.w3.org/2000/svg','line');l.setAttribute('x1',50);l.setAttribute('x2',580);l.setAttribute('y1',y);l.setAttribute('y2',y);l.setAttribute('stroke','rgba(150,168,196,.22)');this.sv.appendChild(l);
    const tx=document.createElementNS('http://www.w3.org/2000/svg','text');tx.setAttribute('x',8);tx.setAttribute('y',y+5);tx.setAttribute('fill','#96a8c4');tx.setAttribute('font-size',15);tx.textContent=h+' h';this.sv.appendChild(tx)}
  this.xl=el(this.chart,'muted',{left:'44px',top:'328px',fontSize:'15px',fontWeight:700},'hace 4.500 M. años');this.xr=el(this.chart,'muted',{right:'18px',top:'328px',fontSize:'15px',fontWeight:700},'hoy');
  this.read=el(L,'mono amber',{left:'70px',top:'495px',fontSize:'30px',fontWeight:800,opacity:0,width:'600px'});
  this.brk=el(L,'big',{left:'0',width:'1280px',top:'100px',fontSize:'44px',opacity:0},'');
  this.ms=el(L,'mono red',{left:'700px',top:'420px',width:'520px',textAlign:'center',fontSize:'34px',fontWeight:800,opacity:0},'');
  this.fr=el(L,'big red',{left:'700px',width:'520px',top:'470px',fontSize:'26px',opacity:0},'EL FRENO SE APAGA');
 },
 cuesT(S){return {p0:S[1][0]+.8,p1:S[1][1]-.8,mv:S[2][0]+(S[2][1]-S[2][0])*.55}},
 update(t,S,W,H){const c=this.cuesT(S);[this.title,this.chart,this.read,this.brk,this.ms,this.fr].forEach(e=>e.style.opacity=0);
  W.earth.visible=true;W.moon.visible=true;W.earth.position.set(6,0,0);W.setSunDir(V(-.5,.35,.8));W.cityLights.visible=false;
  const camShift=Math.sin(t*.1)*.4;W.cam.position.set(camShift,1.5,17);W.cam.lookAt(1.5,0,0);
  const pg=pr(c.p0,c.p1,t),inS3=t>=S[2][0];let hrs=24,ma=0;
  if(t<S[2][0]){ma=4500*(1-pg);hrs=dayHours(ma)}
  // rotación acumulada
  let rot=0;const N=120,tt=Math.min(t,S[2][0]);for(let k=0;k<N;k++){const tk=tt*(k+.5)/N;const pk=pr(c.p0,c.p1,tk);const h=dayHours(4500*(1-pk));rot+=(2*Math.PI/(h/24*3.0))*(tt/N)}
  if(t<c.p0)rot=t*2*Math.PI/(5/24*3.0);
  if(t>=S[2][0]){const u=t-S[2][0];rot=1e3+u*(2*Math.PI/(u<(c.mv-S[2][0])?(6/24*3.0):3.0))}
  W.earthBody.rotation.y=rot;W.clouds.rotation.y=rot*1.15;
  // Luna se aleja
  const d=t<c.p0?7.2:(t<S[2][0]?lerp(7.2,13.5,ez(0,1,pg)):13.5);const ma_=t*.9*(14/d)**1.5;W.moon.position.set(6+Math.cos(ma_)*d,Math.sin(ma_)*d*.28,Math.sin(ma_)*d*.9);W.moon.scale.setScalar(1);
  if(t>=c.mv){W.moon.visible=flicker(t,c.mv,c.mv+.5)&&t<c.mv+.5;}
  this.title.style.opacity=ez(.2,.8,t)*(1-ez(S[0][1]-.3,S[0][1]+.3,t));
  if(t>=S[1][0]-.2&&t<S[2][0]+3){this.chart.style.opacity=ez(S[1][0]-.2,S[1][0]+.5,t)*(1-ez(S[2][0]+2,S[2][0]+3,t));
    const pts=[];for(let k=0;k<=Math.floor(pg*100);k++){const m=4500*(1-k/100);pts.push(`${(50+k/100*530).toFixed(1)},${(320-dayHours(m)/26*290).toFixed(1)}`)}
    this.pl.setAttribute('points',pts.join(' '));const x=50+pg*530,y=320-hrs/26*290;this.pt.setAttribute('cx',x);this.pt.setAttribute('cy',y);
    this.read.style.opacity=this.chart.style.opacity;this.read.innerHTML=`hace ${fmt(Math.round(ma/10)*10)} M. años · día de <span class=teal>${fmt(hrs,1)} h</span>`}
  if(t>=S[2][0]){const u=t-S[2][0];this.ms.style.opacity=ez(.5,1.1,u);this.ms.innerHTML=(t<c.mv?`<span class=amber>+1,7 ms / siglo</span>`:`<span class=red>+0 ms / siglo</span>`);
    this.fr.style.opacity=ez(c.mv-S[2][0]+.3,c.mv-S[2][0]+.9,u);this.fr.style.top='480px';
    this.brk.style.opacity=ez(.3,.9,u)*(1-ez(2.4,3,u));this.brk.innerHTML='<span class=amber>CUANDO NACIÓ LA LUNA:</span> ~5 HORAS'}
 },
 sfx(S,dur){const c=this.cuesT(S);const e=[{k:'whoosh',t:.1,d:1.2,g:.6},{k:'hit',t:.4,g:.6},{k:'tick',t:S[1][0]-.2,g:.3}];
  for(let i=0;i<Math.floor((S[2][0]-S[1][0])*2);i++)e.push({k:'tick',t:S[1][0]+i*.5,g:.33,p:1+(i%2)*.2});
  e.push({k:'riser',t:S[1][0]-2.5,d:2.5,g:.5},{k:'blip',t:S[1][0],g:.5,p:1.2},{k:'whoosh',t:S[2][0]-.2,d:1,g:.6},{k:'hum',t:S[2][0],d:c.mv-S[2][0],g:.5},
   {k:'crackle',t:c.mv,d:.5,g:.5},{k:'boom',t:c.mv+.5,g:.9},{k:'sweep',t:c.mv+.5,d:1.4,g:.6},{k:'tick',t:c.mv+1.5,g:.3});return e}},

// ---------------------------------------------------------------- 6. EJE
{id:'eje',tag:'Lo que de verdad da miedo',
 init(L,W,H){this.h=H;this.title=bigTitle(L,'LO QUE DE VERDAD<br><span class=red>DA MIEDO</span>',{top:'100px',fontSize:'62px'});
  this.ang=el(L,'big',{left:'0',width:'1280px',top:'80px',fontSize:'64px',opacity:0},'');
  this.angs=el(L,'muted',{left:'0',width:'1280px',textAlign:'center',top:'160px',fontSize:'22px',fontWeight:700,opacity:0,letterSpacing:'3px'},'INCLINACIÓN DEL EJE');
  this.chart=el(L,'',{left:'860px',top:'200px',width:'370px',height:'230px',border:'2px solid rgba(255,96,96,.5)',borderRadius:'12px',background:'rgba(6,14,28,.62)',opacity:0});
  this.sv=document.createElementNS('http://www.w3.org/2000/svg','svg');this.sv.setAttribute('width',370);this.sv.setAttribute('height',230);this.chart.appendChild(this.sv);
  this.pl=document.createElementNS('http://www.w3.org/2000/svg','polyline');this.pl.setAttribute('fill','none');this.pl.setAttribute('stroke','#ff6060');this.pl.setAttribute('stroke-width','3');this.sv.appendChild(this.pl);
  const ref=document.createElementNS('http://www.w3.org/2000/svg','line');ref.setAttribute('x1',0);ref.setAttribute('x2',370);ref.setAttribute('y1',230-23.4/90*210-10);ref.setAttribute('y2',230-23.4/90*210-10);ref.setAttribute('stroke','#50e1cd');ref.setAttribute('stroke-dasharray','8 6');this.sv.appendChild(ref);
  this.ct=el(this.chart,'muted',{left:'8px',top:'-28px',fontSize:'16px',fontWeight:700},'DURANTE MILLONES DE AÑOS');this.cl=el(this.chart,'teal',{left:'8px',top:'160px',fontSize:'15px',fontWeight:700},'hoy: 23,4°');
  this.l85=el(this.chart,'red',{right:'8px',top:'6px',fontSize:'16px',fontWeight:800},'hasta ~85°');
  this.seas=el(L,'big',{left:'0',width:'1280px',top:'90px',fontSize:'38px',opacity:0},'');this.day=el(L,'mono amber',{left:'0',width:'1280px',textAlign:'center',top:'170px',fontSize:'40px',fontWeight:800,opacity:0},'');
  this.stab=el(L,'big teal',{left:'60px',top:'150px',fontSize:'26px',opacity:0,textAlign:'left'},'LA LUNA ESTABILIZA EL EJE');
 },
 cuesT(S){return {mv:S[2][0]+.6,s4:S[3][0]}},
 tilt(u){const A=55*Math.min(1,u*1.2);return 23.4+A*(.62*Math.sin(2*Math.PI*1.15*u+.3)+.4*Math.sin(2*Math.PI*2.9*u+1.2))*(0.6+0.4*u)},
 update(t,S,W,H){const c=this.cuesT(S);[this.title,this.ang,this.angs,this.chart,this.seas,this.day,this.stab].forEach(e=>e.style.opacity=0);
  if(t<c.s4){
    W.earth.visible=true;W.moon.visible=true;W.sunObj.visible=true;W.orbit.visible=true;W.axis.visible=true;W.cityLights.visible=false;W.clouds.visible=true;W.sun.color.set(0xfff4e0);W.sun.intensity=3.6;W.amb.intensity=.35;
    setSun(W,V(0,0,0),4.2,.45);W.sunGlow2.scale.setScalar(40);const phi=.4+t*.16;const E=V(Math.cos(phi)*24,0,Math.sin(phi)*24);W.earth.position.copy(E);W.setSunDir(E.clone().multiplyScalar(-1));
    W.orbit.scale.setScalar(24);W.orbit.material.opacity=.4;
    const tilt=t<c.mv?23.4:this.tilt(Math.max(0,(t-c.mv)/(S[2][1]-c.mv)))*(t>S[2][1]?1:1);
    const tl=t<S[2][0]?23.4:(t<c.mv?23.4:this.tilt(pr(c.mv,S[2][1],t)));const tilt2=t<c.mv?23.4:(t<S[2][1]?this.tilt(pr(c.mv,S[2][1],t)):this.tilt(1));
    W.earth.rotation.set(0,0,-tilt2*Math.PI/180);W.earthBody.rotation.y=t*1.1;W.clouds.rotation.y=t*1.3;
    const m=t<c.mv?1:0;const mA=t*1.6;W.moon.position.copy(E).add(V(Math.cos(mA)*6.4,Math.sin(mA)*.9,Math.sin(mA)*6.4));W.moon.scale.setScalar(1.1);
    if(t>=c.mv&&t<c.mv+.6)W.moon.visible=Math.sin(t*70)>0;if(t>=c.mv+.6)W.moon.visible=false;
    W.axis.scale.set(1,9.5,1);W.axis.position.set(0,0,0);const ac=new THREE.Color(0x50e1cd).lerp(new THREE.Color(0xff6060),Math.min(1,Math.abs(tilt2-23.4)/50));W.axis.material.color.copy(ac);
    // cámara: sigue a la Tierra por el lado iluminado
    const side=V(-E.z,0,E.x).normalize();const camNear=E.clone().multiplyScalar(.5).addScaledVector(side,9.5).add(V(0,5.5,0));
    const f1=ez(S[1][0]-.8,S[1][0]+1.6,t),f2=ez(S[2][0]-.5,S[2][0]+1.5,t);
    const camNear2=E.clone().multiplyScalar(.58).addScaledVector(side,7).add(V(0,3.5,0));
    const cp=V(0,22,34).lerp(camNear,f1).lerp(camNear2,f2);const lk=V(0,0,0).lerp(E,f1);
    W.cam.position.copy(cp);W.cam.lookAt(lk);
    if(t>=c.mv&&t<c.mv+.9){flashAt(W,W.moon.position,6*(1+(t-c.mv)),.6*(1-pr(0,.8,t-c.mv)))}
    this.title.style.opacity=ez(.2,.7,t)*(1-ez(S[0][1]-.4,S[0][1]+.2,t))*(.85+.15*Math.sin(t*9));
    if(t>=S[1][0]){this.ang.style.opacity=ez(S[1][0],S[1][0]+.8,t);this.angs.style.opacity=this.ang.style.opacity;this.stab.style.opacity=ez(S[1][0]+3,S[1][0]+3.7,t)*(1-ez(S[2][0]-.3,S[2][0],t))}
    this.ang.innerHTML=`<span class=${Math.abs(tilt2-23.4)>8?'red':'teal'}>${fmt(Math.abs(tilt2),1)}°</span>`;
    if(t>=S[2][0]){this.chart.style.opacity=ez(S[2][0]+.2,S[2][0]+1,t);const pts=[];const u1=pr(c.mv,S[2][1],t);for(let k=0;k<=Math.floor(u1*120);k++){const u=k/120;pts.push(`${(u*370).toFixed(1)},${(220-Math.min(88,Math.abs(this.tilt(u)))/90*210).toFixed(1)}`)}this.pl.setAttribute('points',pts.join(' '))}
  }else{ // sol sin ocaso
    const u=t-c.s4,dur=S[3][1]-c.s4;const dayFrac=u/dur;W.land.visible=true;W.city.visible=true;W.sunObj.visible=true;W.moon.visible=false;W.earth.visible=false;W.orbit.visible=false;
    const A=pr(0,.52,dayFrac);const night=ez(.52,.7,dayFrac);const lin=u*2.1;const el_=lerp(34,-26,ez(.5,.72,dayFrac));
    const az=Math.sin(lin)*.55,eln=(el_+Math.cos(lin)*(dayFrac<.5?22:0))*Math.PI/180;
    const dir=V(Math.sin(az)*Math.cos(eln),Math.sin(eln),-Math.cos(az)*Math.cos(eln));
    W.setSunDir(dir);setSun(W,dir.clone().multiplyScalar(300),14,Math.max(0,Math.min(1,.5+dir.y*2)));W.sunObj.visible=dir.y>-.12;
    const dk=Math.min(1,Math.max(0,.2+dir.y*2.2));W.sun.color.set(0xfff0d8);W.sun.intensity=3.4*dk;W.amb.color.set(0x6f94c8).lerp(new THREE.Color(0x0a1224),night);W.amb.intensity=lerp(1.1,.3,night);
    const sky=new THREE.Color(0x7fb4e0).lerp(new THREE.Color(0x02040a),night);W.scene.background=sky;W.scene.fog=new THREE.Fog(sky.getHex(),60,260);W.starMat.uniforms.uGain.value=night*1.8;W.stars.visible=night>.05;
    W.city.children.forEach(m=>m.material.emissiveIntensity=lerp(.15,1.6,night));
    W.cam.fov=60;W.cam.updateProjectionMatrix();W.cam.position.set(0,1.6,0);W.cam.lookAt(Math.sin(u*.05)*8,10,-30);
    const day=Math.floor(dayFrac<.52?lerp(1,90,A):lerp(90,420,pr(.52,1,dayFrac)));
    this.seas.style.opacity=ez(.2,.8,u);this.seas.innerHTML=dayFrac<.52?'<span class=amber>VERANO SIN NOCHE</span>':'<span style="color:#9fc4ff">INVIERNO SIN DÍA</span>';
    this.day.style.opacity=ez(.4,1,u);this.day.innerHTML=`DÍA ${fmt(day)}`+(day>250?'  <span class=red>· MÁS DE UN AÑO</span>':'');this.seas.style.top='90px';this.day.style.top='160px';
  }
 },
 sfx(S,dur){const c=this.cuesT(S);const e=[{k:'whoosh',t:.1,d:1.4,g:.7},{k:'boom',t:.4,g:.9},{k:'heartbeat',t:.6,d:S[0][1]-.6,g:.8},{k:'rumble',t:.2,d:S[0][1],g:.7},
  {k:'blip',t:S[1][0]+.2,g:.5,p:1.2},{k:'sparkle',t:S[1][0]+3,d:3,g:.35},{k:'whoosh',t:S[2][0]-.3,d:1.2,g:.7},{k:'crackle',t:c.mv,d:.6,g:.6},{k:'boom',t:c.mv+.6,g:1},{k:'sweep',t:c.mv+.6,d:1.5,g:.7},
  {k:'rumble',t:c.mv+.6,d:S[2][1]-c.mv,g:.9},{k:'riser',t:S[2][1]-4,d:4,g:.7},{k:'whoosh',t:c.s4-.3,d:1.2,g:.8},{k:'wind',t:c.s4,d:S[3][1]-c.s4,g:.6}];
  for(let i=0;i<8;i++)e.push({k:'hit',t:S[2][0]+3+i*Math.max(1,(S[2][1]-S[2][0]-4)/8),g:.5});
  for(let i=0;i<16;i++)e.push({k:'tick',t:c.s4+.5+i*(S[3][1]-c.s4)*.5/16,g:.3,p:1.3});e.push({k:'hum',t:c.s4+(S[3][1]-c.s4)*.52,d:(S[3][1]-c.s4)*.45,g:.6},{k:'boom',t:c.s4+(S[3][1]-c.s4)*.55,g:.6});return e}},

// ---------------------------------------------------------------- 7. GIRO
{id:'giro',tag:'El giro final',
 init(L,W,H){this.h=H;this.title=bigTitle(L,'EL GIRO FINAL',{top:'110px',fontSize:'64px'});
  this.tb=el(L,'',{left:'70px',top:'110px',width:'420px',opacity:0});this.rows=['1 año|+3,8 cm','10 años|+38 cm','1.000 años|+38 m','1 millón de años|+38 km','600 millones de años|+22.800 km'].map((r,i)=>{const [a,b]=r.split('|');
    return el(this.tb,'mono',{left:'0',top:(i*46)+'px',fontSize:'22px',fontWeight:800,whiteSpace:'nowrap',opacity:0},`<span class=muted>${a}</span> <span class=amber>${b}</span>`)});
  this.big=el(L,'big amber',{left:'0',width:'1280px',top:'80px',fontSize:'56px',opacity:0},'+3,8 cm / año');this.nail=el(L,'muted',{left:'0',width:'1280px',textAlign:'center',top:'150px',fontSize:'24px',fontWeight:700,opacity:0},'≈ lo que crecen tus uñas');
  this.cnt=el(L,'mono amber',{left:'0',width:'1280px',textAlign:'center',top:'80px',fontSize:'36px',fontWeight:800,opacity:0});this.ecl=el(L,'big',{left:'0',width:'1280px',top:'130px',fontSize:'54px',opacity:0},'');
  this.last=el(L,'big red',{left:'0',width:'1280px',top:'470px',fontSize:'36px',opacity:0},'ÚLTIMO ECLIPSE TOTAL');this.ap=el(L,'muted',{left:'0',width:'1280px',textAlign:'center',top:'200px',fontSize:'20px',fontWeight:700,opacity:0},'tamaño aparente de la Luna (escala exagerada)');
 },
 cuesT(S){return {e0:S[2][0],chg:S[2][0]+3.8}},
 update(t,S,W,H){const c=this.cuesT(S);[this.title,this.tb,this.big,this.nail,this.cnt,this.ecl,this.last,this.ap].forEach(e=>e.style.opacity=0);this.rows.forEach(r=>r.style.opacity=0);
  if(t<S[2][0]){
    W.earth.visible=true;W.moon.visible=true;W.orbit.visible=true;W.cityLights.visible=false;W.setSunDir(V(.2,.5,.85));
    const u=t-S[1][0];const rr=u<0?9:lerp(9,24,ez(0,S[1][1]-S[1][0],u));const a=t*.55;W.moon.position.set(Math.cos(a)*rr,Math.sin(a)*rr*.2,Math.sin(a)*rr);W.moon.scale.setScalar(1.2);
    W.orbit.scale.setScalar(rr);W.orbit.rotation.x=0;W.orbit.material.opacity=.55;W.earthBody.rotation.y=t*.2;W.clouds.rotation.y=t*.26;
    W.cam.position.set(0,13,32);W.cam.lookAt(0,0,0);
    this.title.style.opacity=ez(.2,.7,t)*(1-ez(S[0][1]-.3,S[0][1]+.3,t));
    if(u>-.2){this.big.style.opacity=ez(.2,.9,u);this.nail.style.opacity=ez(1.4,2.1,u);this.tb.style.opacity=1;this.tb.style.left='60px';this.tb.style.top='260px';this.rows.forEach((r,i)=>r.style.opacity=ez(3+i*1.25,3.6+i*1.25,u))}
  }else{
    const u=t-c.e0,dur=S[2][1]-c.e0;W.moon.visible=true;W.cam.position.set(0,0,0);W.cam.lookAt(0,0,-1);W.cam.fov=4;W.cam.updateProjectionMatrix();W.setSunDir(V(0,0,-1));W.sun.intensity=3.2;W.amb.intensity=.02;
    setSun(W,V(0,0,-400),3.6,.9);W.sunGlow.scale.setScalar(26);W.sunGlow2.scale.setScalar(70);
    const rm=K(u,[[0,.0108],[dur*.55,.0098],[dur*.62,.0088],[dur,.0074]]);const dM=10;W.moon.scale.setScalar(rm*dM/.818);W.moon.position.set(.0002*Math.sin(u)*dM,0,-dM);W.moonGlow.material.opacity=0;
    const k=Math.min(1,Math.max(0,(rm-.009+.0004)/.0004));const tot=rm>=.009?1:0;
    W.corona.visible=true;W.corona.material.opacity=tot*.85;W.corona.scale.setScalar(46);W.sunGlow.material.opacity=lerp(.9,.15,tot);W.sunGlow2.material.opacity=lerp(.55,0,tot);
    W.starMat.uniforms.uGain.value=lerp(.2,1.4,tot);W.scene.background=new THREE.Color(lerp(.05,0,tot),lerp(.2,.002,tot),lerp(.62,.015,tot));
    const ma=Math.round(ez(.3,.95,u/dur)*600);this.cnt.style.opacity=ez(.3,.9,u);this.cnt.innerHTML=`DENTRO DE <span class=teal>${fmt(ma)}</span> MILLONES DE AÑOS`;
    this.ecl.style.opacity=ez(.4,1,u);this.ecl.innerHTML=tot?'<span class=teal>ECLIPSE TOTAL</span>':'<span class=amber>ECLIPSE ANULAR</span>';
    this.last.style.opacity=ez(dur*.6,dur*.7,u);this.ap.style.opacity=ez(.8,1.4,u)*.9;this.last.style.top='480px';this.ecl.style.top='130px';this.ap.style.top='210px';
    if(!tot){W.sunMesh.scale.setScalar(3.6)}
  }
 },
 sfx(S,dur){const c=this.cuesT(S);const e=[{k:'whoosh',t:.1,d:1.2,g:.6},{k:'hit',t:.4,g:.7},{k:'whoosh',t:S[1][0]-.1,d:1.2,g:.5},{k:'blip',t:S[1][0]+.3,g:.5,p:1.1}];
  for(let i=0;i<5;i++)e.push({k:'blip',t:S[1][0]+3+i*1.25,g:.5,p:.9+i*.12});
  e.push({k:'whoosh',t:S[2][0]-.3,d:1.2,g:.8},{k:'riser',t:S[2][0],d:3.8,g:.6},{k:'hit',t:c.chg+.1,g:.8},{k:'sweep',t:c.chg+.1,d:1.4,g:.6},{k:'heartbeat',t:S[2][0]+(S[2][1]-S[2][0])*.55,d:(S[2][1]-S[2][0])*.4,g:.7},{k:'boom',t:S[2][0]+(S[2][1]-S[2][0])*.62,g:.8});return e}},

// ---------------------------------------------------------------- 8. CIERRE
{id:'cierre',tag:'Parte del mecanismo',
 init(L,W,H){this.h=H;
  this.cards=[['🌊','EMPUJA EL MAR'],['⟳','SUJETA NUESTRO EJE'],['⏱','MARCA EL RITMO DE LOS DÍAS']].map((cd,i)=>{
    const d=el(L,'card',{left:(60+i*400)+'px',top:'96px',width:'360px',height:'96px',opacity:0});d.className='card abs';d.style.position='absolute';
    d.innerHTML=`<div style="font-size:34px;margin-top:6px">${cd[0]}</div><div style="font-size:19px;font-weight:800;color:#50e1cd;margin-top:2px">${cd[1]}</div>`;return d});
  this.sp=el(L,'big amber',{left:'0',width:'1280px',top:'80px',fontSize:'34px',opacity:0},'SPOILER: ¿QUÉ PASARÍA SI DESAPARECIERA EL SOL?');
  this.cnt=el(L,'mono',{left:'0',width:'1280px',textAlign:'center',top:'140px',fontSize:'64px',fontWeight:800,opacity:0,color:'#ffd27a'});
  this.sub=el(L,'big red',{left:'0',width:'1280px',top:'230px',fontSize:'34px',opacity:0},'');
  this.pill=el(L,'pill',{left:'470px',top:'300px',width:'340px',height:'78px',lineHeight:'78px',fontSize:'34px',opacity:0},'SUSCRÍBETE');
 },
 cuesT(S){const a=S[2][0],d=S[2][1]-a;return {v:a+d*.5,arr:a+d*.5+4.2}},
 update(t,S,W,H){const c=this.cuesT(S);this.cards.forEach(e=>e.style.opacity=0);[this.sp,this.cnt,this.sub,this.pill].forEach(e=>e.style.opacity=0);
  if(t<S[1][0]){ // luna saliendo
    W.land.visible=true;W.city.visible=false;W.moon.visible=true;W.setSunDir(V(.1,.25,.95));W.sun.color.set(0xc4d4ff);W.sun.intensity=2.4;W.amb.color.set(0x24345c);W.amb.intensity=.45;
    W.scene.fog=new THREE.FogExp2(0x070b14,.005);W.scene.background=new THREE.Color(0x04060d);
    const f=ez(0,S[1][0]-.5,t);const el_=lerp(3,24,f)*Math.PI/180,az=-.28;const d=16;W.moon.position.set(Math.sin(az)*Math.cos(el_)*d,Math.sin(el_)*d,-Math.cos(az)*Math.cos(el_)*d);W.moon.scale.setScalar(2.3);W.moon.lookAt(W.cam.position);
    W.moonGlow.material.opacity=.4;W.moonGlow.scale.setScalar(10);W.moonMesh.rotation.y=.8;W.cam.fov=50;W.cam.updateProjectionMatrix();W.cam.position.set(0,.2,0);W.cam.lookAt(-1.5,lerp(1.2,4.5,f),-14);
  }else if(t<S[2][0]){ // Tierra + Luna + tarjetas
    const u=t-S[1][0],dur=S[1][1]-S[1][0];W.earth.visible=true;W.moon.visible=true;W.orbit.visible=true;W.setSunDir(V(.6,.25,.75));
    const a=t*.6;W.moon.position.set(Math.cos(a)*10,Math.sin(a)*1.2,Math.sin(a)*10);W.moon.scale.setScalar(1.1);W.orbit.scale.setScalar(10);W.orbit.material.opacity=.5;
    W.earth.position.set(0,-1.2,0);W.moon.position.y-=1.2;W.orbit.position.set(0,-1.2,0);W.earthBody.rotation.y=t*.2;W.clouds.rotation.y=t*.26;
    W.cam.position.set(Math.sin(t*.08)*4,5,19);W.cam.lookAt(0,-1,0);W.axis.visible=true;W.axis.scale.set(1,8,1);W.earth.rotation.z=-23.4*Math.PI/180;
    this.cards.forEach((cd,i)=>{cd.style.opacity=ez(dur*(.12+i*.26),dur*(.12+i*.26)+.6,u)});
  }else{ // Sol
    const u=t-S[2][0],dur=S[2][1]-S[2][0];W.earth.visible=true;W.sunObj.visible=true;W.cityLights.visible=true;
    W.earth.position.set(-5,-1.5,0);W.earthBody.rotation.y=t*.2;W.clouds.rotation.y=t*.26;
    const gone=t>=c.v;const arrived=t>=c.arr;const sunOn=!gone||flicker(t,c.v-.8,c.v);
    W.setSunDir(V(1,.15,.3));setSun(W,V(14,2.5,-9),2.3,(gone&&t>c.v)?0:1);W.sunMesh.visible=!gone;W.sunObj.visible=!gone||(t<c.v);
    const light=arrived?0:1;W.sun.intensity=3.4*light*(gone&&t>c.v?0:1)+(gone&&!arrived?3.4*0:0);W.sun.intensity=arrived?0:(gone?3.4:3.4);W.amb.intensity=arrived?.08:.4;
    W.cam.position.set(Math.sin(t*.1)*1.5,1.5,17);W.cam.lookAt(2,-.3,0);
    if(t>=c.v){const q=t-c.v;flashAt(W,V(14,2.5,-9),16*(1+q),.9*Math.pow(1-pr(0,1,q),2));shockAt(W,V(14,2.5,-9),1+q*6,.6*(1-pr(0,1.8,q)))}
    if(gone&&!arrived){const pa=pr(c.v,c.arr,t);W.pulse.visible=true;W.pulse.position.lerpVectors(V(14,2.5,-9),V(-2.4,-1.2,0),pa);W.pulse.scale.setScalar(2.6);W.pulse.material.opacity=1}
    if(arrived&&t<c.arr+1){flashAt(W,V(-2.4,-1.2,0),8,.7*(1-pr(0,.9,t-c.arr)))}
    this.sp.style.opacity=ez(1,1.8,u);if(gone){const sec=Math.round(ez(0,1,pr(c.v,c.arr,t))*500);this.cnt.style.opacity=1;this.cnt.textContent=`${String(Math.floor(sec/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`;this.sub.style.opacity=ez(c.v+.4,c.v+1,t);this.sub.textContent=arrived?'LA TIERRA SE APAGA':'LA LUZ SIGUE VIAJANDO…';this.sub.style.top='225px';this.cnt.style.top='130px';this.sp.style.top='60px'}
    this.pill.style.opacity=ez(c.arr+1.2,c.arr+1.8,t)*(1+.04*Math.sin(t*7));this.pill.style.transform=`scale(${1+.04*Math.sin(t*7)})`;this.pill.style.top='300px';
  }
 },
 sfx(S,dur){const c=this.cuesT(S);const e=[{k:'whoosh',t:.15,d:1.4,g:.6},{k:'wind',t:.3,d:S[1][0],g:.4},{k:'hit',t:.3,g:.5},{k:'whoosh',t:S[1][0]-.3,d:1.2,g:.6}];
  const d1=S[1][1]-S[1][0];for(let i=0;i<3;i++){e.push({k:'whoosh',t:S[1][0]+d1*(.12+i*.26),d:.7,g:.5},{k:'ding',t:S[1][0]+d1*(.12+i*.26)+.3,g:.6})}
  e.push({k:'whoosh',t:S[2][0]-.3,d:1.2,g:.6},{k:'riser',t:c.v-3,d:3,g:.8},{k:'crackle',t:c.v-.8,d:.8,g:.6},{k:'boom',t:c.v,g:1.3},{k:'sweep',t:c.v,d:1.8,g:.7},{k:'zap',t:c.v,d:c.arr-c.v,g:.5});
  for(let i=0;i<10;i++)e.push({k:'tick',t:c.v+.4+i*(c.arr-c.v-.6)/10,g:.45,p:1.6});e.push({k:'boom',t:c.arr,g:.9},{k:'sweep',t:c.arr,d:2,g:.7},{k:'ding',t:c.arr+1.3,g:.8},{k:'sparkle',t:c.arr+1.3,d:2,g:.5});return e}},
];
const R_M=()=>0.818, R_E=()=>3;
