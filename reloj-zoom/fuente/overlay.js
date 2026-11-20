import * as TL from './timeline.js';
const { W, H } = TL;
const OS = +(new URLSearchParams(location.search).get('s') || 1);
const cv = document.createElement('canvas'); cv.width = W * OS; cv.height = H * OS; document.body.appendChild(cv);
const g = cv.getContext('2d');
const GOLD = '#FFC94A';
let capBottom = 0;

const TEXT = {
  en: {
    caps: [
      [0.0, 2.45, 'This watch has no *battery.*', { noIn: true }],
      [2.55, 4.3, 'So how does it *keep ticking?*'],
      [6.9, 9.75, 'Winding it loads a *spring.*'],
      [9.85, 12.35, 'The energy flows through the *gears…*'],
      [12.45, 14.15, '…and it would *unwind in seconds.*'],
      [14.25, 16.6, 'Unless *THIS* stops it. *5 times per second.*'],
      [17.0, 18.75, 'A tooth gets *locked* on a ruby…'],
      [18.85, 20.15, '…the balance *kicks* it free…'],
      [20.25, 22.6, '…and it moves *ONE tooth.* Tick.'],
      [23.0, 25.7, 'This spring is *thinner than a hair.* It sets the rhythm.'],
      [26.0, 28.6, '*{COUNT}* ticks a day.', { counter: true }],
      [28.75, TL.DURATION + 1, 'And yet…', { noOut: true }],
    ],
    labels: [
      [7.0, 9.8, 'barrel', 'MAINSPRING', 'stores the energy', [-1, -1]],
      [10.6, 12.4, 'fourth', '1 TURN = 1 MINUTE', 'drives the seconds hand', [1, 1]],
      [14.0, 16.5, 'escape', 'ESCAPEMENT', 'the brake', [1, 1]],
      [14.4, 16.5, 'balance', 'BALANCE WHEEL', 'the heartbeat', [-1, -1]],
      [17.3, 18.9, 'stoneEntry', 'RUBY', 'synthetic, nearly frictionless', [1, -1]],
      [17.5, 18.9, 'stoneExit', 'RUBY', '', [-1, -1]],
      [23.1, 25.8, 'hsLabel', 'HAIRSPRING', '≈ 0.03 mm', [1, -1]],
      [23.4, 25.8, 'hair', 'HUMAN HAIR', '≈ 0.07 mm', [-1, 1]],
    ],
    slow: 'SLOW MOTION', real: 'REAL SPEED', sep: ',',
  },
  es: {
    caps: [
      [0.0, 2.45, 'Este reloj no tiene *pila.*', { noIn: true }],
      [2.55, 4.3, '¿Entonces cómo sigue *haciendo tic-tac?*'],
      [6.9, 9.75, 'Al darle cuerda, cargas un *muelle.*'],
      [9.85, 12.35, 'La energía fluye por los *engranajes…*'],
      [12.45, 14.15, '…y se *descargaría en segundos.*'],
      [14.25, 16.6, 'Salvo que *ESTO* la frene. *5 veces por segundo.*'],
      [17.0, 18.75, 'Un diente se *bloquea* en un rubí…'],
      [18.85, 20.15, '…el volante lo *suelta* de golpe…'],
      [20.25, 22.6, '…y avanza *UN diente.* Tic.'],
      [23.0, 25.7, 'Este muelle es *más fino que un pelo.* Marca el ritmo.'],
      [26.0, 28.6, '*{COUNT}* tics al día.', { counter: true }],
      [28.75, TL.DURATION + 1, 'Y aun así…', { noOut: true }],
    ],
    labels: [
      [7.0, 9.8, 'barrel', 'MUELLE REAL', 'guarda la energía', [-1, -1]],
      [10.6, 12.4, 'fourth', '1 VUELTA = 1 MINUTO', 'mueve el segundero', [1, 1]],
      [14.0, 16.5, 'escape', 'ESCAPE', 'el freno', [1, 1]],
      [14.4, 16.5, 'balance', 'VOLANTE', 'el corazón', [-1, -1]],
      [17.3, 18.9, 'stoneEntry', 'RUBÍ', 'sintético, casi sin fricción', [1, -1]],
      [17.5, 18.9, 'stoneExit', 'RUBÍ', '', [-1, -1]],
      [23.1, 25.8, 'hsLabel', 'ESPIRAL', '≈ 0,03 mm', [1, -1]],
      [23.4, 25.8, 'hair', 'PELO HUMANO', '≈ 0,07 mm', [-1, 1]],
    ],
    slow: 'CÁMARA LENTA', real: 'VELOCIDAD REAL', sep: '.',
  },
};

