// Shared timeline + layout (pure math, no three.js) — used by 3D scene and overlay.
export const FPS = 30;
export const DURATION = 31.0;
export const W = 1080, H = 1920;

// ---------- utils ----------
export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const smooth = (a, b, x) => { const u = clamp((x - a) / (b - a)); return u * u * (3 - 2 * u); };
export const smoother = (a, b, x) => { const u = clamp((x - a) / (b - a)); return u * u * u * (u * (u * 6 - 15) + 10); };
export const easeIn3 = (a, b, x) => { const u = clamp((x - a) / (b - a)); return u * u * u; };
export const easeOut3 = (a, b, x) => { const u = clamp((x - a) / (b - a)); return 1 - Math.pow(1 - u, 3); };
export const lerp = (a, b, u) => a + (b - a) * u;
const D2R = Math.PI / 180;

// ---------- movement layout (mm) ----------
export const L = {
  C: [0, 0],               // center wheel (minute)
  B: [-4.14, 4.14],        // barrel
  T: [3.18, -3.79],        // third wheel
  F: [0, -6.61],           // fourth wheel (small seconds)
  E: [3.90, -7.30],        // escape wheel
};
// escapement local frame: origin = escape wheel center, +y towards pallet/balance, mirrored X
const ex = [-Math.cos(30 * D2R), Math.sin(30 * D2R)];  // local +x in world
const ey = [Math.sin(30 * D2R), Math.cos(30 * D2R)];   // local +y in world
export const ESC = { D: 2.54, Re: 2.2, Lb: 4.2, ex, ey };
export function esc2world(lx, ly) {
  return [L.E[0] + lx * ex[0] + ly * ey[0], L.E[1] + lx * ex[1] + ly * ey[1]];
}
L.P = esc2world(0, ESC.D);
L.BAL = esc2world(0, ESC.D + ESC.Lb);

// ---------- mechanism time (speed ramps) ----------
// rate keys: [t, rate]; interpolated smoothly in log space
const RATE_KEYS = [
  [0, 1], [15.7, 1], [16.9, 0.04], [17.5, 0.04], [18.5, 0.0075], [20.7, 0.0075],
  [21.7, 0.04], [22.8, 0.04], [24.8, 1], [DURATION, 1],
];
export function rate(t) {
  for (let i = 0; i < RATE_KEYS.length - 1; i++) {
    const [t0, r0] = RATE_KEYS[i], [t1, r1] = RATE_KEYS[i + 1];
    if (t <= t1) {
      const u = smooth(t0, t1, t);
      return Math.exp(lerp(Math.log(r0), Math.log(r1), u));
    }
  }
  return 1;
}
// integrate rate
const DT = 1 / 600;
const TAU_TABLE = [0];
for (let t = DT; t <= DURATION + 1; t += DT) TAU_TABLE.push(TAU_TABLE[TAU_TABLE.length - 1] + rate(t - DT / 2) * DT);
function tauRaw(t) {
  const i = Math.floor(t / DT), f = t / DT - i;
  const a = TAU_TABLE[Math.max(0, Math.min(TAU_TABLE.length - 1, i))];
  const b = TAU_TABLE[Math.max(0, Math.min(TAU_TABLE.length - 1, i + 1))];
  return a + (b - a) * f;
}
// escapement timing: half-period 0.2 s (18,000 vph = 5 beats/s)
export const HALF = 0.2, WIN = 0.012, WIN_PRE = 0.004;
export const BEAT_SLOWMO_T = 19.6; // real time where the slow-mo beat window is centred
// shift tau so that tau(BEAT_SLOWMO_T) == 0.4*m + (window centre offset) -> an even beat
const winCentre = -WIN_PRE + WIN / 2;
const raw = tauRaw(BEAT_SLOWMO_T);
const m = Math.round((raw - winCentre) / (2 * HALF));
const TAU_OFFSET = (2 * HALF * m + winCentre) - raw + 2 * HALF * 50; // keep positive
export const tau = (t) => tauRaw(t) + TAU_OFFSET;

export const BAL_AMP = 200 * D2R;
export function escapement(tt) {
  const q = (tt + WIN_PRE) / HALF;
  const k = Math.floor(q);
  const u = clamp(((q - k) * HALF) / WIN);
  const sw = smooth(0.25, 1.0, u);
  const sf = smooth(0.0, 0.45, u);
  const beta = 6.8 * D2R;
  const stateAfter = (kk) => (((kk % 2) + 2) % 2 === 0 ? -beta : beta);
  const fork = lerp(stateAfter(k - 1), stateAfter(k), sf);
  const progress = k + sw;
  const balance = BAL_AMP * Math.sin((2 * Math.PI * tt) / (2 * HALF));
  return { k, u, progress, fork, balance };
}
// real times at which a "drop" (tick) happens, within [0, DURATION]
export function tickTimes() {
  const out = [];
  let prevP = escapement(tau(0)).progress;
  for (let t = DT; t <= DURATION; t += DT) {
    const p = escapement(tau(t)).progress;
    if (Math.floor(p - 0.999) !== Math.floor(prevP - 0.999)) out.push({ t, r: rate(t) });
    prevP = p;
  }
  return out;
}

