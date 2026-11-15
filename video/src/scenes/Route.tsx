import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Studio, Rig, Floor, useCanvasTexture} from '../core/studio';
import {Phone, AccessPoint, SignalRings, Laptop, DataStream} from '../models/devices';
import {drawWifiSettings, drawTerminal, drawKeyboard} from '../models/screens';
import {ease, kick, mix3, pop} from '../core/anim';
import {wf} from '../core/timing';
import {Chip, project} from '../core/overlay';

export const Route: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  const fConecta = wf('route', 'conecta');
  const fSenal = wf('route', 'señal');
  const fTodo = wf('route', 'todo');
  const fPasa = wf('route', 'pasa');
  const fPortatil = wf('route', 'portátil');

  const connected = f > fConecta + 12;
  const phoneTex = useCanvasTexture(612, 1320, (ctx, w, h) =>
    drawWifiSettings(ctx, w, h, {
      rows: [
        {name: 'Aeropuerto_Free', bars: 3, lock: false, appear: 1, state: f < fConecta ? 'none' : connected ? 'connected' : 'connecting'},
        {name: 'Aeropuerto_Free', bars: 2, lock: false, appear: 1},
        {name: 'Sala_VIP_T4', bars: 2, lock: true, appear: 1},
      ],
      scanning: 0,
      t,
    }),
  );
  const lines = f < fConecta ? 2 : 3 + Math.max(0, (f - fConecta - 8) / 7);
  const termTex = useCanvasTexture(1280, 786, (ctx, w, h) => drawTerminal(ctx, w, h, {lines, t}));
  const keysTex = useCanvasTexture(1024, 424, (ctx, w, h) => drawKeyboard(ctx, w, h));

  const phonePos: [number, number, number] = [-1.05, -1.25, 1.4];
  const lapPos: [number, number, number] = [0.55, 0.35, -0.2];
  const apPos: [number, number, number] = [-0.2, 3.3, -3.2];

  // cámara: plano general → se acerca a la pantalla del atacante
  const zoom = ease(f, [fPortatil - 4, fPortatil + 22], [0, 1], 'inOut');
  const wide: [number, number, number] = [Math.sin(t * 0.5) * 0.8 + 0.3, 1.2, 13 - t * 0.2];
  const close: [number, number, number] = [-0.35, 2.0, 3.9];
  const cam = mix3(wide, close, zoom);
  const look = mix3([0, 0.8, 0], [0.75, 1.0, -1.0], zoom);
  const g = kick(f, 0, 8) + kick(f, fPortatil, 10) * 0.8;

  const lap = project([lapPos[0] + 0.2, lapPos[1] + 2.0, lapPos[2] - 1.0], cam, look);
  const ph = project([phonePos[0], phonePos[1] - 1.75, phonePos[2]], cam, look);

  return (
    <AbsoluteFill>
      <Studio look={{bg: '#0a0306', glow: '#4a0b1c', accent: '#ff2d55'}} chroma={g * 1.4}>
        <Rig pos={cam} look={look} />
        <group position={apPos} rotation={[0.4, 0, 0]} scale={0.75}>
          <AccessPoint led="#38bdf8" ledPower={3} />
          <SignalRings t={t} color="#38bdf8" maxR={1.8} />
        </group>
        <group position={lapPos} rotation={[0, -0.3, 0]} scale={1.0}>
          <Laptop screen={termTex} keys={keysTex} open={ease(f, [0, 20], [0.6, 1])} />
          {f > fSenal && <SignalRings t={t} color="#ff2d55" maxR={2.4} speed={1} power={5} />}
        </group>
        <group position={phonePos} rotation={[-0.05, 0.35, 0.03]} scale={0.95}>
          <Phone screen={phoneTex} />
        </group>
        <DataStream
          points={[
            [phonePos[0] + 0.2, phonePos[1] + 1.2, phonePos[2]],
            [-0.3, 1.0, 0.8],
            [0.6, 1.15, -0.6],
          ]}
          t={t}
          color="#ffcf33"
          progress={ease(f, [fConecta, fConecta + 18], [0, 1])}
          packets={f > fTodo ? 7 : 2}
          speed={f > fTodo ? 0.75 : 0.3}
          power={5}
        />
        <DataStream
          points={[
            [0.7, 1.4, -0.9],
            [0.4, 2.6, -2.0],
            [apPos[0], apPos[1] + 0.1, apPos[2]],
          ]}
          t={t + 0.3}
          color="#7dd3fc"
          progress={ease(f, [fPasa, fPasa + 16], [0, 1])}
          packets={4}
          speed={0.5}
          power={3}
        />
        <Floor y={-2.4} color="#5a1020" />
      </Studio>
      <Chip x={ph.x} y={Math.min(ph.y, 1180)} text="Tú" color="#38bdf8" appear={ease(f, [4, 18], [0, 1]) * (1 - zoom)} size={36} />
      <Chip x={lap.x} y={lap.y} text="Atacante" color="#ff2d55" appear={pop(f, fSenal, 14, 180) * (1 - zoom)} size={38} />
      <Chip x={540} y={250} text="ve todo lo que envías" color="#ff2d55" appear={pop(f, fPortatil + 6, 14, 180)} size={44} />
    </AbsoluteFill>
  );
};
