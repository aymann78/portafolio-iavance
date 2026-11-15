import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Studio, Rig, Floor, useCanvasTexture} from '../../core/studio';
import {useTL} from '../../core/timeline';
import {ease, kick, mix3, pop} from '../../core/anim';
import {Chip, Headline, project} from '../../core/overlay';
import {ScreenPhone, TexCard, CoinStream} from '../../models/kit';
import {PriceTag, Headphones} from '../../models/objects';
import {KeyholeTile} from '../../Logos';
import {drawThread, drawPayApp, drawTipV, drawPriceText} from '../../models/screens2';

const eur = (n: number) => n.toFixed(2).replace('.', ',') + ' €';

/* 1 — HOOK: vendes algo y el comprador escribe */
export const Hook: React.FC = () => {
  const {wf} = useTL();
  const f = useCurrentFrame();
  const t = f / 30;
  const fComprador = wf('hook', 'comprador');
  const fYa = wf('hook', 'ya');
  const fAcept = wf('hook', 'aceptarlo');
  const price = useCanvasTexture(512, 256, (ctx, w, h) => drawPriceText(ctx, w, h, {text: '150 €'}));
  const down = ease(f, [fComprador - 10, fComprador + 30], [0, 1], 'inOut');
  const cam = mix3([0.2, 2.7, 9.0], [Math.sin(t * 0.5) * 0.5, 1.0, 10.8], down);
  const look = mix3([0, 2.6, 0], [0, 0.9, 0], down);
  return (
    <AbsoluteFill>
      <Studio look={{bg: '#030a0c', glow: '#0b4250', accent: '#22d3ee'}} chroma={kick(f, 0, 8) + kick(f, fAcept, 10) * 0.6}>
        <Rig pos={cam} look={look} />
        <group position={[-0.4, 2.85 + Math.sin(t * 1.5) * 0.06, -0.6]} rotation={[0.25, 0.5 + t * 0.35, 0.1]} scale={0.95}>
          <Headphones />
        </group>
        <group position={[0.62, 1.95, 0.4]} rotation={[0, -0.35 + Math.sin(t * 2) * 0.12, Math.sin(t * 2.2) * 0.1 - 0.12]} scale={0.7 * pop(f, 6, 11, 120)}>
          <PriceTag tex={price} color="#22e3a6" />
        </group>
        <group position={[0, 0.55, 0.8]} rotation={[-0.03, Math.sin(t * 0.7) * 0.12, 0]} scale={1.1 * pop(f, fComprador - 12, 13, 120)}>
          <ScreenPhone
            draw={(ctx, w, h) =>
              drawThread(ctx, w, h, {
                name: 'Comprador_92',
                sub: 'Cascos inalámbricos · 150 €',
                style: 'chat',
                avatar: '#0891b2',
                t,
                typing: f > fComprador + 22 && f < fYa ? 1 : 0,
                msgs: [
                  {text: 'Hola! Siguen disponibles los cascos?', appear: ease(f, [fComprador, fComprador + 8], [0, 1])},
                  {text: 'Sí! 150 €', me: true, appear: ease(f, [fComprador + 14, fComprador + 22], [0, 1])},
                  {text: 'Ya te he hecho el Bizum, solo tienes que aceptarlo', appear: ease(f, [fYa, fYa + 8], [0, 1]), danger: ease(f, [fAcept, fAcept + 6], [0, 1])},
                ],
              })
            }
          />
        </group>
        <Floor y={-1.2} color="#0e5563" />
      </Studio>
      <Headline text="SEGUNDA MANO" start={4} y={210} size={96} color="#22e3a6" out={fComprador - 8} />
    </AbsoluteFill>
  );
};

