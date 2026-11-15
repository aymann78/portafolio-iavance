import {roundRect} from '../core/studio';
import {SANS, MONO} from '../core/fonts';

const font = (w: number, px: number, fam = SANS) => `${w} ${px}px ${fam}`;

/* ---------- iconos ---------- */
export const wifiIcon = (ctx: CanvasRenderingContext2D, x: number, y: number, s: number, bars: number, color: string, dim = 'rgba(255,255,255,.22)') => {
  ctx.save();
  ctx.lineCap = 'round';
  for (let i = 0; i < 3; i++) {
    ctx.strokeStyle = i < bars ? color : dim;
    ctx.lineWidth = s * 0.13;
    ctx.beginPath();
    const r = s * (0.25 + i * 0.3);
    ctx.arc(x, y, r, -Math.PI * 0.75, -Math.PI * 0.25);
    ctx.stroke();
  }
  ctx.fillStyle = bars > 0 ? color : dim;
  ctx.beginPath();
  ctx.arc(x, y, s * 0.09, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
};

export const lockIcon = (ctx: CanvasRenderingContext2D, x: number, y: number, s: number, color: string) => {
  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = s * 0.14;
  ctx.beginPath();
  ctx.arc(x, y - s * 0.12, s * 0.24, Math.PI, 0);
  ctx.stroke();
  roundRect(ctx, x - s * 0.36, y - s * 0.1, s * 0.72, s * 0.56, s * 0.1);
  ctx.fill();
  ctx.restore();
};

const check = (ctx: CanvasRenderingContext2D, x: number, y: number, s: number, color: string, k = 1) => {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = s * 0.16;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  const a = [x - s * 0.35, y];
  const b = [x - s * 0.1, y + s * 0.25];
  const c = [x + s * 0.38, y - s * 0.28];
  ctx.moveTo(a[0], a[1]);
  if (k < 0.4) {
    const t = k / 0.4;
    ctx.lineTo(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t);
  } else {
    ctx.lineTo(b[0], b[1]);
    const t = Math.min(1, (k - 0.4) / 0.6);
    ctx.lineTo(b[0] + (c[0] - b[0]) * t, b[1] + (c[1] - b[1]) * t);
  }
  ctx.stroke();
  ctx.restore();
};

/* ---------- pantalla de móvil: base ---------- */
const phoneBase = (ctx: CanvasRenderingContext2D, w: number, h: number, light = false) => {
  roundRect(ctx, 0, 0, w, h, 78);
  ctx.save();
  ctx.clip();
  const g = ctx.createLinearGradient(0, 0, 0, h);
  if (light) {
    g.addColorStop(0, '#f4f6fb');
    g.addColorStop(1, '#e6e9f2');
  } else {
    g.addColorStop(0, '#0d1220');
    g.addColorStop(1, '#070a12');
  }
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  // barra de estado
  ctx.fillStyle = light ? '#0b0f19' : '#fff';
  ctx.font = font(700, 34);
  ctx.textBaseline = 'middle';
  ctx.fillText('9:41', 70, 62);
  wifiIcon(ctx, w - 170, 76, 40, 3, light ? '#0b0f19' : '#fff');
  roundRect(ctx, w - 128, 48, 58, 28, 8);
  ctx.strokeStyle = light ? '#0b0f19' : '#fff';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillRect(w - 123, 53, 40, 18);
};

export type NetRow = {name: string; bars: number; lock: boolean; appear: number; state?: 'none' | 'connecting' | 'connected'; danger?: number};

/** Ajustes > Wi-Fi */
export const drawWifiSettings = (ctx: CanvasRenderingContext2D, w: number, h: number, o: {rows: NetRow[]; scanning: number; t: number}) => {
  phoneBase(ctx, w, h);
  ctx.fillStyle = '#fff';
  ctx.font = font(900, 68);
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('Wi‑Fi', 52, 220);

  // tarjeta toggle
  roundRect(ctx, 36, 262, w - 72, 104, 30);
  ctx.fillStyle = 'rgba(255,255,255,.07)';
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = font(600, 38);
  ctx.textBaseline = 'middle';
  ctx.fillText('Wi‑Fi', 72, 314);
  roundRect(ctx, w - 172, 288, 104, 56, 28);
  ctx.fillStyle = '#34c759';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(w - 96, 316, 24, 0, Math.PI * 2);
  ctx.fillStyle = '#fff';
  ctx.fill();

  // cabecera redes + spinner
  ctx.fillStyle = 'rgba(255,255,255,.5)';
  ctx.font = font(700, 28);
  ctx.fillText('REDES DISPONIBLES', 60, 430);
  if (o.scanning > 0) {
    ctx.save();
    ctx.globalAlpha = o.scanning;
    ctx.translate(w - 80, 430);
    for (let i = 0; i < 8; i++) {
      ctx.rotate(Math.PI / 4);
      ctx.fillStyle = `rgba(255,255,255,${((i + Math.floor(o.t * 12)) % 8) / 8})`;
      roundRect(ctx, -3, 8, 6, 14, 3);
      ctx.fill();
    }
    ctx.restore();
  }

  // lista
  const visible = o.rows.filter((r) => r.appear > 0.001);
  const rowH = 118;
  const top = 466;
  roundRect(ctx, 36, top, w - 72, Math.max(1, visible.length) * rowH, 30);
  ctx.fillStyle = 'rgba(255,255,255,.07)';
  if (visible.length) ctx.fill();
  visible.forEach((r, i) => {
    const y = top + i * rowH;
    ctx.save();
    ctx.globalAlpha = r.appear;
    ctx.translate((1 - r.appear) * 40, 0);
    if (r.danger && r.danger > 0) {
      roundRect(ctx, 40, y + 4, w - 80, rowH - 8, 26);
      ctx.fillStyle = `rgba(255,59,75,${0.22 * r.danger})`;
      ctx.fill();
      ctx.strokeStyle = `rgba(255,80,95,${0.9 * r.danger})`;
      ctx.lineWidth = 4;
      ctx.stroke();
    }
    if (r.state === 'connected') check(ctx, 80, y + rowH / 2, 40, '#0a84ff');
    if (r.state === 'connecting') {
      ctx.strokeStyle = '#0a84ff';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(80, y + rowH / 2, 16, o.t * 8, o.t * 8 + 4.5);
      ctx.stroke();
    }
    ctx.fillStyle = '#fff';
    ctx.font = font(600, 38);
    ctx.textBaseline = 'middle';
    ctx.fillText(r.name, 124, y + rowH / 2);
    if (r.lock) lockIcon(ctx, w - 170, y + rowH / 2, 34, 'rgba(255,255,255,.75)');
    wifiIcon(ctx, w - 100, y + rowH / 2 + 14, 44, r.bars, '#fff');
    if (i < visible.length - 1) {
      ctx.fillStyle = 'rgba(255,255,255,.1)';
      ctx.fillRect(124, y + rowH - 1, w - 160, 2);
    }
    ctx.restore();
  });
  ctx.restore();
};

/** Portal cautivo de login (real o falso). */
export const drawLoginPortal = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  o: {url: string; secure: boolean; typed: number; urlFlag: number; t: number},
) => {
  phoneBase(ctx, w, h, true);
  // barra de URL
  const uy = 112;
  roundRect(ctx, 30, uy, w - 60, 84, 26);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  if (o.urlFlag > 0) {
    ctx.strokeStyle = o.secure ? `rgba(22,163,74,${o.urlFlag})` : `rgba(239,68,68,${o.urlFlag})`;
    ctx.lineWidth = 6;
    ctx.stroke();
  }
  if (o.secure) lockIcon(ctx, 74, uy + 42, 30, '#16a34a');
  else {
    ctx.fillStyle = '#ef4444';
    ctx.font = font(900, 34);
    ctx.textBaseline = 'middle';
    ctx.fillText('⚠', 56, uy + 44);
  }
  ctx.fillStyle = '#0b0f19';
  ctx.font = font(600, 27, MONO);
  ctx.textBaseline = 'middle';
  ctx.fillText(o.url, 104, uy + 44);

  // cabecera de marca genérica
  const cy = 300;
  const g = ctx.createLinearGradient(0, cy, w, cy + 200);
  g.addColorStop(0, '#2563eb');
  g.addColorStop(1, '#7c3aed');
  roundRect(ctx, 30, cy, w - 60, 230, 36);
  ctx.fillStyle = g;
  ctx.fill();
  wifiIcon(ctx, w / 2, cy + 130, 90, 3, '#fff', 'rgba(255,255,255,.4)');
  ctx.fillStyle = '#fff';
  ctx.font = font(800, 34);
  ctx.textAlign = 'center';
  ctx.fillText('WiFi Aeropuerto', w / 2, cy + 190);

  ctx.fillStyle = '#0b0f19';
  ctx.font = font(900, 46);
  ctx.fillText('Inicia sesión', w / 2, 610);
  ctx.fillStyle = '#6b7280';
  ctx.font = font(600, 28);
  ctx.fillText('para usar el WiFi gratis', w / 2, 660);
  ctx.textAlign = 'left';

  const field = (y: number, label: string, value: string) => {
    ctx.fillStyle = '#6b7280';
    ctx.font = font(700, 24);
    ctx.fillText(label, 52, y - 22);
    roundRect(ctx, 40, y, w - 80, 96, 22);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = '#0b0f19';
    ctx.font = font(600, 32);
    ctx.fillText(value, 66, y + 50);
  };
  field(760, 'CORREO', 'maria.g@correo.com'.slice(0, Math.max(0, Math.min(18, Math.floor(o.typed * 30)))));
  const dots = Math.max(0, Math.min(10, Math.floor((o.typed - 0.6) * 25)));
  field(920, 'CONTRASEÑA', '●'.repeat(dots) + (dots < 10 && o.typed > 0.6 && Math.floor(o.t * 3) % 2 ? '|' : ''));

  roundRect(ctx, 40, 1070, w - 80, 104, 28);
  ctx.fillStyle = '#0b0f19';
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = font(800, 36);
  ctx.textAlign = 'center';
  ctx.fillText('Conectar', w / 2, 1124);
  ctx.textAlign = 'left';
  ctx.restore();
};

