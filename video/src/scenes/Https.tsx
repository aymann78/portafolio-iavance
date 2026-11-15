import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Studio, Rig, Floor, useCanvasTexture} from '../core/studio';
import {Phone, Padlock, DataStream} from '../models/devices';
import {drawCipherText, drawLoginPortal} from '../models/screens';
import {ease, kick, mix3, pop} from '../core/anim';
import {wf} from '../core/timing';
import {Chip, Headline, project} from '../core/overlay';

const LockPart: React.FC<{f: number; t: number}> = ({f, t}) => {
  const fCandado = wf('https', 'candado');
  const fCifrado = wf('https', 'cifrado');
  const shut = pop(f, fCandado, 9, 220);
  const enc = ease(f, [fCifrado - 4, fCifrado + 22], [0, 1]);
  const text = useCanvasTexture(1200, 200, (ctx, w, h) => drawCipherText(ctx, w, h, {plain: 'contraseña123', enc, t}));
  const ang = -0.55 + t * 0.22;
  const cam: [number, number, number] = [Math.sin(ang) * 8.5, 1.3, Math.cos(ang) * 8.5];
  const g = kick(f, 0, 8) + kick(f, fCandado, 8) * 0.6;
  return (
    <>
      <Studio look={{bg: '#020a06', glow: '#0c4a2e', accent: '#34d399'}} chroma={g * 1.3}>
        <Rig pos={cam} look={[0, 1.15, 0]} />
        <group position={[0, 0.55, 0]} rotation={[0, Math.sin(t * 0.8) * 0.25, 0]} scale={1.35}>
          <Padlock color="#10b981" shackleUp={1 - shut} glow={0.15 + kick(f, fCandado, 14) * 1.5} />
        </group>
        <DataStream points={[[-3.6, 0.45, 0.7], [-1.8, 0.5, 0.75], [0, 0.45, 0.75]]} t={t} color="#ffcf33" packets={4} speed={0.6} power={5} />
        <DataStream points={[[0, 0.45, 0.75], [1.8, 0.5, 0.75], [3.6, 0.45, 0.7]]} t={t} color="#34d399" packets={4} speed={0.6} power={5} />
        <mesh position={[0, 3.25, 0]} rotation={[0, ang, 0]}>
          <planeGeometry args={[3.3, 0.55]} />
          <meshBasicMaterial map={text} transparent toneMapped={false} />
        </mesh>
        <Floor y={-1.0} color="#0f5132" />
      </Studio>
      <Chip x={540} y={250} text="HTTPS · cifrado" color="#34d399" appear={pop(f, fCandado + 4, 14, 180)} size={44} icon="🔒" />
    </>
  );
};

const PhishPart: React.FC<{f: number; t: number; from: number}> = ({f, t, from}) => {
  const lf = f - from;
  const fPagina = wf('https', 'página') - from;
  const fIdentica = wf('https', 'idéntica') - from;
  const fDes = wf('https', 'des') - from;
  const fPass = wf('https', 'contraseña') - from;

  const fakeTex = useCanvasTexture(612, 1320, (ctx, w, h) =>
    drawLoginPortal(ctx, w, h, {url: 'wifi-aeropuerto.net', secure: false, typed: ease(lf, [fDes - 8, fPass + 14], [0, 1]), urlFlag: ease(lf, [fPass, fPass + 6], [0, 1]), t}),
  );
  const realTex = useCanvasTexture(612, 1320, (ctx, w, h) => drawLoginPortal(ctx, w, h, {url: 'wifi.aeropuerto.es', secure: true, typed: 0, urlFlag: ease(lf, [fPass, fPass + 6], [0, 1]), t}));

  const split = ease(lf, [fIdentica - 2, fIdentica + 16], [0, 1], 'inOut');
  const realIn = pop(lf, fIdentica - 2, 13, 140);
  const fakeIn = pop(lf, 0, 13, 150);
  const push = ease(lf, [fPass - 2, fPass + 22], [0, 1], 'inOut');

  const fakePos: [number, number, number] = [split * 0.92, 0.45, 0];
  const realPos: [number, number, number] = [-0.92, 0.45, -0.001];
  // URL del falso en mundo ≈ (x, 0.45 + 0.84*1.15, 0)
  const urlFake: [number, number, number] = [fakePos[0] + 0.05, 0.45 + 0.97, 0];
  const cam = mix3([Math.sin(t * 0.6) * 0.35, 0.6, 7.6 + (1 - split) * -1.2], [urlFake[0] + 0.05, urlFake[1] - 0.05, 2.6], push);
  const look = mix3([0, 0.5, 0], urlFake, push);
  const g = kick(lf, 0, 10) + kick(lf, fPass, 10) * 0.8;

  const realLbl = project([realPos[0], 0.45 - 1.45, 0], cam, look);
  const fakeLbl = project([fakePos[0], 0.45 - 1.45, 0], cam, look);

  return (
    <>
      <Studio look={{bg: '#07040d', glow: '#2e1065', accent: '#a78bfa'}} chroma={g * 1.4}>
        <Rig pos={cam} look={look} />
        <group position={realPos} rotation={[0, 0.12, 0]} scale={1.15 * realIn}>
          <Phone screen={realTex} />
        </group>
        <group position={fakePos} rotation={[0, -0.12 * split, 0]} scale={1.15 * fakeIn}>
          <Phone screen={fakeTex} frameColor="#b9bec8" />
        </group>
        <Floor y={-1.0} color="#3b1a78" />
      </Studio>
      <Chip x={realLbl.x} y={realLbl.y} text="REAL" color="#22c55e" appear={ease(lf, [fIdentica + 6, fIdentica + 18], [0, 1]) * (1 - push)} size={36} />
      <Chip x={fakeLbl.x} y={fakeLbl.y} text="FALSA" color="#ff2d55" appear={ease(lf, [fIdentica + 10, fIdentica + 22], [0, 1]) * (1 - push)} size={36} />
      <Headline text="PÁGINA FALSA" start={from + fPagina} y={205} size={112} color="#ff4d6d" glitch={kick(lf, fPagina, 12) + 0.06} out={from + fIdentica} />
      <Headline text="¿VES LA DIFERENCIA?" start={from + fIdentica + 8} y={205} size={84} color="#ffffff" out={from + fPass - 4} />
    </>
  );
};

export const Https: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  const cut = wf('https', 'malo') - 5;
  return <AbsoluteFill>{f < cut ? <LockPart f={f} t={t} /> : <PhishPart f={f} t={t} from={cut} />}</AbsoluteFill>;
};
