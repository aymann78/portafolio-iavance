import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Studio, Rig, Floor} from '../core/studio';
import {WifiEmblem, AccessPoint, SignalRings} from '../models/devices';
import {ease, kick, pop, rand} from '../core/anim';
import {wf} from '../core/timing';
import {Chip, Headline, project} from '../core/overlay';

export const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  const turn = wf('hook', 'puede');
  const bad = f >= turn;
  const color = bad ? '#ff2d55' : '#3b82f6';
  const g = kick(f, turn, 10);
  const jit = g > 0 ? [(rand(f) - 0.5) * 0.35 * g, (rand(f + 9) - 0.5) * 0.25 * g] : [0, 0];

  const push = ease(f, [0, 75], [0, 1]);
  const cam: [number, number, number] = [Math.sin(t * 0.7) * 0.6, 0.9 - push * 0.3, 17 - push * 7.5 - t * 0.25];
  const look: [number, number, number] = [0, 0.95, 0];
  const s = pop(f, 2, 12, 120);

  const chipPos = project([0, -1.25, 0.8], cam, look);
  return (
    <AbsoluteFill>
      <Studio look={{bg: bad ? '#0c0408' : '#03060d', glow: bad ? '#5a0f22' : '#0f2a66'}} chroma={g * 1.6 + 0.05}>
        <Rig pos={cam} look={look} />
        <group position={[jit[0], 0.45 + jit[1] + Math.sin(t * 2) * 0.06, 0]} rotation={[0.05, Math.sin(t * 0.9) * 0.35, 0]} scale={0.82 * s * (1 + g * 0.12)}>
          <WifiEmblem color={color} t={t} power={bad ? 3.4 : 2.8} />
        </group>
        <group position={[0, -1.55, 0]} scale={0.85}>
          <AccessPoint led={color} body={bad ? '#1a1d24' : '#e9edf3'} ledPower={4} />
          <SignalRings t={t} color={color} maxR={3.2} power={bad ? 6 : 4} />
        </group>
        <Floor y={-1.56} color={bad ? '#5a1020' : '#1d3b7a'} />
      </Studio>
      <Headline text={bad ? '¿WIFI GRATIS?' : 'WIFI GRATIS'} start={bad ? turn : 3} y={280} size={bad ? 128 : 136} color={bad ? '#ff4d6d' : '#ffffff'} glitch={bad ? Math.max(g, 0.12) : 0} />
      <Chip
        x={chipPos.x}
        y={Math.min(chipPos.y, 1140)}
        text="Aeropuerto_Free"
        color={bad ? '#ff2d55' : '#22c55e'}
        appear={pop(f, wf('hook', 'gratis'), 14, 180)}
        mono
        size={42}
      />
    </AbsoluteFill>
  );
};
