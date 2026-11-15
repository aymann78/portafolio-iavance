// Coreografía por plano: cámara, Llama, luz y rótulos. u = progreso del plano (0..1), t = tiempo local de la escena, S = frases.
const big=(H,txt,top=60,size=120)=>H.el(txt,'bt',{top:top+'px',fontSize:size+'px'});
const show=(e,o)=>{e.style.opacity=o};
let E={};
function F(c,P,pos,p,rel=1,relR=.28,relC=[1,.55,.2]){const {flame}=c;const w=c.place(pos[0],pos[1]);flame.set(c.T,{x:w.x,y:w.y,z:w.z,...p});
  P.u.uFl.value.set(pos[0],pos[1]+.06*(p.size||.3)/.3);P.u.uRel.value=.5*rel*(p.vis??1);P.u.uRelR.value=relR;P.u.uRelC.value.setRGB(...relC)}
function dust(c,a,warm=true){const {dust,T}=c;dust.material.opacity=a;dust.material.color.set(warm?0xffd7a0:0xa8c0ff);const p=dust.geometry.attributes.position.array;
  for(let i=0;i<p.length/3;i++){const h=Math.sin(i*91.7)*43758.5;const r=h-Math.floor(h);const r2=(Math.sin(i*12.3)*9999)%1;
    p[i*3]=(r-.5)*4.2+Math.sin(T*.3+i)*.05;p[i*3+1]=((r2+1)%1-.5)*2.4+((T*.04*(.5+r))%1)*.3;p[i*3+2]=.1+((i*.37)%1)*.6}dust.geometry.attributes.position.needsUpdate=true}
