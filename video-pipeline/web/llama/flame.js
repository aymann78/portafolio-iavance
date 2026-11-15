// Personaje: la Llama 3D. Sin cara ni cuerpo: se expresa con tamaño, color, inclinación, parpadeo, chispas, humo y luz.
import * as THREE from 'three';
const SNOISE=`vec3 m289(vec3 x){return x-floor(x*(1./289.))*289.;}vec4 m289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 perm(vec4 x){return m289(((x*34.)+1.)*x);}vec4 tis(vec4 r){return 1.79284291400159-.85373472095314*r;}
float snoise(vec3 v){const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
i=m289(i);vec4 p=perm(perm(perm(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;vec4 j=p-49.*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);
vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.-abs(x)-abs(y);vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);vec4 norm=tis(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;
return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));}`;
const VS=SNOISE+`
uniform float uT,uFlick,uStretch,uSeed;uniform vec2 uLean;varying vec3 vN;varying float vY;varying vec3 vP;
void main(){vec3 p=position;float y=clamp(p.y,0.,1.);
 float n=snoise(vec3(p.x*2.2+uSeed,y*2.4-uT*2.3*uFlick,p.z*2.2));float n2=snoise(vec3(p.x*4.5+5.,y*5.-uT*3.6*uFlick,p.z*4.5-uSeed));
 vec2 rd=normalize(p.xz+1e-5);p.xz+=rd*(n*.05+n2*.025)*smoothstep(.05,.6,y)*(.6+uFlick*.6);
 p.x+=n*.12*uFlick*y*y;p.z+=n2*.07*uFlick*y*y;p.y*=uStretch*(1.+n2*.05*uFlick);p.xz+=uLean*y*y;
 vY=y;vec4 wp=modelMatrix*vec4(p,1.);vP=wp.xyz;vN=normalize(mat3(modelMatrix)*normal);gl_Position=projectionMatrix*viewMatrix*wp;}`;
const FS=SNOISE+`
uniform float uT,uHeat,uBlue;varying vec3 vN;varying float vY;varying vec3 vP;
void main(){vec3 N=normalize(vN);vec3 V=normalize(cameraPosition-vP);float f=clamp(abs(dot(N,V)),0.,1.);
 float n=snoise(vec3(vP.x*3.5,vP.y*3.-uT*2.2,vP.z*3.5))*.09;
 float h=pow(f,.85)*(1.-vY*.72)+n;h*=mix(.42,1.18,uHeat);
 vec3 red=vec3(.78,.06,.03),org=vec3(1.,.40,.06),yel=vec3(1.,.76,.18),wht=vec3(1.,.97,.86);float e=.03;
 vec3 c=mix(red*mix(.75,1.,f),org,smoothstep(.29-e,.29+e,h));c=mix(c,yel,smoothstep(.50-e,.50+e,h));c=mix(c,wht,smoothstep(.70-e,.70+e,h));
 c=mix(c,c*vec3(1.,.68,.55),vY*.35);
 vec3 L=normalize(vec3(-.6,.75,.45));vec3 H=normalize(L+V);c+=pow(max(dot(N,H),0.),36.)*.5*vec3(1.,.92,.78);
 c*=mix(.72,1.,smoothstep(0.,.35,f));
 c=mix(c,vec3(.30,.52,1.)*(.55+.7*h),uBlue*.7);
 gl_FragColor=vec4(c*1.2,1.);}`;

function profile(R=.30,yc=.28,N=44){const pts=[];for(let i=0;i<=N;i++){const u=i/N;const y=u<.5?Math.pow(u*2,1.6)/2:u;
  const r=y<yc?R*Math.sqrt(Math.max(0,1-((yc-y)/yc)**2)):R*Math.pow(Math.max(0,1-(y-yc)/(1-yc)),.9);pts.push(new THREE.Vector2(Math.max(r,i==0||i==N?0:1e-3),y))}return pts}
function glowTex(stops){const s=256,c=document.createElement('canvas');c.width=c.height=s;const g=c.getContext('2d');const gr=g.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);
  stops.forEach(([o,col])=>gr.addColorStop(o,col));g.fillStyle=gr;g.fillRect(0,0,s,s);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t}
export const GLOW=()=>glowTex([[0,'rgba(255,255,255,1)'],[.25,'rgba(255,255,255,.5)'],[1,'rgba(255,255,255,0)']]);
const SOFT=()=>glowTex([[0,'rgba(255,255,255,.85)'],[.5,'rgba(255,255,255,.3)'],[1,'rgba(255,255,255,0)']]);
function hash(i){const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x)}

