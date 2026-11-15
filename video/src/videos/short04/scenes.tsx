import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Studio, Rig, Floor, useCanvasTexture} from '../../core/studio';
import {useTL} from '../../core/timeline';
import {ease, kick, mix3, pop, rand} from '../../core/anim';
import {Chip, Headline, project} from '../../core/overlay';
import {ScreenPhone, TexCard, TexPlane} from '../../models/kit';
import {Padlock, DataStream} from '../../models/devices';
import {Key, Database, Domino, Vault, Shield} from '../../models/objects';
import {drawLogin, drawLeakList, drawBreachCheck, drawVaultApp, drawTwoFA, drawDominoFace, drawGlowText, type Service} from '../../models/screens2';

const SVC: Service[] = [
  {name: 'Correo', color: '#ef4444', icon: 'mail'},
  {name: 'Banco', color: '#0ea5e9', icon: 'bank'},
  {name: 'Redes', color: '#a855f7', icon: 'chat'},
  {name: 'Tienda', color: '#f59e0b', icon: 'cart'},
  {name: 'Nube', color: '#22c55e', icon: 'cloud'},
];

/* 1 — HOOK: una llave para todos los candados */
export const Hook: React.FC = () => {
  const {wf} = useTL();
  const f = useCurrentFrame();
  const t = f / 30;
  const fMisma = wf('hook', 'misma');
  const fTuya = wf('hook', 'tuya');
  const g = kick(f, fTuya, 12);
  const cam: [number, number, number] = [Math.sin(t * 0.5) * 1.0, 1.4, 12.5 - ease(f, [0, 120], [0, 2.5])];
  const look: [number, number, number] = [0, 1.3, 0];
  return (
    <AbsoluteFill>
      <Studio look={{bg: '#05040d', glow: '#24145c', accent: '#a78bfa'}} chroma={kick(f, 0, 6) + g * 1.3}>
        <Rig pos={cam} look={look} />
        {SVC.slice(0, 4).map((s, i) => {
          const open = ease(f, [fTuya + i * 3, fTuya + i * 3 + 6], [0, 1]);
          const x = -1.5 + i;
          return (
            <group key={i} position={[x, 2.55 + Math.sin(t * 2 + i) * 0.05, -1.2]} rotation={[0, Math.sin(t + i) * 0.25, 0]} scale={0.52 * pop(f, 2 + i * 3, 12, 140)}>
              <Padlock color={open > 0.5 ? '#ef4444' : s.color} shackleUp={open} glow={open * 0.6} />
            </group>
          );
        })}
        <group position={[0, 1.0, 0.8]} rotation={[0.35, t * 1.4, 0.35]} scale={1.15 * pop(f, 0, 12, 120)}>
          <Key glow={0.05 + g * 0.6} />
        </group>
        <Floor y={-1.0} color="#3b1a78" />
      </Studio>
      {SVC.slice(0, 4).map((s, i) => {
        const p = project([-1.5 + i, 1.95, -1.2], cam, look);
        return <Chip key={i} x={p.x} y={p.y} text={s.name} color={ease(f, [fTuya + i * 3, fTuya + i * 3 + 4], [0, 1]) > 0.5 ? '#ff2d55' : s.color} appear={ease(f, [6 + i * 3, 16 + i * 3], [0, 1])} size={26} />;
      })}
      <Headline text="LA MISMA PARA TODO" start={fMisma} y={220} size={90} color="#c4b5fd" glitch={g} />
    </AbsoluteFill>
  );
};