const easeOutBack = (u) => { const c1 = 1.7, c3 = c1 + 1; return 1 + c3 * Math.pow(u - 1, 3) + c1 * Math.pow(u - 1, 2); };

function richLines(text, font, maxW) {
  // tokens with highlight flag (*...*)
  const toks = []; let hi = false;
  for (const part of text.split('*')) { for (const w of part.split(' ').filter(Boolean)) toks.push({ w, hi }); hi = !hi; }
  g.font = font;
  const lines = [[]]; let lw = 0;
  for (const t of toks) {
    const ww = g.measureText(t.w + ' ').width;
    if (lw + ww > maxW && lines[lines.length - 1].length) { lines.push([]); lw = 0; }
    lines[lines.length - 1].push(t); lw += ww;
  }
  return lines;
}

function caption(t, cue, lang) {
  const [a, b, raw, o = {}] = cue;
  if (t < a || t > b) return;
  let text = raw;
  if (o.counter) {
    const n = Math.round(432000 * TL.smoother(a + 0.1, a + 1.5, t));
    text = raw.replace('{COUNT}', n.toLocaleString('en-US').replace(/,/g, TEXT[lang].sep));
  }
  const inU = o.noIn ? 1 : TL.clamp((t - a) / 0.22);
  const outU = o.noOut ? 1 : TL.clamp((b - t) / 0.18);
  const sc = 0.82 + 0.18 * easeOutBack(inU);
  const alpha = Math.min(TL.smooth(0, 1, inU), outU);
  const big = o.counter ? 1.25 : 1;
  const fs = Math.round(76 * big);
  const font = `900 ${fs}px Inter`;
  const lines = richLines(text, font, 900);
  const lh = fs * 1.16;
  const cy = H * 0.235;
  g.save(); g.globalAlpha = alpha; g.translate(W / 2, cy); g.scale(sc, sc);
  g.font = font; g.textBaseline = 'middle';
  const y0 = -((lines.length - 1) * lh) / 2;
  capBottom = Math.max(capBottom, cy + (y0 + (lines.length - 1) * lh + fs * 0.62) * sc);
  lines.forEach((ln, i) => {
    const total = ln.reduce((s, tk) => s + g.measureText(tk.w + ' ').width, 0) - g.measureText(' ').width;
    let x = -total / 2;
    for (const tk of ln) {
      const s = tk.w; const ww = g.measureText(s + ' ').width;
      g.lineJoin = 'round'; g.lineWidth = 14; g.strokeStyle = 'rgba(0,0,0,0.85)';
      g.shadowColor = 'rgba(0,0,0,0.6)'; g.shadowBlur = 24;
      g.strokeText(s, x, y0 + i * lh);
      g.shadowBlur = 0;
      g.fillStyle = tk.hi ? GOLD : '#FFFFFF';
      g.fillText(s, x, y0 + i * lh);
      x += ww;
    }
  });
  g.restore();
}