/* ---------- terminal del atacante ---------- */
export const TERMINAL_LINES: {txt: string; c: string}[] = [
  {txt: '$ evil-ap --ssid "Aeropuerto_Free"', c: '#e5e7eb'},
  {txt: '[*] Punto de acceso falso activo', c: '#facc15'},
  {txt: '[*] Esperando dispositivos...', c: '#9ca3af'},
  {txt: '[+] Conectado: iPhone  a4:c3:f0:7e', c: '#4ade80'},
  {txt: '[>] DNS   banco.ejemplo.es', c: '#93c5fd'},
  {txt: '[>] DNS   correo.ejemplo.com', c: '#93c5fd'},
  {txt: '[>] HTTP  noticias.ejemplo.net', c: '#93c5fd'},
  {txt: '[>] TLS   tienda.ejemplo.com', c: '#93c5fd'},
  {txt: '[!] POST  /login  usuario=maria', c: '#f87171'},
  {txt: '[>] DNS   red-social.ejemplo', c: '#93c5fd'},
  {txt: '[>] HTTP  fotos.ejemplo.net', c: '#93c5fd'},
];

export const drawTerminal = (ctx: CanvasRenderingContext2D, w: number, h: number, o: {lines: number; t: number}) => {
  ctx.fillStyle = '#05070b';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#111827';
  ctx.fillRect(0, 0, w, 64);
  ['#ef4444', '#f59e0b', '#22c55e'].forEach((c, i) => {
    ctx.beginPath();
    ctx.arc(40 + i * 40, 32, 12, 0, Math.PI * 2);
    ctx.fillStyle = c;
    ctx.fill();
  });
  ctx.fillStyle = '#9ca3af';
  ctx.font = font(500, 26, MONO);
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.fillText('atacante@portatil: ~/captura', w / 2, 32);
  ctx.textAlign = 'left';
  const n = Math.floor(o.lines);
  const max = 13;
  const shown = TERMINAL_LINES.slice(0, Math.min(n, TERMINAL_LINES.length));
  const start = Math.max(0, shown.length - max);
  ctx.font = font(500, 34, MONO);
  shown.slice(start).forEach((l, i) => {
    ctx.fillStyle = l.c;
    ctx.fillText(l.txt, 34, 112 + i * 52);
  });
  if (Math.floor(o.t * 2.5) % 2 === 0) {
    ctx.fillStyle = '#e5e7eb';
    ctx.fillRect(34, 112 + shown.slice(start).length * 52 - 18, 20, 36);
  }
};

