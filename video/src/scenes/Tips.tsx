import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Studio, Rig, useCanvasTexture} from '../core/studio';
import {Card} from '../models/devices';
import {drawTip, type TipIcon} from '../models/screens';
import {ease, kick, pop} from '../core/anim';
import {wf} from '../core/timing';
import {Headline} from '../core/overlay';

const TipCard: React.FC<{f: number; t: number; at: number; y: number; icon: TipIcon; title: string; sub: string; side: number}> = ({f, t, at, y, icon, title, sub, side}) => {
  const s = pop(f, at, 14, 120);
  const chk = ease(f, [at + 14, at + 26], [0, 1]);
  const tex = useCanvasTexture(1100, 340, (ctx, w, h) => drawTip(ctx, w, h, {icon, title, sub, check: chk, t}));
  if (f < at - 1) return null;
  return (
    <group position={[(1 - s) * 5 * side, y + Math.sin(t * 1.3 + y) * 0.03, (1 - s) * -2]} rotation={[0.04, (1 - s) * -0.9 * side + Math.sin(t * 0.7 + y) * 0.06 - 0.08 * side, (1 - s) * 0.15 * side]}>
      <Card tex={tex} w={3.3} h={1.02} radius={0.16} edge="#22c55e" edgePower={chk * 2} />
    </group>
  );
};

export const Tips: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  const a1 = wf('tips', 'usa');
  const a2 = wf('tips', 'desactiva');
  const a3 = wf('tips', 'mira');
  const cam: [number, number, number] = [Math.sin(t * 0.5) * 0.7, 1.0 - t * 0.05, 10.8 - t * 0.12];
  return (
    <AbsoluteFill>
      <Studio look={{bg: '#03070a', glow: '#063b3a', accent: '#22c55e'}} chroma={kick(f, 0, 8) * 1.3}>
        <Rig pos={cam} look={[0, 1.15, 0]} />
        <TipCard f={f} t={t} at={a1} y={2.55} icon="vpn" title="Datos o VPN" sub="Nada de wifi abierta" side={1} />
        <TipCard f={f} t={t} at={a2} y={1.25} icon="toggle" title="Sin auto‑conexión" sub="Que tu móvil no elija" side={-1} />
        <TipCard f={f} t={t} at={a3} y={-0.05} icon="url" title="Mira la dirección" sub="Antes de escribir nada" side={1} />
      </Studio>
      <Headline text="CÓMO PROTEGERTE" start={2} y={190} size={78} color="#4ade80" />
    </AbsoluteFill>
  );
};
