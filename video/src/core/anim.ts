import {Easing, interpolate, spring} from 'remotion';
import {FPS} from './timing';

const outExpo = Easing.bezier(0.16, 1, 0.3, 1);
const inOut = Easing.bezier(0.65, 0, 0.35, 1);

/** Interpolación con clamp y easing suave (expo out por defecto). */
export const ease = (f: number, [a, b]: [number, number], [x, y]: [number, number], kind: 'out' | 'inOut' = 'out') =>
  interpolate(f, [a, b], [x, y], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: kind === 'out' ? outExpo : inOut,
  });

/** Spring 0→1 que empieza en `start`. */
export const pop = (f: number, start: number, damping = 14, stiffness = 160, mass = 0.9) =>
  spring({frame: f - start, fps: FPS, config: {damping, stiffness, mass}});

/** Mezcla de vectores. */
export const mix3 = (a: [number, number, number], b: [number, number, number], t: number): [number, number, number] => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

/** Pulso 0..1 que decae tras `start` (para flashes / aberración). */
export const kick = (f: number, start: number, len = 8) => (f < start || f > start + len ? 0 : Math.pow(1 - (f - start) / len, 2));

/** pseudo-random determinista */
export const rand = (seed: number) => {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};