// ---------- assembly animation ----------
export function parts(t) {
  // crystal + bezel
  const cOff = easeIn3(3.0, 4.1, t) * (1 - smoother(28.9, 30.1, t)) + (t > 28.9 ? (1 - easeOut3(28.9, 30.1, t)) * (t < 30.1 ? 1 : 0) : 0);
  let crystal = t < 15 ? easeIn3(3.0, 4.1, t) : 1 - easeOut3(28.9, 30.1, t);
  // dial + hands
  let dial = t < 15 ? easeIn3(3.9, 5.2, t) : 1 - easeOut3(27.9, 29.2, t);
  // bridges: lift then fly
  let bLift, bFly;
  if (t < 15) { bLift = smoother(5.3, 5.9, t); bFly = easeIn3(5.8, 6.9, t); }
  else { bFly = 1 - easeOut3(25.9, 27.0, t); bLift = 1 - smoother(26.9, 27.6, t); }
  return { crystal, dial, bLift, bFly };
}

// energy highlight per part (0..1)
export function energy(t) {
  const pulse = (a, b, c, d) => smooth(a, b, t) * (1 - smooth(c, d, t));
  return {
    barrel: pulse(6.6, 7.4, 9.6, 10.4),
    center: pulse(9.2, 9.6, 10.4, 10.9),
    third: pulse(9.8, 10.2, 11.0, 11.5),
    fourth: pulse(10.4, 10.8, 12.0, 12.6),
    escape: pulse(11.6, 12.1, 13.4, 14.2),
  };
}

// seconds hand: ticks like a real 5-beat watch, then corrected while hidden so the loop is seamless
export function secondsHand(t) {
  const steps = Math.floor(t * 5) / 5; // 5 jumps/s
  const base = -(2 * Math.PI / 60) * steps;
  const corr = smoother(8, 22, t) * (2 * Math.PI) * (DURATION / 60 - 1) * -1;
  return base - corr + 0.9; // + start offset
}

// ---------- camera ----------
const P = L.P, BAL = L.BAL;
const entry = esc2world(-1.1, 1.905), exitS = esc2world(1.1, 1.905);
export const POINTS = { entry, exitS };
const mid = [(entry[0] + exitS[0]) / 2, (entry[1] + exitS[1]) / 2];
const upEsc = [ESC.ey[0], ESC.ey[1], 0];
// slow-mo camera looks along the pallet line, from the escape wheel side
const sUp = (() => { const d = [exitS[0] - entry[0], exitS[1] - entry[1]]; const n = Math.hypot(...d); return [d[0] / n, d[1] / n, 0]; })();
const hsT = esc2world(-1.5, ESC.D + ESC.Lb - 0.9); // a point on the hairspring
export const HAIR_TARGET = hsT;
const escMid = esc2world(0, 1.75);