const ig=(ts,t0,dur=.7)=>{const x=(ts-t0)/dur;if(x<=0)return 0;if(x<1)return 1.15*Math.sin(x*Math.PI/2);return 1+.15*Math.cos((x-1)*8)*Math.exp(-(x-1)*5)};
export const FX={
 _titles:{init(c){E.d1=big(c.H,'DÍA 1.');E.d2=big(c.H,'DÍA 2.');E.d3=big(c.H,'DÍA 3.');E.cnt=big(c.H,'',50,96);E.title=big(c.H,'DISCIPLINA.',70,140);
   E.b1=c.H.el('🔔 Nueva notificación <b>1</b>','bub');E.b2=c.H.el('⏰ Cinco minutos más <b>+5</b>','bub');E.b3=c.H.el('📅 Mañana empiezo <b>99+</b>','bub')},
   hide(){for(const k in E)show(E[k],0)}},
 // ---------------- DÍA 1 ----------------
 d1_clock:{update(c){const {u,P,T,D,lerp}=c;const pulse=.5+.5*Math.sin(T*18);P.u.uTint.value.setRGB(1+.25*pulse,1-.05*pulse,1-.05*pulse);P.u.uExp.value=.82;
   },cam:(u)=>({x:.05-.1*u,y:.02,z:2.747*lerp(.98,.8,u),lx:-.05,ly:.05,shake:.004})},
 d1_desk:{cam:(u)=>({x:.12-.12*u,y:-.05,z:2.747*lerp(.95,.72,u),lx:.18,ly:-.42}),
   update(c){const {P,T,sh,S,t,ez}=c;const ts=T-sh.t0;const s=.42*ig(ts,.6);P.u.uExp.value=.85;
     F(c,P,[.6,.11],{size:s,heat:.95,sparks:ts<1.6?1:.45,flick:1.1,vis:s>0?1:0},.9*Math.min(1,s/.42),.26);
     show(E.d1,ez(S[0][0]-.1,S[0][0]+.3,t)*(1-ez(S[1][1]-.2,S[1][1]+.3,t)))}},
 // ---------------- MOTIVACIÓN ----------------
 m_low:{cam:(u)=>({x:-.18+.36*u,y:-.08,z:2.747*.84,lx:.08,ly:-.2,fov:40-3*u}),
   update(c){const {P,T,sh}=c;const ts=T-sh.t0;const st=1+.35*Math.exp(-ts*3)*Math.cos(ts*12);P.u.uExp.value=1.0;
     F(c,P,[.56,.275],{size:.62*Math.min(1,.55+ts*.6),stretch:st,heat:1.1,sparks:1,flick:.9},.9,.32);dust(c,.9)}},
 m_room:{cam:(u)=>({x:.05,y:.02,z:2.747*lerp(.8,.96,u),lx:.12,ly:-.05}),
   update(c){const {P}=c;P.u.uExp.value=1.06;P.u.uTint.value.setRGB(1.06,1,.92);F(c,P,[.6,.345],{size:.15,heat:1.1,sparks:.8},.9,.3);dust(c,.6)}},
 // ---------------- LLUVIA ----------------
 l_window:{cam:(u)=>({x:-.12+.24*u,y:0,z:2.747*.86,lx:0,ly:0}),
   update(c){const {P,rainU}=c;P.u.uExp.value=.95;P.u.uTint.value.setRGB(.9,.95,1.08);rainU.uA.value=1}},
 l_cal:{cam:(u)=>({x:0,y:.32,z:2.747*lerp(.62,.55,u),lx:0,ly:.36}),
   update(c){const {P,t,S,ez}=c;P.u.uExp.value=.95;P.u.uTint.value.setRGB(.88,.94,1.08);const a=S[1][0];
     show(E.d2,ez(a-.1,a+.2,t)*(1-ez(a+1.0,a+1.2,t)));show(E.d3,ez(a+1.15,a+1.4,t))}},
 l_desk:{cam:(u)=>({x:.1-.15*u,y:.05,z:2.747*lerp(.9,.8,u),lx:-.15,ly:-.25}),
   update(c){const {P,u,lerp,rainU}=c;P.u.uExp.value=.9;P.u.uTint.value.setRGB(.86,.92,1.1);rainU.uA.value=.35;
     F(c,P,[.45,.24],{size:lerp(.46,.36,u),heat:lerp(.82,.68,u),sparks:.15,flick:1.35},.6,.24);dust(c,.25,false)}},
 // ---------------- TENTACIÓN ----------------
 t_phone:{cam:(u)=>({x:-.15+.1*u,y:-.02,z:2.747*lerp(.92,.78,u),lx:.05,ly:-.05}),
   update(c){const {P,u,t,S,ez,lerp}=c;P.u.uExp.value=.92;P.u.uTint.value.setRGB(.92,.96,1.08);
     F(c,P,[.28,.27],{size:.4,heat:.75,lean:[lerp(0,.22,u),0],blue:lerp(.1,.4,u),sparks:.1,flick:1.2},.6,.22);
     const a=S[1][0];[[E.b1,a,700,120],[E.b2,a+1.3,690,190],[E.b3,a+2.5,710,260]].forEach(([e,t0,x,y])=>{const k=ez(t0,t0+.25,t);show(e,k);e.style.left=x+'px';e.style.top=(y+(1-k)*20)+'px';e.style.transform=`scale(${.9+.1*k})`})}},
 t_close:{cam:(u)=>({x:.08,y:0,z:2.747*lerp(.82,.7,u),lx:-.05,ly:-.25}),
   update(c){const {P,u,lerp}=c;P.u.uExp.value=.9;P.u.uTint.value.setRGB(.85,.92,1.15);
     F(c,P,[.4,.11],{size:.62,heat:lerp(.7,.55,u),lean:[lerp(.2,.42,u),.05],blue:lerp(.4,.65,u),sparks:.05,flick:1.3},.55,.3,[.6,.7,1])}},
 // ---------------- APAGÁNDOSE ----------------
 a_dark:{cam:(u)=>({x:0,y:-.02,z:2.747*lerp(.88,.62,u),lx:.02,ly:-.62}),
   update(c){const {P,u,lerp,T}=c;P.u.uExp.value=lerp(.8,.55,u);P.u.uSat.value=.75;const near=Math.sin(T*9)>.85&&u>.5?.5:1;
     F(c,P,[.5,.09],{size:lerp(.45,.16,u),heat:lerp(.55,.18,u),blue:.25*(1-u),smoke:u,sparks:0,flick:1.7,vis:near},lerp(.6,.25,u)*near,.18)}},
 // ---------------- DECISIÓN ----------------
 dc_dark:{cam:(u,t,S)=>{const k=S?Math.max(0,Math.min(1,(t-S[1][0]-1.0)/1.4)):0;return {x:0,y:-.02,z:2.747*(.62+.28*k*k*(3-2*k)),lx:.02,ly:-.62+.3*k,shake:k>0&&k<.5?.02*(1-k*2):0}},
   update(c){const {P,t,S,ez,lerp,ring,place,T,H}=c;const r0=S[1][0]+1.0,k=ez(r0,r0+1.2,t),st=ez(S[0][0],S[0][0]+1.4,t);
     P.u.uExp.value=lerp(.55,1.05,k);P.u.uSat.value=lerp(.75,1.05,k);P.u.uTint.value.setRGB(lerp(.95,1.12,k),1,lerp(1.05,.88,k));
     const pop=t>r0?1+.35*Math.exp(-(t-r0)*3)*Math.cos((t-r0)*10):1;
     F(c,P,[.5,.09],{size:lerp(.16,.6,k)*pop,heat:lerp(.2,1.15,k),blue:.25*(1-st),lean:[0,0],smoke:1-st*.6-k*.4,sparks:k,flick:lerp(1.6,1,k)},lerp(.25,1.4,k),lerp(.18,.5,k));
     if(t>r0){const q=t-r0;const w=place(.5,.12);ring.position.set(w.x,w.y,w.z+.05);ring.scale.setScalar(.05+q*1.4);ring.material.opacity=.9*Math.max(0,1-q/1.1);H.flash.style.opacity=.45*Math.max(0,1-q/.35)}}},
 // ---------------- MONTAJE ----------------
 mo_cal:{cam:(u)=>({x:-.1+.2*u,y:0,z:2.747*.8,fov:34+6*Math.min(1,u*4)}),update(c){c.P.u.uExp.value=1.05;show(E.cnt,1);E.cnt.textContent='DÍA 7'}},
 mo_clock:{cam:(u)=>({x:.1-.1*u,y:0,z:2.747*.82,lx:.2,fov:34+6*Math.min(1,u*4)}),update(c){c.P.u.uExp.value=1.05;show(E.cnt,1);E.cnt.textContent='DÍA 21'}},
 mo_book:{cam:(u)=>({x:-.5,y:.0,z:2.747*lerp2(.66,.6,u),lx:-.5,ly:-.05,fov:34+6*Math.min(1,u*4)}),update(c){const {P}=c;P.u.uExp.value=1.05;show(E.cnt,1);E.cnt.textContent='DÍA 48'}},
 mo_weights:{cam:(u)=>({x:.12-.24*u,y:-.03,z:2.747*.84,fov:34+6*Math.min(1,u*4)}),update(c){c.P.u.uExp.value=1.05;show(E.cnt,1);E.cnt.textContent='DÍA 73'}},
 mo_stairs:{cam:(u)=>({x:-.2+.15*u,y:-.15+.35*u,z:2.747*lerp2(.85,.7,u),lx:.1,ly:-.2+.5*u}),
   update(c){const {P,u,lerp}=c;const steps=7,ph=u*steps,k=Math.floor(ph),f=ph-k;const hop=Math.sin(Math.min(1,f*1.6)*Math.PI)*.025;
     const a=Math.min(1,(k+Math.min(1,f*1.6))/steps);const pu=lerp(.42,.56,a),pv=lerp(.13,.5,a)+hop;P.u.uExp.value=1.0;
     F(c,P,[pu,pv],{size:lerp(.4,.2,a),heat:1.1,sparks:.9,flick:.9,lean:[0,0]},1.1,.26);dust(c,.5);
     show(E.cnt,1);E.cnt.textContent='DÍA '+Math.round(lerp(80,100,Math.min(1,u*1.3)))}},
 // ---------------- CIMA ----------------
 c_peak:{cam:(u)=>({x:0,y:lerp2(-.35,.2,u),z:2.747*lerp2(.95,.8,u),lx:-.1,ly:lerp2(-.2,.5,u)}),
   update(c){const {P}=c;P.u.uExp.value=1.05;F(c,P,[.415,.835],{size:.1,heat:1.2,sparks:.6},.8,.12,[1,.7,.35]);dust(c,.3)}},
 c_rock:{cam:(u)=>({x:.3-.2*u,y:.05,z:2.747*lerp2(.85,.72,u),lx:.25,ly:0}),
   update(c){const {P,t,S,ez,lerp,ring,place,H}=c;const f0=S[1][1]-1.5,k=ez(f0,f0+.8,t);P.u.uExp.value=lerp(.98,1.06,k);
     F(c,P,[.76,.41],{size:lerp(.5,.8,k),heat:lerp(1.15,1.35,k),sparks:1,flick:.9},lerp(.8,1.2,k),lerp(.25,.45,k),[1,.62,.28]);dust(c,.7);
     if(t>f0){const q=t-f0;const w=place(.76,.45);ring.position.set(w.x,w.y,w.z+.05);ring.scale.setScalar(.05+q*1.8);ring.material.opacity=.8*Math.max(0,1-q/1.2);H.flash.style.opacity=.35*Math.max(0,1-q/.4)}}},
 // ---------------- FINAL (sin fondo) ----------------
 final:{update(c){const {flame,T,t,ez,cam}=c;cam.position.set(Math.sin(t*.4)*.15,0,2.4);cam.lookAt(0,-.1,0);cam.updateProjectionMatrix();
   flame.set(T,{x:0,y:-.62,z:0,size:.75,heat:1.15,sparks:1,flick:.9});show(E.title,ez(.6,1.3,t))}},
};
function lerp2(a,b,x){return a+(b-a)*x}
function lerp(a,b,x){return a+(b-a)*x}
