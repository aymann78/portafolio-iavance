import * as THREE from 'three';

// ---------- util: rng + ruido ----------
export function rng(seed){let s=seed>>>0;return()=>{s=(s+0x6D2B79F5)>>>0;let t=s;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
const P=new Uint8Array(512);{const r=rng(1337);const p=[...Array(256).keys()];for(let i=255;i>0;i--){const j=Math.floor(r()*(i+1));[p[i],p[j]]=[p[j],p[i]]}for(let i=0;i<512;i++)P[i]=p[i&255]}
const fade=t=>t*t*t*(t*(t*6-15)+10),lp=(t,a,b)=>a+t*(b-a);
function grad(h,x,y,z){h&=15;const u=h<8?x:y,v=h<4?y:(h===12||h===14?x:z);return((h&1)?-u:u)+((h&2)?-v:v)}
export function noise3(x,y,z){const X=Math.floor(x)&255,Y=Math.floor(y)&255,Z=Math.floor(z)&255;x-=Math.floor(x);y-=Math.floor(y);z-=Math.floor(z);const u=fade(x),v=fade(y),w=fade(z);const A=P[X]+Y,AA=P[A]+Z,AB=P[A+1]+Z,B=P[X+1]+Y,BA=P[B]+Z,BB=P[B+1]+Z;return lp(w,lp(v,lp(u,grad(P[AA],x,y,z),grad(P[BA],x-1,y,z)),lp(u,grad(P[AB],x,y-1,z),grad(P[BB],x-1,y-1,z))),lp(v,lp(u,grad(P[AA+1],x,y,z-1),grad(P[BA+1],x-1,y,z-1)),lp(u,grad(P[AB+1],x,y-1,z-1),grad(P[BB+1],x-1,y-1,z-1))))}
export function fbm(x,y,z,oct=5,pers=.5){let a=1,f=1,s=0,n=0;for(let i=0;i<oct;i++){s+=a*noise3(x*f,y*f,z*f);n+=a;a*=pers;f*=2}return s/n}
const sm=(x,a,b)=>{const t=Math.min(1,Math.max(0,(x-a)/(b-a)));return t*t*(3-2*t)};
const mix=(a,b,t)=>a+(b-a)*t;

export const R_EARTH=3, R_MOON=3*0.2727;

function canvasTex(w,h,fill,srgb=true){
  const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');
  const img=g.createImageData(w,h);fill(img.data,w,h);g.putImageData(img,0,0);
  const t=new THREE.CanvasTexture(c);t.colorSpace=srgb?THREE.SRGBColorSpace:THREE.NoColorSpace;t.anisotropy=4;return t;
}
function sph(x,y,W,H){const lat=(0.5-(y+.5)/H)*Math.PI,lon=((x+.5)/W-.5)*2*Math.PI;return[Math.cos(lat)*Math.cos(lon),Math.sin(lat),Math.cos(lat)*Math.sin(lon),lat]}

// ---------- texturas: Tierra ----------
function bakeEarth(){
  const Wt=1024,Ht=512;const maps={};
  const buf=new Float32Array(Wt*Ht*4); // r,g,b,landmask
  const lights=new Uint8Array(Wt*Ht), cl=new Uint8Array(Wt*Ht);
  for(let y=0;y<Ht;y++)for(let x=0;x<Wt;x++){
    const [px,py,pz,lat]=sph(x,y,Wt,Ht);const i=y*Wt+x;
    let h=0.5+fbm(px*1.5+3.1,py*1.5+1.7,pz*1.5-2.3,6,.55)*1.25;
    const m=0.5+fbm(px*2.2-5,py*2.2+4,pz*2.2+9,4,.5)*1.2;
    let r,g,b,land=h>0.575?1:0;
    if(!land){const t=sm(h,0.30,0.575);r=mix(4,36,t**.8);g=mix(26,120,t**.8);b=mix(82,190,t**.8)}
    else{const e=sm(h,0.575,0.8),dry=sm(Math.exp(-((((Math.abs(lat)*57.3)-25)/15)**2))*.8+m*.45,.4,.85);
      r=mix(mix(48,176,dry),118,e*.6);g=mix(mix(112,152,dry),102,e*.6);b=mix(mix(58,98,dry),88,e*.6);
      const sn=sm(h,0.8,0.9)*.6;r=mix(r,240,sn);g=mix(g,244,sn);b=mix(b,250,sn)}
    const ice=sm(Math.abs(lat)*57.3+(m-.5)*16,72,80);r=mix(r,240,ice);g=mix(g,246,ice);b=mix(b,252,ice);
    buf[i*4]=r;buf[i*4+1]=g;buf[i*4+2]=b;buf[i*4+3]=(land&&ice<.3)?1:0;
    // luces de ciudades
    if(land&&ice<.2){const c1=sm(fbm(px*4+8,py*4,pz*4-3,3,.5)*1.4+.5,.58,.72);const sp=noise3(px*55,py*55,pz*55);lights[i]=Math.min(255,c1*(sp>.18?255:0)*(h<.65?1:.3))}
    // nubes
    cl[i]=255*sm(0.5+fbm(px*2.4+2,py*3.0,pz*2.4-7,6,.55)*1.5,.6,.85)*.8;
  }
  maps.color=canvasTex(Wt,Ht,(d)=>{for(let i=0;i<Wt*Ht;i++){d[i*4]=buf[i*4];d[i*4+1]=buf[i*4+1];d[i*4+2]=buf[i*4+2];d[i*4+3]=255}});
  maps.rough=canvasTex(Wt,Ht,(d)=>{for(let i=0;i<Wt*Ht;i++){const v=buf[i*4+3]?235:70;d[i*4]=d[i*4+1]=d[i*4+2]=v;d[i*4+3]=255}},false);
  maps.lights=canvasTex(Wt,Ht,(d)=>{for(let i=0;i<Wt*Ht;i++){const v=lights[i];d[i*4]=v;d[i*4+1]=v*.78;d[i*4+2]=v*.4;d[i*4+3]=255}});
  maps.clouds=canvasTex(Wt,Ht,(d)=>{for(let i=0;i<Wt*Ht;i++){d[i*4]=d[i*4+1]=d[i*4+2]=255;d[i*4+3]=cl[i]}});
  return maps;
}
// ---------- texturas: Luna ----------
function bakeMoon(){
  const Wt=1024,Ht=512;const base=new Float32Array(Wt*Ht),hgt=new Float32Array(Wt*Ht),shd=new Float32Array(Wt*Ht);
  for(let y=0;y<Ht;y++)for(let x=0;x<Wt;x++){const [px,py,pz]=sph(x,y,Wt,Ht);const i=y*Wt+x;
    const b=fbm(px*5,py*5,pz*5,5,.6);const ma=sm(0.5+fbm(px*1.6+4,py*1.6,pz*1.6-1,4,.5)*1.4,.55,.68);
    base[i]=158+b*42-ma*46;hgt[i]=b*.08}
  const r=rng(9);
  for(let c=0;c<800;c++){
    const rad=0.012+0.30*Math.pow(r(),3.6),lat0=Math.asin(2*r()-1),lon0=(r()*2-1)*Math.PI;
    const cl=Math.max(Math.cos(lat0),.12),dLon=rad/cl*1.15,dLat=rad*1.15;
    const y0=Math.max(0,Math.floor((0.5-(lat0+dLat)/Math.PI)*Ht)),y1=Math.min(Ht-1,Math.ceil((0.5-(lat0-dLat)/Math.PI)*Ht));
    const x0=Math.floor((lon0-dLon)/(2*Math.PI)*Wt+Wt/2),x1=Math.ceil((lon0+dLon)/(2*Math.PI)*Wt+Wt/2);
    const depth=0.3+0.5*Math.min(1,rad*9);
    for(let y=y0;y<=y1;y++){const lat=(0.5-(y+.5)/Ht)*Math.PI;const sl=Math.sin(lat),cl2=Math.cos(lat);
      for(let xx=x0;xx<=x1;xx++){const x=((xx%Wt)+Wt)%Wt;const lon=((x+.5)/Wt-.5)*2*Math.PI;
        let cd=sl*Math.sin(lat0)+cl2*Math.cos(lat0)*Math.cos(lon-lon0);cd=Math.min(1,Math.max(-1,cd));
        const f=Math.acos(cd)/rad;if(f>1.3)continue;const i=y*Wt+x;
        if(f<1){hgt[i]-=(1-f*f)*depth*.5;shd[i]-=(1-f*f)*.09*depth;}
        const rim=Math.exp(-(((f-1)/.14)**2));hgt[i]+=rim*depth*.3;shd[i]+=rim*.07*depth;}}
  }
  const color=canvasTex(Wt,Ht,(d)=>{for(let i=0;i<Wt*Ht;i++){const v=Math.min(250,Math.max(30,base[i]*(1+shd[i])));d[i*4]=v;d[i*4+1]=v*.985;d[i*4+2]=v*.95;d[i*4+3]=255}});
  const bump=canvasTex(Wt,Ht,(d)=>{for(let i=0;i<Wt*Ht;i++){const v=Math.min(255,Math.max(0,128+hgt[i]*160));d[i*4]=d[i*4+1]=d[i*4+2]=v;d[i*4+3]=255}},false);
  return {color,bump};
}
// ---------- sprites ----------
function radialTex(stops,size=256){
  const c=document.createElement('canvas');c.width=c.height=size;const g=c.getContext('2d');
  const gr=g.createRadialGradient(size/2,size/2,0,size/2,size/2,size/2);stops.forEach(([o,col])=>gr.addColorStop(o,col));
  g.fillStyle=gr;g.fillRect(0,0,size,size);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;
}
function coronaTex(){
  const s=512,c=document.createElement('canvas');c.width=c.height=s;const g=c.getContext('2d');
  g.translate(s/2,s/2);g.globalCompositeOperation='lighter';
  const r=rng(5);
  for(let i=0;i<140;i++){const a=r()*Math.PI*2,len=60+r()*190,wd=1+r()*3;g.save();g.rotate(a);
    const gr=g.createLinearGradient(40,0,40+len,0);gr.addColorStop(0,'rgba(230,238,255,.55)');gr.addColorStop(1,'rgba(230,238,255,0)');
    g.fillStyle=gr;g.fillRect(40,-wd/2,len,wd);g.restore()}
  const gr=g.createRadialGradient(0,0,30,0,0,256);gr.addColorStop(0,'rgba(220,230,255,.8)');gr.addColorStop(.25,'rgba(170,190,255,.25)');gr.addColorStop(1,'rgba(0,0,0,0)');
  g.fillStyle=gr;g.fillRect(-256,-256,512,512);
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;
}
function windowsTex(){
  return canvasTex(64,128,(d,w,h)=>{const r=rng(3);for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=(y*w+x)*4;
    const cell=(x%8>=2&&x%8<6)&&(y%8>=2&&y%8<6);const lit=cell&&r()<0;d[i]=d[i+1]=d[i+2]=0;d[i+3]=255}
    const r2=rng(8);for(let cy=0;cy<h/8;cy++)for(let cx=0;cx<w/8;cx++){if(r2()<.42){const col=r2()<.7?[255,210,120]:[190,225,255];
      for(let y=2;y<6;y++)for(let x=2;x<6;x++){const i=((cy*8+y)*w+cx*8+x)*4;d[i]=col[0];d[i+1]=col[1];d[i+2]=col[2]}}}});
}

// ---------- mundo ----------
export function createWorld(renderer){
  const scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(45,16/9,.05,3000);
  const W={scene,cam,renderer,R_EARTH,R_MOON,hideList:[]};
  const E=bakeEarth(),M=bakeMoon();
  W.tex={E,M,glow:radialTex([[0,'rgba(255,255,255,1)'],[.25,'rgba(255,255,255,.55)'],[1,'rgba(255,255,255,0)']]),
         soft:radialTex([[0,'rgba(255,255,255,.9)'],[.4,'rgba(255,255,255,.25)'],[1,'rgba(255,255,255,0)']]),corona:coronaTex(),win:windowsTex()};
  W.tex.win.wrapS=W.tex.win.wrapT=THREE.RepeatWrapping;
  // luces
  W.sun=new THREE.DirectionalLight(0xffffff,3.2);scene.add(W.sun,W.sun.target);
  W.amb=new THREE.AmbientLight(0x1a2848,0.5);scene.add(W.amb);
  W.sunDir=new THREE.Vector3(1,.2,.6).normalize();
  // estrellas
  {const N=6500,pos=new Float32Array(N*3),col=new Float32Array(N*3),sz=new Float32Array(N),ph=new Float32Array(N),r=rng(77);
   const nrm=new THREE.Vector3(.3,.8,.5).normalize(),u=new THREE.Vector3().crossVectors(nrm,new THREE.Vector3(0,0,1)).normalize(),v=new THREE.Vector3().crossVectors(nrm,u);
   for(let i=0;i<N;i++){let d;if(i<4600){d=new THREE.Vector3(r()*2-1,r()*2-1,r()*2-1);if(d.length()>1||d.length()<.01){i--;continue}d.normalize()}
     else{const a=r()*Math.PI*2,th=(r()+r()+r()-1.5)*.22;d=u.clone().multiplyScalar(Math.cos(a)).addScaledVector(v,Math.sin(a)).addScaledVector(nrm,th).normalize()}
     pos.set([d.x*1500,d.y*1500,d.z*1500],i*3);const k=r(),c=k<.2?[1,.82,.7]:k<.4?[.75,.85,1]:[1,1,1];const b=i<4600?(.35+.65*r()**2):(.12+.2*r());
     col.set([c[0]*b,c[1]*b,c[2]*b],i*3);sz[i]=i<4600?(1.2+3.2*r()**4):1.0;ph[i]=r()*6.28}
   const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('color',new THREE.BufferAttribute(col,3));g.setAttribute('size',new THREE.BufferAttribute(sz,1));g.setAttribute('ph',new THREE.BufferAttribute(ph,1));
   W.starMat=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{uT:{value:0},uGain:{value:1}},
     vertexShader:`attribute float size;attribute float ph;attribute vec3 color;varying vec3 vC;uniform float uT;void main(){vC=color*(0.8+0.2*sin(uT*1.6+ph));gl_PointSize=size;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
     fragmentShader:`varying vec3 vC;uniform float uGain;void main(){vec2 d=gl_PointCoord-.5;float a=smoothstep(.5,.0,length(d));gl_FragColor=vec4(vC*uGain*a*1.6,1.);}`});
   W.stars=new THREE.Points(g,W.starMat);W.stars.frustumCulled=false;scene.add(W.stars);}
  // Tierra
  W.earth=new THREE.Group();
  W.earthBody=new THREE.Mesh(new THREE.SphereGeometry(R_EARTH,96,64),new THREE.MeshStandardMaterial({map:E.color,roughnessMap:E.rough,roughness:1,metalness:0}));
  W.clouds=new THREE.Mesh(new THREE.SphereGeometry(R_EARTH*1.012,72,48),new THREE.MeshStandardMaterial({map:E.clouds,transparent:true,depthWrite:false,roughness:1,opacity:.92}));
  W.cityLights=new THREE.Mesh(new THREE.SphereGeometry(R_EARTH*1.003,72,48),new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
    uniforms:{uMap:{value:E.lights},uSun:{value:W.sunDir.clone()},uK:{value:1}},
    vertexShader:`varying vec2 vUv;varying vec3 vN;void main(){vUv=uv;vN=normalize(mat3(modelMatrix)*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader:`uniform sampler2D uMap;uniform vec3 uSun;uniform float uK;varying vec2 vUv;varying vec3 vN;void main(){float n=smoothstep(.05,-.18,dot(vN,uSun));gl_FragColor=vec4(texture2D(uMap,vUv).rgb*n*uK*1.8,1.);}`}));
  W.atmo=new THREE.Mesh(new THREE.SphereGeometry(R_EARTH*1.16,64,48),new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.BackSide,blending:THREE.AdditiveBlending,
    uniforms:{uSun:{value:W.sunDir.clone()},uCol:{value:new THREE.Color(.28,.52,1)},uK:{value:1}},
    vertexShader:`varying vec3 vN;varying vec3 vP;void main(){vN=normalize(mat3(modelMatrix)*normal);vP=(modelMatrix*vec4(position,1.)).xyz;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader:`uniform vec3 uSun,uCol;uniform float uK;varying vec3 vN;varying vec3 vP;void main(){vec3 V=normalize(cameraPosition-vP);float f=pow(clamp(dot(-vN,V),0.,1.),2.2);float l=.25+.75*smoothstep(-.4,.5,dot(normalize(vP-W_C),uSun));gl_FragColor=vec4(uCol*f*l*uK*1.5,1.);}`.replace('W_C','vec3(0.)')}));
  W.earthAtmoCenter=true;
  W.magma=new THREE.Mesh(new THREE.SphereGeometry(R_EARTH*1.004,64,48),new THREE.MeshBasicMaterial({color:0xff5a10,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false}));
  W.earth.add(W.earthBody,W.clouds,W.cityLights,W.atmo,W.magma);scene.add(W.earth);
  // Luna
  W.moon=new THREE.Group();
  W.moonMesh=new THREE.Mesh(new THREE.SphereGeometry(R_MOON,96,64),new THREE.MeshStandardMaterial({map:M.color,bumpMap:M.bump,bumpScale:1.1,roughness:1,metalness:0}));
  W.moonGlow=new THREE.Sprite(new THREE.SpriteMaterial({map:W.tex.soft,color:0x9fb4ff,transparent:true,opacity:.0,blending:THREE.AdditiveBlending,depthWrite:false}));
  W.moon.add(W.moonMesh,W.moonGlow);scene.add(W.moon);
  // Sol
  W.sunObj=new THREE.Group();
  W.sunMesh=new THREE.Mesh(new THREE.SphereGeometry(1,48,32),new THREE.MeshBasicMaterial({color:0xfff6e0,toneMapped:false}));
  W.sunGlow=new THREE.Sprite(new THREE.SpriteMaterial({map:W.tex.glow,color:0xffc070,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));
  W.sunGlow2=new THREE.Sprite(new THREE.SpriteMaterial({map:W.tex.soft,color:0xff8a30,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,opacity:.6}));
  W.corona=new THREE.Sprite(new THREE.SpriteMaterial({map:W.tex.corona,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,opacity:0}));
  W.sunObj.add(W.sunMesh,W.sunGlow,W.sunGlow2,W.corona);scene.add(W.sunObj);
  // efectos
  W.flash=new THREE.Sprite(new THREE.SpriteMaterial({toneMapped:false,map:W.tex.glow,color:0xffffff,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,opacity:0}));scene.add(W.flash);
  W.pulse=new THREE.Sprite(new THREE.SpriteMaterial({toneMapped:false,map:W.tex.glow,color:0xfff8e0,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,opacity:0}));scene.add(W.pulse);
  W.shock=new THREE.Mesh(new THREE.RingGeometry(.92,1,96),new THREE.MeshBasicMaterial({color:0xbfd8ff,transparent:true,opacity:0,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,depthWrite:false}));scene.add(W.shock);
  W.ghosts=[];for(let i=0;i<30;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(R_EARTH,24,16),new THREE.MeshBasicMaterial({color:0x50e1cd,wireframe:true,transparent:true,opacity:0,depthWrite:false}));m.visible=false;scene.add(m);W.ghosts.push(m)}
  // órbita
  W.orbit=new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(Array.from({length:181},(_,i)=>new THREE.Vector3(Math.cos(i/180*6.2832),0,Math.sin(i/180*6.2832)))),new THREE.LineBasicMaterial({color:0x6b86c8,transparent:true,opacity:.5}));scene.add(W.orbit);
  // Theia + escombros
  W.theia=new THREE.Mesh(new THREE.SphereGeometry(1.6,48,32),new THREE.MeshStandardMaterial({color:0x9a7258,roughness:1,emissive:0x5a1a05,emissiveIntensity:.8}));scene.add(W.theia);
  {const N=1600,g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(new Float32Array(N*3),3));
   W.debrisMat=new THREE.PointsMaterial({size:.14,map:W.tex.glow,color:0xffa050,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,opacity:1});
   W.debris=new THREE.Points(g,W.debrisMat);W.debris.frustumCulled=false;scene.add(W.debris);W.debrisN=N}
  // partículas genéricas (huevos de coral, polvo…)
  {const N=900,g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(new Float32Array(N*3),3));
   W.dustMat=new THREE.PointsMaterial({size:.12,map:W.tex.glow,color:0xffd2f0,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,opacity:1});
   W.dust=new THREE.Points(g,W.dustMat);W.dust.frustumCulled=false;scene.add(W.dust);W.dustN=N}
  // marea (cascarón de agua)
  W.tideGeo=new THREE.SphereGeometry(1,96,64);W.tideBase=W.tideGeo.attributes.position.array.slice();
  W.tide=new THREE.Mesh(W.tideGeo,new THREE.MeshStandardMaterial({color:0x2e8fe0,transparent:true,opacity:.62,roughness:.12,metalness:.2}));scene.add(W.tide);
  W.pin=new THREE.Group();{const a=new THREE.Mesh(new THREE.ConeGeometry(.12,.5,16),new THREE.MeshBasicMaterial({color:0xff5050}));a.position.y=.25;const b=new THREE.Mesh(new THREE.SphereGeometry(.14,16,12),new THREE.MeshBasicMaterial({color:0xffe0a0}));b.position.y=.55;W.pin.add(a,b)}
  W.earthBody.add(W.pin);W.pin.position.set(R_EARTH,0,0);W.pin.rotation.z=-Math.PI/2;
  // eje
  W.axis=new THREE.Mesh(new THREE.CylinderGeometry(.04,.04,1,12),new THREE.MeshBasicMaterial({color:0x50e1cd,transparent:true,opacity:.95}));W.earth.add(W.axis);
  // paisaje + ciudad
  W.land=new THREE.Group();
  {const g=new THREE.PlaneGeometry(500,500,150,150);g.rotateX(-Math.PI/2);const p=g.attributes.position,c=[];
   for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i);const d=Math.hypot(x,z);const h=(fbm(x*.012,0,z*.012,5,.5)*30+Math.max(0,fbm(x*.03,3,z*.03,3,.5))*10)*sm(d,18,70)-sm(d,0,18)*0;p.setY(i,h-1.5)}
   g.computeVertexNormals();W.terrain=new THREE.Mesh(g,new THREE.MeshStandardMaterial({color:0x2e4538,roughness:1,flatShading:false}));W.land.add(W.terrain)}
  W.city=new THREE.Group();{const r=rng(12);const mat=new THREE.MeshStandardMaterial({color:0x10141c,roughness:.9,emissive:0xffffff,emissiveMap:W.tex.win,emissiveIntensity:1});
   for(let i=0;i<70;i++){const a=r()*Math.PI*2,dd=20+r()*55,w=3+r()*5,h=6+r()*34,dp=3+r()*5;const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,dp),mat.clone());
     m.material.emissiveMap=W.tex.win.clone();m.material.emissiveMap.needsUpdate=true;m.material.emissiveMap.repeat.set(w/8,h/8);m.material.emissiveMap.wrapS=m.material.emissiveMap.wrapT=THREE.RepeatWrapping;
     m.position.set(Math.cos(a)*dd,h/2-1.5,Math.sin(a)*dd);m.rotation.y=r()*3;W.city.add(m)}}
  W.land.add(W.city);scene.add(W.land);
  // costa (escena de mareas)
  W.coast=new THREE.Group();
  {const g=new THREE.PlaneGeometry(40,26,120,80);g.rotateX(-Math.PI/2);const p=g.attributes.position;const cols=new Float32Array(p.count*3);
   const pools=[[2.6,-3,.9],[5.2,2.6,1.1],[6.8,-5,.8],[4.2,5.5,.8]];W.pools=pools;
   const gh=(x,z)=>{let y=-5.2+(x+12)*.30+fbm(x*.25,0,z*.25,3,.5)*.45;y=Math.min(y,3.4);for(const [px,pz,rr] of pools){y-=1.0*Math.exp(-(((x-px)**2+(z-pz)**2)/(rr*rr)))}return y};W.coastH=gh;
   for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i);const y=gh(x,z);p.setY(i,y);const t=sm(y,-3,2.5);const rr=mix(.10,.40,t),gg=mix(.14,.29,t),bb=mix(.16,.19,t);cols[i*3]=rr;cols[i*3+1]=gg;cols[i*3+2]=bb}
   g.setAttribute('color',new THREE.BufferAttribute(cols,3));g.computeVertexNormals();
   W.coastMesh=new THREE.Mesh(g,new THREE.MeshStandardMaterial({vertexColors:true,roughness:1}));W.coast.add(W.coastMesh)}
  {const g=new THREE.PlaneGeometry(40,26,80,50);g.rotateX(-Math.PI/2);W.waterGeo=g;W.waterBase=g.attributes.position.array.slice();
   W.water=new THREE.Mesh(g,new THREE.MeshStandardMaterial({color:0x2a95d8,transparent:true,opacity:.72,roughness:.12,metalness:.25}));W.coast.add(W.water)}
  W.poolMeshes=W.pools.map(([x,z,r])=>{const m=new THREE.Mesh(new THREE.CircleGeometry(r*1.25,32),new THREE.MeshStandardMaterial({color:0x2a95d8,transparent:true,opacity:.8,roughness:.1,metalness:.3}));m.rotation.x=-Math.PI/2;W.coast.add(m);return m});
  scene.add(W.coast);
  W.setSunDir=(d)=>{W.sunDir.copy(d).normalize();W.sun.position.copy(W.sunDir).multiplyScalar(100);W.sun.target.position.set(0,0,0);W.cityLights.material.uniforms.uSun.value.copy(W.sunDir);W.atmo.material.uniforms.uSun.value.copy(W.sunDir)};
  W.reset=()=>{
    scene.background=new THREE.Color(0x02030a);scene.fog=null;
    for(const o of [W.earth,W.moon,W.sunObj,W.orbit,W.theia,W.debris,W.dust,W.tide,W.land,W.coast,W.pin,W.axis,W.flash,W.pulse,W.shock,W.stars])o.visible=false;
    W.stars.visible=true;W.starMat.uniforms.uGain.value=1;
    W.ghosts.forEach(g=>g.visible=false);
    W.earth.position.set(0,0,0);W.earth.rotation.set(0,0,0);W.earth.scale.setScalar(1);W.earthBody.rotation.set(0,0,0);W.clouds.rotation.set(0,0,0);
    W.moon.position.set(14,0,0);W.moon.scale.setScalar(1);W.moon.rotation.set(0,0,0);W.moonMesh.visible=true;W.moonGlow.material.opacity=0;
    W.sunObj.position.set(0,0,0);W.corona.material.opacity=0;W.sunMesh.visible=true;
    W.magma.material.opacity=0;W.cityLights.material.uniforms.uK.value=1;W.atmo.material.uniforms.uK.value=1;W.clouds.visible=true;
    W.sun.color.set(0xffffff);W.sun.intensity=3.2;W.amb.color.set(0x1a2848);W.amb.intensity=.5;W.setSunDir(new THREE.Vector3(1,.2,.6));
    W.cam.fov=45;W.cam.up.set(0,1,0);W.cam.updateProjectionMatrix();
    W.pin.visible=false;W.axis.visible=false;
    W.flash.material.opacity=0;W.pulse.material.opacity=0;W.shock.material.opacity=0;
    W.tide.visible=false;(W.hideList||[]).forEach(o=>o.visible=false);
  };
  return W;
}