// keys: t, pos, tgt, up, fov, ap (aperture), hold (zero velocity)
export const CAM_KEYS = [
  { t: 0.0, pos: [27, -38, 112], tgt: [0, -1.5, -0.5], up: [0.04, 1, 0], fov: 30, ap: 0.5 },
  { t: 2.7, pos: [24, -21, 84], tgt: [0, -1.2, -0.5], up: [-0.02, 1, 0], fov: 30, ap: 0.6 },
  { t: 4.1, pos: [5, -8, 64], tgt: [0, -1, -0.5], up: [0, 1, 0], fov: 30, ap: 0.6 },
  { t: 5.5, pos: [0, -9, 47], tgt: [0, -1, -2], up: [0, 1, 0], fov: 30, ap: 0.7 },
  { t: 6.9, pos: [-5, -14, 33], tgt: [-1, -0.5, -2], up: [0, 1, 0], fov: 30, ap: 0.9 },
  { t: 8.8, pos: [-12.5, -4.5, 13], tgt: [-4.1, 3.6, -2.3], up: [0.15, 1, 0], fov: 30, ap: 1.6 },
  { t: 10.3, pos: [-3.5, -11, 13], tgt: [1.4, -2.4, -1.8], up: [0, 1, 0], fov: 30, ap: 1.4 },
  { t: 12.0, pos: [-6, -15.5, 11], tgt: [0.6, -6.6, -1.3], up: [0.2, 1, 0], fov: 30, ap: 1.6 },
  { t: 13.9, pos: [BAL[0] - upEsc[0] * 13 - 1, BAL[1] - upEsc[1] * 13 - 1, 15], tgt: [(L.E[0] + BAL[0]) / 2, (L.E[1] + BAL[1]) / 2, -0.8], up: upEsc, fov: 30, ap: 1.5 },
  { t: 15.8, pos: [mid[0] - upEsc[0] * 7.5, mid[1] - upEsc[1] * 7.5, 8.5], tgt: [mid[0] + upEsc[0] * 1.2, mid[1] + upEsc[1] * 1.2, -0.9], up: upEsc, fov: 30, ap: 2.2 },
  { t: 17.6, pos: [escMid[0] - upEsc[0] * 1.7, escMid[1] - upEsc[1] * 1.7, 10.4], tgt: [escMid[0], escMid[1], -1.0], up: upEsc, fov: 30, ap: 1.6 },
  { t: 21.4, pos: [escMid[0] - upEsc[0] * 1.4, escMid[1] - upEsc[1] * 1.4, 9.4], tgt: [escMid[0], escMid[1], -1.0], up: upEsc, fov: 30, ap: 1.6 },
  { t: 23.6, pos: [hsT[0] - upEsc[0] * 2.2, hsT[1] - upEsc[1] * 2.2, 11.5], tgt: [hsT[0], hsT[1], 0.1], up: upEsc, fov: 30, ap: 1.8 },
  { t: 25.6, pos: [hsT[0] - upEsc[0] * 1.8, hsT[1] - upEsc[1] * 1.8, 10.2], tgt: [hsT[0] + 0.1, hsT[1] + 0.1, 0.1], up: upEsc, fov: 30, ap: 1.8 },
  { t: 27.1, pos: [3, -12, 24], tgt: [1.5, -2.5, -1.2], up: [0.1, 1, 0], fov: 30, ap: 1.0 },
  { t: 29.0, pos: [6, -32, 90], tgt: [0, -1.4, -0.5], up: [0.06, 1, 0], fov: 30, ap: 0.5 },
  { t: DURATION, pos: [27, -38, 112], tgt: [0, -1.5, -0.5], up: [0.04, 1, 0], fov: 30, ap: 0.5 },
];

function hermite(keys, field, t) {
  let i = 0;
  while (i < keys.length - 2 && t > keys[i + 1].t) i++;
  const k0 = keys[i], k1 = keys[i + 1];
  const vel = (j) => {
    const k = keys[j];
    if (k.hold) return null;
    const n = keys.length;
    if (j === 0 || j === n - 1) { // loop seam: neighbours wrap around
      const a = { ...keys[n - 2], t: keys[n - 2].t - DURATION }, b = keys[1];
      return j === 0 ? { a, b } : { a: keys[n - 2], b: { ...keys[1], t: keys[1].t + DURATION } };
    }
    const a = keys[j - 1], b = keys[j + 1];
    return { a, b };
  };
  const dt = k1.t - k0.t;
  const u = clamp((t - k0.t) / dt);
  const h00 = 2 * u ** 3 - 3 * u ** 2 + 1, h10 = u ** 3 - 2 * u ** 2 + u, h01 = -2 * u ** 3 + 3 * u ** 2, h11 = u ** 3 - u ** 2;
  const get = (k) => (Array.isArray(k[field]) ? k[field] : [k[field]]);
  const p0 = get(k0), p1 = get(k1);
  const v = (j) => {
    const vv = vel(j);
    if (!vv) return p0.map(() => 0);
    const pa = get(vv.a), pb = get(vv.b);
    return pa.map((_, c) => (pb[c] - pa[c]) / (vv.b.t - vv.a.t));
  };
  const v0 = v(i), v1 = v(i + 1);
  const out = p0.map((_, c) => h00 * p0[c] + h10 * dt * v0[c] + h01 * p1[c] + h11 * dt * v1[c]);
  return Array.isArray(k0[field]) ? out : out[0];
}
export function camera(t) {
  return {
    pos: hermite(CAM_KEYS, 'pos', t),
    tgt: hermite(CAM_KEYS, 'tgt', t),
    up: hermite(CAM_KEYS, 'up', t),
    fov: hermite(CAM_KEYS, 'fov', t),
    ap: hermite(CAM_KEYS, 'ap', t),
  };
}

// motion-blur subframes per output frame (shutter 180°)
export function subframes(t) {
  const inR = (a, b) => t >= a && t <= b;
  if (inR(2.9, 7.1) || inR(13.2, 16.6) || inR(23.6, 30.4)) return 3;
  return 1;
}
// camera shake impulses
const SHAKES = [[20.38, 0.05], [5.05, 0.25], [27.6, 0.12]];
export function shake(t) {
  const o = [0, 0, 0];
  for (const [t0, a] of SHAKES) {
    if (t < t0 || t > t0 + 0.6) continue;
    const u = t - t0, e = a * Math.exp(-u / 0.12);
    o[0] += e * Math.sin(u * 71); o[1] += e * Math.cos(u * 89); o[2] += e * 0.5 * Math.sin(u * 53);
  }
  return o;
}
