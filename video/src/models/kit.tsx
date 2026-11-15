import React, {useMemo} from 'react';
import * as THREE from 'three';
import {useCanvasTexture} from '../core/studio';
import {Phone, Card} from './devices';
import {Coin} from './objects';
import {drawCoinFace} from './screens2';

type Draw = (ctx: CanvasRenderingContext2D, w: number, h: number) => void;

export const ScreenPhone: React.FC<{draw: Draw; frameColor?: string}> = ({draw, frameColor}) => {
  const tex = useCanvasTexture(612, 1320, draw);
  return <Phone screen={tex} frameColor={frameColor} />;
};

export const TexCard: React.FC<{draw: Draw; px: [number, number]; w: number; h: number; edge?: string; edgePower?: number; radius?: number}> = ({
  draw,
  px,
  w,
  h,
  edge,
  edgePower,
  radius,
}) => {
  const tex = useCanvasTexture(px[0], px[1], draw);
  return <Card tex={tex} w={w} h={h} edge={edge} edgePower={edgePower} radius={radius} />;
};

export const TexPlane: React.FC<{draw: Draw; px: [number, number]; w: number; h: number; opacity?: number}> = ({draw, px, w, h, opacity = 1}) => {
  const tex = useCanvasTexture(px[0], px[1], draw);
  return (
    <mesh>
      <planeGeometry args={[w, h]} />
      <meshBasicMaterial map={tex} transparent toneMapped={false} opacity={opacity} depthWrite={false} />
    </mesh>
  );
};

/** Monedas que viajan por una curva. */
export const CoinStream: React.FC<{points: [number, number, number][]; t: number; count?: number; speed?: number; active?: number; scale?: number}> = ({
  points,
  t,
  count = 8,
  speed = 0.6,
  active = 1,
  scale = 0.6,
}) => {
  const face = useCanvasTexture(256, 256, (ctx, w, h) => drawCoinFace(ctx, w, h));
  const curve = useMemo(() => new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p))), [JSON.stringify(points)]);
  if (active <= 0) return null;
  return (
    <group>
      {Array.from({length: count}).map((_, i) => {
        const k = (t * speed + i / count) % 1;
        if (k > active) return null;
        const p = curve.getPointAt(k);
        const s = scale * Math.sin(Math.min(1, k * 6) * Math.PI * 0.5) * (1 - Math.max(0, k - 0.85) / 0.15);
        return (
          <group key={i} position={p} rotation={[t * 3 + i, t * 4 + i * 2, 0]} scale={Math.max(0.001, s)}>
            <Coin face={face} />
          </group>
        );
      })}
    </group>
  );
};
