import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Studio, Rig, Floor} from '../core/studio';
import {WifiEmblem, AccessPoint, SignalRings} from '../models/devices';
import {ease, kick, pop} from '../core/anim';
import {wf} from '../core/timing';
import {Chip, Headline, project} from '../core/overlay';

export const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  const fQ = wf('outro', 'esta');
  const fEnd = wf('outro', 'aeropuerto');
  const flick = f > fEnd + 6 && f < fEnd + 22 && Math.floor(f / 3) % 2 === 0;
  const cam: [number, number, number] = [Math.sin(t * 0.6) * 0.3, 0.9, 13 - ease(f, [0, 120], [0, 1.6])];
  const look: [number, number, number] = [0, 0.3, 0];
  const L: [number, number, number] = [-1.05, 0, 0];
  const R: [number, number, number] = [1.05, 0, 0];
  const lblL = project([L[0], -0.85, 0.5], cam, look);
  const lblR = project([R[0], -0.85, 0.5], cam, look);
  const sL = pop(f, 2, 13, 140);
  const sR = pop(f, 7, 13, 140);
  return (
    <AbsoluteFill>
      <Studio look={{bg: '#03060d', glow: '#0f2a66'}} chroma={kick(f, 0, 8) * 1.3 + (flick ? 0.8 : 0)}>
        <Rig pos={cam} look={look} />
        {[L, R].map((p, i) => (
          <group key={i} position={p} scale={i ? sR : sL}>
            <group position={[0, 0.85 + Math.sin(t * 2 + i) * 0.05, 0]} scale={0.42} rotation={[0, Math.sin(t * 0.9 + i * 2) * 0.3, 0]}>
              <WifiEmblem color={i === 1 && flick ? '#ff2d55' : '#3b82f6'} t={t + i * 0.2} power={2.8} />
            </group>
            <group position={[0, -0.3, 0]} scale={0.5}>
              <AccessPoint led={i === 1 && flick ? '#ff2d55' : '#3b82f6'} ledPower={4} />
              <SignalRings t={t + i * 0.3} color="#3b82f6" maxR={1.6} />
            </group>
          </group>
        ))}
        <Floor y={-0.31} color="#1d3b7a" />
      </Studio>
      <Chip x={lblL.x} y={lblL.y} text="Aeropuerto_Free" color="#3b82f6" appear={ease(f, [8, 20], [0, 1])} size={30} mono />
      <Chip x={lblR.x} y={lblR.y} text="Aeropuerto_Free" color={flick ? '#ff2d55' : '#3b82f6'} appear={ease(f, [12, 24], [0, 1])} size={30} mono />
      <Headline text="¿CUÁL ES" start={fQ - 4} y={250} size={118} />
      <Headline text="LA REAL?" start={fQ + 4} y={380} size={118} color="#ffd60a" />
    </AbsoluteFill>
  );
};
