// Decorados 3D (solo objetos, sin seres vivos): habitación, escalera, montaña.
import * as THREE from 'three';
function rnd(s){let x=s>>>0;return()=>{x=(x+0x6D2B79F5)>>>0;let t=x;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
function canvasTex(w,h,srgb=true){const c=document.createElement('canvas');c.width=w;c.height=h;const t=new THREE.CanvasTexture(c);t.colorSpace=srgb?THREE.SRGBColorSpace:THREE.NoColorSpace;t.anisotropy=4;return {c,g:c.getContext('2d'),t,key:null}}
function rr(g,x,y,w,h,r){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath()}
const std=(color,o={})=>new THREE.MeshStandardMaterial({color,roughness:.85,metalness:0,...o});
function shadowAll(o){o.traverse(m=>{if(m.isMesh){m.castShadow=true;m.receiveShadow=true}})}

function woodTex(){const T=canvasTex(512,512);const g=T.g,r=rnd(4);
  for(let i=0;i<8;i++){const base=[86+r()*20,54+r()*12,34+r()*8];g.fillStyle=`rgb(${base})`;g.fillRect(0,i*64,512,64);
    for(let k=0;k<40;k++){g.strokeStyle=`rgba(30,15,8,${.05+r()*.08})`;g.lineWidth=1+r()*2;g.beginPath();const y=i*64+r()*64;g.moveTo(0,y);g.bezierCurveTo(170,y+r()*6-3,340,y+r()*6-3,512,y+r()*4-2);g.stroke()}
    g.fillStyle='rgba(10,5,2,.6)';g.fillRect(0,i*64,512,2)}
  T.t.wrapS=T.t.wrapT=THREE.RepeatWrapping;T.t.needsUpdate=true;return T.t}

export function createSet(scene){
 const S={};
 // ---------------- HABITACIÓN ----------------
 const room=new THREE.Group();S.room=room;scene.add(room);
 const wood=woodTex();wood.repeat.set(6,6);
 const floor=new THREE.Mesh(new THREE.PlaneGeometry(24,24),std(0x8a6a50,{map:wood,roughness:.75}));floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;room.add(floor);
 const wallM=std(0x3a3640,{roughness:.95});
 const wall=new THREE.Mesh(new THREE.PlaneGeometry(24,10),wallM);wall.position.set(0,5,-2.3);wall.receiveShadow=true;room.add(wall);
 const wallL=new THREE.Mesh(new THREE.PlaneGeometry(24,10),wallM);wallL.rotation.y=Math.PI/2;wallL.position.set(-4.5,5,0);wallL.receiveShadow=true;room.add(wallL);
 // escritorio
 const deskM=std(0x5a3622,{map:wood,roughness:.6});
 const top=new THREE.Mesh(new THREE.BoxGeometry(3.6,.1,1.6),deskM);top.position.set(0,1.0,0);room.add(top);
 for(const [x,z] of [[-1.7,-.7],[1.7,-.7],[-1.7,.7],[1.7,.7]]){const l=new THREE.Mesh(new THREE.BoxGeometry(.1,1,.1),deskM);l.position.set(x,.5,z);room.add(l)}
 S.deskY=1.05;
 // ventana con lluvia
 S.rainU={uT:{value:0},uRain:{value:0},uFlash:{value:0}};
 const win=new THREE.Mesh(new THREE.PlaneGeometry(2.0,1.5),new THREE.ShaderMaterial({uniforms:S.rainU,vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
  fragmentShader:`uniform float uT,uRain,uFlash;varying vec2 vUv;float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
  void main(){vec3 col=mix(vec3(.015,.03,.07),vec3(.06,.10,.2),vUv.y);
   float r=0.;for(int i=0;i<3;i++){float fi=float(i);vec2 uv=vUv*vec2(40.+fi*25.,2.5+fi);uv.y+=uT*(3.+fi*1.5);vec2 id=floor(uv);float rn=h(id+fi*7.);
    float x=fract(uv.x)-.5+(rn-.5)*.6;float y=fract(uv.y+rn*9.);r+=smoothstep(.06,0.,abs(x))*smoothstep(0.,.5,y)*smoothstep(1.,.55,y)*step(.55,rn)*(1.-fi*.25);}
   vec2 g=vUv*vec2(14.,10.);vec2 gi=floor(g);float d=h(gi);vec2 gf=fract(g)-.5-vec2(h(gi+3.)-.5,h(gi+5.)-.5)*.5;float drop=smoothstep(.12,.05,length(gf*vec2(1.,.8)))*step(.7,d);
   col+=r*uRain*vec3(.45,.55,.75)*.55+drop*uRain*vec3(.35,.45,.6)*.5;col+=uFlash*vec3(.6,.7,1.);gl_FragColor=vec4(col,1.);}`}));
 win.position.set(.4,2.45,-2.29);room.add(win);
 const frM=std(0x1c1a20,{roughness:.7});
 for(const [w,h,x,y] of [[2.2,.1,.4,3.25],[2.2,.14,.4,1.65],[.1,1.7,-.65,2.45],[.1,1.7,1.45,2.45],[.06,1.5,.4,2.45],[2.0,.05,.4,2.45]]){const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,.08),frM);b.position.set(x,y,-2.25);b.castShadow=true;room.add(b)}
 S.moon=new THREE.DirectionalLight(0x7090d0,0);S.moon.position.set(.6,4,-6);S.moon.target.position.set(0,1,1);room.add(S.moon,S.moon.target);
 // despertador
 S.clock=new THREE.Group();const cb=new THREE.Mesh(new THREE.BoxGeometry(.58,.32,.2),std(0x16161b,{roughness:.4,metalness:.3}));cb.position.y=.16;S.clock.add(cb);
 S.clockT=canvasTex(256,128);const disp=new THREE.Mesh(new THREE.PlaneGeometry(.48,.22),new THREE.MeshBasicMaterial({map:S.clockT.t,toneMapped:false}));disp.position.set(0,.16,.101);S.clock.add(disp);
 for(const x of [-.2,.2]){const f=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,.04,12),std(0x222)) ;f.position.set(x,.33,0);S.clock.add(f)}
 S.clock.position.set(1.05,S.deskY,-.3);S.clock.rotation.y=-.35;room.add(S.clock);
 S.clockLight=new THREE.PointLight(0xff3020,0,3,2);S.clockLight.position.set(0,.2,.25);S.clock.add(S.clockLight);
 // móvil
 S.phone=new THREE.Group();const pb=new THREE.Mesh(new THREE.BoxGeometry(.36,.03,.7),std(0x0c0d10,{roughness:.3,metalness:.6}));S.phone.add(pb);
 S.phoneT=canvasTex(300,600);S.screen=new THREE.Mesh(new THREE.PlaneGeometry(.32,.64),new THREE.MeshBasicMaterial({map:S.phoneT.t,toneMapped:false}));S.screen.rotation.x=-Math.PI/2;S.screen.position.y=.017;S.phone.add(S.screen);
 S.phone.position.set(-1.0,S.deskY+.015,.25);S.phone.rotation.y=.35;room.add(S.phone);
 S.phoneLight=new THREE.PointLight(0x5d8dff,0,4,1.6);S.phoneLight.position.set(0,.35,0);S.phone.add(S.phoneLight);
 // calendario en la pared
 S.calT=canvasTex(320,400);S.cal=new THREE.Mesh(new THREE.PlaneGeometry(.72,.9),new THREE.MeshStandardMaterial({map:S.calT.t,roughness:.9}));S.cal.position.set(-1.55,2.35,-2.27);S.cal.receiveShadow=true;room.add(S.cal);
 // libros
 const r=rnd(7);const bc=[0x7a2a20,0x2a4a6a,0x9a7a30,0x3a5a3a];
 for(let i=0;i<4;i++){const b=new THREE.Mesh(new THREE.BoxGeometry(.62-r()*.1,.1,.44),std(bc[i],{roughness:.7}));b.position.set(1.4+(r()-.5)*.05,S.deskY+.05+i*.1,.35);b.rotation.y=(r()-.5)*.3;room.add(b)}
 // pesa en el suelo
 S.dumbbell=makeDumbbell();S.dumbbell.position.set(1.9,.12,1.2);S.dumbbell.rotation.y=.6;room.add(S.dumbbell);
 shadowAll(room);floor.castShadow=false;wall.castShadow=false;wallL.castShadow=false;win.castShadow=false;

 // ---------------- ESCALERA (montaje) ----------------
 S.stairs=new THREE.Group();scene.add(S.stairs);S.steps=[];
 const stepM=std(0x2a2830,{roughness:.8});
 for(let i=0;i<12;i++){const s=new THREE.Mesh(new THREE.BoxGeometry(1.1,.5+i*.45,1.4),stepM);s.position.set(i*1.1,(.5+i*.45)/2,0);s.receiveShadow=s.castShadow=true;S.stairs.add(s);
   const em=new THREE.MeshStandardMaterial({color:0x221a12,emissive:0xff8a30,emissiveIntensity:0});const strip=new THREE.Mesh(new THREE.BoxGeometry(1.1,.04,1.42),em);strip.position.set(i*1.1,.5+i*.45+.02,0);S.stairs.add(strip);
   S.steps.push({top:.5+i*.45,x:i*1.1,em})}
 const book=new THREE.Mesh(new THREE.BoxGeometry(.5,.12,.38),std(0x7a2a20));book.position.set(3*1.1+.25,S.steps[3].top+.06,-.35);S.stairs.add(book);
 const db=makeDumbbell();db.scale.setScalar(.8);db.position.set(6*1.1+.2,S.steps[6].top+.1,-.4);S.stairs.add(db);
 const ck=S.clock.clone();ck.position.set(9*1.1+.2,S.steps[9].top,-.4);ck.rotation.y=.2;S.stairs.add(ck);
 shadowAll(S.stairs);

 // ---------------- MONTAÑA (amanecer) ----------------
 S.mount=new THREE.Group();scene.add(S.mount);
 S.skyU={uTop:{value:new THREE.Color(0x0d1a3a)},uMid:{value:new THREE.Color(0xd8643a)},uLow:{value:new THREE.Color(0xffc070)},uSun:{value:new THREE.Vector3(0,.05,-1).normalize()}};
 const sky=new THREE.Mesh(new THREE.SphereGeometry(400,48,24),new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,uniforms:S.skyU,
  vertexShader:'varying vec3 vD;void main(){vD=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
  fragmentShader:`uniform vec3 uTop,uMid,uLow,uSun;varying vec3 vD;void main(){float y=vD.y;vec3 c=mix(uLow,uMid,smoothstep(-.02,.12,y));c=mix(c,uTop,smoothstep(.1,.6,y));
   float s=max(dot(vD,uSun),0.);c+=vec3(1.,.75,.4)*pow(s,40.)*1.4+vec3(1.,.55,.25)*pow(s,6.)*.35;if(y<-.02)c*=.35;gl_FragColor=vec4(c,1.);}`}));
 S.mount.add(sky);
 {const g=new THREE.PlaneGeometry(260,260,180,180);g.rotateX(-Math.PI/2);const p=g.attributes.position,rr2=rnd(3);
  const P=new Float32Array(256);for(let i=0;i<256;i++)P[i]=rr2();
  const vn=(x,z)=>{const xi=Math.floor(x),zi=Math.floor(z),xf=x-xi,zf=z-zi;const H=(a,b)=>P[((a*57+b*131)%256+256)%256];const u=xf*xf*(3-2*xf),v=zf*zf*(3-2*zf);
    return (H(xi,zi)*(1-u)+H(xi+1,zi)*u)*(1-v)+(H(xi,zi+1)*(1-u)+H(xi+1,zi+1)*u)*v};
  for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i),d=Math.hypot(x,z);let h=0,a=1,f=.03;for(let o=0;o<5;o++){h+=vn(x*f+o*7,z*f-o*3)*a;a*=.5;f*=2}
    h=(h-.9)*9;const peak=12*Math.exp(-(d*d)/(2*7.5*7.5))+5*Math.exp(-(d*d)/(2*22*22));let y=h*Math.min(1,d/10)+peak-6;if(d<1.2)y=Math.max(y,peak-6+.0);p.setY(i,y)}
  g.computeVertexNormals();S.peakY=12+5-6;
  const m=new THREE.Mesh(g,std(0x4a3a36,{roughness:1,flatShading:true}));m.receiveShadow=true;S.mount.add(m)}
 const rock=new THREE.Mesh(new THREE.DodecahedronGeometry(.7,0),std(0x3a302c,{flatShading:true}));rock.position.set(0,S.peakY-.1,0);rock.scale.set(1,.55,1);S.mount.add(rock);S.rockTop=S.peakY+.28;
 S.sunL=new THREE.DirectionalLight(0xffa860,0);S.sunL.position.set(0,6,-40);S.mount.add(S.sunL,S.sunL.target);S.sunL.target.position.set(0,S.peakY,0);

 // ---------------- dibujado de texturas ----------------
 S.drawClock=(txt,on=1,col='#ff3a2a')=>{const T=S.clockT,k=txt+on+col;if(T.key===k)return;T.key=k;const g=T.g;g.fillStyle='#050505';g.fillRect(0,0,256,128);
  g.font='bold 92px "DejaVu Sans Mono",monospace';g.textAlign='center';g.textBaseline='middle';g.fillStyle='rgba(255,60,40,.08)';g.fillText('88:88',128,68);
  if(on){g.shadowColor=col;g.shadowBlur=18;g.fillStyle=col;g.fillText(txt,128,68)}T.t.needsUpdate=true};
 S.drawPhone=(n,bright=1,time='5:07')=>{const T=S.phoneT,k=n+'|'+bright.toFixed(2)+time;if(T.key===k)return;T.key=k;const g=T.g;g.fillStyle='#000';g.fillRect(0,0,300,600);if(bright<=0){T.t.needsUpdate=true;return}
  g.globalAlpha=bright;const gr=g.createLinearGradient(0,0,0,600);gr.addColorStop(0,'#1a2a6a');gr.addColorStop(1,'#5a1a6a');g.fillStyle=gr;g.fillRect(0,0,300,600);
  g.fillStyle='#fff';g.font='bold 64px "DejaVu Sans"';g.textAlign='center';g.fillText(time,150,120);g.font='18px "DejaVu Sans"';g.fillText('lunes',150,150);
  const cols=['#ff4a6a','#3ad07a','#4a8aff','#ffb02e'],lab=['+1','+5 min','+12','99+'];
  for(let i=0;i<Math.min(n,4);i++){const y=190+i*92;g.fillStyle='rgba(255,255,255,.18)';rr(g,16,y,268,78,16);g.fill();g.fillStyle=cols[i];rr(g,30,y+14,50,50,12);g.fill();
    g.fillStyle='rgba(255,255,255,.85)';rr(g,94,y+18,150,12,6);g.fill();g.fillStyle='rgba(255,255,255,.45)';rr(g,94,y+42,110,10,5);g.fill();
    g.fillStyle='#ff3b3b';g.beginPath();g.arc(266,y+12,16,0,7);g.fill();g.fillStyle='#fff';g.font='bold 13px "DejaVu Sans"';g.fillText(lab[i],266,y+17)}
  g.globalAlpha=1;T.t.needsUpdate=true};
 S.drawCal=(day)=>{const T=S.calT,k='d'+day;if(T.key===k)return;T.key=k;const g=T.g;g.fillStyle='#efe9df';g.fillRect(0,0,320,400);g.fillStyle='#c8322a';g.fillRect(0,0,320,84);
  g.fillStyle='#fff';g.font='bold 44px "DejaVu Sans"';g.textAlign='center';g.fillText('DÍA',160,60);g.fillStyle='#2a2420';g.font=`bold ${day>99?150:190}px "DejaVu Sans"`;g.fillText(String(day),160,300);
  g.fillStyle='rgba(0,0,0,.12)';for(let i=0;i<7;i++)g.fillRect(24+i*40,350,28,6);for(const x of [70,250]){g.fillStyle='#555';g.beginPath();g.arc(x,18,9,0,7);g.fill()}T.t.needsUpdate=true};
 S.drawClock('5:00');S.drawPhone(0,0);S.drawCal(1);
 S.hideAll=()=>{room.visible=S.stairs.visible=S.mount.visible=false};
 return S;
}
function makeDumbbell(){const g=new THREE.Group();const m=new THREE.MeshStandardMaterial({color:0x2a2a2e,roughness:.35,metalness:.7});
 const bar=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,.7,12),m);bar.rotation.z=Math.PI/2;g.add(bar);
 for(const x of [-.28,.28]){const w=new THREE.Mesh(new THREE.CylinderGeometry(.12,.12,.12,20),m);w.rotation.z=Math.PI/2;w.position.x=x;g.add(w)}return g}
