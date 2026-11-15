import React, {useMemo} from 'react';
import * as THREE from 'three';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {SANS, MONO} from './fonts';
import {ALL_WORDS, FPS, type Word} from './timing';
import {ease, pop} from './anim';
import {W, H} from './studio';

/** Proyecta un punto 3D a píxeles de pantalla para colocar etiquetas HTML. */
const _cam = new THREE.PerspectiveCamera(35, W / H, 0.1, 200);
export const project = (p: [number, number, number], camPos: [number, number, number], look: [number, number, number], fov = 35, roll = 0) => {
  _cam.fov = fov;
  _cam.updateProjectionMatrix();
  _cam.position.set(...camPos);
  _cam.up.set(Math.sin(roll), Math.cos(roll), 0);
  _cam.lookAt(...look);
  _cam.updateMatrixWorld();
  const v = new THREE.Vector3(...p).project(_cam);
  return {x: (v.x * 0.5 + 0.5) * W, y: (-v.y * 0.5 + 0.5) * H};
};

/** Pastilla de cristal. */
export const Chip: React.FC<{x: number; y: number; text: string; color: string; appear: number; size?: number; icon?: string; mono?: boolean}> = ({
  x,
  y,
  text,
  color,
  appear,
  size = 40,
  icon,
  mono,
}) => {
  if (appear <= 0.001) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%,-50%) translateY(${(1 - appear) * 30}px) scale(${0.85 + appear * 0.15})`,
        opacity: Math.min(1, appear * 1.4),
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: `${size * 0.36}px ${size * 0.7}px`,
        borderRadius: 999,
        background: 'linear-gradient(180deg, rgba(22,28,44,.72), rgba(8,11,20,.72))',
        backdropFilter: 'blur(18px)',
        border: '2px solid rgba(255,255,255,.14)',
        boxShadow: `0 0 0 1px rgba(0,0,0,.4), 0 18px 50px rgba(0,0,0,.45), 0 0 40px ${color}33`,
        color: '#fff',
        fontFamily: mono ? MONO : SANS,
        fontWeight: 800,
        fontSize: size,
        letterSpacing: mono ? 0 : -0.5,
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: size * 0.42,
          height: size * 0.42,
          borderRadius: 99,
          background: color,
          boxShadow: `0 0 ${size * 0.5}px ${color}`,
          display: icon ? 'none' : 'block',
        }}
      />
      {icon ? <span style={{color}}>{icon}</span> : null}
      {text}
    </div>
  );
};

/** Titular grande con entrada letra a letra. */
export const Headline: React.FC<{text: string; start: number; y: number; color?: string; size?: number; glitch?: number; out?: number}> = ({
  text,
  start,
  y,
  color = '#ffffff',
  size = 120,
  glitch = 0,
  out = 1e9,
}) => {
  const f = useCurrentFrame();
  if (f < start) return null;
  const fade = ease(f, [out, out + 8], [1, 0]);
  if (fade <= 0) return null;
  const letters = text.split('');
  const jx = glitch > 0 ? Math.sin(f * 37) * 14 * glitch : 0;
  const layer = (dx: number, c: string, op: number) => (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: y,
        transform: `translate(${dx + jx}px,-50%)`,
        textAlign: 'center',
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: size,
        letterSpacing: -size * 0.04,
        lineHeight: 1,
        color: c,
        opacity: op * fade,
        mixBlendMode: dx ? 'screen' : 'normal',
        textShadow: dx ? 'none' : `0 0 40px ${color}88, 0 8px 30px rgba(0,0,0,.6)`,
      }}
    >
      {letters.map((ch, i) => {
        const s = pop(f, start + i * 1.3, 13, 200);
        return (
          <span key={i} style={{display: 'inline-block', transform: `translateY(${(1 - s) * 60}px) scale(${0.6 + s * 0.4})`, opacity: s, whiteSpace: 'pre'}}>
            {ch}
          </span>
        );
      })}
    </div>
  );
  return (
    <>
      {glitch > 0 && layer(-10 * glitch, '#ff0040', 0.8)}
      {glitch > 0 && layer(10 * glitch, '#00e5ff', 0.8)}
      {layer(0, color, 1)}
    </>
  );
};

/** Destello de transición al inicio de cada escena. */
export const Flash: React.FC<{color?: string}> = ({color = '#bcd4ff'}) => {
  const f = useCurrentFrame();
  const o = ease(f, [0, 7], [0.55, 0]);
  if (o <= 0) return null;
  return <AbsoluteFill style={{background: `radial-gradient(60% 45% at 50% 45%, ${color}, transparent 70%)`, opacity: o, mixBlendMode: 'screen'}} />;
};

/* ============ Subtítulos ============ */
type Chunk = {words: Word[]; from: number; to: number; idx0: number};
const buildChunks = (all: Word[]): Chunk[] => {
  const chunks: Chunk[] = [];
  let cur: Word[] = [];
  let idx0 = 0;
  all.forEach((w, i) => {
    if (!cur.length) idx0 = i;
    cur.push(w);
    const brk = /[.,:?!…]$/.test(w.w) || cur.length >= 3;
    if (brk) {
      chunks.push({words: cur, from: cur[0].start, to: 0, idx0});
      cur = [];
    }
  });
  if (cur.length) chunks.push({words: cur, from: cur[0].start, to: 0, idx0});
  chunks.forEach((c, i) => {
    const next = chunks[i + 1];
    const lastEnd = c.words[c.words.length - 1].end;
    c.to = next ? Math.min(next.from, lastEnd + 0.6) : lastEnd + 0.8;
  });
  return chunks;
};
const clean = (s: string) => s.replace(/\.\.\./g, '…');
const OLD_KEYS = /^(VPN|gemelo|malvado|falsa|cifrado|candado|atacante|contraseña)/i;

export const Captions: React.FC<{words?: Word[]; keywords?: RegExp; accent?: string}> = ({words = ALL_WORDS, keywords = OLD_KEYS, accent = '#ffd60a'}) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const CHUNKS = useMemo(() => buildChunks(words), [words]);
  const ci = CHUNKS.findIndex((c) => t >= c.from - 0.05 && t < c.to);
  if (ci < 0) return null;
  const c = CHUNKS[ci];
  const enter = pop(f, Math.round((c.from - 0.05) * FPS), 15, 260);
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          top: 1265,
          left: 60,
          right: 60,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '4px 36px',
          transform: `translateY(${(1 - enter) * 28}px) scale(${0.92 + enter * 0.08})`,
          opacity: Math.min(1, enter * 1.5),
        }}
      >
        {c.words.map((w, i) => {
          const active = t >= w.start - 0.03;
          const k = pop(f, Math.round(w.start * FPS) - 1, 12, 300);
          return (
            <span
              key={i}
              style={{
                fontFamily: SANS,
                fontWeight: 900,
                fontSize: 92,
                lineHeight: 1.12,
                letterSpacing: -2,
                color: active ? (w.w.replace(/^[«"¿¡]+/, '').match(keywords) ? accent : '#ffffff') : 'rgba(255,255,255,.38)',
                transform: `scale(${active ? 1 + (1 - k) * 0.12 : 1})`,
                display: 'inline-block',
                WebkitTextStroke: '14px rgba(0,0,0,.9)',
                paintOrder: 'stroke fill',
                textShadow: '0 10px 30px rgba(0,0,0,.55)',
              }}
            >
              {clean(w.w)}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export {MONO};