function label(t, L, anchors, lang) {
  const [a, b, key, title, sub, dir] = L;
  if (t < a || t > b || !anchors[key]) return;
  const [ax, ay, vis] = anchors[key];
  if (!vis) return;
  const u = TL.clamp((t - a) / 0.35), out = TL.clamp((b - t) / 0.2);
  const alpha = Math.min(1, out);
  const len = 170, dx = dir[0] * len * 0.75, dy = dir[1] * len;
  const ex = ax + dx * TL.smooth(0, 1, u), ey = ay + dy * TL.smooth(0, 1, u);
  g.save(); g.globalAlpha = alpha;
  // pulse ring
  const pr = 14 + 20 * ((t * 1.4) % 1);
  g.strokeStyle = `rgba(255,201,74,${0.8 * (1 - ((t * 1.4) % 1))})`; g.lineWidth = 3;
  g.beginPath(); g.arc(ax, ay, pr, 0, Math.PI * 2); g.stroke();
  g.fillStyle = GOLD; g.beginPath(); g.arc(ax, ay, 12, 0, Math.PI * 2); g.fill();
  g.strokeStyle = 'rgba(255,255,255,0.95)'; g.lineWidth = 5; g.shadowColor = 'rgba(0,0,0,0.7)'; g.shadowBlur = 8;
  g.beginPath(); g.moveTo(ax, ay); g.lineTo(ex, ey); g.stroke();
  const tu = TL.smooth(0.5, 1, u);
  if (tu > 0) {
    g.globalAlpha = alpha * tu;
    g.font = '800 46px Inter'; const tw = g.measureText(title).width;
    g.font = '600 30px Inter'; const sw = sub ? g.measureText(sub).width : 0;
    const bw = Math.max(tw, sw) + 44, bh = sub ? 108 : 70;
    let bx = dir[0] > 0 ? ex : ex - bw; let by = dir[1] > 0 ? ey : ey - bh;
    bx = Math.max(30, Math.min(W - 30 - bw, bx)); by = Math.max(Math.max(520, capBottom + 28), Math.min(H * 0.74 - bh, by));
    g.shadowBlur = 20; g.fillStyle = 'rgba(8,10,14,0.72)';
    g.beginPath(); g.roundRect(bx, by, bw, bh, 16); g.fill();
    g.shadowBlur = 0; g.strokeStyle = 'rgba(255,201,74,0.9)'; g.lineWidth = 2.5; g.stroke();
    g.fillStyle = '#fff'; g.textBaseline = 'top'; g.font = '800 46px Inter'; g.fillText(title, bx + 22, by + 12);
    if (sub) { g.fillStyle = 'rgba(255,255,255,0.75)'; g.font = '600 30px Inter'; g.fillText(sub, bx + 22, by + 64); }
  }
  g.restore();
}

function speedBadge(t, lang) {
  const r = TL.rate(t);
  let txt, show;
  if (t > 13.9 && t < 15.8) { txt = TEXT[lang].real + '  1×'; show = TL.smooth(13.9, 14.2, t) * (1 - TL.smooth(15.6, 15.8, t)); }
  else if (r < 0.9 && t > 15.6 && t < 25) { txt = `${TEXT[lang].slow}  1/${Math.max(2, Math.round(1 / r))}×`; show = TL.smooth(15.8, 16.1, t) * (1 - TL.smooth(24.2, 24.6, t)) * TL.smooth(1.6, 2.6, 1 / r); }
  else return;
  g.save(); g.globalAlpha = show;
  g.font = '800 38px Inter'; const tw = g.measureText(txt).width;
  const bw = tw + 90, bh = 66, bx = (W - bw) / 2, by = H * 0.105;
  g.fillStyle = 'rgba(8,10,14,0.7)'; g.beginPath(); g.roundRect(bx, by, bw, bh, 33); g.fill();
  const blink = (Math.floor(t * 2) % 2 === 0) ? 1 : 0.35;
  g.fillStyle = r < 0.9 ? `rgba(255,60,60,${blink})` : `rgba(80,220,120,${blink})`;
  g.beginPath(); g.arc(bx + 38, by + bh / 2, 11, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#fff'; g.textBaseline = 'middle'; g.fillText(txt, bx + 62, by + bh / 2 + 2);
  g.restore();
}

window.drawOverlay = (t, anchors, lang) => {
  g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, cv.width, cv.height); g.setTransform(OS, 0, 0, OS, 0, 0);
  capBottom = 0;
  for (const c of TEXT[lang].caps) caption(t, c, lang);
  for (const L of TEXT[lang].labels) label(t, L, anchors, lang);
  speedBadge(t, lang);
  return cv.toDataURL('image/png');
};
window.__ready = true;
