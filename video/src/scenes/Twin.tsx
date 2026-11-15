import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Studio, Rig, Floor, useCanvasTexture} from '../core/studio';
import {Phone, AccessPoint, SignalRings} from '../models/devices';
import {drawWifiSettings, type NetRow} from '../models/screens';
import {ease, kick, pop} from '../core/anim';
import {wf} from '../core/timing';
import {Chip, Headline, project} from '../core/overlay';

export const Twin: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  const fRedes = wf('twin', 'redes');
  const fCrear = wf('twin', 'crear');
  const fMismo = wf('twin', 'mismo');
  const fGemelo = wf('twin', 'gemelo');

  const fakeIn = pop(f, fCrear, 12, 120);
  const danger = ease(f, [fGemelo, fGemelo + 8], [0, 1]);
  const g = kick(f, fGemelo, 10) + kick(f, 0, 8);

  const rows: NetRow[] = [
    {name: 'Aeropuerto_Free', bars: 3, lock: false, appear: ease(f, [fMismo, fMismo + 10], [0, 1]), danger},
    {name: 'Aeropuerto_Free', bars: 2, lock: false, appear: ease(f, [fRedes, fRedes + 10], [0, 1])},
    {name: 'Sala_VIP_T4', bars: 2, lock: true, appear: ease(f, [fRedes + 6, fRedes + 16], [0, 1])},
    {name: 'Cafeteria_B', bars: 1, lock: true, appear: ease(f, [fRedes + 12, fRedes + 22], [0, 1])},
  ];
  const screen = useCanvasTexture(612, 1320, (ctx, w, h) => drawWifiSettings(ctx, w, h, {rows, scanning: f < fMismo + 20 ? 1 : 0, t}));

  // cámara: entra desde abajo y se acerca al móvil al final
  const intro = ease(f, [0, 30], [0, 1]);
  const close = ease(f, [fGemelo - 6, fGemelo + 30], [0, 1], 'inOut');
  const cam: [number, number, number] = [
    Math.sin(t * 0.6) * 0.5 + close * 0.2,
    -1.2 + intro * 1.8 - close * 0.6,
    12.5 - intro * 1.5 - close * 4.2,
  ];
  const look: [number, number, number] = [0, 0.7 - close * 0.6, 0];

  const realPos: [number, number, number] = [-1.5, 2.15, -3.2];
  const fakePos: [number, number, number] = [1.5, 2.15, -3.2];
  const realLbl = project([realPos[0], realPos[1] - 0.55, realPos[2]], cam, look);
  const fakeLbl = project([fakePos[0], fakePos[1] - 0.55, fakePos[2]], cam, look);

  return (
    <AbsoluteFill>
      <Studio look={{bg: '#03080c', glow: '#0b3b4a', accent: '#22d3ee'}} chroma={g * 1.4}>
        <Rig pos={cam} look={look} />
        <group position={realPos} rotation={[0.35, 0, 0]} scale={0.8}>
          <AccessPoint led="#38bdf8" ledPower={4} />
          <SignalRings t={t} color="#38bdf8" maxR={2.2} />
        </group>
        <group position={[fakePos[0], fakePos[1] + (1 - fakeIn) * -2.5, fakePos[2]]} rotation={[0.35, 0, 0]} scale={0.8 * fakeIn}>
          <AccessPoint led="#ff2d55" body="#1b1e26" ledPower={4 + danger * 3} />
          <SignalRings t={t + 0.2} color="#ff2d55" maxR={2.6} speed={0.9} power={4 + danger * 6} />
        </group>
        <group position={[0, -0.15 + Math.sin(t * 1.4) * 0.05, 1.2]} rotation={[-0.08, Math.sin(t * 0.8) * 0.18 - 0.05, 0.02]} scale={1.25}>
          <Phone screen={screen} />
        </group>
        <Floor y={-2.2} color="#0e4d5c" />
      </Studio>
      <Chip x={realLbl.x} y={realLbl.y} text="Real" color="#38bdf8" appear={ease(f, [6, 20], [0, 1]) * (1 - close)} size={34} />
      <Chip x={fakeLbl.x} y={fakeLbl.y} text="Falsa" color="#ff2d55" appear={ease(f, [fMismo, fMismo + 14], [0, 1]) * (1 - close)} size={34} />
      <Headline text="GEMELO MALVADO" start={fGemelo} y={330} size={108} color="#ff4d6d" glitch={kick(f, fGemelo, 14) + 0.08} />
    </AbsoluteFill>
  );
};