/* 2 — REVEAL: no es un pago, es una solicitud */
export const Reveal: React.FC = () => {
  const {wf} = useTL();
  const f = useCurrentFrame();
  const t = f / 30;
  const fNo = wf('reveal', 'no');
  const fSol = wf('reveal', 'solicitud');
  const fPid = wf('reveal', 'pidiendo');
  const push = ease(f, [fSol - 4, fSol + 24], [0, 1], 'inOut');
  const cam = mix3([Math.sin(t * 0.6) * 0.8, 1.0, 10.5], [0.05, 1.0, 7.5], push);
  const look = mix3([0, 0.85, 0], [0, 0.98, 0], push);
  return (
    <AbsoluteFill>
      <Studio look={{bg: '#0c0308', glow: '#5c0d3a', accent: '#f472b6'}} chroma={kick(f, 0, 8) + kick(f, fNo, 10) + kick(f, fSol, 8) * 0.5}>
        <Rig pos={cam} look={look} />
        <group position={[0, 0.85, 0]} rotation={[0, Math.sin(t * 0.8) * 0.15, 0]} scale={1.22}>
          <ScreenPhone draw={(ctx, w, h) => drawPayApp(ctx, w, h, {mode: 'request', amount: '150,00 €', from: 'Comprador_92', pressed: 0, highlight: ease(f, [fSol, fSol + 6], [0, 1]), t})} />
        </group>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} position={[Math.cos(t * 0.8 + i * 1.57) * 2.3, 0.85 + Math.sin(t * 1.3 + i) * 0.6, Math.sin(t * 0.8 + i * 1.57) * 1.2 - 2.4]}>
            <torusGeometry args={[0.18, 0.03, 12, 48]} />
            <meshStandardMaterial color="#000" emissive="#ff2d55" emissiveIntensity={2.6} toneMapped={false} />
          </mesh>
        ))}
        <Floor y={-1.0} color="#6b0f3f" />
      </Studio>
      <Headline text="NO ES UN PAGO" start={fNo} y={230} size={112} color="#ff4d6d" glitch={Math.max(kick(f, fNo, 12), 0.06)} />
      <Chip x={540} y={360} text="te lo pide él a ti" color="#ff2d55" appear={pop(f, fPid, 14, 180)} size={44} />
    </AbsoluteFill>
  );
};

/* 3 — HOW: aceptas y el dinero se va */
export const How: React.FC = () => {
  const {wf} = useTL();
  const f = useCurrentFrame();
  const t = f / 30;
  const fAcept = wf('how', 'aceptar');
  const fSale = wf('how', 'sale');
  const pressed = ease(f, [fAcept, fAcept + 5], [0, 1]);
  const flow = ease(f, [fAcept + 6, fAcept + 30], [0, 1]);
  const bal = 820 - 150 * ease(f, [fAcept + 10, fAcept + 40], [0, 1]);
  const cam: [number, number, number] = [Math.sin(t * 0.4) * 0.4, 1.3, 11.0 - t * 0.12];
  const look: [number, number, number] = [0, 0.95, 0];
  const L: [number, number, number] = [-1.05, 0.95, 0];
  const R: [number, number, number] = [1.1, 0.95, -0.6];
  const lblL = project([L[0], L[1] + 1.65, L[2]], cam, look);
  const lblR = project([R[0], R[1] + 1.65, R[2]], cam, look);
  return (
    <AbsoluteFill>
      <Studio look={{bg: '#07040c', glow: '#2e1065', accent: '#a78bfa'}} chroma={kick(f, 0, 8) + kick(f, fSale, 10)}>
        <Rig pos={cam} look={look} />
        <group position={L} rotation={[0, 0.22, 0]} scale={1.15}>
          <ScreenPhone
            draw={(ctx, w, h) => drawPayApp(ctx, w, h, {mode: 'request', amount: '150,00 €', from: 'Comprador_92', pressed, highlight: pressed, balance: eur(bal), t})}
          />
        </group>
        <group position={R} rotation={[0, -0.22, 0]} scale={1.15}>
          <ScreenPhone
            frameColor="#3a3f4a"
            draw={(ctx, w, h) => drawPayApp(ctx, w, h, {mode: 'received', amount: '150,00 €', from: 'Vendedor', pressed: 0, highlight: flow, t})}
          />
        </group>
        <CoinStream points={[[-0.9, 1.3, 0.4], [0, 2.4, 0.9], [0.9, 1.3, -0.2]]} t={t} active={flow} count={9} speed={0.9} scale={0.55} />
        <Floor y={-0.6} color="#3b1a78" />
      </Studio>
      <Chip x={lblL.x} y={lblL.y} text="Tú" color="#38bdf8" appear={ease(f, [4, 16], [0, 1])} size={36} />
      <Chip x={lblR.x} y={lblR.y} text="Estafador" color="#ff2d55" appear={ease(f, [10, 22], [0, 1])} size={36} />
      <Headline text="−150 €" start={fSale} y={170} size={140} color="#ff4d6d" glitch={kick(f, fSale, 12)} />
    </AbsoluteFill>
  );
};