export const drawKeyboard = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
  ctx.fillStyle = '#2a2e37';
  ctx.fillRect(0, 0, w, h);
  const rows = 5;
  const cols = 14;
  const kw = w / cols;
  const kh = h / rows;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (r === 4 && c > 3 && c < 10) {
        if (c === 4) {
          roundRect(ctx, c * kw + 4, r * kh + 4, kw * 6 - 8, kh - 8, 8);
          ctx.fillStyle = '#121418';
          ctx.fill();
        }
        continue;
      }
      roundRect(ctx, c * kw + 4, r * kh + 4, kw - 8, kh - 8, 8);
      ctx.fillStyle = '#121418';
      ctx.fill();
    }
  }
};

/* ---------- tarjetas de consejos ---------- */
export type TipIcon = 'vpn' | 'toggle' | 'url';
export const drawTip = (ctx: CanvasRenderingContext2D, w: number, h: number, o: {icon: TipIcon; title: string; sub: string; check: number; t: number}) => {
  roundRect(ctx, 0, 0, w, h, 56);
  ctx.save();
  ctx.clip();
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, 'rgba(30,38,60,.96)');
  g.addColorStop(1, 'rgba(14,18,30,.96)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  // brillo superior
  const sh = ctx.createLinearGradient(0, 0, 0, h * 0.5);
  sh.addColorStop(0, 'rgba(255,255,255,.08)');
  sh.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = sh;
  ctx.fillRect(0, 0, w, h * 0.5);

  // icono
  const ix = 150;
  const iy = h / 2;
  const ig = ctx.createLinearGradient(ix - 90, iy - 90, ix + 90, iy + 90);
  ig.addColorStop(0, '#22c55e');
  ig.addColorStop(1, '#0ea5e9');
  roundRect(ctx, ix - 92, iy - 92, 184, 184, 46);
  ctx.fillStyle = ig;
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#fff';
  if (o.icon === 'vpn') {
    // escudo
    ctx.beginPath();
    ctx.moveTo(ix, iy - 60);
    ctx.lineTo(ix + 50, iy - 40);
    ctx.quadraticCurveTo(ix + 50, iy + 35, ix, iy + 62);
    ctx.quadraticCurveTo(ix - 50, iy + 35, ix - 50, iy - 40);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#0ea5e9';
    ctx.font = font(900, 30);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('VPN', ix, iy + 2);
    ctx.textAlign = 'left';
  } else if (o.icon === 'toggle') {
    roundRect(ctx, ix - 62, iy - 34, 124, 68, 34);
    ctx.fillStyle = 'rgba(255,255,255,.35)';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(ix - 28, iy, 28, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
  } else {
    roundRect(ctx, ix - 70, iy - 30, 140, 60, 30);
    ctx.lineWidth = 9;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(ix + 30, iy + 34, 30, 0, Math.PI * 2);
    ctx.fillStyle = '#16a34a';
    ctx.fill();
    ctx.lineWidth = 9;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(ix + 52, iy + 56);
    ctx.lineTo(ix + 74, iy + 78);
    ctx.stroke();
  }

  ctx.fillStyle = '#fff';
  ctx.font = font(900, 62);
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(o.title, 290, h / 2 - 6);
  ctx.fillStyle = 'rgba(255,255,255,.6)';
  ctx.font = font(600, 36);
  ctx.fillText(o.sub, 292, h / 2 + 52);

  if (o.check > 0) {
    ctx.beginPath();
    ctx.arc(w - 90, h / 2, 46 * Math.min(1, o.check * 1.5), 0, Math.PI * 2);
    ctx.fillStyle = '#22c55e';
    ctx.fill();
    check(ctx, w - 90, h / 2, 50, '#fff', Math.max(0, (o.check - 0.3) / 0.7));
  }
  ctx.restore();
  // borde
  roundRect(ctx, 2, 2, w - 4, h - 4, 54);
  ctx.strokeStyle = 'rgba(255,255,255,.14)';
  ctx.lineWidth = 3;
  ctx.stroke();
};

/* ---------- texto cifrado ---------- */
const GLYPHS = 'ABCDEF0123456789#$%&@!?*+=/<>';
export const drawCipherText = (ctx: CanvasRenderingContext2D, w: number, h: number, o: {plain: string; enc: number; t: number}) => {
  ctx.font = font(700, Math.round(h * 0.52), MONO);
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  const chars = o.plain.split('');
  const out = chars
    .map((c, i) => {
      const k = o.enc * (chars.length + 4) - i;
      if (k <= 0) return c;
      const s = Math.floor(o.t * 20 + i * 7);
      return GLYPHS[(s * 31 + i * 17) % GLYPHS.length];
    })
    .join('');
  ctx.shadowColor = o.enc > 0.5 ? 'rgba(52,211,153,.9)' : 'rgba(250,204,21,.9)';
  ctx.shadowBlur = 24;
  ctx.fillStyle = o.enc > 0.5 ? '#6ee7b7' : '#fde68a';
  ctx.fillText(out, w / 2, h / 2);
  ctx.textAlign = 'left';
};