/* 2 — LEAK: la base de datos se rompe y salen contraseñas */
const PW = ['Maria1987!', 'barcelona10', 'contraseña123', 'qwerty2020', '12345678', 'Madrid2022', 'iloveyou', 'verano2023'];
export const Leak: React.FC = () => {
  const {wf} = useTL();
  const f = useCurrentFrame();
  const t = f / 30;
  const fFiltran = wf('leak', 'filtran');
  const fMiles = wf('leak', 'miles');
  const fListas = wf('leak', 'listas');
  const list = pop(f, fListas - 4, 13, 110);
  const cam: [number, number, number] = [Math.sin(t * 0.45) * 1.1, 1.6, 11.5 - t * 0.2];
  return (
    <AbsoluteFill>
      <Studio look={{bg: '#0b0306', glow: '#4a0b1c', accent: '#ff2d55'}} chroma={kick(f, 0, 8) + kick(f, fFiltran, 10) * 0.8 + kick(f, fListas, 8) * 0.5}>
        <Rig pos={cam} look={[0, 1.3, 0]} />
        <group position={[0, 1.3 - list * 0.4, -0.4 - list * 1.2]} rotation={[0.12, t * 0.3, 0]} scale={1.15}>
          <Database ring="#ff2d55" power={2.4 + kick(f, fFiltran, 16) * 3} crack={ease(f, [fFiltran, fFiltran + 12], [0, 1])} />
        </group>
        {PW.map((pw, i) => {
          const st = fFiltran + 4 + i * 5;
          const k = ease(f, [st, st + 55], [0, 1]);
          if (k <= 0 || k >= 1) return null;
          const ang = (rand(i + 3) - 0.5) * 2.4;
          const pos: [number, number, number] = [Math.sin(ang) * 2.4 * k, 1.3 + (rand(i + 9) - 0.3) * 2.6 * k, 0.6 + 3.0 * k];
          return (
            <group key={i} position={pos} scale={0.6 + k * 0.4}>
              <TexPlane draw={(ctx, w, h) => drawGlowText(ctx, w, h, {text: pw, color: '#ff4d6d'})} px={[512, 96]} w={1.6} h={0.3} opacity={1 - Math.max(0, k - 0.7) / 0.3} />
            </group>
          );
        })}
        {list > 0.01 && (
          <group position={[0, 1.65, 1.2]} rotation={[(1 - list) * 0.8, 0, 0]} scale={list * 0.95}>
            <TexCard draw={(ctx, w, h) => drawLeakList(ctx, w, h, {scroll: t * 9, hi: 1})} px={[1100, 760]} w={3.3} h={2.28} radius={0.12} edge="#ff2d55" edgePower={2} />
          </group>
        )}
        <Floor y={-0.6} color="#5c1020" />
      </Studio>
      <Headline text="MILES DE MILLONES" start={fMiles} y={220} size={92} color="#ff4d6d" out={fListas - 6} />
      <Chip x={540} y={240} text="descarga gratis en foros" color="#ff2d55" appear={pop(f, fListas + 10, 14, 180)} size={42} />
    </AbsoluteFill>
  );
};

/* 3 — STUFF: pruebas automáticas en todas partes */
export const Stuff: React.FC = () => {
  const {wf} = useTL();
  const f = useCurrentFrame();
  const t = f / 30;
  const fAuto = wf('stuff', 'automática');
  const hi = [wf('stuff', 'correo'), wf('stuff', 'banco'), wf('stuff', 'redes')];
  const cam: [number, number, number] = [Math.sin(t * 0.4) * 0.6, 1.5, 11.2 - t * 0.15];
  const pos: [number, number, number][] = [
    [-0.9, 2.15, 0],
    [0.9, 2.15, -0.3],
    [0, 0.5, 0.4],
  ];
  const bot: [number, number, number] = [0, 3.9, -2.2];
  return (
    <AbsoluteFill>
      <Studio look={{bg: '#04060d', glow: '#14245c', accent: '#60a5fa'}} chroma={kick(f, 0, 8)}>
        <Rig pos={cam} look={[0, 1.35, 0]} />
        <mesh position={bot}>
          <icosahedronGeometry args={[0.35, 1]} />
          <meshStandardMaterial color="#000" emissive="#ff2d55" emissiveIntensity={2.6} toneMapped={false} wireframe />
        </mesh>
        {pos.map((p, i) => {
          const fast = f > fAuto ? 9 : 16;
          const phase = (f + i * 5) % fast;
          const status = f < 8 ? 'idle' : phase > fast * 0.7 ? 'fail' : 'idle';
          const emph = ease(f, [hi[i], hi[i] + 6], [0, 1]) * (1 - ease(f, [hi[i] + 14, hi[i] + 22], [0, 1]));
          return (
            <group key={i}>
              <DataStream points={[bot, [(bot[0] + p[0]) / 2, (bot[1] + p[1]) / 2 + 0.4, (bot[2] + p[2]) / 2], [p[0], p[1] + 0.6, p[2]]]} t={t + i * 0.3} color="#ff4d6d" packets={3} speed={f > fAuto ? 1.6 : 0.8} power={4} />
              <group position={p} rotation={[0, -p[0] * 0.15, 0]} scale={(0.95 + emph * 0.12) * pop(f, i * 4, 13, 140)}>
                <TexCard draw={(ctx, w, h) => drawLogin(ctx, w, h, {svc: SVC[i], pass: status === 'fail' ? 1 : phase / (fast * 0.7), status: status as 'idle' | 'fail', t})} px={[700, 600]} w={1.6} h={1.37} radius={0.12} edge={emph > 0.1 ? SVC[i].color : undefined} edgePower={emph * 3} />
              </group>
            </group>
          );
        })}
        <Floor y={-0.5} color="#1e3a8a" />
      </Studio>
      <Chip x={540} y={200} text="miles de intentos por minuto" color="#ff2d55" appear={pop(f, fAuto, 14, 180)} size={42} />
    </AbsoluteFill>
  );
};