export class Flame{
 constructor(scene){
  this.g=new THREE.Group();scene.add(this.g);
  this.mats=[0,1].map(k=>new THREE.ShaderMaterial({vertexShader:VS,fragmentShader:FS,uniforms:{uT:{value:0},uHeat:{value:1},uBlue:{value:0},uFlick:{value:1},uStretch:{value:1},uSeed:{value:k*4.3},uLean:{value:new THREE.Vector2()}}}));
  const geo=new THREE.LatheGeometry(profile(),72);
  this.body=new THREE.Mesh(geo,this.mats[0]);this.g.add(this.body);
  this.tongue=new THREE.Mesh(new THREE.LatheGeometry(profile(.30,.3),48),this.mats[1]);this.tongue.position.set(-.13,.02,.03);this.tongue.scale.set(.62,.62,.62);this.tongue.rotation.z=.42;this.g.add(this.tongue);
  const gt=GLOW(),st=SOFT();
  this.glow=new THREE.Sprite(new THREE.SpriteMaterial({map:gt,color:0xffa040,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false}));this.glow.position.y=.38;this.g.add(this.glow);
  this.glow2=new THREE.Sprite(new THREE.SpriteMaterial({map:st,color:0xff6a10,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false,opacity:.35}));this.glow2.position.y=.4;this.g.add(this.glow2);
  this.light=new THREE.PointLight(0xff9a45,10,0,1.6);this.light.position.y=.45;this.light.castShadow=true;this.light.shadow.mapSize.set(512,512);this.light.shadow.bias=-.004;this.light.shadow.radius=4;this.g.add(this.light);
  const NS=70,sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.BufferAttribute(new Float32Array(NS*3),3));
  this.sparks=new THREE.Points(sg,new THREE.PointsMaterial({map:gt,size:.05,color:0xffb050,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false}));this.sparks.frustumCulled=false;this.g.add(this.sparks);this.NS=NS;
  const NM=40,mg=new THREE.BufferGeometry();mg.setAttribute('position',new THREE.BufferAttribute(new Float32Array(NM*3),3));
  this.smoke=new THREE.Points(mg,new THREE.PointsMaterial({map:st,size:.35,color:0x8a8f9a,transparent:true,depthWrite:false,opacity:0}));this.smoke.frustumCulled=false;this.g.add(this.smoke);this.NM=NM;
  this.p={};
 }
 // p: x,y,z,size,stretch,heat,lean[x,z],flick,blue,smoke,sparks,light,vis
 set(t,p){const d={x:0,y:0,z:0,size:1,stretch:1,heat:1,lean:[0,0],flick:1,blue:0,smoke:0,sparks:.5,light:1,vis:1};p={...d,...p};this.p=p;
  const g=this.g;g.visible=p.vis>0.001&&p.size>0.005;g.position.set(p.x,p.y,p.z);g.scale.setScalar(Math.max(p.size,.001));
  // respiración: pequeño pulso vivo
  const breath=1+.035*Math.sin(t*2.1)+.02*Math.sin(t*5.3);
  for(const m of this.mats){const u=m.uniforms;u.uT.value=t;u.uHeat.value=p.heat;u.uBlue.value=p.blue;u.uFlick.value=p.flick;u.uStretch.value=p.stretch*breath;u.uLean.value.set(p.lean[0],p.lean[1])}
  const k=Math.max(0,p.heat);const flick=1+(Math.sin(t*23)*.5+Math.sin(t*37+1)*.5)*.06*p.flick;
  this.glow.scale.setScalar(1.7*(.5+k*.7));this.glow.material.opacity=.55*p.vis*(.4+.6*k);this.glow.material.color.set(p.blue>.3?0x9fb8ff:0xffa040).lerp(new THREE.Color(0xff5020),1-k);
  this.glow2.scale.setScalar(4.2*(.4+k*.8));this.glow2.material.opacity=.3*p.vis*k;
  this.light.intensity=p.light*(2+14*k*k)*flick*p.vis*Math.max(.2,p.size);this.light.color.set(0xff9a45).lerp(new THREE.Color(0x7fa0ff),p.blue*.6).lerp(new THREE.Color(0xff4a20),Math.max(0,.5-k));
  const sp=this.sparks.geometry.attributes.position.array;
  for(let i=0;i<this.NS;i++){const s=hash(i),on=s<p.sparks;const ph=(t*(.35+s*.5)+hash(i+50)*7)%1;
    if(!on){sp[i*3+1]=-99;continue}sp[i*3]=(hash(i+9)-.5)*.35+Math.sin(t*2+i)*.06*ph+p.lean[0]*ph*.8;sp[i*3+1]=.35+ph*(1.3+s);sp[i*3+2]=(hash(i+19)-.5)*.3}
  this.sparks.geometry.attributes.position.needsUpdate=true;this.sparks.material.opacity=Math.min(1,p.sparks*2)*p.vis;
  const mp=this.smoke.geometry.attributes.position.array;
  for(let i=0;i<this.NM;i++){const ph=(t*.22+hash(i+3))%1;mp[i*3]=Math.sin(ph*5+i)*.12*ph+p.lean[0]*.5;mp[i*3+1]=.7+ph*2.2;mp[i*3+2]=Math.cos(ph*4+i)*.08*ph}
  this.smoke.geometry.attributes.position.needsUpdate=true;this.smoke.material.opacity=p.smoke*.35;this.smoke.visible=p.smoke>.01;
 }
}