/* 4 — KEY: el dinero entra solo */
export const Key: React.FC = () => {
  const {wf} = useTL();
  const f = useCurrentFrame();
  const t = f / 30;
  const fNada = wf('key', 'nada');
  const fEntra = wf('key', 'entra');
  const cam: [number, number, number] = [Math.sin(t * 0.5) * 0.7, 1.2, 10.2 - t * 0.2];
  return (
    <AbsoluteFill>
      <Studio look={{bg: '#020a06', glow: '#0c4a2e', accent: '#22e3a6'}} chroma={kick(f, 0, 8)}>
        <Rig pos={cam} look={[0, 0.9, 0]} />
        <group position={[0, 0.7, 0]} rotation={[0, Math.sin(t * 0.7) * 0.18, 0]} scale={1.18}>
          <ScreenPhone draw={(ctx, w, h) => drawPayApp(ctx, w, h, {mode: 'received', amount: '150,00 €', from: 'Comprador_92', pressed: 0, highlight: ease(f, [fEntra, fEntra + 6], [0, 1]), t})} />
        </group>
        <CoinStream points={[[-0.3, 4.6, -1.2], [0.2, 3.4, 0.2], [0, 1.6, 0.4]]} t={t} active={1} count={10} speed={0.75} scale={0.6} />
        <CoinStream points={[[1.6, 4.4, -1.5], [0.9, 3.0, 0.3], [0.1, 1.5, 0.4]]} t={t + 0.37} active={1} count={6} speed={0.6} scale={0.5} />
        <Floor y={-1.2} color="#0f5132" />
      </Studio>
      <Chip x={540} y={250} text="sin botones · sin PIN" color="#22e3a6" appear={pop(f, fNada, 14, 180)} size={46} />
      <Headline text="ENTRA SOLO" start={fEntra} y={370} size={120} color="#22e3a6" />
    </AbsoluteFill>
  );
};

/* 5 — TIPS */
const TIPS = [
  {title: '¿Aceptar para cobrar?', sub: 'Es una estafa', color: '#ff4d6d', mark: 'cross' as const},
  {title: '¿Tu PIN para cobrar?', sub: 'También es estafa', color: '#ff4d6d', mark: 'cross' as const},
  {title: 'Solicitud ≠ envío', sub: 'Lee siempre la palabra', color: '#22e3a6', mark: 'check' as const},
];
export const Tips: React.FC = () => {
  const {wf} = useTL();
  const f = useCurrentFrame();
  const t = f / 30;
  const at = [wf('tips', 'aceptar'), wf('tips', 'pin'), wf('tips', 'fíjate')];
  const cam: [number, number, number] = [0.4 + Math.sin(t * 0.5) * 0.4, 1.35, 11 - t * 0.12];
  return (
    <AbsoluteFill>
      <Studio look={{bg: '#06040a', glow: '#3b0d2e', accent: '#f472b6'}} chroma={kick(f, 0, 8)}>
        <Rig pos={cam} look={[0, 1.25, 0]} />
        {TIPS.map((c, i) => {
          const s = pop(f, at[i], 13, 120);
          if (f < at[i] - 1) return null;
          const chk = ease(f, [at[i] + 10, at[i] + 22], [0, 1]);
          const side = i % 2 ? -1 : 1;
          return (
            <group key={i} position={[(1 - s) * 4.5 * side, 2.6 - i * 1.3, 0]} rotation={[0.04, (1 - s) * -0.8 * side + Math.sin(t * 0.7 + i) * 0.06, (1 - s) * 0.2 * side]}>
              <TexCard draw={(ctx, w, h) => drawTipV(ctx, w, h, {n: i + 1, ...c, check: chk})} px={[1100, 340]} w={3.3} h={1.02} radius={0.16} edge={c.color} edgePower={chk * 2} />
            </group>
          );
        })}
      </Studio>
      <Headline text="OJO A ESTO" start={2} y={190} size={90} color="#f472b6" />
    </AbsoluteFill>
  );
};

/* 6 — OUTRO: marca */
export const Outro: React.FC = () => {
  const {wf} = useTL();
  const f = useCurrentFrame();
  const t = f / 30;
  const fCobrar = wf('outro', 'cobrar');
  const fNada = wf('outro', 'nada');
  const s = pop(f, 0, 12, 110);
  const cam: [number, number, number] = [Math.sin(t * 0.8) * 0.6, 0.6, 11.5 - ease(f, [0, 110], [0, 1.4])];
  return (
    <AbsoluteFill>
      <Studio look={{bg: '#04070d', glow: '#0b3a35', accent: '#22e3a6'}} chroma={kick(f, 0, 8) + kick(f, fNada, 10) * 0.3} bloom={1.3}>
        <Rig pos={cam} look={[0, 0.55, 0]} />
        <group position={[0, 0.5, 0]} rotation={[0, t * 0.6 - 0.5, 0]} scale={0.72 * s}>
          <KeyholeTile rotation={[0.12, 0, 0.02]} power={3.4 + kick(f, fNada, 14) * 3} />
        </group>
        <Floor y={-1.4} color="#0f5c4c" />
      </Studio>
      <Headline text="COBRAR NUNCA" start={fCobrar - 2} y={230} size={104} color="#ffffff" />
      <Headline text="TE PIDE NADA" start={fCobrar + 8} y={350} size={104} color="#22e3a6" />
      <Chip x={540} y={1160} text="Bajo Llave" color="#22e3a6" appear={pop(f, fNada + 10, 14, 160)} size={40} />
    </AbsoluteFill>
  );
};