/* 4 — DOMINO: entran al correo y caen todas */
export const DominoScene: React.FC = () => {
  const {wf} = useTL();
  const f = useCurrentFrame();
  const t = f / 30;
  const fCoincide = wf('domino', 'coincide');
  const fDentro = wf('domino', 'dentro');
  const fCambiar = wf('domino', 'cambiar');
  const SP = 0.78;
  const H = 1.15;
  const rest = Math.asin((SP - 0.2) / H);
  const loginIn = pop(f, fCoincide, 13, 140) * (1 - ease(f, [fCambiar - 6, fCambiar + 4], [0, 1]));
  const cam: [number, number, number] = [-2.9 + Math.sin(t * 0.4) * 0.3, 2.3, 8.8 - t * 0.1];
  const look: [number, number, number] = [-0.5, 1.0, 0];
  return (
    <AbsoluteFill>
      <Studio look={{bg: '#0a0308', glow: '#3d0b2a', accent: '#ff2d55'}} chroma={kick(f, 0, 8) + kick(f, fDentro, 10) * 0.8 + kick(f, fCambiar + 6, 10) * 0.5}>
        <Rig pos={cam} look={look} />
        {SVC.map((s, i) => {
          const start = fCambiar + i * 5;
          const k = ease(f, [start, start + 7], [0, 1], 'inOut');
          const ang = i === SVC.length - 1 ? k * 1.45 : k * rest;
          const hacked = i === 0 ? ease(f, [fDentro, fDentro + 6], [0, 1]) : ease(f, [start, start + 4], [0, 1]);
          const x = -1.6 + i * SP;
          return (
            <group key={i} position={[x + 0.1, -0.0, 0]} rotation={[0, 0, -ang]}>
              <group position={[-0.1, H / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
                <DominoTile svc={s} hacked={hacked} />
              </group>
            </group>
          );
        })}
        {loginIn > 0.01 && (
          <group position={[-0.7, 2.55, 0.5]} rotation={[0, -0.3, 0]} scale={loginIn * 0.9}>
            <TexCard draw={(ctx, w, h) => drawLogin(ctx, w, h, {svc: SVC[0], pass: 1, status: f >= fDentro ? 'ok' : 'idle', t})} px={[700, 600]} w={1.6} h={1.37} radius={0.12} edge={f >= fDentro ? '#22c55e' : undefined} edgePower={2} />
          </group>
        )}
        <Floor y={0} color="#6b0f3f" />
      </Studio>
      <Headline text="ESTÁN DENTRO" start={fDentro} y={220} size={110} color="#ff4d6d" glitch={kick(f, fDentro, 12)} out={fCambiar - 4} />
      <Headline text="EFECTO DOMINÓ" start={fCambiar + 4} y={220} size={104} color="#ffd60a" />
    </AbsoluteFill>
  );
};
const DominoTile: React.FC<{svc: Service; hacked: number}> = ({svc, hacked}) => {
  const tex = useCanvasTexture(300, 600, (ctx, w, h) => drawDominoFace(ctx, w, h, {svc, hacked}));
  return <Domino face={tex} />;
};

/* 5 — TIPS: gestor + verificación en dos pasos */
export const Tips: React.FC = () => {
  const {wf} = useTL();
  const f = useCurrentFrame();
  const t = f / 30;
  const fDist = wf('tips', 'distinta');
  const fGestor = wf('tips', 'gestor');
  const cut = wf('tips', 'activa') - 4;
  const fVerif = wf('tips', 'verificación');
  const fAunque = wf('tips', 'aunque');
  const fNo = wf('tips', 'no');
  const partB = f >= cut;
  if (!partB) {
    const rows = ease(f, [fDist, fGestor + 4], [0, 4.2]);
    const cam: [number, number, number] = [Math.sin(t * 0.5) * 0.6 + 0.4, 1.4, 10.6 - t * 0.15];
    return (
      <AbsoluteFill>
        <Studio look={{bg: '#020a08', glow: '#0b3a35', accent: '#22e3a6'}} chroma={kick(f, 0, 8)}>
          <Rig pos={cam} look={[0, 1.2, 0]} />
          <group position={[-1.1, 2.4, -2.2]} rotation={[0.1, 0.5 + Math.sin(t * 0.5) * 0.1, 0]} scale={0.95}>
            <Vault dial={t * 2.2} />
          </group>
          <group position={[0.45, 0.9, 0.6]} rotation={[0, -0.2 + Math.sin(t * 0.7) * 0.1, 0]} scale={1.12}>
            <ScreenPhone draw={(ctx, w, h) => drawVaultApp(ctx, w, h, {rows, t})} />
          </group>
          <Floor y={-0.7} color="#0f5c4c" />
        </Studio>
        <Headline text="UNA DISTINTA PARA CADA SITIO" start={fDist - 2} y={200} size={66} color="#ffffff" out={fGestor - 4} />
        <Headline text="GESTOR DE CONTRASEÑAS" start={fGestor} y={200} size={72} color="#22e3a6" />
      </AbsoluteFill>
    );
  }
  const lf = f - cut;
  const blocked = ease(f, [fNo, fNo + 8], [0, 1]);
  const cam: [number, number, number] = [Math.sin(t * 0.5) * 0.7, 1.4, 10.8 - lf / 30 * 0.2];
  return (
    <AbsoluteFill>
      <Studio look={{bg: '#03060d', glow: '#0d3550', accent: '#22e3a6'}} chroma={kick(lf, 0, 10) + kick(f, fNo, 8) * 0.5}>
        <Rig pos={cam} look={[0, 1.2, 0]} />
        <group position={[-0.95, 1.55, 0]} rotation={[0, 0.35 + Math.sin(t * 0.8) * 0.15, 0]} scale={0.95 * pop(lf, 0, 12, 120)}>
          <Shield check={ease(f, [fVerif, fVerif + 16], [0, 1])} glow="#22e3a6" />
        </group>
        <group position={[1.05, 1.0, -0.5]} rotation={[0, -0.3, 0]} scale={1.0 * pop(lf, 4, 12, 120)}>
          <ScreenPhone draw={(ctx, w, h) => drawTwoFA(ctx, w, h, {blocked, t})} />
        </group>
        {[0, 1, 2].map((i) => {
          const st = fAunque + i * 7;
          const k = ease(f, [st, st + 14], [0, 1]);
          if (k <= 0) return null;
          const hit = k >= 1;
          const bounce = ease(f, [st + 14, st + 30], [0, 1]);
          const p: [number, number, number] = hit ? [-0.95 - 1.2 * bounce - 0.4, 1.6 + (i - 1) * 0.5 - 1.5 * bounce * bounce, 1.2 + bounce * 0.8] : [-4.0 + 2.6 * k, 1.6 + (i - 1) * 0.5, 1.2];
          return (
            <group key={i} position={p} rotation={[0, 0, hit ? bounce * 4 : 0]} scale={0.45 * (1 - bounce)}>
              <Key color="#ef4444" glow={0.8} />
            </group>
          );
        })}
        <Floor y={-0.7} color="#0f4a6b" />
      </Studio>
      <Headline text="VERIFICACIÓN EN 2 PASOS" start={fVerif - 2} y={200} size={70} color="#22e3a6" />
    </AbsoluteFill>
  );
};

/* 6 — OUTRO: búscate */
export const Outro: React.FC = () => {
  const {wf} = useTL();
  const f = useCurrentFrame();
  const t = f / 30;
  const fBusca = wf('outro', 'busca');
  const fHave = wf('outro', 'have');
  const fPuede = wf('outro', 'puede');
  const cam: [number, number, number] = [Math.sin(t * 0.6) * 0.6, 1.1, 10.4 - ease(f, [0, 120], [0, 1.6])];
  const look: [number, number, number] = [0, 1.0, 0];
  return (
    <AbsoluteFill>
      <Studio look={{bg: '#05040d', glow: '#24145c', accent: '#a78bfa'}} chroma={kick(f, 0, 8) + kick(f, fPuede, 10) * 0.6}>
        <Rig pos={cam} look={look} />
        <group position={[0, 0.95, 0]} rotation={[0, Math.sin(t * 0.7) * 0.14, 0]} scale={1.2}>
          <ScreenPhone draw={(ctx, w, h) => drawBreachCheck(ctx, w, h, {typed: ease(f, [fBusca, fHave], [0, 1]), result: ease(f, [fPuede, fPuede + 8], [0, 1]), t})} />
        </group>
        <Floor y={-0.7} color="#3b1a78" />
      </Studio>
      <Headline text="BÚSCATE HOY" start={fBusca} y={200} size={110} color="#ffffff" />
      <Chip x={540} y={330} text="haveibeenpwned.com" color="#a78bfa" appear={pop(f, fHave, 14, 180)} size={42} mono />
    </AbsoluteFill>
  );
};
